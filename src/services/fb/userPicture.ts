import axios from "axios";
import { ApiFbUserData } from "../api/fb/user";

export default async function getFbUserPicture(data: ApiFbUserData) {
  try {
    const { accessToken, userID } = data

    const response = await axios.get(`https://graph.facebook.com/v10.0/${userID}/picture/?redirect=0&type=large`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      /*data: {
        redirect: '0',
        type: 'large',
      }*/
    })

    if (response && response.data && response.data.data) {
      return response.data.data
    }
  }
  catch(error) {
    console.log('getFBUserPicture error:', error)
  }

  return null
}