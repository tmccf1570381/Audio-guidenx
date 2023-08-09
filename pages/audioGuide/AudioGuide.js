import Layout from '../common/Layout';
import styles from "./AudioGuide.module.css";
import React, { useRef, useState } from 'react';
import read from "../api/readJSON";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function() {
    const [procedure, setProcedure] = useState([]);
    const [ranges, setRanges] = useState(4);
    const [recog, setRecog] = useState(false);
    const [current, setCurrent] = useState([0,[]]);
    const [target, setTarget] = useState("")
    const [inputFileName, setInputFileName] = useState("--ファイル選択--");
    const audioRef = useRef();

    const readJson = async (e) => {
        if(inputFileName !== "--ファイル選択--"){
            const data = await read(inputFileName);
            const flag = [...Array(data.length)].reduce((init, _, ind)=>{return data[ind].flag ? [...init, ind] : [...init] },[])
            console.log(data);
            setCurrent([0,flag]);
            setProcedure(data);
            setTarget(`/mp3/${inputFileName}/${flag[0]}.mp3`)
        }
    };

    const start = () => {
        if(inputFileName !== "--ファイル選択--"){
            SpeechRecognition.startListening({ continuous: true });
            audioRef.current.play()
            setRecog(!recog)
            console.log(current);
        }
    };

    const stop = () => {
        SpeechRecognition.stopListening();
        audioRef.current.pause();
        setRecog(!recog)
    };

    const next = async () => {
        if(inputFileName !== "--ファイル選択--"){
            if(current[0]+1 < current[1].length){
                const CN = [current[0]+1, [...current[1]]];
                document.getElementById(`${CN[1][CN[0]-1]}`).scrollIntoView({block:"center"});
                setCurrent(CN);
                audioRef.current.src = `/mp3/${inputFileName}/${CN[1][CN[0]]}.mp3`
                recog ? audioRef.current.play() : "";
            }
        }
    };

    const back = () => {
        if(inputFileName !== "--ファイル選択--"){
            if(current[0]-1 >= 0){
                const CN = [current[0] - 1, [...current[1]]];
                document.getElementById(`${CN[1][CN[0]+1]}`).scrollIntoView({block:"center"});
                setCurrent(CN);
                audioRef.current.src = `/mp3/${inputFileName}/${CN[1][CN[0]]}.mp3`
                recog ? audioRef.current.play() : "";
            }
        }
    };
  
    const commands = [
        {
            command: '*前*',
            callback: () => {
                back();
                resetTranscript();}
        },
        {
            command:  "*OK*",
            callback: () =>  {
                next();
                resetTranscript();}
        }
    ];

    const changeInput = (e) => {
        if(e.target.value !== ""){
            const fname = e.target.value.split("\\").pop();
            setInputFileName(fname.replace(".json",""))
        };
    };

    const reset = () => {
        setProcedure([]);
        setRecog(false);
        setCurrent([0,[]]);
        setTarget("")
        setInputFileName("--ファイル選択--");
    };
  
    const {
      interimTranscript,
      resetTranscript,
      browserSupportsSpeechRecognition,
    } = useSpeechRecognition({ commands });

    return (
        <>
            <audio className='audio' src={target} ref={audioRef}></audio>
            <Layout page="2">
                <div className={styles.drawArea}>
                    <article className={styles.fixed}>
                        <div className={styles.controllArea}>
                            <label>
                                <input type='checkbox' className={styles.hidden} onClick={recog ? stop : start}></input>
                                <p className={recog ? styles.green : styles.red}></p>
                            </label>
                            <section className={styles.top}>
                                <div className={styles.inline}>
                                    <label className={styles.selectFile} value={inputFileName}>
                                        <input type="file" accept=".json"  className={styles.hidden} id="test" onChange={changeInput}/> 
                                        <p className={styles.file} value={inputFileName} >{inputFileName}</p>
                                    </label>
                                </div>
                                {/* <input type='text' className="kari"></input> */}
                            </section>
                                <button className={styles.btn} onClick={readJson}>LOAD</button>
                                <button className={styles.btn} onClick={reset}>RESET</button>

                            <section className={styles.photoArea}>
                                <img className={styles.photoLimmit} src={procedure.length !== 0 ? `/systemImage/${procedure[current[0]].image}` : "/systemImage/noimage.png"} ></img> 
                                {/* "/systemImage/noimage.png" */}
                            </section>
                            <section className={styles.audioControlArea}>
                                <img src="/systemImage/back.png" className={styles.icon3} onClick={back} ></img>
                                {recog 
                                ? <img src="/systemImage/pause.png" className={styles.icon} onClick={stop}></img>
                                : <img src="/systemImage/play.png" className={styles.icon} onClick={start}></img>}
                                <img src="/systemImage/next.png" className={styles.icon3} onClick={next} ></img>    
                            </section>
                            <section className={styles.volumeArea}>
                                <img src="/systemImage/volumeOFF.png" className={styles.icon2} onClick={()=>setRanges(0)}></img>
                                <input type="range" min="0" max="10" className={styles.slider} onChange={(e) => setRanges(e.currentTarget.value)} value={ranges}></input>
                                <img src="/systemImage/volumeON.png" className={styles.icon2} onClick={()=> ranges === 0 ? setRanges(4) : setRanges(ranges)} ></img>
                            </section>
                        </div>

                    </article>
                    <article className={styles.continer}>
                    <div className={styles.spacer}></div>
                    <ul>
                    {procedure.map((_,ind) => {
                        return (
                            <React.Fragment key={ind}>
                            {
                                ((ind === 0) || (procedure[ind-1]["大項目"] !== procedure[ind]["大項目"]))
                                ?  <li className={styles.abst}>
                                    {/* <input type='text' value= onChange={()=>{}}></input> */}
                                    {procedure[ind]["大項目"]}
                                    </li>
                                : ""
                            }
                            <li className={styles.row}>
                                <input type="text" value = {procedure[ind]["詳細項目"]} className={Number(ind) === current[1][current[0]] ? `${styles.content} ${styles.empha}` : styles.content} name="cont" onChange={()=>{}} id={ind} />
                            </li>
                            </React.Fragment>
                        )})
                }
                </ul>
                    </article>
                </div>

            </Layout>
        </>
    );
}