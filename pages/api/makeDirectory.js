const fs = require('fs');
const extra = require('fs-extra');

export default async function (req, res) {
    console.log("フォルダを作成します");
    const reqbody = await JSON.parse(req.body);
    const filename = reqbody.filename;

    if(fs.existsSync(`public/mp3/${filename}`)){
        extra.removeSync(`public/mp3/${filename}`,(err) => {
            if (err) throw err;        
            console.log('a ディレクトリを削除しました');
        });
        fs.mkdirSync(`public/mp3/${filename}`, (err) => {
            if (err) { throw err; }
            console.log('testディレクトリが作成されました');
        });
    }else{
        fs.mkdirSync(`public/mp3/${filename}`, (err) => {
            if (err) { throw err; }
            console.log('testディレクトリが作成されました');
        });
    }

    res.status(200);
    res.send({body:"フォルダが新規作成されました"})
}
