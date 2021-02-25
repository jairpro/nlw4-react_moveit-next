import { createContext, ReactNode, useState } from 'react'
import challenges from '../../challenges.json'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Challenge {
  type: 'body' | 'eye'
  description: string
  amount: number
}

interface ChallengesProviderData {
  level: number
  currentExperience: number 
  challengesCompleted: number
  experienceToNextLevel: number
  activeChallenge: Challenge
  levelUp: () => void
  startNewChallenge: () => void
  resetChallenge: () => void
  completeChallenge: () => void
}

interface ChallengesProviderProps {
  children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesProviderData)

export function ChallengesProvider({ children }: ChallengesProviderProps) {
  const [level, setLevel] = useLocalStorage("level", 1)
  const [currentExperience, setCurrentExperience] = useLocalStorage("currentExperience", 0)
  const [challengesCompleted, setChallengesCompleted] = useLocalStorage("challengesCompleted", 0)

  const [activeChallenge, setActiveChallenge] = useState(null)

  const useExperienceBalance = false
  const experienceFactor = 4
  const experienceToNextLevel = Math.pow((level + 1) * experienceFactor, 2)

  function levelUp() {
    setLevel(level + 1)
  }

  function startNewChallenge() {
    //console.log('New challenge')
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex]

    setActiveChallenge(challenge)
    //setCountdownReseted(false)
  }

  function resetChallenge() {
    setActiveChallenge(null)
    //console.log('resetChallenge')
  }

  function completeChallenge() {
    if (!activeChallenge) {
      return
    }

    setChallengesCompleted(challengesCompleted + 1)

    let nextExperience = getNextExperience()

    if (nextExperience < experienceToNextLevel) {
      setCurrentExperience(nextExperience)
    }
    else {
      newLevel()
    }
    resetChallenge()
  }

  function getNextExperience() {
    return currentExperience + activeChallenge.amount
  }

  function newLevel() {
    let experienceBalance = useExperienceBalance ? (getNextExperience() - experienceToNextLevel) : 0
    setCurrentExperience(experienceBalance)
    levelUp()
    console.log('Parabéns! Você alcançou um novo level.')
  }

  return (
    <ChallengesContext.Provider value={{
      level,
      currentExperience,
      challengesCompleted,
      experienceToNextLevel,
      activeChallenge,
      levelUp,
      startNewChallenge,
      resetChallenge,
      completeChallenge,
    }}>
      {children}
    </ChallengesContext.Provider>
  )
}