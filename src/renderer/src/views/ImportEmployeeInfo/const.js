// 处理xlsx文件
import * as XLSX from "xlsx";

export const analyseExcelToJson = (file) => {
  return new Promise((resolve, reject) => {
    if (file instanceof File) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const arrayBuffer = reader.result;

        const options = { type: "array", cellDates: true };
        const workbook = XLSX.read(arrayBuffer, options);

        resolve(
          XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"], { header: 1 })
        );
      };
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Is not a file type"));
    }
  });
};
