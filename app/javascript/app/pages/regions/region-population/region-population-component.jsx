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
import populationData from './populationData'

import styles from './region-population-styles';

const yearOptions = [
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

const populationCardData = [
  {
    'year': '2018',
    'data': {
      'total_population': '2.7 Juta',
      'male': {
        'total': '810 Ribu',
        'growth': '0.3%',
        'density': '3.3'
      },
      'female': {
        'total': '1.89 Juta',
        'growth': '0.7%',
        'density': '7.4'
      },
      'growth': '1.03%',
      'density': '10.7',
      'ratio': '70/30'
    }
  },
  {
    'year': '2019',
    'data': {
      'total_population': '2.9 Juta',
      'male': {
        'total': '957 Ribu',
        'growth': '1.5%',
        'density': '5.6'
      },
      'female': {
        'total': '1.943 Juta',
        'growth': '3.6%',
        'density': '8.7'
      },
      'growth': '5.1%',
      'density': '13.3',
      'ratio': '67/33'
    }
  },
  {
    'year': '2020',
    'data': {
      'total_population': '3.2 Juta',
      'male': {
        'total': '1.312 Juta',
        'growth': '3.3%',
        'density': '6.2'
      },
      'female': {
        'total': '1.888 Juta',
        'growth': '4.8%',
        'density': '8.0'
      },
      'growth': '8.1%',
      'density': '14.2',
      'ratio': '59/41'
    }
  }
]

class RegionPopulation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { 
      selectedOption: { 
        name: 'Populasi', 
        value: 'population' 
      },
      selectedYear: { 
        value: '2018', 
        label: '2018'
      },
      selectedGender: { 
        value: 'all-selected', 
        label: 'Jenis Kelamin', 
        override: true 
      },
      selectedPopulationData: {},
      chartData: [],
      chart: {
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
      }
    };
  }

  componentDidMount() {
    this.getChartData()
    this.getPopulationData()
  }

  getChartData() {
    const { selectedGender, selectedYear } = this.state
    let data = []
    populationData.filter(annualData => {
      if(selectedYear.value === annualData.year) {
        if(selectedGender.value === 'all-selected') {
          annualData.male.map((item, index) => {
            let dataObject = {}
            dataObject.x = item.ageRange
            dataObject.yIdn = item.quantity + annualData.female[index].quantity
            data.push(dataObject)
          })
        } else {
          annualData[selectedGender.value].map((item, index) => {
            let dataObject = {}
            dataObject.x = item.ageRange
            dataObject.yIdn = item.quantity
            data.push(dataObject)
          })
        }
      }
    })
    this.setState({chartData: data})
  }

  getPopulationData() {
    const { selectedYear } = this.state;
    populationCardData.filter(annualData => {
      if(selectedYear.value === annualData.year) {
        this.setState({
          selectedPopulationData: annualData.data
        })
      }
    })
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
    this.setState({ [field]: selected }, () => {
      this.getChartData();
      this.getPopulationData();
    });
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

  renderDropdown() {
    const { selectedYear, selectedGender } = this.state;
    return (
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
    )
  }

  renderContent() {
    const { t } = this.props;
    const { selectedOption, selectedYear, selectedGender, chart, chartData, selectedPopulationData } = this.state;

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
            <Card theme={cardTheme} title="Total Populasi Penduduk (Kabupaten)">
              <div className={styles.cardContent}>
                {
                  selectedGender.value === 'all-selected' ?
                    <p>
                      {selectedPopulationData.total_population}
                    </p>
                  :
                    <p>
                      {selectedPopulationData[selectedGender.value].total}
                    </p>
                }
              </div>
            </Card>
            <Card theme={cardTheme} title="Laju pertumbuhan penduduk per tahun">
              <div className={styles.cardContent}>
                {
                  selectedGender.value === 'all-selected' ?
                    <p>
                      {selectedPopulationData.growth}
                    </p>
                  :
                    <p>
                      {selectedPopulationData[selectedGender.value].growth}
                    </p>
                }
              </div>
            </Card>
            <Card theme={cardTheme} title="Kepadatan penduduk">
              <div className={styles.cardContent}>
                {
                  selectedGender.value === 'all-selected' ?
                    <p>
                    {selectedPopulationData.density} Jiwa/Km<sup>2</sup>
                  </p>
                  :
                    <p>
                      {selectedPopulationData[selectedGender.value].density} Jiwa/Km<sup>2</sup>
                    </p>
                }
              </div>
            </Card>
            <Card
              theme={cardTheme}
              title="Rasio Jenis Kelamin (Perempuan/ Laki-laki)"
            >
              <div className={styles.cardContent}>
                <p>
                  {selectedPopulationData.ratio}
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
            {this.renderDropdown()}
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
            config={chart.config}
            data={chartData}
            theme={{ legend: styles.legend }}
            customTooltip={<CustomTooltip />}
            getCustomYLabelFormat={chart.config.yLabelFormat}
            domain={chart.domain}
            dataOptions={chart.dataOptions}
            dataSelected={chart.dataSelected}
            height={300}
            barSize={30}
            customMessage={t('common.chart-no-data')}
            /* onLegendChange={onLegendChange} */
          />
        </div>
      );
    
  }

  render() {
    const { t, selectedIndicator, provinceISO } = this.props;
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
  selectedIndicator: PropTypes.object,
  provinceISO: PropTypes.string
};

RegionPopulation.defaultProps = { 
  selectedIndicator: {}
};

export default RegionPopulation;
