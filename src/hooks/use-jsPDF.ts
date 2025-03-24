
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extending jsPDF with autotable
interface JsPDFWithAutoTable extends jsPDF {
  autoTable: typeof autoTable;
}

export const useJsPDF = (): JsPDFWithAutoTable => {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  return doc;
};
