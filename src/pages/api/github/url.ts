import { NowRequest, NowResponse } from "@vercel/node";
import getGithubUrl from "../../../utils/githubUrl";

export default (_: NowRequest, response: NowResponse) => {
  return response.json(getGithubUrl())
} 