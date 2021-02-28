import { createContext, ReactNode, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal'

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
  closeLevelUpModal: () => void
}

interface ChallengesProviderProps {
  children: ReactNode;
  level: number
  currentExperience: number
  challengesCompleted: number
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
  // O ...rest retorna num objeto os demais parametros além de children.
  //   Uso:
  //     rest.arq2, rest.arq3, rest.arq4, etc.
  //     no caso: rest.level, rest.currentExperience, rest.challengesCompleted
  //
  // O operador ?? retorna o valor seguinte caso o anterior não existir.
  //   uso:
  //     v1 ?? v2
  //
  //   parece melhor solução que:
  //     v1!==undefined v1 ? : v2"

  const [level, setLevel] = useState(rest.level ?? 1)
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)

  const [activeChallenge, setActiveChallenge] = useState(null)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

  const experienceFactor = 4
  const experienceToNextLevel = Math.pow((level + 1) * experienceFactor, 2)

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  useEffect(() => {
    Cookies.set('level', String(level))
    Cookies.set('currentExperience', String(currentExperience))
    Cookies.set('challengesCompleted', String(challengesCompleted))
  }, [level, currentExperience, challengesCompleted])

  function levelUp() {
    setLevel(level + 1)
    setIsLevelUpModalOpen(true)
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

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false)
  }

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
      closeLevelUpModal,
    }}>
      {children}

      { isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  )
}