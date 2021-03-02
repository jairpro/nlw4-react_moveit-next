import { useContext } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import { LoginContext } from '../contexts/LoginContext'
import styles from '../styles/components/Profile.module.css'

export function Profile() {
  const { level } = useContext(ChallengesContext)
  const { name, avatarUrl } = useContext(LoginContext)

  return (
    <div className={styles.profileContainer}>
      <img src={avatarUrl} alt={name}/>
      <div>
        <strong>{name}</strong>
        <p>
          <img src="icons/level.svg" alt="Level"/>
          Level {level}
        </p>
      </div>
    </div>
  )
}