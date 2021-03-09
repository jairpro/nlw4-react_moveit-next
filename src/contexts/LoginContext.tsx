import Cookies from 'js-cookie'
import { redirect } from 'next/dist/next-server/server/api-utils'
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
  const [authModal, setAuthModal] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(rest.token)
  const [newScore, setNewScore] = useState(null)
  
  async function init() {

    function redirect() {
      window.location = window.location.href.substr(0,window.location.href.indexOf('?')-1)
    }

    console.log('LoginContext useEffect mount init')
    
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

    console.log('access_token: ', access_token)
    setToken(access_token)

    /*const json = JSON.parse(Cookies.get('moveit'))
    json.token = access_token
    Cookies.set('moveit_token', JSON.stringify(json))*/
    Cookies.set('moveit_token', access_token)
    
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
      //setHasLogged(true)
    }

    /*const responseLogin = await getApiLogin({
      userLogin: responseUser.login,
      token: access_token,
      success: user => {
        console.log('Usuario logado: ',user)
      }
    })

    if (!responseLogin) {
      setIsLoading(false)
    }*/

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

  /*type GithubData = {
    login: string
    name: string
    avatarUrl: string
    plataform: string 
  }*/

  /*async function connectToGithub(userLogin: string) {
    try {
      userLogin = userLogin.toLowerCase()
      const response = await axios.get(`https://api.github.com/users/${userLogin}`)

      //console.log('response:', response)

      const dataAvatarUrl = `https://github.com/${userLogin}.png` ?? response.data.avatar_url
  
      return { 
        login: userLogin, 
        name: response.data.name, 
        avatarUrl: dataAvatarUrl,
        plataform: 'github',
      }
    }
    catch(error) {
      //console.log('error:', error)
      return
    }
  }*/

  /*async function authGithub(login: string) {
    try {
      const response = await axios.get('/api/sessions/github', {
        data: login
      })

      if (!response) {
        console.log('/api/sessions/github não retornou dados')
        return false
      }

      //console.log('Resposta de /api/session/github: ', response)

      return response.data
    }
    catch(error) {
      console.log('authGithub error: ', error)
      return false
    }
  }
  */

  async function executeLogin(data: ExecuteLoginData)  {
    const hasLoading = isLoading

    console.log('execute login')

    setIsLoading(true)

    const finalize = () => {
      if (!hasLoading) {
        setIsLoading(false)
      }
    }

    const response: MongoPratitionersData = await getApiLogin(data)

    console.log('executeLogin response: ', response)

    if (!response) {
      setToken('')
      Cookies.remove('moveit_token')
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
    setNewScore(response.score)

    if (data.success) data.success(response)
    
    finalize()

    return true
    /*
    if (!data.userLogin) {
      alert("Faltou digitar o usuário do Github")
      return false
    }

    //const user = await connectToGithub(data.userLogin)
    const githubModal = await authGithub(data.userLogin)

    if (!githubModal) {
      alert('Erro no Github')
      return false
    }

    setAuthModal(githubModal)

    return true
    */

    /*
    if (!user) {
      alert(`Usuário ${data.userLogin} não encontrado no Github`);
      return false
    }

    const token = JwtSign(payload)

    if (!token) {
      alert('Falha no sistema de autenticação')
      setLogin('')
      setName('')
      setAvatarUrl('')
      setPlataform('')
      setIsLogged(false)
      setHasLogged(false)
      return false
    }

    setLogin(user.login)
    setName(user.name)
    setAvatarUrl(user.avatarUrl)
    setPlataform(user.plataform)
    setIsLogged(true)
    setHasLogged(true)

    //console.log('user: ', user)

    const payload = {
      login: user.login,
    }
    
    api.defaults.headers.Authorization = `Bearer ${token}`

    try {
      const result = await api.get('/api/login', {
        data: {
          user, 
        }
      })

      if (!result) {
        console.log("Erro ao logar...")
        if (data.fail) data.fail()
        return true
      }

      if (!result.data) {
        console.log("Login não restornou dados..")
        if (data.fail) data.fail()
        return true
      }

      if (!result.data.score) {
        console.log("Praticante ainda sem score salvo...")
        if (data.fail) data.fail(result.data)
        return true
      }

      const { score } = result.data 
      //console.log('O score do user logado é: ', score)

      if (data.success) data.success(result.data)

      return true
    }
    catch (error) {
      console.log(error)
      if (data.fail) data.fail(error)
      return false
    }
    */
  }

  function executeLogout() {
    setIsLogged(false)
  } 

  function resetNewScore() {
    setNewScore(null)
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
    }}>
      { isLoading
        ? (<Loader />)
        : (
          <ChallengesProvider score={rest.score}>
            { isLogged ? ( 
              children
            ) : ( 
              !authModal 
                ? (<Login login={''}/>)
                : (authModal)
            )}
          </ChallengesProvider>
        )
      }
    </LoginContext.Provider>
  )
}