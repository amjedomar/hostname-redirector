## Create App
```
dokku apps:create hostname-redirector
```

```
dokku buildpacks:set hostname-redirector https://github.com/heroku/heroku-buildpack-nodejs#v189
```

```
dokku config:set hostname-redirector NODE_ENV='production'
``` 

## Setup Redirections
- First: you must add a DNS record to the DNS of each hostname that will be redirected, and this DNS record must point to the ip of the same machine that dokku in, then you have to give the `hostname-redirector` app the access of the hostnames that will be redirected by running the following command for each hostname that will be redirected
```
dokku domains:add hostname-redirector www.example.com
```

- Second: Setup Redirection Environment Variables by run the following command for each hostname that will be redirected
```
dokku config:set hostname-redirector REDIRECT_HOSTNAME_WWW_EXAMPLE_COM='www.example.com -> example.com'
``` 

## Https Certificate
- install letsencrypt plugin

```
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
```

- add cron job

```
dokku letsencrypt:cron-job --add
```

- enter your email

```
dokku config:set --no-restart hostname-redirector DOKKU_LETSENCRYPT_EMAIL=your-email@any-domain.com
```

- issue the certificate

```
dokku letsencrypt:enable hostname-redirector
```

## Push Code
first navigate to this repository root then push code
```
git push dokku@www.example.com:hostname-redirector main
```
