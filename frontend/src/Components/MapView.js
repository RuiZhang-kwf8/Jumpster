import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ReactLeafletKml from 'react-leaflet-kml';
import L from 'leaflet';
import GeoTiffLayer from "./GeoTiffLayer";
import './MapView.css';
import TiffLegend from './TiffLegend';
// import WorldTiff from "./world.tif";
// import LidTif from "./LAIRD.tif";

// Fix default icon issues with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


function MapView({ kmlFileName, kmlLegendFileName, tiffFileName, discrete, latitude, longitude, maxValue, setMaxValue }) {
  const [kmlData, setKmlData] = useState(null);
  useEffect(() => {
    if (kmlFileName) {
      fetch(`./kml/${kmlFileName}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((text) => {
          const parser = new DOMParser();
          const kml = parser.parseFromString(text, 'text/xml');
          setKmlData(kml);
        })
        .catch((error) => {
          console.error('Error fetching KML file:', error);
        });
    }
  }, [kmlFileName]);
  const interpolateColor = (value, min, max, startColor, endColor) => {
    
    var ratio = (value - min) / (max - min);
    if (discrete){
      ratio = 0;
    }
    const r = Math.round(startColor[0] + ratio * (endColor[0] - startColor[0]));
    const g = Math.round(startColor[1] + ratio * (endColor[1] - startColor[1]));
    const b = Math.round(startColor[2] + ratio * (endColor[2] - startColor[2]));
    return `rgba(${r},${g},${b},1)`;
  };
  const getColor = (nir) => {
    if (nir === 0) return 'rgba(0,0,0,0)'; // Transparent for 0 values
    const value = nir / maxValue;
    if (value <= 1/2) {
      return interpolateColor(value, 0, 1/2, [0, 255, 0], [255, 255, 0]);
    } else if (value<=1) {
      return interpolateColor(value, 1/2, 1, [255, 255, 0], [255, 0, 0]);
    }else{
      return interpolateColor(value, 1, 999999999, [255, 0, 0], [255, 0, 0]);
    }
  };
  
  const options = {

    pixelValuesToColorFn: (values) => {
      const nir = values[0];
      return getColor(nir);
    },
    resolution: 64,
    opacity: .4
  };
  return (
    <div className="totalContainer">
      <MapContainer
        key = {tiffFileName}
        style={{ height: '100vh', width: '100%', position: "relative" }}
        zoom={17}
        center={[latitude, longitude]}
      > 
        <div className="legendContainer">
        {kmlLegendFileName && (<img key ={kmlLegendFileName} src={`kmlLegend/${kmlLegendFileName}`} alt="legend" className = "legend" />)}
        {tiffFileName && <TiffLegend discrete={discrete} maxValue= {maxValue} setMaxValue={setMaxValue}/>}
        </div>

        {kmlData && <ReactLeafletKml kml={kmlData} />}
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmlja25jNDEwIiwiYSI6ImNseGF1dGV1bDEzdDMya29pcnFjanQwYWMifQ.TOWeP4Hm_8GbeHQYt-KlUQ"
          
        />
        {tiffFileName && (
          <GeoTiffLayer 
            key={tiffFileName} 
            url={`tiff/${tiffFileName}`} 
            options={options} 
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;
