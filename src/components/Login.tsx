
import { KeyboardEvent, useContext, useState } from 'react'
import { LoginContext } from '../contexts/LoginContext'
import styles from '../styles/components/Login.module.css'

export function Login() {
  const { executeLogin } = useContext(LoginContext)

  const [userName, setUserName] = useState('')

  function handleChange(event) {
    setUserName(event.target.value)
  }

  function handleClick() {
    executeLogin(userName)
  }

  function handleEnter(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      handleClick()
    }
  }

  return (
    <div className={styles.loginContainer}>

      <img className={styles.loginSimbol} src="/simbolo.svg" alt=""/>

      <div className={styles.loginForm}>

        <img src="/logo-login.svg" alt="Logo"/>

        <h1>Bem-vindo</h1>

        <div className={styles.loginPlataform}>
          <img src="/icons/github.svg" alt="Github"/>

          <span>
            Faça login com seu Github
            para começar
          </span>
        </div>

        <div className={styles.loginInput}>
          <input 
            type="text"
            placeholder="Digite seu username"
            onChange={handleChange}
            onKeyDown={handleEnter}
          />

          <button
            type="button"
            onClick={handleClick}
            >
            <img src="/icons/login.svg" alt="Entrar"/>
          </button>
        </div>
      </div>
    </div>
  )
}