In this tutorial we will make an Express backend and a React frontend app. We are going to deploy them at a single dyno on Heroku!

Having both frontend and backend in the same dyno requires to provide a way to serve them together. To do so, we will set up a proxy making Express serving both parts.

So, let us start!

### Creating the backend
Here we will create the root folder for our project. You can choose any name for your project instead.

```
$ mkdir erh-example
$ cd erh-example
``` 
We will initialise it using [Yarn package manager](https://yarnpkg.com/).
```
$ yarn init
```
You can just go pressing ENTER for each question that `yarn init` prompts you. It will ends up creating a `package.json` file.

Then we will add a few dependencies to our project: [express](https://www.npmjs.com/package/express) a web application framework for Node.js and [cors](https://www.npmjs.com/package/cors) a protocol that allows scripts on a browser to interact with resources in other origins. Let us run the following command:
```
$ yarn add express cors
```
This command adds to `package.json` the referred dependencies and also creates/updates `yarn.lock` file for maintaining installation consistency.

Let us create a specific folder for the backend, just for our organization.

```
$ mkdir backend
$ cd backend
```
Our backend will have just two routes, one for returning the sentence "Hello from api!" and another for serving the frontend part which we will discuss later. So, let us create a file called `server.js` filling it with following code:

```
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
Let us check if it is working. Back to the project's root folder, we need to edit the packages.json file. We can just add a comma after the closing curly brace of `dependencies` and paste the following part on it.

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

Browsing [http://localhost:5000/api/hello](http://localhost:5000/api/hello) should show a json object in which the content is `{"text":"Hello from api!"}`. Notice that it being returned directly from the api.

### Creating the frontend
So, let us create our frontend app. In this tutorial we are not going to make an appealing user's interface, instead we are focusing to make it very simple.

We will use `create-react-app` webpack configuration for creating a React app in which we will fill up with a few new codes.

```
$ yarn create react-app frontend
```
This command creates the folder `frontend` containing other subfolders, specially, the `src` and `public` with default content. Our frontend also has its own `package.json` file which is already set with React dependencies and scripts. We just need to edit this file for setting up our frontend to use the existing server. We can just add the following part on it:

```
  "proxy": "http://localhost:5000"
```
Now, in the frontend folder, we can launch our React app in a development environment using the following command: 
```
$ yarn run start
```
By default, the browser will open a default react app. If everything is fine, we should see the a moving React logo. You can also manually browse the address [http://localhost:3000/](http://localhost:3000/). We can shutdown this development environment using Ctrl+C command.

Let us check if the proxy is working. Still in the frontend folder, let us build the code executing:
```
$ yarn run build
```
Assuming the server is still running, we can browse the root adress [http://localhost:5000/](http://localhost:5000/) and check if our React app is now there. Notice that by default the development environment runs at port 3000, now we are running our frontend in the same port 5000 in which we set our backend. If our React app is working on 5000 it seems the proxy configuration is working properly.

So now, let us replace the default content of the `src/App.js` file with the following code:

```
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
    this.setState({ text });
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

In this code we are just printing "Hello from the client" which is a content given by the frontend part and "Hello from the api" which is given by the api (from the json we can access at [http://localhost:5000/api/hello](http://localhost:5000/api/hello)).

To check if it is working, after editing `src/App.js`we can just build our front end again and open our browser on [http://localhost:5000/](http://localhost:5000/).
```
$ yarn run build
```
We should see our very primitive interface printing our greetings from both back and frontend parts.

### Deploying to Heroku

To deploy on heroku we need to have an active account (there is a free option) and we will need heroku CLI. We can grab the CLI executing the following command:
```
$ yarn global add heroku
```
Now we have to initialize a git repo executing the following commands from our project's root folder.

```
$ git init
$ echo node_modules > .gitignore
$ git add .
$ git commit -m "First commit"
```

Let us connect it to heroku using heroku CLI. The login command will open a tab in the browser for confirming the login. Here I am using the project name `erh-example`, you may need to specify another name for your app.
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
The push command will return heroku building and deployment logs, we should see at the end the following returned message:

> remote:        <https://erh-example.herokuapp.com/> deployed to Heroku<br>
> remote: Verifying deploy... done.<br>
> To <https://git.heroku.com/erh-example.git><br>
> [new branch]      master -> master

If everything went well, we are able to open our deployed app in the given heroku address, in my case [https://erh-example.herokuapp.com/](https://erh-example.herokuapp.com/). The api also should be visible using the URI [https://erh-example.herokuapp.com/api/hello](https://erh-example.herokuapp.com/api/hello).

That is all! The source code is available on github: [https://github.com/cleberjamaral/erh-example/](https://github.com/cleberjamaral/erh-example/)