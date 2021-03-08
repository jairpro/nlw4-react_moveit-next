import jwt from 'jsonwebtoken'
import authConfig from '../config/auth'

export function JwtSign(payload: object) {

  try {
    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    })

    return token
  }
  catch (error) {
    console.log('Erro ao gerar token: ', error)
    return false
  }
}