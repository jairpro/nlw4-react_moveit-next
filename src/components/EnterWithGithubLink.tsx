import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { ChallengesContext } from "../contexts/ChallengesContext"
import { LoginContext } from "../contexts/LoginContext"

interface EnterWithGithubLinkProps {
  children: any
  href?: string
  onClick?: (e: any) => void
}

export default function EnterWithGithubLink({children, ...rest}: EnterWithGithubLinkProps) {
  const [href, setHref] = useState('')

  async function loadHref() {
    try {
      const response = await axios.get('/api/github/url')
      if (!response || !response.data) {
        return
      }
      setHref(response.data)
    }
    catch(error) {
      console.log('Error on axios get /api/github/url: ', error)
    }
  }

  useEffect(() => {
    if (rest.href) {
      setHref(rest.href)
      return
    }
    loadHref()
  }, [])

  const router = useRouter()
  const style = {}

  const { token, executeLogin, login } = useContext(LoginContext)

  const handleClick = (e: any) => {
    e.preventDefault()
    if (token) {
      executeLogin({
        token,
        userLogin: login,
        success: _ => {
          console.log('login success')
        }
      })
      return
    }
    router.push(href)
  }

  return (
    <a href={href} onClick={rest.onClick ?? handleClick} style={style}>
      {children}
    </a>
  )
}