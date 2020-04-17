import { createStructuredSelector, createSelector } from 'reselect'
import { ALL_SELECTED, SECTOR_TOTAL } from 'constants'

import { getTranslate } from 'selectors/translation-selectors'
import {
  getAllSelectedOption,
  getFieldQuery,
  findOption,
  withAllSelected,
} from 'selectors/filters-selectors'

import { getMetadata } from './economy-get-selectors'

// OPTIONS
const CHART_TYPE_OPTIONS = [
  { label: 'percent', value: 'percent' },
  { label: 'line', value: 'line' },
]

const DEFAULTS = {
  indicator: 'grdp_capita',
  chartType: 'line',
}

const getFieldOptions = (field) =>
  createSelector(getMetadata, (metadata) => {
    if (!metadata || !metadata[field]) return null

    const transformToOption = (o) => ({
      label: o.name,
      value: String(o.id),
      code: o.iso_code3 || o.code || o.label
    })

    const options = metadata[field]

    return options.filter((o) => o).map(transformToOption)
  })

// SELECTED
const getFieldSelected = (field) =>
  createSelector(
    [getFieldQuery(field), getDefaults, getFilterOptions, getAllSelectedOption],
    (queryValue, defaults, options, allSelectedOption) => {
      if (!queryValue) return defaults[field]
      if (queryValue === ALL_SELECTED) return allSelectedOption
      const findSelectedOption = (value) => findOption(options[field], value)
      return queryValue.includes(',')
        ? queryValue.split(',').map((v) => findSelectedOption(v))
        : findSelectedOption(queryValue)
    }
  )

export const getFilterOptions = createStructuredSelector({
  indicators: getFieldOptions('indicators'),
  locations: getFieldOptions('locations'),
  sectors: getFieldOptions('sectors'),
  chartType: () => CHART_TYPE_OPTIONS,
})

// DEFAULTS
const getDefaults = createSelector([getFilterOptions], (options) => ({
  chartType: findOption(CHART_TYPE_OPTIONS, DEFAULTS.chartType),
  indicators: findOption(options.indicators, DEFAULTS.indicators),
  locations: findOption(options.locations, DEFAULTS.locations),
  sectors: findOption(options.sectors, DEFAULTS.sectors),
}))

export const getSelectedOptions = createStructuredSelector({
  chartType: getFieldSelected('chartType'),
  indicators: getFieldSelected('indicators'),
  locations: getFieldSelected('locations'),
  sectors: getFieldSelected('sectors')
})

const getBreakBySelected = createSelector(getSelectedOptions, (options) => {
  if (!options || !options.breakBy) return null
  const breakByArray = options.breakBy.value.split('-')
  return { modelSelected: breakByArray[0], metricSelected: breakByArray[1] }
})

export const getModelSelected = createSelector(
  getBreakBySelected,
  (breakBySelected) =>
    (breakBySelected && breakBySelected.modelSelected) || null
)
export const getMetricSelected = createSelector(
  getBreakBySelected,
  (breakBySelected) =>
    (breakBySelected && breakBySelected.metricSelected) || null
)
