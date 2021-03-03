import { NowRequest, NowResponse } from "@vercel/node";
import { connectToDatabase } from '../../services/mongodb'

export default async (request: NowRequest, response: NowResponse) => {
  const { user, score } = request.body
  const { login } = user

  //console.log('salvando...')

  const db = await connectToDatabase(process.env.MONGODB_URI)

  const collection = db.collection('practitioners')

  const updatedUser = await collection.updateOne(
    { login }, {
      $set: { score }
    }
  )

  if (!updatedUser || updatedUser.result.nModified===0) {
    const newUser = await collection.insertOne({
      login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      plataform: user.plataform,
      score,
      subscribedAt: new Date(),
    })

    return response.status(201).json(newUser)
  }

  return response.status(201).json(updatedUser)
}