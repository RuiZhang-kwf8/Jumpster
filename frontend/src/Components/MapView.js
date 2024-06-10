import React from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import ReactLeafletKml from 'react-leaflet-kml'; 
import { useEffect, useState } from 'react';

  
  

function MapView(props) {
    const [kml, setKml] = useState(null);

    useEffect(() => {
        const kmlText = '/home/nicholas/Jumpster/Jumpster/data/missoula_valley_0_50_179m.kml';
        fetch(kmlText)
        .then((response) => response.text())
        .then((text) => {
            const parser = new DOMParser();
            const kml = parser.parseFromString(text, 'text/xml');
            setKml(kml);
        })
        .catch((error) => console.error('Error fetching KML:', error));
    }, []);


    return (
        <div>
            <h2>Child Component</h2>
            <p>{props.message}</p> {/* Use the props */}
            <p>The number is: {props.number}</p> {/* Use the props */}
            <div style={{ height: '50vh', width: '100%' }}>
            <MapContainer center={[47.0677868126, -113.8838378701]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {kml && <ReactLeafletKml kml={kml} />}
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