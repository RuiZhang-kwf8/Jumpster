import React from 'react';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { Link } from 'react-router-dom';
import './CreateSimulation.css';
import LoadingSpinner from './LoadingSpinner';
import { Navigate } from 'react-router-dom';


export default function CreateSimulation() {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [time, setTime] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const simulationData = {
      name: name,
      latitude: latitude,
      longitude: longitude,
      time: time.format(), // Convert to ISO string format
    };
    console.log(simulationData);
    const xhr = new XMLHttpRequest();
    
    xhr.open("POST", "http://127.0.0.1:5000/api/simulations", true);
    xhr.timeout = 500000;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = async () => {
      if (xhr.status === 200) {
        console.log("created simulation successfully");
        
      } else {
        console.log("Failed to create simulation:", xhr.responseText);
      }
      setLoading(false);
      setLoaded(true);
    }


    xhr.send(JSON.stringify(simulationData));
    
    };


  return (
    <div className="createSimulationContainer">
      {loaded && <Navigate to="/view-simulations"  replace={true} state = {{name: name, la: latitude, lo: longitude}} />}
      {loading && <LoadingSpinner message="Loading Simulation. Please wait this may take a while." />}
      <h1>Input simulation information below</h1>
      <form className="createSimulationForm">
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="nameInput"/>
        </label>
        <label>
          Latitude:
          <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="latitudeInput"/>
        </label>
        <label>
          Longitude:
          <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="longitudeInput"/>
        </label>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDateTimePicker
            label="Date & Time"
            value={time}
            onChange={(newValue) => setTime(newValue)}
            className="dateTimeInput"
            minDateTime={dayjs()}       // Current time as the minimum selectable time
            maxDateTime={dayjs().add(18, 'hour')}
          />
        </LocalizationProvider>
        <button type="submit" onClick={handleSubmit} className="submitButton">Submit</button>
      </form>
      <Link to="/">Home</Link>
    </div>
  );
}
