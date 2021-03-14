import { NowRequest, NowResponse } from '@vercel/node'
import { connectToDatabase } from '../../services/mongodb'
import authMiddleware from '../../middlewares/auth'
import { getApiFbUser } from '../../services/api/fb/user'
import { getApiGithubUser } from '../../services/api/github/user'

export default async (request: NowRequest, response: NowResponse) => {
  const { user } = request.body
  const { login } = user

  const auth = await authMiddleware(request, login)
  //console.log('auth:', auth)

  if (!auth.token) {
    return response.status(auth.status).json({ error: auth.error })
  }

  const { plataform } = request.body

  //return response.json(user)
  
  const db = await connectToDatabase(process.env.MONGODB_URI)

  const collection = db.collection('practitioners')

  //console.log('login:', login)

  const dbUser = await collection.findOne({
    login,
  })

  //console.log('dbUser:', dbUser)

  if (!dbUser) {
    const score = {
      level: 1,
      currentExperience: 0,
      challengesCompleted: 0,
    }

    const visitors = db.collection('visitors')

    const visitor = await visitors.findOne({ login })

    //console.log(visitor)
    
    if (visitor) {
      return response.json({
        user: {
          login: visitor.login,
          name: visitor.name,
          avatar_url: visitor.avatar_url,
          email: visitor.email,
          plataform: visitor.plataform,
        },
        visitor,
        score,
        subscribedAt: visitor.subscribedAt,
      })
    }

    //console.log('visitors:', visitors)
    //console.log('plataform,:', plataform)

    let user: any

    switch (plataform) {
      case 'fb':
        const userFB = await getApiFbUser({
          accessToken: auth.token,
          userID: login,
        })

        if (!userFB) {
          return response.status(404).json({ error: 'FB User not found' })
        }
        //console.log('userFB:', userFB)

        user = {
          login: userFB.id,
          name: userFB.name,
          avatar_url: userFB.pictureUrl,
          email: userFB.email,
          plataform: 'fb',
        }

        break

      case 'github':
        const { scope, token_type } = request.body

        const userGithub = await getApiGithubUser({
          access_token: auth.token,
          scope,
          token_type: token_type ?? 'bearer',  
        })

        user = {
          login: userGithub.login,
          name: userGithub.name,
          email: userGithub.email,
          avatarUrl: userGithub.avatar_url,
          plataform: 'github',
        }

        break

      default:
    }

    if (!user) {
      return response.status(400).json({
        error: 'User dos not exists!'
      })
    }
  
    const document = await visitors.insertOne(user) 

    return response.status(201).json({
      user,
      visitor: document.ops[0],
      score,
      subscribedAt: new Date,
    })
  }

  return response.json(dbUser)
}