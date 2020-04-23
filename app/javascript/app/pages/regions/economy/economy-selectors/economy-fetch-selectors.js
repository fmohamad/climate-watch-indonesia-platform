import { createSelector } from 'reselect'

const _getLocation = ({ location }) => location

export const getMetaParams = createSelector(_getLocation, (location) => {
  if (!location || !location.payload) return {}
  return {
    section: 'wp_economic',
    location: location.payload.region,
  }
})
