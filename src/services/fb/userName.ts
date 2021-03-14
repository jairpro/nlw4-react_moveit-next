import axios from "axios";
import { FbUserData } from "./user";

export default async function getFbUserName(data: FbUserData) {
  try {
    const response = await axios.get(`https://graph.facebook.com/v10.0/${data.userID}?fields=name,email`, {
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      },
    })

    if (response && response.data) {
      return response.data
    }
  }
  catch(error) {
    console.log('getFBUserName error:', error)
  }

  return null
}