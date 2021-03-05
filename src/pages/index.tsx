import { GetServerSideProps } from 'next';
import { Pages, PagesItemsProps } from '../components/Pages';
import { SideBar } from '../components/SideBar';
import { ChallengesProvider, ScoreData } from '../contexts/ChallengesContext';
import { LoginProvider } from '../contexts/LoginContext';
import { RankingProvider } from '../contexts/RankingContext';
import { SideBarProvider } from '../contexts/SideBarContext';

export interface IndexProps {
  score: ScoreData
  pages?: PagesItemsProps
  login: string
  isLogged: boolean
  page: string
}

export default function Index(props: IndexProps) {

  // Este log vai aparecer no navegador do usuário
  //console.log('clientSideProps: ', props)

  return (
    <LoginProvider 
      login={props.login}
      isLogged={props.isLogged}
      score={props.score}
    >
      <ChallengesProvider
        score={props.score}
      >
        <RankingProvider>
          <SideBarProvider
            page={props.page}
            >
            <SideBar />
            <Pages items={props.pages}/>
          </SideBarProvider>
        </RankingProvider>
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

  const { login, isLogged, page } = ctx.req.cookies
  
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
      score: {
        level: Number(level),
        currentExperience: Number(currentExperience),
        challengesCompleted: Number(challengesCompleted),
      },
      /*pages: {
        home: {
        },
        ranking: {
          
        }
      },*/
      login: login ?? '',
      isLogged: isLogged === 'true',
      page: page ?? 'home',
    }
  }
}