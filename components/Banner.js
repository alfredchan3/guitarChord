import React, { useState } from 'react';
import styles from './Banner.module.css';

const Banner = ({ onModeChange }) => {
  const [activeMode, setActiveMode] = useState('chord'); // 默认选中和弦推导

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    if (onModeChange) {
      onModeChange(mode);
    }
  };

  return (
    <div className={styles.banner}>
      <div className={styles.bannerContainer}>
        <button
          className={`${styles.bannerItem} ${activeMode === 'chord' ? styles.active : ''}`}
          onClick={() => handleModeChange('chord')}
        >
          <span className={styles.icon}>🎸</span>
          <span className={styles.text}>和弦推导</span>
        </button>
        <button
          className={`${styles.bannerItem} ${activeMode === 'circle' ? styles.active : ''}`}
          onClick={() => handleModeChange('circle')}
        >
          <span className={styles.icon}>⭕</span>
          <span className={styles.text}>五度圈</span>
        </button>
      </div>
    </div>
  );
};

export default Banner;
