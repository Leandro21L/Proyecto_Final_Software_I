import React, { useEffect, useState } from 'react';
import { fetchData, createData } from '../services/api';
import DataTable from './Shared/DataTable';
import Form from './Shared/Form';

const FinishedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData('finished_products').then(setProducts);
  }, []);

  const handleAddProduct = (newProduct) => {
    createData('finished_products', newProduct).then((product) => {
      setProducts([...products, product]);
    });
  };

  return (
    <div className="container">
      <h1>Productos Terminados</h1>
      <Form
        fields={[
          { name: 'name', label: 'Nombre' },
          { name: 'description', label: 'Descripción' },
          { name: 'current_quantity', label: 'Cantidad Actual', type: 'number' },
          { name: 'min_quantity', label: 'Cantidad Mínima', type: 'number' },
          { name: 'max_quantity', label: 'Cantidad Máxima', type: 'number' },
        ]}
        onSubmit={handleAddProduct}
      />
      <DataTable
        columns={['id', 'name', 'description', 'current_quantity', 'min_quantity', 'max_quantity']}
        data={products}
      />
    </div>
  );
};

export default FinishedProducts;
