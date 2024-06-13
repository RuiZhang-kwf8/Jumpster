import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ReactLeafletKml from 'react-leaflet-kml';

function MapView({ fileName }) {
    const [kmlData, setKmlData] = useState();
    console.log(`./kml/${fileName}`);
    useEffect(() => {
        fetch(`./kml/${fileName}`)
            .then((response) => response.text())
            .then((text) => {
                const parser = new DOMParser();
                const kml = parser.parseFromString(text, 'text/xml');
                setKmlData(kml);
            })
            .catch((error) => {
                console.error('Error fetching KML file:', error);
            });
    }, [fileName]);

    return (
        <div>
            <div>
                <MapContainer
                    style={{ height: '500px', width: '100%' }}
                    zoom={17}
                    center={[42, -115]}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {kmlData && <ReactLeafletKml kml={kmlData} />}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapView;
