import { useContext } from "react"
import { LoginContext } from "../contexts/LoginContext"
import { SideBarContext } from "../contexts/SideBarContext"

import { FiHome, FiAward, FiArrowLeft } from 'react-icons/fi'

import styles from '../styles/components/SideBar.module.css'

interface SideBarProps {
}

export function SideBar(props: SideBarProps) {
  const { executeLogout } = useContext(LoginContext)
  const { page, showHome, showRanking } = useContext(SideBarContext)

  return (
    <>
      <div className={styles.sideBarContainer}>
        <img src="/logo-sidebar.svg" alt="Logo"/>

        <div className={styles.sideBarPages}>
          <button
            title="Home"
            onClick={showHome}
            className={page === 'home' ? styles.pageButtonActive : ''}
          >
            <FiHome size={32}/>
          </button>

          <button
            title="Ranking"
            onClick={showRanking}
            className={page === 'ranking' ? styles.pageButtonActive : ''}
          >
            <FiAward size={32}/>
          </button>
        </div>

        <button
          title="Sair"
          type="button"
          onClick={executeLogout}
        >
          <FiArrowLeft size={32}/>
        </button>
      </div>
    </>
  )
}