
import Head from 'next/head'
import { KeyboardEvent, useState } from 'react'
import { GoMarkGithub } from 'react-icons/go'
import EnterWithGithubLink, { loadHref } from '../components/EnterWithGithubLink'
import LoginFacebook from '../components/LoginFacebook'
import styles from '../styles/pages/Login.module.css'


interface LoginProps {
  login?: string
  fbAppId? : string
}

export default function Login(props: LoginProps) {
  const [userName, setUserName] = useState(props.login ?? '')

  const appLogin = false

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserName(event.target.value)
  }

  async function handleClick() {
    const href = await loadHref()
    if (href) {
      window.location.href = `${href}&login=${userName}`
    }
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

          <LoginFacebook fbAppId={props.fbAppId}/>

          <div className={styles.loginPlataform}>
            <EnterWithGithubLink>
              <GoMarkGithub size={48} />

              <span>
                Entrar com o Github
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