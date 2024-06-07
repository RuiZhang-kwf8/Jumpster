import React from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

  
  

function MapView(props) {
    return (
        <div>
            <h2>Child Component</h2>
            <p>{props.message}</p> {/* Use the props */}
            <p>The number is: {props.number}</p> {/* Use the props */}
            <div style={{ height: '50vh', width: '100%' }}>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
            </Marker>
            </MapContainer>
            </div>
            
        </div>
        
    );
}

export default MapView;