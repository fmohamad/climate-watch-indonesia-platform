import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ResultsList from 'components/results-list';
import Search from 'components/search';
import RegionsMap from './regions-map';
import { TabletLandscape } from 'components/responsive';

import layout from 'styles/layout.scss';
import resultsListLightTheme from 'styles/themes/results-list/results-list-light.scss';
import searchCountriesTheme from 'styles/themes/search/search-countries.scss';
import styles from './regions-select-styles.scss';

class RegionsSelect extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { search: '' };
  }

  filterProvince(value) {
    this.setState({ search: value });
  }

  render() {
    const {
      provinces,
      opened,
      className,
      handleClickOutside,
      activeProvince,
      parentRef,
      paths
    } = this.props;
    const { search } = this.state;

    return opened && (
        <React.Fragment>
          <div className={cx(styles.wrapper, className)}>
            <div className={cx(layout.content, styles.content)}>
              <div className="grid-layout-element">
                <div>
                  <Search
                    placeholder="Search a region"
                    value={search}
                    onChange={value => this.filterProvince(value)}
                    theme={searchCountriesTheme}
                    autofocus={opened || autofocus}
                  />
                </div>
              </div>
              <div className="grid-colum-item">
                <div className={styles.columns}>
                  <ResultsList
                    list={provinces}
                    opened={opened}
                    parentRef={parentRef}
                    activeProvince={activeProvince}
                    emptyDataMsg="No results"
                    handleMouseItemEnter={undefined}
                    handleMouseItemLeave={undefined}
                  />
                  <TabletLandscape>
                    <RegionsMap />
                  </TabletLandscape>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
  }
}

RegionsSelect.propTypes = {
  provinces: PropTypes.array,
  opened: PropTypes.bool,
  className: PropTypes.string,
  handleClickOutside: PropTypes.func,
  activeProvince: PropTypes.string,
  parentRef: PropTypes.node
};

RegionsSelect.defaultProps = {
  provinces: [],
  opened: false,
  className: '',
  handleClickOutside: () => {
  },
  activeProvince: '',
  parentRef: null
};

export default RegionsSelect;
