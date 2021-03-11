import axios from "axios";

export default async function getFbUserName(userToken: string) {
  try {
    const response = await axios.get('https://graph.facebook.com/v10.0/me', {
      headers: {
        Authorization: `Bearer ${userToken}`
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