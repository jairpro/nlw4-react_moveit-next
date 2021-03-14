import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { LoginContext } from "./LoginContext";
import { ChallengesContext } from "./ChallengesContext";
import { ScoreContext } from "./ScoreContext";
import PageLoader from "../pages/PageLoader";

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

  const { isLogged, hasLogged, login, token, plataform, executeLogin, executeLoginFB } = useContext(LoginContext)
  const { loadLeaderboard } = useContext(ChallengesContext)
  const { updateScore, resetScore } = useContext(ScoreContext)

  useEffect(() => {
    //console.log('SideBarContext useEffect')

    if (isLogged && !hasLogged) {
      //console.log('executeLogin com token: ', token)
      
      switch (plataform) {
        case 'fb':
          executeLoginFB({
            accessToken: token,
            userID: login,
          })    
          break

        case 'github':
          executeLogin({
            userLogin: login,
            token,
            plataform,
            success: user => updateScore(user.score),
            fail: resetScore,
          })
          //console.log('executeLogin chamado de SideBarContext,useEffect')
          break

          default:
        
      }
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

  const { isLoading } = useContext(LoginContext)

  return (
    <SideBarContext.Provider value={{
      page,
      showHome,
      showRanking,
    }}>
      { children }
      { //isLoading ? (<PageLoader />) : (children)
       }
    </SideBarContext.Provider>
  )
}