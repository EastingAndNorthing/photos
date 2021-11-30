import mongoose from 'mongoose';
import { getConfig } from '../config';

export default (dbUrl: string) => {

    const connect = () => {
        mongoose
            .connect(
                dbUrl,
                { 
                    dbName: getConfig('dbName'),
                    // useNewUrlParser: true
                }
            )
            .then(() => {
                return console.info(`Successfully connected to ${dbUrl}`);
            })
            .catch(error => {
                console.error('Error connecting to database: ', error);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on('disconnected', connect);
};