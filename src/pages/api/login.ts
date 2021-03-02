import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient, Db } from 'mongodb'
import url from 'url'


let cachedDB: Db = null

async function connectToDatabase(uri: string) {
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

export default async (request: NowRequest, response: NowResponse) => {
  const { user } = request.body

  //return response.json(user)
  
  const db = await connectToDatabase(process.env.MONGODB_URI)

  const collection = db.collection('practitioners')

  const dbUser = await collection.findOne({
    login: user.login
  })

  if (!dbUser) {
    const newUser = await collection.insertOne({
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      plataform: user.plataform,
      subscribedAt: new Date(),
    })

    //return response.status(201).json({ ok: true })
    return response.status(201).json(newUser)
  }

  return response.json(dbUser)
}