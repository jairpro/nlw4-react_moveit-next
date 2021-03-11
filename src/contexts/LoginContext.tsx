import Cookies from 'js-cookie'
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import Loader from '../components/Loader'
import Login from "../pages/Login"
import api from '../services/api'
import { getApiFbUser } from '../services/api/fb/user'
import { getApiGithubAccessToken } from '../services/api/github/accessToken'
import { getApiGithubUser } from '../services/api/github/user'
import getApiLogin from '../services/api/login'
import { ChallengesProvider } from './ChallengesContext'
import { MongoPratitionersData } from './RankingContext'
import { ScoreContext, ScoreData } from './ScoreContext'

export interface ExecuteLoginData {
  token: string
  userLogin: string
  plataform: string
  success?: (user: MongoPratitionersData) => void
  fail?: (data?: any) => void
}

export interface ExecuteLoginFBData {
  userID: string
  accessToken: string
}

export type SessionFbData = ExecuteLoginFBData

interface LoginContextData {
  login: string
  name: string
  avatarUrl: string
  plataform: string // 'github' | 'facebook' | 'google'
  isLogged: boolean
  hasLogged: boolean
  isLoading: boolean
  token: string
  executeLogin: (data: ExecuteLoginData) => Promise<boolean>
  executeLogout: () => void
  executeLoginFB: (data: ExecuteLoginFBData) => Promise<boolean>
  updatePlataform: (name: string) => void
  initSessionFB: (data: SessionFbData) => Promise<boolean>
}

interface LoginProviderProps {
  children: ReactNode
  login: string
  isLogged: boolean
  score: ScoreData
  token: string
  fbAppId?: string
  plataform: string
}

export const LoginContext = createContext({} as LoginContextData)

// Para testes:
//import leaderboardJson from '../../leaderboard.test.json'


export function LoginProvider({ children, ...rest }: LoginProviderProps) {
  const [login, setLogin] = useState(rest.login ?? '')
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [plataform, setPlataform] = useState(rest.plataform)
  const [isLogged, setIsLogged] = useState(rest.isLogged ?? false)
  const [hasLogged, setHasLogged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(rest.token)

  const { updateScore } = useContext(ScoreContext)

  async function initSessionFB(data: SessionFbData) {
    /*
    console.log('trata redirecionamento do facebook aqui')
    const { accessToken, userID } = data

    const user = getApiGithubUser

    if (rest.token) {
      console.log('Opa! já temos um token do facebook')
      return true
    }    
    */
    return true
  }

  async function initSessionGithub() {

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

    updateToken(access_token)

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

  function initSession() {
    switch (plataform) {
      case 'fb':
        break
      
      case 'github':
        initSessionGithub()
        break
      
      default:
        break
    }
  }

  useEffect(function mount() {
    initSession()
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
    //console.log('getApiLogin chamado de executeLogin')

    //console.log('executeLogin response: ', response)

    if (!response) {
      updateToken('')
      setIsLogged(false)
      setHasLogged(false)

      if (data.fail) data.fail()
      finalize()
      return false
    }
    
    updatePlataform(data.plataform)

    setLogin(response.login)
    setName(response.name)
    setAvatarUrl(response.avatarUrl)
    setHasLogged(true)
    setIsLogged(true)

    //console.log('setNewScore on executeLogin')
    updateScore(response.score)

    if (data.success) data.success(response)
    
    finalize()

    return true
  }

  function executeLogout() {
    setIsLogged(false)
    updateToken('')
    updatePlataform('')
  } 

  async function executeLoginFB(data: ExecuteLoginFBData) {
    const logged = await executeLogin({
      plataform: 'fb',
      userLogin: data.userID,
      token: data.accessToken,
      success: user => console.log('usuario logado na aplicação com Facebook: ',user),
      fail: ()=> console.log('Falha de login na aplicação com Facebook') 
    })
    
    if (!logged) {
      return false
    }
    
    setIsLoading(true)
    
    try {
      const { accessToken } = data
      
      const session = await getApiFbUser(data)
      
      if (session) {
        api.defaults.headers.Authorization = `Bearer ${accessToken}`

        console.log('executeLoginFB result:', session)
        
        updatePlataform('fb')
        setIsLogged(true)
        updateToken(accessToken)
        setLogin(session.id)
        setName(session.name)
        setAvatarUrl(session.pictureUrl)
        setIsLoading(false)

        /*executeLogin({
          plataform: 'fb',
          token: accessToken,
          userLogin: userID,
          success: user =>
        })*/

        return true
      }
    }
    catch (error) {
      console.log('executeLoginFB error: ', error)
    }

    updatePlataform('')
    setIsLoading(false)
    return false
  }

  function updatePlataform(value: string) {
    setPlataform(value)
    if (value) {
      Cookies.set('plataform', value, { sameSite: 'lax'} )
    }
    else {
      Cookies.remove('plataform')
    }
  }

  function updateToken(value: string) {
    setToken(value)
    if (value) {
      Cookies.set('token', value, { sameSite: 'Lax' })
    }
    else {
      Cookies.remove('token')
    }
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
      executeLogin,
      executeLogout,
      executeLoginFB,
      updatePlataform,
      initSessionFB,
    }}>
      <ChallengesProvider score={rest.score}>
        { isLoading
          ? (<Loader />)
          : ( isLogged 
            ? ( children) 
            : ( <Login fbAppId={rest.fbAppId}/> )
          )
        }
      </ChallengesProvider>
    </LoginContext.Provider>
  )
}