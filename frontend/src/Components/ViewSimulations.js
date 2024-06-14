import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MapView from './MapView';
import './ViewSimulations.css';
import { useLocation } from 'react-router-dom';


export default function ViewSimulations() {
    const [data, setData] = useState([]);
    const [kml, setKml] = useState("");
    const [latitude, setLatitude] = useState(46.8721);
    const [longitude, setLongitude] = useState(-113.9940);
    const location = useLocation();
    const { simulationData } = location.state || {};
    console.log(simulationData);

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
    const handleDownload = (fileName) => {
      const fileUrl = `${process.env.PUBLIC_URL}/pdf/${fileName}`;
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    return (
        <div className='viewSimulationsContainer'>
            <h1>ViewSimulations</h1>
            <button onClick={handleClick}>Load Data</button>

            <Link to="/">Home</Link>
            <pre>
                {data.length > 0 && data.map((item) => (
                    <li key={item.id}>
                        <h2>{item.name}</h2>
                        <button onClick={() => {
                            setKml(item.outputKmlFileName);
                            setLatitude(item.latitude);
                            setLongitude(item.longitude);
                            console.log(item);
                        }}>Load KML</button>
                        <button onClick={() => handleDownload(item.outputPdfFileName)}>
                            Download PDF
                        </button>
                    </li>
                ))}
            </pre>
            <MapView key={kml} fileName={kml} latitude={latitude} longitude={longitude} />
        </div>
    );
}
