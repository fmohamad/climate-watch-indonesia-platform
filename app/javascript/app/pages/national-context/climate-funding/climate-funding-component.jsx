import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Table, Dropdown, Button, Icon } from 'cw-components';
import ModalShare from 'components/modal-share';
import cx from 'classnames'

import { renameKeys } from 'utils';
import SectionTitle from 'components/section-title';
import FundingOportunitiesProvider from 'providers/funding-oportunities-provider';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import shareIcon from 'assets/icons/share';
import styles from './climate-funding-styles.scss';

const setColumnWidth = columnName => {
  const narrowColumns = [ 'website_link' ];
  if (narrowColumns.includes(columnName)) return 80;
  return null;
};

class ClimateFunding extends PureComponent {
  constructor(props) {
    super(props);
  
    this.state = {
      isOpen: false
    };
  }

  render() {
    const shareableLink = `${window.location.origin}${window.location.pathname}`
    const { isOpen } = this.state
    const { t, data, titleLinks, onSearchChange, sources } = this.props;
    const nt = key => t(`pages.national-context.climate-funding.${key}`);

    const tableHeaders = nt('table-headers', {});
    tableHeaders.website_link = 'website_link';
    const defaultColumns = Object.values(tableHeaders);

    const tableData = data.map(d => renameKeys(d, tableHeaders));

    const title = nt('title');
    const description = nt('description');

    return (
      <div className={styles.page}>
        <SectionTitle title={title} description={description} />
        <div>
          <div className={styles.actions}>
            <Input
              onChange={onSearchChange}
              placeholder={t(
                'pages.national-context.climate-funding.search-placeholder'
              )}
              theme={styles}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
