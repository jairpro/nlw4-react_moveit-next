import { useContext } from 'react'
import { ScoreContext } from '../contexts/ScoreContext'
import styles from '../styles/components/CompletedChallenges.module.css'

export function CompletedChallenges() {
  const { challengesCompleted } = useContext(ScoreContext)

  return (
    <div className={styles.completedChallengesContainer}>
      <span>Desafios completos</span>
      <span>{challengesCompleted}</span>
    </div>
  )
}