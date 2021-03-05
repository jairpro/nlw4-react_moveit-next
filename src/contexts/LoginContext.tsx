import axios from 'axios'
import Cookies from 'js-cookie'
import { createContext, ReactNode, useEffect, useState } from "react"
import Login from "../pages/Login"
import { ChallengesProvider, ScoreData } from './ChallengesContext'
import { MongoPratitionersData } from './RankingContext'

interface ExecuteLoginData {
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
  executeLogin: (data: ExecuteLoginData) => Promise<boolean>
  executeLogout: () => void
}

interface LoginProviderProps {
  children: ReactNode
  login: string
  isLogged: boolean
  score: ScoreData
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

  async function connectToGithub(userLogin: string) {
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
  }

  async function executeLogin(data: ExecuteLoginData)  {
    if (!data.userLogin) {
      alert("Faltou digitar o usuário do Github")
      return false
    }

    const user = await connectToGithub(data.userLogin)

    if (!user) {
      alert(`Usuário ${data.userLogin} não encontrado no Github`);
      return false
    }

    setLogin(user.login)
    setName(user.name)
    setAvatarUrl(user.avatarUrl)
    setPlataform(user.plataform)
    setIsLogged(true)
    setHasLogged(true)

    //console.log('user: ', user)

    try {
      const result = await axios.post('/api/login', {
        user, 
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
  }

  function executeLogout() {
    setIsLogged(false)
  } 

  return (
    <LoginContext.Provider value={{
      login,
      name,
      avatarUrl,
      plataform,
      isLogged,
      hasLogged,
      executeLogin,
      executeLogout,
    }}>
      { isLogged 
        ? children 
        : (
          <ChallengesProvider
            score={rest.score}
          >
            <Login login={''}/>
          </ChallengesProvider>
        )
      }
    </LoginContext.Provider>
  )
}