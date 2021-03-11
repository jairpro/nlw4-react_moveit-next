import { NowRequest, NowResponse } from "@vercel/node";
import getFBUserName from "../services/fb/userName";
import { getGithubUser } from "../services/github/user";
import { requestToToken } from "../utils/requestToToken";

export default async (request: NowRequest, response: NowResponse) => {

  //console.log('request.headers: ', request.headers)

  const token = requestToToken(request)

  if (!token) {
    return {
      status: 401,
      error: 'Token not provided!',
    }
  }

  const { plataform } = request.body

  let responseUser: any

  switch (plataform) {
    case 'fb':
      responseUser = await getFBUserName(token)
      break
    
    case 'github':
      responseUser = await getGithubUser({
        access_token: token,
        scope: '',
        token_type: 'bearer'
      })
      break

    default:
      break
  }

  //console.log('responseUser: ', responseUser)

  if (!responseUser) {
    return {
      status: 401,
      error: 'Token invalid!',
    }  
  }

  return token
}