import { NowRequest, NowResponse } from "@vercel/node";
import { connectToDatabase } from '../../services/mongodb'

export default async (request: NowRequest, response: NowResponse) => {
  const { login, level, currentExperience, challengesCompleted } = request.body

  console.log('salvando...')

  const db = await connectToDatabase(process.env.MONGODB_URI)

  const collection = db.collection('practitioners')

  const updatedUser = await collection.updateOne(
    { login }, {
      $set: {
        score: {
          level,
          currentExperience,
          challengesCompleted,
        }
      }
    }
  )

  if (!updatedUser) {
    return response.status(400).json({
      error: 'Error on update practitioner!'
    })
  }

  return response.status(201).json(updatedUser)
}