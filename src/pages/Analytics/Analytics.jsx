import React, { useState, useEffect, useCallback } from 'react';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import { getExpensesByCategory, getMonthlySummary } from '../../services/summaryService';
import styles from './Analytics.module.css';

function Analytics() {
  // Состояние для данных графиков
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Загрузка данных для графиков
  const loadData = useCallback(() => {
    const expensesByCategory = getExpensesByCategory();
    setCategoryData(expensesByCategory);

    const monthly = getMonthlySummary();
    setMonthlyData(monthly);
  }, []);

  // Загружаем данные при монтировании
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className={styles.analytics}>
      <h1 className={styles.title}>Аналитика</h1>

      {/* Сетка графиков */}
      <div className={styles.chartsGrid}>
        {/* Круговая диаграмма расходов по категориям */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Расходы по категориям</h2>
          <div className={styles.chartContent}>
            <PieChart data={categoryData} />
          </div>
        </div>

        {/* Столбчатый график доходов и расходов по месяцам */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
          <div className={styles.chartContent}>
            <BarChart data={monthlyData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;