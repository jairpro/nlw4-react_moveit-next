import axios, { AxiosResponse } from 'axios'

export interface GithubAcessTokenData {
  client_id: string
  client_secret: string
  code: string
  redirect_uri?: string
  state?: string
}

export interface GithubAccessTokenResponse {
  access_token: string
  scope: string
  token_type: string
}

export async function getGithubAccessToken(data: GithubAcessTokenData) {
  //console.log('githubAuthorize data:', data)
  
  try {
    const response: AxiosResponse = await axios.post('https://github.com/login/oauth/access_token', data)

    /*console.log('axios.post github acess_token resposta: ', {
      status: response.status,
      data: response.data
    })
    */

    if (!response) {
      return false
    }

    return response
  }
  catch(error) {
    //console.log('Erro ao solicitar token de acesso no Github: ', error)
    console.log('Erro ao solicitar token de acesso no Github: ', error.message)
    return false
  }
}