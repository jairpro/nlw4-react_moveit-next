import { NowRequest, NowResponse } from "@vercel/node";
import authMiddleware from '../../middlewares/auth';
import { connectToDatabase } from '../../services/mongodb';

export default async (request: NowRequest, response: NowResponse) => {
  const { user } = request.body
  const { login } = user

  const auth = await authMiddleware(request, login)

  if (!auth.token) {
    return response.status(auth.status).json({ error: auth.error })
  }

  const { score } = request.body

  const db = await connectToDatabase(process.env.MONGODB_URI)

  const collection = db.collection('practitioners')

  const updatedCursor = await collection.findOneAndUpdate(
    { login }, {
      $set: { score }
    }
  )

  //console.log('updatedCursor: ', updatedCursor)

  if (!updatedCursor || !updatedCursor.value) {
    const newCursor = await collection.insertOne({
      login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      plataform: user.plataform,
      score,
      subscribedAt: new Date(),
    })

    //console.log('newCursor: ', newCursor)

    const newUser = newCursor.ops[0]

    return response.status(201).json(newUser)
  }

  const updatedUser = updatedCursor.value

  return response.status(200).json(updatedUser)
}