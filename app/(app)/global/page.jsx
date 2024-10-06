"use client";
import EarthVis from "@/app/(app)/components/earthvis";
import { BarCharts } from "@/components/charts/barcharts";
import { DatePicker } from "@/components/ui/datepicker";
import { useState, useEffect } from "react";

const Page = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [firms, setFirms] = useState([]);
  const [showDataPanel, setShowDataPanel] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [airQualityData, setAirQualityData] = useState([]);
  

  const handleDateChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
  };

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setShowDataPanel(true); // Mostrar el panel al seleccionar un país
  };

  useEffect(() => {
    const getFirms = async () => {
      try {
        const response = await fetch(
          `https://api-hackathon-fuego.onrender.com/obtener_datos_firms/?country=${selectedCountry}&start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setFirms(data);

        const processedData = groupByDate(data);
        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching firms:", error);
      }
    };

    const getAirQualityData = async () => {
      try {

      } catch (error) {
        console.error("Error fetching air quality data:", error);
      }
    }

    if (selectedCountry && dateRange.startDate && dateRange.endDate) {
      getFirms();
    }
  }, [selectedCountry, dateRange.startDate, dateRange.endDate]);

  const groupByDate = (firms) => {
    const countsByDate = firms.reduce((acc, firm) => {
      const { acq_date } = firm;

      if (!acc[acq_date]) {
        acc[acq_date] = 0;
      }

      acc[acq_date] += 1;

      return acc;
    }, {});

    // Convertir el objeto a un array de datos para la gráfica
    return Object.entries(countsByDate).map(([acq_date, count]) => ({
      acq_date,
      count
    }));
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <EarthVis onCountrySelect={handleCountrySelect} firms={firms} />
      </div>

      {/* Panel de información con transición desde la derecha */}
      <div
        className={`absolute right-0 top-0 w-[30vw] h-full bg-woodsmoke-900/60 backdrop-blur-sm border border-woodsmoke-500 p-2 rounded-lg z-10 transition-transform duration-700 ease-in-out ${
          showDataPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row text-xl font-cabinet text-woodsmoke-50 gap-2">
            <h4>Country report: </h4>
            <h1>{selectedCountry}</h1>
          </div>
          <div className="-mt-2">
            <h5 className="font-satoshi text-woodsmoke-300">
              from: {dateRange.startDate} - to: {dateRange.endDate}
            </h5>
          </div>

          {/* Información general de firms */}
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
        </div>
      </div>

      {/* DatePicker siempre visible en la parte inferior derecha */}
      <div className="absolute bottom-2 right-2 w-[50vw] md:w-[30vw] z-10">
        <DatePicker onDateChange={handleDateChange} />
      </div>
    </div>
  );
};

export default Page;
