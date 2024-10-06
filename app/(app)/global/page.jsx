"use client";
import EarthVis from "@/app/(app)/components/earthvis";
import { DatePicker } from "@/components/ui/datepicker";
import { useState, useEffect } from "react";

const Page = () => {
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [firms, setFirms] = useState([]);
  console.log(firms);
  

  const handleDateChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
  };

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
  };

  useEffect(() => {
    const getFirms = async () => {
      try {
        const response = await fetch(`https://api-hackathon-fuego.onrender.com/obtener_datos_firms/?country=${selectedCountry}&start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json();
        setFirms(data);
      } catch (error) {
        console.error("Error fetching firms:", error);
      }
    };
    

    if (selectedCountry && dateRange.startDate && dateRange.endDate) {
      getFirms()
    }
  }, [selectedCountry, dateRange.startDate, dateRange.endDate])

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <EarthVis onCountrySelect={handleCountrySelect} firms={firms}/>
      </div>
      <div className="absolute bottom-2 right-2 z-10">
        <DatePicker onDateChange={handleDateChange} />
      </div>
    </div>
  );
};

export default Page;
