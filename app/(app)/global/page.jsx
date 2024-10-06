"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui/datepicker";

// Importación dinámica de componentes que dependen del navegador
const EarthVis = dynamic(() => import("@/app/(app)/components/earthvis"), { ssr: false });
const BarCharts = dynamic(() => import("@/components/charts/barcharts").then(mod => mod.BarCharts), { ssr: false });

const Page = () => {
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [firms, setFirms] = useState([]);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

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

    return Object.entries(countsByDate).map(([acq_date, count]) => ({
      acq_date,
      count,
    }));
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <EarthVis onCountrySelect={handleCountrySelect} firms={firms} />
      </div>

      <div
        className={`absolute right-0 top-0 w-[30vw] h-full bg-woodsmoke-900/60 backdrop-blur-sm border border-woodsmoke-500 p-2 rounded-lg z-10 transition-transform duration-700 ease-in-out ${
          showDataPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col w-full">
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
                    <p className="text-sm font-cabinet text-woodsmoke-100">Number of thermal anomalies: {firms.length}</p>
                  </div>
                </div>
                <div className="flex justify-center items-center w-full h-fit rounded-lg">
                  <BarCharts data={chartData} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="absolute bottom-2 right-2 w-[50vw] md:w-[30vw] z-10">
        <DatePicker onDateChange={handleDateChange} />
      </div>
    </div>
  );
};

export default Page;