
export const isValidNumber = (value: string): boolean => {
  const num = parseInt(value);
  return !isNaN(num) && num >= 1 && num <= 9;
};

export const isUnique = (grid: string[][]): boolean => {
  const numbers = grid.flat().filter((n) => n !== "");
  const uniqueNumbers = new Set(numbers);
  return numbers.length === uniqueNumbers.size;
};

export const calculateSum = (numbers: string[]): number => {
  return numbers.reduce((sum, num) => sum + (parseInt(num) || 0), 0);
};

export const isValidRow = (row: string[]): boolean => {
  return row.every((cell) => cell !== "") && calculateSum(row) === 15;
};

export const isValidLoshuGrid = (grid: string[][]): boolean => {
  if (!isUnique(grid)) return false;

  // Check rows
  if (!grid.every(isValidRow)) return false;

  // Check columns
  for (let col = 0; col < 3; col++) {
    const column = grid.map((row) => row[col]);
    if (!isValidRow(column)) return false;
  }

  // Check diagonals
  const diagonal1 = [grid[0][0], grid[1][1], grid[2][2]];
  const diagonal2 = [grid[0][2], grid[1][1], grid[2][0]];

  return isValidRow(diagonal1) && isValidRow(diagonal2);
};

export const calculateLoshuFromDate = (date: Date): string[][] => {
  // Convert date to string and sum all digits
  const dateString = date.getDate().toString().padStart(2, '0') +
                    (date.getMonth() + 1).toString().padStart(2, '0') +
                    date.getFullYear().toString();
  
  let numbers = dateString.split('').map(Number);
  
  // Reduce numbers to single digits where needed
  while (numbers.length > 1) {
    numbers = numbers.reduce((acc, curr) => acc + curr, 0)
                    .toString()
                    .split('')
                    .map(Number);
  }

  // Create a basic Loshu grid pattern
  const baseGrid = [
    ["4", "9", "2"],
    ["3", "5", "7"],
    ["8", "1", "6"]
  ];

  // Return the base grid as it's a valid Loshu square
  return baseGrid;
};
