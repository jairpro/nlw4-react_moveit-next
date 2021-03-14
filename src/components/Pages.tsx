import { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { SideBarContext } from "../contexts/SideBarContext";
import Home, { HomeProps } from "../pages/Home";
import PageLoader from "../pages/PageLoader";
import Ranking, { RankingProps } from "../pages/Ranking";

export interface PagesItemsProps {
  home: HomeProps,
  ranking: RankingProps,
}

export interface PagesProps {
  items: PagesItemsProps
}

import styles from '../styles/components/Pages.module.css'

export function Pages(props: PagesProps) {
  const { page } = useContext(SideBarContext)
  //const homeProps = props.items.home 
  //const rankingProps = props.items.ranking 

  const { isLoading } = useContext(LoginContext)

  return (
    <div className={styles.pagesContainer}> {
      page === 'ranking' ? ( 
        isLoading ? ( <PageLoader /> ) : ( <Ranking /> )
      ) : ( 
        isLoading ? ( <PageLoader /> ) : ( <Home /> )
      )} 
    </div>
  )
}