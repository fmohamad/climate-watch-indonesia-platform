import { createStructuredSelector, createSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';
import { format } from 'd3-format';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import sortBy from 'lodash/sortBy';
import {
  getThemeConfig,
  getTooltipConfig,
  getUniqueYears,
  setLegendOptions,
  CHART_COLORS
} from 'utils/graphs';

const POPULATION_INDICATOR_CODES = [
  'pop_total',
  'pop_growth',
  'lit_rate',
  'poor_people'
];

export const getRegionPopulation = createStructuredSelector({
  t: getTranslate,
});
