import { useEffect, useRef } from "react";
import proj4 from "proj4";
import { useLeafletContext } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

window.proj4 = proj4;

const GeotiffLayer = ({ url, options }) => {
  const geoTiffLayerRef = useRef();
  const context = useLeafletContext();
  const map = useMap();

  useEffect(() => {
    const container = context.layerContainer || context.map;
    console.log("container : ", container);
    console.log("url : ", url);
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        console.log("arrBuff : ", arrayBuffer);

        parseGeoraster(arrayBuffer).then((georaster) => {
          console.log("georaster:", georaster);
          options.georaster = georaster;
          geoTiffLayerRef.current = new GeoRasterLayer(options);
          container.addLayer(geoTiffLayerRef.current);

          map.fitBounds(geoTiffLayerRef.current.getBounds());
        });
      });

    return () => {
    };
  }, [context, url, map, options]);

  return null;
};

export default GeotiffLayer;
