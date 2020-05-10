import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import SectionTitle from 'components/section-title'
import InfoDownloadToolbox from 'components/info-download-toolbox'
import Chart from 'components/chart'
import { Switch, Card, Dropdown } from 'cw-components'
import dropdownStyles from 'styles/dropdown'
import ProvinceMetaProvider from 'providers/province-meta-provider'
import IndicatorsProvider from 'providers/indicators-provider';
import startCase from 'lodash/startCase'
import kebabCase from 'lodash/kebabCase'
import castArray from 'lodash/castArray'
import uniq from 'lodash/uniq'
import flatMap from 'lodash/flatMap'
import CustomTooltip from './bar-chart-tooltip'
import PopulationMap from './population-map'
import populationData from './populationData'
import { locationOptions, yearOptions, populationCardData } from './data'

import styles from './region-population-styles'

const { format } = require('d3-format')

const cardTheme = {
  card: styles.card,
  contentContainer: styles.contentContainer,
  data: styles.data,
  title: styles.title,
}

class RegionPopulation extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      modelOptions: [
        {
          name: 'Population',
          value: 'population'
        },
        {
          name: 'Age group distribution',
          value: 'age_group'
        }
      ],
      selectedModel: {
        name: 'Population',
        value: 'population'
      }
    }
  }

  getOptions = () => [
    {
      name: 'Populasi',
      value: 'population',
    },
    {
      name: 'Distribusi Kelompok Umur',
      value: 'distribution',
    },
  ]

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

  renderSwitch() {
    const { selectedModel, modelOptions } = this.state
    return (
      <div className={styles.switch}>
        <div className='switch-container'>
          <Switch
            options={modelOptions}
            onClick={(value) =>
              this.setState({selectedModel: value})
            }
            selectedOption={selectedModel.value}
            theme={{
              wrapper: styles.switchWrapper,
              option: styles.option,
              checkedOption: styles.checkedOption,
            }}
          />
        </div>
      </div>
    )
  }

  renderDropdown(field) {
    const { selectedOptions, filterOptions, t } = this.props

    const value = selectedOptions && selectedOptions[field]
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

  renderContent() {
    const { selectedModel } = this.state
    const {
      t,
      chart,
      chartData,
      popTotal,
      pop_density,
      popGrowth,
      popSexRatio
    } = this.props

    if (selectedModel.value === 'population') {
      return (
        <div className={styles.chartMapContainer}>
          <div className={styles.filtersChartContainer}>
            <div className={styles.dropdownContainer}>
              <div className={styles.dropdown}>
                {this.renderDropdown('year')}
              </div>
              <div className={styles.dropdown}>
                {this.renderDropdown('district')}
              </div>
            </div>
            <div className={styles.chartContainer}>
              <PopulationMap />
            </div>
          </div>
          <div className={styles.cardContainer}>
            <Card theme={cardTheme} title='Total Populasi Penduduk (Kabupaten)'>
              <div className={styles.cardContent}>
                <p>{popTotal}</p>
              </div>
            </Card>
            <Card theme={cardTheme} title='Laju pertumbuhan penduduk per tahun'>
              <div className={styles.cardContent}>
                <p>{popGrowth}</p>
              </div>
            </Card>
            <Card theme={cardTheme} title='Kepadatan penduduk'>
              <div className={styles.cardContent}>
                <p>
                  {popGrowth} Jiwa/Km<sup>2</sup>
                </p>
              </div>
            </Card>
            <Card
              theme={cardTheme}
              title='Rasio Jenis Kelamin (Perempuan/ Laki-laki)'
            >
              <div className={styles.cardContent}>
                <p>{popSexRatio}</p>
              </div>
            </Card>
          </div>
        </div>
      )
    }

    const getCustomYLabelFormat = (value) =>
      `${format('.2s')(`${value / 1000}`)}`

    return (
      <div className={styles.container}>
        <div className={styles.toolbox}>
          {this.renderDropdown()}
          <InfoDownloadToolbox
            className={{ buttonWrapper: styles.buttonWrapper }}
            /* slugs={sources} */
            /* downloadUri={downloadURI} */
            pdfUri='pdfuri'
            shareableLink='link'
          />
        </div>
        <Chart
          type='bar'
          config={chart.config}
          data={chartData}
          theme={{ legend: styles.legend }}
          customTooltip={<CustomTooltip />}
          getCustomYLabelFormat={getCustomYLabelFormat}
          domain={chart.domain}
          dataOptions={chart.dataOptions}
          dataSelected={chart.dataSelected}
          height={300}
          barSize={30}
          customMessage={t('common.chart-no-data')}
          /* onLegendChange={onLegendChange} */
        />
      </div>
    )
  }

  render() {
    const { t, selectedIndicator, provinceISO, params, metaParams, filterOptions } = this.props
    const { selectedModel } = this.state
    const sources = ['RADGRK', 'SIGNSa']
    const downloadURI = `emissions/download?source=${sources.join(
      ','
    )}&location=${provinceISO}`

    return (
      <div className={styles.page}>
        <div className={styles.chartMapContainer}>
          <div>
            <SectionTitle
              title={selectedModel.name}
              description={t('pages.regions.region-population.description')}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {selectedModel.value === 'population' && (
              <InfoDownloadToolbox
                className={{ buttonWrapper: styles.buttonWrapper }}
                slugs={sources}
                downloadUri={downloadURI}
                pdfUri='pdfuri'
                shareableLink='link'
              />
            )}
          </div>
        </div>
        <div>
          <div className={styles.dropdowns}>{this.renderSwitch()}</div>
          {this.renderContent()}
        </div>
        <IndicatorsProvider params={params} />
        <ProvinceMetaProvider metaParams={metaParams} />
      </div>
    )
  }
}

RegionPopulation.propTypes = {
  t: PropTypes.func.isRequired,
  selectedIndicator: PropTypes.object,
  provinceISO: PropTypes.string,
  selectedOptions: PropTypes.object,
  filterOptions: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  cardData: PropTypes.object
}

RegionPopulation.defaultProps = {
  selectedIndicator: {},
  selectedOptions: undefined,
  filterOptions: undefined,
  cardData: undefined
}

export default RegionPopulation
