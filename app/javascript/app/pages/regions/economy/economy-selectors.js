import { createStructuredSelector, createSelector } from 'reselect';
import castArray from 'lodash/castArray';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import filter from 'lodash/filter';
import find from 'lodash/find';
import kebabCase from 'lodash/kebabCase'
import { format } from 'd3-format';
import {
  SECTOR_TOTAL,
  WEST_PAPUA
} from 'constants/constants';

import {
  getAllSelectedOption,
  findOption,
} from 'selectors/filters-selectors';
import { getProvince } from 'selectors/provinces-selectors';
import { getTranslate } from 'selectors/translation-selectors';

import {
  getThemeConfig,
  getYColumnValue,
  getTooltipConfig
} from 'utils/graphs';

const section = 'wp_economic'
const KABUPATEN = 'kabupaten'
const SEKTOR = 'sektor'

const getQuery = ({ location }) => location && (location.query || null);

const getMetadataParams = createSelector(
  getProvince,
  provinceISO => {
    if (!provinceISO) return null

    return { section, location: provinceISO }
  }
)

const getMetadataData = ({ provinceMeta }) => provinceMeta && provinceMeta.data

const getIndicatorData = ({ indicators }) =>
  indicators && indicators.data && indicators.data.values

const getIndicatorParams = () => ({ section })

const getChartType = () => ([
  { label: 'line', value: 'line' },
  { label: 'area', value: 'area' },
])

const getSelectedModel = createSelector(
  getQuery,
  query => {
    if (!query || !query.indicator) return 'kabupaten'

    return query.indicator.split('-')[1]
  }
)

const getFieldOptionsNotFiltered = field => createSelector(
  [ getMetadataData, getQuery ],
  metadata => get(metadata, field, [])
    .map(o => ({ label: o.label || o.name, value: String(o.value || o.code || o.iso_code3), code: o.code || o.iso_code3 }))
    .filter(o => o)
);

const getFieldOptions = field =>
  createSelector(
    [ getFieldOptionsNotFiltered(field),
      getSelectedModel
    ], 
    (
      options,
      modelSelected
    ) =>
    {
      if (field === 'indicators') return options;
      if (modelSelected === KABUPATEN) {
        if (field === 'locations') return options
        return options.filter(o => o.code === SECTOR_TOTAL);
      }

      if (field === 'locations') {
        options.unshift(WEST_PAPUA)
        return options
      }

      return options.filter(o => o.code !== SECTOR_TOTAL);
    }
  );

const getFilterOptions = createStructuredSelector({
  indicator: getFieldOptions('indicators'),
  district: getFieldOptions('locations'),
  sector: getFieldOptions('sectors'),
  chartType: getChartType,
});

// DEFAULTS
const getDefaults = createSelector([ getFilterOptions], (
  options,
) => ({
  indicator: get(options, 'indicator[0]'),
  sector: get(options, 'sector[0]'),
  district: get(options, 'district[0]'),
  chartType: get(options, 'chartType[0]')
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

export const getSelectedOptions = createStructuredSelector({
  indicator: getFieldSelected('indicator'),
  sector: getFieldSelected('sector'),
  district: getFieldSelected('district'),
  chartType: getFieldSelected('chartType'),
});

// DATA
export const getUnit = createSelector(
  [getMetadataData, getSelectedOptions],
  (meta, options) => {
    if (isEmpty(meta) || !meta.indicators) return null;
    const indicator = find(meta.indicators, ['code', options.indicator.code])

    return indicator.unit
  }
);

const getLegendDataOptions = createSelector(
  [getSelectedModel, getFilterOptions],
  (model, options) => {
    if (!model) return null
    if (isEmpty(options)) return null

    if (model === KABUPATEN) return options.district

    return options.sector
  }
)
const getLegendDataSelected = createSelector(
  [getSelectedModel, getSelectedOptions],
  (model, options) => {
    if (!model) return null
    if (isEmpty(options) || isNil(options.district) || isNil(options.sector) ) return null

    if (model === KABUPATEN) return castArray(options.district)

    return castArray(options.sector)
  }
)

const getYColumnOptions = createSelector(
  [ getLegendDataSelected ],
  legendDataSelected => {
    if (!legendDataSelected) return null;

    return legendDataSelected.map(d => ({
      ...d,
      value: getYColumnValue(d.value)
    }));
  }
);

const filteredDataBySelectedOptions = (data, selectedOptions) => {
    const selectedIndicator = selectedOptions.indicator.value
    const selectedDistricts = castArray(selectedOptions.district).map(o => o.value)
    const selectedSectors = castArray(selectedOptions.sector).map(o => o.label)

    const filterByInd = filter(data, function(o) {
      return o.indicator_code === selectedIndicator
    })

    const filterByDist = filter(filterByInd, function(o) {
      return selectedDistricts.includes(o.location_iso_code3)
    })

    const filteredData = filter(filterByDist, function(o) {
      return selectedSectors.includes(o.category)
    })

    return filteredData
}

const parseChartData = createSelector(
  [
    getSelectedModel,
    getIndicatorData,
    getYColumnOptions,
    getSelectedOptions,
  ],
  (model, indicatorData, yColumnOptions, selectedOptions) => {
    if (isEmpty(indicatorData)) return null
    if (!yColumnOptions) return null;

    const filteredData = filteredDataBySelectedOptions(indicatorData, selectedOptions)
    const yearAxis = filteredData[0].values.map(o => o.year)

    const data = []
    if (model === KABUPATEN) {
      yearAxis.forEach(x => {
        const object = {}

        object.x = x

        yColumnOptions.forEach(option => {
          const dataByOption = find(filteredData, ['location_iso_code3', option.code])
          object[option.value] = find(dataByOption.values, ['year', x]).value
        })

        data.push(object)
      })
    }

    if (model === SEKTOR) {
      yearAxis.forEach(x => {
        const object = {}

        object.x = x

        yColumnOptions.forEach(option => {
          const dataByOption = find(filteredData, ['category', option.label])
          object[option.value] = find(dataByOption.values, ['year', x]).value
        })

        data.push(object)
      })
    }

    return data;
  }
);

// Y LABEL FORMATS
const getCustomYLabelFormat = unit => {
  const formatY = {
    'million-rp': value => format(',.2f')(value/1000000),
    'million Rp': value => `${value}`,
    '%': value => `${value}%`
  };
  return formatY[unit];
};

export const getChartConfig = createSelector(
  [
    parseChartData,
    getYColumnOptions,
    getUnit,
    getSelectedOptions,
    getTranslate
  ],
  (data, yColumnOptions, unit, options, t) => {
    if (!yColumnOptions || !data) return null
    if (!unit || isNil(options.indicator)) return null

    const tooltip = getTooltipConfig(yColumnOptions);
    const theme = getThemeConfig(yColumnOptions);

    const year = t(
      `pages.regions.economy.unit.year}`
    );

    const axes = {
      xBottom: { name: year, unit: year, format: 'YYYY' },
      yLeft: {
        name: options.indicator.label,
        unit: t(`pages.regions.economy.unit.million-rp`),
        format: 'number',
      }
    }

    const yLabelFormat = getCustomYLabelFormat(unit)
    const columns = { x: [ { label: 'year', value: 'x' } ], y: yColumnOptions }

    return {
      axes,
      theme,
      animation: false,
      tooltip,
      columns,
      yLabelFormat
    }
  }
);

const getDefaultColumns = createSelector(
  parseChartData,
  data => {
    if (!data || isEmpty(data)) return null

    const years = data.map(dt => dt.x)

    const defaultColumns = ['indicator', 'unit', ...years]

    return defaultColumns
  }
)

const firstColumnHeaders = () => (['indicator', 'unit'])

const narrowColumns = createSelector(
  parseChartData,
  data => {
    if (!data || isEmpty(data)) return null

    return [ 'unit' ] + data.map(dt => dt.x) 
  }
)

const getTableData = createSelector(
  [getSelectedModel, getDefaultColumns, getIndicatorData, parseChartData, getSelectedOptions, getUnit, getTranslate],
  (model, columns, indicatorData, parsedData, options, unit, t) => {
    if (!parsedData || !options || !unit || !model) return null

    const filteredData = filteredDataBySelectedOptions(indicatorData, options)

    console.log('unit', unit)
    let tableData = []
    if (model === KABUPATEN) {
      filteredData.forEach(data => {
        const objectData = {}

        objectData.indicator = data.location
        objectData.unit =  t(`pages.regions.economy.unit.${unit}`)

        data.values.forEach(value => {
          objectData[value.year] = value.value
        })

        tableData.push(objectData)
      })
    }


    if (model === SEKTOR) {
      filteredData.forEach(data => {
        const objectData = {}

        objectData.indicator = data.category
        objectData.unit = unit

        data.values.forEach(value => {
          objectData[value.year] = value.value
        })

        tableData.push(objectData)
      })
    }
    
    return tableData

  }
)


const getChartLoading = ({ provinceMeta = {}, indicators = {} }) =>
  (provinceMeta && provinceMeta.loading) || (indicators && indicators.loading);

const getDataLoading = createSelector(
  [ getChartLoading, parseChartData ],
  (loading, data) => loading || !data || false
);

export const getTableConfig = createStructuredSelector({
  defaultColumns: getDefaultColumns,
  firstColumnHeaders,
  narrowColumns
});

export const getChartData = createStructuredSelector({
  data: parseChartData,
  config: getChartConfig,
  loading: getDataLoading,
  dataOptions: getLegendDataOptions,
  dataSelected: getLegendDataSelected
});

export const getEconomies = createStructuredSelector({
  indicatorParams: getIndicatorParams,
  chartData: getChartData,
  tableData: getTableData,
  tableConfig: getTableConfig,
  selectedOptions: getSelectedOptions,
  filterOptions: getFilterOptions,
  query: getQuery,
  allSelectedOption: getAllSelectedOption,
  provinceISO: getProvince,
  t: getTranslate,
  selectedModel: getSelectedModel,
  metadataParams: getMetadataParams,
});
