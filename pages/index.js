import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })
import Layout from './common/Layout'
import StartPage from './start/StartPage'

export default function Home() {
  return (
    <>
     <Layout page="0">
      <StartPage />
     </Layout>
    </>
  )
}

