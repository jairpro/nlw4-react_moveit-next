import { FbUserData, FbUserResponse, getFbUser } from "../../fb/user"

export async function getApiFbUser(data: FbUserData): Promise<FbUserResponse> {
  try {
    //console.log('getApiFbUser data:', data)

    const { userID, accessToken } = data

    const response: any = await getFbUser({
      accessToken,
      userID,
    })

    //console.log("response data: ", response)
    
    if (response) {
      return response
    }
  }
  catch (error) {
    console.log('/api/fb/user error: ', error.message)
  }

  console.log("passei por aqui :/")
  return null
}
