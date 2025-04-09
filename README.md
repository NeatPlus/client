# NEAT+

The Nexus Environmental Assessment Tool [(NEAT+)](https://www.neatplus.org) is designed for humanitarian actors to quickly identify issues of environmental concern to make emergency and recovery interventions more sustainable. Hosted by the UNEP/OCHA Joint Environment Unit, the NEAT+ aims to reduce the environmental impact of humanitarian activities through standardized, comparable screenings.

# NEAT+ Client

The NEAT+ client allows for users to access the NEAT+ content. Registered users can join or create organizations, create projects, and surveys. Various privacy settings allow for different levels of publicity. Results can be analysed by users, can be shared outside of the platform, and can be aggrigated for organisation-wide or sector-wide analysis.

# Installation Instructions

To get started follow the steps below:

#### Clone the repository to your machine, along with its submodules:
```
git clone --recurse-submodules https://github.com/NeatPlus/client.git
```

#### Install the required dependencies by running the following command in the project root directory:
```
cd client && yarn
```

#### Setup your project environment:
- Create a .env file in the project root directory and copy the environment variables from the .env.example file.
- Enter the correct values for each variable, then save the .env file.

#### Start the development server:

```
yarn start
```

This should open the development environment in your browser. You may also manually open the url:

```
http://localhost:3000/
```

### Main Dependencies

- React: JavaScript library for building user interfaces.
- React Router: Library that provides routing capabilities for React applications.
- Sass: CSS preprocessor that compiles SCSS into standard CSS.
- Redux: A library for managing and centralizing application state.

> ##### For better code quality and consistency, ESLint (for Javascript linting) and Stylelint (for CSS/SCSS linting) are used.
###### Make sure to install ESLint and Stylelint in your code editor for a smoother development process.

# Development Timeline

The content and features should be fully developed by the end of August 2022, with the potential for future development.

# License

All code found in this repository is licensed under GPL v3.
