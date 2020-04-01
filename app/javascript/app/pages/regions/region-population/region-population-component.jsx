import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Switch, Card } from 'cw-components';
import { TabletLandscape } from 'components/responsive';

import dropdownStyles from 'styles/dropdown';
import styles from './region-population-styles';

const selectedOptions = {
  source: {
    label: 'POPULASI',
    name: 'POPULASI',
    value: 'POPULATION',
    api: 'INDO'
  },
  chartType: { label: 'line', value: 'line' },
  breakBy: { label: 'Region - Absolute', value: 'region-absolute' },
  region: { label: 'National', value: '1', code: 'IDN', override: true },
  sector: { value: 'all-selected', label: 'All Selected', override: true },
  gas: { label: 'All GHG', value: '3', code: 'ALL_GHG' }
};

const filterOptions = {
  source: [
    { label: 'POPULASI', name: 'POPULASI', value: 'POPULATION', api: 'INDO' },
    {
      label: 'DISTRIBUSI KELOMPOK UMUR',
      name: 'DISTRIBUSI KELOMPOK UMUR',
      value: 'AGE',
      api: 'CW'
    }
  ]
};

const cardTheme = {
  card: styles.card,
  contentContainer: styles.contentContainer,
  data: styles.data,
  title: styles.title
};

class RegionPopulation extends PureComponent {
  renderSwitch() {
    // const { filterOptions, selectedOptions } = this.props;
    return selectedOptions.source && (
    <div className={styles.switch}>
      <div className="switch-container">
        <Switch
          options={filterOptions.source}
          onClick={value => this.handleFilterChange('source', value)}
          selectedOption={String(selectedOptions.source.value)}
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
    const { t, chartData, selectedIndicator, provinceISO } = this.props;
    const sources = [ 'RADGRK', 'SIGNSa' ];
    const downloadURI = `emissions/download?source=${sources.join(
      ','
    )}&location=${provinceISO}`;

    return (
      <div className={styles.page}>
        <div className={styles.chartMapContainer}>
          <div>
            <SectionTitle
              title={t('pages.regions.region-population.title')}
              description={t('pages.regions.region-population.description')}
            />
          </div>
          <div>
            <InfoDownloadToolbox
              className={{ buttonWrapper: styles.buttonWrapper }}
              slugs={sources}
              downloadUri={downloadURI}
            />
          </div>
        </div>
        <div>
          <div className={styles.chartMapContainer}>
            <div className={styles.filtersChartContainer}>
              <div className={styles.dropdowns}>
                {this.renderSwitch()}
              </div>
              <div className={styles.chartContainer} />
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
