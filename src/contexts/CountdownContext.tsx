import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
  minutes: number
  seconds: number
  hasFinished: boolean
  isActive: boolean
  startCountdown: () => void
  resetCountdown: () => void
  swicthInitialTime: () => void 
}

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData)

let countdownTimeout: NodeJS.Timeout

const productionInitialTime = 25 * 60
const devInitialTime = 0.05 * 60

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge } = useContext(ChallengesContext)

  const [initialTime, setInitialTime] = useState(productionInitialTime)

  const [time, setTime] = useState(initialTime)
  const [isActive, setIsActive] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)

  const minutes = Math.floor(time/60)
  const seconds = time % 60

  function startCountdown() {
    setIsActive(true)
  }
  
  function resetCountdown() {
    clearInterval(countdownTimeout)
    setIsActive(false)
    setHasFinished(false)
    setTime(initialTime)
  }
  
  useEffect(() => {
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
    }
  }, [isActive, time])

  function swicthInitialTime() {
    setInitialTime(initialTime===productionInitialTime ? devInitialTime : productionInitialTime)
  }

  return (
    <CountdownContext.Provider value={{
      minutes,
      seconds,
      hasFinished,
      isActive,
      startCountdown,
      resetCountdown,
      swicthInitialTime,
    }}>
      {children}
    </CountdownContext.Provider>
  )
}