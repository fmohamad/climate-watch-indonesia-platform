import { createStructuredSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';
import { getQuery } from 'selectors/filters-selectors';
import {
  getSelectedOptions,
  getFilterOptions
  // getModelSelected,
  // getMetricSelected
} from './economy-filter-selectors';
import { getProvinceData } from './economy-get-selectors';
import { getMetaParams } from './economy-fetch-selectors';
import {
  getChartData
  // getMetadataSources,
  // getDownloadURI
} from './economy-data-selectors';

function empty(){}

export const getEconomies = createStructuredSelector({
  selectedOptions: getSelectedOptions,
  downloadURI: empty,
  filterOptions: getFilterOptions,
  query: getQuery,
  metaParams: getMetaParams,
  provinceISO: getProvinceData,
  chartData: getChartData,
  t: getTranslate
});
