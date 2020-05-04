import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'redux-first-router-link'
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Switch, Card, Dropdown, Button, Multiselect } from 'cw-components';
import { TabletLandscape } from 'components/responsive';
import cx from 'classnames';
import educationData from './educationData';
import healthData from './healthData';
// import employmentData from './employmentData';

import dropdownStyles from 'styles/dropdown';
import button from 'styles/themes/button';
import styles from './social-styles';

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
        name: 'Pendidikan', 
        value: 'education' 
      },
      indicatorOptions: [
        { label: 'Indeks Pembangunan Manusia', value: 'humanDevelopment' },
        { label: 'Angka Melek Huruf', value: 'literate' },
        { label: 'Angka Buta Huruf', value: 'illiterate' }
      ],
      kabupatenOptions: [
        { value: 'all-selected', label: 'All Selected', override: true },
        { label: 'Fakfak', value: 'fakfak' },
        { label: 'Kaimana', value: 'kaimana' },
        { label: 'Wondama', value: 'wondama' },
        { label: 'Teluk Bintuni', value: 'teluk_bintuni' },
        { label: 'Manokwari', value: 'manokwari' },
        { label: 'Sorong Selatan', value: 'sorong_selatan' },
        { label: 'Sorong', value: 'sorong' },
        { label: 'Raja Ampat', value: 'raja_ampat' },
        { label: 'Tambrauw', value: 'tambrauw' },
        { label: 'Maybrat', value: 'maybrat' },
        { label: 'Manokwari Selatan', value: 'manokwari_selatan' },
        { label: 'Pegunungan Arfak', value: 'pegunungan_arfak' },
        { label: 'Kota Sorong', value: 'kota_sorong' }
      ],
      selectedIndicator: {
        label: 'Indeks Pembangunan Manusia', 
        value: 'humanDevelopment'
      },
      selectedKabupaten: {
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
          yLeft: { name: 'People', unit: ' ', format: 'number' }
        },
        tooltip: {
          y1: { label: 'Indeks Pembangunan Manusia' },
          y2: { label: '' },
          y3: { label: '' },
          x: { label: 'Year' }
        },
        animation: false,
        columns: {
          x: [ 
            { label: 'year', value: 'x' } 
          ],
          y: [
            { label: 'Indeks Pembangunan Manusia', value: 'y1' },
            { label: 'Angka Melek Huruf', value: 'y2' },
            { label: 'Angka Buta Huruf', value: 'y3' }
          ]
        },
        theme: { 
          y1: { stroke: '#00B4D2', fill: '#00B4D2' },
          y2: { stroke: '#0677B3', fill: '#0677B3' },
          y3: { stroke: '#D2187C', fill: '#D2187C' }  
        }
      },
      chartDataOptions: [
        { label: 'Indeks Pembangunan Manusia', value: 'humanDevelopment' },
        { label: 'Angka Melek Huruf', value: 'literate' },
        { label: 'Angka Buta Huruf', value: 'illiterate' }
      ],
      chartDataSelected: [
        { label: 'Indeks Pembangunan Manusia', value: 'humanDevelopment' },
      ]
    };
  }

  componentDidMount() {
    this.getChartData()
  }

  getChartData() {
    const { selectedOption, selectedKabupaten, selectedIndicator } = this.state
    let arrayData = []
    let selectedData = []
    if(selectedOption.value === 'health') {
      selectedData = healthData
    } else {
      selectedData = educationData
    }
    selectedData.filter(annualData => {
      let objectData = {}
      objectData.x = annualData.year
      annualData.indicator.map((indicatorData, indicatorIndex) => {
        if(selectedIndicator.value === indicatorData.name) {
          let axis = 'y' + (indicatorIndex + 1)
          objectData[axis] = 0
          indicatorData.kabupaten.map((kabupatenData, index) => {
            if(selectedKabupaten.value === kabupatenData.name){
              objectData[axis] = objectData[axis] + kabupatenData.quantity
            } else if(selectedKabupaten.value === 'all-selected'){
              objectData[axis] = objectData[axis] + kabupatenData.quantity
            }
          })
        } else if(selectedIndicator.value === 'all-selected') {
          let axis = 'y' + (indicatorIndex + 1)
          objectData[axis] = 0
          indicatorData.kabupaten.map((kabupatenData, index) => {
            if(selectedKabupaten.value === kabupatenData.name){
              objectData[axis] = objectData[axis] + kabupatenData.quantity
            } else if(selectedKabupaten.value === 'all-selected'){
              objectData[axis] = objectData[axis] + kabupatenData.quantity
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
      // { name: 'Ketenagakerjaan', value: 'employment' }
    ];

  handleFilterChange = (field, selected) => {
    if(field === 'selectedOption') {
      if(selected.value === 'education') {
        this.setState({
          indicatorOptions: [
            { label: 'Indeks Pembangunan Manusia', value: 'humanDevelopment' },
            { label: 'Angka Melek Huruf', value: 'literate' },
            { label: 'Angka Buta Huruf', value: 'illiterate' }
          ],
          chartConfig: {
            axes: {
              xBottom: { name: 'Year', unit: '', format: 'string' },
              yLeft: { name: 'People', unit: ' ', format: 'number' }
            },
            tooltip: {
              y1: { label: 'Indeks Pembangunan Manusia' },
              y2: { label: '' },
              y3: { label: '' },
              x: { label: 'Year' }
            },
            animation: false,
            columns: {
              x: [ 
                { label: 'year', value: 'x' } 
              ],
              y: [
                { label: 'Indeks Pembangunan Manusia', value: 'y1' },
                { label: 'Angka Melek Huruf', value: 'y2' },
                { label: 'Angka Buta Huruf', value: 'y3' }
              ]
            },
            theme: { 
              y1: { stroke: '#00B4D2', fill: '#00B4D2' },
              y2: { stroke: '#0677B3', fill: '#0677B3' },
              y3: { stroke: '#D2187C', fill: '#D2187C' }  
            }
          },
          chartDataOptions: [
            { label: 'Indeks Pembangunan Manusia', value: 'humanDevelopment' },
            { label: 'Angka Melek Huruf', value: 'literate' },
            { label: 'Angka Buta Huruf', value: 'illiterate' }
          ],
          chartDataSelected: [
            { label: 'Indeks Pembangunan Manusia', value: 'humanDevelopment' },
          ],
          selectedIndicator: {
            label: 'Indeks Pembangunan Manusia', 
            value: 'humanDevelopment'
          }
        })
      } else {
        this.setState({
          indicatorOptions: [
            { label: 'Infrastruktur Pelayanan Kesehatan', value: 'healthInfrastructure' },
            { label: 'Persentase Akses Air Minum Layak', value: 'cleanWater' }
          ],
          chartConfig: {
            axes: {
              xBottom: { name: 'Year', unit: '', format: 'string' },
              yLeft: { name: 'Unit', unit: 'unit', format: 'number' }
            },
            tooltip: {
              y1: { label: 'Infrastruktur Pelayanan Kesehatan' },
              y2: {label: ''},
              x: { label: 'Year' }
            },
            animation: false,
            columns: {
              x: [ 
                { label: 'year', value: 'x' } 
              ],
              y: [
                { label: 'Infrastruktur Pelayanan Kesehatan', value: 'y1' },
                { label: 'Persentase Akses Air Minum Layak', value: 'y2' },
              ]
            },
            theme: { 
              y1: { stroke: '#00B4D2', fill: '#00B4D2' },
              y2: { stroke: '#0677B3', fill: '#0677B3' }
            }
          },
          chartDataOptions: [
            { label: 'Infrastruktur Pelayanan Kesehatan', value: 'healthInfrastructure' },
            { label: 'Persentase Akses Air Minum Layak', value: 'cleanWater' }
          ],
          chartDataSelected: [
            { label: 'Infrastruktur Pelayanan Kesehatan', value: 'healthInfrastructure' }
          ],
          selectedIndicator: {
            label: 'Infrastruktur Pelayanan Kesehatan', 
            value: 'healthInfrastructure' 
          }
        })
      }

      this.setState({ 
        [field]: selected,
        selectedKabupaten: {value: 'all-selected', 'label': 'All Selected'},
      }, () => {
        this.getChartData()
      });
    } else {
      let unit = this.state.chartConfig
      let tooltip = this.state.chartConfig
      let index = this.state.indicatorOptions.indexOf(selected)
      let axis = 'y' + (index + 1)
      tooltip.tooltip = {
        y1: {label: ''},
        y2: {label: ''},
        y3: {label: ''},
        x: {label: 'year'}
      }
      tooltip.tooltip[axis].label = selected.label
      if(selected.value === 'cleanWater') {
        unit.axes.yLeft.unit = '%'
        this.setState({ unit })
      } else {
        unit.axes.yLeft.unit = 'unit'
        this.setState({ unit })
      }

      this.setState({ [field]: selected, chartDataSelected: [selected], tooltip }, () => {
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

  numberFormat(value) {
    if(value>=1000000) {
      value=(value/1000000)+" Juta"
    } else if(value>=1000) {
      value=(value/1000)+" Ribu";
    }
    return value;
  }

  render() {
    const { t, provinceISO } = this.props;
    const { selectedOption, selectedIndicator, selectedKabupaten, chartData, chartConfig, chartDataOptions, chartDataSelected, chartDomain, indicatorOptions, kabupatenOptions } = this.state;
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
              showUnit
              getCustomYLabelFormat={value => this.numberFormat(value)}
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
