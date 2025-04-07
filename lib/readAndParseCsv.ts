import { parse } from "jsr:@std/csv";
import { PsmData } from "../types/index.ts";

/**
 * Reads and parses the CSV file using Deno's standard library (@std/csv).
 * Handles headers automatically.
 * @param filePath Path to the CSV file.
 * @returns Array of PsmData objects.
 */
export function readAndParseCsv(filePath: string): PsmData[] {
  try {
    const fileContent = Deno.readTextFileSync(filePath);

    const parsedResult = parse(fileContent, {
      skipFirstRow: true,
      columns: [
        "sampleNumber",
        "expensive",
        "cheap",
        "tooExpensive",
        "tooCheap",
      ],
    });

    if (!parsedResult || parsedResult.length === 0) {
      throw new Error("CSV file is empty or contains only a header row.");
    }

    const data: PsmData[] = [];
    for (let i = 0; i < parsedResult.length; i++) {
      const rawRow = parsedResult[i] as Record<string, string>;

      const sampleNumber = Number(rawRow["sampleNumber"]);
      const expensive = Number(rawRow["expensive"]);
      const cheap = Number(rawRow["cheap"]);
      const tooExpensive = Number(rawRow["tooExpensive"]);
      const tooCheap = Number(rawRow["tooCheap"]);

      data.push({
        sampleNumber,
        expensive,
        cheap,
        tooExpensive,
        tooCheap,
      });
    }

    if (data.length === 0) {
      throw new Error(
        "No valid data rows found.",
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: File not found at ${filePath}`);
    }
    throw error;
  }
}
