
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { isValidNumber, isUnique, isValidLoshuGrid } from "@/utils/loshuValidation";

export const LoshuGrid = () => {
  const [grid, setGrid] = useState<string[][]>(Array(3).fill(Array(3).fill("")));
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    validateGrid();
  }, [grid]);

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
    toast.info("Grid has been reset");
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
            Fill in numbers 1-9 to create a magic square where all rows, columns,
            and diagonals sum to 15.
          </p>
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
                  />
                </motion.div>
              ))}
            </div>
          ))}
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

      <div className="max-w-md p-6 bg-loshu-muted rounded-xl">
        <h2 className="text-xl font-semibold mb-4">How to Play</h2>
        <ul className="space-y-2 text-gray-600">
          <li>• Enter numbers 1-9 in the grid</li>
          <li>• Each number can only be used once</li>
          <li>• All rows must sum to 15</li>
          <li>• All columns must sum to 15</li>
          <li>• Both diagonals must sum to 15</li>
        </ul>
      </div>
    </div>
  );
};
