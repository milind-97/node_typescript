# task
# Dockerized Node.js Application with MongoDB



This project contains two Node.js services (`userservice` and `adminservice`) and a MongoDB database, all orchestrated using Docker and Docker Compose. The setup allows for easy deployment and management of the entire stack.

## Prerequisites
go to each service root directory and create .env file with environment variables refer the .env.example for required variables


Make sure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

run below command in application root directory 
1. docker-compose up --build

steps to run individual service

1. run below command in service directory
a. npm install
b. npm start

