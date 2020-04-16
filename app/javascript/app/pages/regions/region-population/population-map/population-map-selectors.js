import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';
import { scaleQuantile } from 'd3-scale';

import { getProvince, getLocations } from 'selectors/provinces-selectors';
import { METRIC } from 'constants';

import indonesiaPaths from 'utils/maps/indonesia-paths';
import { getTranslate } from 'selectors/translation-selectors';

import {
  filterBySelectedOptions,
  getEmissionsData,
  getUnit,
  getSelectedOptions
} from '../../regions-ghg-emissions/regions-ghg-emissions-selectors';

const DEFAULT_MAP_CENTER = [ 113, -1.86 ];
const MAP_BUCKET_COLORS = [
  '#FFFFFF',
  '#B3DDF8',
  '#3AA2E0',
  '#297CB8',
  '#064584'
];

const getSelectedYear = (state, { selectedYear }) => selectedYear;

const getMapStyles = color => ({
  default: {
    fill: color,
    fillOpacity: 1,
    stroke: '#ffffff',
    strokeWidth: 0.2,
    outline: 'none'
  },
  hover: { fill: color, stroke: '#ffffff', strokeWidth: 0.6, outline: 'none' },
  pressed: { fill: color, stroke: '#ffffff', strokeWidth: 0.2, outline: 'none' }
});

const composeBuckets = bucketValues => {
  const buckets = [];

  bucketValues
    .map(v => Math.round(v))
    .concat([ null ])
    .reduce(
      (prev, curr, index) => {
        buckets.push({
          minValue: prev,
          maxValue: curr,
          color: MAP_BUCKET_COLORS[index]
        });
        return curr;
      },
      null
    );

  return buckets;
};

const createBucketColorScale = emissions => {
  const totalEmissionsByProvinceYear = emissions.reduce(
    (acc, e) => {
      const key = `${e.provinceISO}_${e.year}`;
      return { ...acc, [key]: (acc[key] || 0) + e.value };
    },
    {}
  );

  const allEmissionValuesRounded = Object
    .keys(totalEmissionsByProvinceYear)
    .map(key => Math.round(totalEmissionsByProvinceYear[key]));

  return scaleQuantile()
    .domain(allEmissionValuesRounded)
    .range(MAP_BUCKET_COLORS);
};

export const getMap = createSelector(
  [
    getEmissionsData,
    getUnit,
    getSelectedOptions,
    getProvince,
    getSelectedYear,
    getTranslate,
    getLocations
  ],
  (
    emissions,
    unit,
    selectedOptions,
    provinceISO,
    selectedYear,
    t,
    provincesDetails
  ) =>
    {
      
      const buckets = composeBuckets(bucketColorScale.quantiles());


      const mapLegendTitle = year &&
        `${t(`pages.regions.regions-ghg-emissions.legendTitle`)} ${year}`;

      return { paths, buckets };
    }
);
