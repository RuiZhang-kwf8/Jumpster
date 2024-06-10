import React from 'react';
import { MapContainer , TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import ReactLeafletKml from 'react-leaflet-kml'; 
import { useEffect, useState } from 'react';


  
  

function MapView(props) {
    const [kml, setKml] = useState(null);

    useEffect(() => {
        const kmlText = '/missoula_valley_0_50_179m.kml';
        fetch(kmlText)
        .then((response) => response.text())
        .then((text) => {
            console.log(text);
            const parser = new DOMParser();
            const kml = parser.parseFromString(text, 'text/xml');
            setKml(kml);
        })
        .catch((error) => console.error('Error fetching KML:', error));
    }, []);


    return (
        <div>
            <div>
                <MapContainer
                    style={{ height: "500px", width: "100%" }}
                    zoom={17}
                    center={[47.0677868126, -113.8838378701]}
                >
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {kml && <ReactLeafletKml kml={kml} />}
                </MapContainer>
            </div>
            
        </div>
        
    );
}

export default MapView;