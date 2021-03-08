import { NowRequest, NowResponse } from '@vercel/node'
import { githubAuthorize } from '../../../services/github'

export default async (request: NowRequest, response: NowResponse) => {
  const { login } = request.body

  //console.log(process.env)

  //return response.json("ok")
  
  const githubResponse = await githubAuthorize({
    client_id: process.env.AUTH_GITHUB_CLIENT_ID,
    redirect_uri: process.env.AUTH_GITHUB_REDIRECT_URI,
    login,
    state: process.env.AUTH_GITHUB_STATE,
  }) 

  if (!githubResponse) {
    return response.status(500).json({ error: 'Github autorization request fail!' })
  }
  
  const { data } = githubResponse
  if (!data) {
    return response.status(500).json({ error: 'No result data!' })
  }

  //console.log('Resposta da solicitação de autorização do Github: ', githubResponse)

  return response.send(data)
}
