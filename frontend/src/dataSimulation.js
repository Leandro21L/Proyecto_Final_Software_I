//Genera datos simulados para el inventario.

export const simulateData = () => {
    const materials = ['Harina', 'Azúcar', 'Aceite', 'Chocolate'];
    return materials.map((material) => ({
      name: material,
      level: Math.floor(Math.random() * 100),
    }));
  };
  