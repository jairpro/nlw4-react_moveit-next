import { NowRequest, NowResponse } from "@vercel/node";
import { compareToSortLeaderboard } from "../../contexts/RankingContext";
import { connectToDatabase } from "../../services/mongodb";
import authMiddleware from '../../middlewares/auth'

export default async (request: NowRequest, response: NowResponse) => {

  const auth = await authMiddleware(request, response)

  if (typeof auth === 'object') {
    return response.status(auth.status).json({ error: auth.error })
  }

  const db = await connectToDatabase(process.env.MONGODB_URI)

  const collection = db.collection('practitioners')

  const cursor = collection.find({})

  const result = await cursor.toArray()

  result.sort(compareToSortLeaderboard)

  return response.json(result)
}