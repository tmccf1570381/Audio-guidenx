import Layout from '../common/Layout'
import React, { useEffect, useRef, useState } from 'react'
import styles from "./SystemSetting.module.css"
import { async } from 'regenerator-runtime'


export default ()=>{


  return (
    <Layout page = "3">
      <img  className={styles.background} src='/systemImage/background2.png'></img>
      <section className={styles.contentArea}>
        {/* <nav className={styles.content}><article>スピーカー切替え</article></nav>
        <nav className={styles.content}><article>テンプレートダウンロード</article></nav>
        <nav className={styles.content}><article>テンプレートダウンロード</article></nav>
        <nav className={styles.content}><article>テンプレートダウンロード</article></nav> */}
      </section>
    </Layout>
  )
}