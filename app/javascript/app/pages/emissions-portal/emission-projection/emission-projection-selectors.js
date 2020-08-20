import { createStructuredSelector, createSelector } from 'reselect';
import castArray from 'lodash/castArray';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
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
  {label: 'Multisektor', value: 'Multisektor', name: 'Multisektor'},
  {label: 'Sektor Energi', value: 'Sektor Energi', name: 'Sektor Energi'},
  {label: 'Sektor Lahan', value: 'Sektor Lahan', name: 'Sektor Lahan'},
]

const DEVELOPED_OPTIONS = [
  {label: 'Government', value: 'Government', name: 'Government'},
]

const MODEL_OPTIONS = [
  {label: 'SNC', value: 'SNC', name: 'SNC'},
  {label: 'NDC/TNC', value: 'NDC/TNC', name: 'NDC/TNC'},
  {label: 'RAN-GRK', value: 'RAN-GRK', name: 'RAN-GRK'},
  {label: 'EPS', value: 'EPS', name: 'EPS'},
  {label: 'PBL Floor', value: 'PBL Floor', name: 'PBL Floor'},
  {label: 'PBL Ceiling', value: 'PBL Ceiling', name: 'PBL Ceiling'},
  {label: 'Indonesia Vision 2045', value: 'Indonesia Vision 2045', name: 'Indonesia Vision 2045'},
  {label: 'LCSST2050', value: 'LCSST2050', name: 'LCSST2050'},
  {label: 'Cal 2050', value: 'Cal 2050', name: 'Cal 2050'},
  {label: 'KEN', value: 'KEN', name: 'KEN'},
  {label: 'CAT', value: 'CAT', name: 'CAT'},
  {label: 'EUM', value: 'EUM', name: 'EUM'},
  {label: 'BPPT-L', value: 'BPPT-L', name: 'BPPT-L'},
  {label: 'BPPT-H', value: 'BPPT-H', name: 'BPPT-H'},
  {label: 'B2G', value: 'B2G', name: 'B2G'},
  {label: 'DDPP', value: 'DDPP', name: 'DDPP'},
  {label: 'FREL', value: 'FREL', name: 'FREL'},
  {label: 'BAPPENAS', value: 'BAPPENAS', name: 'BAPPENAS'},
]

const SCENARIO_OPTIONS = [
  {label: 'Business as Usual', value: 'Business as Usual', name: 'Business as Usual'},
]

const DEFAULTS = {
  sector: 'Multisektor',
  developed:'Government',
  model: 'SNC',
  scenario: 'Business as Usual'
};

const { COUNTRY_ISO } = process.env;

const getQuery = ({ location }) => location && (location.query || null);

const getEmissionProjectionData = ({ EmissionProjection }) => EmissionProjection && EmissionProjection.data;

const getFilterOptions = createStructuredSelector({
  sector: () => SECTOR_OPTIONS,
  developed: () => DEVELOPED_OPTIONS,
  model: () => MODEL_OPTIONS,
  scenario: () => SCENARIO_OPTIONS
});

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
  model: findOption(MODEL_OPTIONS, DEFAULTS.model),
  scenario: findOption(SCENARIO_OPTIONS, DEFAULTS.scenario),
}));

const getSelectedOptions = createStructuredSelector({
  sector: getFieldSelected('sector'),
  developed: getFieldSelected('developed'),
  model: getFieldSelected('model'),
  scenario: getFieldSelected('scenario')
});

export const getEmissionProjection = createStructuredSelector({
  query: getQuery,
  allSelectedOption: getAllSelectedOption,
  t: getTranslate,
  data: getEmissionProjectionData,
  filterOptions: getFilterOptions,
  selectedOptions: getSelectedOptions
});

