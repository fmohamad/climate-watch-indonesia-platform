import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isArray from 'lodash/isArray';
import { getPolicy } from './policy-selectors';
import * as actions from './policy-actions';

import Component from './policy-component';

const mapStateToProps = getPolicy;

class PolicyContainer extends PureComponent {
  /* onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;

    updateFiltersSelected({ query: { ...query, ...filter } });
  }; */
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
        /* onFilterChange={this.onFilterChange} */
        /* onIndicatorChange={this.updateIndicatorFilter} */
        /* onLegendChange={this.updateLegendFilter} */
      />
    );
  }
}

PolicyContainer.propTypes = {
  // updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object,
  provinceISO: PropTypes.string
};

PolicyContainer.defaultProps = { query: {}, provinceISO: '' };

export default connect(mapStateToProps, actions)(PolicyContainer);
