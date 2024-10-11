import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';

export default function ExportDropdown({ exportCSV, exportExcel, exportPDF }) {

  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth < 768) { // Puedes ajustar este valor según tus necesidades
              setPlaceholder('Formato'); // Placeholder corto para pantallas pequeñas
          } else {
              setPlaceholder('Seleccionar formato'); // Placeholder largo para pantallas grandes
          }
      };

      handleResize(); // Llama a la función al cargar el componente
      window.addEventListener('resize', handleResize); // Agrega el listener para el cambio de tamaño

      return () => {
          window.removeEventListener('resize', handleResize); // Limpia el listener al desmontar
      };
  }, []);

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
    <div className="export-dropdown flex align-items-center justify-content-end gap-2" style={{ flexWrap: 'wrap' }}>
      <span><b>Exportar:</b></span>
      <Dropdown
        value={null}
        options={exportOptions}
        onChange={(e) => handleExport(e.value)}
        optionLabel="label"
        placeholder={placeholder}
        itemTemplate={optionTemplate}
        style={{ minWidth: '120px', flex: '1 1 auto' }}
      />
    </div>
  );
};