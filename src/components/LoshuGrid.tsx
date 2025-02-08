
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import {
  isValidNumber,
  isUnique,
  isValidLoshuGrid,
  calculateLoshuFromDate,
  getNumbersFromDate
} from "@/utils/loshuValidation";

export const LoshuGrid = () => {
  const [grid, setGrid] = useState<string[][]>(Array(3).fill(Array(3).fill("")));
  const [isValid, setIsValid] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [dateNumbers, setDateNumbers] = useState<number[]>([]);

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    validateGrid();
  }, [grid]);

  useEffect(() => {
    if (selectedDate) {
      const calculatedGrid = calculateLoshuFromDate(selectedDate);
      setGrid(calculatedGrid);
      setDateNumbers(getNumbersFromDate(selectedDate));
      toast.success("Loshu Grid generated from your date of birth!");
    }
  }, [selectedDate]);

  const validateGrid = () => {
    const allFilled = grid.every((row) => row.every((cell) => cell !== ""));
    if (allFilled) {
      const valid = isValidLoshuGrid(grid);
      setIsValid(valid);
      if (valid) {
        toast.success("Congratulations! Valid Loshu Grid!");
      }
    }
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    if (value === "" || isValidNumber(value)) {
      const newGrid = grid.map((row, rIdx) =>
        rIdx === rowIndex
          ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
          : [...row]
      );
      setGrid(newGrid);

      if (value !== "" && !isUnique(newGrid)) {
        toast.error("Each number must be unique!");
      }
    }
  };

  const resetGrid = () => {
    setGrid(Array(3).fill(Array(3).fill("")));
    setIsValid(false);
    setSelectedDate(undefined);
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth());
    setDateNumbers([]);
    toast.info("Grid has been reset");
  };

  const shouldShowCross = (value: string) => {
    if (!selectedDate || !value) return false;
    const num = parseInt(value);
    return !dateNumbers.includes(num);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 text-sm bg-loshu-muted text-loshu-accent rounded-full">
            Interactive Grid
          </span>
          <h1 className="text-4xl font-semibold mt-2">Loshu Grid Solver</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Select your date of birth to generate your personal Loshu Grid, or manually fill
            in numbers 1-9 to create a magic square where all rows, columns, and
            diagonals sum to 15.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="bg-white p-4 rounded-xl shadow-lg space-y-4">
            <div className="flex gap-4 mb-4">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={new Date(selectedYear, selectedMonth)}
              defaultMonth={new Date(selectedYear, selectedMonth)}
              className="rounded-md"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 p-4 bg-white rounded-xl shadow-lg">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="contents">
                {row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, delay: rowIndex * 0.1 + colIndex * 0.1 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      className={`w-16 h-16 text-2xl text-center border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isValid
                          ? "border-green-500 bg-green-50"
                          : "border-loshu-border hover:border-loshu-accent focus:border-loshu-accent"
                      }`}
                      maxLength={1}
                      readOnly={selectedDate !== undefined}
                    />
                    {shouldShowCross(cell) && (
                      <X 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 opacity-50" 
                        size={32}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={resetGrid}
            className="px-6 py-2 bg-loshu-accent text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Reset Grid
          </button>
        </div>
      </div>
    </div>
  );
};
