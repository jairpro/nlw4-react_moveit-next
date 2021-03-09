import { ExecuteLoginData } from '../../contexts/LoginContext'
import api from '../api'

export default async function getApiLogin(data: ExecuteLoginData) {
  //console.log('getApiLogin data: ', data)

  const { token, userLogin: login } = data

  api.defaults.headers.Authorization = `Bearer ${token}`

  try {
    const result = await api.post('/api/login', {
      user: { login }
    })

    if (result && result.data) {
      if (!result.data.score) {
        console.log("Praticante ainda sem score salvo...")
      }

      //const { score } = result.data 
      //console.log('O score do user logado é: ', score)
      //console.log('getApilogin result.data: ', result.data)

      return result.data
    }

    if (!result) {
      console.log("Erro ao logar...")
    }

    if (!result.data) {
      console.log("Login não retornou dados..")
    }
  }
  catch (error) {
    console.log(error)
  }

  return null
}