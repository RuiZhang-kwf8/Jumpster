import React from 'react';
import Home from './Home';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MapView from './MapView';

export default function ViewSimulations() {
    const [data, setData] = useState([]);
    const [kml, setKml] = useState(null);

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
    function fetchkml(id){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:5000/api/kml?id='+id);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
        if (xhr.status === 200) {
            console.log("Data loaded successfully");  
            setKml(xhr.responseText);
        }
        };
        xhr.send();
    }

    return (
      <section>
        <h1>ViewSimulations</h1>
        <button onClick={handleClick}>Load Data</button> 
        <Link to="/">Home</Link>
        <pre>
          {data.length && data.map((item) => (
          <li key={item.id}>
            
            <h2>{item.name}</h2><button onClick={fetchkml(item.id)}>Load KML</button>
            
            
          </li>
        ))}
        </pre>
        <MapView message={"hi"} number={2} />

      </section>
    );
  }