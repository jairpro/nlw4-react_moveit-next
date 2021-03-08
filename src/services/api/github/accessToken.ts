import axios, { AxiosResponse } from "axios"
import { GithubAccessTokenResponse } from "../../github/accessToken"

/*export type GenerateGithubTokenData = boolean | {
  access_token: string
  scope: string
  token_type: string
}*/

export async function getApiGithubAccessToken(code: string): Promise<GithubAccessTokenResponse> {
//export async function getApiGithubAccessToken(code: string) {
  try {
    //console.log('code em generateGithubToken:', code)
    
    const response: AxiosResponse = await axios.post('/api/github/token', {
      code
    })

    //console.log('/api/github/token response: ', response)

    if (response && response.data) {
      const params = new URLSearchParams(response.data);

      const data: GithubAccessTokenResponse = {
        access_token: params.get('access_token'),
        scope: params.get('scope'),
        token_type: params.get('token_type'),
      }

      return data
    }
  }
  catch (error) {
    console.log('Erro ao chamar /api/github/token: ', error)
  }

  return null
}
