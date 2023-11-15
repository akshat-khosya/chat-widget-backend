# Project Name
Chat Widget Backend
## Description

I have used postman for demo purpose. There can be n number of clients and m number of hosts in this project. In starting all host are ideal until they find any client. As soon a client come they both are connected and there able to commuicate with each other and there chat is saved. Whenever admin get dissconected then another ideal host will be connected as soon as possible and new host will get pervoius chat done by host. When user leaves its chat gets ended, host moved to ideal state.



## Installation

To install the necessary dependencies, run the following command in the project root directory:

```bash
npm install
```

This command will install all the required Node.js packages specified in the package.json file.

## Starting the Application

## 1. Start the project in Development Mode:
```bash
convert .env.example to .env and put required Env Variables
```

```bash
npm run dev
```
This uses nodemon to watch for changes in the TypeScript files and automatically restarts the server. It is recommended for a smoother development experience.

## 2. Build the TypeScript Code:
```bash
npm run build
```
## 3. Start the Application in Production:
```bash
npm run server
```




