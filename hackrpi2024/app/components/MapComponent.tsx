
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'tailwindcss/tailwind.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoid2FuZ3duaWNvIiwiYSI6ImNtM2FoeGtzZzFkZWMycG9tendleXhna2cifQ.FyBqY-UtfsFwpqeaY0vlpw';

const MapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    const bounds: [number, number, number, number] = [-74.0210, 40.6981, -73.8655, 40.9153];
      
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-73.9654, 40.7829], // Centered on NYC
            zoom: 15,
            pitch: 60,
            bearing: -20,
            maxBounds: bounds
        });

        map.on('load', () => {

            // Insert a 3D building layer with color based on height
            map.addLayer({
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15, // Minimum zoom level for showing 3D buildings
                'paint': {
                    'fill-extrusion-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'height'],
                        0, '#E3F2FD',       // Lightest blue
                        20, '#BBDEFB',
                        40, '#90CAF9',
                        60, '#64B5F6',
                        80, '#42A5F5',
                        100, '#2196F3',     // Medium blue
                        150, '#1E88E5',
                        200, '#1976D2',
                        250, '#1565C0'      // Darkest blue
                    ],
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'min_height'],
                    'fill-extrusion-opacity': 0.6,
                }
            });
            

            // Change the cursor to a pointer when the mouse is over the regions layer
            map.on('mouseenter', 'regions-layer', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Change the cursor back to default when it leaves the regions layer
            map.on('mouseleave', 'regions-layer', () => {
                map.getCanvas().style.cursor = '';
            });

            map.on('click', (event) => {
                const { lng, lat } = event.lngLat;
                console.log("Longitude: " + lng + " Latitude: " + lat);
            })
        });

        return () => map.remove();
    }, []);

    return (
        <div>
            <div ref={mapContainerRef} className="absolute top-0 bottom-0 w-full" />
            <div ref={infoRef} className="absolute bottom-10 left-10 bg-white p-4" />
        </div>
    );
};

export default MapComponent;