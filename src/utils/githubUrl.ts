export default function getGithubUrl() {
  /*
    <a
      className="login-link"
      href={`https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
      onClick={() => {
        setData({ ...data, errorMessage: "" });
      }}
    >
      <GithubIcon />
      <span>Login with GitHub</span>
    </a>
    */
    const scope = encodeURIComponent(process.env.REACT_APP_GITHUB_SCOPE)
    const client_id = encodeURIComponent(process.env.REACT_APP_GITHUB_CLIENT_ID)
    const redirect_uri = encodeURIComponent(process.env.REACT_APP_GITHUB_REDIRECT_URI)
  
    return `https://github.com/login/oauth/authorize?scope=${scope}&client_id=${client_id}&redirect_uri=${redirect_uri}`
    /*return {
      pathname: 'https://github.com/login/oauth/authorize',
      query: {
        scope,
        client_id,
        redirect_uri,
      }
    }*/
  }