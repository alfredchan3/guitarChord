import React from 'react';
import styles from './CircleOfFifths.module.css';

// 简单的iframe组件来嵌入原始五度圈页面
function CircleOfFifthsIframe() {
  // 使用basePath路径
  const iframeSrc = '/guitarChord/circleOfFifths/index.html';
  
  return (
    <div className={styles.iframeContainer}>
      <iframe 
        src={iframeSrc}
        width="100%"
        height="900"
        style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: 'white'
        }}
        title="五度圈 (Circle of Fifths)"
        allow="scripts"
      />
    </div>
  );
}

const CircleOfFifths = () => {
  return (
    <div className={styles.circleOfFifths}>
      <h2 className={styles.title}>五度圈 (Circle of Fifths)</h2>
      <div className={styles.description}>
        <p>五度圈是音乐理论中的重要工具，显示了各个调之间的关系。</p>
        <p>你可以拖拽鼠标来旋转五度圈，点击锁定按钮来固定位置。</p>
      </div>
      
      <CircleOfFifthsIframe />
      
      <div className={styles.instructions}>
        <h3>使用说明：</h3>
        <ul>
          <li>外圈：显示升降记号的数量</li>
          <li>中圈：显示大调调名</li>
          <li>内圈：显示小调调名</li>
          <li>中心：显示选中调的详细信息和五线谱</li>
          <li>锁定按钮：控制五度圈是否可以旋转</li>
        </ul>
      </div>
    </div>
  );
};

export default CircleOfFifths;
