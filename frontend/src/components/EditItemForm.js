import React, { useState } from 'react';
import { editItem } from '../services/api';

function EditItemForm({ item, onEdit }) {
  const [formData, setFormData] = useState({ ...item });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editItem(item.id, formData);
    onEdit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Item</h2>
      <input name="name" value={formData.name} onChange={handleChange} required />
      <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
      <input name="type" value={formData.type} onChange={handleChange} />
      <input name="threshold" type="number" value={formData.threshold} onChange={handleChange} />
      <button type="submit">Save</button>
    </form>
  );
}

export default EditItemForm;
