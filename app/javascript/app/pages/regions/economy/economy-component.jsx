import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProvinceMetaProvider from 'providers/province-meta-provider';
import SectionTitle from 'components/section-title';
import { Switch, Chart, Dropdown } from 'cw-components';
import { format } from 'd3-format';
import startCase from 'lodash/startCase';
import kebabCase from 'lodash/kebabCase';
import castArray from 'lodash/castArray';
import uniq from 'lodash/uniq';
import flatMap from 'lodash/flatMap';
import InfoDownloadToolbox from 'components/info-download-toolbox';

import dropdownStyles from 'styles/dropdown.scss';
import lineIcon from 'assets/icons/line_chart.svg';
import areaIcon from 'assets/icons/area_chart.svg';
import styles from './economy-styles.scss';

const code = {
  section: 'economic',
  location: 'ID.PB'
}

class Economy extends PureComponent {
  handleFilterChange = (field, selected) => {
    const { onFilterChange, selectedOptions } = this.props;

    const prevSelectedOptionValues = castArray(selectedOptions[field])
      .filter(o => o)
      .map(o => o.value);
    const selectedArray = castArray(selected);
    const newSelectedOption = selectedArray.find(
      o => !prevSelectedOptionValues.includes(o.value)
    );

    const removedAnyPreviousOverride = selectedArray
      .filter(v => v)
      .filter(v => !v.override);

    const values = newSelectedOption && newSelectedOption.override
      ? newSelectedOption.value
      : uniq(
        flatMap(removedAnyPreviousOverride, v => String(v.value).split(','))
      ).join(',');

    onFilterChange({ [field]: values });
  };

  renderDropdown(field, icons) {
    const {
      selectedOptions,
      filterOptions,
      t
    } = this.props;

    const value = selectedOptions && selectedOptions[field];
    const options = filterOptions[field] || [];
    const iconsProp = icons ? { icons } : {};

    const label = t(
      `pages.regions.economy.labels.${kebabCase(field)}`
    );
    
    return (
      <Dropdown
        key={field}
        label={label}
        placeholder={`Filter by ${startCase(field)}`}
        options={options}
        onValueChange={selected => this.handleFilterChange(field, selected)}
        value={value || null}
        theme={{ select: dropdownStyles.select }}
        hideResetButton
        {...iconsProp}
      />
    );
  }

  renderSwitch() {
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
  }

  render() {
    const {
      selectedOptions,
      chartData,
      fieldToBreakBy,
      t
    } = this.props;

    const icons = { line: lineIcon, area: areaIcon };
    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.regions.economy.title')}
          description={t(
            'pages.regions.economy.description'
          )}
        />
        <div className={styles.filtersGroup}>
          <div className={styles.filters}>
            {this.renderDropdown('indicators')}
            {this.renderDropdown('locations')}
            {this.renderDropdown('sectors')}
            {this.renderDropdown('chartType', icons)}
          </div>
        </div>
        <div className={styles.chartContainer}>
          {
            chartData &&
              chartData.data &&
              (
                <Chart
                  theme={{
                    legend: styles.legend,
                    projectedLegend: styles.projectedLegend
                  }}
                  type={
                    selectedOptions &&
                      selectedOptions.chartType &&
                      selectedOptions.chartType.value
                  }
                  config={chartData.config}
                  data={chartData.data}
                  projectedData={chartData.projectedData || []}
                  domain={chartData.domain}
                  dataOptions={chartData.dataOptions}
                  dataSelected={chartData.dataSelected}
                  height={500}
                  loading={chartData.loading}
                  onLegendChange={v =>
                    this.handleFilterChange(fieldToBreakBy, v)}
                  getCustomYLabelFormat={value => format('.3s')(value)}
                  showUnit
                />
              )
          }
        </div>
        <ProvinceMetaProvider metaParams={code} />
      </div>
    );
  }
}

Economy.propTypes = {
  t: PropTypes.func.isRequired,
  apiSelected: PropTypes.string,
  metadataSources: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
  downloadURI: PropTypes.string,
  chartData: PropTypes.object,
  emissionParams: PropTypes.object,
  fieldToBreakBy: PropTypes.string,
  filterOptions: PropTypes.object,
  metricSelected: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.object
};

Economy.defaultProps = {
  apiSelected: undefined,
  chartData: undefined,
  metadataSources: undefined,
  downloadURI: undefined,
  emissionParams: undefined,
  fieldToBreakBy: undefined,
  filterOptions: undefined,
  metricSelected: undefined,
  selectedOptions: undefined
};

export default Economy;
