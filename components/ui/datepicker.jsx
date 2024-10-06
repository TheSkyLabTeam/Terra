"use client";
import { format, addDays } from "date-fns"; // Importa addDays
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function DatePicker({ onDateChange }) {
  const [date, setDate] = useState();

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    
    if (selectedDate && onDateChange) {
      const formattedStartDate = format(selectedDate, "yyyy-MM-dd");
      const formattedEndDate = format(addDays(selectedDate, 9), "yyyy-MM-dd");
      onDateChange({ startDate: formattedStartDate, endDate: formattedEndDate });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-56 h-10 font-satoshi bg-woodsmoke-950 text-woodsmoke-300 hover:bg-woodsmoke-900 hover:text-woodsmoke-50 border-2 border-woodsmoke-900 rounded-full justify-start text-left font-normal",
            !date && "text-woodsmoke-100 hover:text-woodsmoke-950 hover:bg-woodsmoke-50 font-satoshi"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-woodsmoke-800 bg-woodsmoke-900 text-woodsmoke-100">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
