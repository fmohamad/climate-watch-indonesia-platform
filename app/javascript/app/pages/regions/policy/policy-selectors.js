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
  withAllSelected,
} from 'selectors/filters-selectors'
import { ALL_SELECTED } from 'constants/constants'
import { getProvince } from 'selectors/provinces-selectors';

const section = 'wp_policy'
const provinceISO = 'ID.PB'

const getIndicatorParams = () => ({ section })

const getMetaParams = () => ({ section, location: provinceISO })

const getQuery = ({ location }) => location && (location.query || null)

const getIndicator = ({ indicators }) => indicators && indicators.data

const getMetadata = ({ provinceMeta }) => provinceMeta && provinceMeta.data

const getIndicatorOptions = createSelector(
  getIndicator,
  indicators => {
    if (isEmpty(indicators)) return null
      console.log('indicators', indicators);
    /*const data = filter(indicators.values, function(data) {
      return (
        data.indicator_code === 'wp_hdi' ||
        data.indicator_code === 'wp_literacy_rate' ||
        data.indicator_code === 'wp_illiterate' ||
        data.indicator_code === 'wp_health_infrastructure' ||
        data.indicator_code === 'wp_drinking_access'
      )
    })

    return data;*/
    return indicators
  }
);

export const getPolicy = createStructuredSelector({
  t: getTranslate,
  indicatorParams: getIndicatorParams,
  metaParams: getMetaParams,
  indicatorOptions: getIndicatorOptions
});
