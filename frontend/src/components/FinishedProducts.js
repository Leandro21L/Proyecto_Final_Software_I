import React, { useEffect, useState } from 'react';
import { fetchData, createData } from '../services/api';
import DataTable from './Shared/DataTable';
import Form from './Shared/Form';
import Notifications from './Notifications';

const FinishedProducts = () => {
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchData('finished_products').then(data => {
      setProducts(data);
      // Revisar productos con cantidad baja
      const lowQuantityNotifications = data
        .filter(product => product.current_quantity <= product.min_quantity)
        .map(product => `Producto "${product.name}" está por debajo de la cantidad mínima (${product.current_quantity})`);
      
      setNotifications(lowQuantityNotifications);
    });
  }, []);

  const handleAddProduct = (newProduct) => {
    createData('finished_products', newProduct).then((product) => {
      const updatedProducts = [...products, product];
      setProducts(updatedProducts);

      // Revisar si el nuevo producto está por debajo de la cantidad mínima
      if (product.current_quantity <= product.min_quantity) {
        setNotifications([
          ...notifications, 
          `Nuevo producto "${product.name}" está por debajo de la cantidad mínima (${product.current_quantity})`
        ]);
      }
    });
  };

  return (
    <div className="container">
      <Notifications messages={notifications} />
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