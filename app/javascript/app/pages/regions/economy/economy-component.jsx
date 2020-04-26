import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ProvinceMetaProvider from 'providers/province-meta-provider'
import IndicatorProvider from 'providers/indicators-provider'
import SectionTitle from 'components/section-title'
import { Chart, Dropdown, Multiselect, Button } from 'cw-components'
import { NavLink } from 'redux-first-router-link'
import startCase from 'lodash/startCase'
import kebabCase from 'lodash/kebabCase'
import castArray from 'lodash/castArray'
import uniq from 'lodash/uniq'
import flatMap from 'lodash/flatMap'

import dropdownStyles from 'styles/dropdown.scss'
import lineIcon from 'assets/icons/line_chart.svg'
import areaIcon from 'assets/icons/area_chart.svg'
import button from 'styles/themes/button'
import cx from 'classnames'
import styles from './economy-styles.scss'

class Economy extends PureComponent {
  handleFilterChange = (field, selected) => {

    const { onFilterChange, selectedOptions } = this.props

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

  renderDropdown(field, multi, icons) {
    const { selectedOptions, filterOptions, t } = this.props

    const value = selectedOptions && selectedOptions[field]
    const options = filterOptions[field] || []
    const iconsProp = icons ? { icons } : {}

    const label = t(`pages.regions.economy.labels.${kebabCase(field)}`)

    if (multi) {
      const values = castArray(value).filter((v) => v)
      return (
        <Multiselect
          key={field}
          label={label}
          placeholder={`Filter by ${startCase(field)}`}
          options={options}
          onValueChange={(selected) => this.handleFilterChange(field, selected)}
          values={values}
          theme={{ wrapper: dropdownStyles.select }}
          hideResetButton
        />
      )
    }

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
        {...iconsProp}
      />
    )
  }

  render() {
    const { metaParams, selectedOptions, chartData, t } = this.props

    const icons = { line: lineIcon, area: areaIcon }

    const isDataPresent = (chartData && chartData.data) ? true : false

    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.regions.economy.title')}
          description={t('pages.regions.economy.description')}
        />
        <div className={styles.filtersGroup}>
          <div className={styles.filters}>
            {this.renderDropdown('indicators')}
            {this.renderDropdown('locations', true)}
            {this.renderDropdown('sectors', true)}
            {this.renderDropdown('chartType', false, icons)}
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
        </div>
        <div className={styles.chartContainer}>
          {isDataPresent ? (chartData && chartData.data && (
            <Chart
              theme={{
                legend: styles.legend,
                projectedLegend: styles.projectedLegend,
              }}
              type={
                selectedOptions &&
                selectedOptions.chartType &&
                selectedOptions.chartType.value
              }
              config={chartData.config}
              data={chartData.data}
              domain={chartData.domain}
              dataOptions={chartData.dataOptions}
              dataSelected={chartData.dataSelected}
              onLegendChange={v =>
                this.handleFilterChange('locations', v)}
              height={500}
              loading={chartData.loading}
              showUnit
            />
          )) : (<div className={styles.noData}>No data available</div>)}
        </div>
        <ProvinceMetaProvider metaParams={metaParams} />
        <IndicatorProvider />
      </div>
    )
  }
}

Economy.propTypes = {
  t: PropTypes.func.isRequired,
  downloadURI: PropTypes.string,
  chartData: PropTypes.object,
  metaParams: PropTypes.object,
  filterOptions: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.object,
  provinceISO: PropTypes.string,
}

Economy.defaultProps = {
  chartData: undefined,
  downloadURI: undefined,
  metaParams: {},
  filterOptions: undefined,
  selectedOptions: undefined,
  provinceISO: '',
}

export default Economy
