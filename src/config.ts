import { isMainThread} from 'worker_threads';
import { resolve } from "path"
import { config } from "dotenv"

// @TODO check if import statement already equals 'require_once' so singleton can be omitted
export function getConfig(key: string) {
    const config = Configuration.getInstance();

    return config.vars[key];
}

export class Configuration {

    vars: any;

    private static instance: Configuration;
    
    public static getInstance(): Configuration {
        if (!Configuration.instance) Configuration.instance = new Configuration();
        return Configuration.instance;
    }

    constructor() {

        const args = require('minimist')(process.argv.slice(2));

        args.env !== 'prod' ?
            config({ path: resolve(__dirname, '../.env.dev') }) :
            config({ path: resolve(__dirname, '../.env.prod') });

        this.vars = {
            env: args.env                   || process.env.ENV          || 'dev',
            dataPath: args.dataPath         || process.env.dataPath     || './storage',
            // threads: args.threads           || process.env.threads      || 6,
            
            dbUrl: args.dbUrl               || process.env.dbUrl        || 'mongodb://localhost:27017',
            dbName: args.dbName             || process.env.dbName       || 'photos',
            dbAlbums: args.dbAlbums         || process.env.dbAlbums     || 'albums',
            dbPhotos: args.dbPhotos         || process.env.dbPhotos     || 'photos',

            port: args.port || process.env.port || 3000,
        }

        Object.keys(args).forEach((key) => {
            if (!this.vars.hasOwnProperty(key)) {
                this.vars[key] = args[key];
            }
        });

        if (isMainThread) {

            let overview: any = {};
            Object.keys(this.vars).forEach((key) => {
                overview[key] = (this.vars[key].length > 24) ? this.vars[key].substr(0, 24-1) + '...' : this.vars[key];
            });
            console.table(overview);
  
        }
    }
    
}
