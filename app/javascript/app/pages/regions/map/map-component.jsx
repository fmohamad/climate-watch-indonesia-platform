import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { format } from 'd3-format';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import mapClimate from 'assets/mapClimate';
import mapDisaster from 'assets/mapDisaster';
import mapFaskes from 'assets/mapFaskes';
import mapGeology from 'assets/mapGeology';
import mapLand from 'assets/mapLand';
import mapTopography from 'assets/mapTopography';
import { Switch, Card, Dropdown, Button, Icon } from 'cw-components';
import { TabletLandscape } from 'components/responsive';
import MapGL, {Source, Layer, SVGOverlay, NavigationControl } from 'react-map-gl';
// import MapGL, {Source, Layer, SVGOverlay } from 'mapbox-gl/dist/mapbox-gl'
import {fromJS} from 'immutable';
import {range} from 'd3-array';
import {scaleQuantile} from 'd3-scale';
import mapboxgl from 'mapbox-gl';
import styles from './map-styles.scss';

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

const faskesSource = {
  "faskes": {
    "type": "raster",
    "tiles": [
      "https://portal.ina-sdi.or.id/gis/services/Kemenkes/Faskes_Puskesmas/MapServer/WmsServer?&SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=0&STYLES=&FORMAT=png&TRANSPARENT=true&HEIGHT=256&WIDTH=256&SRS=EPSG%3A3857&bbox={bbox-epsg-3857}",
      // "mapbox://styles/mapbox/light-v9",
    ]
  }
}

class InteractiveMap extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      year: 2015,
      data: null,
      hoveredFeature: null,
      viewport: {
        latitude: -2.2571064091448814,
        longitude: 132.07214355468753,
        zoom: 5.5,
        bearing: 0,
        pitch: 0
      },
      rasterStyle: {
        "version": 8,
        "name": 'faskes',
        "sources": {
          "base": {
            "type": "raster",
            "tiles": [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ]
          },
          "faskes": {
            "type": "raster",
            "tiles": [
              "https://portal.ina-sdi.or.id/gis/services/Kemenkes/Faskes_Puskesmas/MapServer/WmsServer?&SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=0&STYLES=&FORMAT=png&TRANSPARENT=true&HEIGHT=256&WIDTH=256&SRS=EPSG%3A3857&bbox={bbox-epsg-3857}",
              // "mapbox://styles/mapbox/light-v9",
            ]
          }
        },
        "layers": [
          {
            "id": "base",
            "type": "raster",
            "source": "base",
          },
          {
            "id": "faskes",
            "type": "raster",
            "source": "faskes",
            "layout": {
              "visibility": "none",
            },
          }
        ]
      },
      faskesLayer: {
        id: 'landuse_park',
        type: 'raster',
        source: faskesSource.faskes,
      },
      faskesVisible: false
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

  toggleLayer(layer) {
    if(layer !== 'faskes') {
      alert('Data belum tersedia!')
    } else {
      this.setState({
        faskesVisible: !this.state.faskesVisible
      })
    }
  }

  render() {
    const { rasterStyle } = this.state
    // console.log('rasterStyleasd', rasterStyle);
    return (
     <div className={styles.page}> 
      <div className={styles.mapContainer}>
        <div id="map" style={{height: 500}} className={styles.map}>
          <MapGL
            {...this.state.viewport}
            width="100%"
            height="100%"
            onViewportChange={this._onViewportChange}
            mapboxApiAccessToken={'pk.eyJ1IjoidGlhcmFjaG1hZCIsImEiOiJjazFoajR0aWsxZzNrM2RudHd0em1jaGpsIn0.ya8VHSENAPSps9q0vzdE-g'}
            mapStyle={"mapbox://styles/mapbox/light-v9"}
          >
            <Layer {...this.state.faskesLayer} layout={{'visibility': this.state.faskesVisible? 'visible' : 'none'}} />
            <div style={{position: 'absolute', right: 10, top: 10}}>
              <NavigationControl />
            </div>
            <div className={styles.mapButtonWrapper}>
              <div className={styles.mapButton} onClick={() => this.toggleLayer('faskes')}>
                <Icon icon={mapFaskes} style={{height: 25, width: 25}} />
                <p className={styles.buttonText}>
                  FASILITAS KESEHATAN
                </p>
              </div>
              <div className={styles.mapButton} onClick={() => this.toggleLayer('topography')}>
                <Icon icon={mapTopography} style={{height: 25, width: 25}} />
                <p className={styles.buttonText}>
                  TOPOGRAFI
                </p>
              </div>
              <div className={styles.mapButton} onClick={() => this.toggleLayer('geology')}>
                <Icon icon={mapGeology} style={{height: 25, width: 25}} />
                <p className={styles.buttonText}>
                  GEOLOGI
                </p>
              </div>
              <div className={styles.mapButton} onClick={() => this.toggleLayer('climatology')}>
                <Icon icon={mapClimate} style={{height: 25, width: 25}} />
                <p className={styles.buttonText}>
                  KLIMATOLOGI
                </p>
              </div>
              <div className={styles.mapButton} onClick={() => this.toggleLayer('land')}>
                <Icon icon={mapLand} style={{height: 25, width: 25}} />
                <p className={styles.buttonText}>
                  KARAKTERISTIK PENGGUNAAN LAHAN
                </p>
              </div>
              <div className={styles.mapButton} onClick={() => this.toggleLayer('disaster')}>
                <Icon icon={mapDisaster} style={{height: 25, width: 25}} />
                <p className={styles.buttonText}>
                  INDEX RESIKO BENCANA
                </p>
              </div>
            </div>
          </MapGL>
        </div>
      </div>
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
