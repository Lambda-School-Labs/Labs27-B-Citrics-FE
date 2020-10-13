import React, { useState } from 'react';
import mapStyles from './mapStyles';
import SearchBar from './searchbar';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { Button } from 'antd';

const libraries = ['places'];

const mapContainerStyle = {
  width: '99vw',
  height: '90vh',
};

const center = {
  lat: 39.106667,
  lng: -94.676392,
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

// COMPONENT
const MapService = props => {
  // REDUX STATE
  const markers = useSelector(state => state.cityReducer.markers);

  const [selected, setSelected] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback(map => {
    mapRef.current = map;
  }, []);

  if (loadError) return 'Error Loading Maps';
  if (!isLoaded) return 'Loading...';

  return (
    <>
      <div className="search-bar-container">
        <SearchBar panToCenter={panTo} />
      </div>
      <div id="map">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={5}
          center={center}
          options={options}
          onLoad={onMapLoad}
        >
          {markers.map(marker => (
            <Marker
              key={`${marker.lat}-${marker.lng}`}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={e => setSelected(marker)}
              icon={{
                url: `pointer.svg`,
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          ))}

          {selected ? (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="pointer-info">
                <h2>{selected.cityName ? selected.cityName : 'Error'}</h2>
                <Button type="primary" size="large">
                  Add to Comparison
                </Button>
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </div>
    </>
  );
};

export default MapService;
