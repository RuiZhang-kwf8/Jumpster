import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet/hooks'
import 'esri-leaflet';
import L from 'leaflet';

const VegetationLayer = (props)=> {
    const map = useMap(); // Get the map instance from React Leaflet
  
    useEffect(() => {
        if (!L.esri || !L.esri.featureLayer) {
        console.error('L.esri or L.esri.featureLayer is undefined');
        return;
        }
      const vegetationLayer = L.esri.featureLayer({
        url: 'https://services1.arcgis.com/Ko5rxt00spOfjMqj/arcgis/rest/services/Vegetation_Public/FeatureServer/0'
      });
  
      vegetationLayer.addTo(map); // Add the layer to the map
  
      return () => {
        map.removeLayer(vegetationLayer); // Cleanup the layer when the component is unmounted
      };
    }, [map]);
  
    return null; // This component doesn't render anything visible
  }

  export default VegetationLayer;