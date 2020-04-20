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
            "x": 2010,
            "y3": -14069940,
            "y4": 94960
          },
          {
            "x": 2011,
            "y3": -14702640,
            "y4": 114610
          },
          {
            "x": 2012,
            "y3": -18262560,
            "y4": 125920
          },
          {
            "x": 2013,
            "y3": -11824590,
            "y4": 135910
          },
          {
            "x": 2014,
            "y3": -11824590,
            "y4": 102220
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
              "name": "Emissions",
              "unit": "tCO2e",
              "format": "number"
            }
          },
          "theme": {
            "y4": {
              "stroke": "#00B4D2",
              "fill": "#00B4D2"
            },
            "y3": {
              "stroke": "#D2187C",
              "fill": "#D2187C"
            },
            "y5": {
              "stroke": "#FF7800",
              "fill": "#FF7800"
            },
            "y6": {
              "stroke": "#FFB400",
              "fill": "#FFB400"
            },
            "y2": {
              "stroke": "#0677B3",
              "fill": "#0677B3"
            }
          },
          "tooltip": {
            "y4": {
              "label": "Indeks Lingkungan Hidup"
            },
            "y3": {
              "label": "Indeks Kualitas Air"
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
                "value": "y4",
              },
              {
                "label": "Indeks Kualitas Air",
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
            "label": "Indeks Kualitas Air",
            "value": "3",
          }
        ],
        "dataSelected": [
          {
            "label": "Indeks Lingkungan Hidup",
            "value": "2",
          },
          {
            "label": "Indeks Kualitas Air",
            "value": "3",
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
          "label": "Indeks Kualitas Air",
          "value": "3",
        }
      ],
      indicatorSelected: {
       "label": "All Selected",
        "value": "1",
      }
    };
  }

  render() {
    const { t, selectedIndicator, provinceISO } = this.props;
    const { chartData, indicatorOptions, indicatorSelected } = this.state;

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
              // onValueChange={value => this.handleFilterChange('selectedGender', value)}
              value={indicatorSelected}
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
                <td>14%</td>
                <td>8%</td>
                <td>Tahun Dasar</td>
              </tr>
              <tr>
                <td>2017</td>
                <td>20%</td>
                <td>12%</td>
                <td>Tahun Dasar</td>
              </tr>
              <tr>
                <td>2018</td>
                <td>25%</td>
                <td>18%</td>
                <td>Tahun Dasar</td>
              </tr>
              <tr>
                <td>2019</td>
                <td>30%</td>
                <td>25%</td>
                <td>Tahun Dasar</td>
              </tr>
              <tr>
                <td>2020</td>
                <td>30%</td>
                <td>25%</td>
                <td>Tahun Dasar</td>
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
  selectedIndicator: PropTypes.object,
  provinceISO: PropTypes.string
};

Policy.defaultProps = { 
  selectedIndicator: {},
};

export default Policy;
