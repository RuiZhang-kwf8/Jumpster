import React, { useEffect, useState } from 'react';

import './TiffLegend.css';

const TiffLegend = ({ discrete , maxValue, setMaxValue}) => {
    const [legendValues, setLegendValues] = useState([]);
    console.log(maxValue);
    const handleMaxValueChange = (event) => {
        setMaxValue(event.target.maxValue.value);
    };
    useEffect(() => {
        
        const values = [0, Math.round(maxValue / 3 *10)/10, Math.round(maxValue*2 / 3 *10)/10, maxValue];
        setLegendValues(values);
    }, [maxValue]);

    return (
        <div className = "legend">
            <div className="legendTitle">Wind Speed Fluctuations (MPH)</div>
            <div className ="maxVal">Max Value:
            <form onSubmit={handleMaxValueChange} className = "maxValForm">
            <input
                type="text"
                name="maxValue"
                placeholder="3"
                className="maxValInput"
                defaultValue={maxValue}
            />
            <button type="submit"  className = "maxValButton">Change</button>
            </form>

            </div>
            <div className="legendList">
                <div className="legendItem" >
                    <div className = "color" style={{ backgroundColor: 'rgba(255,0,0,1)' }}></div>
                    <div className = "legendText">{legendValues[3]} + </div>
                </div> 
                <div className="legendItem" >
                    <div className = "color" style={{ backgroundColor: 'rgba(255,255,0,1)' }}></div>
                    <div className = "legendText">{legendValues[2]} - {legendValues[3]}</div>
                </div>
                <div className="legendItem" >
                    <div className = "color" style={{ backgroundColor: 'rgba(0,255,0,1)' }}></div>
                    <div className = "legendText">{legendValues[1]} - {legendValues[2]}</div>
                </div>
                <div className="legendItem" >
                    <div className = "color" style={{ backgroundColor: 'rgba(0,100,255,1)' }}></div>
                    <div className = "legendText">{legendValues[0]} - {legendValues[1]}</div>
                </div>
            </div>
        </div>
    );
};

export default TiffLegend;