import React, { useState } from 'react';
import { MapContainer as MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "./Map.css"
import { showDataOnMap } from './util';


function Map({ countries, casesType, center, zoom }) {
    console.log('casesT', casesType);
    console.log('coord', center);

    return (
        <div className="map">
            <MapContainer center={center} zoom={zoom}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div >

    )
}

export default Map
