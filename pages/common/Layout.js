import Head from "next/head";
import styles from "./Layout.module.css"

function Layout({ children , page }) {
    return (
        <>
            <Head>
                <link rel="icon" hred="./public/favicon.ico" />
                <title>Audio Guidance</title>
            </Head>
            <header className={styles.header}>
                <h1 className={styles.title}>Audio Guidance System -ver2.0</h1>
                <nav  className={styles.navigate}>
                    <ul className={styles.navList}>
                        <li className={styles.headLink}><a className={styles.headLink2} href={page === "0" ? null : "/"}>{ "メニュー" }</a></li>
                        <li className={styles.headLink}><a className={styles.headLink2} href={page === "1" ? null : "/masterSettig/MasterSetting"}>マスタ設定</a></li>
                        <li className={styles.headLink}><a className={styles.headLink2} href={page === "2" ? null : "/audioGuide/AudioGuide"}>音声ガイド</a></li>
                        <li className={styles.headLink}><a className={styles.headLink2} href={page === "3" ? null : "/systemSetting/SystemSetting"}>システム設定</a></li>
                    </ul>
                </nav>
            </header>
            <main className={styles.main}>
                {children}
            </main>
            <footer className={styles.footer}>
                <p className={styles.endTitle}>~YUZO会 TOYOTA MOTOR CORPORATION.Inc~</p>
            </footer>
        </>
    );
}

export default Layout;