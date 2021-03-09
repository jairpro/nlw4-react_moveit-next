export default function getGithubUrl() {
  const scope = encodeURIComponent(process.env.REACT_APP_GITHUB_SCOPE)
  const client_id = encodeURIComponent(process.env.REACT_APP_GITHUB_CLIENT_ID)
  const redirect_uri = encodeURIComponent(process.env.REACT_APP_GITHUB_REDIRECT_URI)

  return `https://github.com/login/oauth/authorize?scope=${scope}&client_id=${client_id}&redirect_uri=${redirect_uri}`
}