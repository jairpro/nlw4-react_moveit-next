import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal'
import { LoginContext } from './LoginContext'
import { ScoreData } from './LoginContext'

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
  const [saving, setSaving] = useState(false)

  const experienceFactor = 4
  const experienceToNextLevel = Math.pow((level + 1) * experienceFactor, 2)

  const { login, score } = useContext(LoginContext)

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  useEffect(() => {
    if (saving) {
      save()
    }
  }, [saving])

  useEffect(() => {
    updateScore(score)
  }, [score])

  function updateScore(data: ScoreData) {
    setLevel(data.level ?? level)
    setCurrentExperience(data.currentExperience ?? currentExperience)
    setChallengesCompleted(data.challengesCompleted ?? challengesCompleted)
  }

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

    //await save()
    setSaving(true)
  }

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false)
  }

  async function save() {
    try {
      const result = await axios.post("/api/save", {
        login, 
        level,
        currentExperience,
        challengesCompleted
      })

      setSaving(false)

      if (!result) {
        return false
      }

      return result
    }
    catch(error) {
      console.log(error)

      setSaving(false)

      return false
    }
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