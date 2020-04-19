import { createSelector } from 'reselect'
import { getProvince } from 'selectors/provinces-selectors';

const _getMetadata = ({ provinceMeta }) => provinceMeta

export const getIndicatorValues = ({ indicators }) => indicators && indicators.data

export const getMetadata = createSelector(
  _getMetadata,
  meta => {
    if (!meta) return null
    return meta && meta.data
  }
)

export const getProvinceData = createSelector(
  getProvince, province => {
    if (!province) return null
    return province
  }
)