import React from 'react';
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function CreateSimulation() {
  const [name, setName] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const navigate = useNavigate(); 
  

  const handleSubmit = async (e) => {
    console.log("handleSubmit");
    e.preventDefault();

    const simulationData = {
      
        "name" : name,
        "latitude": latitude,
        "longitude": longitude
    
    };
    console.log(simulationData);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(simulationData)
      });
      if (response.ok) {
        alert('Simulation created successfully');
        navigate('/view-simulations');
      } else {
        alert('Failed to create simulation');
      }
    } catch (error) {
      console.log("Error creating simulation", error)
    }
  };

  return (
    <section>
      <h1>Input simulation information below</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Latitude:
          <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </label>
        <label>
          Longitude:
          <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}