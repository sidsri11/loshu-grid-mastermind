
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
