"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Globe from "react-globe.gl";

const EarthVis = ({ onCountrySelect, firms }) => {
  const [countries, setCountries] = useState([]);
  const globeEl = useRef();
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  firms = firms || [];

  useEffect(() => {
    const globe = globeEl.current;

    globe.controls().autoRotate = autoRotate;
    globe.controls().autoRotateSpeed = 0.1;
    globe.controls().maxZoom = 1000;

    fetch("/countries.geojson")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('GeoJSON data loaded:', data);
        setCountries(data);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
      });
  }, [autoRotate]);

  const handlePolygonClick = useCallback((polygon) => {
    const globe = globeEl.current;
    
    setAutoRotate(false);

    const countryCode = polygon.properties.ADM0_A3;
    setSelectedCountry(countryCode);
    
    if (onCountrySelect) {
      onCountrySelect(countryCode);
    }

    const { coordinates } = polygon.geometry;
    let lat = 0, lng = 0, count = 0;

    const processCoords = (coords) => {
      coords.forEach(coord => {
        lng += coord[0];
        lat += coord[1];
        count++;
      });
    };

    if (polygon.geometry.type === "Polygon") {
      processCoords(coordinates[0]);
    } else if (polygon.geometry.type === "MultiPolygon") {
      coordinates.forEach(poly => processCoords(poly[0]));
    }

    lat /= count;
    lng /= count;

    globe.pointOfView({ lat, lng, altitude: 0.8 }, 1000);
  }, [onCountrySelect]);

  const handleResetView = useCallback(() => {
    const globe = globeEl.current;
    
    setAutoRotate(true);
    globe.pointOfView({ lat: 0, lng: 0, altitude: 2 }, 1000);
    setSelectedCountry(null);
  }, []);

  const handlePolygonHover = useCallback((polygon) => {
    setHoveredPolygon(polygon);
  }, []);

  return (
    <div className="relative z-0"> 
      <Globe
        className="w-full h-full relative z-0"
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        lineHoverPrecision={0}
        polygonsData={countries.features?.filter(d => d.properties.ISO_A2 !== 'AQ')}
        polygonCapColor={d => d === hoveredPolygon ? 'rgba(77, 185, 227, 0.3)' : 'rgba(77, 185, 227, 0.15)'}
        polygonSideColor={() => 'rgba(77, 185, 227, 0.15)'}
        polygonStrokeColor={() => '#c1e5f6'}
        polygonAltitude={d => d === hoveredPolygon ? 0.005 : 0.01}
        onPolygonClick={handlePolygonClick}
        onPolygonHover={handlePolygonHover}
        polygonsTransitionDuration={200}

        pointsData={firms}
        pointLat="latitude"
        pointLng="longitude"
        pointColor={() => 'red'}
        pointAltitude={0.01}
        pointRadius={0.2}
        pointsMerge={false}
        pointLabel={d => `
          <div>
            <b>${d.country_id}</b><br/>
            Date: ${d.acq_date}<br/>
            Time: ${d.acq_time}<br/>
            Brightness: ${d.bright_ti4}
          </div>
        `}
      />
    </div>
  );
};

export default EarthVis;