const fs = require('fs');
  
export default async function (req, res) {
    const sound = await JSON.parse(req.body);
    const filename = sound.filename;
    console.log(sound);





    const input = await Buffer.from(sound.json.data)
    console.log("-------------------------------------処理を開始します");
    console.log(input);
    fs.writeFileSync(`public/mp3/${filename}/${sound.ind}.mp3`, input);

    // const input= await sound.json.map(e => {
    //     return Buffer.from(e.data);
    // })
    // input.map((e,ind) => {
    //     fs.writeFileSync(`public/mp3/${filename}/${sound.ind[ind]}.mp3`, e);
    // })

    res.status(200);
    res.send({body:"完了！"})
};
