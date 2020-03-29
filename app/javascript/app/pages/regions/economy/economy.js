import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Component from './economy-component';
import { getEconomy } from './economy-selectors';

import * as actions from './economy-actions';

const mapStateToProps = getEconomy;

class EconomyContainer extends PureComponent {
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
    console.log('economy', this.props);
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

EconomyContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object,
  provinceISO: PropTypes.string
};

EconomyContainer.defaultProps = { query: {}, provinceISO: '' };

export default connect(mapStateToProps, actions)(EconomyContainer);
