import { createStructuredSelector, createSelector } from 'reselect'
import { getTranslate } from 'selectors/translation-selectors'
import get from 'lodash/get'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'

import {
  getAllSelectedOption,
  findOption,
  withAllSelected,
} from 'selectors/filters-selectors'

import { ALL_SELECTED } from 'constants/constants'

const section = 'wp_population'
const code = 'code-kabupaten'
const LOCATION = 'ID.PB'

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
  return indicators.values
})

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
})

// DEFAULTS
const getDefaults = createSelector(
  [getFilterOptions, getAllSelectedOption],
  (options, allSelectedOption) => ({
    district: allSelectedOption,
    year: get(options, 'year[0]'),
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
})

const getCardData = createSelector(
  [getIndicatorPopulation, getSelectedOptions],
  (data, options) => {
    if (!data) return null

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
    return filter(data, ['ind_code', 'pop_total'])[0].value
  }
)

const getPopGrowth = createSelector(
  getCardData,
  data => {
    if (!data) return null
    return filter(data, ['ind_code', 'pop_growth'])[0].value
  }
)

const getPopDensity = createSelector(
  getCardData,
  data => {
    if (!data) return null
    return filter(data, ['ind_code', 'pop_density'])[0].value
  }
)

const getPopSexRatio = createSelector(
  getCardData,
  data => {
    if (!data) return null
    return filter(data, ['ind_code', 'pop_sex_ratio'])[0].value
  }
)

export const getRegionPopulation = createStructuredSelector({
  t: getTranslate,
  indicators: getIndicatorPopulation,
  popTotal: getPopTotal,
  popGrowth: getPopGrowth,
  popDensity: getPopDensity,
  popSexRatio: getPopSexRatio,
  filterOptions: getFilterOptions,
  selectedOptions: getSelectedOptions,
  params: getIndicatorParams,
  metaParams: getMetaParams,
  query: getQuery,
})
