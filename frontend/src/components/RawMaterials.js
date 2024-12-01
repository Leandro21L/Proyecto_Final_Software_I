import React, { useEffect, useState } from 'react';
import { fetchData, createData } from '../services/api';
import DataTable from './Shared/DataTable';
import Form from './Shared/Form';

const RawMaterials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchData('raw_materials').then(setMaterials);
  }, []);

  const handleAddMaterial = (newMaterial) => {
    createData('raw_materials', newMaterial).then((material) => {
      setMaterials([...materials, material]);
    });
  };

  return (
    <div className="container">
      <h1>Materias Primas</h1>
      <Form
        fields={[
          { name: 'name', label: 'Nombre' },
          { name: 'description', label: 'Descripción' },
          { name: 'current_quantity', label: 'Cantidad Actual', type: 'number' },
          { name: 'min_quantity', label: 'Cantidad Mínima', type: 'number' },
          { name: 'max_quantity', label: 'Cantidad Máxima', type: 'number' },
          { name: 'measurement_unit', label: 'Unidad de Medida' },
        ]}
        onSubmit={handleAddMaterial}
      />
      <DataTable
        columns={['id', 'name', 'description', 'current_quantity', 'min_quantity', 'max_quantity', 'measurement_unit']}
        data={materials}
      />
    </div>
  );
};

export default RawMaterials;
