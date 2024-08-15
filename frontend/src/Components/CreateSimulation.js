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
  const [coordsString, setCoordsString] = useState('');
  function ConvertDMSToDD(degrees, minutes) {
    if (degrees < 0) {
      minutes = minutes *-1;
  } // Don't do anything for N or E
    var dd = degrees + minutes/60 ;


    return dd;
  }
  const handleSubmit = async (event) => {
    if (!name || !latitude || !longitude) {
      alert("Please fill out all fields");
      return;
    }
    event.preventDefault();
    setLoading(true);
    const simulationData = {
      name: name,
      coords: coordsString,
      latitude: latitude,
      longitude: longitude,
      time: time.format(), // Convert to ISO string format
    };
    console.log(simulationData);
    const xhr = new XMLHttpRequest();
    //https://ninjastorm.firelab.org/jumpster/api/simulations
    xhr.open("POST", "https://ninjastorm.firelab.org/jumpster/api/simulations", true);
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
    const setCoords = (e) => {
      let input = e.target.value;
      if (!input) {
        return;
      }
      setCoordsString(input);
      let parts = input.match(/-?\d+(\.\d+)?/g);

      if (parts.length === 4) {
        let lat = ConvertDMSToDD(parseInt(parts[0]), parseFloat(parts[1]));
        let lon = ConvertDMSToDD(parseInt(parts[2]), parseFloat(parts[3]));
        lat = parseFloat(lat.toFixed(10));
        lon = parseFloat(lon.toFixed(10));
        setLatitude(lat);
        setLongitude(lon);
        
        console.log(parts);
      }
    }

  return (
    <div className="createSimulationContainer">
      {loaded && <Navigate to="/view-simulations"  replace={true} state = {{name: name, la: latitude, lo: longitude}} />}
      {loading && <LoadingSpinner message="Loading Simulation. Please wait this may take a while." />}
      <h1>Input simulation information below</h1>
      <form className="createSimulationForm">
        <label className = "createSimLabel">
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="createSimInput"/>
        </label>
        <label className = "createSimLabel">
          <div className = "latLongLabel">
          Coordinates: <span className="exampleLatLong">(ex. 36 57.5/-110 4.4)</span>
          </div>
          
          
          <input type="text" onChange={(e) => setCoords(e)} className="createSimInput"/>
        </label>


        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDateTimePicker
            label="Date & Time (within 18 hours)"
            value={time}
            onChange={(newValue) => setTime(newValue)}
            className="dateTimeInput createSimInput"
            minDateTime={dayjs()}       // Current time as the minimum selectable time
            maxDateTime={dayjs().add(18, 'hour')}
          />
        </LocalizationProvider>
        <button type="submit" onClick={handleSubmit} className="submitButton">Submit</button>
      </form>
      <Link to="/" className = "homeLink">Home</Link>
    </div>
  );
}
