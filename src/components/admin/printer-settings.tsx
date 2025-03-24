
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer } from 'lucide-react';
import { useReceiptPrinter } from '@/hooks/use-receipt-printer';
import { useToast } from '@/hooks/use-toast';

interface PrinterSettingsProps {
  className?: string;
}

const PrinterSettings: React.FC<PrinterSettingsProps> = ({ className }) => {
  const { printerConfig, configurePrinter } = useReceiptPrinter();
  const { toast } = useToast();
  
  const testPrinter = () => {
    try {
      // Create simple test print
      if (!printerConfig.enabled) {
        toast({
          title: "Printer Not Enabled",
          description: "Please enable the printer first",
          variant: "destructive"
        });
        return;
      }
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Printer Test</title>
              <style>
                body { font-family: 'Courier New', monospace; font-size: 12pt; }
                .receipt { max-width: 300px; margin: 0 auto; text-align: center; }
                hr { border: 1px dashed #ccc; }
              </style>
            </head>
            <body>
              <div class="receipt">
                <h2>Test Receipt</h2>
                <p>This is a test receipt</p>
                <hr>
                <p>If you can see this, printing works!</p>
                <p>Date: ${new Date().toLocaleString()}</p>
                <p>Printer: ${printerConfig.printerName || 'Default'}</p>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                };
              </script>
            </body>
          </html>
        `);
      }
      
      toast({
        title: "Test Print Sent",
        description: "Check your printer for the test receipt"
      });
    } catch (error) {
      toast({
        title: "Test Print Failed",
        description: "Could not send test print to printer",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Receipt Printer Settings
        </CardTitle>
        <CardDescription>
          Configure automatic receipt printing for orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-print">Automatic Printing</Label>
              <p className="text-sm text-muted-foreground">
                Automatically print receipts when orders are placed
              </p>
            </div>
            <Switch 
              id="auto-print" 
              checked={printerConfig.enabled}
              onCheckedChange={(checked) => configurePrinter({ enabled: checked })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="printer-name">Printer Name</Label>
            <Input 
              id="printer-name" 
              placeholder="Default Printer" 
              value={printerConfig.printerName || ''}
              onChange={(e) => configurePrinter({ printerName: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use the system default printer
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paper-size">Paper Size</Label>
            <Select 
              value={printerConfig.paperSize} 
              onValueChange={(value) => configurePrinter({ 
                paperSize: value as 'A4' | '80mm' 
              })}
            >
              <SelectTrigger id="paper-size">
                <SelectValue placeholder="Select paper size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="80mm">Thermal 80mm</SelectItem>
                <SelectItem value="A4">A4 Paper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="copies">Copies</Label>
            <Select 
              value={printerConfig.copies?.toString()} 
              onValueChange={(value) => configurePrinter({ 
                copies: parseInt(value) 
              })}
            >
              <SelectTrigger id="copies">
                <SelectValue placeholder="Number of copies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 copy</SelectItem>
                <SelectItem value="2">2 copies</SelectItem>
                <SelectItem value="3">3 copies</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={testPrinter} 
            variant="outline" 
            className="w-full mt-4"
          >
            <Printer className="mr-2 h-4 w-4" />
            Test Printer
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">
            Note: Printing functionality requires browser print support and may vary across browsers and operating systems.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterSettings;
