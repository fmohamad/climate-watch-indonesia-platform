import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { getProvince } from 'selectors/provinces-selectors';
import { METRIC } from 'constants';
import indonesiaPaths from 'utils/maps/indonesia-paths';
import { getTranslate } from 'selectors/translation-selectors';

const DEFAULT_SECTION = 'regions-ghg-emissions';

const getProvinces = ({ provinces }) => provinces && provinces.data || null;
const getLocation = ({ location }) => location && location;

const getSection = createSelector(getLocation, location => {
  if (!location) return null;

  return get(location, 'payload.region')
    ? get(location, 'payload.section')
    : '';
});

const getParsedProvinces = createSelector([ getProvinces, getSection ], (
  provinces,
  section
) =>
  {
    if (!provinces || isEmpty(provinces)) return [];

    const provinceSection = section || DEFAULT_SECTION;

    return provinces.map(province => ({
      value: province.iso_code3,
      label: province.wri_standard_name,
      path: `/regions/${province.iso_code3}/${provinceSection}`
    }));
  });

export const getMap = createSelector([ getProvince, getTranslate ], (
  provinceISO,
  t
) =>
  {
    const paths = [];
    const isAbsoluteMetric = selectedOptions.metric.code === METRIC.absolute;
    const divisor = isAbsoluteMetric && unit.startsWith('kt') ? 1000 : 1;
    const correctedUnit = isAbsoluteMetric ? unit.replace('kt', 'Mt') : unit;
    const byProvinceISO = path =>
      (path.properties && path.properties.code_hasc) === provinceISO;
    const provincePath = indonesiaPaths.find(byProvinceISO);
    const mapCenter = provincePath
      ? [ provincePath.properties.longitude, provincePath.properties.latitude ]
      : DEFAULT_MAP_CENTER;

    indonesiaPaths.forEach(path => {
      const iso = path.properties && path.properties.code_hasc;

      const bucketColor = bucketColorScale(provincePath);
      const { geometry, properties, type } = path;
      const provinceProperties = provincesDetails.find(
        p => p.iso_code3 === iso
      );
      const provinceName = provinceProperties
        ? provinceProperties.wri_standard_name
        : properties.name;

      paths.push({
        type,
        geometry,
        properties: { ...properties, name: provinceName },
        style: getMapStyles(bucketColor)
      });
    });

    return { paths, buckets, unit: correctedUnit, mapCenter };
  });

export const getProvincesData = createStructuredSelector({
  provinces: getParsedProvinces,
  activeProvince: getProvince
});
