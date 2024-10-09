"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "@/components/ui/datepicker";
import { XIcon, BarChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

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
        const response = await fetch(
          `https://api-hackathon-fuego-xwd5.vercel.app/obtener_datos_firms/?country=${selectedCountry}&start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
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

  useEffect(() => {
    if (loading) {
      toast({
        title: "Loading data...",
        description: "Please wait while we fetch the latest information.",
        duration: 3000,
      });
    }
  }, [loading, toast]);

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
            className="absolute top-1/2 left-1/2 text-center z-10"
          >
            <h2 className="text-4xl text-woodsmoke-100/80 font-cabinet transform -translate-y-1/2 -translate-x-1/2 select-none">Select a country</h2>
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
            className="absolute top-1/2 left-1/2 text-center z-10"
          >
            <h2 className="text-4xl text-white font-cabinet transform -translate-y-1/2 -translate-x-1/2 select-none">Select a date</h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`absolute right-0 top-0 md:w-[30vw] w-[100vw] overflow-y-scroll h-full bg-woodsmoke-900/50 backdrop-blur-md border border-woodsmoke-500 p-2 rounded-lg z-20 transition-transform duration-700 ease-in-out ${
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