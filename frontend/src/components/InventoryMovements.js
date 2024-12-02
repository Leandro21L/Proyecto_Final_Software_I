import React, { useEffect, useState } from 'react';
import { fetchData, createData } from '../services/api';
import DataTable from './Shared/DataTable';
import Form from './Shared/Form';

const InventoryMovements = () => {
  const [movements, setMovements] = useState([]);

  const getData = () => {
    fetchData('api/inventory').then(setMovements);
  }

  useEffect(() => {
    getData();
  }, []);

  const handleAddMovement = (newMovement) => {
    createData('api/inventory/movement', newMovement).then(() => {
      getData();
    });
  };

  return (
    <div className="container">
      <h1>Movimientos de Inventario</h1>
      <Form
        fields={[
          { name: 'id_material', label: 'ID de Material', type: 'number' },
          { name: 'id_product', label: 'ID de Producto', type: 'number' },
          { name: 'movement_type', label: 'Tipo de Movimiento (entry, output, adjust)' },
          { name: 'quantity', label: 'Cantidad', type: 'number' },
          { name: 'description', label: 'Descripción' },
        ]}
        onSubmit={handleAddMovement}
      />
      {movements.length > 0 &&
        <DataTable
          columns={['id', 'id_material', 'id_product', 'movement_type', 'quantity', 'date', 'description']}
          data={movements}
        />
      }
    </div>
  );
};

export default InventoryMovements;
