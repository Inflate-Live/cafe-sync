
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { Order } from '@/types';
import { useJsPDF } from './use-jsPDF';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PrinterConfig {
  enabled: boolean;
  printerName?: string;
  paperSize?: 'A4' | '80mm';
  copies?: number;
}

export const useReceiptPrinter = () => {
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig>({
    enabled: false,
    paperSize: '80mm',
    copies: 1
  });
  const { toast } = useToast();

  const configurePrinter = useCallback((config: Partial<PrinterConfig>) => {
    setPrinterConfig(prev => ({
      ...prev,
      ...config
    }));
    
    toast({
      title: "Printer Settings Updated",
      description: config.enabled 
        ? "Automatic receipt printing has been enabled" 
        : "Receipt printer settings have been updated"
    });
  }, [toast]);

  const printReceipt = useCallback(async (order: Order, branchName: string) => {
    if (!printerConfig.enabled) return false;
    
    try {
      // Generate PDF receipt
      const doc = useJsPDF();
      
      // Page settings
      if (printerConfig.paperSize === '80mm') {
        // Thermal printer size (80mm width typical)
        doc.addPage([226, 800]); // 80mm = ~226pt, height will be trimmed
        doc.setFontSize(10);
      }
      
      // Header
      doc.setFontSize(14);
      doc.text('Receipt', 10, 10);
      doc.setFontSize(10);
      doc.text(`Order #${order.id.slice(-6)}`, 10, 20);
      doc.text(`Branch: ${branchName}`, 10, 30);
      doc.text(`Date: ${formatDate(order.createdAt)}`, 10, 40);
      doc.text(`Customer: ${order.customerName}`, 10, 50);
      doc.text(`Phone: ${order.customerPhone}`, 10, 60);
      
      // Items table
      const tableColumn = ["Item", "Qty", "Price", "Total"];
      const tableRows = order.items.map(item => [
        item.name,
        item.quantity.toString(),
        formatCurrency(item.price),
        formatCurrency(item.price * item.quantity)
      ]);
      
      doc.autoTable({
        startY: 70,
        head: [tableColumn],
        body: tableRows,
        theme: 'plain',
        styles: { fontSize: 8 },
        margin: { left: 10 }
      });
      
      // Total
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Total: ${formatCurrency(order.total)}`, 10, finalY);
      
      // Footer
      doc.text('Thank you for your order!', 10, finalY + 10);
      
      // Print the receipt
      try {
        const pdfBlob = doc.output('blob');
        
        // If Web Print API is available
        if ('print' in window) {
          const pdfUrl = URL.createObjectURL(pdfBlob);
          const printWindow = window.open(pdfUrl);
          
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.print();
              setTimeout(() => printWindow.close(), 500);
            };
          }
        }
        
        toast({
          title: "Receipt Printed",
          description: `Order #${order.id.slice(-6)} receipt has been sent to printer`
        });
        
        return true;
      } catch (printError) {
        console.error('Printing failed:', printError);
        toast({
          title: "Printing Failed",
          description: "Could not send receipt to printer",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Receipt generation failed:', error);
      toast({
        title: "Receipt Generation Failed",
        description: "Could not generate receipt document",
        variant: "destructive"
      });
      return false;
    }
  }, [printerConfig, toast]);

  return {
    printerConfig,
    configurePrinter,
    printReceipt
  };
};
