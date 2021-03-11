import { useContext } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import { ScoreContext } from '../contexts/ScoreContext'
import styles from '../styles/components/ExperienceBar.module.css'

export function ExperienceBar() {
    const { experienceToNextLevel } = useContext(ChallengesContext)
    const { currentExperience } = useContext(ScoreContext)

    const percentToNextLevel =  Math.round((currentExperience * 100) / experienceToNextLevel)
    const percentToNextLevelComputed = `${percentToNextLevel}%`

    return (
      <header className={styles.experienceBar}>
        <span style={currentExperience>0 ? {userSelect: 'none' } : {}}>0 xp</span>
        <div>
          <div style={{width: percentToNextLevelComputed }}/>

          {currentExperience>0 && (
            <span className={styles.currentExperience} style={{ left: percentToNextLevelComputed }}>
              {currentExperience} xp
            </span>
          )}
          
        </div>
        <span>{experienceToNextLevel} xp</span>
      </header>
    )
}