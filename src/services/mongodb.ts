import { MongoClient, Db } from 'mongodb'
import url from 'url'

let cachedDB: Db = null

export async function connectToDatabase(uri: string) {
  if (cachedDB) {
    return cachedDB
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  //const dbName = 'moveit'
  const dbName = url.parse(uri).pathname.substr(1)

  const db = client.db(dbName)

  cachedDB = db

  return db
}

