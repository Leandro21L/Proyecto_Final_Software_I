import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const [inventoryData, setInventoryData] = useState({
    materials: [],
    movements: [],
    products: []
  });
  const [reportAnalytics, setReportAnalytics] = useState({
    consumptionTrends: [],
    materialLevels: [],
    productionEfficiency: [],
    criticalMaterials: []
  });

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const [materials, movements, products] = await Promise.all([
          fetchData('materials'),
          fetchData('inventory_movements'),
          fetchData('products')
        ]);

        const data = { materials, movements, products };
        setInventoryData(data);
        
        const analytics = processInventoryAnalytics(data);
        setReportAnalytics(analytics);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventoryData();
  }, []);

  const processInventoryAnalytics = (data) => {
    const { materials, movements, products } = data;

    // Tendencias de consumo por material
    const consumptionTrends = processConsumptionTrends(movements, materials);

    // Niveles de materiales críticos
    const materialLevels = processMaterialLevels(materials, movements);

    // Eficiencia de producción
    const productionEfficiency = processProductionEfficiency(movements, products);

    // Materiales críticos (próximos a agotarse)
    const criticalMaterials = materialLevels
      .filter(m => m.stockPercentage < 20)
      .sort((a, b) => a.stockPercentage - b.stockPercentage);

    return {
      consumptionTrends,
      materialLevels,
      productionEfficiency,
      criticalMaterials
    };
  };

  const processConsumptionTrends = (movements, materials) => {
    const consumptionMap = {};
    
    movements
      .filter(m => m.movement_type === 'output')
      .forEach(movement => {
        const material = materials.find(m => m.id === movement.id_material);
        const month = new Date(movement.date).toLocaleString('default', { month: 'short' });
        
        if (!consumptionMap[material.name]) {
          consumptionMap[material.name] = {};
        }
        
        if (!consumptionMap[material.name][month]) {
          consumptionMap[material.name][month] = 0;
        }
        
        consumptionMap[material.name][month] += movement.quantity;
      });

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return Object.entries(consumptionMap).map(([materialName, monthData]) => ({
      material: materialName,
      data: monthOrder.map(month => ({
        month,
        cantidad: monthData[month] || 0
      }))
    }));
  };

  const processMaterialLevels = (materials, movements) => {
    return materials.map(material => {
      const outputs = movements
        .filter(m => m.id_material === material.id && m.movement_type === 'output')
        .reduce((sum, movement) => sum + movement.quantity, 0);
      
      const entries = movements
        .filter(m => m.id_material === material.id && m.movement_type === 'entry')
        .reduce((sum, movement) => sum + movement.quantity, 0);

      const stockPercentage = Math.round((material.stock / (material.stock + outputs - entries)) * 100);

      return {
        name: material.name,
        existencia: material.stock,
        salidas: outputs,
        entradas: entries,
        stockPercentage
      };
    });
  };

  const processProductionEfficiency = (movements, products) => {
    return products.map(product => {
      const productMovements = movements.filter(m => m.id_product === product.id);
      
      const outputs = productMovements
        .filter(m => m.movement_type === 'output')
        .reduce((sum, movement) => sum + movement.quantity, 0);
      
      const entries = productMovements
        .filter(m => m.movement_type === 'entry')
        .reduce((sum, movement) => sum + movement.quantity, 0);

      const efficiency = Math.round((entries / (entries + outputs)) * 100);

      return {
        name: product.name,
        outputs,
        entries,
        efficiency
      };
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Reporte de Inventario', 14, 22);

    // Sección de Materiales
    doc.autoTable({
      startY: 30,
      head: [['Material', 'Existencia', 'Entradas', 'Salidas', '% Stock']],
      body: reportAnalytics.materialLevels.map(material => [
        material.name, 
        material.existencia, 
        material.entradas, 
        material.salidas,
        `${material.stockPercentage}%`
      ])
    });

    // Sección de Materiales Críticos
    if (reportAnalytics.criticalMaterials.length > 0) {
      doc.autoTable({
        startY: doc.previousAutoTable.finalY + 10,
        head: [['Material Crítico', 'Existencia', '% Stock']],
        body: reportAnalytics.criticalMaterials.map(material => [
          material.name,
          material.existencia,
          `${material.stockPercentage}%`
        ])
      });
    }

    doc.save('Reporte_inventario.pdf');
  };

  return (
    <div className="container">
      <h1>Reportes de Inventario Avanzados</h1>
      
      <div className="report-actions">
        <button onClick={exportToPDF} className="export-button">
          Exportar Informe 
        </button>
      </div>

      <div className="reports-grid">
        {/* Tendencias de Consumo */}
        <div className="report-section">
          <h2>Tendencias de Consumo por Material</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {reportAnalytics.consumptionTrends.map((materialData, index) => (
                <Line
                  key={materialData.material}
                  type="monotone"
                  dataKey="cantidad"
                  data={materialData.data}
                  name={materialData.material}
                  stroke={`hsl(${index * 360 / reportAnalytics.consumptionTrends.length}, 70%, 50%)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Niveles de Materiales */}
        <div className="report-section">
          <h2>Estado de Inventario de Materiales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportAnalytics.materialLevels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="existencia" fill="#82ca9d" name="Existencia" />
              <Bar dataKey="salidas" fill="#8884d8" name="Salidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Materiales Críticos */}
        <div className="report-section">
          <h2>Materiales en Estado Crítico</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportAnalytics.criticalMaterials}
                dataKey="stockPercentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {reportAnalytics.criticalMaterials.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`hsl(${index * 360 / reportAnalytics.criticalMaterials.length}, 70%, 50%)`} 
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Eficiencia de Producción */}
        <div className="report-section">
          <h2>Eficiencia de Producción</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportAnalytics.productionEfficiency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="efficiency" fill="#ffc658" name="Eficiencia %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;