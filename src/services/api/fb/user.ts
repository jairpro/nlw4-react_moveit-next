import { AxiosResponse } from "axios"
import api from '../../api'
import { ApiFbUserResponse } from '../../../pages/api/fb/user'

export interface ApiFbUserData {
  accessToken: string
  userID?: string
}

export async function getApiFbUser(data: ApiFbUserData): Promise<ApiFbUserResponse> {
  try {
    const { userID, accessToken } = data

    const response: AxiosResponse = await api.post('/api/fb/user', {
      userID 
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    })

    if (response && response.data) {
      return response.data
    }
  }
  catch (error) {
    console.log('/api/fb/user error: ', error)
  }

  return null
}
