import { useContext } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import { LoginContext } from '../contexts/LoginContext'
import styles from '../styles/components/Profile.module.css'

interface ProfileProps {
  name?: string
  avatarUrl?: string
  level?: number
}

export function Profile(props: ProfileProps) {
  const { name, avatarUrl } = useContext(LoginContext)
  const { level } = useContext(ChallengesContext)

  const data = {
    name: props.name ?? name,
    avatarUrl: props.avatarUrl ?? avatarUrl,
    level: props.level ?? level,
  }

  return (
    <div className={styles.profileContainer}>
      <img src={data.avatarUrl} alt={data.name}/>
      <div>
        <strong>{data.name}</strong>
        <p>
          <img src="icons/level.svg" alt="Level"/>
          Level {data.level}
        </p>
      </div>
    </div>
  )
}