// Print utility functions for medical reports

export const printMedicalReport = (patientName: string) => {
  // Add print-specific styles to the page
  const printStyles = `
    <style>
      @media print {
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .no-print { display: none !important; }
        .letterhead-container {
          box-shadow: none !important;
          margin: 0 !important;
          padding: 15mm !important;
          max-width: none !important;
          width: 100% !important;
        }
        .page-break { page-break-before: always; }
      }
    </style>
  `;

  // Add print styles to document head
  const existingPrintStyles = document.getElementById('print-styles');
  if (existingPrintStyles) {
    existingPrintStyles.remove();
  }
  
  const styleElement = document.createElement('div');
  styleElement.id = 'print-styles';
  styleElement.innerHTML = printStyles;
  document.head.appendChild(styleElement);

  // Set document title for printing
  const originalTitle = document.title;
  document.title = `Medical Report - ${patientName}`;

  // Print the page
  window.print();

  // Restore original title
  setTimeout(() => {
    document.title = originalTitle;
    const printStylesElement = document.getElementById('print-styles');
    if (printStylesElement) {
      printStylesElement.remove();
    }
  }, 1000);
};

export const openPrintPreview = (patientName: string) => {
  const letterheadContent = document.querySelector('.letterhead-container');
  if (!letterheadContent) {
    alert('Medical report content not found. Please try again.');
    return;
  }

  const printWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
  if (!printWindow) {
    alert('Pop-up blocked. Please allow pop-ups for this site to use print preview.');
    return;
  }

  const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Medical Report Preview - ${patientName}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" href="https://icofont.com/icons">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0;
          padding: 0;
          background: #f8f9fa;
          min-height: 100vh;
        }
        
        .preview-header {
          background: white;
          border-bottom: 1px solid #dee2e6;
          padding: 15px 30px;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .preview-title {
          font-size: 18px;
          font-weight: 600;
          color: #0d6efd;
          margin: 0;
          display: flex;
          align-items: center;
        }
        
        .preview-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .preview-content {
          padding: 30px;
          display: flex;
          justify-content: center;
          min-height: calc(100vh - 80px);
        }
        
        .letterhead-container {
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
          background: white;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          min-height: 297mm;
          position: relative;
        }
        
        .letterhead-header {
          position: relative;
          padding: 30px 0;
          margin-bottom: 40px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 10px;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
        }
        
        .left-symbol {
          font-size: 48px;
          color: #4a90a4;
        }
        
        .center-content {
          flex: 1;
          text-align: center;
          margin: 0 30px;
        }
        
        .doctor-name {
          font-size: 32px;
          font-weight: bold;
          color: #4a90a4;
          margin-bottom: 5px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .doctor-title {
          font-size: 14px;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .right-symbols {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .symbol-icon {
          font-size: 24px;
          color: #4a90a4;
        }
        
        .ecg-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #4a90a4 0%, #6c757d 50%, #4a90a4 100%);
          border-radius: 0 0 10px 10px;
        }
        
        .report-title {
          text-align: center;
          font-size: 22px;
          font-weight: bold;
          color: #4a90a4;
          margin: 30px 0;
          text-decoration: underline;
        }
        
        .patient-info-header {
          background: #f8f9fa;
          padding: 20px;
          border-left: 4px solid #0d6efd;
          margin-bottom: 25px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 10px;
        }
        
        .info-label {
          font-weight: 600;
          width: 150px;
          color: #6c757d;
          font-size: 14px;
        }
        
        .info-value {
          flex: 1;
          color: #333;
        }
        
        .section-header {
          font-size: 16px;
          font-weight: 600;
          color: #0d6efd;
          border-bottom: 2px solid #0d6efd;
          padding-bottom: 8px;
          margin: 25px 0 15px 0;
          text-transform: none;
          display: flex;
          align-items: center;
        }
        
        .section-header i {
          margin-right: 8px;
          font-size: 18px;
        }
        
        .medical-content {
          margin-bottom: 20px;
          text-align: justify;
          line-height: 1.7;
        }
        
        .vital-signs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        
        .vital-item {
          border: 2px solid #4a90a4;
          padding: 15px;
          text-align: center;
          border-radius: 8px;
          background: #f8f9fa;
        }
        
        .vital-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .vital-value {
          font-size: 18px;
          font-weight: bold;
          color: #4a90a4;
          margin-top: 5px;
        }
        
        .signature-section {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          align-items: end;
        }
        
        .signature-box {
          text-align: center;
          min-width: 200px;
        }
        
        .signature-line {
          border-top: 2px solid #4a90a4;
          margin-bottom: 10px;
          height: 60px;
        }
        
        .signature-doctor-name {
          font-weight: bold;
          color: #4a90a4;
          font-size: 16px;
        }
        
        .footer-info {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          font-size: 11px;
          color: #666;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: start;
        }
        
        .footer-left {
          flex: 1;
        }
        
        .footer-right {
          text-align: right;
          opacity: 0.8;
        }
        
        @media print { 
          body { 
            margin: 0; 
            padding: 0; 
            background: white;
          }
          .preview-header { display: none !important; }
          .preview-content { padding: 0; }
          .letterhead-container {
            margin: 0;
            max-width: none;
            width: 100%;
            padding: 15mm;
            box-shadow: none;
            font-size: 12px;
            line-height: 1.4;
          }
          .doctor-name { font-size: 24px; }
          .doctor-title { font-size: 12px; }
          .report-title { font-size: 18px; margin: 20px 0; }
          .section-header { font-size: 14px; margin: 20px 0 10px 0; page-break-after: avoid; }
          .patient-info-header { margin-bottom: 15px; padding: 15px; page-break-inside: avoid; }
          .vital-signs { page-break-inside: avoid; }
          .medical-content { margin-bottom: 15px; page-break-inside: avoid; }
          .signature-section { margin-top: 30px; page-break-inside: avoid; }
          .footer-info { margin-top: 20px; page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="preview-header">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="preview-title">
            <i class="icofont-doctor me-2"></i>
            Medical Report Preview - ${patientName}
          </h1>
          <div class="preview-controls">
            <button onclick="window.print()" class="btn btn-success btn-sm me-2">
              <i class="icofont-print me-1"></i>Print Report
            </button>
            <button onclick="window.close()" class="btn btn-outline-secondary btn-sm">
              <i class="icofont-close me-1"></i>Close Preview
            </button>
          </div>
        </div>
      </div>
      
      <div class="preview-content">
        ${letterheadContent.outerHTML}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
};

export const exportToPDF = async (patientName: string) => {
  // This would require a PDF library like jsPDF or Puppeteer
  // For now, we'll use the browser's print to PDF functionality
  const letterheadContent = document.querySelector('.letterhead-container');
  if (!letterheadContent) {
    alert('Medical report content not found. Please try again.');
    return;
  }

  // Show instructions for PDF export
  const instructions = `
To save as PDF:
1. Click "Print Report" button
2. In the print dialog, select "Save as PDF" as the destination
3. Choose your preferred settings and click "Save"

Alternatively, use Ctrl+P (Windows) or Cmd+P (Mac) and select "Save as PDF"
  `;

  if (confirm(`Export to PDF?\n\n${instructions}\n\nClick OK to open print dialog, or Cancel to abort.`)) {
    printMedicalReport(patientName);
  }
};
