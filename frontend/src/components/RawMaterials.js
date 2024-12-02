import React, { useEffect, useState } from 'react';
import { fetchData, createData } from '../services/api';
import DataTable from './Shared/DataTable';
import Form from './Shared/Form';
import Notifications from './Notifications';

const RawMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const getData = () => {
    fetchData('api/materials').then((material) => {
      setMaterials(material)
      const lowQuantityNotifications = material
        .filter(material => material.current_quantity <= material.min_quantity)
        .map(material => `Materia prima "${material.description}" está por debajo de la cantidad mínima (${material.current_quantity} ${material.measurement_unit})`);
      setNotifications(lowQuantityNotifications);
    });
  }
  useEffect(() => {
    getData();
  }, []);

  const handleAddMaterial = (newMaterial) => {
    createData('api/materials/create', newMaterial).then(() => {
      getData();

      if (material.current_quantity <= material.min_quantity) {
        setNotifications([
          ...notifications, 
          `Nueva materia prima "${material.name}" está por debajo de la cantidad mínima (${material.current_quantity} ${material.measurement_unit})`
        ]);
      }
    });
  };

  return (
    <div className="container">
      <Notifications messages={notifications} />
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