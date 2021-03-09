import axios, { AxiosResponse } from 'axios'
import { GithubAccessTokenResponse } from './accessToken'

export interface GitHubUserData {
  scope: string
}

export async function getGithubUser(accesToken: GithubAccessTokenResponse) {
  //console.log('getGithubUser args:', args)

  const data: GitHubUserData = {
    scope: accesToken.scope
  } 

  const headers: any = {}
  if (accesToken.token_type === 'bearer') {
    headers.Authorization = `Bearer ${accesToken.access_token}`
  }

  try {
    const response: AxiosResponse = await axios.get('https://api.github.com/user', {
      headers,
      data,
    })

    if (!response) {
      console.log('Sem resposta ao solicitar dados do usuário do Github: ')

      return false
    }

    /*console.log('axios.get https://api.github.com/user resposta: ', {
      status: response.status,
      data: response.data
    })*/
    
    return response
  }
  catch(error) {
    console.log('error: ', error)
    console.log('Erro ao solicitar dados do usuário do Github | error.message: ', error.message)
    console.log('error.response.data: ', error.response.data)
    return false
  }
}