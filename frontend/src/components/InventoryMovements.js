import React, { useEffect, useState } from 'react';
import { fetchData, createData } from '../services/api';
import DataTable from './Shared/DataTable';
import Form from './Shared/Form';

const InventoryMovements = () => {
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    fetchData('inventory_movements').then(setMovements);
  }, []);

  const handleAddMovement = (newMovement) => {
    createData('inventory_movements', newMovement).then((movement) => {
      setMovements([...movements, movement]);
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
      <DataTable
        columns={['Id', 'Id material', 'Id producto', 'Tipo de movimiento', 'Cantidad', 'Fecha', 'Descripción']}
        data={movements}
      />
    </div>
  );
};

export default InventoryMovements;
