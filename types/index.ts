export type PsmData = {
  sampleNumber: number;
  expensive: number;
  cheap: number;
  tooExpensive: number;
  tooCheap: number;
};

export type PsmCurves = {
  prices: number[];
  tooExpensiveCurve: number[];
  expensiveCurve: number[];
  cheapCurve: number[];
  tooCheapCurve: number[];
};
