"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "@/components/ui/datepicker";
import { XIcon, BarChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import Flag from 'react-world-flags';

const EarthVis = dynamic(() => import("@/app/(app)/components/earthvis"), { ssr: false });
const BarCharts = dynamic(() => import("@/components/charts/barcharts").then(mod => mod.BarCharts), { ssr: false });

export default function Page() {
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [firms, setFirms] = useState([]);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartBright, setChartBright] = useState([]);
  const [chartFrp, setChartFrp] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        setShowDataPanel(false); // Close the panel while loading
        const response = await fetch(
          `https://api-hackathon-fuego-a7vk.vercel.app/obtener_datos_firms/?country=${selectedCountry}&start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setFirms(data);
        setChartData(groupByDate(data));
        setChartBright(calculateAverage(data, 'bright_ti4'));
        setChartFrp(calculateAverage(data, 'frp'));
        
        if (data.length > 0) {
          toast({
            title: "Data loaded successfully",
            description: "The data is now ready to view.",
            duration: 3000,
            style: { background: '#62d723', color: 'white' }
          });
          setTimeout(() => setShowDataPanel(true), 100); // Slight delay to ensure toast appears first
        } else {
          toast({
            title: "No data available",
            description: "There is no data for the selected country and date range.",
            duration: 3000,
            style: { background: '#f7f7f8', color: 'black' }
          });
        }
      } catch (error) {
        console.error("Error fetching firms:", error);
        toast({
          title: "Error loading data",
          description: "An error occurred while fetching the data.",
          duration: 3000,
          style: { background: '#d73523', color: 'white' }
        });
      } finally {
        setLoading(false);
      }
    };

    getFirms();
  }, [selectedCountry, dateRange.startDate, dateRange.endDate, toast]);

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

  const getCountryName = (code) => {
    const countries = {
      COL: "Colombia",
      // Add more country codes and names as needed
    };
    return countries[code] || code;
  };

  return (
    <div className="relative w-[100svw] h-[100svh] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <EarthVis onCountrySelect={handleCountrySelect} firms={firms} dateRange={dateRange}/>
      </div>

      <AnimatePresence>
        {!selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-2 left-1/2 text-center z-10"
          >
            <h2 className="text-2xl md:text-4xl text-woodsmoke-50/80 font-cabinet transform -translate-x-1/2 select-none">Select a country</h2>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCountry && !dateRange.startDate && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-2 left-1/2 text-center z-10"
          >
            <h2 className="text-2xl md:text-4xl text-white font-cabinet transform -translate-x-1/2 select-none">Select a date</h2>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCountry && dateRange.startDate && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-4 left-0 z-10 px-4"
          >
            <p className="text-lg text-woodsmoke-50/80 font-satoshi select-none md:max-w-[32vw] mx-auto">
            Select the red circles to see more details about the air quality for those coordinates in the selected date range.
            </p>
            <p className="text-sm italic text-woodsmoke-300 select-none md:max-w-[32vw] mt-4 mx-auto">
              Our application tracks three key wildfire variables: Brightness, which measures heat intensity, FRP (Fire Radiative Power) for energy released, and the number of thermal anomalies to detect hotspots. These provide a detailed view of fire behavior and impact.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`absolute right-0 top-0 md:w-[30vw] w-[100vw] overflow-y-scroll h-full bg-woodsmoke-950 lg:bg-woodsmoke-900/50 lg:backdrop-blur-md border border-woodsmoke-500 p-2 rounded-lg z-50 transition-transform duration-700 ease-in-out ${
          showDataPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
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
              <div className="flex flex-row text-xl font-cabinet text-woodsmoke-50 gap-2 items-center">
                <h4>Country report: </h4>
                <h1>{getCountryName(selectedCountry)}</h1>
                <Flag code={selectedCountry} className="w-6 h-4" />
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
                  <BarCharts data={chartData} title={'Thermal anomalies by date'}/>
                </div>
                <div className="flex justify-center items-center w-full h-fit rounded-lg mt-4">
                  <BarCharts data={chartBright} title={'Brightness average by date'}/>
                </div>
                <div className="flex justify-center items-center w-full h-fit rounded-lg mt-4">
                  <BarCharts data={chartFrp} title={'Fire Radiative Power average by date'}/>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <motion.div
        initial={false}
        animate={selectedCountry ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className="absolute top-14 left-2 md:bottom-2 md:right-2 w-[50vw] md:w-[30vw] z-30 select-none"
      >
        <DatePicker onDateChange={handleDateChange} className="bg-woodsmoke-50 text-woodsmoke-900" />
      </motion.div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 right-4 z-30 bg-woodsmoke-800 text-woodsmoke-100 p-2 rounded-md flex items-center space-x-2"
        >
          <BarChartIcon className="animate-pulse" />
          <span className="font-satoshi">Loading data...</span>
        </motion.div>
      )}
    </div>
  );
}