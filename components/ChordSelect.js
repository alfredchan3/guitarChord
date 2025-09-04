import React, { Component } from 'react';
import styles from './ChordSelect.module.css';

class ChordSelect extends Component {
  constructor(props) {
    super(props);
    this.keyMap = ['1', '#1', 'b2', '2', '#2', 'b3', '3', '4', '#4', 'b5', '5', '#5', 'b6', '6', '#6', 'b7', '7'];
    this.state = {
      chordTone: ['1', '3', '5'],
      type: 3,
      keyBar1: 0,
      keyBar2: 38,
      keyBar3: 54,
      keyBar4: 0,
      keyBarShow1: false,
      keyBarShow2: false,
      keyBarShow3: false,
      keyBarShow4: false,
      loading: false,
      inversion: 0  // 转位级别：0=原位，1=第一转位，2=第二转位，3=第三转位
    }
  }

  isArray(data) {
    return Object.prototype.toString.call(data) === '[object Array]';
  }

  isNumber(data) {
    return Object.prototype.toString.call(data) === '[object Number]';
  }

  isMobile() {
    return !!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
  }

  touchMove(index, e) {
    let keyBarName = "keyBar" + (index + 1);
    let x = this.isNumber(e) ? e : e.touches[0].clientX;
    let dx = x - this.startX;
    let _state = {};
    let resultX = (this.keyBarX + dx) * 0.8;
    _state[keyBarName] = resultX < this.minLeft ? this.minLeft : (resultX > this.maxLeft ? this.maxLeft : resultX);
    let percent = (_state[keyBarName] - this.minLeft) / (this.maxLeft - this.minLeft + 0.01);
    let newKey = this.keyMap[Math.floor(percent * this.keyMap.length)];
    _state.chordTone = this.state.chordTone.concat();
    _state.chordTone[index] = newKey;
    this.setState(_state);
  }

  touchStart(index, e) {
    let keyBarName = "keyBar" + (index + 1);
    let _state = {};
    let clientX = this.isNumber(e) ? e : e.touches[0].clientX;
    _state["keyBarShow" + (index + 1)] = true;
    this.selectWidth = document.getElementById("key1").clientWidth;
    this.maxLeft = this.selectWidth * 0.9 - 20;
    this.minLeft = this.selectWidth * 0.1;
    this.startX = clientX;
    this.keyBarX = this.state[keyBarName];
    this.setState(_state);
  }

  touchEnd(index) {
    let _state = {};
    _state["keyBarShow" + (index + 1)] = false;
    _state.loading = true;
    this.setState(_state);
    this.props.selectFinish(this.state.chordTone, this.state.inversion);
  }

  mouseDown(index, e) {
    if (this.isMobile()) return;
    this.isMouseDown = true;
    this.touchStart(index, e.pageX);
  }

  mouseUp(index, e) {
    if (this.isMobile()) return;
    this.isMouseDown = false;
    this.touchEnd(index);
  }

  mouseMove(index, e) {
    if (this.isMobile() || !this.isMouseDown) return;
    this.touchMove(index, e.pageX);
  }

  mouseLeave(index, e) {
    if (this.isMobile() || !this.isMouseDown) return;
    this.isMouseDown = false;
    this.touchEnd(index);
  }

  createSelect() {
    return (
      <div className={styles.keySelect}>
        {this.state.chordTone.map((key, i) => {
          let flag = i + 1;
          return (
            <div key={"reactkey_" + i} id={"key" + flag} className={`${styles.keyNum} ${styles.square}`}
              onTouchStart={this.touchStart.bind(this, i)}
              onTouchMove={this.touchMove.bind(this, i)}
              onTouchEnd={this.touchEnd.bind(this, i)}
              onMouseDown={this.mouseDown.bind(this, i)}
              onMouseUp={this.mouseUp.bind(this, i)}
              onMouseMove={this.mouseMove.bind(this, i)}
              onMouseLeave={this.mouseLeave.bind(this, i)}
            >
              <span className={styles.noselect}>{key}</span>
              <div className={`${styles.keyBar} ${this.state["keyBarShow" + flag] ? styles.keybarShow : ""}`} style={{ left: this.state["keyBar" + flag] + "px" }}></div>
            </div>
          )
        })}
      </div>
    )
  }

  chordCountChange(count) {
    this.setState({
      chordTone: this.state.chordTone.slice(0, count),
      type: count,
      inversion: 0  // 重置转位为原位
    });
    if (count === 4 && this.state.chordTone.length < 4) {
      this.setState({
        chordTone: this.state.chordTone.concat(['1']),
        keyBar4: 0
      });
    }
  }

  hideLoading() {
    this.setState({
      loading: false
    });
  }

  // 转位和弦选择
  inversionChange(inversion) {
    this.setState({
      inversion: inversion,
      loading: true
    });
    this.props.selectFinish(this.state.chordTone, inversion);
  }

  // 获取转位名称
  getInversionName(inversion) {
    switch(inversion) {
      case 0: return '原位';
      case 1: return '一转位';
      case 2: return '二转位';
      case 3: return '三转位';
      default: return '原位';
    }
  }

  render() {
    return (
      <div className={styles.containerChordSelect}>
        {this.createSelect()}
        <div className={`${styles.selectNotify} ${styles.noselect}`}>左右拖动可改变和弦组成音</div>
        <div className={styles.chordCount}>
          <div className={`${styles.noselect} ${this.state.type === 3 ? styles.active : ""}`} onClick={this.chordCountChange.bind(this, 3)}>三音和弦</div>
          <div className={`${styles.noselect} ${this.state.type === 4 ? styles.active : ""}`} onClick={this.chordCountChange.bind(this, 4)}>四音和弦</div>
        </div>
        <div className={styles.inversionSelect}>
          <div className={`${styles.selectNotify} ${styles.noselect}`}>和弦转位</div>
          <div className={styles.inversionButtons}>
            {[0, 1, 2, ...(this.state.type === 4 ? [3] : [])].map(inv => (
              <div 
                key={inv}
                className={`${styles.noselect} ${styles.inversionBtn} ${this.state.inversion === inv ? styles.active : ""}`} 
                onClick={this.inversionChange.bind(this, inv)}
              >
                {this.getInversionName(inv)}
              </div>
            ))}
          </div>
        </div>
        <div className={`${styles.loadingBox} ${this.state.loading ? styles.show : ""}`}>
          <img src="/bars.svg" alt="" className={styles.loading} />
        </div>
      </div>
    );
  }
}

export default ChordSelect;
