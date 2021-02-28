# NLW#4 - Trilha ReactJS

## Projeto MOVEIT NEXT

## Passos:

### 1) Migrar o projeto anterior ReactJS para o NextJS: 

  ```shell
  yarn create next-app moveit-next
  ```
### 2) Instalar o Typescript:

  ```shell
  yarn add typescript @types/react @types/react-dom @types/node -D
  ```

### 3) Rodar aplicação:

  ```shell
  yarn dev
  ```

  [http://localhost:3000](http://localhost:3000)

## Telemetria:
  O Next faz telemetria, uma coleta anômia de dados relacionados ao seu projeto para fins de melhorias. Detalhes em: [https://nextjs.org/telemetry](https://nextjs.org/telemetry)

  Para desabilitar:

  ```shell
  npx next telemetry disable
  ```

## Dependências:

  ### JS-Cookie
  Para armazenar as pontuações do usuário em cookies:

  ```shell
  yarn add js-cookie
  ```

  ```shell
  yarn add @types/js-cookie -D
  ```

  Nota: veja sobre @types em DefinitelyType 

  ### DefinitelyType
  Para adicionar Typescrip caso uma biblioetca ainda não tenha esse suporte. Aqui há suporte para muitas delas:

  [https://github.com/DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
  
  As numerosas tipagens disponíveis estão na pasta [DefinitelyTyped/types](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types)

  Uso:

  ```shell
  yarn add @types/biblioteca-alvo -D
  ```

### NextJS:

  ### getServerSideProps:
  
  Tudo feito nessa função do Next executa no servidor node e não no browser do usuário.
  Antigamente era chamada _getInitialProps_.
  Essa função é que deu surgimento ao NextJS.

  Recebe uma variável context, que por padrão é do tipo "any".
  Para definir o tipo quano se usa Typescrip: informar que o tipo do método *getServerSideProps* é *GetServerSideProps* (importando-o next).

  Exemplo:
  
  ```js
  export function Home(props) {
    return(
      <h1>Olá!</h1>
    )
  }

  export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { level, currentExperience, challengesCompleted } = ctx.req.cookies

    // Isto log vai apárecer no terminal do servidor node no backend:
    console.log(user)

    return {
      props: {
        level: Number(level),
        currentExperience: Number(currentExperience),
        challengesCompleted: Number(challengesCompleted),
      }
    }
  }
  ```

  No retorno dessa função os dados são passados ao browser do usuário.
  No exemplo, os dados são passados como parâmetro para um componente Home, logo acima.

  Quando um _"crawlers"_ (rastreador ou motor de busca como Google ou outros) acessar a aplicação, ele vai executar primeiro o método *getServierSideProps* no backend. E só quando finalizar, vai mostrar a interface. E ai sim, o rastreador vai ficar esperando o componente finalizar.
  
  Pois o comportamento padrão dos rastreadores é esperar o servidor finalizar a resposta para então eles indexarem aquela página.


## Recursos interasantes do JS:

### Parametro ...rest:

  Parece que ...rest quando usado ao final do parâmetro de uma function  retorna num objeto os demais parametros além dos anteriores informados
  Exemplo:

  Exemplo:

  ```js
    function(arq1, ...rest) {
      const arq2 = rest.arq2
      const arq3 = rest.arq3
      const arq4 = rest.arq4
    }
  ```

  Parece ser útil quando no uso de useState para ter ambas nomenclaturas em props e states

  Exemplo:
     
  ```js
  export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1)
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
    const [challengesCompleted, setChallengesCompleted] = useState(rest;challengesCompleted ?? 0)
  ```
    
### Operador ??

  O operador ?? retorna o valor seguinte caso o anterior não existir.

  Uso:

  ```js
  (v1 ?? v2)
  ```
  
  Parece ser mais prático que:

  ```js
  (v1 !== undefined v1 ? : v2)
  ```

## Deploy

  As sugestões de deploy propostas foram [netlify.com](https://netlify.com) e [vercel.com](https://vercel.com). Ambas com planos gratuito que possibilita hospedar a grande maioria das aplicações front-end.

  O deploy implementado na aula foi o da version
  
  Passos:
  
  1) Criar uma conta da Vercel;

  2) Baixar o [Vercel CLI](https://vercel.com/download);

  Com NPM:
     
  ```shell
  npm i -g vercel
  ```

  Com Yarn:

  Pesquise *yarn global path* ou [acesse](https://classic.yarnpkg.com/en/docs/cli/global/).
  
  E adicione ao PATH do SO:

  ```shell
  export PATH="$(yarn global bin):$PATH"
  ```

  No Windows, em: 
    Painel de Controle > Sistema > Variáveis de ambiente > ...

  No Linux:
  
  ```shell
  vim ~/.bash_profile
  ```
  ou

  ```shell
  vim ~/.zshrc
  ```

  3) Após instalar o Vercel CLI digite para ajuda:

  ```shell
  vercel -h
  ```

  Uso da Vercel, passos:

  1) Login:

  ```shell
  vercel login
  ```

  2) Após o login e na pasta do projeto:

  ```shell
  vercel
  ```

  2.1) Setup do projeto para fazer deploy: (responder Yes);
  2.2) Selecione o seu perfil (caso tenha criado mais de um);
  2.3) Se ainda não houver um projeto criado ainda: (responder No);
  2.4) Insira o nome do projeto; (caso alguém já tenha usado o mesmo nome será adicionado caracteres para diferenciar)
  2.5) Localização da pasta do projeto? (estando já na pasta do projeto basta teclar Enter)
  2.6) Para não sobrescrever nenhuma configuração padrão do projeto: (responder No)

  Será feito um setup do projeto, upload, todas as instalações. Ele já entende que é um projeto com NextJS e configurará tudo automaticamente.  Funciona para projetos sem Next, mas apenas projetos Font-end, não faz para projetos backend.

  Ao terminar esse processo o projeto já fica disponível (num link online) para produção.

  3) Após alterações no projeto, ao gerar um novo deploy da aplicação com o comando 
  
  ```shell
  vercel
  ```

  É gerada um deploy de stage (para testes), num link alternativo.

  Para jogar o deploy para produção diretamente (no link final) executar:

  ```shell
  vercel --prod
  ```

  4) Na Vercel *Dashborad > Settings > Domain* pode-se adicionar o seu domínio fazendo as conmfigurações de DNS;
  
  Há também opções de variáveis ambiente, segurança, etc.


## Desafios:
1) Documentar o projeto:
   - Gif da aplicação;
   - Video;
   - Coloca no Github;
   - Read-me bonito;
   - Tecnologias utilizadas;
   - Instruções para baixar e rodar local (*gitclone*, *yarn* para instalar as dependências, etc);
   - Quais as funcionalidades que existem dentro da aplicação;
   - Prints da aplicação de como que ela está funcionando (das funcionalidades em si. Uma print de quando aparece o desafio, de quando o usuário sobe de nível. Uma print de quando é a tela em branco); 
   - Explique a logística e tudo o mais... documentação é o mínimo.

2) Melhorar estilização da aplicação:
   - Responsividade (medias querys para se adaptar ao mobile);
   - PWA (Para permitir instalar no celular e sair utilizando, não necessitando desenvolver o app para iOS/Android. O Next tem integração com PWA, pesquise documentações para isso);
   - Trocar as cores da aplicação (utilizar temas diferentes como dark, separar umas cores diferentes);

3) Novas Funcionalidades - *Moveit 2.0*:
   - Logar com Github:
     A ideia inicial era uma tela de login onde o usuário digita seu _username_ do github para a aplicação buscar os dados públicos;
     Mas poderia ser, levando para o próximo nível, fazer um botão "Logar com Github" fazendo o OAuth do Github (pesquise "oauth github").
     E pode-se fazer tudo com o NextJS, sem backend. Inclusive acessar API externa, gravar num banco de dados, etc.
     
     Pesquise sobre Next no [Youtube da Rocketseat](https://www.youtube.com/c/RocketSeat/search?query=next.js).
     
     Veja o vídeo [Serverless com ReactJS e Next.js na Vercel](https://www.youtube.com/watch?v=Cz55Jmhfw84)
     
   - Sidebar;
   - Ranking de usuários;
   - Compartilhar no Twitter;
   
   Link do leiatute [Moveit 2.0](https://www.figma.com/file/vRbW1u0CEZuG2zE6bU5qLg/Move.it-2.0/duplicate);

4) Dá para adicionar muito mais funcionalidades;
