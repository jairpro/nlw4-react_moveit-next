import { NowRequest, NowResponse } from "@vercel/node";
import getFbUserName from "../../../services/fb/userName";
import getFbUserPicture from "../../../services/fb/userPicture";
import { requestToToken } from "../../../utils/requestToToken";

export interface ApiFbUserResponse {
  id: string
  name: string
  pictureUrl: string
}

export default async (request: NowRequest, response: NowResponse) => {
  const { userID } = request.body

  const token = requestToToken(request)

  if (!token) {
    return response.status(401).json({ error: 'Token not provided' })
  }

  const user = await getFbUserName(token)

  if (!user) {
    return response.status(401).json({ error: 'Fail to request user from Facebook!' })
  }

  const picture = await getFbUserPicture({
    accessToken: token,
    userID,
  })

  const result: ApiFbUserResponse = {
    id: user.id,
    name: user.name,
    pictureUrl: (picture && picture.url) ?? '', 
  }

  return response.json(result)
}