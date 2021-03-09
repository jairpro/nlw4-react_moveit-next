import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Pages, PagesItemsProps } from '../components/Pages';
import { SideBar } from '../components/SideBar';
import { ScoreData } from '../contexts/ChallengesContext';
import { LoginProvider } from '../contexts/LoginContext';
import { RankingProvider } from '../contexts/RankingContext';
import { SideBarProvider } from '../contexts/SideBarContext';

export interface MetaData {
  fbAppId: string
  ogUrl: string
  ogType: string
  ogTitle: string
  ogImage: string
  ogDescription: string
}

export interface IndexProps {
  score: ScoreData
  pages?: PagesItemsProps
  login: string
  isLogged: boolean
  page: string
  token: string
  meta: MetaData
}

export default function Index(props: IndexProps) {

  // Este log vai aparecer no navegador do usuário
  //console.log('clientSideProps: ', props)

  return (
    <>
      <Head>
        <meta property="fb:app_id" content={props.meta.fbAppId} />
        <meta property="og:url" content={props.meta.ogUrl} />
        <meta property="og:type" content={props.meta.ogType} />
        <meta property="og:title" content={props.meta.ogTitle} />
        <meta property="og:image" content={props.meta.ogImage} />
        <meta property="og:description" content={props.meta.ogDescription} />
      </Head>
      
      <LoginProvider 
        login={props.login}
        isLogged={props.isLogged}
        score={props.score}
        token={props.token}
      >
        <RankingProvider>
          <SideBarProvider page={props.page}>
            <SideBar />
            <Pages items={props.pages}/>
          </SideBarProvider>
        </RankingProvider>
      </LoginProvider>
    </>
  )
}

// Tudo feito nessa função executa no servidor node e não no browser do usuário

// Antigamente era chamada getInitialProps
// Essa função é que deu surgimento ao NextJS

// Recebe uma variável context, que por padrão é do tipo "any"
// Para definir o tipo: informar que o tipo do método "getServerSideProps" é "GetServerSideProps" (importando-o next)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const level = 1
  const currentExperience = 0
  const challengesCompleted = 0

  const { login, isLogged, page, token } = ctx.req.cookies

  const referer = `https://${ctx.req.headers.host}/`
  const url = referer || process.env.APP_URL

  const meta: MetaData = {
    fbAppId: process.env.FB_APP_ID,
    ogDescription: "Desafios para exercitar o corpo e olhos e manter-se saudável",
    ogImage: `${url}fb-feed.png`,
    ogTitle: process.env.APP_TITLE,
    ogType: 'website',
    ogUrl: url
  }
  
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
      token: token ?? '',
      meta,
    }
  }
}