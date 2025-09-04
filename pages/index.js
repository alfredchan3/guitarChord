import React, { Component } from 'react';
import Head from 'next/head';
import ChordSelect from '../components/ChordSelect';
import ChordDraw from '../components/ChordDraw';
import styles from '../styles/Home.module.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  hideLoading() {
    this.refs.chordSelect.hideLoading();
  }

  selectFinish(chordTone, inversion = 0) {
    this.refs.chordDraw.draw(chordTone, inversion);
  }

  render() {
    return (
      <>
        <Head>
          <title>吉他和弦推导WEB</title>
          <meta name="description" content="Guitar chord deduction tool" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/guitar.ico" />
        </Head>
        <div className={styles.app}>
          <ChordSelect ref="chordSelect" selectFinish={this.selectFinish.bind(this)} />
          <ChordDraw ref="chordDraw" hideLoading={this.hideLoading.bind(this)} />
        </div>
      </>
    )
  }
}

export default Home;
