import {Client, QueryResult} from "pg";
import {Service} from "typedi";

const {
    PG_HOST,
    PG_PORT,
    PG_DATABASE,
    PG_USERNAME,
    PG_PASSWORD,
} = process.env;

@Service()
export default class Database {

    private readonly client: Client;
    private isConnected = false;

    constructor() {
        this.client = new Client({
            user: PG_USERNAME,
            host: PG_HOST,
            database: PG_DATABASE,
            password: PG_PASSWORD,
            port: Number(PG_PORT) || 5432,
            connectionTimeoutMillis: 60 * 1000
        });
    }

    async init() {
        if (!this.isConnected) {
            try {
                await this.client.connect();
                this.isConnected = true;
                console.log("Application was successfully connected to DB.")
            } catch (e) {
                console.log(e);
            }
        }
    }

    async closeConnection() {
        try {
            await this.client.end();
            this.isConnected = false;
            console.log("Connection was closed.");
        } catch (e) {
            console.error(e);
        }
    }

    query<T>(text: string, params?: any[]): Promise<QueryResult<T>> {
        return this.client.query(text, params);
    }
}
