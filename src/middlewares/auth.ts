import { NowRequest, NowResponse } from "@vercel/node";
import { getGithubUser } from "../services/github/user";

export default async (request: NowRequest, response: NowResponse) => {

  //console.log('request.headers: ', request.headers)

  const { authorization } = request.headers
  

  if (!authorization) {
    return {
      status: 401,
      error: 'Token not provided!',
    }
  }

  const [, token] = authorization.split(" ")

  if (!token) {
    return {
      status: 401,
      error: 'Token is empty!',
    }
  }

  const responseUser = await getGithubUser({
    access_token: token,
    scope: '',
    token_type: 'bearer'
  })

  //console.log('responseUser: ', responseUser)

  if (!responseUser) {
    return {
      status: 401,
      error: 'Token invalid!',
    }  
  }

  return true
}