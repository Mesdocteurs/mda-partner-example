# MDA Partner Example

This repository is an example of OAuth MDA Process.

## Requirements

- [Node JS Server](https://nodejs.org/en/)

| Environment Variable (* = required) | Description                                      | Example                                                   |
|-------------------------------------|--------------------------------------------------|-----------------------------------------------------------|
| PORT                                | Change default port <br><br>(Default: 3000)      | process.env.PORT=5000                                     |
| MD_CLIENT_ID *                      | Your MesDocteurs OAuth Application Client Id     | process.env.MD_CLIENT_ID="MyMDClientId"                   |
| MD_CLIENT_SECRET *                  | Your MesDocteurs OAuth Application Client Secret | process.env.MD_CLIENT_SECRET="MyMDClientSecret"           |
| PARTNER_CLIENT_ID *                 | Your OAuth Application Client Id                 | process.env.PARTNER_CLIENT_ID="MyPartnerClientId"         |
| PARTNER_CLIENT_SECRET *             | Your OAuth Application Client Secret             | process.env.PARTNER_CLIENT_SECRET="MyPartnerClientSecret" |
| MD_OAUTH_BASEURL *                  | URL for MDA OAuth (Client)                       | process.env.MD_OAUTH_BASEURL="http://0.0.0.0:4200"        |
| MD_API_BASEURL *                    | URL for MDA API (Server)                         | process.env.MD_OAUTH_BASEURL="http://0.0.0.0:3000"        |

## REST Routes

Server with PORT (default 3000)

- `GET /`-> Display a page where you can click to simulate a mda oauth worflow with a success process (User Allow) or a fail process (Access Forbidden for user)
- `GET /oauth/callback` -> This page will execute the oauth process (see more in the documentation)
- `GET /oauth/allow` -> This page will allow User to be connected to this server only if your provide a query param name status=true (Allow Access -> `/oauth/allow?status=true` | Forbidden Access `/oauth/allow`)

Server with PORT + 1  (default 3001)

- `GET /oauth/success` -> This page will inform you that the MDA OAuth Process is working and will show user information (who try to connect to your application)

## Start Application

```sh
npm run start
```

OR

```sh
node index.js
```
