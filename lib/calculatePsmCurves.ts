import { PsmCurves, PsmData } from "../types/index.ts";

/**
 * Calculates the four cumulative percentage curves for PSM analysis.
 * @param data Array of PsmData objects.
 * @returns Object containing sorted unique prices and the four calculated curves.
 */
export function calculatePsmCurves(data: PsmData[]): PsmCurves {
  const n = data.length;
  if (n === 0) {
    throw new Error("Cannot calculate curves with empty data.");
  }

  // Collect all prices mentioned in the data
  const allPrices: number[] = [];
  data.forEach((row) => {
    allPrices.push(row.expensive, row.cheap, row.tooExpensive, row.tooCheap);
  });

  // Get unique prices and sort them
  const uniquePrices = [...new Set(allPrices)].sort((a, b) => a - b);

  const tooExpensiveCurve: number[] = [];
  const expensiveCurve: number[] = [];
  const cheapCurve: number[] = [];
  const tooCheapCurve: number[] = [];

  // Calculate cumulative percentages for each unique price point
  for (const price of uniquePrices) {
    let countTooExpensive = 0;
    let countExpensive = 0;
    let countCheap = 0;
    let countTooCheap = 0;

    data.forEach((row) => {
      if (row.tooExpensive <= price) countTooExpensive++;
      if (row.expensive <= price) countExpensive++;
      if (row.cheap >= price) countCheap++;
      if (row.tooCheap >= price) countTooCheap++;
    });

    tooExpensiveCurve.push(countTooExpensive / n);
    expensiveCurve.push(countExpensive / n);
    cheapCurve.push(countCheap / n);
    tooCheapCurve.push(countTooCheap / n);
  }

  return {
    prices: uniquePrices,
    tooExpensiveCurve,
    expensiveCurve,
    cheapCurve,
    tooCheapCurve,
  };
}
