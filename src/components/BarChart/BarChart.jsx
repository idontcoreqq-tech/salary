import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

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
    <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }}>📈</div>
    <div style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-sm)' }}>
      Нет данных
    </div>
    <div style={{ fontSize: 'var(--font-size-sm)' }}>
      Добавьте операции, чтобы увидеть график
    </div>
  </div>
);

// Кастомный tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
          {label}
        </div>
        {(payload || []).map((entry, index) => (
          <div key={index} style={{ color: entry.color, marginBottom: 'var(--spacing-xs)' }}>
            {entry.name}: {entry.value.toLocaleString('ru-RU')} ₽
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function BarChart({ data = [], title = '' }) {
  // Если данных нет — показываем заглушку
  if (!data || data.length === 0) {
    return <EmptyPlaceholder />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis 
          dataKey="month" 
          stroke="var(--text-secondary)"
          style={{ fontSize: 'var(--font-size-sm)' }}
        />
        <YAxis 
          stroke="var(--text-secondary)"
          style={{ fontSize: 'var(--font-size-sm)' }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="top" 
          height={36}
          formatter={(value) => <span style={{ color: 'var(--text-primary)' }}>{value}</span>}
        />
        <Bar 
          dataKey="income" 
          name="Доходы" 
          fill="#10b981" 
          radius={[8, 8, 0, 0]}
        />
        <Bar 
          dataKey="expense" 
          name="Расходы" 
          fill="#ef4444" 
          radius={[8, 8, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export default BarChart;