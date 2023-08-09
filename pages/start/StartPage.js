import Link from 'next/link'
import styles from "./StartPage.module.css"
import ReleasNotes from "./ReleasNotes"

function StartPage() {
    return (
        <>
            <img className={styles.background} src='systemImage/background.jpeg' />
            <div className={styles.title}>Welcom to  Audio Guidance System</div>
            <ReleasNotes />

            <div className={styles.contentArea}>
                <Link href="/masterSettig/MasterSetting" className={styles.container}>
                    <div className={styles.iconArea}>
                        <img className={styles.icon} src='systemImage/mastersetting.png' />
                    </div>
                    <p className={styles.contentTitle}>マスタ設定</p>
                </Link>
                <Link href="/audioGuide/AudioGuide" className={`${styles.container}`}>
                    <div className={styles.iconArea}>
                        <img className={styles.icon} src='systemImage/play.png' />
                    </div>
                    <p className={styles.contentTitle}>音声ガイド</p>
                </Link>
                <Link href="/systemSetting/SystemSetting" className={styles.container}>
                    <div className={styles.iconArea}>
                        <img className={styles.icon} src='systemImage/systemsetting.png' />
                    </div>
                    <p className={styles.contentTitle}>システム設定</p>
                </Link>

            </div>
        </>
    );
}

export default StartPage;