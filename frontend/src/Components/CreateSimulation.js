import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { Link } from 'react-router-dom';
import './CreateSimulation.css';
import LoadingSpinner from './LoadingSpinner';

export default function CreateSimulation() {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [time, setTime] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const simulationData = {
      name: name,
      latitude: latitude,
      longitude: longitude,
      time: time.format(), // Convert to ISO string format
    };
    console.log(simulationData);

    sendSimulationData(simulationData)
      .then(() => {
        console.log("Simulation created successfully, navigating to /view-simulations");
        setLoading(false);  // Ensure loading is set to false before navigating
        navigate('/view-simulations');
      })
      .catch((error) => {
        console.error("Failed to create simulation:", error);
        alert('Failed to create simulation');
        setLoading(false);  // Ensure loading is set to false on error
      });
  };

  const sendSimulationData = (data) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:5000/api/simulations", true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error(`Request failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = function () {
        reject(new Error("Network error"));
      };

      xhr.send(JSON.stringify(data));
    });
  };

  return (
    <div className="createSimulationContainer">
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
