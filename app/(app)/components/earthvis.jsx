"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Globe from "react-globe.gl";
import React from "react";

const EarthVis = ({ onCountrySelect, firms = [] }) => {
  const [countries, setCountries] = useState([]);
  const globeEl = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredPolygon, setHoveredPolygon] = useState(null);

  // Fetch GeoJSON data only on initial mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/countries.geojson");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('GeoJSON data loaded:', data);
        setCountries(data);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures fetch is only done once on mount

  // Resize handler with window check
  useEffect(() => {
    if (typeof window === "undefined") return; // Verificar que 'window' está definido

    const globe = globeEl.current;

    globe.controls().autoRotate = autoRotate;
    globe.controls().autoRotateSpeed = 0.1;
    globe.controls().maxZoom = 1000;

    const handleResize = () => {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      globe.camera().aspect = width / height;
      globe.camera().updateProjectionMatrix();
      globe.renderer().setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize); // Clean up on unmount
  }, [autoRotate]); // Depend on autoRotate to ensure proper handling when it changes

  // Memoize the filtered countries to avoid re-filtering on each render
  const filteredCountries = useMemo(() => {
    return countries.features?.filter(d => d.properties.ISO_A2 !== 'AQ') || [];
  }, [countries]);

  // Optimize polygon click handling
  const handlePolygonClick = useCallback((polygon) => {
    const globe = globeEl.current;

    if (autoRotate) setAutoRotate(false);

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
  }, [autoRotate, onCountrySelect]); // Memoized to avoid recreating on every render

  // Handle hover and reset view
  const handleResetView = useCallback(() => {
    const globe = globeEl.current;
    setAutoRotate(true);
    globe.pointOfView({ lat: 0, lng: 0, altitude: 2 }, 1000);
    setSelectedCountry(null);
  }, []); // Doesn't depend on any external state

  const handlePolygonHover = useCallback((polygon) => {
    setHoveredPolygon(polygon);
  }, []);

  return (
    <div ref={containerRef} className="relative z-0 w-full h-full"> 
      <Globe
        width={dimensions.width}
        height={dimensions.height}
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        lineHoverPrecision={0}
        polygonsData={filteredCountries}
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

export default React.memo(EarthVis);
