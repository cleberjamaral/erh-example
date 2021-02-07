In this tutorial, we will make an Express backend and a React frontend app. We are going to deploy them to a single dyno on Heroku!

Having both frontend and backend in the same dyno requires us to provide a way to serve them together. To do so, we will set up a proxy making Express serving both parts.

So, let us start!

### Creating the backend
Here we create the root folder for our project, which we name `erh-example`. You can choose any name for your project instead.

```
$ mkdir erh-example
$ cd erh-example
``` 
We initialize it using [Yarn package manager](https://yarnpkg.com/).
```
$ yarn init
```
You can just go ahead by pressing ENTER for each question that `yarn init` prompts you. It will end up creating a `package.json` file.

Then, we add a few dependencies to our project: [express](https://www.npmjs.com/package/express), a web application framework for Node.js, and [cors](https://www.npmjs.com/package/cors), a protocol that allows scripts on a browser to interact with resources of other origins. Let us run the following command:
```
$ yarn add express cors
```
This command adds the referred dependencies to `package.json` and also creates/updates a `yarn.lock` file for maintaining installation consistency.

Let us create a specific folder for the backend, just for our organization.

```
$ mkdir backend
$ cd backend
```
Our backend will have just two routes, one for returning the sentence "Hello from api!" and another for serving the frontend part, which we will discuss later. So, let us create a file called `server.js` and add the following code:

```JavaScript
const express = require('express')
const cors = require('cors')

const app = express()

/* The api/backend route */
app.get('/api/hello/', cors(), async (req, res, next) => {
  try {
    const moo = cowsay.say({ text: 'Hello from api!' })
    res.json({ moo })
  } catch (err) {
    next(err)
  }
})

/* The client/frontend route */
const path = require('path')
app.use(express.static(path.join(__dirname, '../frontend/build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../frontend/build/index.html'))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
``` 
Let us check if it is working. Back in the project's root folder, we need to edit the `package.json` file. We can just add a comma after the closing curly brace of `dependencies` and paste the following part into it.

```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node ./backend/server.js",
    "heroku-postbuild": "cd frontend && yarn && yarn run build"
  }
```
In the project's root folder, let us launch our server.
```
$ yarn start
``` 
As a result, we should see on the console the following output: 

> Server is running on port 5000 

Browsing [http://localhost:5000/api/hello](http://localhost:5000/api/hello) should show a json object in which the content is `{"text":"Hello from api!"}`. Notice that it is returned directly by the API.

### Creating the frontend
So, let us create our frontend app. In this tutorial we are not going to make an appealing user interface; instead, we are focusing on making it very simple.

We will use the `create-react-app` webpack configuration for creating a React app, to which we add a bit of custom code.

```
$ yarn create react-app frontend
```
This command creates the folder `frontend` containing other subfolders, specially, the `src` and `public` folders with default content. Our frontend also has its own `package.json` file, which is already set with React dependencies and scripts. We just need to edit this file for setting up our frontend to use the existing server. We can just add the following part to it:

```
  "proxy": "http://localhost:5000"
```
Now, in the frontend folder, we can launch our React app in a development environment using the following command: 
```
$ yarn run start
```
By default, the browser will open a default React app. If everything is fine, we should see the a moving React logo. You can also manually browse the address [http://localhost:3000/](http://localhost:3000/). We can shutdown this development environment using the Ctrl+C command.

Let us check if the proxy is working. Still in the frontend folder, let us execute the build:
```
$ yarn run build
```
Assuming the server is still running, we can browse the root address [http://localhost:5000/](http://localhost:5000/) and check if our React app is now available. Notice that by default, the development environment runs at port 3000; now, we are running our frontend on the same port (5000) to which we set our backend. If our React app is running on 5000, it seems the proxy configuration is working properly.

So now, let us replace the default content of the `src/App.js` file with the following code:

```JavaScript
import React, { Component } from 'react'
import './App.css'

class App extends Component {
  state = {
    text: ''
  }
  
componentDidMount() {
    this.fetchHello()
  }
  
fetchHello = async () => {
    const response = await fetch('/api/hello');
    const helloresponse = await response.json();
    const text = helloresponse.text;
    this.setState({ text })
  }

  render() {
    return (
      <div className="App">
        <h3>Hello from the client!</h3>
        <code>{this.state.text}</code>
      </div>
    )
  }
}
export default App
```

In this code snippet we are just printing "Hello from the client", which is a content provided by the frontend part and "Hello from the api" which is provided by the API (from the JSON we can access at [http://localhost:5000/api/hello](http://localhost:5000/api/hello)).

To check if it is working, after editing `src/App.js`, we can just build our frontend again and open our browser on [http://localhost:5000/](http://localhost:5000/).
```
$ yarn run build
```
We should see our very primitive interface printing our greetings from both backend and frontend parts.

### Deploying to Heroku

To deploy to heroku, we need to have an active account (there is a free option) and we will need heroku CLI. We can grab the CLI executing the following command:
```
$ yarn global add heroku
```
Now we have to initialize a git repo by executing the following commands from our project's root folder.

```
$ git init
$ echo node_modules > .gitignore
$ git add .
$ git commit -m "First commit"
```

Let us connect it to heroku using heroku CLI. The login command will open a tab in the browser for confirming the login. Here I am using the project name `erh-example` -- you may need to specify another name for your app.
```
$ heroku login
$ heroku create erh-example
```
As result we should see a message similar to: 
> Creating erh-example... done<br>
> <https://erh-example.herokuapp.com/> | <https://git.heroku.com/erh-example.git>

Finally, we just need to push our local git repo to remote heroku using the following command:
```
$ git push heroku master
```
The push command will return the heroku build and deployment logs; we should see them at the end of the following returned message:

> remote:        <https://erh-example.herokuapp.com/> deployed to Heroku<br>
> remote: Verifying deploy... done.<br>
> To <https://git.heroku.com/erh-example.git><br>
> [new branch]      master -> master

If everything went well, we are able to open our deployed app in the given heroku address, in my case [https://erh-example.herokuapp.com/](https://erh-example.herokuapp.com/). The API also should be visible using the URI [https://erh-example.herokuapp.com/api/hello](https://erh-example.herokuapp.com/api/hello).

That is all! The source code is available on GitHub: [https://github.com/cleberjamaral/erh-example/](https://github.com/cleberjamaral/erh-example/)