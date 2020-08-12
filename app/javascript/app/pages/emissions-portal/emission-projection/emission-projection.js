import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Component from './emission-projection-component';
import { getGHGEmissions } from './emission-projection-selectors';

import * as actions from './emission-projection-actions';

const mapStateToProps = getGHGEmissions;

class EmissionProjectionContainer extends PureComponent {
  constructor() {
    super();
    this.state = { year: null };
  }

  onYearChange = year => {
    // weird workaround chart onmousemove invokes twice this function
    // first time with normal chart onmousemove object param from recharts
    if (typeof year === 'number') {
      this.setState({ year });
    }
  };

  onFilterChange = filter => {
    const { updateFiltersSelected, query, provinceISO } = this.props;

    updateFiltersSelected({
      section: 'regions-ghg-emissions',
      region: provinceISO,
      query: { ...query, ...filter }
    });
  };

  render() {
    const { year } = this.state;

    return (
      <Component
        {...this.props}
        selectedYear={year}
        onYearChange={this.onYearChange}
        onFilterChange={this.onFilterChange}
      />
    );
  }
}

EmissionProjectionContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object,
  provinceISO: PropTypes.string
};

EmissionProjectionContainer.defaultProps = { query: {}, provinceISO: '' };

export default connect(mapStateToProps, actions)(EmissionProjectionContainer);
