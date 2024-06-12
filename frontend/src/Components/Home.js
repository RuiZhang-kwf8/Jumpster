import React from 'react';
import logo from './logo.svg';
import "./Home.css";
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='homeContainer'>
      <h1>Jumpster Home Page</h1>
      <img src={logo} class="titl" alt="logo" />
      <Link to="/view-simulations">View Simulations</Link>
      <Link to="/create-simulation">Create Simulation</Link>
    </div>
  );
}