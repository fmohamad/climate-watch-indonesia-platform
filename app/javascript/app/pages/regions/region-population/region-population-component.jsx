import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Switch, Card, Dropdown } from 'cw-components';
import { TabletLandscape } from 'components/responsive';

import dropdownStyles from 'styles/dropdown';
import styles from './region-population-styles';

const chartData = {
  "data": [
    {
      "x": 2010,
      "yIdn": 238500
    },
    {
      "x": 2011,
      "yIdn": 242000
    },
    {
      "x": 2012,
      "yIdn": 245400
    },
    {
      "x": 2013,
      "yIdn": 248800
    },
    {
      "x": 2014,
      "yIdn": 252200
    },
    {
      "x": 2015,
      "yIdn": 255500
    },
    {
      "x": 2016,
      "yIdn": 258700
    },
    {
      "x": 2017,
      "yIdn": 261890.9
    }
  ],
  "domain": {
    "x": [
      "auto",
      "auto"
    ],
    "y": [
      0,
      "auto"
    ]
  },
  "config": {
    "axes": {
      "xBottom": {
        "name": "Year",
        "unit": "",
        "format": "string"
      },
      "yLeft": {
        "name": "People",
        "unit": "",
        "format": "number"
      }
    },
    "tooltip": {
      "yIdn": {
        "label": "Indonesia"
      },
      "x": {
        "label": "Year"
      },
      "indicator": "People",
      "theme": {
        "yIdn": {
          "stroke": "#00B4D2",
          "fill": "#00B4D2"
        }
      }
    },
    "animation": false,
    "columns": {
      "x": [
        {
          "label": "year",
          "value": "x"
        }
      ],
      "y": [
        {
          "label": "Indonesia",
          "value": "yIdn"
        }
      ]
    },
    "theme": {
      "yIdn": {
        "stroke": "#00B4D2",
        "fill": "#00B4D2"
      }
    }
  },
  "dataOptions": [
    {
      "label": "Indonesia",
      "value": "IDN"
    },
    {
      "label": "Aceh",
      "value": "ID.AC"
    },
    {
      "label": "Bali",
      "value": "ID.BA"
    },
    {
      "label": "Bangka Belitung Islands",
      "value": "ID.BB"
    },
    {
      "label": "Bengkulu",
      "value": "ID.BE"
    },
    {
      "label": "Banten",
      "value": "ID.BT"
    },
    {
      "label": "Gorontalo",
      "value": "ID.GO"
    },
    {
      "label": "Jambi",
      "value": "ID.JA"
    },
    {
      "label": "West Java",
      "value": "ID.JB"
    },
    {
      "label": "East Java",
      "value": "ID.JI"
    },
    {
      "label": "Special Capitol Region of Jakarta",
      "value": "ID.JK"
    },
    {
      "label": "Central Java",
      "value": "ID.JT"
    },
    {
      "label": "West Kalimantan",
      "value": "ID.KB"
    },
    {
      "label": "East Kalimantan",
      "value": "ID.KI"
    },
    {
      "label": "Riau Islands",
      "value": "ID.KR"
    },
    {
      "label": "South Kalimantan",
      "value": "ID.KS"
    },
    {
      "label": "Central Kalimantan",
      "value": "ID.KT"
    },
    {
      "label": "North Kalimantan",
      "value": "ID.KU"
    },
    {
      "label": "Lampung",
      "value": "ID.LA"
    },
    {
      "label": "Maluku",
      "value": "ID.MA"
    },
    {
      "label": "North Maluku",
      "value": "ID.MU"
    },
    {
      "label": "West Nusa Tenggara",
      "value": "ID.NB"
    },
    {
      "label": "East Nusa Tenggara Timur",
      "value": "ID.NT"
    },
    {
      "label": "Papua",
      "value": "ID.PA"
    },
    {
      "label": "West Papua",
      "value": "ID.PB"
    },
    {
      "label": "Riau",
      "value": "ID.RI"
    },
    {
      "label": "North Sulawesi",
      "value": "ID.SA"
    },
    {
      "label": "West Sumatera",
      "value": "ID.SB"
    },
    {
      "label": "Southeast Sulawesi",
      "value": "ID.SG"
    },
    {
      "label": "South Sulawesi",
      "value": "ID.SN"
    },
    {
      "label": "West Sulawesi",
      "value": "ID.SR"
    },
    {
      "label": "South Sumatera",
      "value": "ID.SS"
    },
    {
      "label": "Central Sulawesi",
      "value": "ID.ST"
    },
    {
      "label": "North Sumatera",
      "value": "ID.SU"
    },
    {
      "label": "Special Region of Yogyakarta",
      "value": "ID.YO"
    }
  ],
  "dataSelected": [
    {
      "value": "IDN",
      "label": "Indonesia"
    }
  ]
}

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
      }
    };
  }

  getOptions = () => {
    return [
      {
        name: 'Populasi', 
        value: 'population'
      },
      {
        name: 'Distribusi Kelompok Umur',
        value: 'distribution'
      }
    ];
  };

  handleFilterChange = (field, selected) => {
    this.setState({
      selectedOption: selected
    })
  };

  renderSwitch() {
    const { selectedOption } = this.state
    console.log('selectedOption', selectedOption);
    return (
      <div className={styles.switch}>
        <div className="switch-container">
          <Switch
            options={this.getOptions()}
            onClick={value => this.handleFilterChange('source', value)}
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
    const { t } = this.props
    const { selectedOption } = this.state

    if(selectedOption.value === 'population') {
      return(
        <div className={styles.chartMapContainer}>
          <div className={styles.filtersChartContainer}>
            <div className={styles.chartContainer}>map</div>
          </div>
          <div className={styles.cardContainer}>
            <Card
              theme={cardTheme}
              title="Total Populasi Penduduk (Kabupaten)"
            >
              <div className={styles.cardContent}>
                <p>
                  2.7 Juta
                </p>
              </div>
            </Card>
            <Card
              theme={cardTheme}
              title="Laju pertumbuhan penduduk per tahun"
            >
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
      )
    } else {
      return(
        <div className={styles.container}>
          <div className={styles.toolbox}>
            <div className={styles.dropdownContainer}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={'year'}
                  label={'Tahun'}
                  placeholder={`Filter by`}
                  // options={nationalIndicatorsOptions}
                  // onValueChange={onIndicatorChange}
                  // value={selectedIndicator}
                  theme={{ select: dropdownStyles.select }}
                  hideResetButton
                />
              </div>
              <div className={styles.dropdown}>
                <Dropdown
                  key={'year'}
                  label={'Indikator'}
                  placeholder={`Filter by`}
                  // options={nationalIndicatorsOptions}
                  // onValueChange={onIndicatorChange}
                  // value={selectedIndicator}
                  theme={{ select: dropdownStyles.select }}
                  hideResetButton
                />
              </div>
            </div>
            <InfoDownloadToolbox
              className={{ buttonWrapper: styles.buttonWrapper }}
              // slugs={sources}
              // downloadUri={downloadURI}
            />
          </div>
          <Chart
            type="bar"
            config={chartData.config}
            data={chartData.data}
            theme={{ legend: styles.legend }}
            // customTooltip={<CustomTooltip />}
            getCustomYLabelFormat={chartData.config.yLabelFormat}
            domain={chartData.domain}
            dataOptions={chartData.dataOptions}
            dataSelected={chartData.dataSelected}
            height={300}
            barSize={30}
            customMessage={t('common.chart-no-data')}
            // onLegendChange={onLegendChange}
          />
        </div>
      )
    }
  }

  render() {
    const { t, chartData, selectedIndicator, provinceISO } = this.props;
    const { selectedOption } = this.state
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
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <InfoDownloadToolbox
              className={{ buttonWrapper: styles.buttonWrapper }}
              slugs={sources}
              downloadUri={downloadURI}
            />
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
