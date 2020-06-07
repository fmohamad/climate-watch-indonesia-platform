import { createStructuredSelector, createSelector } from 'reselect'
import { getTranslate } from 'selectors/translation-selectors'
import { format } from 'd3-format'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import get from 'lodash/get'
import {
  getAllSelectedOption,
  findOption,
  withAllSelected,
} from 'selectors/filters-selectors'
import { ALL_SELECTED } from 'constants/constants'
import { getProvince } from 'selectors/provinces-selectors'

const getModelOptions = () => [
  {
    name: 'Education',
    value: 'education',
  },
  {
    name: 'Healthcare',
    value: 'healthcare',
  },
]

const getDefaultIndicator = () => [
  {
    label: 'Human Development Index',
    value: 'wp_hdi',
    unit: 'unit',
  },
  {
    label: 'Healthcare Infrastructure',
    value: 'wp_health_infrastructure',
    unit: 'unit',
  },
]

const section = 'wp_social'
const provinceISO = 'ID.PB'
const code = 'code-kabupaten'

const getIndicatorParams = () => ({ section })

const getMetaParams = () => ({ section, code, location: provinceISO })

const getQuery = ({ location }) => location && (location.query || null)

const getIndicator = ({ indicators }) => indicators && indicators.data

const getMetadata = ({ provinceMeta }) => provinceMeta && provinceMeta.data

const getSelectedModel = createSelector(
  [getQuery, getModelOptions],
  (query, options) => {
    if (!query || !query.model) {
      return { name: 'Education', value: 'education' }
    }

    return options.find((opt) => opt.value === query.model)
  }
)

const getIndicatorSocial = createSelector(getIndicator, (indicators) => {
  if (isEmpty(indicators)) return null

  const data = filter(indicators.values, function (data) {
    return (
      data.indicator_code === 'wp_hdi' ||
      data.indicator_code === 'wp_literacy_rate' ||
      data.indicator_code === 'wp_illiterate' ||
      data.indicator_code === 'wp_health_infrastructure' ||
      data.indicator_code === 'wp_drinking_access'
    )
  })

  return data
})

const getIndicatorOptions = createSelector(
  [getSelectedModel, getMetadata],
  (model, metadata) => {
    if (!model || isEmpty(metadata)) return null

    const indicators = metadata.indicators.map((o) => ({
      label: o.name,
      value: o.code,
      unit: o.unit,
    }))

    const edu = ['wp_hdi', 'wp_illiterate', 'wp_literacy_rate']
    const health = ['wp_health_infrastructure', 'wp_drinking_access']
    if (model.value === 'education') {
      return filter(indicators, function (o) {
        return edu.includes(o.value)
      })
    }

    return filter(indicators, function (o) {
      return health.includes(o.value)
    })
  }
)

const getDistrictOptions = createSelector(getMetadata, (metadata) => {
  if (isEmpty(metadata)) return null

  const { locations } = metadata

  return locations.map((val) => ({
    label: val.name,
    value: val.iso_code3,
    code: val.iso_code3,
  }))
})

const getFilterOptions = createStructuredSelector({
  model: getModelOptions,
  indicator: getIndicatorOptions,
  district: getDistrictOptions,
})

// DEFAULTS
const getDefaults = createSelector(
  [
    getSelectedModel,
    getFilterOptions,
    getAllSelectedOption,
    getDefaultIndicator,
  ],
  (model, options, allSelectedOption, defaultIndicator) => ({
    model: get(options, 'model[0]'),
    indicator:
      model.value === 'education' ? defaultIndicator[0] : defaultIndicator[1],
    district: get(options, 'district[0]'),
  })
)

// SELECTED
const getFieldSelected = (field) => (state) => {
  const { query } = state.location
  if (!query || !query[field]) return getDefaults(state)[field]

  const queryValue = String(query[field])
  if (queryValue === ALL_SELECTED) return getAllSelectedOption(state)
  const findSelectedOption = (value) =>
    findOption(getFilterOptions(state)[field], value)

  const options = queryValue
    .split(',')
    .map((v) => findSelectedOption(v))
    .filter((v) => v)

  if (options.length > 1) return options
  return options.length ? options[0] : getDefaults(state)[field]
}

const getSelectedOptions = createStructuredSelector({
  model: getFieldSelected('model'),
  indicator: getFieldSelected('indicator'),
  district: getFieldSelected('district'),
})

const getChartData = createSelector(
  [getSelectedModel, getIndicatorSocial, getSelectedOptions],
  (model, indicators, options) => {
    if (isEmpty(indicators)) return null
    if (!options || !options.indicator || !options.district) return null
    if (!model) return null

    const edu = ['wp_hdi', 'wp_illiterate', 'wp_literacy_rate']
    const health = ['wp_health_infrastructure', 'wp_drinking_access']
    const selectedModel = model.value
    const selectedInd = options.indicator.value
    const selectedDist =
      options.district.value === ALL_SELECTED
        ? provinceISO
        : options.district.value

    let selectedIndicators = []
    if (selectedModel === 'education') {
      selectedIndicators = filter(indicators, function (o) {
        return edu.includes(o.indicator_code)
      })
    } else {
      selectedIndicators = filter(indicators, function (o) {
        return health.includes(o.indicator_code)
      })
    }

    const filteredIndicators = filter(selectedIndicators, function (o) {
      return (
        o.indicator_code === selectedInd &&
        o.location_iso_code3 === selectedDist
      )
    })

    const xAxis = selectedIndicators[0].values.map((val) => val.year)
    const data = []
    xAxis.forEach((x) => {
      const object = {
        x,
        y: filteredIndicators[0].values.find((o) => o.year === x).value,
      }

      data.push(object)
    })

    return data
  }
)

const domain = () => ({ x: ['auto', 'auto'], y: [0, 'auto'] })

const getChartConfig = createSelector(
  [getSelectedOptions, getSelectedModel],
  (options, model) => {
    if (!options) return null
    const { unit } = options.indicator
    const name = options.indicator.label

    const axes = {
      xBottom: {
        name: 'Year',
        unit: 'year',
        format: 'number',
        label: { dx: 0, dy: 0, className: '' },
      },
      yLeft: {
        name,
        unit,
        format: 'number',
        label: { dx: 0, dy: 10, className: '' },
      },
    }

    const tooltip = { y: { label: unit } }
    const columns = {
      x: [{ label: 'year', value: 'x' }],
      y: [{ label: unit, value: 'y' }],
    }

    return {
      axes,
      tooltip,
      animation: false,
      columns,
    }
  }
)

// Y LABEL FORMATS
const getCustomYLabelFormat = (unit) => {
  const formatY = {
    '%': (value) => `${value}`,
    'satuan': (value) => `${value}`,
  }
  return formatY[unit]
}

const config = createSelector(
  [getSelectedOptions, getSelectedModel, getTranslate],
  (options, model, t) => {
    if (!options) return null
    const { unit } = options.indicator
    const name = options.indicator.label

    return {
      axes: {
        xBottom: {
          name: 'Year',
          unit: 'year',
          format: 'string',
          label: { dx: 0, dy: 0, className: '' },
        },
        yLeft: {
          name,
          unit: t(`pages.regions.social.unit.${unit}`),
          format: 'string',
          label: { dx: 0, dy: 10, className: '' },
        },
      },
      tooltip: { y: { label: name } },
      animation: false,
      columns: {
        x: [{ label: 'year', value: 'x' }],
        y: [{ label: unit, value: 'y' }],
      },
      theme: { y: { stroke: '', fill: '#f5b335' } },
      yLabelFormat: getCustomYLabelFormat(unit),
    }
  }
)

const getChart = createStructuredSelector({
  config,
  domain,
})

export const getRegionSocial = createStructuredSelector({
  t: getTranslate,
  query: getQuery,
  indicatorParams: getIndicatorParams,
  metaParams: getMetaParams,
  provinceISO: getProvince,
  selectedModel: getSelectedModel,
  filterOptions: getFilterOptions,
  selectedOptions: getSelectedOptions,
  chartData: getChartData,
  chart: getChart,
})
