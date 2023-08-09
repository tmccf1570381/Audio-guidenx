export default async function read(filename){
    // const filename = "audio-guide";
    const data = await require(`./fakeDB/${filename}.json`)
    return data;
}
