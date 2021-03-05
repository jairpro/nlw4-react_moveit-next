
import Head from 'next/head'
import { KeyboardEvent, useContext, useState } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import { LoginContext } from '../contexts/LoginContext'
import styles from '../styles/pages/Login.module.css'

interface LoginProps {
  login: string
}

export default function Login(props: LoginProps) {
  const { executeLogin } = useContext(LoginContext)
  const { updateScore, resetScore} = useContext(ChallengesContext)

  const [userName, setUserName] = useState(props.login ?? '')

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserName(event.target.value)
  }

  function handleClick() {
    //console.log('chama github no botão de login...')
    executeLogin({
       userLogin: userName, 
       success: user => updateScore(user.score), 
       fail: resetScore
    })
  }

  function handleEnter(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      handleClick()
    }
  }

  return (
    <div className={styles.loginContainer}>
      <Head>
        <title>Entre | move.it</title>
      </Head>

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
            value={userName}
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