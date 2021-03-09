import Cookies from 'js-cookie'
import { createContext, ReactNode, useEffect, useState } from "react"
import Loader from '../components/Loader'
import Login from "../pages/Login"
import { getApiGithubAccessToken } from '../services/api/github/accessToken'
import { getApiGithubUser } from '../services/api/github/user'
import getApiLogin from '../services/api/login'
import { ChallengesProvider, ScoreData } from './ChallengesContext'
import { MongoPratitionersData } from './RankingContext'

export interface ExecuteLoginData {
  token: string
  userLogin: string
  success?: (user: MongoPratitionersData) => void
  fail?: (data?: any) => void
}

interface LoginContextData {
  login: string
  name: string
  avatarUrl: string
  plataform: string // 'github' | 'facebook' | 'google'
  isLogged: boolean
  hasLogged: boolean
  isLoading: boolean
  token: string
  newScore: ScoreData
  executeLogin: (data: ExecuteLoginData) => Promise<boolean>
  executeLogout: () => void
  resetNewScore: () => void
  updateNewScore: (score: ScoreData) => void
}

interface LoginProviderProps {
  children: ReactNode
  login: string
  isLogged: boolean
  score: ScoreData
  token: string
}

export const LoginContext = createContext({} as LoginContextData)

// Para testes:
//import leaderboardJson from '../../leaderboard.test.json'


export function LoginProvider({ children, ...rest }: LoginProviderProps) {
  const [login, setLogin] = useState(rest.login ?? '')
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [plataform, setPlataform] = useState('')
  const [isLogged, setIsLogged] = useState(rest.isLogged ?? false)
  const [hasLogged, setHasLogged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(rest.token)
  const [newScore, setNewScore] = useState(null)
  
  async function init() {

    function redirect() {
      window.location.href = window.location.href.substr(0,window.location.href.indexOf('?')-1)
    }

    //console.log('LoginContext useEffect mount init')
    
    if (rest.token) {
        //setHasLogged(true)
      return
    }
    setIsLoading(true)

    const { search } = window.location
    const urlParams = new URLSearchParams(search);
    
    const code = urlParams.get('code')
    
    if (!code) {
      setIsLoading(false)
      return
    }
    
    const responseToken = await getApiGithubAccessToken(code)
    
    if (!responseToken) {
      setIsLoading(false)
      redirect()
      return
    }
    
    const { access_token } = responseToken
    
    if (!access_token) {
      setIsLoading(false)
      redirect()
      return
    }

    //console.log('access_token: ', access_token)

    setToken(access_token)

    Cookies.set('token', access_token)
    
    const responseUser = await getApiGithubUser(responseToken)
    
    if (!responseUser) {
      setIsLoading(false)
      redirect()
      return
    }
    
    setLogin(responseUser.login)
    setName(responseUser.name)
    setAvatarUrl(responseUser.avatar_url)
    
    if (responseUser.login) {
      setIsLogged(true)
    }

    setIsLoading(false)
    redirect()
  }

  useEffect(function mount() {
    init()
  }, [])

  useEffect(() => {
    Cookies.set('login', login, {
      sameSite: 'Lax',
    })

    Cookies.set('isLogged', String(isLogged), {
      sameSite: 'Lax',
    })

  }, [login, isLogged])

  async function executeLogin(data: ExecuteLoginData)  {
    const hasLoading = isLoading

    //console.log('execute login')

    setIsLoading(true)

    const finalize = () => {
      if (!hasLoading) {
        setIsLoading(false)
      }
    }

    const response: MongoPratitionersData = await getApiLogin(data)

    //console.log('executeLogin response: ', response)

    if (!response) {
      setToken('')
      Cookies.remove('token')
      setIsLogged(false)
      setHasLogged(false)

      if (data.fail) data.fail()
      finalize()
      return false
    }

    setLogin(response.login)
    setName(response.name)
    setAvatarUrl(response.avatarUrl)
    setPlataform(response.plataform)
    setHasLogged(true)
    setIsLogged(true)

    //console.log('setNewScore on executeLogin')
    setNewScore(response.score)

    if (data.success) data.success(response)
    
    finalize()

    return true
  }

  function executeLogout() {
    setIsLogged(false)
  } 

  function resetNewScore() {
    setNewScore(null)
  }

  function updateNewScore(score: ScoreData) {
    //console.log('update new score')
    
    setNewScore(score)
  }

  return (
    <LoginContext.Provider value={{
      login,
      name,
      avatarUrl,
      plataform,
      isLogged,
      hasLogged,
      isLoading,
      token,
      newScore,
      executeLogin,
      executeLogout,
      resetNewScore,
      updateNewScore,
    }}>
      <ChallengesProvider score={rest.score}>
        { isLoading
          ? (<Loader />)
          : ( isLogged 
            ? ( children) 
            : ( <Login /> )
          )
        }
      </ChallengesProvider>
    </LoginContext.Provider>
  )
}