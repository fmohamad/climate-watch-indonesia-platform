import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateQueryParams } from 'utils';
import Component from './ghg-emission-inventory-component';
import * as actions from './ghg-emission-inventory-actions';
import {
  getGHGEmissions
} from './ghg-emission-inventory-selectors/ghg-emission-inventory-selectors';

class HistoricalContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;

    if (filter.source) {
      Object.assign(filter, { gas: null, region: null, sector: null });
    }

    updateFiltersSelected({
      section: 'historical-emissions',
      query: updateQueryParams(query, filter)
    });
  };

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
  }
}

HistoricalContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object
};

HistoricalContainer.defaultProps = { query: {} };

export default connect(getGHGEmissions, actions)(HistoricalContainer);
