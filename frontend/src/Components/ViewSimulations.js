import React from 'react';
import Home from './Home';
import { useState } from 'react';

export default function ViewSimulations() {
    const [data, setData] = useState(null);

    function handleClick() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/api/simulations');
        xhr.onload = function() {
        if (xhr.status === 200) {
            console.log("Data loaded successfully");   
            setData(JSON.parse(xhr.responseText));
        }
        };
        xhr.send();
    }

    return (
      <section>
        <h1>ViewSimulations</h1>
        <button onClick={handleClick}>Load Data</button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </section>
    );
  }