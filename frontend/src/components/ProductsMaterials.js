import React, { useEffect, useState } from 'react';
import { fetchData, createData } from '../services/api';
import DataTable from './Shared/DataTable';
import Form from './Shared/Form';

const ProductsMaterials = () => {
  const [relations, setRelations] = useState([]);

  useEffect(() => {
    fetchData('products_materials').then(setRelations);
  }, []);

  const handleAddRelation = (newRelation) => {
    createData('products_materials', newRelation).then((relation) => {
      setRelations([...relations, relation]);
    });
  };

  return (
    <div className="container">
      <h1>Relaciones Productos-Materias</h1>
      <Form
        fields={[
          { name: 'id_material', label: 'ID de Material', type: 'number' },
          { name: 'id_product', label: 'ID de Producto', type: 'number' },
          { name: 'materials_used', label: 'Materiales Usados', type: 'number' },
        ]}
        onSubmit={handleAddRelation}
      />
      <DataTable
        columns={['id_material', 'id_product', 'materials_used']}
        data={relations}
      />
    </div>
  );
};

export default ProductsMaterials;
