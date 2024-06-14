import React, { useEffect } from 'react';
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { Link } from 'react-router-dom';
import './CreateSimulation.css';
import LoadingSpinner from './LoadingSpinner';


export default function CreateSimulation() {
  const [name, setName] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [time, setTime] = React.useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    if (loaded) {
      navigate('/view-simulations');
    }
  });
  const handleSubmit = async (e) => {
    setLoading(true);
    console.log("handleSubmit");
    e.preventDefault();

    const simulationData = {
      
      name: name,
      latitude: latitude,
      longitude: longitude,
      time: time.format(), // Convert to ISO string format
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
      await setLoading(false);

      if (response.status === 200) {
        await alert('Simulation created successfully');
        setLoaded(true);
        console.log("Simulation created successfully");
      } else {
        alert('Failed to create simulation');
      }
    } catch (error) {
      console.log("Error creating simulation", error)
    }
  };

  return (
    <div className = "createSimulationContainer">
      {loading && <LoadingSpinner message="Loading Simulation. Please wait this make take a while." />}
      <h1>Input simulation information below</h1>
      <form onSubmit={handleSubmit} className = "createSimulationForm">
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className = "nameInput"/>
        </label>
        <label>
          Latitude:
          <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className = "LlatitudeInput"/>
        </label>
        <label>
          Longitude:
          <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className = "longitudeInput"/>
        </label>

        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDateTimePicker
            label="Date & Time"
            value={time}
            onChange={(newValue) => setTime(newValue)}
            renderInput={(params) => <input {...params} />}
            className = "dateTimeInput"
          />
        </LocalizationProvider>
        <button type="submit" className = "submitButton">Submit</button>
      </form>
      <Link to="/">Home</Link>
    </div>
  );
}