import { createStructuredSelector, createSelector } from 'reselect'
import { ALL_SELECTED } from 'constants'
import isEmpty from 'lodash/isEmpty';

import {
  getAllSelectedOption,
  getFieldQuery,
  findOption
} from 'selectors/filters-selectors'

import { getMetadata } from './economy-get-selectors'

// OPTIONS
const CHART_TYPE_OPTIONS = [
  { label: 'area', value: 'area' },
  { label: 'line', value: 'line' },
]

const DEFAULTS = {
  indicators: 'prdb-kabupaten',
  locations: 'ID.PB.FA',
  sectors: 'total',
  chartType: 'line',
}

const getFieldOptions = (field) =>
  createSelector(getMetadata, (metadata) => {
    if (isEmpty(metadata)) return null

    const transformToOption = (o) => ({
      label: o.name,
      value: o.iso_code3 || o.code || o.id,
      code: o.iso_code3 || o.code || o.label,
      override: o.override
    })

    const options = metadata[field]

    return options.filter((o) => o).map(transformToOption)
  })

// SELECTED
export const getFieldSelected = (field) =>
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