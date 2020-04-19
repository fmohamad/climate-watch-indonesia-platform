import { createStructuredSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';
import { getQuery } from 'selectors/filters-selectors';
import {
  getSelectedOptions,
  getFilterOptions
  // getModelSelected,
  // getMetricSelected
} from './economy-filter-selectors';
// import { getEmissionParams } from './economy-fetch-selectors';
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
  emissionParams: empty,
  chartData: getChartData,
  t: getTranslate
});
