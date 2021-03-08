import { NowRequest, NowResponse } from '@vercel/node'
import { getGithubAccessToken, GithubAcessTokenData } from '../../../services/github/accessToken'

export default async (request: NowRequest, response: NowResponse) => {
  //console.log('request.body: ',request.body)
  const { code, state } = request.body

  const data: GithubAcessTokenData = {
    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: process.env.REACT_APP_GITHUB_REDIRECT_URI,
    state: state ?? '',
  }

  //console.log('dados envio: ', data)

  const result: any = await getGithubAccessToken(data)

  if (!result || !result.data) {
    return response.status(401).json({ error: "Github access token error!" })
  }

  /*console.log('acessToken resposta: ', {
    status: result.status,
    data: result.data
  })*/

  return response.json(result.data)
}