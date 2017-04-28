# Bewty

> Pithy project description
MindFits is a psychological hygiene tracker that takes daily entry journal and generates useful insights.

Goals of project: Evoking mindfulness and improve users' emotional intelligence.

## Team

  - Brandon Wong
  - Eugene Song
  - Tim Nguyen
  - Whitney Zhu

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)

## Usage

This repository is the source of truth for MindFits application, used to:
 - Get a better understanding of underlying technologies that we used to build MindFits
 - Contribute to the project by openning pull request against the dev branch
 - Test existing APIs and components

## Requirements

- Node 6.4.x


## Setup

From within the root directory:
clone down the repo
```
git clone https://github.com/bewty/bewty.git
```
cd to the root directory of the project
```
cd ./bewty
```
install dependencies
```
npm install
```
start database
```
mongod
```
Note: if this fails, try ``` sudo mongod ```

stand up server
```
npm run dev-server
```
start webpack
```
npm run dev-build
```

start hacking!
```
npm install
```
### Configuration
The application is data driven, if you just want to get the taste of how the app would look like with a real user, user these credentials:
```
Phone Number : 123 123 123
Password: demo
```


### Roadmap

View the project roadmap [here](https://docs.google.com/spreadsheets/d/1U2LnuViAdiEOzhrswlQvq69frDh2r4jc7K7SI0TMMmI/edit#gid=0)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
