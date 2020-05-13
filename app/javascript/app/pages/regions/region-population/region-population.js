import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isArray from 'lodash/isArray'
import { updateQueryParams } from 'utils'
import { getRegionPopulation } from './region-population-selectors'
import * as actions from './region-population-actions'

import Component from './region-population-component'

const mapStateToProps = getRegionPopulation

class RegionPopulationContainer extends PureComponent {
  onFilterChange = (filter) => {
    const { updateFiltersSelected, query } = this.props
    const provinceISO = 'ID.PB'

    updateFiltersSelected({
      section: 'region-population',
      region: provinceISO,
      query: updateQueryParams(query, filter),
    })
  }
  /* updateIndicatorFilter = newFilter => {
    this.onFilterChange({
      popNationalIndicator: newFilter.value,
      popProvince: undefined
    });
  }; */
  /* updateLegendFilter = newFilter => {
    let values;
    if (isArray(newFilter)) {
      values = newFilter.map(v => v.value).join(',');
    } else {
      values = newFilter.value;
    }
    this.onFilterChange({ popProvince: values });
  }; */
  render() {
    return (
      <Component
        {...this.props}
        onFilterChange={this.onFilterChange}
        /* onIndicatorChange={this.updateIndicatorFilter} */
        /* onLegendChange={this.updateLegendFilter} */
      />
    )
  }
}

RegionPopulationContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object,
  provinceISO: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired
}

RegionPopulationContainer.defaultProps = { query: {}, provinceISO: '' }

export default connect(mapStateToProps, actions)(RegionPopulationContainer)
