import { createSelector } from 'reselect'

const _getMetadata = ({ provinceMeta }) => provinceMeta

export const getIndicatorValues = ({ indicators }) => indicators && indicators.data

export const getMetadata = createSelector(
  _getMetadata,
  meta => {
    if (!meta) return null
    return meta && meta.data
  }
)
