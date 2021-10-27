# bookit

A simple demo website for a hall booking service

Available at: [https://b00kit-app.herokuapp.com/](https://b00kit-app.herokuapp.com/)

## Dependencies

- [express](https://www.npmjs.com/package/express): to create an `HTTP` server
- [mysql2](https://www.npmjs.com/package/mysql2): to communicate with the MySQL database

### Dev Dependencies

- [dotenv](https://www.npmjs.com/package/dotenv): to load environment variables
- [eslint](https://www.npmjs.com/package/eslint): to lint the JS codebase
- [nodemon](https://www.npmjs.com/package/nodemon): to restart the `express` app on any change in the files

## Local Deployment

To run locally:

- Clone this repo.
- Install dependencies with `npm` or `yarn`.
- Start a MySQL server or docker container.
- Create a database for the project on that server or docker container.
- Duplicate the `.env.example` at the root of the project, rename the new one to `.env`, and assign values to the variables in there.
- Run the `setup_db` script at the root of the project to setup and seed the database => `yarn run setup_db`.
- Run the `dev` script to start the express app at the root of the project => `yarn run dev`.
- Visit the local app at [http://localhost:5000](http://localhost:5000) in your browser.
