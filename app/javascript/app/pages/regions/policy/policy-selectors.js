import { createStructuredSelector, createSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import get from 'lodash/get';
import find from 'lodash/find';
import isNil from 'lodash/isNil';
import castArray from 'lodash/castArray';
import {
  getThemeConfig,
  getTooltipConfig,
} from 'utils/graphs';
import {
  findOption,
} from 'selectors/filters-selectors';
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

const getDefaults = createSelector([getFilterOptions], options => ({
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

const parseChartData = createSelector([getPolicies, getSelectedOptions], (
  data,
  options
) => {
  if (isEmpty(data) || isEmpty(options)) return null;

  const { values } = data;

  const filteredData = filter(values, function (o) {
    return o.policy_code === options.indicator.code;
  });

  const yearAxis = filteredData[0].values.map(o => o.year);
  const policiesData = [];

  yearAxis.forEach(element => {
    const object = {}

    object.x = element
    object.y = find(filteredData[0].values, ['year', element]).value

    policiesData.push(object)
  });

  return policiesData;
});

export const getChartConfig = createSelector(
  [
    parseChartData,
    getSelectedOptions,
  ],
  (data, options) => {
    if (!data) return null
    if (isNil(options.indicator)) return null

    const { code, label } = options.indicator

    const yColumnOptions = [{code, label, value: 'y'}]

    const tooltip = getTooltipConfig(yColumnOptions);
    const theme = getThemeConfig(yColumnOptions);

    const axes = {
      xBottom: { name: 'year', unit: 'year', format: 'YYYY' },
      yLeft: {
        name: options.indicator.label,
        unit: 'percent',
        format: 'number',
      }
    }

    const columns = { x: [{ label: 'year', value: 'x' }], y: yColumnOptions }

    return {
      axes,
      animation: false,
      columns,
      tooltip,
      theme
    }
  }
);

const getDataOptions = createSelector(
  getFilterOptions,
  (options) => {

    if (!options && !options.indicator) return null

    return castArray(options.indicator)
  }
)

const getDataSelected = createSelector(
  getSelectedOptions,
  (options) => {

    if (!options && !options.indicator) return null

    return castArray(options.indicator)
  }
)

const getChartData = createStructuredSelector({
  config: getChartConfig,
  // loading: getDataLoading,
  dataOptions: getDataOptions,
  dataSelected: getDataSelected,
  data: parseChartData
});

const getTableData = createSelector(
  [getPolicies, getSelectedOptions],
  (data, options) => {
    if (isEmpty(data) || isEmpty(data.values) || !options) return null

    const { code } = options.indicator

    const filteredData = find(data.values, function(o) {
      return o.category === 'rencana_awal' && o.policy_code === code
    })

    const mappedData = filteredData.values.map(o => (
      {tahun: o.year, rencana: `${o.value} %`, aktualisasi: '0 %', deskripsi: 'data belum tersedia'}
    ))

    return mappedData
  }
)

const getDefaultColumns = createSelector(
  parseChartData,
  data => {
    if (!data || isEmpty(data)) return null
    const defaultColumns = ['tahun', 'rencana', 'aktualisasi', 'deskripsi']

    return defaultColumns
  }
)

const firstColumnHeaders = () => (['tahun', 'rencana'])

const getTableConfig = createStructuredSelector({
  defaultColumns: getDefaultColumns,
  firstColumnHeaders
});

export const getPolicy = createStructuredSelector({
  t: getTranslate,
  tableData: getTableData,
  tableConfig: getTableConfig,
  params: getParams,
  filterOptions: getFilterOptions,
  selectedOptions: getSelectedOptions,
  goals: getGoals,
  objectives: getObjectives,
  indicatorOptions: getIndicatorOptions,
  provinceISO: getProvince,
  chartData: getChartData
});
