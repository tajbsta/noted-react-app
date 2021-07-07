# project-jarvis

Jarvis is our build deploy automation tool for private stacks.

# [How to publish to npm](https://docs.npmjs.com/getting-started/publishing-npm-packages)

This is a private repo and must be published as a private package on NPM. Only limited staff have access to publish.

- go to the root of the repository and run `npm login`
- add the user: `your-username`
- and the secret password: `xxxxxxxxxx`
- update package version with proper semantic versioning (https://docs.npmjs.com/about-semantic-versioning)
- run `npm publish`

# Installation

- Ensure you have a valid NPM token set in your `~/.npmrc` (see https://clicksend.atlassian.net/wiki/spaces/VPR/pages/1023115279/Setup+local+env)
- [npm](https://npmjs.org): `npm install -g @clicksend/jarvis`
- Test that it works: `jarvis -h`

# Developer Getting Started

- `npm i`
- `npm start`
- `npm link` - To locally install this library on your machine, the same as doing `npm i -g` for testing

## ALWAYS REMEMBER TO

`npm start`, because it will compile the typescript to javascript which is needed because it's the javascript that will be installed and run locally when a user npm installs this cli. So you need to commit both ts and js files inside dist directory.

# Available Commands
```
Commands:
  setup           Go through the setup guide.
  deploy          Deploy your own stack.
  destroy         Destroy prefixed stack.
  help [command]  display help for command
```

# Deploy/Destroy

## Prerequisites

- Docker
- Git CLI installed with a valid SSH key which has access to the required v4 repositories. Ensure that you have enabled SSO for your SSH key in GitHub, since this is a requirement for ClickSend repositories.
- Configure you have your `~/.env` setup as per the [documentation](https://clicksend.atlassian.net/wiki/spaces/VPR/pages/1023115279/Setup+local+env)

## Steps

1. Run `jarvis setup` and choose the branches you would like to deploy (defaults to `main`)
2. Run `jarvis deploy` and provide your prefix (should be your initials, e.g. `pd`)

Since API Gateway uses an edge deployment which needs to be deployed throughout CloudFront (CDN), it may take up to 40 minutes to deploy the custom domain for API Gateway, however this is a once off penalty. Once deployed, you will be provided with an API endpoint.

If you would like to test another branch of a particular service, run `jarvis setup`, specify that branch and run `jarvis deploy` again.

To destroy your deployment, run `jarvis deploy` and specify your prefix.

All commands can be run with an additional `-v` argument to provide verbose output.
