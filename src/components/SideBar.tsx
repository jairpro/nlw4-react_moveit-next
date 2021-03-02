import { useContext } from "react"
import { LoginContext } from "../contexts/LoginContext"

import styles from '../styles/components/SideBar.module.css'

export function SideBar() {
  const { executeLogout } = useContext(LoginContext) 
  return (
    <div className={styles.sideBarContainer}>
      <img src="/logo-sidebar.svg" alt="Logo"/>

      <div className={styles.sideBarPages}>
        <img src="/icons/home.svg" alt="Home"/>
        <img src="/icons/award.svg" alt="Ranking"/>
      </div>

      <button
        type="button"
        onClick={executeLogout}
      >
        Sair
      </button>
    </div>
  )
}