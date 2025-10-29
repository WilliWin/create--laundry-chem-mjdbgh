
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Chemical } from '@/types/chemical';
import { Linen } from '@/types/linen';

export async function generateChemicalsPDF(chemicals: Chemical[]) {
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            padding: 20px;
            color: #212121;
          }
          h1 {
            color: #2962ff;
            border-bottom: 3px solid #2962ff;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .date {
            color: #757575;
            font-size: 14px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background-color: #2962ff;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #e0e0e0;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .low-stock {
            background-color: #ffebee !important;
            color: #f44336;
            font-weight: 600;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #757575;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Chemical Stock Report</h1>
          <div class="date">Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Chemical Name</th>
              <th>Opening Balance</th>
              <th>Current Balance</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${chemicals.map(chem => `
              <tr ${chem.currentBalance <= 1 ? 'class="low-stock"' : ''}>
                <td>${chem.name}</td>
                <td>${chem.openingBalance}</td>
                <td>${chem.currentBalance}</td>
                <td>${chem.unit}</td>
                <td>${chem.currentBalance <= 1 ? 'LOW STOCK' : 'OK'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Laundry Management System - Chemical Stock Report</p>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    console.log('PDF generated:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

export async function generateLinensPDF(linens: Linen[]) {
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            padding: 20px;
            color: #212121;
          }
          h1 {
            color: #2962ff;
            border-bottom: 3px solid #2962ff;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .date {
            color: #757575;
            font-size: 14px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background-color: #2962ff;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #e0e0e0;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #757575;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Linen Stock Report</h1>
          <div class="date">Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Type</th>
              <th>Opening</th>
              <th>New</th>
              <th>Dirty</th>
              <th>Thrown</th>
              <th>Current Balance</th>
            </tr>
          </thead>
          <tbody>
            ${linens.map(linen => `
              <tr>
                <td>${linen.name}</td>
                <td>${linen.type.charAt(0).toUpperCase() + linen.type.slice(1)}</td>
                <td>${linen.openingBalance}</td>
                <td>${linen.newCount}</td>
                <td>${linen.dirtyCount}</td>
                <td>${linen.thrownCount}</td>
                <td>${linen.currentBalance}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Laundry Management System - Linen Stock Report</p>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    console.log('PDF generated:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
