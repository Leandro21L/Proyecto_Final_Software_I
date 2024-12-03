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
      setMaterials(material);
      const lowQuantityNotifications = material
        .filter(mat => Number(mat.current_quantity) <= Number(mat.min_quantity))
        .map(mat => 
          `Materia prima "${mat.description}" está por debajo de la cantidad mínima (${mat.current_quantity} ${mat.measurement_unit})`
        );
      setNotifications(lowQuantityNotifications);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAddMaterial = (newMaterial) => {
    // Convertir valores a números
    const currentQuantity = Number(newMaterial.current_quantity);
    const minQuantity = Number(newMaterial.min_quantity);

    createData('api/materials/create', newMaterial).then(() => {
      getData();

      if (currentQuantity <= minQuantity) {
        setNotifications(prevNotifications => [
          ...prevNotifications,
          `Nueva materia prima "${newMaterial.description}" está por debajo de la cantidad mínima (${currentQuantity} ${newMaterial.measurement_unit})`
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
      {materials.length > 0 &&
        <DataTable
          columns={['id', 'name', 'description', 'current_quantity', 'min_quantity', 'max_quantity', 'measurement_unit']}
          data={materials}
        />
      }
    </div>
  );
};

export default RawMaterials;
