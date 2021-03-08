import axios from 'axios'

interface GithubAuthorizeData {
  client_id: string
  redirect_uri?: string
  login: string
  scope?: string
  state: string
  allow_signup?: string
}
export async function githubAuthorize(data: GithubAuthorizeData) {
  //console.log('githubAuthorize data:', data)
  
  try {
    const response = await axios.get('https://github.com/login/oauth/authorize', { data })

    if (!response) {
      return false
    }

    return response
  }
  catch(error) {
    console.log('Erro ao tentar autorizar no Github')
    return false
  }
}