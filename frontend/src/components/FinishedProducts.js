import React, { useEffect, useState } from 'react';
import { fetchData, createData } from '../services/api';
import DataTable from './Shared/DataTable';
import Form from './Shared/Form';
import Notifications from './Notifications.js';

const FinishedProducts = () => {
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const getData = () => {
    fetchData('api/products').then((product) => {
      setProducts(product)
      const lowQuantityNotifications = product
        .filter(product => product.current_quantity <= product.min_quantity)
        .map(product => `Producto "${product.name}" está por debajo de la cantidad mínima (${product.current_quantity})`);
      setNotifications(lowQuantityNotifications);
    });
  }
  useEffect(() => {
    getData();
  }, []);

  const handleAddProduct = (newProduct) => {
    createData('api/products/create', newProduct).then(() => {
      getData();

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
      {products.length > 0 &&
        <DataTable
          columns={['id', 'name', 'description', 'current_quantity', 'min_quantity', 'max_quantity']}
          data={products}
        />
      }
    </div>
  );
};

export default FinishedProducts;