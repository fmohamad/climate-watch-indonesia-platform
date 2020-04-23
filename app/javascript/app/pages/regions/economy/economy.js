import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateQueryParams } from 'utils';
import Component from './economy-component';
import * as actions from './economy-actions';
import {
  getEconomies
} from './economy-selectors/economy-selectors';

class EconomyContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, provinceISO, query } = this.props;

    updateFiltersSelected({
      section: 'economy',
      region: provinceISO,
      query: updateQueryParams(query, filter)
    });
  };

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
  }
}

EconomyContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object,
  provinceISO: PropTypes.string
};

EconomyContainer.defaultProps = { query: {}, provinceISO: '' };

export default connect(getEconomies, actions)(EconomyContainer);
