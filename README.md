# Backend authentication service/API
![Repo Size](https://img.shields.io/github/repo-size/JayS-v/auth-server)

## Description
Secure backend service built with Express.js, TypeScript and cloud-based MongoDB, focusing primarily on authentication functionalities.

## Futures

* **User Authentication**: Register new users, authenticate existing users
* **Role-based Access Control**: Implement role-based access control to restrict access to certain routes or resources based on user roles
* **Token-based Authentication**: Utilize JSON Web Tokens (JWT) for stateless authentication, ensuring secure and efficient communication between clients and the server
* **Password Hashing**: Safeguard user passwords by securely hashing them
* **Cloud-based MongoDB Database**: Store user information, authentication tokens, and other data in a MongoDB database hosted in the cloud
* **Express.js Middleware**: Implement various Express.js middleware for handling requests, parsing data, and managing authentication

## Test deployed API: `auth-server-api.jayseyidov.com`

You can interact with the deployed API endpoints to test the functionality 

*Please note that these endpoints are for testing purposes only and should not be used in a production environment! When using these endpoints, ensure to **enter only fake data** for testing purposes!*

- **Registration**: `POST /auth/registration` - Register a new user by providing an email and password.
- **Login**: `POST /auth/login` - Authenticate a user by providing valid credentials and receive a JWT token in response.
- **Get Users**: `GET /auth/users` - Retrieve a list of all users (requires authentication and appropriate role). Please enter fake data when testing this endpoint.
- **Verify Token**: `GET /auth/verify` - Verify the authenticity of a JWT token and retrieve user information.

You can also use my client-side application available at [https://auth-client-app.jayseyidov.com](https://auth-client-app.jayseyidov.com) to test these routes interactively.


## Set up locally

1. **Clone the Repository**: Clone this repository to your local machine
2. **Install Dependencies**: Run `npm install` to install all necessary dependencies
3. **Set Up Environment Variables**: Create a `.env` file based on the provided `.env.example` and configure environment variables such as database connection settings and secret keys
4. **Run the Development Server**: Execute `npm run dev` to launch the Express.js server using nodemon. The server will automatically restart when changes are detected in the source files

## Build

To compile the TypeScript code into JavaScript, run the following command:

```bash
npm run build
```

## Contributing

Contributions are welcome! If you encounter any issues, have suggestions for improvements, or would like to contribute new features, feel free to open an issue or submit a pull request

## License

This project is licensed under the ISC License. Refer to the `LICENSE` file for details.