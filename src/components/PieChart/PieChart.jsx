import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Цвета для секторов диаграммы
const COLORS = [
  '#2563eb', // синий
  '#10b981', // зелёный
  '#f59e0b', // жёлтый
  '#ef4444', // красный
  '#8b5cf6', // фиолетовый
  '#ec4899', // розовый
  '#14b8a6', // бирюзовый
  '#f97316', // оранжевый
  '#6366f1', // индиго
  '#84cc16', // лаймовый
];

// Заглушка для пустых данных
const EmptyPlaceholder = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    color: 'var(--text-tertiary)',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }}>📊</div>
    <div style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-sm)' }}>
      Нет данных
    </div>
    <div style={{ fontSize: 'var(--font-size-sm)' }}>
      Добавьте операции, чтобы увидеть диаграмму
    </div>
  </div>
);

// Кастомный tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
          {data.name}
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>
          {data.value.toLocaleString('ru-RU')} ₽
        </div>
      </div>
    );
  }
  return null;
};

function PieChart({ data = [], title = '' }) {
  // Если данных нет — показываем заглушку
  if (!data || data.length === 0) {
    return <EmptyPlaceholder />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {(data || []).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span style={{ color: 'var(--text-primary)' }}>{value}</span>}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export default PieChart;