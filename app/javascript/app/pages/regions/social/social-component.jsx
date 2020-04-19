import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Switch, Card, Dropdown, Button, Multiselect } from 'cw-components';
import { TabletLandscape } from 'components/responsive';
import cx from 'classnames';
import educationData from './educationData';

import dropdownStyles from 'styles/dropdown';
import button from 'styles/themes/button';
import styles from './social-styles';

const cardTheme = {
  card: styles.card,
  contentContainer: styles.contentContainer,
  data: styles.data,
  title: styles.title
};

const indicatorOptions = [
  { value: 'all-selected', label: 'All Selected', override: true },
  { label: 'PDRB', value: 'pdrb' },
  { label: 'PDRB per kapita', value: 'pdrb_per_kapita' },
  { label: 'Pertumbuhan Ekonomi', value: 'economy' },
];

const kabupatenOptions = [
  { value: 'all-selected', label: 'All Selected', override: true },
  { label: 'Fakfak', value: 'fakfak' },
  { label: 'Kaimana', value: 'kaimana' },
  
];

const sectorOptions = [
  { value: 'all-selected', label: 'All Selected', override: true },
  { label: 'Pertanian, kehutanan dan perikanan', value: 'farm' },
  { label: 'Pertambangan dan penggalian', value: 'mine' },
  { label: 'Industri pengolahan', value: 'industry' },
];

class RegionPopulation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { 
      selectedOption: { 
        name: 'Pendidikan', 
        value: 'education' 
      },
      selectedIndicator: {
        value: 'all-selected', 
        label: 'All Selected'
      },
      selectedKabupaten: {
        value: 'all-selected',
        label: 'All Selected'
      },
      selectedSector: {
        value: 'all-selected', 
        label: 'All Selected'
      },
      chartData: [
        { x: 2018, y1: 238500, y2: 28500, y3: 68500 },
        { x: 2019, y1: 242000, y2: 28500, y3: 42000 },
        { x: 2020, y1: 245400, y2: 28500, y3: 85400 }
      ],
      chartDomain: { x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] },
      chartConfig: {
        axes: {
          xBottom: { name: 'Year', unit: '', format: 'string' },
          yLeft: { name: 'People', unit: '', format: 'number' }
        },
        tooltip: {
          y1: { label: 'Pertanian' },
          y2: { label: 'Pertambangan' },
          y3: { label: 'Industri pengolahan' },
          x: { label: 'Year' }
        },
        animation: false,
        columns: {
          x: [ 
            { label: 'year', value: 'x' } 
          ],
          y: [ 
            { label: 'Pertanian, kehutanan dan perikanan', value: 'y1' },
            { label: 'Pertambangan dan penggalian', value: 'y2' },
            { label: 'Industri pengolahan', value: 'y3' }
          ]
        },
        theme: { 
          y1: { stroke: '#00B4D2', fill: '#00B4D2' },
          y2: { stroke: '#0677B3', fill: '#0677B3' },
          y3: { stroke: '#D2187C', fill: '#D2187C' }  
        }
      },
      chartDataOptions: [
        { label: 'Pertanian, kehutanan dan perikanan', value: 'farm' },
        { label: 'Pertambangan dan penggalian', value: 'mine' },
        { label: 'Industri pengolahan', value: 'industry' },
      ],
      chartDataSelected: [ 
        { label: 'Pertanian, kehutanan dan perikanan', value: 'farm' },
        { label: 'Pertambangan dan penggalian', value: 'mine' },
        { label: 'Industri pengolahan', value: 'industry' },
      ]
    };
  }

  componentDidMount() {
    this.getChartData()
  }

  getChartData() {
    const { selectedSector, selectedKabupaten, selectedIndicator, chartDataSelected, chartConfig } = this.state
    let arrayData = []
    educationData.filter(annualData => {
      let objectData = {}
      objectData.x = annualData.year
      objectData.y1 = 0
      objectData.y2 = 0
      objectData.y3 = 0
      annualData.sector.map((sectorData, sectorIndex) => {
        if(selectedSector.value === 'all-selected'){
          if(sectorData.name === 'farm') {
            sectorData.kabupaten.map((kabupatenData, index) => {
              if(selectedKabupaten.value === 'all-selected'){
                kabupatenData.indicator.map((indicatorData, index) => {
                  if(selectedIndicator.value === 'all-selected') {
                    objectData.y1 = objectData.y1 + indicatorData.quantity
                  } else {
                    if(selectedIndicator.value === indicatorData.name) {
                      objectData.y1 = objectData.y1 + indicatorData.quantity
                    }
                  }
                })
              } else {
                if(selectedKabupaten.value === kabupatenData.name) {
                  kabupatenData.indicator.map((indicatorData, index) => {
                    if(selectedIndicator.value === 'all-selected') {
                      objectData.y1 = objectData.y1 + indicatorData.quantity
                    } else {
                      if(selectedIndicator.value === indicatorData.name) {
                        objectData.y1 = objectData.y1 + indicatorData.quantity
                      }
                    }
                  })
                }
              }
            }) 
          } else if(sectorData.name === 'mine') {
            sectorData.kabupaten.map((kabupatenData, index) => {
              if(selectedKabupaten.value === 'all-selected'){
                kabupatenData.indicator.map((indicatorData, index) => {
                  if(selectedIndicator.value === 'all-selected') {
                    objectData.y2 = objectData.y2 + indicatorData.quantity
                  } else {
                    if(selectedIndicator.value === indicatorData.name) {
                      objectData.y2 = objectData.y2 + indicatorData.quantity
                    }
                  }
                })
              } else {
                if(selectedKabupaten.value === kabupatenData.name) {
                  kabupatenData.indicator.map((indicatorData, index) => {
                    if(selectedIndicator.value === 'all-selected') {
                      objectData.y2 = objectData.y2 + indicatorData.quantity
                    } else {
                      if(selectedIndicator.value === indicatorData.name) {
                        objectData.y2 = objectData.y2 + indicatorData.quantity
                      }
                    }
                  })
                }
              }
            }) 
          } else {
            sectorData.kabupaten.map((kabupatenData, index) => {
              if(selectedKabupaten.value === 'all-selected'){
                kabupatenData.indicator.map((indicatorData, index) => {
                  if(selectedIndicator.value === 'all-selected') {
                    objectData.y3 = objectData.y3 + indicatorData.quantity
                  } else {
                    if(selectedIndicator.value === indicatorData.name) {
                      objectData.y3 = objectData.y3 + indicatorData.quantity
                    }
                  }
                })
              } else {
                kabupatenData.indicator.map((indicatorData, index) => {
                  if(selectedIndicator.value === 'all-selected') {
                    objectData.y3 = objectData.y3 + indicatorData.quantity
                  } else {
                    if(selectedIndicator.value === indicatorData.name) {
                      objectData.y3 = objectData.y3 + indicatorData.quantity
                    }
                  }
                })
              }
            }) 
          }
        } else {
          sectorData.name === selectedSector.value &&
          sectorData.kabupaten.map((kabupatenData, index) => {
            if(selectedKabupaten.value === 'all-selected'){
              kabupatenData.indicator.map((indicatorData, index) => {
                if(selectedIndicator.value === 'all-selected') {
                  if(selectedSector.value === 'farm') {
                    objectData.y1 = objectData.y1 + indicatorData.quantity
                  } else if(selectedSector.value === 'mine') {
                    objectData.y2 = objectData.y2 + indicatorData.quantity
                  } else {
                    objectData.y3 = objectData.y3 + indicatorData.quantity
                  }
                } else {
                  if(selectedIndicator.value === indicatorData.name) {
                    if(selectedSector.value === 'farm') {
                      objectData.y1 = objectData.y1 + indicatorData.quantity
                    } else if(selectedSector.value === 'mine') {
                      objectData.y2 = objectData.y2 + indicatorData.quantity
                    } else {
                      objectData.y3 = objectData.y3 + indicatorData.quantity
                    }
                  }
                }
              })
            } else {
              if(selectedKabupaten.value === kabupatenData.name) {
                kabupatenData.indicator.map((indicatorData, index) => {
                  if(selectedIndicator.value === 'all-selected') {
                    if(selectedSector.value === 'farm') {
                      objectData.y1 = objectData.y1 + indicatorData.quantity
                    } else if(selectedSector.value === 'mine') {
                      objectData.y2 = objectData.y2 + indicatorData.quantity
                    } else {
                      objectData.y3 = objectData.y3 + indicatorData.quantity
                    }
                  } else {
                    if(selectedIndicator.value === indicatorData.name) {
                      if(selectedSector.value === 'farm') {
                        objectData.y1 = objectData.y1 + indicatorData.quantity
                      } else if(selectedSector.value === 'mine') {
                        objectData.y2 = objectData.y2 + indicatorData.quantity
                      } else {
                        objectData.y3 = objectData.y3 + indicatorData.quantity
                      }
                    }
                  }
                })
              }
            }
          }) 
        }
      })
      arrayData.push(objectData)
    })
    this.setState({
      chartData: arrayData
    })
  }

  getOptions = () => [
      { name: 'Pendidikan', value: 'education' },
      { name: 'Kesehatan', value: 'health' },
      { name: 'Ketenagakerjaan', value: 'employment' }
    ];

  handleFilterChange = (field, selected) => {
    if(field === 'selectedOption') {
      this.setState({ 
        [field]: selected,
        selectedSector: {value: 'all-selected', 'label': 'All Selected'},
        selectedKabupaten: {value: 'all-selected', 'label': 'All Selected'},
        selectedIndicator: {value: 'all-selected', 'label': 'All Selected'}
      }, () => {
        this.getChartData()
      });
    } else {
      this.setState({ [field]: selected }, () => {
        this.getChartData()
      });
    }
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

  render() {
    const { t, provinceISO } = this.props;
    const { selectedOption, selectedIndicator, selectedKabupaten, selectedSector, chartData, chartConfig, chartDataOptions, chartDataSelected, chartDomain } = this.state;
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
                  <Dropdown
                    key="indicator"
                    label="Indikator"
                    placeholder="Filter by"
                    options={indicatorOptions}
                    onValueChange={value => this.handleFilterChange('selectedIndicator', value)}
                    value={selectedIndicator}
                    theme={{ select: dropdownStyles.select }}
                    hideResetButton
                  />
                </div>
                <div className={styles.dropdown}>
                  <Dropdown
                    key="kabupaten"
                    label="Kabupaten"
                    placeholder="Filter by"
                    options={kabupatenOptions}
                    onValueChange={value => this.handleFilterChange('selectedKabupaten', value)}
                    value={selectedKabupaten}
                    theme={{ select: dropdownStyles.select }}
                    hideResetButton
                  />
                </div>
                <div className={styles.dropdown}>
                  <Dropdown
                    key="sector"
                    label="Sektor"
                    placeholder="Filter by"
                    options={sectorOptions}
                    onValueChange={value => this.handleFilterChange('selectedSector', value)}
                    value={selectedSector}
                    theme={{ select: dropdownStyles.select }}
                    hideResetButton
                  />
                  {/*<Multiselect
                    key="sector"
                    label="Sektor"
                    options={chartDataOptions}
                    // onValueChange={selected => this.handleFilterChange(field, selected)}
                    values={chartDataSelected}
                    theme={{ wrapper: dropdownStyles.select }}
                    hideResetButton
                  />*/}
                </div>
                {}
              </div>
              <Button theme={{ button: cx(button.darkBlue, styles.button) }}>
                Jelajahi di Tingkat Nasional
              </Button>
            </div>
            <Chart
              type="bar"
              config={chartConfig}
              data={chartData}
              theme={{ legend: styles.legend }}
              /* customTooltip={<CustomTooltip />} */
              domain={chartDomain}
              dataOptions={chartDataOptions}
              dataSelected={chartDataSelected}
              height={300}
              barSize={30}
              customMessage={t('common.chart-no-data')}
              /* onLegendChange={onLegendChange} */
            />
          </div>
        </div>
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
