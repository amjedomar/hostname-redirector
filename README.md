# Hostname Redirector

A Node.js server to redirect a public hostname to another including the full URL and the port

**Examples of this server functionality**

- redirect `source-hostname.com` TO `destination-hostname.com`
- redirect `source-hostname.com/some-url-goes-here` TO `destination-hostname.com/some-url-goes-here`
- redirect `source-hostname.com/programs?withQuery=true` TO `destination-hostname.com/programs?withQuery=true`
- redirect `source-hostname.com/programs#withHash` TO `destination-hostname.com/programs#withHash`
- redirect `source-hostname.com:5050` TO `destination-hostname.com:5050`

## Requirements

- node.js `>=16.13.2`
- yarn `>= 1.22.15`

## Clone Repository

```bash
git clone https://github.com/amjedomar/hostname-redirector
```

## Scripts

- to install dependencies run:

```bash
yarn
```

- to run the development server run:

```bash
yarn dev
```

- to run the production server run:

```bash
yarn build && yarn start
```

- to run the production server using pm2 run:

```bash
yarn build && yarn start:pm2
```

## Setup Redirections

To tell the server the hostnames that will be redirected, set for each one of them an environment variable that follow these two rules

- First: its key (name) must starts with `REDIRECT_HOSTNAME_`
- Second: its value must follow this format

```
source-hostname.com -> destination-hostname.com
```

**Notice that:**

- you must NOT include a protocol in both source and destination hostnames
- you must NOT end hostnames with slash `/`
- you must NOT include a port
- you must spread the source and destination hostnames with `->` (and two spaces before and after `->` must be included)

**Redirection Environment Variables Examples**

```txt
REDIRECT_HOSTNAME_WWW_Example_COM='www.example.com -> example.com'
REDIRECT_HOSTNAME_2='my-tool.org -> my-tool.js.org'
```

> Note: the server should have the access of the hostnames that will be redirected otherwise the server can't redirect them.

> Also Note: you can also setup these environment variables by creating `.env` file in the root directory of this project and put them on it

## Deployment Guides

- [Deploy to Dokku](docs/deploy-to-dokku.md)
