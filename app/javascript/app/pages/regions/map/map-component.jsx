import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { format } from 'd3-format';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Switch, Card, Dropdown, Button, Icon } from 'cw-components';
import { TabletLandscape } from 'components/responsive';
import MapGL, {Source, Layer} from 'react-map-gl';
import {fromJS} from 'immutable';
import {SVGOverlay} from 'react-map-gl';
import {range} from 'd3-array';
import {scaleQuantile} from 'd3-scale';
import mapboxgl from 'mapbox-gl';

const rasterStyle = fromJS({
  "version": 8,
  "name": 'faskes',
  "sources": {
    "base": {
      "type": "raster",
      "tiles": [
        "http://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ],
      "minzoom": 0,
      "maxzoom": 5
    },
    "faskes": {
      "type": "raster",
      "tiles": [
        "https://portal.ina-sdi.or.id/gis/services/Kemenkes/Faskes_Puskesmas/MapServer/WmsServer?&SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=0&STYLES=&FORMAT=png&TRANSPARENT=true&HEIGHT=256&WIDTH=256&SRS=EPSG%3A3857&bbox={bbox-epsg-3857}",
        // "mapbox://styles/mapbox/light-v9",
      ],
      "minzoom": 0,
      "maxzoom": 5
    }
  },
  "layers": [
    {
      "id": "base",
      "type": "raster",
      "source": "base"
    },
    {
      "id": "faskes",
      "type": "raster",
      "source": "faskes"
    }
  ]
})

function redraw({project}) {
  const [cx, cy] = project([136.2665442, -4.1249264]);
  return <circle cx={cx} cy={cy} r={4} fill="blue" />;
}

function updatePercentiles(featureCollection, accessor) {
  const {features} = featureCollection;
  const scale = scaleQuantile()
    .domain(features.map(accessor))
    .range(range(9));
  return {
    type: 'FeatureCollection',
    features: features.map(f => {
      const value = accessor(f);
      const properties = {
        ...f.properties,
        value,
        percentile: scale(value)
      };
      return {...f, properties};
    })
  };
}

class InteractiveMap extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      year: 2015,
      data: null,
      hoveredFeature: null,
      viewport: {
        latitude: -4.1249264,
        longitude: 136.2665442,
        zoom: 5,
        bearing: 0,
        pitch: 0
      }
    };
  }

  /*componentDidMount() {
    requestJson(
      'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson',
      (error, response) => {
        if (!error) {
          this._loadData(response);
        }
      }
    );
  }*/

  async componentDidMount() {
    const response = await fetch(`https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson`);
    // const response = await fetch(`http://geoportal.menlhk.go.id/arcgis/rest/services/KLHK/Penutupan_Lahan_Tahun_2018_/MapServer/0?f=pjson`);
    const json = await response.json();
    this._loadData(json);
    // this.setState({ data: json });
  }

  _loadData = data => {
    this.setState({
      data: updatePercentiles(data, f => f.properties.income[this.state.year])
    });
  };

  _updateSettings = (name, value) => {
    if (name === 'year') {
      this.setState({year: value});

      const {data} = this.state;
      if (data) {
        // trigger update
        this.setState({
          data: updatePercentiles(data, f => f.properties.income[value])
        });
      }
    }
  };

  _onViewportChange = viewport => this.setState({viewport});

  _onHover = event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'data');

    this.setState({hoveredFeature, x: offsetX, y: offsetY});
  };

  _renderTooltip() {
    const {hoveredFeature, x, y} = this.state;

    return (
      hoveredFeature && (
        <div className="tooltip" style={{left: x, top: y}}>
          <div>State: {hoveredFeature.properties.name}</div>
          <div>Median Household Income: {hoveredFeature.properties.value}</div>
          <div>Percentile: {(hoveredFeature.properties.percentile / 8) * 100}</div>
        </div>
      )
    );
  }

  render() {
    return (
      <div id="map" style={{height: '100%', width: '100%'}}>
        <MapGL
          {...this.state.viewport}
          width="100vw"
          height="100vh"
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={'pk.eyJ1IjoidGlhcmFjaG1hZCIsImEiOiJjazFoajR0aWsxZzNrM2RudHd0em1jaGpsIn0.ya8VHSENAPSps9q0vzdE-g'}
          mapStyle={rasterStyle}
        >
        </MapGL>
      </div>
    );
  }
}

InteractiveMap.propTypes = {
  t: PropTypes.func.isRequired,
  provinceISO: PropTypes.string
};

InteractiveMap.defaultProps = { 
};

export default InteractiveMap;
