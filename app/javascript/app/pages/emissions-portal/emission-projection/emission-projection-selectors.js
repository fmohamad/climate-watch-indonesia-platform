import { createStructuredSelector, createSelector } from 'reselect';
import castArray from 'lodash/castArray';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';
import {
  ALL_SELECTED,
  API_TARGET_DATA_SCALE,
  EMISSION_TARGET,
  METRIC,
  SECTOR_TOTAL,
  SOURCE
} from 'constants/constants';
import {
  getAllSelectedOption,
  findOption,
  withAllSelected,
  getFieldQuery
} from 'selectors/filters-selectors';
import { getTranslate } from 'selectors/translation-selectors';
import {
  DEFAULT_AXES_CONFIG,
  getThemeConfig,
  getYColumnValue,
  getTooltipConfig
} from 'utils/graphs';

const SECTOR_OPTIONS = [
  {label: 'Multisector', value: 'Multisector', name: 'Multisector'},
  {label: 'Energy Sector', value: 'Energy Sector', name: 'Energy Sector'},
  {label: 'Land Sector', value: 'Land Sector', name: 'Land Sector'},
]

const DEVELOPED_OPTIONS = [
  {label: 'Government', value: 'Government', name: 'Government'},
]

const MODEL_OPTIONS = [
  {label: 'SNC', value: 'SNC', name: 'SNC', sector: 'Multisector'},
  {label: 'NDC/TNC', value: 'NDC/TNC', name: 'NDC/TNC', sector: 'Multisector'},
  {label: 'RAN-GRK', value: 'RAN-GRK', name: 'RAN-GRK', sector: 'Multisector'},
  {label: 'EPS', value: 'EPS', name: 'EPS', sector: 'Multisector'},
  {label: 'PBL Floor', value: 'PBL Floor', name: 'PBL Floor', sector: 'Multisector'},
  {label: 'PBL Ceiling', value: 'PBL Ceiling', name: 'PBL Ceiling', sector: 'Multisector'},
  {label: 'Indonesia Vision 2045', value: 'Indonesia Vision 2045', name: 'Indonesia Vision 2045', sector: 'Multisector'},
  {label: 'LCSST2050', value: 'LCSST2050', name: 'LCSST2050', sector: 'Energy Sector'},
  {label: 'Cal 2050', value: 'Cal 2050', name: 'Cal 2050', sector: 'Energy Sector'},
  {label: 'KEN', value: 'KEN', name: 'KEN', sector: 'Energy Sector'},
  {label: 'CAT', value: 'CAT', name: 'CAT', sector: 'Energy Sector'},
  {label: 'EUM', value: 'EUM', name: 'EUM', sector: 'Energy Sector'},
  {label: 'BPPT-L', value: 'BPPT-L', name: 'BPPT-L', sector: 'Energy Sector'},
  {label: 'BPPT-H', value: 'BPPT-H', name: 'BPPT-H', sector: 'Energy Sector'},
  {label: 'B2G', value: 'B2G', name: 'B2G', sector: 'Energy Sector'},
  {label: 'DDPP', value: 'DDPP', name: 'DDPP', sector: 'Land Sector'},
  {label: 'FREL', value: 'FREL', name: 'FREL', sector: 'Land Sector'},
  {label: 'BAPPENAS', value: 'BAPPENAS', name: 'BAPPENAS', sector: 'Land Sector'},
]

const SCENARIO_OPTIONS = [
  {label: 'Business as Usual', value: 'Business as Usual', name: 'Business as Usual'},
]

const DEFAULTS = {
  sector: 'Multisector',
  developed:'Government',
  model: 'SNC',
  scenario: 'Business as Usual'
};

const { COUNTRY_ISO } = process.env;

const getQuery = ({ location }) => location && (location.query || null);

const getEmissionProjectionData = ({ EmissionProjection }) => EmissionProjection && EmissionProjection.data;

const getChartLoading = ({ EmissionProjection = {} }) =>
  (EmissionProjection && EmissionProjection.loading);

// const getFilterOptions = createStructuredSelector({
//   sector: () => SECTOR_OPTIONS,
//   developed: () => DEVELOPED_OPTIONS,
//   model: () => MODEL_OPTIONS,
//   scenario: () => SCENARIO_OPTIONS
// });

const getFilterOptions = createSelector(
  (getFieldQuery('sector')),
  (queryValue) => {

    let models = []

    if (queryValue) {
      models = MODEL_OPTIONS.filter(x => x.sector === queryValue)
    } else {
      models = MODEL_OPTIONS.filter(x => x.sector === 'Multisector')
    }

    return {
      sector: SECTOR_OPTIONS,
      developed: DEVELOPED_OPTIONS,
      model: models,
      scenario: SCENARIO_OPTIONS
    }
  }
)

const getFieldSelected = field =>
  createSelector(
    [
      getFieldQuery(field),
      getDefaults,
      getFilterOptions
    ],
    (queryValue, defaults, options) => {
      if (!queryValue) return defaults[field];
      const findSelectedOption = value => findOption(options[field], value);
      return queryValue.includes(',')
        ? queryValue.split(',').map(v => findSelectedOption(v))
        : findSelectedOption(queryValue);
    }
  );


const getDefaults = createSelector([ getFilterOptions ], (
  options
) => ({
  sector: findOption(SECTOR_OPTIONS, DEFAULTS.sector),
  developed: findOption(DEVELOPED_OPTIONS, DEFAULTS.developed),
  model: get(options, 'model[0]'),
  scenario: findOption(SCENARIO_OPTIONS, DEFAULTS.scenario),
}));

const getSelectedOptions = createStructuredSelector({
  sector: getFieldSelected('sector'),
  developed: getFieldSelected('developed'),
  model: getFieldSelected('model'),
  scenario: getFieldSelected('scenario')
});

const getLegendDataOptions = createSelector(
  [getFilterOptions],
  (options) => {
    if (isEmpty(options)) return null

    return options.model
  }
)

const getLegendDataSelected = createSelector(
  [getSelectedOptions],
  (options) => {
    if (isEmpty(options)) return null
    
    return castArray(options.model)
  }
)

const getYColumnOptions = createSelector(
  [getLegendDataSelected],
  legendDataSelected => {
    if (!legendDataSelected) return null;
    return legendDataSelected.map(d => ({
      ...d, 
      value: getYColumnValue(d.value)
    }));
  }
);

const getChartData = createSelector(
  [getEmissionProjectionData, getSelectedOptions, getYColumnOptions],
  (emissionData, options, yColumnOptions) => {
    console.log('emissionData', emissionData)
    console.log('options', options)
    if (isEmpty(emissionData)) return null
    if (!options) return null

    const filteredData = filter(emissionData, {sector: options.sector.value, model: options.model.value})
    console.log('filteredData', filteredData)
    const xAxis = emissionData[0].values.map((val) => val.year)
    const data = []
    xAxis.forEach((x) => {
      filteredData.forEach((dataFilter) => {
        console.log('dataFilter', dataFilter)
        const object = {}
        object.x = x
        yColumnOptions.forEach(yColumn => {
          object[yColumn.value] = find(dataFilter.values, ['year', x]).value
        })
        data.push(object)
      })
    })

    return data
  }
)

let colorCache = {};

const getChartConfig = createSelector(
  [
    getChartData,
    getYColumnOptions,
    getSelectedOptions,
    getTranslate
  ],
  (data, yColumnOptions, options, t) => {
    if (!yColumnOptions || !data) return null
    if (isNil(options)) return null

    const tooltip = getTooltipConfig(yColumnOptions);
    const theme = getThemeConfig(yColumnOptions);
    colorCache = { ...theme, ...colorCache };

    const year = t(
      `pages.emissions-portal.emission-projection.unit.year}`
    );

    const axes = {
      xBottom: { name: year, unit: year, format: 'YYYY' },
      yLeft: {
        name: 'Value',
        format: 'string',
      },
    }
    const columns = { x: [ { label: 'year', value: 'x' } ], y: yColumnOptions }

    return {
      axes,
      theme: colorCache,
      animation: false,
      tooltip,
      columns
    }
  }
);

const getChart = createStructuredSelector({
  config: getChartConfig
})

export const getEmissionProjection = createStructuredSelector({
  query: getQuery,
  allSelectedOption: getAllSelectedOption,
  t: getTranslate,
  emissionProjectionData: getEmissionProjectionData,
  filterOptions: getFilterOptions,
  selectedOptions: getSelectedOptions,
  dataOptions: getLegendDataOptions,
  dataSelected: getLegendDataSelected,
  chart: getChart,
  chartData: getChartData,
  chartLoading: getChartLoading
});

