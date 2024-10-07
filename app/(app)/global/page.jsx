"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui/datepicker";
import { XIcon } from 'lucide-react';
import PointLabel from '../components/pointlabel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


// Importación dinámica de componentes que dependen del navegador
const EarthVis = dynamic(() => import("@/app/(app)/components/earthvis"), { ssr: false });
const BarCharts = dynamic(() => import("@/components/charts/barcharts").then(mod => mod.BarCharts), { ssr: false });

const Page = () => {
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [firms, setFirms] = useState([]);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartBright, setChartBright] = useState([]);
  const [chartFrp, setChartFrp] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(chartBright)

  const handleDateChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
  };

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
  };

  useEffect(() => {
    const getFirms = async () => {
      if (!selectedCountry || !dateRange.startDate || !dateRange.endDate) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://api-hackathon-fuego.onrender.com/obtener_datos_firms/?country=${selectedCountry}&start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setFirms(data);
        setChartData(groupByDate(data));
        setChartBright(calculateAverage(data, 'bright_ti4'));
        setChartFrp(calculateAverage(data, 'frp'));
        setShowDataPanel(data.length > 0);
      } catch (error) {
        console.error("Error fetching firms:", error);
        setShowDataPanel(false);
      } finally {
        setLoading(false);
      }
    };

    getFirms();
  }, [selectedCountry, dateRange.startDate, dateRange.endDate]);

  const groupByDate = (firms) => {
    const countsByDate = firms.reduce((acc, firm) => {
      const { acq_date } = firm;
      acc[acq_date] = (acc[acq_date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(countsByDate).map(([acq_date, count_dos]) => ({
      acq_date,
      count_dos,
    }));
  };

  const calculateAverage = (firms, variable) => {
    const totalsByDate = firms.reduce((acc, firm) => {
      const { acq_date, [variable]: value } = firm;
      if (!acc[acq_date]) {
        acc[acq_date] = { total: 0, count: 0 };
      }
      acc[acq_date].total += value;
      acc[acq_date].count += 1;
      return acc;
    }, {});

    return Object.entries(totalsByDate).map(([acq_date, { total, count }]) => ({
      acq_date,
      count_dos: total / count,
    }));
  };

  const handleClosePanel = () => {
    setShowDataPanel(false);
  };

  return (
    <div className="relative w-full h-[100svh] overflow-hidden">
      <div className='absolute z-10 bottom-6 left-2 hidden md:block'>
        <h1 className='text-xl font-cabinet text-woodsmoke-100'>Select a country and a date to get started</h1>
        <p className='text-md font-satoshi text-woodsmoke-200 md:max-w-[32vw]'>Select with a click the date to start the visualization and the country. 
        Once a date is selected, ten consecutive days from this date will be taken into account for the analysis.</p>

        <p className='text-sm italic text-woodsmoke-300 md:max-w-[32vw] mt-4'>
        Our application tracks three key wildfire variables: Brightness, which measures heat intensity, FRP (Fire Radiative Power) for energy released, and the number of thermal anomalies to detect hotspots. These provide a detailed view of fire behavior and impact.
        </p>
        
      </div>
      <div className='absolute left-2 bottom-2 z-30 bg-woodsmoke-900 rounded-full px-4 lg:hidden'>
      <Dialog className="z-30">
        <DialogTrigger className='font-cabinet text-woodsmoke-200 p-2'>Instructions</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h1 className='text-xl font-cabinet text-woodsmoke-900'>Select a country and a date to get started</h1>
          </DialogHeader>
          <DialogDescription>
            <p className='text-md font-satoshi text-woodsmoke-800 md:max-w-[32vw]'>Select with a click the date to start the visualization and the country. 
              Once a date is selected, ten consecutive days from this date will be taken into account for the analysis.
            </p>
            <p className='text-sm italic text-woodsmoke-400 md:max-w-[32vw] mt-4'>
            Our application tracks three key wildfire variables: Brightness, which measures heat intensity, FRP (Fire Radiative Power) for energy released, and the number of thermal anomalies to detect hotspots. These provide a detailed view of fire behavior and impact.
            </p>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <EarthVis onCountrySelect={handleCountrySelect} firms={firms} dateRange={dateRange}/>
      </div>

      <div
        className={`absolute right-0 top-0 md:w-[30vw] w-[100vw] overflow-y-scroll h-full bg-woodsmoke-900/50 backdrop-blur-md border border-woodsmoke-500 p-2 rounded-lg z-10 transition-transform duration-700 ease-in-out ${
          showDataPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Botón para cerrar el panel */}
        <button
          className="absolute top-2 right-2 p-2 bg-woodsmoke-400 text-woodsmoke-100 rounded-full"
          onClick={handleClosePanel}
        >
          <XIcon />
        </button>

        <div className="flex flex-col w-full h-full">
          {loading ? (
            <p className="text-center text-woodsmoke-100">Loading data...</p>
          ) : firms.length === 0 ? (
            <p className="text-center text-woodsmoke-100">No data available</p>
          ) : (
            <>
              <div className="flex flex-row text-xl font-cabinet text-woodsmoke-50 gap-2">
                <h4>Country report: </h4>
                <h1>{selectedCountry}</h1>
              </div>
              <div className="-mt-2">
                <h5 className="font-satoshi text-woodsmoke-300">
                  from: {dateRange.startDate} - to: {dateRange.endDate}
                </h5>
              </div>

              <div id="generalFirmsInfo" className="flex flex-col w-full h-32 mt-2 gap-2">
                <div className="flex flex-col justify-center items-center w-full h-fit rounded-lg">
                  <div className="flex w-full">
                    <p className="text-base font-cabinet text-woodsmoke-100">Number of thermal anomalies: {firms.length}</p>
                  </div>
                </div>
                <div className="flex justify-center items-center w-full h-fit rounded-lg">
                  <BarCharts data={chartData} title={'Termal anomalies by date'}/>
                </div>
                {/* Gráfica del promedio de bright_ti4 */}
                <div className="flex justify-center items-center w-full h-fit rounded-lg mt-4">
                  <BarCharts data={chartBright} title={'Brightness average by date'}/>
                </div>
                {/* Gráfica del promedio de frp */}
                <div className="flex justify-center items-center w-full h-fit rounded-lg mt-4">
                  <BarCharts data={chartFrp} title={'Fire Radiative Power average by date'}/>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="absolute top-14 left-2 md:bottom-2 md:right-2 w-[50vw] md:w-[30vw] z-9">
        <DatePicker onDateChange={handleDateChange} />
      </div>
    </div>
  );
};

export default Page;
