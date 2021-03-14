import { NowRequest } from "@vercel/node";
import getFBUserName from "../services/fb/userName";
import { getGithubUser } from "../services/github/user";
import { requestToToken } from "../utils/requestToToken";

export default async (request: NowRequest, userID: string) => {

  let result: any = {}

  //console.log('request.headers: ', request.headers)

  const token = requestToToken(request)

  
  if (!token) {
    return {
      status: 401,
      error: 'Token not provided!',
    }
  }

  result.token = token

  const { plataform } = request.body

  let responseUser: any

  switch (plataform) {
    case 'fb':
      responseUser = await getFBUserName({
        accessToken: token,
        userID,
      })
      result.userFB = responseUser
      break
    
    case 'github':
      responseUser = await getGithubUser({
        access_token: token,
        scope: '',
        token_type: 'bearer'
      })
      result.userGithub = responseUser
      break

    default:
      return {
        status: 401,
        error: 'Plataform not provided!'
      }
  }

  //console.log('responseUser: ', responseUser)

  if (!responseUser) {
    return {
      status: 401,
      error: 'Token invalid!',
    }  
  }

  return result
}