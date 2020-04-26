import { createStructuredSelector, createSelector } from 'reselect'
import castArray from 'lodash/castArray'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import concat from 'lodash/concat'
import flatten from 'lodash/flatten'
import { ALL_SELECTED, METRIC, SECTOR_TOTAL } from 'constants'

import { getThemeConfig, getYColumnValue, getTooltipConfig } from 'utils/graphs'

import { getMetadata, getIndicatorValues } from './economy-get-selectors'
import {
  getFieldSelected,
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

const getModelSelected = createSelector(
  getFieldSelected('indicators'),
  (selectedIndicator) => {
    if (!selectedIndicator) return null
    return selectedIndicator.value.split('-')[1]
  }
)

const outAllSelectedOption = (o) => o.value !== ALL_SELECTED

const getLegendDataOptions = createSelector(
  [getFilterOptions, getModelSelected],
  (options, selectedModel) => {
    if (!options || !options.locations || !selectedModel) return null

    if (selectedModel === 'kabupaten') {
      return options.locations.filter(outAllSelectedOption)
    }

    return options.sectors
  }
)

const getLegendDataSelected = createSelector(
  [getSelectedOptions, getFilterOptions, getModelSelected],
  (selectedOptions, options, selectedModel) => {
    if (!selectedOptions || isEmpty(selectedOptions) || !options || !selectedModel) return null

    if (selectedModel === 'kabupaten') {
      return castArray(selectedOptions.locations)
    }

    return castArray(selectedOptions.sectors)
  }
)

const getYColumnOptions = createSelector(
  [getLegendDataSelected, getModelSelected],
  (legendDataSelected, modelSelected) => {
    if (!legendDataSelected) return null
    const columns = legendDataSelected.map((data) => {
      if (!data) return null

      return {
        label: data && data.label,
        value: data && getYColumnValue(`${modelSelected}${data.value}`),
        code: data && data.code,
      }
    })

    return columns
  }
)

const parseChartData = createSelector(
  [getIndicatorValues, getSelectedOptions, getYColumnOptions, getModelSelected],
  (indicatorsData, selectedOptions, yColumnOptions, modelSelected) => {
    if (isEmpty(indicatorsData)) return null
    if (!selectedOptions || !yColumnOptions || !modelSelected) return null

    const { locations, indicators, sectors } = selectedOptions

    const location = castArray(locations)
    const sector = castArray(sectors)

    const { values } = indicatorsData

    let filterByLocations = []
    let dataFiltered = []

    if (modelSelected === 'kabupaten') {
      filterByLocations = flatten(
        concat(
          location.map((loc) => filter(values, { location_iso_code3: loc.value }))
        )
      )
    } else {
      filterByLocations = filter(values, {location_iso_code3: 'ID.PB'})
    }

    const filterByIndicator = filterByLocations.filter(data => data.indicator_code === indicators.value)

    if (isEmpty(dataFiltered) || !dataFiltered) return null

    const yearValues = dataFiltered[0].values.map((d) => d.year)

    if (!yearValues) return null

    const dataParsed = []

    yearValues.forEach((x) => {
      const item = {}
      dataFiltered.forEach((data) => {
        const yValue = yColumnOptions.find(
          (column) => column.code === data.location_iso_code3
        ).value

        item.x = x
        item[yValue] = data.values.find((d) => d.year === x).value
      })
      dataParsed.push(item)
    })

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
  [getChartLoading, parseChartData],
  (loading, data) => loading || !data || false
)

export const getDownloadURI = createSelector([getMetadata], (metadata) => {
  return `emissions/download?location=${COUNTRY_ISO}&source=${metadataSources.join(
    ','
  )}`
})

export const getChartData = createStructuredSelector({
  data: parseChartData,
  config: getChartConfig,
  loading: getDataLoading,
  dataOptions: getLegendDataOptions,
  dataSelected: getLegendDataSelected,
})
