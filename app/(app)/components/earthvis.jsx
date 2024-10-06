"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import Globe from "react-globe.gl";

const EarthVis = () => {
  const [countries, setCountries] = useState([]);
  const [labels, setLabels] = useState([]);
  const globeEl = useRef();

  useEffect(() => {
    const globe = globeEl.current;

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

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
  }, []);

  return (
    <div className="z-0">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        lineHoverPrecision={0}

        polygonsData={countries.features?.filter(d => d.properties.ISO_A2 !== 'AQ')}
        polygonCapColor={d => 'rgba(0, 120, 255, 0.1)'}
        polygonStrokeColor={() => '#ffffff'}
        
      />
    </div>
  );
};

export default EarthVis;