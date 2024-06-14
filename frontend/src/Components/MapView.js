import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ReactLeafletKml from 'react-leaflet-kml';
import L from 'leaflet';

// Fix default icon issues with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CurrentLocationMarker = ({ setCurrentLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = [latitude, longitude];
          setCurrentLocation(currentLocation);
          map.setView(currentLocation, map.getZoom());
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Error getting location. Please check your permissions.');
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [map, setCurrentLocation]);

  return null;
};

function MapView({ fileName, latitude, longitude }) {
  const [kmlData, setKmlData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState([latitude, longitude]);

  useEffect(() => {
    console.log(`Fetching KML file: ./kml/${fileName}`);
    fetch(`./kml/${fileName}`)
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(text, 'text/xml');
        setKmlData(kml);
        console.log("KML data set", kml);
      })
      .catch((error) => {
        console.error('Error fetching KML file:', error);
      });
  }, [fileName]);

  return (
    <div>
      <MapContainer
        style={{ height: '500px', width: '100%' }}
        zoom={17}
        center={currentLocation}
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmlja25jNDEwIiwiYSI6ImNseGF1dGV1bDEzdDMya29pcnFjanQwYWMifQ.TOWeP4Hm_8GbeHQYt-KlUQ"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {kmlData && <ReactLeafletKml kml={kmlData} />}
        <CurrentLocationMarker setCurrentLocation={setCurrentLocation} />
        {currentLocation && (
          <Marker position={currentLocation}>
            <Popup>
              You are here.
            
              Latitude: {currentLocation[0]}<br />
              Longitude: {currentLocation[1]}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;
