import { NowRequest, NowResponse } from "@vercel/node";
import { compareToSortLeaderboard } from "../../contexts/RankingContext";
import { connectToDatabase } from "../../services/mongodb";

export default async (_: NowRequest, response: NowResponse) => {

  const db = await connectToDatabase(process.env.MONGODB_URI)

  const collection = db.collection('practitioners')

  const cursor = collection.find({})

  const result = await cursor.toArray()

  result.sort(compareToSortLeaderboard)

  return response.json(result)
}