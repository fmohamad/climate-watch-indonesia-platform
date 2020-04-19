import { createStructuredSelector, createSelector } from 'reselect'
import isArray from 'lodash/isArray'
import castArray from 'lodash/castArray'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import {
  ALL_SELECTED,
  API_TARGET_DATA_SCALE,
  METRIC,
  SECTOR_TOTAL,
} from 'constants'

import {
  DEFAULT_AXES_CONFIG,
  getThemeConfig,
  getYColumnValue,
  getTooltipConfig,
} from 'utils/graphs'

import { getTranslate } from 'selectors/translation-selectors'
import { getMetadata, getIndicatorValues } from './economy-get-selectors'
import {
  getSelectedOptions,
  getFilterOptions,
} from './economy-filter-selectors'

const { COUNTRY_ISO } = process.env

const FRONTEND_FILTERED_FIELDS = ['region', 'sector']

const getUnit = createSelector(
  [getMetadata, getSelectedOptions],
  (metadata, options) => {
    if (!metadata || !metadata.indicators) return null
    const unit = metadata.indicators.find(
      (meta) => meta.code === options.indicators.value
    ).unit

    return unit
  }
)

const outAllSelectedOption = (o) => o.value !== ALL_SELECTED

const getLegendDataOptions = createSelector(
  [getFilterOptions],
  (modelSelected, options) => {
    if (!options || !modelSelected || !options[modelSelected]) return null
    return options[modelSelected].filter(outAllSelectedOption)
  }
)

const getLegendDataSelected = createSelector(
  [getSelectedOptions, getFilterOptions],
  (selectedOptions, options) => {
    if (!selectedOptions || !options) return null

    return [selectedOptions.locations]
  }
)

const getYColumnOptions = createSelector(
  [getLegendDataSelected],
  (legendDataSelected) => {
    if (!legendDataSelected) return null
    const getYOption = (columns) =>
      columns &&
      columns.map((d) => ({
        label: d && d.label,
        value: d && getYColumnValue(`${d.value}`),
        code: d && (d.code || d.label),
      }))
    const value = uniqBy(getYOption(legendDataSelected), 'value')
    return value
  }
)

const calculateValue = (currentValue, value, scale, metricData) => {
  const metricRatio = metricData || 1
  const updatedValue =
    value || value === 0 ? (value * scale) / metricRatio : null
  if (updatedValue && (currentValue || currentValue === 0)) {
    return updatedValue + currentValue
  }
  return updatedValue || currentValue
}

const getDFilterValue = (d, modelSelected) =>
  modelSelected === 'region' ? d.iso_code3 : d[modelSelected]

const isOptionSelected = (selectedOptions, valueOrCode) =>
  castArray(selectedOptions)
    .filter((o) => o)
    .some((o) => o.value === valueOrCode || o.code === valueOrCode)

const filterBySelectedOptions = (
  emissionsData,
  metricSelected,
  selectedOptions,
  filterOptions
) => {
  const fieldPassesFilter = (selectedFilterOption, options, fieldValue) =>
    (isOptionSelected(selectedFilterOption, ALL_SELECTED) &&
      isOptionSelected(options, fieldValue)) ||
    isOptionSelected(selectedFilterOption, fieldValue)
  const absoluteMetric = METRIC.absolute

  const byMetric = (d) => {
    const notTotalWithAbsoluteMetric =
      d.metric === absoluteMetric && d.sector !== SECTOR_TOTAL

    return (
      d.metric === METRIC[metricSelected] &&
      (notTotalWithAbsoluteMetric || d.metric !== absoluteMetric)
    )
  }

  return emissionsData
    .filter(byMetric)
    .filter((d) =>
      FRONTEND_FILTERED_FIELDS.every((field) =>
        fieldPassesFilter(
          selectedOptions[field],
          filterOptions[field],
          getDFilterValue(d, field)
        )
      )
    )
}

const parseValues = createSelector(
  [getIndicatorValues, getSelectedOptions, getYColumnOptions],
  (indicatorsData, selectedOptions, yColumnOptions) => {
    if (isEmpty(indicatorsData)) return null
    if (!selectedOptions || !yColumnOptions) return null

    const { locations, indicators, sectors } = selectedOptions

    const dataFiltered = indicatorsData.values.filter((data) => {
      return (
        data.location_iso_code3 === locations.value &&
        data.indicator_code === indicators.value &&
        data.category === sectors.label
      )
    })

    const dataParsed = []

    if (dataFiltered !== undefined) {
      const yValue = yColumnOptions.find(option => {
        return option.code === locations.value
      }).value

      dataFiltered[0].values.map(data => {
        const item = {}
        item['x'] = data.year
        item[yValue] = data.value

        dataParsed.push(item)
      })
    }


    return dataParsed
  }
)

let colorCache = {};

export const getChartConfig = createSelector(
  [getUnit, getYColumnOptions, getTranslate],
  (unit, yColumnOptions, t) => {
    if (!yColumnOptions) return null

    const tooltip = getTooltipConfig(yColumnOptions)
    const theme = getThemeConfig(yColumnOptions)
    colorCache = { ...theme, ...colorCache }
    const axes = {
      ...DEFAULT_AXES_CONFIG,
      yLeft: { ...DEFAULT_AXES_CONFIG.yLeft, unit },
    }

    const config = {
      axes,
      theme: colorCache,
      tooltip,
      animation: false,
      columns: { x: [{ label: 'year', value: 'x' }], y: yColumnOptions },
    }

    return { ...config }
  }
)

const getChartLoading = createSelector(
  [ getMetadata, getIndicatorValues ],
  (metadata, indicatorValue) =>
    metadata && metadata.loading || indicatorValue && indicatorValue.loading
);

const getDataLoading = createSelector(
  [ getChartLoading],
  (loading, data) =>  false
);

export const getDownloadURI = createSelector([getMetadata], (metadata) => {
  return `emissions/download?location=${COUNTRY_ISO}&source=${metadataSources.join(
    ','
  )}`
})

export const getChartData = createStructuredSelector({
  data: parseValues,
  config: getChartConfig,
  loading: getDataLoading,
  // dataOptions: getLegendDataOptions,
  dataSelected: getLegendDataSelected,
})
