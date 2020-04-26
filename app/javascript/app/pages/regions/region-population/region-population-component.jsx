import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import SectionTitle from 'components/section-title'
import InfoDownloadToolbox from 'components/info-download-toolbox'
import Chart from 'components/chart'
import { Switch, Card, Dropdown } from 'cw-components'
import dropdownStyles from 'styles/dropdown'
import CustomTooltip from './bar-chart-tooltip'
import PopulationMap from './population-map'
import populationData from './populationData'
import { locationOptions, yearOptions, populationCardData } from './data'

const format = require('d3-format').format

import styles from './region-population-styles'

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
      selectedOption: {
        name: 'Populasi',
        value: 'population',
      },
      selectedYear: {
        value: '2018',
        label: '2018',
      },
      selectedLocation: {
        value: 'ID.PB.FA',
        label: 'Fakfak',
        override: true,
      },
      selectedPopulationData: {},
      chartData: [],
      chart: {
        domain: { x: ['auto', 'auto'], y: [0, 'auto'] },
        config: {
          axes: {
            xBottom: { name: 'Age', unit: 'tahun', format: 'string' },
            yLeft: {
              name: 'Jumlah Jiwa',
              unit: 'jiwa',
              format: 'number',
              label: 'jiwa',
            },
          },
          tooltip: {
            yIdn: { label: 'People', unit: 'jiwa' },
            x: { label: 'Age' },
            indicator: 'Age',
            theme: { yIdn: { stroke: '#ffc735', fill: '#ffc735' } },
          },
          animation: false,
          columns: {
            x: [{ label: 'age', value: 'x' }],
            y: [{ label: 'people', value: 'yIdn' }],
          },
          theme: { yIdn: { stroke: '#ffc735', fill: '#ffc735' } },
        },
      },
    }
  }

  componentDidMount() {
    this.getChartData()
    this.getPopulationData()
  }

  getChartData() {
    const { selectedLocation, selectedYear } = this.state
    let data = []
    populationData.filter((annualData) => {
      if (selectedYear.value === annualData.year) {
        annualData[selectedLocation.value].map((item, index) => {
          let dataObject = {}
          dataObject.x = item.ageRange
          dataObject.yIdn = item.quantity
          data.push(dataObject)
        })
      }
    })
    this.setState({ chartData: data })
  }

  getPopulationData() {
    const { selectedYear } = this.state
    const { selectedLocation } = this.state
    populationCardData.filter((annualData) => {
      if (
        selectedYear.value === annualData.year &&
        selectedLocation.value === annualData.location
      ) {
        this.setState({
          selectedPopulationData: annualData.data,
        })
      }
    })
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
    this.setState({ [field]: selected }, () => {
      this.getChartData()
      this.getPopulationData()
    })
  }

  renderSwitch() {
    const { selectedOption } = this.state
    return (
      <div className={styles.switch}>
        <div className='switch-container'>
          <Switch
            options={this.getOptions()}
            onClick={(value) =>
              this.handleFilterChange('selectedOption', value)
            }
            selectedOption={String(selectedOption.value)}
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

  renderDropdown() {
    const { selectedYear, selectedLocation, selectedOption } = this.state

    if (selectedOption.value === 'distribution') {
      return (
        <div className={styles.dropdown}>
          <Dropdown
            key='year'
            label='Tahun'
            placeholder='Filter by'
            options={yearOptions}
            onValueChange={(value) =>
              this.handleFilterChange('selectedYear', value)
            }
            value={selectedYear}
            theme={{ select: dropdownStyles.select }}
            hideResetButton
          />
        </div>
      )
    }
    return (
      <div className={styles.dropdownContainer}>
        <div className={styles.dropdown}>
          <Dropdown
            key='year'
            label='Tahun'
            placeholder='Filter by'
            options={yearOptions}
            onValueChange={(value) =>
              this.handleFilterChange('selectedYear', value)
            }
            value={selectedYear}
            theme={{ select: dropdownStyles.select }}
            hideResetButton
          />
        </div>
        <div className={styles.dropdown}>
          <Dropdown
            key='year'
            label='Kabupaten'
            placeholder='Filter by'
            options={locationOptions}
            onValueChange={(value) =>
              this.handleFilterChange('selectedLocation', value)
            }
            value={selectedLocation}
            theme={{ select: dropdownStyles.select }}
            hideResetButton
          />
        </div>
      </div>
    )
  }

  renderContent() {
    const { t } = this.props
    const {
      selectedOption,
      chart,
      chartData,
      selectedPopulationData,
    } = this.state
    console.log(chartData)

    if (selectedOption.value === 'population') {
      return (
        <div className={styles.chartMapContainer}>
          <div className={styles.filtersChartContainer}>
            {this.renderDropdown()}
            <div className={styles.chartContainer}>
              <PopulationMap />
            </div>
          </div>
          <div className={styles.cardContainer}>
            <Card theme={cardTheme} title='Total Populasi Penduduk (Kabupaten)'>
              <div className={styles.cardContent}>
                <p>{selectedPopulationData.total_population}</p>
              </div>
            </Card>
            <Card theme={cardTheme} title='Laju pertumbuhan penduduk per tahun'>
              <div className={styles.cardContent}>
                <p>{selectedPopulationData.growth}</p>
              </div>
            </Card>
            <Card theme={cardTheme} title='Kepadatan penduduk'>
              <div className={styles.cardContent}>
                <p>
                  {selectedPopulationData.density} Jiwa/Km<sup>2</sup>
                </p>
              </div>
            </Card>
            <Card
              theme={cardTheme}
              title='Rasio Jenis Kelamin (Perempuan/ Laki-laki)'
            >
              <div className={styles.cardContent}>
                <p>{selectedPopulationData.ratio}</p>
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
    const { t, selectedIndicator, provinceISO } = this.props
    const { selectedOption } = this.state
    const sources = ['RADGRK', 'SIGNSa']
    const downloadURI = `emissions/download?source=${sources.join(
      ','
    )}&location=${provinceISO}`

    return (
      <div className={styles.page}>
        <div className={styles.chartMapContainer}>
          <div>
            <SectionTitle
              title={selectedOption.name}
              description={t('pages.regions.region-population.description')}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {selectedOption.value === 'population' && (
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
      </div>
    )
  }
}

RegionPopulation.propTypes = {
  t: PropTypes.func.isRequired,
  selectedIndicator: PropTypes.object,
  provinceISO: PropTypes.string,
}

RegionPopulation.defaultProps = {
  selectedIndicator: {},
}

export default RegionPopulation
