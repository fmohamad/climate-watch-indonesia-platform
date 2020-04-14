import { createStructuredSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';
import { getQuery } from 'selectors/filters-selectors';
import {
  getSelectedOptions,
  getFilterOptions,
  getModelSelected,
  getMetricSelected
} from './economy-filter-selectors';
import { getEmissionParams } from './economy-fetch-selectors';
import {
  getChartData,
  getMetadataSources,
  getDownloadURI
} from './economy-data-selectors';
import { getSelectedAPI } from './economy-get-selectors';

export const getGHGEmissions = createStructuredSelector({
  selectedOptions: getSelectedOptions,
  fieldToBreakBy: getModelSelected,
  metricSelected: getMetricSelected,
  apiSelected: getSelectedAPI,
  metadataSources: getMetadataSources,
  downloadURI: getDownloadURI,
  filterOptions: getFilterOptions,
  query: getQuery,
  emissionParams: getEmissionParams,
  chartData: getChartData,
  t: getTranslate
});
