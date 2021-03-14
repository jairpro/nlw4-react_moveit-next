import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal'
import api from '../services/api'
import { LoginContext } from './LoginContext'
import { compareToSortLeaderboard, MongoPratitionersData } from './RankingContext'
import { ScoreContext, ScoreData } from './ScoreContext'

interface Challenge {
  type: 'body' | 'eye'
  description: string
  amount: number
}

interface ChallengesContextData {
  experienceToNextLevel: number
  activeChallenge: Challenge
  leaderboard: Array<MongoPratitionersData>
  levelUp: () => void
  startNewChallenge: () => void
  resetChallenge: () => void
  completeChallenge: () => void
  closeLevelUpModal: () => void
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

  const { level, currentExperience, challengesCompleted, updateOptionalScore, loadScore } = useContext(ScoreContext)

  const [activeChallenge, setActiveChallenge] = useState(null)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)
  
  const [saving, setSaving] = useState(false)
  const [leaderboard, setLeaderboard] = useState([] as Array<MongoPratitionersData>)
  const [userId, setUserId] = useState(rest.userId ?? '')
  const [subscribedAt, setSubscribedAt] = useState(rest.subscribedAt ?? null)

  const experienceFactor = 4
  const experienceToNextLevel = Math.pow((level + 1) * experienceFactor, 2)

  const { login, name, avatarUrl, plataform, startLoading, stopLoading } = useContext(LoginContext)

  /*useEffect(() => {
    //Notification.requestPermission()
  }, [])*/

  useEffect(() => {
    if (saving) {
      updateLeaderboard()

      save()
    }
  }, [saving])

  function levelUp() {
    //console.log('level up...')
    updateOptionalScore({ level: level + 1})
    setIsLevelUpModalOpen(true)
  }

  function startNewChallenge() {
    //console.log('New challenge')

    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex]

    setActiveChallenge(challenge)

    new Audio('/notification.mp3').play()

    if (typeof Notification!== 'undefined') {
      if (Notification.permission === 'granted') {
        const n = new Notification('Novo desafio 🎉', {
          body: `Valendo ${challenge.amount}xp!`
        })
        
        n.onclick = e => {
          window.focus()
        }
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

    updateOptionalScore({
      currentExperience: finalExperience,
      challengesCompleted: challengesCompleted + 1,
    })

    setActiveChallenge(null)

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

      const result = await api.post("/api/save", {
        user, 
        score,
        plataform
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
      startLoading()

      //console.log('carregar leadboard com axios...')
      //const response = await axios.get('/api/leaderboard')
      const response = await api.post('/api/list', {
        plataform,
        userID: login,
      })
  
      //console.log('leaderboard reponse:', response)
  
      if (response && response.data) {
        let list = response.data
        setLeaderboard([...list])
        stopLoading()
        return
      }
    }
    catch (error) {
      console.log('load leaderboard error: ', error)
    }
    
    setLeaderboard([])
    stopLoading()
  }
  
  return (
    <ChallengesContext.Provider value={{
      experienceToNextLevel,
      activeChallenge,
      leaderboard,
      levelUp,
      startNewChallenge,
      resetChallenge,
      completeChallenge,
      closeLevelUpModal,
      loadLeaderboard,
    }}>
      {children}

      { isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  )
}