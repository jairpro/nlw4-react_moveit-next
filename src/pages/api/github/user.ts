import { NowRequest, NowResponse } from '@vercel/node'
import { GithubAccessTokenResponse } from '../../../services/github/accessToken'
import { getGithubUser } from '../../../services/github/user'

export default async (request: NowRequest, response: NowResponse) => {
  //console.log('request.body: ',request.body)
  const data = request.body as GithubAccessTokenResponse

  //console.log('dados envio: ', data)

  const result: any = await getGithubUser(data)

  if (!result || !result.data) {
    return response.status(401).json({ error: "Github user error!" })
  }

  /*console.log('Github user resposta: ', {
    status: result.status,
    data: result.data
  })*/
  
  return response.json(result.data)
}