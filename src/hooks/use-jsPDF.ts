
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';

// Properly type the autoTable function
interface AutoTableOptions {
  startY?: number;
  head?: string[][];
  body?: string[][];
  theme?: string;
  styles?: {
    fontSize?: number;
    cellPadding?: number;
    lineColor?: string;
    lineWidth?: number;
    [key: string]: any;
  };
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  [key: string]: any;
}

// Extending jsPDF with autotable
interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: AutoTableOptions) => jsPDF;
  lastAutoTable?: {
    finalY: number;
  };
}

// Create a memoized jsPDF factory function for better performance
const createJsPDF = (): JsPDFWithAutoTable => {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  return doc;
};

export const useJsPDF = (): JsPDFWithAutoTable => {
  // This is a hook that returns a configured jsPDF instance
  // It doesn't use React hooks internally, so it's safe to call from anywhere
  return createJsPDF();
};
