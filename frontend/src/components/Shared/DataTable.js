import React, { useState } from 'react';

const DataTable = ({ columns, data }) => {
  const [searchId, setSearchId] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchId(searchValue);

    if (!searchValue) {
      setFilteredData(data);
    } else {
      const filtered = data.filter(row => 
        row.id && row.id.toString().includes(searchValue)
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label>Buscar por ID: </label>
        <input 
          type="text" 
          value={searchId}
          onChange={handleSearch}
          placeholder="Ingrese ID"
        />
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;