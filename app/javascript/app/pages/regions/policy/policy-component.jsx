import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { format } from 'd3-format';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Switch, Card, Dropdown, Button, Icon } from 'cw-components';
import { TabletLandscape } from 'components/responsive';
import dropdownStyles from 'styles/dropdown';
import buttonThemes from 'styles/themes/button';
import shareIcon from 'assets/icons/share';

import styles from './policy-styles';

const cardTheme = {
  card: styles.card,
  contentContainer: styles.contentContainer,
  data: styles.data,
  title: styles.title
};

class Policy extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      chartData: {
        "data": [
          {
            "x": 2016,
            "y1": 84.51,
            "y2": 80,
            "y3": 75
          },
          {
            "x": 2017,
            "y1": 84.51,
            "y2": 82,
            "y3": 76
          },
          {
            "x": 2018,
            "y1": 82,
            "y2": 82,
            "y3": 78
          },
          {
            "x": 2019,
            "y1": 80,
            "y2": 85,
            "y3": 80
          },
          {
            "x": 2020,
            "y1": 81,
            "y2": 85,
            "y3": 80
          },
          {
            "x": 2021,
            "y1": 82,
            "y2": 86,
            "y3": 82
          },
          {
            "x": 2022,
            "y1": 82,
            "y2": 88,
            "y3": 83
          }
        ],
        "projectedData": null,
        "config": {
          "axes": {
            "xBottom": {
              "name": "Year",
              "unit": "date",
              "format": "YYYY"
            },
            "yLeft": {
              "name": "Percent",
              "unit": "",
              "format": "number"
            }
          },
          "theme": {
            "y1": {
              "stroke": "#00B4D2",
              "fill": "#00B4D2"
            },
            "y2": {
              "stroke": "#0677B3",
              "fill": "#0677B3"
            },
            "y3": {
              "stroke": "#D2187C",
              "fill": "#D2187C"
            }
          },
          "tooltip": {
            "y1": {
              "label": "Indeks Lingkungan Hidup"
            },
            "y2": {
              "label": "Persentase Timbulan Sampah"
            },
            "y3": {
              "label": "Target Penurunan Timbulan Sampah"
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
                "label": "Indeks Lingkungan Hidup",
                "value": "y1",
              },
              {
                "label": "Persentase Timbulan Sampah",
                "value": "y2",
              },
              {
                "label": "Target Penurunan Timbulan Sampah",
                "value": "y3",
              }
            ]
          }
        },
        "loading": false,
        "dataOptions": [
          {
            "label": "Indeks Lingkungan Hidup",
            "value": "2",
          },
          {
            "label": "Persentase Timbulan Sampah",
            "value": "3",
          },
          {
            "label": "Target Penurunan Timbulan Sampah",
            "value": "4",
          }
        ],
        "dataSelected": [
          {
            "label": "Indeks Lingkungan Hidup",
            "value": "2",
          },
          {
            "label": "Persentase Timbulan Sampah",
            "value": "3",
          },
          {
            "label": "Target Penurunan Timbulan Sampah",
            "value": "4",
          }
        ]
      },
      indicatorOptions: [
        {
         "label": "All Selected",
          "value": "1",
        },
        {
          "label": "Indeks Lingkungan Hidup",
          "value": "2",
        },
        {
          "label": "Persentase Timbulan Sampah",
          "value": "3",
        },
        {
          "label": "Target Penurunan Timbulan Sampah",
          "value": "4",
        }
      ],
      selectedIndicator: {
       "label": "All Selected",
        "value": "1",
      }
    };
  }

  handleFilterChange = (field, selected) => {
    const { selectedIndicator, chartData } = this.state;
    let config = chartData.config

    if(selected.value === '2') {
      config.columns = {
        "x": [
          {
            "label": "year",
            "value": "x"
          }
        ],
        "y": [
          {
            "label": "Indeks Lingkungan Hidup",
            "value": "y1",
          }
        ]
      }
      this.setState({ config })
    } else if(selected.value === '3') {
      config.columns = {
        "x": [
          {
            "label": "year",
            "value": "x"
          }
        ],
        "y": [
          {
            "label": "Persentase Timbulan Sampah",
            "value": "y2",
          }
        ]
      }
      this.setState({ config })
    } else if(selected.value === '4'){
      config.columns = {
        "x": [
          {
            "label": "year",
            "value": "x"
          }
        ],
        "y": [
          {
            "label": "Target Penurunan Timbulan Sampah",
            "value": "y3",
          }
        ]
      } 
      this.setState({ config })
    } else {
      config.columns = {
        "x": [
          {
            "label": "year",
            "value": "x"
          }
        ],
        "y": [
          {
            "label": "Indeks Lingkungan Hidup",
            "value": "y1",
          },
          {
            "label": "Persentase Timbulan Sampah",
            "value": "y2",
          },
          {
            "label": "Target Penurunan Timbulan Sampah",
            "value": "y3",
          }
        ]
      }
      this.setState({ config })
    }

    this.setState({ [field]: selected });
  };

  render() {
    const { t, provinceISO } = this.props;
    const { chartData, indicatorOptions, selectedIndicator } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.chartMapContainer}>
          <div>
            <SectionTitle
              title={t('pages.regions.policy.title')}
              description={t('pages.regions.policy.description')}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <Button
                theme={{
                    button: cx(styles.button)
                  }}
              >
                <p>Share | <Icon icon={shareIcon} /></p>
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.cardContainer}>
          <div>
            <SectionTitle
              title={'Tujuan'}
            />
            <p>
              Tujuan implemantasi Strategi dan Rencana Aksi di Provinsi Papua Barat
            </p>
            <br/>
            <div className={styles.card}>
              <ul>
                <li>
                  <span className={styles.number}>
                    1
                  </span>
                  <span className={styles.cardContent}>
                    Mengurangi degradasi dan deforestasi akibat konversi lahan hutan dan alih fungsi kawasan hutan.
                  </span>
                </li>
                <li>
                  <span className={styles.number}>
                    2
                  </span>
                  <span className={styles.cardContent}>
                    Meningkatkan upaya-upaya rehabilitasi lahan kritis dan pengembangan hutan tanaman rakyat.
                  </span>
                </li>
                <li>
                  <span className={styles.number}>
                    3
                  </span>
                  <span className={styles.cardContent}>
                    Mengembangkan ekonomi kerakyatan sektor kehutanan melalui usaha pemanfaatan hasil hutan non kayu dan jasa hutan
                  </span>
                </li>
                <li>
                  <span className={styles.number}>
                    4
                  </span>
                  <span className={styles.cardContent}>
                    Meningkatkan kapasitas masyarakat dalam rangka adaptasi gejala perubahan iklim, resiko bencana dan kerawanan pangan.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <SectionTitle
              title={'Sasaran'}
            />
            <p>
              Sasaran implementasi Strategi dan Rencana Aksi di Provinsi Papua Barat
            </p>
            <br/>
            <div className={styles.card}>
              <ul>
                <li>
                  <span className={styles.number}>
                    1
                  </span>
                  <span className={styles.cardContent}>
                    Mengurangi degradasi dan deforestasi akibat konversi lahan hutan dan alih fungsi kawasan hutan.
                  </span>
                </li>
                <li>
                  <span className={styles.number}>
                    2
                  </span>
                  <span className={styles.cardContent}>
                    Meningkatkan upaya-upaya rehabilitasi lahan kritis dan pengembangan hutan tanaman rakyat.
                  </span>
                </li>
                <li>
                  <span className={styles.number}>
                    3
                  </span>
                  <span className={styles.cardContent}>
                    Mengembangkan ekonomi kerakyatan sektor kehutanan melalui usaha pemanfaatan hasil hutan non kayu dan jasa hutan
                  </span>
                </li>
                <li>
                  <span className={styles.number}>
                    4
                  </span>
                  <span className={styles.cardContent}>
                    Meningkatkan kapasitas masyarakat dalam rangka adaptasi gejala perubahan iklim, resiko bencana dan kerawanan pangan.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.chartMapContainer}>
            <div>
              <SectionTitle
                title={'Alur Kebijakan'}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <InfoDownloadToolbox
                className={{ buttonWrapper: styles.buttonWrapper }}
                slugs={'sources'}
                downloadUri={'downloadURI'}
                pdfUri="pdfuri"
                shareableLink="link"
              />
            </div>
          </div>
          <div style={{width: '25%'}}>
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
          <Chart
            theme={{
              legend: styles.legend,
              projectedLegend: styles.projectedLegend
            }}
            type="line"
            config={chartData.config}
            data={chartData.data}
            projectedData={chartData.projectedData || []}
            domain={chartData.domain}
            dataOptions={chartData.dataOptions}
            dataSelected={chartData.dataSelected}
            height={500}
            loading={chartData.loading}
            getCustomYLabelFormat={value => format('.3s')(value)}
            showUnit
            // onLegendChange={v => this.handleFilterChange('sector', v)}
            // onMouseMove={onYearChange}
          />
          <div>
            <table>
              <tr>
                <th>Tahun</th>
                <th>Rencana</th>
                <th>Aktualisasi</th>
                <th>Deskripsi</th>
              </tr>
              <br/>
              <tr>
                <td>2016</td>
                <td>84.51%</td>
                <td>0%</td>
                <td>Indeks lingkungan hidup</td>
              </tr>
              <tr>
                <td>2017</td>
                <td>84.51%</td>
                <td>0%</td>
                <td>Indeks lingkungan hidup</td>
              </tr>
              <tr>
                <td>2018</td>
                <td>82%</td>
                <td>0%</td>
                <td>Indeks lingkungan hidup</td>
              </tr>
              <tr>
                <td>2019</td>
                <td>80%</td>
                <td>0%</td>
                <td>Indeks lingkungan hidup</td>
              </tr>
              <tr>
                <td>2020</td>
                <td>81%</td>
                <td>0%</td>
                <td>Indeks lingkungan hidup</td>
              </tr>
              <tr>
                <td>2021</td>
                <td>82%</td>
                <td>0%</td>
                <td>Indeks lingkungan hidup</td>
              </tr>
              <tr>
                <td>2022</td>
                <td>82%</td>
                <td>0%</td>
                <td>Indeks lingkungan hidup</td>
              </tr>
              <tr>
                <td>2016</td>
                <td>80%</td>
                <td>0%</td>
                <td>Persentase timbulan sampah</td>
              </tr>
              <tr>
                <td>2017</td>
                <td>82%</td>
                <td>0%</td>
                <td>Persentase timbulan sampah</td>
              </tr>
              <tr>
                <td>2018</td>
                <td>82%</td>
                <td>0%</td>
                <td>Persentase timbulan sampah</td>
              </tr>
              <tr>
                <td>2019</td>
                <td>85%</td>
                <td>0%</td>
                <td>Persentase timbulan sampah</td>
              </tr>
              <tr>
                <td>2020</td>
                <td>85%</td>
                <td>0%</td>
                <td>Persentase timbulan sampah</td>
              </tr>
              <tr>
                <td>2021</td>
                <td>86%</td>
                <td>0%</td>
                <td>Persentase timbulan sampah</td>
              </tr>
              <tr>
                <td>2022</td>
                <td>88%</td>
                <td>0%</td>
                <td>Persentase timbulan sampah</td>
              </tr>
              <tr>
                <td>2016</td>
                <td>75%</td>
                <td>0%</td>
                <td>Target penurunan timbulan sampah</td>
              </tr>
              <tr>
                <td>2017</td>
                <td>76%</td>
                <td>0%</td>
                <td>Target penurunan timbulan sampah</td>
              </tr>
              <tr>
                <td>2018</td>
                <td>78%</td>
                <td>0%</td>
                <td>Target penurunan timbulan sampah</td>
              </tr>
              <tr>
                <td>2019</td>
                <td>80%</td>
                <td>0%</td>
                <td>Target penurunan timbulan sampah</td>
              </tr>
              <tr>
                <td>2020</td>
                <td>80%</td>
                <td>0%</td>
                <td>Target penurunan timbulan sampah</td>
              </tr>
              <tr>
                <td>2021</td>
                <td>82%</td>
                <td>0%</td>
                <td>Target penurunan timbulan sampah</td>
              </tr>
              <tr>
                <td>2022</td>
                <td>83%</td>
                <td>0%</td>
                <td>Target penurunan timbulan sampah</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

Policy.propTypes = {
  t: PropTypes.func.isRequired,
  provinceISO: PropTypes.string
};

Policy.defaultProps = { 
};

export default Policy;
