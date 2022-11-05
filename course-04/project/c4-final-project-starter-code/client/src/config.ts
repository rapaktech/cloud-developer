// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'xl9z4b7rak'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-m082fkul.us.auth0.com', // Auth0 domain
  clientId: '366fAmWmfjTkQcTL1ANPvmlHWM2Sf5zX', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
