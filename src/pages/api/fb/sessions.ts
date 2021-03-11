import { NowRequest, NowResponse } from "@vercel/node";
import getFBUserName from "../../../services/fb/userName";
import authMiddleware from '../../../middlewares/auth'

export default async (request: NowRequest, response: NowResponse) => {
  const auth = await authMiddleware(request, response)

  if (typeof auth === 'object') {
    return response.status(auth.status).json({ error: auth.error })
  }

  const user = await getFBUserName(auth)

  if (!user) {
    return response.status(401).json({ error: 'Invalid Token!' })
  }

  return response.json({
    name: user.name,
  })
}