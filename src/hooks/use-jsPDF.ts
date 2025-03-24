
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extending jsPDF with autotable
interface JsPDFWithAutoTable extends jsPDF {
  autoTable: typeof autoTable;
}

export const useJsPDF = (): JsPDFWithAutoTable => {
  // This is a hook that returns a configured jsPDF instance
  // It doesn't use React hooks internally, so it's safe to call from anywhere
  return new jsPDF() as JsPDFWithAutoTable;
};
