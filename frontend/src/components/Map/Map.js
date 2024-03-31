import React, { useState, useEffect } from 'react';
import classes from './map.module.css';
import 'leaflet/dist/leaflet.css'; // for leaflet map appearance
import {
    MapContainer, // provider container for useMapEvents
    TileLayer, // shows tiles of the map
    Marker,
    Popup, // extra info of Marker
    useMapEvents, // gets all the map events - click, locationfound, locationerror
} from 'react-leaflet';
import { toast } from 'react-toastify'; // for showing some messages
import * as L from 'leaflet'; // import everything inside leaflet as 'L'

// readonly and location - comes to the map
// onChange - event that sends the data from the map to outside
export default function Map({ readonly, location, onChange }) {
  return (
    <div className={classes.container}>
        <MapContainer
            className={classes.map}
            center={[0,0]}
            zoom={1}
            dragging={!readonly}
            touchZoom={!readonly}
            doubleClickZoom={!readonly}
            scrollWheelZoom={!readonly}
            boxZoom={!readonly}
            keyboard={!readonly}
            attributionControl={false}
        >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FindButtonAndMarker
            readonly={readonly}
            location={location}
            onChange={onChange}
        />
        </MapContainer>
    </div>
  )
}

function FindButtonAndMarker({ readonly, location, onChange }) {
    const [position, setPosition] = useState(location); // gets location

    // whenever position changes, it calls onChange on current position
    useEffect(() => {
        if (readonly) { // if readonly mode, set to a default view
            map.setView(position, 13);
            return;
        }
        // if position is not null, call onChange
        if (position) onChange(position);
    }, [position]);

    const map = useMapEvents ({
        click(e) { 
            // on click, if not readonly mode, set position from click
            !readonly && setPosition(e.latlng);
        },
        locationfound(e) {
             // after clicking find my location button, new location is set
            setPosition(e.latlng);
            // map changes to new position
            map.flyTo(e.latlng, 13);
        },
        locationerror(e) {
            toast.error(e.message);
        },
    });

    const markerIcon = new L.Icon({
        iconUrl: '/marker-icon-2x.png', // make sure to add '/' at the front to find the img at root of site
        // [width, height]
        iconSize: [25, 41],
        iconAnchor: [12.5, 41], // bottom half of the marker
        popupAnchor: [0, -41], // puts the popup on top of the marker
    });

    return (
        <>
            {!readonly && ( // if not readonly mode, show 'Find My Location' button
                // find my location button
                <button
                    type="button"
                    className={classes.find_location}
                    onClick={() => map.locate()}
                >
                    Find My Location
                </button>
            )}

            {position && ( // if position exists, show marker 
                // location marker
                <Marker 
                    eventHandlers={{
                        dragend: e => { // marker is dragged and released by user
                            setPosition(e.target.getLatLng()); // set new position from event
                        },
                    }}
                    position={position} // set position to position state
                    draggable={!readonly} // enable draggable if not readonly mode
                    icon={markerIcon} // shows marker icon on map
                >
                    <Popup>Shipping Location</Popup>
                </Marker>
            )}
        </>
    );
}

