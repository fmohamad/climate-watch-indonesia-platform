import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'redux-first-router-link'
import kebabCase from 'lodash/kebabCase'
import startCase from 'lodash/startCase'
import castArray from 'lodash/castArray'
import uniq from 'lodash/uniq'
import flatMap from 'lodash/flatMap'
import isEmpty from 'lodash/isEmpty'
import { format } from 'd3-format';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import ProvinceMetaProvider from 'providers/province-meta-provider'
import IndicatorsProvider from 'providers/indicators-provider';
import Chart from 'components/chart';
import { Switch, Card, Dropdown, Button, Multiselect } from 'cw-components';
import { TabletLandscape } from 'components/responsive';
import cx from 'classnames';

import dropdownStyles from 'styles/dropdown';
import button from 'styles/themes/button';
import styles from './social-styles';

class RegionPopulation extends PureComponent {

  handleSwitchChange = (option) => {
    const { provinceISO, updateFiltersSelected } = this.props

    updateFiltersSelected({
      section: 'social',
      region: provinceISO,
      query: ({ model: option.value })
    })
  }

  handleFilterChange = (field, selected) => {

    const { onFilterChange, selectedOptions, query } = this.props

    const prevSelectedOptionValues = castArray(selectedOptions[field])
      .filter((o) => o)
      .map((o) => o.value)
    const selectedArray = castArray(selected)
    const newSelectedOption = selectedArray.find(
      (o) => !prevSelectedOptionValues.includes(o.value)
    )

    const removedAnyPreviousOverride = selectedArray
      .filter((v) => v)
      .filter((v) => !v.override)

    const values =
      newSelectedOption && newSelectedOption.override
        ? newSelectedOption.value
        : uniq(
            flatMap(removedAnyPreviousOverride, (v) =>
              String(v.value).split(',')
            )
          ).join(',')

    onFilterChange({ [field]: values })
  }

  renderSwitch() {
    const { selectedModel, filterOptions } = this.props;

    return (
      <div className={styles.switch}>
        <div className="switch-container">
          <Switch
            options={filterOptions.model}
            onClick={value => this.handleSwitchChange(value)}
            selectedOption={String(selectedModel.value)}
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

  renderDropdown(field) {
    const { selectedOptions, filterOptions, t } = this.props

    const value = selectedOptions && selectedOptions[field] || []
    const options = filterOptions[field] || []

    const label = t(`pages.regions.economy.labels.${kebabCase(field)}`)

    return (
      <Dropdown
        key={field}
        label={label}
        placeholder={`Filter by ${startCase(field)}`}
        options={options}
        onValueChange={(selected) => this.handleFilterChange(field, selected)}
        value={value || null}
        theme={{ select: dropdownStyles.select }}
        hideResetButton
      />
    )
  }


  renderChart() {
    const getCustomYLabelFormat = (value) =>
        `${format('.2s')(`${value / 1000}`)}`
    const { chart, chartData, t } = this.props
    return (
      <Chart
        type="bar"
        config={chart.config}
        data={chartData}
        theme={{ legend: styles.legend }}
        domain={chart.domain}
        height={300}
        barSize={30}
        customMessage={t('common.chart-no-data')}
        showUnit
        getCustomYLabelFormat={getCustomYLabelFormat}
      />
    );
  }

  numberFormat(value) {
    if(value>=1000000) {
      value=(value/1000000)+" Juta"
    } else if(value>=1000) {
      value=(value/1000)+" Ribu";
    }
    return value;
  }

  render() {
    const {
      t,
      provinceISO,
      indicatorParams,
      metaParams,
      selectedModel,
      chartData,
      chart,
      filterOptions,
      selectedOptions
    } = this.props;
    const sources = [ 'RADGRK', 'SIGNSa' ];
    const downloadURI = `emissions/download?source=${sources.join(
      ','
    )}&location=${provinceISO}`;

    return (
      <div className={styles.page}>
        <div className={styles.chartMapContainer}>
          <div>
            <SectionTitle
              title={selectedModel.name}
              description={t('pages.regions.social.description')}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <InfoDownloadToolbox
              className={{ buttonWrapper: styles.buttonWrapper }}
              slugs={sources}
              downloadUri={downloadURI}
              pdfUri="pdfuri"
              shareableLink="link"
            />
          </div>
        </div>
        <div>
          <div className={styles.dropdowns}>
            {this.renderSwitch()}
          </div>
          <div className={styles.container}>
            <div className={styles.toolbox}>
              <div className={styles.dropdownContainer}>
                <div className={styles.dropdown}>
                  { this.renderDropdown('indicator') }
                </div>
                <div className={styles.dropdown}>
                  { this.renderDropdown('district') }
                </div>
              </div>
              <Button theme={{ button: cx(button.darkBlue, styles.button) }}>
                <NavLink
                  exact={'/en/national-context' || false}
                  key={'/en/national-context'}
                  to={`/en/national-context`}
                  activeClassName={styles.active}
                  onTouchStart={undefined}
                  onMouseDown={undefined}
                >
                  Jelajahi di Tingkat Nasional
                </NavLink>
              </Button>
            </div>
              { !isEmpty(chartData) && this.renderChart() }
          </div>
        </div>
        <IndicatorsProvider params={indicatorParams} />
        <ProvinceMetaProvider metaParams={metaParams} />
      </div>
    );
  }
}

RegionPopulation.propTypes = {
  t: PropTypes.func.isRequired,
  provinceISO: PropTypes.string
};

RegionPopulation.defaultProps = {};

export default RegionPopulation;
