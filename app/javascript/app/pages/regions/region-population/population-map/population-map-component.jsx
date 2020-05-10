import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { updateQueryParams } from 'utils';

import Map from 'components/map';

import styles from './population-map-styles.scss';

const MAP_ZOOM_STEP = 2;
const MAP_ZOOM_DEFAULT = 23;
const MAP_ZOOM_MIN = 6;

const MapTooltip = ({ properties }) => (
  <div>
    {properties && properties.name}
  </div>
);

MapTooltip.propTypes = { properties: PropTypes.object };

class PopulationMap extends PureComponent {
  constructor() {
    super();
    this.state = { mapZoom: MAP_ZOOM_DEFAULT };
  }

  handleDistrictClick = e => {
    const { query, linkToDistrict } = this.props;
    const districtISO = e.properties && e.properties.iso_code3;
    const filter = ({district: districtISO })
    const provinceISO = 'ID.PB'

    if (!districtISO) return;

    linkToDistrict({
      section: 'region-population',
      region: provinceISO,
      query: updateQueryParams(query, filter)
    });
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
    const { buckets, paths } = this.props;
    const { mapZoom } = this.state;
    const mapStyle = { width: '100%', height: '100%', fill: '#FFFFFF' };

    return (
      <div className={styles.mapContainer}>
        <Map
          zoom={mapZoom}
          paths={paths}
          center={[ 132.825, -1.32525 ]}
          className={styles.map}
          style={mapStyle}
          handleZoomIn={this.handleZoomIn}
          handleZoomOut={this.handleZoomOut}
          onGeographyClick={this.handleDistrictClick}
          tooltip={MapTooltip}
          forceUpdate
          zoomEnable
        />
      </div>
    );
  }
}

PopulationMap.propTypes = {
  paths: PropTypes.array,
  buckets: PropTypes.array,
  unit: PropTypes.string,
  mapCenter: PropTypes.array,
  linkToDistrict: PropTypes.func.isRequired,
  query: PropTypes.func.isRequired
};

PopulationMap.defaultProps = {
  mapCenter: [ 113, -1.86 ],
  paths: [],
  buckets: [],
  unit: ''
};

export default PopulationMap;
