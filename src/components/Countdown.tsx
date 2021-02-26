import { useContext } from 'react'
import { CountdownContext } from '../contexts/CountdownContext'
import styles from '../styles/components/Countdown.module.css'

//import { notification } from '../sounds/notification'

export function Countdown() {
  const { 
    minutes, 
    seconds, 
    hasFinished, 
    isActive, 
    startCountdown, 
    resetCountdown  
  } = useContext(CountdownContext)

  const [leftMinute, rightMInute] = String(minutes).padStart(2, '0').split('')
  const [leftSecond, rightSecond] = String(seconds).padStart(2, '0').split('')

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