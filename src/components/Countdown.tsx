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
    resetCountdown,
    swicthInitialTime,
  } = useContext(CountdownContext)

  const [leftMinute, rightMInute] = String(minutes).padStart(2, '0').split('')
  const [leftSecond, rightSecond] = String(seconds).padStart(2, '0').split('')

  function configInitialTime() {
    if (!isActive && !hasFinished) {
      swicthInitialTime()
      resetCountdown()
    }
  }

  let tapedTwice = false;

  function doubleTap(event: any) {
    if (!tapedTwice) {
      tapedTwice = true;
      setTimeout(() => tapedTwice = false, 150);
      return false;
    }
    
    event.preventDefault();
    configInitialTime()
  }

  return (
    <div>
      <div 
        className={styles.countdownContainer}
        onDoubleClick={configInitialTime}
        onTouchStart={doubleTap}
      >
        <div>
          <span className={styles.first}>{leftMinute}</span>
          <span>{rightMInute}</span>
        </div>
        <span>:</span>
        <div>
          <span className={styles.first}>{leftSecond}</span>
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