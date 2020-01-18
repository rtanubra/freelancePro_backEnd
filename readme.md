# Freelance Pro

## Summary
A Customer Relationship Manager (CRM) is a necessary tool for all businesses to thrive. Freelance Pro is the solution tailored for Freelancers to grow their business! A lightweight CRM that allows users to better manage and engage with their clients and prospects. Full feature list below! If you are interested in using the application please see "Join - Freelance Pro" section

### Features
<ol>
    <li>Track your services</li>
    <li>Track your client engagements</li>
    <li>Create and Track promotions to reward your clients</li>
    <li>Connect directly to your email
        <ul>
            <li>Email promotions</li>
            <li>Email Invoices</li>
            <li>Email Thank You's</li>
        </ul>
    </li>
    <li>Connect directly to your Google Calender to schedule appointments </li>
    <li>Analyze your earnings by month/ clients</li>
</ol>

### Try it out
Visit the deployment for this site https://freelancepro-client.rtanubra.now.sh and follow the Give us a quick try section on the landing page.

### Join - Freelance Pro
To use the full features of the application, a bit of back end work needs to be done to connect to your email and callender. I would love to help you with that, contact me below:

Contact Rey Tanubrata - rdtanubrata@gmail.com

## Links

### Deployment for this site:
https://freelancepro-client.rtanubra.now.sh

### Backend Github
https://github.com/rtanubra/freelancePro_backEnd

### Frontend Github
https://github.com/rtanubra/FreeLancePro_Client

## Current and Future Clients

### Feature Request
If you would like to request features to be added to this CRM or collaborate on development, please reach out to me at my contact below.

### Contact
Email - rdtanubrata@gmail.com

## Available Scripts
### `npm start`
Runs the app in the development mode.<br>
### `npm test`
Launches the test runner in the interactive watch mode.<br>
### `npm run build`
Builds the app for production to the `build` folder.<br>
### `npm run deploy`
Builds and deploys your application to production<br>

## API Documentation

Development Server located at: [http://localhost:8000/api/](http://localhost:8000/api/)

Production Server located at: [https://stark-beach-37537.herokuapp.com/api/](https://stark-beach-37537.herokuapp.com/api/)

All return objects (if present) will be in JSON objects. All input bodies (if required) are JSON objects.

<ol>
    <li>Authentication</li>
    <li>Promos</li>
    <li>Clients</li>
    <li>Services</li>
    <li>Emails (Continuing Development)</li>
</ol>

### `Authentication`

#### `POST: /login`

Posts a user authentication for login. 
Body should include:

<ul>
    <li>email - base 64 encoded</li>
    <li>password - base 64 encoded</li>
</ul>

Success will return:
<ul>
    <li>authToken</li>
    <li>Payload
        <ul>
            <li>user_id</li>
            <li>email</li>
        </ul>
    </li>
</ul>

Failure will return:
error

### `Promos`

Promos endpoint is protected. All protected endpoints require an authentication header. Authentication header is a bearer token with an authtoken obtained from Authorization.

#### `GET: /promos`

Gets all promotions from flp_promos table

Success returns an array of promotion objects

#### `GET: /promos/{promoId}`

Gets a single promotion object from flp_promos table

Success returns a single promotion object

Failure returns an error.

#### `POST: /promos`

Posts a single promotion object into flp_promos

Requires body to contain an object with:
<ul>
    <li>user_id *required</li>
    <li>name *required</li>
    <li>description *required</li>
    <li>date_created *optional</li>
    <li>date_ending</li>
</ul>

Success returns a single promtion object (the object created)

Failure returns a single object {error:######}

### `Clients`

Clients endpoint is protected. All protected endpoints require an authentication header. Authentication header is a bearer token with an authtoken obtained from Authorization.

#### `GET: /clients`

Gets all the clients in flp_clients
Control with displaying clients for specific user is controlled by the front end application.  

#### `POST: /clients`

Posts a single client object into flp_clients

Body requires:

<ul>
    <li>user_id *required</li>
    <li>name *required</li>
    <li>email *required</li>
    <li>phone *required</li>
    <li>description *optional</li>
</ul>

Success will return a single client object (the object created)

Failure will return a single object {error:#######}

#### `GET: /clients/{clientId}`

Gets a single client from flp_clients

#### `DELETE: /clients/{clientId}`

Deletes a single client object from flp_clients

#### `PATCH: /clients/{clientId}`

Updates a single client object at flp_clients

Requires a body with all values. Only provide values to be updated

<ul>
    <li>user_id *optional</li>
    <li>name *optional</li>
    <li>email *optional</li>
    <li>phone *optional</li>
    <li>description *optional</li>
</ul>

### `Services`

Services endpoint is protected. All protected endpoints require an authentication header. Authentication header is a bearer token with an authtoken obtained from Authorization.

#### `GET: /services`

Gets all the services in flp_services
Control for displaying services for specific user is controlled by the front end application.  

#### `POST: /services`

Posts a single service object into flp_services
object should contain below:

<ul>
    <li>notes *required</li>
    <li>cost *required</li>
    <li>people *required</li>
    <li>promo_id *optional</li>
    <li>client_id *required</li>
    <li>user_id *required</li>
</ul>

Success returns a single service object.

Failure returns a single object {error:####}

#### `GET: /services/{serviceId}`

Gets a single service object if available.


#### `DELETE: /services/{serviceId}`

Deletes a single service object if available.

#### `PATCH: /services/{serviceId}`

Updates a single client object at flp_clients

Requires a body with optional values. Only provide values to be updated.

<ul>
    <li>notes *optional</li>
    <li>cost *optional</li>
    <li>people *optional</li>
    <li>promo_id *optional</li>
    <li>client_id *optional</li>
</ul>

### `Emails` -Under Continuing Development

Emails API can be tailored to each specific user. This functionality may require specialized solution because some email provider no longer allow SMTP functionality. Gmail, is proving more and more challenging when providing access to emails to less secure applications.