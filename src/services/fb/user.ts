import getFbUserName from "./userName";
import getFbUserPicture from "./userPicture";

export interface FbUserData {
  accessToken: string
  userID?: string
}

export interface FbUserResponse {
  id: string
  name: string
  pictureUrl: string
  email?: string
}

export async function getFbUser(data: FbUserData): Promise<FbUserResponse> {
  const user = await getFbUserName(data)

  if (!user) {
    return null
  }

  const picture = await getFbUserPicture(data)

  const result: FbUserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    pictureUrl: (picture && picture.url) ?? '', 
  }

  return result
}