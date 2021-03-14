import { NowRequest, NowResponse } from "@vercel/node";
import { getFbUser } from "../../../services/fb/user";
import { requestToToken } from "../../../utils/requestToToken";

export default async (request: NowRequest, response: NowResponse) => {
  const { userID } = request.body

  const accessToken = requestToToken(request)

  if (!accessToken) {
    return response.status(401).json({ error: 'Token not provided' })
  }

  const result = getFbUser({
    accessToken,
    userID,
  })

  if (!result) {
    return response.status(401).json({ error: 'Fail to request user from Facebook!' })
  }

  return response.json(result)
}