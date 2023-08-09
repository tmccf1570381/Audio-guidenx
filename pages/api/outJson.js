import fs from "fs";
  
export default function createFile (req, res) {
    res.status(200);
    const toJSON = JSON.stringify(req.body.data);
    fs.writeFile(`./pages/api/fakeDB/${req.body.name}.json`, toJSON, (err) => {
        if (err) rej(err);
    });
    res.send({response:"JSONファイルを生成しました"});
};