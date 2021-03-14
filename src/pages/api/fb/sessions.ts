import { NowRequest, NowResponse } from "@vercel/node";
import getFBUserName from "../../../services/fb/userName";
import authMiddleware from '../../../middlewares/auth'

export default async (request: NowRequest, response: NowResponse) => {
  const { userID } = request.body

  const auth = await authMiddleware(request, userID)

  if (!auth.token) {
    return response.status(auth.status).json({ error: auth.error })
  }

  const user = await getFBUserName(auth.token)

  if (!user) {
    return response.status(401).json({ error: 'Invalid Token!' })
  }

  return response.json({
    name: user.name,
  })
}