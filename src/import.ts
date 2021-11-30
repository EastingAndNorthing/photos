import fs from "fs"
import connect from "./core/DB";
import { getConfig } from "./config";
import { Importer } from "./core/Importer"

async function f() {

    connect(getConfig('dbUrl'));

    const m = new Importer(getConfig('dataPath'));
    
    const albums = await m.findAlbums();

    console.log({ albums });

    m.import(albums[0]);

}
f()
