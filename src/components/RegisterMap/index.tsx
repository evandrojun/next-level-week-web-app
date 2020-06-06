import React, { Component } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import './styles.css';

interface Props {
  setSelectedPosition: any
}

interface State {
  selectedPosition: [number, number]
}

class RegisterMap extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      selectedPosition: [-23.5418248, -46.69655],
    };

    this.handleMapClick = this.handleMapClick.bind(this);
  }

  handleMapClick(event: LeafletMouseEvent) {
    this.setState({
      selectedPosition: [event.latlng.lat, event.latlng.lng]
    });

    this.props.setSelectedPosition(event.latlng.lat, event.latlng.lng)
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      this.setState({selectedPosition: [latitude, longitude]});
    });
  }

  render() {
    return (
      <Map center={this.state.selectedPosition} zoom={16} onClick={this.handleMapClick}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={this.state.selectedPosition} />
      </Map>
    );
  }
}

export default RegisterMap;
