import React, { useState, useEffect, useCallback } from 'react';

import MapView from './MapView';
import './ViewSimulations.css';
import Sidebar from "./Sidebar";
import { useLocation } from 'react-router-dom';


export default function ViewSimulations( ) {
    const [data, setData] = useState([]);
    const [kml, setKml] = useState("");
    const [tiff, setTiff] = useState("");
    const [kmlLegend, setkmlLegend] = useState("");
    const [coords, setCoords] = useState("");
    const [latitude, setLatitude] = useState(46.8721);
    const [longitude, setLongitude] = useState(-113.9940);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [discrete, setDiscrete] = useState(true);
    const [maxValue, setMaxValue] = useState(3);
    const location = useLocation();
    const {name, la, lo} = location.state || {};
    useEffect(() => {
        if (name) {
            setKml(name+la+lo+".kml");
        }
        if (la) {
            setLatitude(la);
        }
        if (lo) {
            setLongitude(lo);
        }
    }, [name, la, lo]);

    const handleClick = useCallback( () =>{
        const xhr = new XMLHttpRequest();
        //https://ninjastorm.firelab.org/jumpster/api/simulations http://127.0.0.1:5001/api/simulations
        xhr.open('GET', 'https://ninjastorm.firelab.org/jumpster/api/simulations');
        xhr.onload = function() {
            if (xhr.status === 200) {
                const loadedData = JSON.parse(xhr.responseText);
                setData(loadedData);
                setFilteredData(loadedData);
            }
        };
        xhr.send();
    }, []);

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

        let filteredResults = data;

    if (searchName) {
        filteredResults = filteredResults.filter(item => item.name.toLowerCase().includes(searchName));
    }

    setFilteredData(filteredResults);

    }

    return (
        <div className='viewSimulationsContainer'>
            <Sidebar filteredData={filteredData} setKml={setKml} setkmlLegend={setkmlLegend} setLatitude={setLatitude} setLongitude={setLongitude} setTiff={setTiff} handleDownload={handleDownload} handleClick={handleClick} handleSearch={handleSearch} searchTerm = {searchTerm} setDiscrete={setDiscrete} discrete={discrete} setCoords={setCoords}/>
            
            <MapView key={discrete + maxValue + tiff +kml+coords} kmlFileName={kml} kmlLegendFileName = {kmlLegend} tiffFileName={tiff} latitude={latitude} longitude={longitude} discrete ={discrete} maxValue = {maxValue} setMaxValue= {setMaxValue} coords={coords}/>
        </div>
    );
}
