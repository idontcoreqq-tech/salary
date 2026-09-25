import React from 'react';
import styles from './EmptyState.module.css';

function EmptyState({ 
  title = 'Нет данных', 
  description = '', 
  icon = '📭',
  actionLabel = '',
  onAction 
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.title}>{title}</div>
      {description && (
        <div className={styles.description}>{description}</div>
      )}
      {onAction && actionLabel && (
        <button 
          className={styles.actionButton}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;