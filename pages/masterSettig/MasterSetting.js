import Layout from '../common/Layout'
import Link from 'next/link'
import React, {useRef, useState} from 'react'
import styles from "./ReadExcel.module.css"
import * as  XLSX from 'xlsx'


export default function() {
    const [procedure, setProcedure] = useState([]);
    const [inputFileName, setInputFileName] = useState("--ファイル選択--");
    const [image, setImage] = useState([]);
    const [flag, setFlag] = useState([]);
    const [output, setOutput] = useState("");
    const [sound, setSound] = useState(0)
    const [photoView, setPhotoView] = useState(false)
    const messe = useRef();

    const sampleFunc = () => {
        const tag =  document.getElementById("test");
        if (tag.files[0]!==undefined) {
            setInputFileName(tag.files[0].name);
            setOutput(tag.files[0].name.replace(/.xlsx$/,""));            
            tag.files[0].arrayBuffer().then(async (buffer) => {
                const workbook = await XLSX.read(new Uint8Array(buffer), { type: "array"});
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const content = XLSX.utils.sheet_to_json(worksheet);
                const newArray = [...Array(content.length)].map(e => false);
                setImage(newArray);                
                const newFlag = [...Array(content.length)].map(e => true);
                setFlag(newFlag);
                setProcedure(content);
            });
        };
    };

    const addRow = (e) => {
        const newProcedure = [...procedure];
        image.splice(Number(e.currentTarget.id)+1, 0, null);
        flag.splice(Number(e.currentTarget.id)+1, 0, true);
        newProcedure.splice(Number(e.currentTarget.id)+1, 0,  {大項目: procedure[e.currentTarget.id]["大項目"], 詳細項目: '--新規追加', __rowNum__: procedure.length + 1});
        setProcedure(newProcedure);
    };

    const deleteRow = (e) => {
        const newProcedure = [...procedure];
        image.splice(Number(e.currentTarget.id), 1);
        flag.splice(Number(e.currentTarget.id), 1);
        newProcedure.splice(Number(e.currentTarget.id), 1);
        setProcedure(newProcedure);
    };

    const changeInput = (e) => {
        const newProcedure = [...procedure];
        newProcedure[Number(e.currentTarget.id)]["詳細項目"] = e.currentTarget.value;
        setProcedure(newProcedure);
    };

    const changeImage = (e) => {
        const newImage = [...image];
        console.log(e.currentTarget.files[0]);
        newImage[e.currentTarget.id]=e.currentTarget.files[0];
        // newImage[e.currentTarget.id]=e.currentTarget.files[0].name;
        setImage(newImage);
    };

    const changeFlag = (e) => {
        const newFlag = [...flag];
        newFlag[e.currentTarget.id] = !newFlag[e.currentTarget.id];
        setFlag(newFlag);
    };

    const outputJson = async (e) => {
        if(procedure.length !== 0) {
            console.log(image[0].name);
            const out = procedure.map((e, ind) => {return {...e, image: image[ind].name ? image[ind].name : "noimage.png", flag: flag[ind]}});
            // const out = procedure.map((e, ind) => {return {...e, image: image[ind], flag: flag[ind]}});
            const temp = await fetch('/api/outJson',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({name:output , data: out})
            });
            const ans = await temp.json();   
            console.log(ans);
            setSound(1);
        }
    }

    const resetpage = () => {
        setProcedure([]);
        setInputFileName("--ファイル選択--");
        setImage([]);
        setFlag([]);
        setOutput("");
        setSound(0);
    }

    const makeSound = async () => {
        const out = procedure.map((e, ind) => {return {...e, image: image[ind], flag: flag[ind]}});
        const text = out.filter((e, ind) => e.flag).map(e => e["詳細項目"]);
        const ind = [...Array(flag.length)].reduce((init, _, ind)=>{return flag[ind] ? [...init, ind] : [...init] },[]);

        const promisArr = text.map(e => {
          return fetch(`http://localhost:50021/audio_query?text=${e}&speaker=3`, {method:"POST"})
          .then(data => data.json())
          .then(query => fetch(`http://localhost:50021/synthesis?speaker=3&enable_interrogative_upspeak=true`,
          { method: "POST",
            headers: {"accept": "audio/wav", 'Content-Type': 'application/json'},
            responseType: 'arraybuffer',
            body: JSON.stringify(query)})
          .then(e => e.arrayBuffer())
          .then(buff => Buffer.from(buff)));
        });

        const output1 = await fetch("/api/makeDirectory",{
            method: "post", 
            'Content-type': "application/json", 
            body: JSON.stringify({filename : output})})
          .then(e => e.json());

        console.log(output1.body);
        console.log("これから時間がかかります。。。。。");

        const audioBuff = await Promise.all(promisArr).then(e => e);

        console.log("Audioファイルを作成します");
        for(let i = 0; i < audioBuff.length; i++){
            console.log(`${i+1}件目`);
            let test = await fetch("/api/makeSound",{
                method: "post", 
                'Content-type': "application/json", 
                body: JSON.stringify({ind: ind[i], filename : output, json: audioBuff[i]})})
              .then(e => e.json());
            console.log(test.body);
        };
        setSound(2);
    }

    const message1 = 
        <> 
            <h2 className={styles.h2} >マスタ設定が完了しました 🎉<br />続けて音声データを作成しますか？</h2><p className={styles.supple}>※この操作には時間がかかります</p>
            <div className={styles.btnArea}>
                <button className={styles.btn2} onClick={makeSound} >YES</button>
                <button className={styles.btn2} onClick={()=>{resetpage(); setSound(0)}} >NO</button>
            </div>
        </>;

    const message2 = 
        <> 
            <h2 className={styles.h2} >🎊 音声データ完成！！ 🎊<br/>元のページに戻ります⭐️</h2>
            <div className={styles.btnArea}>
                <button className={styles.btn2} onClick={resetpage} >OK</button>
            </div>
        </>;

    const viewPhoto = (e) => {
        setPhotoView(window.URL.createObjectURL(image[e.currentTarget.id]));
    }



    return (
        <>
        {/* あとでコンポーネント化① */}
            <article className={sound === 0 ? styles.PPmessage : `${styles.PPmessage} ${styles.open}` } >
                <div ref = {messe}>
                   {sound === 1 ? message1 :message2}
                </div>
            </article>

        {/* あとでコンポーネント化② */}
        {photoView && 
            <article className={ `${styles.PPmessage2} ${styles.open}`} onClick={()=>{setPhotoView(false)}} >
                <p className={styles.closeText}>×クリックで閉じる</p>
                <img className={styles.PPPhoto} src={photoView}></img>
            </article> 
        }
   
        {/* あとでコンポーネント化③ */}
            { procedure.length === 0 && <img src="/systemImage/background3.jpeg" className={styles.background}></img> }
   
            <Layout page="1">
                <section className={styles.contentArea}>
                    { procedure.length !== 0 && <div className={styles.spacer}></div>}
                    <ul>
                        {/* あとでコンポーネント化④ */}
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
                                <label>
                                    <p className={styles.move}>︙︙</p>
                                </label>
                                {flag[ind]
                                    ? <img src="/systemImage/mic-on.png"  className={styles.icon} id={ind} onClick={changeFlag}></img>
                                    : <img src="/systemImage/mic-off.png" className={styles.icon} id={ind} onClick={changeFlag}></img>
                                }
                                <input type="text" value = {procedure[ind]["詳細項目"]} className={flag[ind] ? styles.content : `${styles.content} ${styles.notRead}`} name="cont" onChange={changeInput} id={ind} />
                                <h5 className={styles.sub}>image<a>：</a></h5>
                                <label className= {flag[ind] ? styles.selectbox : `${styles.selectbox} ${styles.notRead}`}>
                                    <input type="file" accept=".jpg, .png" className={styles.hidden} onChange={changeImage} id={ind}/> {/*  */}
                                    <p className={styles.file}>{image[ind].name || "未選択"}</p>
                                </label>
                                <img src="/systemImage/camera.png" className={styles.icon3} onClick={viewPhoto} id={ind} ></img>
                                <img src="/systemImage/plus.png" className={styles.icon4} onClick={addRow} id={ind} ></img>
                                <img src="/systemImage/minus.png" className={styles.icon4} onClick={deleteRow} id={ind} ></img>
                            </li>
                            </React.Fragment>
                        )})
                }
                </ul>
                </section>
                <section className={styles.tail}>
                    <h3 className={styles.sub2}>input：</h3>
                    <label className={styles.selectFile}>
                        <input type="file" accept=".xlsx"  className={styles.hidden} id="test" onChange={sampleFunc}/> 
                        <p className={styles.file}>{inputFileName}</p>
                    </label>
                    <h3 className={styles.sub2}>output：</h3>
                    <input type="text" className={styles.outFileName} value={output} onChange={(e)=> setOutput(e.currentTarget.value)}/> 
                    <img src='/systemImage/upload.png' className={styles.icon2}  onClick={outputJson} ></img>
                </section>
            </Layout>
        </>
    );
}