import { Collection, Db, Document, MongoClient } from 'mongodb';
import env from '../../main/config/env';

class MongoHelper {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    async connect(uri: string): Promise<MongoClient> {
        this.client = await MongoClient.connect(uri, {});
        this.db = this.client.db();
        return this.client;
    }

    async getCollection(name: string): Promise<Collection<Document>> {
        if (!this.client || !this.db) {
            await this.connect(env.mongoUrl);
        }
        return this.db!.collection(name);
    }

    async disconnect(): Promise<void> {
        if (!this.client) return;
        await this.client.close();
    }
}

export default new MongoHelper();