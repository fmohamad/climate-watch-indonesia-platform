import { createSelector } from 'reselect'

const _getLocation = ({ location }) => location

export const getMetaParams = createSelector(_getLocation, (location) => {
  if (!location || !location.payload) return {}

  const queryValue  = (location.query && location.query.indicators) || 'prdb-kabupaten'

  return {
    section: 'wp_economic',
    location: location.payload.region,
    code: queryValue 
  }
})
