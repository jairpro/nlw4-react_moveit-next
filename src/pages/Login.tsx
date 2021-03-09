
import Head from 'next/head'
import { KeyboardEvent, useContext, useState } from 'react'
import EnterWithGithubLink, { loadHref } from '../components/EnterWithGithubLink'
import { ChallengesContext } from '../contexts/ChallengesContext'
import { LoginContext } from '../contexts/LoginContext'
import styles from '../styles/pages/Login.module.css'

import { GoMarkGithub } from 'react-icons/go'

interface LoginProps {
  login?: string
}

export default function Login(props: LoginProps) {
  const { executeLogin, token, login, updateNewScore } = useContext(LoginContext)
  const { updateScore, resetScore} = useContext(ChallengesContext)

  const [userName, setUserName] = useState(props.login ?? '')

  const appLogin = false

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserName(event.target.value)
  }

  async function handleClick() {
    //console.log('chama github no botão de login...')
    /*executeLogin({
       userLogin: userName,
       token, 
       success: user => {
         updateNewScore(user.score)
         updateScore(user.score)
       },
       fail: resetScore
    })*/
    const href = await loadHref()
    if (href) {
      window.location.href = `${href}&login=${userName}`
    }
  }

  /*function handleLogin() {
    //console.log('chama github no botão de login...')
    executeLogin({
       userLogin: login,
       token, 
       success: user => updateScore(user.score), 
       fail: resetScore
    })
  }*/
  
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
            <EnterWithGithubLink>
              <GoMarkGithub size={62} />

              <span>
                Faça login com seu Github<br/>
                para começar
              </span>
            </EnterWithGithubLink>
          </div>

        { appLogin && (
          <div className={styles.loginInput}>
          <input 

            type="text"
            placeholder="Ou digite outro username"
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
      ) }
      </div>
    </div>
  )
}