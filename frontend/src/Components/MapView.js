import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ReactLeafletKml from 'react-leaflet-kml';

function MapView({ fileName , latitude, longitude}) {
    const [kmlData, setKmlData] = useState(null);

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
                center={[latitude, longitude]}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {kmlData && (
                    <ReactLeafletKml kml={kmlData} />
                )}
            </MapContainer>
        </div>
    );
}

export default MapView;
