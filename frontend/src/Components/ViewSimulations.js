import React from 'react';
import Home from './Home';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MapView from './MapView';
import './ViewSimulations.css';

export default function ViewSimulations() {
    const [data, setData] = useState([]);
    const [kml, setKml] = useState("./missoula_valley_0_50_179m.kml");

    function handleClick() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:5000/api/simulations');
        xhr.onload = function() {
        if (xhr.status === 200) {
            console.log("Data loaded successfully");  
            setData(JSON.parse(xhr.responseText));
        }
        };
        xhr.send();
        
    }

    return (
      <div className='viewSimulationsContainer'>
        <h1>ViewSimulations</h1>
        <button onClick={handleClick}>Load Data</button> 
        <MapView fileName = {kml}  />

        <Link to="/">Home</Link>
        <pre>
          {data.length && data.map((item) => (
          <li key={item.id}>
            
            <h2>{item.name}</h2><button onClick={setKml(data.outputKmlFileName)}>Load KML</button>
            
            
          </li>
        ))}
        </pre>
        

      </div>
    );
  }