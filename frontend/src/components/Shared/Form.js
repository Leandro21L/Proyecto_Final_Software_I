import React from 'react';

const Form = ({ fields, onSubmit }) => {
  const [formData, setFormData] = React.useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      {fields.map((field) => (
        <div key={field.name}>
          <label>{field.label}</label>
          <input
            type={field.type || 'text'}
            name={field.name}
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit">Agregar</button>
    </form>
  );
};

export default Form;
