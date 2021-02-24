import styles from '../styles/components/Profile.module.css'

export function Profile() {

  return (
    <div className={styles.profileContainer}>
      <img src="https://github.com/jairpro.png" alt="Jair Dias"/>
      <div>
        <strong>Jair Dias</strong>
        <p>
          <img src="icons/level.svg" alt="Level"/>
          Level 1
        </p>
      </div>
    </div>
  )
}