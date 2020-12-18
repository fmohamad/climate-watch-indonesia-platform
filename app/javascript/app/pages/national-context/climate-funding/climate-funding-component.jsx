import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Table, Dropdown, Button, Icon } from 'cw-components';
import ModalShare from 'components/modal-share';
import cx from 'classnames'
import kebabCase from 'lodash/kebabCase';
import startCase from 'lodash/startCase';
import castArray from 'lodash/castArray';
import filter from 'lodash/filter'
import uniq from 'lodash/uniq';
import flatMap from 'lodash/flatMap';
import { renameKeys } from 'utils';
import SectionTitle from 'components/section-title';
import FundingOportunitiesProvider from 'providers/funding-oportunities-provider';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import shareIcon from 'assets/icons/share';
import styles from './climate-funding-styles.scss';
import dropdownStyles from 'styles/dropdown.scss';

const setColumnWidth = columnName => {
  const narrowColumns = [ 'website_link' ];
  if (narrowColumns.includes(columnName)) return 80;
  return null;
};

class ClimateFunding extends PureComponent {
  constructor(props) {
    super(props);
  
    this.state = {
      isOpen: false,
      sectors: [
        {
          label: 'Kehutanan & REDD+',
          value: 'Kehutanan & REDD+'
        },
        {
          label: 'Pertanian',
          value: 'Pertanian'
        },
        {
          label: 'Efisiensi Energi',
          value: 'Efisiensi Energi'
        },
        {
          label: 'Infrastruktur dan Industri',
          value: 'Infrastruktur dan Industri'
        },
        {
          label: 'Energi Terbarukan',
          value: 'Energi Terbarukan'
        },
        {
          label: 'Transportasi',
          value: 'Transportasi'
        },
        {
          label: 'Perubahan Iklim / Umum',
          value: 'Perubahan Iklim / Umum'
        },
        {
          label: 'Bantuan Keuangan',
          value: 'Bantuan Keuangan'
        },
        {
          label: 'Bantuan Teknis',
          value: 'Bantuan Teknis'
        },
        {
          label: 'Peningkatan Kapasitas',
          value: 'Peningkatan Kapasitas'
        },
        {
          label: 'Penggunaan Lahan',
          value: 'Penggunaan Lahan'
        },
        {
          label: 'Adaptasi Ekosistem',
          value: 'Adaptasi Ekosistem'
        },
        {
          label: 'Air',
          value: 'Air'
        },
        {
          label: 'Adaptasi Berbasis Masyarakat',
          value: 'Adaptasi Berbasis Masyarakat'
        },
        {
          label: 'Adaptasi Perkotaan',
          value: 'Adaptasi Perkotaan'
        },
        {
          label: 'Perubahan Iklim (Umum)',
          value: 'Perubahan Iklim (Umum)'
        },
        {
          label: 'Gender',
          value: 'Gender'
        },
        {
          label: 'Limbah',
          value: 'Limbah'
        },
        {
          label: 'Lainnya',
          value: 'Lainnya'
        }
      ],
      selectedSector: {
        label: '',
        value: ''
      },
      supports: [
        {
          label: 'Bantuan Keuangan',
          value: 'Bantuan Keuangan'
        },
        {
          label: 'Bantuan Teknis',
          value: 'Bantuan Teknis'
        },
        {
          label: 'Peningkatan Kapasitas',
          value: 'Peningkatan Kapasitas'
        },
        {
          label: 'Perubahan Iklim (Umum)',
          value: 'Perubahan Iklim (Umum)'
        },
        {
          label: 'Lainnya',
          value: 'Lainnya'
        }
      ],
      selectedSupport: {
        label: '',
        value: ''
      },
      searchValue: '',
      data: [],
      filteredData: []
    };
  }

  componentDidUpdate(prevProps) {
    /*this.setState({
      data: this.props.data
    })*/
    if(this.props.data !== prevProps.data) {
      /*const filteredTableData = filter(this.props.data, function(item) {
        return item.mode_of_support.indexOf(this.state.selectedSupport.value) !== -1
      })*/
      this.setState({
        data: this.props.data
      })
    }
    /*const filteredData = filter(this.state.data, function(item) {
      return item.mode_of_support.indexOf('Bantuan Keuangan') !== -1
    })*/
  }

  filterData() {
    const {selectedSector, selectedSupport, data} = this.state
    const filteredSectorData = filter(data, function(item) {
      return item.sectors_and_topics.indexOf(selectedSector.value) !== -1
    })

    const filteredSupportData = filter(filteredSectorData, function(item) {
      return item.mode_of_support.indexOf(selectedSupport.value) !== -1
    })

    this.setState({
      data: filteredSupportData
    })
    console.log('this.state.data', this.state.data);
  }

  handleFilterChange = (field, selected) => {
    const { onSearchChange } = this.props;
    /*const prevSelectedOptionValues = castArray(selectedOptions[field])
      .filter(o => o)
      .map(o => o.value);*/
    /*const selectedArray = castArray(selected);
    const newSelectedOption = selectedArray.find(
      o => !prevSelectedOptionValues.includes(o.value)
    );

    const removedAnyPreviousOverride = selectedArray
      .filter(v => v)
      .filter(v => !v.override);

    const values = newSelectedOption && newSelectedOption.override
      ? newSelectedOption.value
      : uniq(
        flatMap(removedAnyPreviousOverride, v => String(v.value).split(','))
      ).join(',');*/
    const value = selected.value
    // this.filterData(value)
    if(field === 'sector'){
      this.setState({
        selectedSector: selected
      }, () => {
        this.filterData()
        // onSearchChange(this.state.selectedSector.value);
      })
    } else {
      this.setState({
        selectedSupport: selected
      }, () => {
        this.filterData()
        // onSearchChange(this.state.selectedSector.value);
      })
    }
  };

  handleSearch = (value) => {
    const { onSearchChange } = this.props;
    onSearchChange(value);
    this.filterData()
  }

  renderDropdown(field, multi, icons) {
    /*const {
      apiSelected,
      selectedOptions,
      filterOptions,
      metricSelected,
      t
    } = this.props;
    const value = selectedOptions && selectedOptions[field];
    const options = filterOptions[field] || [];
    const iconsProp = icons ? { icons } : {};
    const isChartReady = filterOptions.source;
    if (!isChartReady) return null;*/

    const {
      t,
    } = this.props;

    const { sectors, selectedSector, supports, selectedSupport } = this.state 

    let options = []
    let value = {}
    if(field === 'sector') {
      options = sectors
      value = selectedSector
    } else {
      options = supports
      value = selectedSupport
    }

    const label = t(
      `pages.national-context.climate-funding.labels.${kebabCase(field)}`
    );

    /*if (multi) {
      const absoluteMetric = metricSelected === METRIC_OPTIONS.ABSOLUTE_VALUE;
      const disabled = apiSelected === API.indo &&
        field === 'sector' &&
        !absoluteMetric;

      const values = castArray(value).filter(v => v);

      return (
        <Multiselect
          key={field}
          label={label}
          placeholder={`Filter by ${startCase(field)}`}
          options={options}
          onValueChange={selected => this.handleFilterChange(field, selected)}
          values={values}
          theme={{ wrapper: dropdownStyles.select }}
          hideResetButton
          disabled={disabled}
        />
      );
    }*/
    return (
      <Dropdown
        key={field}
        label={label}
        placeholder={`Filter by ${startCase(field)}`}
        options={options}
        onValueChange={selected => this.handleFilterChange(field, selected)}
        value={value || null}
        theme={{ select: dropdownStyles.select }}
        hideResetButton
      />
    );
  }

  render() {
    const shareableLink = `${window.location.origin}${window.location.pathname}`
    const { isOpen } = this.state
    const { t, titleLinks, onSearchChange, sources } = this.props;
    const { data } = this.state;
    const nt = key => t(`pages.national-context.climate-funding.${key}`);

    const tableHeaders = nt('table-headers', {});
    tableHeaders.website_link = 'website_link';
    const defaultColumns = Object.values(tableHeaders);

    const tableData = data.map(d => renameKeys(d, tableHeaders));
    // console.log('tableData', tableData);
    const title = nt('title');
    const description = nt('description');

    return (
      <div className={styles.page}>
        <SectionTitle title={title} description={description} />
        <div>
          <div className={styles.actions}>
            <Input
              onChange={value => this.handleSearch(value)}
              placeholder={t(
                'pages.national-context.climate-funding.search-placeholder'
              )}
              theme={styles}
            />
            <div style={{ width: '300px' }}>
              {this.renderDropdown('support', false)}
            </div>
            <div style={{ width: '300px' }}>
              {this.renderDropdown('sector', false)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <InfoDownloadToolbox
                className={{ buttonWrapper: styles.buttonWrapper }}
                slugs={sources}
                downloadUri="funding_opportunities.zip"
                infoTooltipdata={t('common.table-data-info')}
                downloadTooltipdata={t('common.download-table-data-info')}
              />
              <Button
                theme={{ button: cx(styles.shareButton) }}
                onClick={() => this.setState({ isOpen: !isOpen })}
              >
                <Icon icon={shareIcon} />
                <span className={styles.shareText}>Share</span>
              </Button>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <Table
              data={tableData && tableData}
              defaultColumns={defaultColumns}
              ellipsisColumns={[ tableHeaders.description ]}
              emptyValueLabel={t('common.table-empty-value')}
              dynamicRowsHeight
              hiddenColumnHeaderLabels={[ tableHeaders.website_link ]}
              titleLinks={data && titleLinks}
              setColumnWidth={setColumnWidth}
            />
          </div>
        </div>
        <FundingOportunitiesProvider />
        <ModalShare isOpen={isOpen} closeModal={() => this.setState({ isOpen: false })} sharePath={shareableLink} />
      </div>
    );
  }
}

ClimateFunding.propTypes = {
  t: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  data: PropTypes.array,
  titleLinks: PropTypes.array,
  sources: PropTypes.array
};

ClimateFunding.defaultProps = { data: [], titleLinks: null, sources: [] };

export default ClimateFunding;
