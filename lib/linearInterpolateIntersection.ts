/**
 * Finds the intersection point of two curves using linear interpolation.
 * Assumes curve1 is generally ascending and curve2 is generally descending.
 * @param prices Sorted array of price points (x-axis).
 * @param curve1 Values of the first curve (y-axis).
 * @param curve2 Values of the second curve (y-axis).
 * @returns The estimated price at the intersection point, or null if no intersection is found.
 */
export function linearInterpolateIntersection(
  prices: number[],
  curve1: number[],
  curve2: number[],
): number | null {
  if (
    prices.length !== curve1.length || prices.length !== curve2.length ||
    prices.length < 2
  ) {
    console.error(
      "Invalid input for interpolation: Arrays must have the same length >= 2.",
    );
    return null;
  }

  for (let i = 0; i < prices.length - 1; i++) {
    const x1 = prices[i];
    const x2 = prices[i + 1];
    const y1_c1 = curve1[i];
    const y2_c1 = curve1[i + 1];
    const y1_c2 = curve2[i];
    const y2_c2 = curve2[i + 1];

    const diff1 = y1_c1 - y1_c2;
    const diff2 = y2_c1 - y2_c2;

    if ((diff1 <= 0 && diff2 > 0) || (diff1 >= 0 && diff2 < 0)) {
      const denominator = (y2_c1 - y1_c1) - (y2_c2 - y1_c2);
      if (Math.abs(denominator) < 1e-9) { // Check for near-zero denominator
        if (Math.abs(diff1) < 1e-9) return x1;
        continue;
      }
      const intersectionPrice = x1 - (x2 - x1) * diff1 / (diff2 - diff1);

      if (intersectionPrice >= x1 && intersectionPrice <= x2) {
        return intersectionPrice;
      }
      return intersectionPrice;
    }
    // Handle exact intersection at a data point
    if (Math.abs(diff1) < 1e-9) {
      return x1;
    }
  }

  if (Math.abs(curve1[prices.length - 1] - curve2[prices.length - 1]) < 1e-9) {
    return prices[prices.length - 1];
  }

  console.warn(
    "Could not find a clear intersection point for the given curves.",
  );
  return null;
}
