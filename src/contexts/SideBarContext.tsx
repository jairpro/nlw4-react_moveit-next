import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { LoginContext } from "./LoginContext";
import { ChallengesContext } from "./ChallengesContext";
interface SideBarContextData {
  page: string
  showHome: () => void
  showRanking: () => void
}

interface SideBarProviderProps {
  children: ReactNode
  page: string
}

export const SideBarContext = createContext({} as SideBarContextData)

export function SideBarProvider({ children, ...rest }: SideBarProviderProps) {
  const [page, setPage] = useState(rest.page ?? 'home')
  const [rankingLoaded, setRankingLoaded] = useState(false)

  const { isLogged, hasLogged, login, token, executeLogin } = useContext(LoginContext)
  const { updateScore, resetScore, loadLeaderboard } = useContext(ChallengesContext)

  useEffect(() => {
    console.log('SideBarContext useEffect')
    if (isLogged && !hasLogged) {
      console.log('executeLogin com token: ', token)
      executeLogin({
        userLogin: login,
        token,
        success: user => updateScore(user.score),
        fail: resetScore,
      })
    }
  },[])

  /*useEffect(()=>{
//    loadRanking()
  },[])*/

  useEffect(() => {
    //console.log('a página em SideBarContext/UseEffect[page] é: ', page)
    
    Cookies.set('page', page, {
      sameSite: 'Lax',
    })

    loadRanking()
  }, [page])

  function loadRanking() {
    if (page==='ranking' && !rankingLoaded) {
      setRankingLoaded(true)
      loadLeaderboard()
    }
  }

  function showHome() {
    setPage('home')
  }
  
  function showRanking() {
    setPage('ranking')
  }

  return (
    <SideBarContext.Provider value={{
      page,
      showHome,
      showRanking,
    }}>
      { children }
    </SideBarContext.Provider>
  )
}