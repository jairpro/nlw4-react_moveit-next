import axios from 'axios'
import { O_NOFOLLOW } from 'node:constants'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal'
import { LoginContext } from './LoginContext'
import { compareToSortLeaderboard, MongoPratitionersData } from './RankingContext'


interface Challenge {
  type: 'body' | 'eye'
  description: string
  amount: number
}

export interface ScoreData {
  level: number
  currentExperience: number
  challengesCompleted: number
}

interface ChallengesContextData {
  level: number
  currentExperience: number 
  experienceToNextLevel: number
  challengesCompleted: number
  activeChallenge: Challenge
  leaderboard: Array<MongoPratitionersData>
  levelUp: () => void
  startNewChallenge: () => void
  resetChallenge: () => void
  completeChallenge: () => void
  closeLevelUpModal: () => void
  updateScore: (score: ScoreData) => void
  resetScore: () => void
  loadLeaderboard: () => void
}

interface ChallengesProviderProps {
  children: ReactNode
  score: ScoreData
  userId?: string
  subscribedAt?: Date
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

  const [level, setLevel] = useState(rest.score.level ?? 1)
  const [currentExperience, setCurrentExperience] = useState(rest.score.currentExperience ?? 0)
  const [challengesCompleted, setChallengesCompleted] = useState(rest.score.challengesCompleted ?? 0)

  const [activeChallenge, setActiveChallenge] = useState(null)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)
  
  const [saving, setSaving] = useState(false)
  const [leaderboard, setLeaderboard] = useState([] as Array<MongoPratitionersData>)
  const [userId, setUserId] = useState(rest.userId ?? '')
  const [subscribedAt, setSubscribedAt] = useState(rest.subscribedAt ?? null)

  const experienceFactor = 4
  const experienceToNextLevel = Math.pow((level + 1) * experienceFactor, 2)

  const { login, name, avatarUrl, plataform, newScore, resetNewScore } = useContext(LoginContext)

  /*useEffect(() => {
    //Notification.requestPermission()
  }, [])*/

  useEffect(() => {
    console.log('Current score:', {
      level, 
      currentExperience, 
      challengesCompleted
    })
    console.log('Please! update score to:', newScore)
    if (newScore) {
      updateScore(newScore)
      resetNewScore()
    }
  }, [])
  
  useEffect(() => {
    console.log('Tanks!, score updated to:', {
      level, 
      currentExperience, 
      challengesCompleted
    })
  }, [level, currentExperience, challengesCompleted])

  useEffect(() => {
    if (saving) {
      updateLeaderboard()

      save()
    }
  }, [saving])

  function updateScore(score: ScoreData) {
    const newLevel = (score && score.level) ?? level
    console.log('update score: ', score)
    console.log('newLevel: ', newLevel ) 
    setLevel(newLevel)
    setCurrentExperience((score && score.currentExperience) ?? currentExperience)
    setChallengesCompleted((score && score.challengesCompleted) ?? challengesCompleted)
    return
  }

  function levelUp() {
    console.log('level up...')
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
      const user = {
        login,
        name,
        avatarUrl,
        plataform,
      }

      const score = {
        level,
        currentExperience,
        challengesCompleted
      }

      const result = await axios.post("/api/save", {
        user, 
        score,
      })

      //console.log('save result: ', result)

      setSaving(false)

      if (!result || !result.data) {
        return false
      }
      
      if (result.data._id) setUserId(result.data._id)
      if (result.data.subcribedAt) setSubscribedAt(result.data.subscribedAt)

      return result
    }
    catch(error) {
      console.log(error)

      setSaving(false)

      return false
    }
  }

  function resetScore() {
    console.log('reset score...')
    setLevel(1)
    setCurrentExperience(0)
    setChallengesCompleted(0)
  }

  function updateLeaderboard() {
    let list = leaderboard.slice()

    let exists = false
    list.map(item => {
      if (item.avatarUrl === avatarUrl) {
        exists = true
        /*console.log('scores to update: ', {
          level,
          currentExperience,
          challengesCompleted,
        })*/

        item.score = {
          level,
          currentExperience,
          challengesCompleted,
        }
      }
    })

    if (!exists) {
      list.push({
        _id: userId,
        login: login,
        name: name,
        avatarUrl: avatarUrl,
        plataform: plataform,
        score: {
          level,
          currentExperience,
          challengesCompleted,
        },
        subscribedAt: subscribedAt,
      })
    }

    list.sort(compareToSortLeaderboard)

    setLeaderboard([...list])
  }
  
  async function loadLeaderboard() {
    //setLeaderboard([...leaderboardJson])
    //return
    
    try {
      //console.log('carregar leadboard com axios...')
      //const response = await axios.get('/api/leaderboard')
      const response = await axios.get('/api/list')
  
      //console.log('leaderboard reponse:', response)
  
      if (response && response.data) {
        let list = response.data
        setLeaderboard([...list])
        return
      }
    }
    catch (error) {
      console.log('load leaderboard error: ', error)
    }

    setLeaderboard([])
  }

  return (
    <ChallengesContext.Provider value={{
      level,
      currentExperience,
      experienceToNextLevel,
      challengesCompleted,
      activeChallenge,
      leaderboard,
      levelUp,
      startNewChallenge,
      resetChallenge,
      completeChallenge,
      closeLevelUpModal,
      updateScore,
      resetScore,
      loadLeaderboard,
    }}>
      {children}

      { isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  )
}