import { Client, QueryResult } from "pg";
import { Service } from "typedi";

const {
    PG_HOST,
    PG_PORT,
    PG_DATABASE,
    PG_USERNAME,
    PG_PASSWORD,
} = process.env;

const client = new Client({
    user: PG_USERNAME,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: Number(PG_PORT) || 5432,
    connectionTimeoutMillis: 60 * 1000
});

client.connect().catch(console.error);

@Service()
export default class Database {

    query<T>(text: string, params: any[]): Promise<QueryResult<T>>  {
        return client.query(text, params);
    }
}
