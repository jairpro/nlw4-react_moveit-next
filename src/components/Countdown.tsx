import { useState, useEffect, useContext } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import styles from '../styles/components/Countdown.module.css'

import { notification } from '../sounds/notification'

const initialTime = 25 * 60
//const initialTime = 0.1 * 60

let countdownTimeout: NodeJS.Timeout

export function Countdown() {
  const { activeChallenge, startNewChallenge} = useContext(ChallengesContext)

  const [time, setTime] = useState(initialTime)
  const [isActive, setIsActive] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)

  const minutes = Math.floor(time/60)
  const seconds = time % 60

  const [leftMinute, rightMInute] = String(minutes).padStart(2, '0').split('')
  const [leftSecond, rightSecond] = String(seconds).padStart(2, '0').split('')

  function startCountdown() {
    setTime(initialTime)
    setIsActive(true)
  }
  
  function resetCountdown() {
    clearInterval(countdownTimeout)
    setIsActive(false)
    setHasFinished(false)
  }
  
  useEffect(() => {
    if (hasFinished && !activeChallenge) {
      //console.log('resetar')
      resetCountdown()
    }

    if (isActive && time>0) {
      countdownTimeout = setTimeout(() => {
        setTime(time -1)
      }, 1000)
    }
    else if (isActive && time === 0) {
      
      //console.log('finalizou')
      setHasFinished(true)
      setIsActive(false)
      startNewChallenge()
      
      notification.play()
    }
  }, [isActive, time, activeChallenge])

  return (
    <div>
      <div className={styles.countdownContainer}>
        <div>
          <span>{leftMinute}</span>
          <span>{rightMInute}</span>
        </div>
        <span>:</span>
        <div>
          <span>{leftSecond}</span>
          <span>{rightSecond}</span>
        </div>
      </div>

      {hasFinished
        ? (
          <button
            disabled 
            className={styles.countdownButton}
          >
            Ciclo encerrado
          </button>
        ) : (
          <>
            {isActive ? (
              <button 
                type="button" 
                className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
                onClick={resetCountdown}
                >
                Abandonar ciclo
              </button>
            ) : (
              <button 
              type="button" 
              className={styles.countdownButton}
              onClick={startCountdown}
              >
                Iniciar um ciclo
              </button>
            ) }            
          </>          
        )
      }

    </div>
  )
}