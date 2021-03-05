import { createContext, ReactNode } from "react"
import { ScoreData } from "./ChallengesContext"

export function compareToSortLeaderboard(a: MongoPratitionersData, b: MongoPratitionersData) {
  if (a.score.level<b.score.level) return 1
  if (a.score.level>b.score.level) return -1
  if (a.score.challengesCompleted<b.score.challengesCompleted) return 1
  if (a.score.challengesCompleted>b.score.challengesCompleted) return -1
  if (a.score.currentExperience<b.score.currentExperience) return 1
  if (a.score.currentExperience>b.score.currentExperience) return -1
  return 0
}

export interface MongoPratitionersData {
  _id: string
  login: string
  name: string
  avatarUrl: string
  plataform: string
  score: ScoreData
  subscribedAt: Date
}

interface RankingContextData {
}

interface RankingProviderProps {
  children: ReactNode
}

export const RankingContext = createContext({} as RankingContextData)

export function RankingProvider({ children }: RankingProviderProps) {

  return (
    <RankingContext.Provider value={null}>
      {children}
    </RankingContext.Provider>
  )
}