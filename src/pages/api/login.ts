import { NowRequest, NowResponse } from '@vercel/node'
import { connectToDatabase } from '../../services/mongodb'

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