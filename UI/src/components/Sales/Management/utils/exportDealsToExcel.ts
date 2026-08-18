// import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx-js-style";

export const exportDealsToExcel = (data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((deal) => ({
      ID: deal.id,
      Name: deal.name,
      Title: deal.title,
      Date: deal.date,
      Client: deal.client,
      "Purchase Order No": deal.purchase_order_no,
      Amount: deal.amount,
    })),
  );
  // Style header row
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({
      r: 0,
      c: col,
    });

    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: {
          bold: true,
          color: { rgb: "#000" },
        },
        fill: {
          patternType: "solid",
          fgColor: { rgb: "D9D9D9" },
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
  }

  // Auto width
  worksheet["!cols"] = [
    { wch: 8 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 15 },
    { wch: 30 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Report");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `Deals_Report_${Date.now()}.xlsx`);
};
