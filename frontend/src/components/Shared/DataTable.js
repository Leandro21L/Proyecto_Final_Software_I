import React from 'react';

const DataTable = ({ columns, data }) => (
  <table>
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col}>{col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx}>
          {columns.map((col) => (
            <td key={col}>{row[col]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default DataTable;