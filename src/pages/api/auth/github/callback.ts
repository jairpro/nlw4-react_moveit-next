import { NowRequest, NowResponse } from '@vercel/node'

export default async (request: NowRequest, response: NowResponse) => {

  console.log(request)

  return response.json("ok")  
}
