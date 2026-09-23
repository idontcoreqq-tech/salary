import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import styles from './App.module.css';

// Заглушки для страниц (будут заменены на реальные компоненты в фазе C)
const DashboardPlaceholder = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Главная</h1>
    <p>Страница дашборда будет здесь</p>
  </div>
);

const HistoryPlaceholder = () => (
  <div style={{ padding: '2rem' }}>
    <h1>История</h1>
    <p>Страница истории операций будет здесь</p>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Аналитика</h1>
    <p>Страница аналитики будет здесь</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPlaceholder />} />
          <Route path="/history" element={<HistoryPlaceholder />} />
          <Route path="/analytics" element={<AnalyticsPlaceholder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;