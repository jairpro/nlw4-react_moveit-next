import { createContext, ReactNode, useEffect, useState } from 'react'
import challenges from '../../challenges.json'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Challenge {
  type: 'body' | 'eye'
  description: string
  amount: number
}

interface ChallengesContextData {
  level: number
  currentExperience: number 
  experienceToNextLevel: number
  challengesCompleted: number
  activeChallenge: Challenge
  levelUp: () => void
  startNewChallenge: () => void
  resetChallenge: () => void
  completeChallenge: () => void
}

interface ChallengesProviderProps {
  children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({ children }: ChallengesProviderProps) {
  const [level, setLevel] = useLocalStorage("level", 1)
  const [currentExperience, setCurrentExperience] = useLocalStorage("currentExperience", 0)
  const [challengesCompleted, setChallengesCompleted] = useLocalStorage("challengesCompleted", 0)
  
  /*
  const [level, setLevel] = useState(1)
  const [currentExperience, setCurrentExperience] = useState(0)
  const [challengesCompleted, setChallengesCompleted] = useState(0)
  */

  const [activeChallenge, setActiveChallenge] = useState(null)

  const experienceFactor = 4
  const experienceToNextLevel = Math.pow((level + 1) * experienceFactor, 2)

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  function levelUp() {
    setLevel(level + 1)
  }

  function startNewChallenge() {
    //console.log('New challenge')

    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex]

    setActiveChallenge(challenge)

    new Audio('/notification.mp3').play()

    if (Notification.permission === 'granted') {
      const n = new Notification('Novo desafio 🎉', {
        body: `Valendo ${challenge.amount}xp!`
      })
      
      n.onclick = e => {
        window.focus()
      }
    }

  }

  function resetChallenge() {
    setActiveChallenge(null)
    //console.log('resetChallenge')
  }

  function completeChallenge() {
    if (!activeChallenge) {
      return
    }

    const { amount } = activeChallenge

    // Curiosidade: origem do termo "let" = let it change (deixe isso mudar)

    let finalExperience = currentExperience + amount
    
    if (finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel
      levelUp()      
    }

    setCurrentExperience(finalExperience)
    setActiveChallenge(null)
    setChallengesCompleted(challengesCompleted + 1)
  }

  /*function getNextExperience() {
    return currentExperience + activeChallenge.amount
  }

  function newLevel() {
    let experienceBalance = useExperienceBalance ? (getNextExperience() - experienceToNextLevel) : 0
    setCurrentExperience(experienceBalance)
    levelUp()
    console.log('Parabéns! Você alcançou um novo level.')
  }*/

  return (
    <ChallengesContext.Provider value={{
      level,
      currentExperience,
      experienceToNextLevel,
      challengesCompleted,
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