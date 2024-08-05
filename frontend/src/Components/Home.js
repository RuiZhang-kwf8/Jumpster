import React from 'react';
import logo from './logo.svg';
import "./Home.css";
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='homeContainer'>
      <div className = "idk">
        <h1 className = "h1Home">Jumpster Home Page</h1>
        <img src={logo} class="titl" alt="logo" />
      </div>

      <div className = "homeLinksContainer">
        <Link to="/view-simulations" className = "homeLinks">Load Existing Simulations</Link>
        <Link to="/create-simulation" className = "homeLinks">Create a New Simulation</Link>
      </div>

      
    </div>
  );
}