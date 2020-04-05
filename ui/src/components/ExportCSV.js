import React from 'react'
import Button from 'react-bootstrap/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ExportCSV = ({csvData, fileName, sheetName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName, sheetName) => {
        // const ws = XLSX.utils.json_to_sheet(csvData);
        // const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const ws = XLSX.utils.json_to_sheet(csvData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, sheetName);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button variant="dark" onClick={(e) => exportToCSV(csvData, fileName, sheetName)}><FontAwesomeIcon icon={faFileExcel} />Export</Button>
    )
}