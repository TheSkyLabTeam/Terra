'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Globe from "react-globe.gl";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Flag from 'react-world-flags';
import { CalendarIcon, ClockIcon, FlameIcon, MapIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const EarthVis = ({ onCountrySelect, dateRange, firms = [] }) => {
  const [countries, setCountries] = useState([]);
  const globeEl = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [airQualityData, setAirQualityData] = useState(null);

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
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [autoRotate]);

  const filteredCountries = useMemo(() => {
    return countries.features?.filter(d => d.properties.ISO_A2 !== 'AQ') || [];
  }, [countries]);

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
  }, [autoRotate, onCountrySelect]);

  const handleResetView = useCallback(() => {
    const globe = globeEl.current;
    setAutoRotate(true);
    globe.pointOfView({ lat: 0, lng: 0, altitude: 2 }, 1000);
    setSelectedCountry(null);
    setSelectedPoint(null);
  }, []);

  const handlePolygonHover = useCallback((polygon) => {
    setHoveredPolygon(polygon);
  }, []);

  const handlePointClick = useCallback(async (point) => {
    setSelectedPoint(point);
    setIsDialogOpen(true);
    if (autoRotate) setAutoRotate(false);
    globeEl.current.pointOfView({ lat: point.latitude, lng: point.longitude, altitude: 0.8 }, 1000);

    try {
      const response = await fetch(`https://api-hackathon-fuego.onrender.com/calidad_aire/historico/?lat=${point.latitude}&lon=${point.longitude}&fecha_inicio=${dateRange.startDate}&fecha_fin=${dateRange.endDate}`);
      const data = await response.json();
      setAirQualityData(data);
    } catch (error) {
      console.error('Error fetching air quality data:', error);
    }
  }, [autoRotate, dateRange]);

  const htmlElementsData = useMemo(() => {
    return firms.map(firm => ({
      ...firm,
      size: 8,
      color: 'red'
    }));
  }, [firms]);

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

        htmlElementsData={htmlElementsData}
        htmlElement={d => {
          const el = document.createElement('div');
          el.style.backgroundColor = d.color;
          el.style.width = `${d.size}px`;
          el.style.height = `${d.size}px`;
          el.style.borderRadius = '50%';
          el.style.pointerEvents = 'auto';
          el.style.cursor = 'pointer';
          el.onclick = () => handlePointClick(d);
          return el;
        }}
        htmlLat="latitude"
        htmlLng="longitude"
        htmlAltitude={0.01}
      />
      <Dialog className="max-w-3xl" open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex flex-row font-cabinet items-center gap-2">{selectedPoint?.country_id || 'Point Details'} <Flag className="w-6 h-6" code={selectedPoint?.country_id.toUpperCase()}/></DialogTitle>
            <DialogDescription>
              {selectedPoint && (
                <>
                  <TooltipProvider>
                    <div className="bg-cerulean-200 flex flex-row items-center justify-between gap-2 p-2 rounded-md">
                      <div className="flex flex-col items-center justify-center text-cerulean-800">
                        <Tooltip>
                          <TooltipTrigger>
                            <CalendarIcon className="h-6 w-6" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Date</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-xs mt-1">{selectedPoint.acq_date}</span>
                        <span className="text-xs">Date</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-cerulean-800">
                        <Tooltip>
                          <TooltipTrigger>
                            <ClockIcon className="h-6 w-6" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Acquisition Time</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-xs mt-1">{selectedPoint.acq_time}</span>
                        <span className="text-xs">Time</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-cerulean-800">
                        <Tooltip>
                          <TooltipTrigger>
                            <FlameIcon className="h-6 w-6" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Brightness captured by sensor</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-xs mt-1">{selectedPoint.bright_ti4}</span>
                        <span className="text-xs">Brightness</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-cerulean-800">
                        <Tooltip>
                          <TooltipTrigger>
                            <MapIcon className="h-6 w-6" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Latitude and Longitude</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-xs mt-1">[{selectedPoint.latitude}, {selectedPoint.longitude}]</span>
                        <span className="text-xs">Coordinates</span>
                      </div>
                    </div>
                  </TooltipProvider>
                  {airQualityData && (
                    <div className="mt-4">
                      <h3 className="text-lg font-cabinet mb-2">Air Quality Data</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4 flex flex-col items-center justify-center">
                            <span className="text-2xl font-cabinet antialiased">{airQualityData.promedio_aqi.toFixed(2)}</span>
                            <span className="text-sm font-satoshi text-woodsmoke-600">AQI</span>
                          </CardContent>
                        </Card>
                        {Object.entries(airQualityData.promedio_componentes).map(([key, value]) => (
                          <Card key={key}>
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                              <span className="text-2xl font-cabinet antialiased">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                              <span className="text-sm font-satoshi text-woodsmoke-600 antialiased">{key.toUpperCase()}</span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(EarthVis);