
import { MongoClient, ServerApiVersion, Collection } from "mongodb";

const uri: string | undefined = process.env.MONGO_URI;
if (!uri) throw new Error("Please define MONGO_URI in .env");


export const client: MongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbName = "mealmaster";



export const dbconnection = async <T extends object = {}>(cname: string): Promise<Collection<T>> => {


  return client.db(dbName).collection<T>(cname);
};