import { parseArgs } from "jsr:@std/cli/parse-args";
import { readAndParseCsv } from "./lib/readAndParseCsv.ts";
import { calculatePsmCurves } from "./lib/calculatePsmCurves.ts";
import { linearInterpolateIntersection } from "./lib/linearInterpolateIntersection.ts";

const args = parseArgs(Deno.args);
const csvFilePath = args.file;

try {
  const psmData = readAndParseCsv(csvFilePath);

  const curves = calculatePsmCurves(psmData);

  const highest_price_raw = linearInterpolateIntersection(
    curves.prices,
    curves.expensiveCurve,
    curves.tooCheapCurve,
  );

  const compromise_price_raw = linearInterpolateIntersection(
    curves.prices,
    curves.expensiveCurve,
    curves.cheapCurve,
  );

  const ideal_price_raw = linearInterpolateIntersection(
    curves.prices,
    curves.tooExpensiveCurve,
    curves.tooCheapCurve,
  );

  const lowest_price_raw = linearInterpolateIntersection(
    curves.prices,
    curves.tooExpensiveCurve,
    curves.cheapCurve,
  );

  const highest_price = Math.round(highest_price_raw ?? 0);
  const compromise_price = Math.round(compromise_price_raw ?? 0);
  const ideal_price = Math.round(ideal_price_raw ?? 0);
  const lowest_price = Math.round(lowest_price_raw ?? 0);

  console.info(`最高価格：${highest_price}円`);
  console.info(`妥協価格：${compromise_price}円`);
  console.info(`理想価格：${ideal_price}円`);
  console.info(`最低品質保証価格：${lowest_price}円`);
} catch (error) {
  console.error("PSM分析失敗:", error);
  Deno.exit(1);
}
