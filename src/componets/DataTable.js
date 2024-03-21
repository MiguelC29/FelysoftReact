import React from 'react';
import { Table } from 'react-bootstrap';

export default function DataTable({ headers, data }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
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