import { MongoClient, ServerApiVersion } from "mongodb"
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("Missing MONGODB_URI env var. Add it in Project Settings > Environment Variables.")
}

export const clientPromise: Promise<MongoClient> =
  global.__mongoClientPromise ??
  new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }).connect()

if (process.env.NODE_ENV !== "production") {
  global.__mongoClientPromise = clientPromise
}

export async function getDb() {
  const dbName = process.env.MONGODB_DB_NAME
  if (!dbName) {
    throw new Error("Missing MONGODB_DB_NAME env var. Set your database name.")
  }
  const client = await clientPromise
  return client.db(dbName)
}
