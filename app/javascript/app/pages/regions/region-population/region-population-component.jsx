import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Switch, Card, Dropdown } from 'cw-components';
import { TabletLandscape } from 'components/responsive';
import dropdownStyles from 'styles/dropdown';
import CustomTooltip from './bar-chart-tooltip';
import PopulationMap from './population-map';

import styles from './region-population-styles';

const chartData = {
  data: [
    { x: '0-4', yIdn: 5583682 },
    { x: '5-9', yIdn: 5299279 },
    { x: '10-14', yIdn: 3697297 },
    { x: '15-18', yIdn: 3797290 },
    { x: '19-24', yIdn: 3208892 },
    { x: '25-29', yIdn: 3088927 },
    { x: '30-34', yIdn: 2618909 },
    { x: '35-39', yIdn: 2818909 },
    { x: '40-44', yIdn: 2518909 },
    { x: '45-49', yIdn: 2089793 },
    { x: '50-54', yIdn: 1984982 },
    { x: '55-59', yIdn: 1298374 },
    { x: '60-64', yIdn: 1193794 },
    { x: '65-69', yIdn: 1108380 },
    { x: '70-74', yIdn: 1079497 },
    { x: '75-79', yIdn: 983973 },
    { x: '80+', yIdn: 863281 }
  ],
  domain: { x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] },
  config: {
    axes: {
      xBottom: { name: 'Age', unit: '', format: 'string' },
      yLeft: { name: 'People', unit: '', format: 'number' }
    },
    tooltip: {
      yIdn: { label: 'People' },
      x: { label: 'Age' },
      indicator: 'Age',
      theme: { yIdn: { stroke: '#ffc735', fill: '#ffc735' } }
    },
    animation: false,
    columns: {
      x: [ { label: 'age', value: 'x' } ],
      y: [ { label: 'people', value: 'yIdn' } ]
    },
    theme: { yIdn: { stroke: '#ffc735', fill: '#ffc735' } }
  }
};

const yearOptions = [
  { value: 'all-selected', label: 'Tahun', override: true },
  { label: '2015', value: '2015' },
  { label: '2016', value: '2016' },
  { label: '2017', value: '2017' },
  { label: '2018', value: '2018' },
  { label: '2019', value: '2019' },
  { label: '2020', value: '2020' }
];

const genderOptions = [
  { value: 'all-selected', label: 'Jenis Kelamin', override: true },
  { label: 'Laki-laki', value: 'male' },
  { label: 'Perempuan', value: 'female' }
];

const cardTheme = {
  card: styles.card,
  contentContainer: styles.contentContainer,
  data: styles.data,
  title: styles.title
};

class RegionPopulation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { 
      selectedOption: { 
        name: 'Populasi', 
        value: 'population' 
      },
      selectedYear: { 
        value: 'all-selected', 
        label: 'Tahun', 
        override: true 
      },
      selectedGender: { 
        value: 'all-selected', 
        label: 'Jenis Kelamin', 
        override: true 
      }
    };
  }

  getOptions = () => [
      { 
        name: 'Populasi', 
        value: 'population' 
      },
      { 
        name: 'Distribusi Kelompok Umur', 
        value: 'distribution' 
      }
    ];

  handleFilterChange = (field, selected) => {
    this.setState({ [field]: selected });
  };

  renderSwitch() {
    const { selectedOption } = this.state;
    return (
      <div className={styles.switch}>
        <div className="switch-container">
          <Switch
            options={this.getOptions()}
            onClick={value => this.handleFilterChange('selectedOption', value)}
            selectedOption={String(selectedOption.value)}
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

  renderContent() {
    const { t } = this.props;
    const { selectedOption, selectedYear, selectedGender } = this.state;

    if (selectedOption.value === 'population') {
      return (
        <div className={styles.chartMapContainer}>
          <div className={styles.filtersChartContainer}>
            <div className={styles.chartContainer}>
              <PopulationMap />
            </div>
          </div>
          <div className={styles.cardContainer}>
            <Card theme={cardTheme} title="Total Populasi Penduduk (Kabupaten)">
              <div className={styles.cardContent}>
                <p>
                  2.7 Juta
                </p>
              </div>
            </Card>
            <Card theme={cardTheme} title="Laju pertumbuhan penduduk per tahun">
              <div className={styles.cardContent}>
                <p>
                  1.03%
                </p>
              </div>
            </Card>
            <Card theme={cardTheme} title="Kepadatan penduduk">
              <div className={styles.cardContent}>
                <p>
                  10.7 Jiwa/ Km<sup>2</sup>
                </p>
              </div>
            </Card>
            <Card
              theme={cardTheme}
              title="Rasio Jenis Kelamin (Perempuan/ Laki-lai)"
            >
              <div className={styles.cardContent}>
                <p>
                  80/30
                </p>
              </div>
            </Card>
          </div>
        </div>
      );
    } 
      return (
        <div className={styles.container}>
          <div className={styles.toolbox}>
            <div className={styles.dropdownContainer}>
              <div className={styles.dropdown}>
                <Dropdown
                  key="year"
                  label="Tahun"
                  placeholder="Filter by"
                  options={yearOptions}
                  onValueChange={value => this.handleFilterChange('selectedYear', value)}
                  value={selectedYear}
                  theme={{ select: dropdownStyles.select }}
                  hideResetButton
                />
              </div>
              <div className={styles.dropdown}>
                <Dropdown
                  key="year"
                  label="Indikator"
                  placeholder="Filter by"
                  options={genderOptions}
                  onValueChange={value => this.handleFilterChange('selectedGender', value)}
                  value={selectedGender}
                  theme={{ select: dropdownStyles.select }}
                  hideResetButton
                />
              </div>
            </div>
            <InfoDownloadToolbox
              className={{ buttonWrapper: styles.buttonWrapper }}
              /* slugs={sources} */
              /* downloadUri={downloadURI} */
              pdfUri="pdfuri"
              shareableLink="link"
            />
          </div>
          <Chart
            type="bar"
            config={chartData.config}
            data={chartData.data}
            theme={{ legend: styles.legend }}
            customTooltip={<CustomTooltip />}
            getCustomYLabelFormat={chartData.config.yLabelFormat}
            domain={chartData.domain}
            dataOptions={chartData.dataOptions}
            dataSelected={chartData.dataSelected}
            height={300}
            barSize={30}
            customMessage={t('common.chart-no-data')}
            /* onLegendChange={onLegendChange} */
          />
        </div>
      );
    
  }

  render() {
    const { t, chartData, selectedIndicator, provinceISO } = this.props;
    const { selectedOption } = this.state;
    const sources = [ 'RADGRK', 'SIGNSa' ];
    const downloadURI = `emissions/download?source=${sources.join(
      ','
    )}&location=${provinceISO}`;

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
            {
              selectedOption.value === 'population' &&
                (
                  <InfoDownloadToolbox
                    className={{ buttonWrapper: styles.buttonWrapper }}
                    slugs={sources}
                    downloadUri={downloadURI}
                    pdfUri="pdfuri"
                    shareableLink="link"
                  />
                )
            }
          </div>
        </div>
        <div>
          <div className={styles.dropdowns}>
            {this.renderSwitch()}
          </div>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

RegionPopulation.propTypes = {
  t: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  selectedIndicator: PropTypes.object,
  provinceISO: PropTypes.string
};

RegionPopulation.defaultProps = { selectedIndicator: {}, chartData: null };

export default RegionPopulation;
