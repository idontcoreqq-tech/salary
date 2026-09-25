import React, { useEffect } from 'react';
import styles from './Modal.module.css';

function Modal({ isOpen = false, onClose, title = '', children, footer }) {
  // Обработчик клавиши Escape для закрытия модалки
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Блокировка скролла body при открытой модалке
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Если модалка не открыта — ничего не рендерим
  if (!isOpen) return null;

  // Обработчик клика на overlay (не срабатывает при клике внутри модалки)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* Заголовок */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button 
            className={styles.closeButton} 
            onClick={() => onClose?.()}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {/* Контент */}
        <div className={styles.content}>
          {children}
        </div>

        {/* Футер (опционально, для кнопок) */}
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;