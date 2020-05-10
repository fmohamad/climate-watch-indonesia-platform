import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';
import { scaleQuantile } from 'd3-scale';

import { getProvince, getLocations } from 'selectors/provinces-selectors';
import { METRIC } from 'constants';

import indonesiaPaths from 'utils/maps/indonesia-paths';
import papuaPaths from 'utils/maps/papua-barat-paths';
import { getTranslate } from 'selectors/translation-selectors';

import {
  getIndicatorPopulation,
  getSelectedOptions
} from '../region-population-selectors';
import isEmpty from 'lodash/isEmpty';

const DEFAULT_MAP_CENTER = [ 113, -1.86 ];
const MAP_BUCKET_COLORS = [
  '#FFFFFF',
  '#B3DDF8',
  '#3AA2E0',
  '#297CB8',
  '#064584'
];

const style = {
default: {
    fill: '#ffc735',
      stroke: '#ecf1fa',
      strokeWidth: 0.05,
      outline: 'none'
  },
  hover: {
    fill: '#ffc735',
      stroke: '#ffc735',
      strokeWidth: 0.05,
      outline: 'none'
  },
  pressed: {
    fill: '#ffc735',
      stroke: '#ffc735',
      strokeWidth: 0.1,
      outline: 'none'
  }
}

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
    getIndicatorPopulation,
    getSelectedOptions,
    getTranslate
  ],
  (
    indicators,
    options,
    t
  ) =>
    {
      if (isEmpty(indicators)) return {}
      const paths = []
      papuaPaths.forEach(path => {
        const district = path.properties && path.properties.district;
        const { geometry, properties, type } = path;
        const districtName = properties.district

        paths.push({
          type,
          geometry,
          properties: { ...properties, name: districtName },
          style
        });
      });
      return { paths }
    }
);
