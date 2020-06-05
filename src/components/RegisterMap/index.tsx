import React, { Component } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';

import './styles.css';

class RegisterMap extends Component {
  render() {
    return (
      <Map center={[-23.5418248, -46.69655]} zoom={18}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[-23.5418248, -46.69655]} />
      </Map>
    );
  }
}

export default RegisterMap;
