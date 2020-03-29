import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Switch, Chart, Dropdown, Multiselect } from 'cw-components';

import dropdownStyles from 'styles/dropdown';
import styles from './region-population-styles';

class RegionPopulation extends PureComponent {
  render() {
    const {
      t,
      chartData,
      selectedIndicator,
    } = this.props;
    
    /*renderSwitch() {
      const { filterOptions, selectedOptions } = this.props;
      
      return selectedOptions.source && (
        <div className={styles.switch}>
          <div className="switch-container">
            <Switch
              options={filterOptions.source}
              onClick={value => this.handleFilterChange('source', value)}
              selectedOption={String(selectedOptions.source.value)}
              theme={{
                    wrapper: styles.switchWrapper,
                    option: styles.option,
                    checkedOption: styles.checkedOption
                  }}
            />
          </div>
        </div>
      );
    }*/
    
    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.regions.region-population.title')}
          description={t(
            'pages.regions.region-population.description'
          )}
        />
        <div className={styles.container}>
          <div>
            <div className={styles.toolbox}>
              asdasd
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RegionPopulation.propTypes = {
  t: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  selectedIndicator: PropTypes.object,
};

RegionPopulation.defaultProps = { selectedIndicator: {}, chartData: null };

export default RegionPopulation;
