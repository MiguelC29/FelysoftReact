import React from 'react';
import { Table } from 'react-bootstrap';

export default function DataTable(props) {

  return (
    <Table>
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
              <td key={columnIndex}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}