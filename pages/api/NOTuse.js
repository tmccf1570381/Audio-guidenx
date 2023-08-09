// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let XLSX = require('xlsx');
import fs from "node:fs"

const path = "./public/sample.xlsx";

async function read(path){
    let workbook = XLSX.readFile(path)
    let data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    return data;
}

export default async function handler(req, res) {
    const i = await read(path);
    res.status(200).send(i)
}




