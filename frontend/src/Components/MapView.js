import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ImageOverlay} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ReactLeafletKml from 'react-leaflet-kml';
import L from 'leaflet';
import GeoTiffLayer from "./GeoTiffLayer";
import './MapView.css';
import TiffLegend from './TiffLegend';
import VegetationLayer from './VegetationLayer';
import { BasemapLayer, FeatureLayer, ImageMapLayer } from "react-esri-leaflet";
import { ImageService } from 'esri-leaflet';
// import WorldTiff from "./world.tif";
// import LidTif from "./LAIRD.tif";

// Fix default icon issues with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


function MapView({ kmlFileName, kmlLegendFileName, tiffFileName, discrete, latitude, longitude, maxValue, setMaxValue, coords }) {
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
  const wgs84ToWebMercatorX= (lon)=> {
    const R = 6378137.0; // Earth's radius in meters for Web Mercator
    return R * lon * Math.PI / 180;
}
  const wgs84ToWebMercatorY = (lat) => {
    const R = 6378137.0; // Earth's radius in meters for Web Mercator
    const latRad = lat * Math.PI / 180; // Convert latitude to radians
    return R * Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
}
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
    if (value <= 1/3) {
      return interpolateColor(value, 0, 1/3, [0, 100, 255], [0, 255, 0]);
    } else if (value<=2/3) {
      return interpolateColor(value, 1/3, 2/3, [0, 255, 0], [255, 255, 0]);
    } else if (value<=1){
      return interpolateColor(value, 2/3, 1, [255, 255, 0], [255, 0, 255]);
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
        preferCanvas={true} 
        center={[latitude, longitude]}
      > 
        
        <LayersControl position="bottomright">
          <div className="legendContainer">
          {kmlLegendFileName && (<img key ={kmlLegendFileName} src={`kmlLegend/${kmlLegendFileName}`} alt="legend" className = "legend" />)}
          {tiffFileName && <TiffLegend discrete={discrete} maxValue= {maxValue} setMaxValue={setMaxValue}/>}
          </div>

          {kmlData && <ReactLeafletKml kml={kmlData} />}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmlja25jNDEwIiwiYSI6ImNseGF1dGV1bDEzdDMya29pcnFjanQwYWMifQ.TOWeP4Hm_8GbeHQYt-KlUQ"
              updateWhenZooming={false}
              updateWhenIdle={true}
            ></TileLayer>
            
            
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="NAIP Imagery">
            <BasemapLayer name="NationalGeographic" />
            
          </LayersControl.BaseLayer>
          {longitude && <LayersControl.Overlay name="Vegetation">
          {/* <FeatureLayer
            url="https://services1.arcgis.com/Ko5rxt00spOfjMqj/arcgis/rest/services/Vegetation_Public/FeatureServer/0"
            updateWhenZooming={false}
            updateWhenIdle={true}
            style={(feature) => {
              switch (feature.properties.SIMPLIFIED) {
                case 'Agriculture':
                  return { color: '#7668AD' };
                case 'Coniferous forest':
                  return { color: '#384928' };
                case 'Developed':
                  return { color: '#828282' };
                case 'Grassland':
                  return { color: '#D1FF73' };
                case 'Oak woodlands':
                  return { color: '#5C7D42' };
                case 'Other':
                  return { color: '#9C7649' };
                case 'Riparian woodland':
                  return { color: '#00A884' };
                case 'Rock Outcrop':
                  return { color: '#A83800' };
                case 'Shrubland':
                  return { color: '#E6DF97' };
                case 'Streams and reservoirs':
                  return { color: '#61ADC2' };
                case 'Wetlands':
                  return { color: '#446589' };
                default:
                  return { color: '#828282' }; // Default color for undefined categories
              }
            }}
          /> */}
            <ImageOverlay url ={`https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer/exportImage/?bbox=${longitude-.03},${latitude-.03},${longitude+.03},${latitude+.03}&transparent=false&f=image&bboxSR=4326&size=&imageSR=4326&pixelType=U8&noData=&noDataInterpretation=esriNoDataMatchAny&interpolation=+RSP_BilinearInterpolation&compression=JPEG&compressionQuality=75&bandIds=&sliceId=&mosaicRule=&renderingRule=&adjustAspectRatio=true&validateExtent=true&lercVersion=1`}
            bounds = {[[latitude-.03,longitude-.03],[latitude+.03,longitude+.03]]}

            />
          </LayersControl.Overlay>}
          
          {tiffFileName && (
            <LayersControl.Overlay name="Turbulence">
              <GeoTiffLayer 
                key={tiffFileName} 
                url={`tiff/${tiffFileName}`} 
                options={options} 
              />
            </LayersControl.Overlay>
          )}
          

          <Marker position={[latitude, longitude]}>
            <Popup> 
              Coordinates: {coords}
            </Popup>
          </Marker>
        </LayersControl>
      </MapContainer>
    </div>
  );
}

export default MapView;
