# URL SHORTENER

## Plan of the presentation

I explain with all the details how I build the project and my way of working.

- [Goal](#goal)
- [Plan of the presentation](#plan-of-the-presentation)
- [Prerequisite](#prerequisite)
- [Development](#development)
- [Production](#production)
- [System](#system)
- [Errors](#errors)

## Organization

#### Organization of the project

    .
    ├── .nx                               # Cache NX
    ├── apps                              # Contains all the apps of the project
         └── mongodb                      # The script for setting up the mongodb
         └── shortener                    # The react frontend
                └── locales               # The json file for i18n (multi language)
                └── src                   # The source file
                     └── app              # The app entrance file
                     └── assets           # The asset of the project
                     └── components       # The reusable component
                     └── interfaces       # The interface for typescript
                     └── pages            # The page for the project
                     └── services         # The services for calling the backend
                     └── styles           # The style of the frontend
         └── shortener-api                # The express backend
                └── src                   # The source file
                     └── dbs              # The link to the database
                     └── interfaces       # The interface for typescript
                     └── libs             # The libs containing constant, logger and utils
                     └── models           # The model to save in the database
                     └── services         # The services of the backend
         └── shortener-api-e2e            # The tests for the express backend (jest)
         └── shortener-e2e                # The tests for the react frontend (cypress)
    ├── env                               # Environment file
    ├── scenarios                         # The scenario for the load testing
    ├── seeding                           # Seed the database for the test
    ├── nginx                             # Contains the configuration for reverse proxy
    ├── node_modules                      # Contains all the dependencies of the two projects (monorepository)
    ├── .dockerignore                     # The file to ignore for docker
    ├── .eslintrc                         # The configuration for the linter
    ├── .prettierrc                       # The configuration for the prettier
    ├── docker-compose.yml                # File for managing the creation of container for docker
    ├── Dockerfile                        # Creation of container for our apps
    ├── nx.json                           # Setting of nx
    ├── package.json                      # Npm configuration file
    ├── package-lock.json                 # Npm locker version for module
    ├── tsconfig.base.json                # Shared configuration for typescript
    ├── vitest.workspace.json             # Shareed configuration if multiple frontend
    ├── LICENSE                           # Description of the license
    └── README.md                         # Presentation for the project

## Prerequisite

The project where the project will be running need to have the following too:

- Node 20 or Volta
- Npm 10 or higher
- Docker
- Docker Compose
- nx

```bash
$ npm add --global nx@latest
```

## Development

##### Without Docker

In dev mode, the user need to have at least mongoDB setup on his machine
Before starting the development mode without docker
```bash
$ npm install
```

In the terminal, type the following command:

```bash
$ npm run dev
```

##### With Docker

Since the production mode compile the project at every restart and since the project is small.
Without any installation needed, the user can the project using:

```bash
$ npm run up
```

In order to be the closest of possible of the production, modify the `/etc/hosts` with the following:

```bash
127.0.0.1 shortener.net mongodb server1
```

## Production

In the terminal, type the following command:

```bash
$ npm run up
```

#### Limit

- The project does not ensure the unicity of the short url. It means that if the short url unfortunaly has been generated with one already existing,
the url will be replace through an update.

## System

Ubuntu Version: Ubuntu 20.04.1
Node Version: v20.11.1
Npm Version: v10.5.0

The version are manage with [Volta](https://docs.volta.sh/guide/getting-started).

```bash
# Get the latest version of ubuntu
$ lsb_release -a

# Get the version of node
$ node -v

# Get the version of npm
$ npm -v
```

#### Errors

If your computer has not enough memory, in some case, the deamon of NX can fail to start or restart. In such case,  
you can run the following command to clean up the project:

```bash
$ nx reset
```