import { createContext, ReactNode, useContext, useState } from "react"
import axios from 'axios'

import { Login } from "../components/Login"
import { ChallengesContext } from "./ChallengesContext"

export interface ScoreData {
  level: number
  currentExperience: number
  challengesCompleted: number
}

interface LoginContextData {
  login: string
  name: string
  avatarUrl: string
  plataform: string // 'github' | 'facebook' | 'google'
  isLogged: boolean
  score: ScoreData
  executeLogin: (userLogin: string) => void
  executeLogout: () => void
}

interface LoginProviderProps {
  children: ReactNode
}

export const LoginContext = createContext({} as LoginContextData)

export function LoginProvider({ children }: LoginProviderProps) {
  const [login, setLogin] = useState('')
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [plataform, setPlataform] = useState('')
  const [isLogged, setIsLogged] = useState(false)
  const [score, setScore] = useState({} as ScoreData)
  
  /*type GithubData = {
    login: string
    name: string
    avatarUrl: string
    plataform: string 
  }*/

  async function connectToGithub(userLogin: string) {
    try {
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

  async function executeLogin(userLogin: string) {
    const user = await connectToGithub(userLogin)

    if (!user) {
      alert("Usuário não encontrado")
      return false
    }

    setLogin(user.login)
    setName(user.name)
    setAvatarUrl(user.avatarUrl)
    setPlataform(user.plataform)
    setIsLogged(true)

    //console.log('user: ', user)

    try {
      const result = await axios.post('/api/login', {
        user, 
      })

      if (!result) {
        console.log("Erro ao logar...")
        resetScore()
        return
      }

      if (!result.data) {
        console.log("Login não restornou dados..")
        resetScore()
        return
      }

      if (!result.data.score) {
        console.log("Praticante ainda sem score salvo...")
        resetScore()
        return
      }

      setScore(result.data.score)
    }
    catch (error) {
      console.log(error)
      resetScore()
      return
    }
  }

  function resetScore() {
    setScore({
      level: 1,
      currentExperience: 0,
      challengesCompleted: 0,
    })
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
      score,
      executeLogin,
      executeLogout,
    }}>
      { isLogged 
        ? children 
        : <Login />
      }
    </LoginContext.Provider>
  )
}