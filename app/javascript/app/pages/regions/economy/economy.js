import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateQueryParams } from 'utils';
import Component from './economy-component';
import * as actions from './economy-actions';
import {
  getGHGEmissions
} from './economy-selectors/economy-selectors';

class EconomyContainer extends PureComponent {
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

EconomyContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object
};

EconomyContainer.defaultProps = { query: {} };

export default connect(getGHGEmissions, actions)(EconomyContainer);
