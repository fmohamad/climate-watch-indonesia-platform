import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Map from 'components/map';
import MapChoroplethLegend from 'components/map-choropleth-legend';

import styles from './regions-map-styles.scss';

const MAP_ZOOM_STEP = 1;
const MAP_ZOOM_DEFAULT = 6;
const MAP_ZOOM_MIN = 3;

const MapTooltip = ({ properties }) => (
  <div>
    {properties && properties.name}
  </div>
);

MapTooltip.propTypes = { properties: PropTypes.object.isRequired };

class RegionsMap extends PureComponent {
  constructor() {
    super();
    this.state = { mapZoom: MAP_ZOOM_DEFAULT };
  }

  handleProvinceClick = e => {
    console.log('e', e);
    /*const { linkToProvince, query } = this.props;
    const provinceISO = e.properties && e.properties.code_hasc;

    if (!provinceISO) return;

    const metricQuery = query && query.metric && { metric: query.metric };
    console.log("provinceISO", provinceISO);
    console.log("metricQuery", metricQuery);
    linkToProvince({
      section: 'regions-ghg-emissions',
      region: provinceISO,
      query: metricQuery
    });*/
  };

  handleZoomIn = () => {
    this.setState(({ mapZoom }) => ({ mapZoom: mapZoom * MAP_ZOOM_STEP }));
  };

  handleZoomOut = () => {
    this.setState(({ mapZoom }) => {
      const newMapZoom = mapZoom / MAP_ZOOM_STEP;
      return { mapZoom: newMapZoom < MAP_ZOOM_MIN ? mapZoom : newMapZoom };
    });
  };

  render() {
    const { paths, buckets, mapCenter, unit, mapLegendTitle } = this.props;
    const { mapZoom } = this.state;
    const mapStyle = { width: '100%', height: '100%' };

    return (
      <div className={styles.mapContainer}>
        <Map
          zoom={mapZoom}
          paths={paths}
          center={mapCenter}
          className={styles.map}
          style={mapStyle}
          onGeographyClick={this.handleProvinceClick}
          tooltip={MapTooltip}
          zoomEnable={false}
          dragEnable={false}
          forceUpdate
        />
        <MapChoroplethLegend
          buckets={buckets}
          unit={unit}
          title={mapLegendTitle}
          theme={{ container: styles.mapLegendContainer }}
        />
      </div>
    );
  }
}

RegionsMap.propTypes = {
  paths: PropTypes.array,
  buckets: PropTypes.array,
  unit: PropTypes.string,
  mapCenter: PropTypes.array,
  linkToProvince: PropTypes.func.isRequired
};

RegionsMap.defaultProps = {
  mapCenter: [ 113, -1.86 ],
  paths: [],
  buckets: [],
  unit: ''
};

export default RegionsMap;
