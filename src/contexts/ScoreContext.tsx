import { createContext, ReactNode, useState } from 'react'
import getApiLogin from '../services/api/login'

export interface OptionalScoreData {
  level?: number
  currentExperience?: number
  challengesCompleted?: number
}

export interface ScoreData {
  level: number
  currentExperience: number
  challengesCompleted: number
}

interface GetScoreData {
  token: string
  login: string
  plataform: string
}

interface ScoreContextData {
  level: number
  currentExperience: number 
  challengesCompleted: number
  updateScore: (score: ScoreData) => void
  updateOptionalScore: (score: OptionalScoreData) => void
  resetScore: () => void
  loadScore: (data: GetScoreData) => void
}

interface ScoreProviderProps {
  children: ReactNode
  score: ScoreData
}

export const ScoreContext = createContext({} as ScoreContextData)

export function ScoreProvider({ children, ...rest }: ScoreProviderProps) {
  const [level, setLevel] = useState(rest.score.level ?? 1)
  const [currentExperience, setCurrentExperience] = useState(rest.score.currentExperience ?? 0)
  const [challengesCompleted, setChallengesCompleted] = useState(rest.score.challengesCompleted ?? 0)

  function updateScore(score: ScoreData) {
    if (!score) return

    setLevel(score.level ?? level)
    setCurrentExperience(score.currentExperience ?? currentExperience)
    setChallengesCompleted(score.challengesCompleted ?? challengesCompleted)
    return
  }

  function updateOptionalScore(score: OptionalScoreData) {
    if (!score) return
    
    if (score.level!==undefined) setLevel(score.level)
    if (score.currentExperience!==undefined) setCurrentExperience(score.currentExperience)
    if (score.challengesCompleted!==undefined) setChallengesCompleted(score.challengesCompleted)
  }
  
  function resetScore() {
    setLevel(1)
    setCurrentExperience(0)
    setChallengesCompleted(0)
  }

  async function loadScore(data: GetScoreData) {
    //console.log('login: ', login)
    //console.log('token: ', token)

    const response = await getApiLogin({
      token: data.token,
      userLogin: data.login,
      plataform: data.plataform,
    })
    //console.log('getApiLogin chamado de getScore')

    if (response && response.score) {
      //console.log('loadScore: ', response.score)
      updateScore(response.score)
    }
  }

  return (
    <ScoreContext.Provider value={{
      level,
      currentExperience,
      challengesCompleted,
      updateScore,
      updateOptionalScore,
      resetScore,
      loadScore,
    }}>
      {children}
    </ScoreContext.Provider>
  )
}