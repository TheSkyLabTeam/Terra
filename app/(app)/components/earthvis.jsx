"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Globe from "react-globe.gl";

const EarthVis = ({ onCountrySelect }) => { // Acepta onCountrySelect como prop
  const [countries, setCountries] = useState([]);
  const globeEl = useRef();
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);

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
    
    // Detener la rotación automática
    setAutoRotate(false);

    // Obtener el código del país
    const countryCode = polygon.properties.ADM0_A3;
    setSelectedCountry(countryCode);
    
    // Llama a la función de callback para enviar el país seleccionado al padre
    if (onCountrySelect) {
      onCountrySelect(countryCode); // Envía el countryCode al padre
    }

    // Calcular el centro del polígono
    const { coordinates } = polygon.geometry;
    let lat = 0, lng = 0, count = 0;

    // Función para procesar coordenadas
    const processCoords = (coords) => {
      coords.forEach(coord => {
        lng += coord[0];
        lat += coord[1];
        count++;
      });
    };

    // Manejar diferentes tipos de geometrías
    if (polygon.geometry.type === "Polygon") {
      processCoords(coordinates[0]);
    } else if (polygon.geometry.type === "MultiPolygon") {
      coordinates.forEach(poly => processCoords(poly[0]));
    }

    // Calcular el promedio
    lat /= count;
    lng /= count;

    // Hacer zoom al polígono
    globe.pointOfView({ lat, lng, altitude: 0.8 }, 1000);
  }, [onCountrySelect]); // Añadir onCountrySelect como dependencia

  const handleResetView = useCallback(() => {
    const globe = globeEl.current;
    
    // Reanudar la rotación automática
    setAutoRotate(true);

    // Restablecer la vista
    globe.pointOfView({ lat: 0, lng: 0, altitude: 2 }, 1000);

    // Limpiar el país seleccionado
    setSelectedCountry(null);
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
        polygonCapColor={d => 'rgba(77, 185, 227, 0.15)'}
        polygonStrokeColor={() => '#c1e5f6'}
        onPolygonClick={handlePolygonClick}
      />
    </div>
  );
};

export default EarthVis;
