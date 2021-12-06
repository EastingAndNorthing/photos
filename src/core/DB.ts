import mongoose from 'mongoose';
import { getConfig } from '../config';

export default () => {

    const connect = () => {
        mongoose
            .connect(
                getConfig('dbUrl'),
                {
                    dbName: getConfig('dbName'),
                    // useNewUrlParser: true
                }
            )
            .then(() => {
                return console.info(`Successfully connected to ${getConfig('dbUrl')}`);
            })
            .catch(error => {
                console.error('Error connecting to database: ', error);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on('disconnected', connect);
};