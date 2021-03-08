import axios, { AxiosResponse } from "axios"
import { GithubAccessTokenResponse } from "../../github/accessToken"

/*export interface GithubAccessTokenResponse {
  login: string
  id: string
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: string
  name: string
  company: object
  blog: string
  location: string
  email: string
  hireable: object
  bio: string
  twitter_username: object
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: Date
  updated_at: Date
}
*/
export interface ApiGithubUserResponse {
  login: string
  avatar_url: string
  name: string
  email: string
}

export async function getApiGithubUser(data: GithubAccessTokenResponse): Promise<ApiGithubUserResponse> {
  try {
    //console.log('data em getGithubUser:', data)
    
    const response: AxiosResponse = await axios.post('/api/github/user', data)

    //console.log('/api/github/user response: ', response)

    if (response && response.data) {
      return response.data
    }
  }
  catch (error) {
    console.log('Erro ao chamar /api/github/user: ', error)
  }

  return null
}
