// Utility functions for exporting and importing data

export const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  // Auto-generate headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  const csvData = data.map(item => 
    csvHeaders.map(header => {
      const value = item[header] ?? '';
      return typeof value === 'object' ? JSON.stringify(value) : value;
    })
  );

  const csvContent = [
    csvHeaders.join(','),
    ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const exportToPDF = (data: any[], filename: string, headers?: string[], title?: string) => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  // Auto-generate headers from first object if not provided
  const pdfHeaders = headers || Object.keys(data[0]);
  
  // Create HTML table
  const tableRows = data.map(item => {
    const cells = pdfHeaders.map(header => {
      const value = item[header] ?? '';
      return `<td style="border: 1px solid #ddd; padding: 8px;">${value}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  const headerCells = pdfHeaders.map(header => 
    `<th style="border: 1px solid #ddd; padding: 8px; background-color: #4CAF50; color: white;">${header}</th>`
  ).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title || filename}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { text-align: left; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>${title || filename}</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table>
        <thead>
          <tr>${headerCells}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <div class="footer">
        <p>Total Records: ${data.length}</p>
      </div>
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.html`;
  link.click();
  
  // Open in new window for printing to PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

export const importFromFile = (
  file: File,
  onSuccess: (data: any[]) => void,
  onError?: (error: string) => void
) => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      let importedData: any[] = [];

      if (file.name.endsWith('.json')) {
        importedData = JSON.parse(content);
      } else if (file.name.endsWith('.csv')) {
        const lines = content.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        importedData = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
          const row: any = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].replace(/^"|"$/g, '').replace(/""/g, '"').trim() : '';
          });
          
          return row;
        });
      } else {
        throw new Error('Unsupported file format');
      }

      onSuccess(importedData);
    } catch (error) {
      const errorMessage = 'Error importing file. Please check the format.';
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
      console.error(error);
    }
  };
  
  reader.readAsText(file);
};
