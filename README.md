# Solfate Podcast

The [Solfate Podcast](https://solfate.com/) is an audio commentary from two
developers building on Solana, Nick
([@nickfrosty](https://twitter.com/nickfrosty)) and James
([@jamesrp13](https://twitter.com/jamesrp13)).

## Solfate Podcast Links

- Website - https://solfate.com/podcast
- RSS feed - https://feeds.transistor.fm/solfate
- [@SolfatePod](https://twitter.com/SolfatePod) on Twitter
- [@SolfatePod](https://youtube.com/@SolfatePod) on YouTube

## Solfate Podcast Hosts

The Solfate Podcast is hosted by two gents:

**Nick**

- follow on twitter: [@nickfrosty](https://twitter.com/nickfrosty)
- follow on github: [github.com/nickfrosty](https://github.com/nickfrosty)
- website: https://nick.af

**James**

- follow on twitter: [@jamesrp13](https://twitter.com/jamesrp13)
- follow on github: [github.com/jamesrp13](https://github.com/jamesrp13)

## Local Development

First, run the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

## Database

This NextJS app uses:

- PlanetScale for the MySQL database, and
- Prisma for the database ORM

The database schema is stored within the `prisma.schema` file.

### Making changes to the schema

After the desired database schema changes have been made locally and verified
working on a local database,

> Note: Ensure you are connected to the correct PlanetScale organization (via
> `pscale org show` and `pscale org switch <org-name>`).

1. Create a new branch on the PlanetScale database:

```shell
pscale branch create solfate-main <feature-branch-name>
```

2. Locally connect to the newly created database branch

```shell
pscale connect solfate-main <feature-branch-name> --port 3309
```

3. Ensure your ENV file has the `DATABASE_URL` set to connect to PlanetScale via
   the local tunnel:

```
DATABASE_URL="mysql://root@127.0.0.1:3309/solfate-main"
```

4. Push the schema changes to the remote database:

```shell
yarn prisma db push
```

5. Open a "deploy request" on the PlanetScale database to handle any breaking
   schema changes:

```shell
pscale deploy-request create solfate-main <feature-branch-name>
```

6. When the database changes are satisfied and breaking changes are ready,
   complete the database deploy request, making the changes live on the
   production database:

```shell
pscale deploy-request deploy <feature-branch-name> <number>
```

Done!
