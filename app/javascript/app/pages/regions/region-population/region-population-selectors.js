import { createStructuredSelector, createSelector } from 'reselect'
import { getTranslate } from 'selectors/translation-selectors'
import filter from 'lodash/filter'
import get from 'lodash/get'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'

import {
  getAllSelectedOption,
  findOption,
  withAllSelected,
} from 'selectors/filters-selectors'

import { getProvince } from 'selectors/provinces-selectors';

import { ALL_SELECTED } from 'constants/constants'

const section = 'wp_population'
const code = 'code-kabupaten'
const LOCATION = 'ID.PB'

const modelOptions = () => ([
  {
    name: 'Population',
    label: 'Population',
    value: 'population'
  },
  {
    name: 'Age Group Distribution',
    label: 'Age Group Distribution',
    value: 'age_group'
  }
]);

const getQuery = ({ location }) => location && (location.query || null)

const _getIndicator = ({ indicators }) => indicators && indicators.data

const getMetadataData = ({ provinceMeta }) => provinceMeta && provinceMeta.data

const getIndicatorParams = () => ({ section })

const getMetaParams = () => ({ section, code, location: LOCATION })

const getDistrictOptions = createSelector(getMetadataData, (metas) => {
  if (isEmpty(metas)) return null
  const { locations } = metas
  return locations.map((val) => (
    {
      label: val.name,
      value: val.iso_code3,
      code: val.iso_code3,
    }
  ))
})

export const getIndicatorPopulation = createSelector(_getIndicator, (indicators) => {
  if (isEmpty(indicators)) return null
  const filterByInd = filter(indicators.values, function(data) {
    return (
      data.indicator_code === 'wp_pop_total' ||
      data.indicator_code === 'wp_pop_growth' ||
      data.indicator_code === 'wp_pop_density' ||
      data.indicator_code === 'wp_pop_sex_ratio'
    )
  })

  return filterByInd
})

const getIndicatorDistribution = createSelector(
  _getIndicator,
  indicators => {
    if (isEmpty(indicators)) return null

    const filterByInd = filter(indicators.values, function(data) {
      return data.indicator_code === 'wp_pop_age_group'
    })

    return filterByInd
  }
);

const getYearOptions = createSelector(getIndicatorPopulation, (indicators) => {
  if (isEmpty(indicators)) return null
  const { values } = indicators[0]
  return values.map((val) => (
    {
      label: val.year,
      value: val.year,
    }
  ))
})

const getFilterOptions = createStructuredSelector({
  district: withAllSelected(getDistrictOptions),
  year: getYearOptions,
  model: modelOptions
})

// DEFAULTS
const getDefaults = createSelector(
  [getFilterOptions, getAllSelectedOption],
  (options, allSelectedOption) => ({
    district: allSelectedOption,
    year: get(options, 'year[0]'),
    model: get(options, 'model[0]'),
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

export const getSelectedOptions = createStructuredSelector({
  district: getFieldSelected('district'),
  year: getFieldSelected('year'),
  model: getFieldSelected('model'),
})

const getSelectedModel = createSelector(
  getSelectedOptions,
  options => {
    if (!options && !options.model && !options.model.value) return null

    return options.model
  }
);

const getCardData = createSelector(
  [getIndicatorPopulation, getSelectedOptions],
  (data, options) => {
    if (!data) return null
    if (isEmpty(options)) return null
    if (isNil(options.district) || isNil(options.value)) return null

    const year = options.year.value
    const district = options.district.value

    if (district === ALL_SELECTED) {
      const values = filter(data, ['location_iso_code3', LOCATION])
      return values.map(val => (
        {
          ind_code: val.indicator_code,
          iso_code3: val.location_iso_code3,
          value: filter(val.values, ['year', year])[0].value
        }
      ))
    }

    const filterByLoc = filter(data, ['location_iso_code3', district])
    const filterByYear = filterByLoc.map(val => (
      {
        ind_code: val.indicator_code,
        iso_code3: val.location_iso_code3,
        value: filter(val.values, ['year', year])[0].value
      }
    ))

    return filterByYear
  }
)

const getPopTotal = createSelector(
  getCardData,
  data => {
    if (!data) return null
    return filter(data, ['ind_code', 'wp_pop_total'])[0].value
  }
)

const getPopGrowth = createSelector(
  getCardData,
  data => {
    if (!data) return null
    return filter(data, ['ind_code', 'wp_pop_growth'])[0].value
  }
)

const getPopDensity = createSelector(
  getCardData,
  data => {
    if (!data) return null
    return filter(data, ['ind_code', 'wp_pop_density'])[0].value
  }
)

const getPopSexRatio = createSelector(
  getCardData,
  data => {
    if (!data) return null
    return filter(data, ['ind_code', 'wp_pop_sex_ratio'])[0].value
  }
)

const getChartData = createSelector(
  [getIndicatorDistribution, getSelectedOptions],
  (indicators, options) => {
    if (isEmpty(indicators)) return null
    const selectedYear = options.year.value
    const xAxis = indicators.map(data => data.category)
    let yAxis = []
    let data = []
    xAxis.forEach(x => {
      const { values } = filter(indicators, ['category', x])[0]
      let object = {
        x: x,
        y: find(values, ['year', selectedYear]).value
      }
      data.push(object)
    })

    return data
  }
);

const domain = () => (
  { x: ['auto', 'auto'], y: [0, 'auto'] }
);

const config = () => ({
  axes: {
    xBottom: {
      name: 'Age distribution',
      unit: 'umur',
      format: 'string',
      label: { dx: 0, dy: 0, className: '' }
    },
    yLeft: {
      name: 'Number of people',
      unit: 'jiwa',
      format: 'string',
      label: { dx: 0, dy: 10, className: '' }
    }
  },
  tooltip: { 
    y: { label: 'People' },
    indicator: 'Age' 
  },
  animation: false,
  columns: {
    x: [ { label: 'age', value: 'x' } ],
    y: [ { label: 'people', value: 'y' } ]
  },
  theme: { y: { stroke: '', fill: '#f5b335' } }
});

const getChart = createStructuredSelector({
  domain: domain,
  config: config
});

export const getRegionPopulation = createStructuredSelector({
  t: getTranslate,
  popTotal: getPopTotal,
  popGrowth: getPopGrowth,
  popDensity: getPopDensity,
  popSexRatio: getPopSexRatio,
  filterOptions: getFilterOptions,
  selectedOptions: getSelectedOptions,
  selectedModel: getSelectedModel,
  params: getIndicatorParams,
  metaParams: getMetaParams,
  query: getQuery,
  provinceISO: getProvince,
  chartData: getChartData,
  chart: getChart,
})
