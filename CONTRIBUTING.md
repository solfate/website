# Contributing

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

## Caveats

Much like any code base, there are some caveats and "foot-guns" scattered
throughout this repo:

### Vercel for deployments

This repo is configured to deploy to Vercel. As such, there maybe be hard coded
values or Vercel specific environment variables used.

During "preview" deployments, Vercel will auto generate unique subdomains for
the web app. As such, some functionality may not work correctly due misaligned
domains.

### Next Auth

NextAuth normally requires the `NEXTAUTH_URL` env variable set. On Vercel, this
is not required to be set since NextAuth will auto-magically use the deployment
URL created by Vercel and set in the `VERCEL_*` env variables.

We use secure cookies with NextAuth, which requires the correct domain. If the
domain value is set incorrectly, then no one will be able to sign in. We are
setting this to the primary site domain on production deployments, and the
generated `VERCEL_BRANCH_URL` for preview deployments. All preview deployments
are expected to be viewed from the Vercel branch URL in order for auth based
functionality to work.

#### OAuth providers

This web app supports connecting a few a external social accounts via OAuth
providers (like Twitter and GitHub). Most OAuth applications require a hardcoded
callback and/or webhook URL for the deployed website, none of which support
wildcard domains.

Each OAuth provider has a hardcoded callback URL that may not matched the auto
generated preview/branch deployment URLs created by Vercel. As such, many OAuth
provider connections will not work on the preview deployments. They can be
manually configured to work with the OAuth providers dashboards.
