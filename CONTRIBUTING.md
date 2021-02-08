# Contributing

Please, have a look at the [wiki](https://framagit.org/framasoft/ep_mypads/wikis/home).

## Tests

Tests can be launched with `npm run test`.

## LDAP tests

LDAP tests an be launched with `npm run test-ldap`.

You will need to have the [mockup LDAP server](https://github.com/rroemhild/docker-test-openldap) launched on your computer to run the LDAP tests.

The first time you start the container:

```
docker run --privileged -d -p 10389:10389 rroemhild/test-openldap --name test-openldap
```

After the first start of the container, you will be able to start it with:

```
docker start test-openldap
```

You will also need to make `rroemhild-test-openldap` resolve as your localhost (add it to your `/etc/hosts` file).

NOTE: the container `rroemhild/test-openldap` used to listen to ports 389 and 636 but the latest versions listen to ports 10389 and 10636.
If `npm run test-ldap` with errors like `ECONNREFUSED 127.0.0.1:389`, either to a `docker pull rroemhild/test-openldap:latest` or start the container with `389:389` port translation.
