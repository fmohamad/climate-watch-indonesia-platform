import { createStructuredSelector, createSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';
import { format } from 'd3-format';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import get from 'lodash/get';
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
import {
  getAllSelectedOption,
  findOption,
  withAllSelected
} from 'selectors/filters-selectors';
import { ALL_SELECTED } from 'constants/constants';
import { getProvince } from 'selectors/provinces-selectors';

const section = 'wp_policies_data';
const provinceISO = 'ID.PB';

const getParams = () => ({ section, location: provinceISO });

const getQuery = ({ location }) => location && (location.query || null);

const getPolicies = ({ policies }) => policies && policies.data;

const getIndicator = ({ indicators }) => indicators && indicators.data;

const indicatorOptions = {
  indicator: [
    {
      label: 'Index Lingkungan Hidup',
      value: 'index_lingdup',
      code: 'index_lingdup'
    }
  ]
};

const getFilterOptions = createSelector(getPolicies, data => {
  if (isEmpty(data)) return indicatorOptions;

  const indicator = data.policies.map(item => ({
    label: item.name,
    value: item.code,
    code: item.code
  }));

  return { indicator };
});

const getDefault = createSelector(getFilterOptions, options => ({
  indicator: get(options, 'indicator[0]')
}));

// Selected
// const getSelectedOptions = createSelector(
//   [getQuery, getDefault],
//   (query, def) => {
//     if (!query || !query.indicator) return def
//     return null
//   }
// )
// DEFAULTS
const getDefaults = createSelector([ getFilterOptions ], options => ({
  indicator: get(options, 'indicator[0]')
}));

// SELECTED
const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = String(query[field]);
  const findSelectedOption = value =>
    findOption(getFilterOptions(state)[field], value);

  const options = queryValue
    .split(',')
    .map(v => findSelectedOption(v))
    .filter(v => v);

  if (options.length > 1) return options;
  return options.length ? options[0] : getDefaults(state)[field];
};

const getSelectedOptions = createStructuredSelector({
  indicator: getFieldSelected('indicator')
});

const getIndicatorOptions = createSelector(getIndicator, indicators => {
  if (isEmpty(indicators)) return null;

  return indicators;
});

const getGoals = createSelector(
  getTranslate,
  t => t('pages.regions.policy.section-one.goals.content')
);

const getObjectives = createSelector(
  getTranslate,
  t => t('pages.regions.policy.section-one.objectives.content')
);

const parseChartData = createSelector([ getPolicies, getSelectedOptions ], (
  data,
  options
) =>
  {
    if (isEmpty(data) || isEmpty(options)) return null;

    const { values } = data;

    const filteredData = filter(values, function(o) {
      return o.policy_code == options.indicator.code;
    });

    const yearAxis = filteredData[0].values.map(o => o.year);
    console.log('', filteredData, yearAxis);
    const policiesData = [];

    return null;
  });

const getChartData = createStructuredSelector({
  // config: getChartConfig,
  // loading: getDataLoading,
  // dataOptions: getLegendDataOptions,
  // dataSelected: getLegendDataSelected
  data: parseChartData
});

export const getPolicy = createStructuredSelector({
  t: getTranslate,
  params: getParams,
  filterOptions: getFilterOptions,
  selectedOptions: getSelectedOptions,
  goals: getGoals,
  objectives: getObjectives,
  indicatorOptions: getIndicatorOptions,
  provinceISO: getProvince,
  chartData: getChartData
});
