import { NowRequest, NowResponse } from "@vercel/node";
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../config/auth';
import { getGithubUser } from "../services/github/user";

//type JwtVerifyData = (token: string, secretOrPublicKey: Secret, options?: VerifyOptions) => object | string 

export default async (request: NowRequest, response: NowResponse) => {

  console.log('request.headers: ', request.headers)

  const { authorization } = request.headers
  

  if (!authorization) {
    //return response.status(401).json({ error: 'Token not provided!' })
    //return false
    return {
      status: 401,
      error: 'Token not provided!',
    }
  }

  const [, token] = authorization.split(" ")

  /*if (!token) {
    //return response.status(401).json({ error: 'Token is empty!' })
    //return false
    return {
      status: 401,
      error: 'Access is empty!',
    }
  }*/

  const responseUser = await getGithubUser({
    access_token: token,
    scope: '',
    token_type: 'bearer'
  })

  console.log('responseUser: ', responseUser)

  return responseUser !== false || {
    status: 401,
    error: 'Token invalid!',
  }  

  /*
  try {
    //const decoded = await promisify(jwt.verify)(token, authConfig.secret)
    const decoded = await promisify(jwt.verify)(token, authConfig().secret)

    console.log(decoded)

    //return response.json('ok')
    //return next(request, response)
    return true
  }
  catch (error) {
    //console.log('Erro na validação do Token: ', error)
    //return response.status(401).json({ error: 'Token invalid!' })
    //return false
    return {
      status: 401,
      error: 'Token invalid!',
    }
  }
  */
}