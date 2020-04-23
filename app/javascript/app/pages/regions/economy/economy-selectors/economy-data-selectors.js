import { createStructuredSelector, createSelector } from 'reselect'
import castArray from 'lodash/castArray'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import concat from 'lodash/concat'
import flatten from 'lodash/flatten'
import { ALL_SELECTED, METRIC, SECTOR_TOTAL } from 'constants'

import {
  getThemeConfig,
  getYColumnValue,
  getTooltipConfig,
} from 'utils/graphs'

import { getMetadata, getIndicatorValues } from './economy-get-selectors'
import {
  getSelectedOptions,
  getFilterOptions,
} from './economy-filter-selectors'

const getAxes = (xName, unit, yName) => ({
  xBottom: { name: xName, unit, format: 'string' },
  yLeft: { name: yName, unit, format: 'number' },
})

const getUnit = createSelector(
  [getMetadata, getSelectedOptions],
  (metadata, options) => {
    if (!metadata || !metadata.indicators) return null
    const indicator = metadata.indicators.find(
      (meta) => meta.code === options.indicators.value
    )

    if (!indicator) return null

    return {
      name: indicator.name,
      unit: indicator.unit,
    }
  }
)

const outAllSelectedOption = (o) => o.value !== ALL_SELECTED

const getLegendDataOptions = createSelector([getFilterOptions], (options) => {
  if (!options || !options.locations) return null
  return options.locations.filter(outAllSelectedOption)
})

const getLegendDataSelected = createSelector(
  [getSelectedOptions, getFilterOptions],
  (selectedOptions, options) => {
    if (!selectedOptions || isEmpty(selectedOptions) || !options) return null

    const dataSelected = castArray(selectedOptions.locations)

    return dataSelected
  }
)

const getYColumnOptions = createSelector(
  [getLegendDataSelected],
  (legendDataSelected) => {
    if (!legendDataSelected) return null
    const columns = legendDataSelected.map((data) => {
      if (!data) return null

      return {
        label: data && data.label,
        value: getYColumnValue(data && data.value),
        code: data && data.code,
      }
    })

    return columns
  }
)

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

    const location = castArray(locations)
    const { values } = indicatorsData

    const filterByLocations = flatten(
      concat(
        location.map((loc) => filter(values, { location_iso_code3: loc.value }))
      )
    )

    const dataFiltered = filterByLocations.filter((data) => {
      return (
        data.indicator_code === indicators.value &&
        data.category === sectors.label
      )
    })

    if (isEmpty(dataFiltered) || !dataFiltered) return null

    const yearValues = dataFiltered[0].values.map(d => d.year)

    if (!yearValues) return null

    const dataParsed = []

    yearValues.forEach(x => {
      const item = {}
      dataFiltered.forEach(data => {

        const yValue = yColumnOptions.find(column => column.code === data.location_iso_code3).value

        item.x = x
        item[yValue] = data.values.find(d => d.year === x).value

      })
      dataParsed.push(item)
    });

    return dataParsed

  }
)

let colorCache = {}

export const getChartConfig = createSelector(
  [getUnit, getYColumnOptions],
  (ind, yColumnOptions) => {
    if (!yColumnOptions) return null
    if (!ind || !ind.name || !ind.unit) return null

    const tooltip = getTooltipConfig(yColumnOptions)
    const theme = getThemeConfig(yColumnOptions)
    colorCache = { ...theme, ...colorCache }
    const axes = getAxes('year', ind.unit, ind.name)

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
  [getMetadata, getIndicatorValues],
  (metadata, indicatorValue) =>
    (metadata && metadata.loading) || (indicatorValue && indicatorValue.loading)
)

const getDataLoading = createSelector(
  [getChartLoading, parseValues],
  (loading, data) => loading || !data || false
)

export const getDownloadURI = createSelector([getMetadata], (metadata) => {
  return `emissions/download?location=${COUNTRY_ISO}&source=${metadataSources.join(
    ','
  )}`
})

export const getChartData = createStructuredSelector({
  data: parseValues,
  config: getChartConfig,
  loading: getDataLoading,
  dataOptions: getLegendDataOptions,
  dataSelected: getLegendDataSelected,
})
