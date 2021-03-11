export function requestToToken(request: any) {
  const { authorization } = request.headers
  
  if (!authorization) {
    return false
  }

  const [, token] = authorization.split(" ")

  return token
}