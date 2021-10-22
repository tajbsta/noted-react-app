# noted-react-app (NPM BASED)

To Start Development you need to:

1. Install all dependencies
   `npm install`
2. Start Development Mode
   `cp .env.example .env` and update the values accordingly
   run `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# Scraper FE development

- navigate to scraper directory
- install packages `npm i`
- `npm start`

To build entire application for a production ready release, make sure you are in the root - `npm run build`

# Application Structure

## scraper folder

    - contains all the logic to handle the client-side scraping mechanism. This is bundled with webpack into a single file and placed in the build directory as need (see package.json file for more info)

## src folder

    - contains all of the application pieces including components, stylesheets, redux stores etc

## actions folder

    - contains all of the applications actions as used in the redux part of the application

## api folder

    - contains all of the apis used in the application wrapped around axios and aws cognito auth

## assets folder

    - This includes images, svgs, icons and SCSS stylesheets used across the application to maintain application branding

## components folder

    - This contains all the smaller components which were set up to complete specific tasks, including components set up to handle Forms, Navbars etc.

## constants folder

    - All constants used across the application are placed in this folder to avoid string mismatch when referencing items

## layouts folder

    - This folder sets up the layouts for the different states of the application. For example, when a user is logged in or when a user is logged out

## library folder

    - This folder contains any other custom code that doesn't belong within components. It houses code to help with things like notifications, scraper logic, client-side google api etc.

## modals folder

    - All the modals used across the application can be found in this folder

## models folder

    - This contains all the schema used for form validation as provided by the Yup module. It is commonly used in conjuction with Formik

## pages folder

    - All of the application pages and Higher Order Components are present in this folder. It serves as the entry point for several pages in the application. A sub component folder is usually present for each page containing smaller pieces of UI for the parent page

## reducers folder

    - contains all of the applications reducers as used in the redux part of the application

## routes folder

    - contains the routing logic for the application.

## static folder

    - contains fonts and some unique images used across the application

## store folder

    - contains the redux store and configurations

## utils folder

    - helper functions and hooks used across the application to perform minor tasks such as string manipulation, timing, determining credit card types

## App.js

    - entry point of the application. Contains all the Wrapper components for modules such as redux-persist, react-router-dom, redux etc.
