import { useContext } from "react";
import { SideBarContext } from "../contexts/SideBarContext";
import Home, { HomeProps } from "../pages/Home";
import Ranking, { RankingProps } from "../pages/Ranking";

export interface PagesItemsProps {
  home: HomeProps,
  ranking: RankingProps,
}

export interface PagesProps {
  items: PagesItemsProps
}

export function Pages(props: PagesProps) {
  const { page } = useContext(SideBarContext)
  //const homeProps = props.items.home 
  //const rankingProps = props.items.ranking 

  return (<> {
    page === 'ranking' ? ( 
      <Ranking />
    ) : ( 
      <Home />
    )
  } </>)
}