import { NowRequest, NowResponse } from "@vercel/node";
import authMiddleware from '../../middlewares/auth';
import { connectToDatabase } from '../../services/mongodb';

export default async (request: NowRequest, response: NowResponse) => {
  const auth = await authMiddleware(request, response)

  if (typeof auth === 'object') {
    return response.status(auth.status).json({ error: auth.error })
  }

  const { user, score } = request.body
  const { login } = user

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

    console.log('newCursor: ', newCursor)

    const newUser = newCursor.ops[0]

    return response.status(201).json(newUser)
  }

  const updatedUser = updatedCursor.value

  return response.status(200).json(updatedUser)
}