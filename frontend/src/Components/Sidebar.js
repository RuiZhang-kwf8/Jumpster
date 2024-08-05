import React, { useState, useEffect } from "react";
import "./Sidebar.css"; // Import your custom CSS for styling
import { Link } from 'react-router-dom';

const Sidebar = ({ filteredData, setKml, setkmlLegend, setLatitude, setLongitude, setTiff, setDiscrete, handleDownload, handleClick, handleSearch, searchTerm, discrete }) => {
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    handleClick();
  }, [handleClick]); // Empty array ensures this runs only once
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const convertUnixTimestampToDate = (unixTimestamp) =>{
    console.log(unixTimestamp);
    const date = new Date(unixTimestamp);
    console.log(date);
    const month = date.getUTCMonth() + 1; 
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  }
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-content">
        <div className="viewSimulationHeader">

          <Link to="/" className="viewSimulationHeaderButton">
            <span className="material-symbols-outlined sidebarIcon" >
              home
            </span>
            Home
          </Link>
          <button onClick={handleClick} className="viewSimulationHeaderButton">
            <span class="material-symbols-outlined sidebarIcon">
              refresh
            </span>
            Refresh
          </button>
          <button onClick={toggleSidebar} className="viewSimulationHeaderButton">
            <span class="material-symbols-outlined sidebarIcon">
              menu
            </span>
            Toggle Sidebar
          </button>
          <div className = "discreteButtonContainer">
            <button onClick={() => setDiscrete(!discrete)} className="discreteButton">
              {discrete ? "Continuous" : "Discrete"}
            </button>
          </div>
        </div>
        <div className ="cardList"> 
          <form onSubmit={handleSearch} className = "simulationSearchForm">
              <input
                  type="text"
                  name="search"
                  placeholder="Search Simulations"
                  className="searchInput"
                  defaultValue={searchTerm}
              />
              <button type="submit"  className = "searchButton">Search</button>
              
          </form>
          {filteredData.length > 0 &&
            filteredData.map((item) => (
              <div key={item.id} className="card">
                <div className="cardHeader">                 
                  <div className ="simName">{item.name}</div>
                  <h2 style={{ fontSize: '.8rem' }}>Latitude: {item.latitude}</h2>
                  <h2 style={{ fontSize: '.8rem' }}>Longitude: {item.longitude}</h2>
                  <h2 style={{ fontSize: '.8rem' }}>Date: {convertUnixTimestampToDate(item.time)}</h2> 
                </div>
              <div className = "cardButtons">

                  <button
                    onClick={() => {              
                      setKml(item.outputKmlFileName);
                      setkmlLegend(item.outputKmlLegendFileName);
                      setLatitude(item.latitude);
                      setLongitude(item.longitude);
                      setTiff("");
                    }}
                    className="cardButton"
                  >
                    Load Wind
                  </button>
                  <button
                    onClick={() => {
                      setTiff(item.outputTiffFileName);
                      setLatitude(item.latitude);
                      setLongitude(item.longitude);
                      setKml("");
                      setkmlLegend("");
                    }}
                    className="cardButton"
                  >
                    Load Turbulence
                  </button>
                  <button
                    onClick={() => {
                      setTiff(item.outputTiffFileName);
                      setLatitude(item.latitude);
                      setLongitude(item.longitude);
                      setKml(item.outputKmlFileName);
                      setkmlLegend(item.outputKmlLegendFileName);
                    }}
                    className="cardButton"
                  >
                    Load Both
                  </button>
                  <button onClick={() => handleDownload(item.outputPdfFileName)} className="cardButton">
                    Download PDF
                  </button>   
                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
  );};

export default Sidebar;