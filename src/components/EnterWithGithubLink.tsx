import axios from "axios"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { LoginContext } from "../contexts/LoginContext"

interface EnterWithGithubLinkProps {
  children: any
  href?: string
  onClick?: (e: any) => void
}

export async function loadHref() {
  try {
    const response = await axios.get('/api/github/url')
    if (response && response.data) {
      return response.data
    }
  }
  catch(error) {
    console.log('Error on axios get /api/github/url: ', error)
  }
  return false
}

export default function EnterWithGithubLink({children, ...rest}: EnterWithGithubLinkProps) {
  const [href, setHref] = useState('')

  async function updateHref() {
    const result = await loadHref()
    if (result) {
      setHref(result)
    }
  }

  useEffect(() => {
    if (rest.href) {
      setHref(rest.href)
      return
    }

    updateHref()    
  }, [])

  const router = useRouter()
  const style = {}

  const { token, executeLogin, login } = useContext(LoginContext)

  const handleClick = async (e: any) => {
    e.preventDefault()
    if (token) {
      const result = await executeLogin({
        token,
        userLogin: login,
        success: _ => {
          console.log('login success')
        }
      })
      if (result) {
        return
      }
    }
    router.push(href)
  }

  return (
    <a href={href} onClick={rest.onClick ?? handleClick} style={style}>
      {children}
    </a>
  )
}