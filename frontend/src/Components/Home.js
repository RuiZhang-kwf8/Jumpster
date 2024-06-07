import React from 'react';
import logo from './logo.svg';
import "./Home.css";

export default function Home() {
  return (
    <section>
      <h1>Welcome home!</h1>
      <img src={logo} class="titl" alt="logo" />
     
    </section>
  );
}