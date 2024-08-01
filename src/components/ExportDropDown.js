import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';

export default function ExportDropdown({ exportCSV, exportExcel, exportPDF }) {
  const exportOptions = [
    { label: 'CSV', value: 'csv', icon: faFileCsv },
    { label: 'EXCEL', value: 'xls', icon: faFileExcel },
    { label: 'PDF', value: 'pdf', icon: faFilePdf }
  ];

  const handleExport = (format) => {
    switch (format) {
      case 'csv':
        exportCSV(false);
        break;
      case 'xls':
        exportExcel();
        break;
      case 'pdf':
        exportPDF();
        break;
      default:
        break;
    }
  };

  const optionTemplate = (option) => {
    return (
      <div className="p-flex p-align-center">
        <span><FontAwesomeIcon icon={option.icon} size="lg" /> {option.label}</span>
      </div>
    );
  };

  return (
    <div className="flex align-items-center justify-content-end gap-2">
      <span><b>Exportar:</b></span>
      <Dropdown
        value={null}
        options={exportOptions}
        onChange={(e) => handleExport(e.value)}
        optionLabel="label"
        placeholder="Seleccionar formato"
        itemTemplate={optionTemplate}
      />
    </div>
  );
};