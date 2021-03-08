import { NowRequest, NowResponse } from "@vercel/node";
import { compareSync } from 'bcryptjs';
import { connectToDatabase } from "../../services/mongodb";
import { JwtSign } from "../../utils/jwt";

export default async (request: NowRequest, response: NowResponse) => {
  const { login, password } = request.body

  const db = await connectToDatabase(process.env.MONGODB_URI)

  const collection = db.collection('users')

  const user = await collection.findOne({ login })

  if (!user) {
    return response.status(401).json({ error: 'Access denied!' })
  }

  const { hash } = user

  const match = compareSync(password, hash)

  if (!match) {
    return response.status(401).json({ error: 'Password does not match!'} )
  }
  
  const { _id: id } = user

  return response.json({
    token: JwtSign({ id })
  })
}