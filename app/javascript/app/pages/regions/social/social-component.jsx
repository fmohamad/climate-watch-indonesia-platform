import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Switch, Card, Dropdown, Button } from 'cw-components';
import { TabletLandscape } from 'components/responsive';
import cx from 'classnames';

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
  { value: 'all-selected', label: 'Indikator', override: true },
  { label: 'PDRB', value: '1' },
  { label: 'PDRB per kapita', value: '2' },
  { label: 'Pertumbuhan Ekonomi', value: '3' },
  { label: 'PDRB menurut lapangan usaha', value: '4' },
  { label: 'Indeks rasio gini', value: '5' }
];

const kabupatenOptions = [
  { value: 'all-selected', label: 'Kabupaten', override: true },
  { label: 'Fakfak', value: 'fakfak' },
  { label: 'Kaimana', value: 'kaimana' },
  { label: 'Manokwari', value: 'manokwari' },
  { label: 'Manokwari Selatan', value: 'manokwari_selatan' },
  { label: 'Maybrat', value: 'maybrat' },
  { label: 'Pegunungan Arfak', value: 'pegunungan_arfak' },
  { label: 'Raja Ampat', value: 'raja_ampat' },
  { label: 'Sorong', value: 'sorong' }
];

const sectorOptions = [
  { value: 'all-selected', label: 'Sektor', override: true },
  { label: 'Pertanian, kehutanan dan perikanan', value: '1' },
  { label: 'Pertambangan dan penggalian', value: '2' },
  { label: 'Industri pengolahan', value: '3' },
  { label: 'Pengadaan listrik dan gas', value: '4' }
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
        label: 'Indikator'
      },
      selectedKabupaten: {
         value: 'all-selected',
        label: 'Kabupaten'
      },
      selectedSector: {
        value: 'all-selected', 
        label: 'Sektor'
      }
    };
  }

  getOptions = () => [
      { name: 'Pendidikan', value: 'education' },
      { name: 'Kesehatan', value: 'health' },
      { name: 'Ketenagakerjaan', value: 'employment' }
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

  render() {
    const { t, chartData, provinceISO } = this.props;
    const { selectedOption, selectedIndicator, selectedKabupaten, selectedSector } = this.state;
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
                </div>
                {}
              </div>
              <Button theme={{ button: cx(button.darkBlue, styles.button) }}>
                Jelajahi di Tingkat Nasional
              </Button>
            </div>
            <Chart
              type="bar"
              config={chartData.config}
              data={chartData.data}
              theme={{ legend: styles.legend }}
              /* customTooltip={<CustomTooltip />} */
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
        </div>
      </div>
    );
  }
}

RegionPopulation.propTypes = {
  t: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  provinceISO: PropTypes.string
};

RegionPopulation.defaultProps = {
  chartData: {
    data: [
      { x: 2010, yIdn: 238500 },
      { x: 2011, yIdn: 242000 },
      { x: 2012, yIdn: 245400 },
      { x: 2013, yIdn: 248800 },
      { x: 2014, yIdn: 252200 },
      { x: 2015, yIdn: 255500 },
      { x: 2016, yIdn: 258700 },
      { x: 2017, yIdn: 261890.9 }
    ],
    domain: { x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] },
    config: {
      axes: {
        xBottom: { name: 'Year', unit: '', format: 'string' },
        yLeft: { name: 'People', unit: '', format: 'number' }
      },
      tooltip: {
        yIdn: { label: 'Indonesia' },
        x: { label: 'Year' },
        indicator: 'People',
        theme: { yIdn: { stroke: '#00B4D2', fill: '#00B4D2' } }
      },
      animation: false,
      columns: {
        x: [ { label: 'year', value: 'x' } ],
        y: [ { label: 'Indonesia', value: 'yIdn' } ]
      },
      theme: { yIdn: { stroke: '#00B4D2', fill: '#00B4D2' } }
    },
    dataOptions: [
      { label: 'Indonesia', value: 'IDN' },
      { label: 'Aceh', value: 'ID.AC' },
      { label: 'Bali', value: 'ID.BA' },
      { label: 'Bangka Belitung Islands', value: 'ID.BB' },
      { label: 'Bengkulu', value: 'ID.BE' },
      { label: 'Banten', value: 'ID.BT' },
      { label: 'Gorontalo', value: 'ID.GO' },
      { label: 'Jambi', value: 'ID.JA' },
      { label: 'West Java', value: 'ID.JB' },
      { label: 'East Java', value: 'ID.JI' },
      { label: 'Special Capitol Region of Jakarta', value: 'ID.JK' },
      { label: 'Central Java', value: 'ID.JT' },
      { label: 'West Kalimantan', value: 'ID.KB' },
      { label: 'East Kalimantan', value: 'ID.KI' },
      { label: 'Riau Islands', value: 'ID.KR' },
      { label: 'South Kalimantan', value: 'ID.KS' },
      { label: 'Central Kalimantan', value: 'ID.KT' },
      { label: 'North Kalimantan', value: 'ID.KU' },
      { label: 'Lampung', value: 'ID.LA' },
      { label: 'Maluku', value: 'ID.MA' },
      { label: 'North Maluku', value: 'ID.MU' },
      { label: 'West Nusa Tenggara', value: 'ID.NB' },
      { label: 'East Nusa Tenggara Timur', value: 'ID.NT' },
      { label: 'Papua', value: 'ID.PA' },
      { label: 'West Papua', value: 'ID.PB' },
      { label: 'Riau', value: 'ID.RI' },
      { label: 'North Sulawesi', value: 'ID.SA' },
      { label: 'West Sumatera', value: 'ID.SB' },
      { label: 'Southeast Sulawesi', value: 'ID.SG' },
      { label: 'South Sulawesi', value: 'ID.SN' },
      { label: 'West Sulawesi', value: 'ID.SR' },
      { label: 'South Sumatera', value: 'ID.SS' },
      { label: 'Central Sulawesi', value: 'ID.ST' },
      { label: 'North Sumatera', value: 'ID.SU' },
      { label: 'Special Region of Yogyakarta', value: 'ID.YO' }
    ],
    dataSelected: [ { value: 'IDN', label: 'Indonesia' } ]
  }
};

export default RegionPopulation;
