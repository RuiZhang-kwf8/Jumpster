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
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const location = useLocation();
    const { simulationData } = location.state || {};
    console.log(simulationData);

    function handleClick() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:5000/api/simulations');
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log("Data loaded successfully");
                const loadedData = JSON.parse(xhr.responseText);
                setData(loadedData);
                setFilteredData(loadedData);
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


    function handleSearch(event) {
        event.preventDefault(); // Prevent form submission from reloading the page
        const searchName = event.target.elements.search.value.toLowerCase();
        const searchLat = event.target.elements.search1.value.toLowerCase();
        const searchLong = event.target.elements.search2.value.toLowerCase();
        const searchTime = event.target.elements.search3.value.toLowerCase();

        let filteredResults = data;

    if (searchName) {
        filteredResults = filteredResults.filter(item => item.name.toLowerCase().includes(searchName));
    }

    if (searchLat) {
        filteredResults = filteredResults.filter(item => item.latitude.toString().includes(searchLat));
    }

    if (searchLong) {
        filteredResults = filteredResults.filter(item => item.longitude.toString().includes(searchLong));
    }

    if (searchTime) {
        filteredResults = filteredResults.filter(item => item.time.toString().includes(searchTime));
    }

    setFilteredData(filteredResults);

    }

    return (
        <div className='viewSimulationsContainer'>
            <h1>View Simulations</h1>
            <button onClick={handleClick} className="loadButton">Load Data</button>
            <Link to="/" className="homeLink">Home</Link>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    name="search"
                    placeholder="Search Simulations"
                    className="searchInput"
                    defaultValue={searchTerm}
                />
                <button type="submit" style={{ marginRight: '9px' }}>Search</button>

                <input
                    type="text"
                    name="search1"
                    placeholder="Search Simulations"
                    className="searchInput"
                    defaultValue={searchTerm}
                />
                <button type="submit" style={{ marginRight: '9px' }}>Search By Lat</button>

                <input
                    type="text"
                    name="search2"
                    placeholder="Search Simulations"
                    className="searchInput"
                    defaultValue={searchTerm}
                />
                <button type="submit" style={{ marginRight: '9px' }}>Search By Long</button>

                <input
                    type="text"
                    name="search3"
                    placeholder="Search Simulations"
                    className="searchInput"
                    defaultValue={searchTerm}
                />
                <button type="submit" style={{ marginRight: '9px' }}>Search By Time</button>
            </form>

            <div className="cardContainer">
                <pre>
                {filteredData.length > 0 &&
                    filteredData.map((item) => (
                        <div key={item.id} className="card">
                            <h2 >{item.name}</h2>
                            <h2 style={{ fontSize: '.8rem' }}>Latitude: {item.latitude}</h2>
                            <h2 style={{ fontSize: '.8rem' }}>Longitude: {item.longitude}</h2>
                            <button
                                onClick={() => {
                                    setKml(item.outputKmlFileName);
                                    setLatitude(item.latitude);
                                    setLongitude(item.longitude);
                                    console.log(item);
                                }}
                            >
                                Load KML
                                
                            </button>

                        <button onClick={() => handleDownload(item.outputPdfFileName)}>
                            Download PDF
                        </button>
                        
                        </div>
                    ))}

            </pre>
            <MapView key={kml} fileName={kml} latitude={latitude} longitude={longitude} />
            </div>
            </div>
    );
}
