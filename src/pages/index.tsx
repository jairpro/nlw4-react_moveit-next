import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useContext } from 'react';

import { ChallengeBox } from "../components/ChallengeBox";
import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from '../components/Profile';
import { SideBar } from '../components/SideBar';
import { ChallengesProvider } from "../contexts/ChallengesContext";
import { CountdownProvider } from "../contexts/CountdownContext";
import { LoginContext, LoginProvider } from '../contexts/LoginContext';

import styles from '../styles/pages/Home.module.css';

interface HomeProps {
  level: number
  currentExperience: number
  challengesCompleted: number
}

export default function Home(props: HomeProps) {
  const { isLogged } = useContext(LoginContext)

  // Este log vai aparecer no navegador do usuário
  //console.log('clientSideProps: ', props)

  return (
    <LoginProvider>
      <ChallengesProvider
        level={props.level}
        currentExperience={props.currentExperience}
        challengesCompleted={props.challengesCompleted}
      >
        <SideBar />

        <div className={styles.container}>
          <Head>
            <title>Início | move.it</title>
          </Head>


          <ExperienceBar /> 

          <CountdownProvider>
            <section>
              <div>
                <Profile />
                <CompletedChallenges />
                <Countdown/>
              </div>

              <div>
                <ChallengeBox /> 
              </div>
            </section>
          </CountdownProvider>
        </div>
      </ChallengesProvider>
    </LoginProvider>
  )
}

// Tudo feito nessa função executa no servidor node e não no browser do usuário

// Antigamente era chamada getInitialProps
// Essa função é que deu surgimento ao NextJS

// Recebe uma variável context, que por padrão é do tipo "any"
// Para definir o tipo: informar que o tipo do método "getServerSideProps" é "GetServerSideProps" (importando-o next)
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //const { level, currentExperience, challengesCompleted } = ctx.req.cookies

  const level = 1
  const currentExperience = 0
  const challengesCompleted = 0
  
  // Este log vai aparecer no terminal do servidor node no backend:
  //console.log('serverSideProps', { level, currentExperience, challengesCompleted })

  /** 
   * Aqui os dados são passados ao browser do usuário.
   * No caso, como parâmetro para o componente Home acima.
   * Quando um "crawlers" (rastreador ou motor de busca), 
   * como Google ou outros, acessar a aplicação
   * ele vai executar primeiro o método getServierSideProps no backend,
   * e só quando finalizar, vai mostrar a interface
   * e ai sim o rastreador vai ficar esperando o componente finalizar
   * pois o comportamento padrão dos rastreadores é esperar o servidor finalizar a resposta 
   * para então eles indexarem aquela página.
   * */
  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
    }
  }
}