import React from 'react';
import Home from './Home';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapView from './MapView';

export default function ViewSimulations() {
    const [datas, setData] = useState(null);
      useEffect(() => {
        // Define the API endpoint
        const apiUrl = 'http://localhost:5000/api/simulations';

        // Fetch data from the API
        fetch(apiUrl)
            .then(response => response.json())
            .then(datas => {
                setData(datas);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }, []); //
    

    return (
      <div>
            <h1>Simulations</h1>
            <ul>
                {datas.map(data => (
                    <li key={data.name}>
                        <p>Name: {data.name}</p>
                        <p>Latitude: {data.latitude}</p>
                        <p>Longitude: {data.longitude}</p>
                        <MapView kmltext={data.outputFileName} number={2} />
                    </li>
                ))}
            </ul>
        </div>
    );
  }