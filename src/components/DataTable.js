import React from 'react';
import { Table } from 'react-bootstrap';

export default function DataTable(props) {

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          {props.headers.map((header, index) => (
            <th key={index} scope='col'>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((value, columnIndex) => (
              // <td key={columnIndex}>{value}</td>
              <td key={columnIndex}>
                {/* Si el valor es un objeto, mostramos un valor específico de ese objeto */}
                {typeof value === 'object' ? value[props.campo] : value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}