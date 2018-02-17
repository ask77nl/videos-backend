## README ##

Test assignment demonstrating a simple Node.js microservice. It fetches lists of media objects from different sources, normalizes them and returns the resulting list via a REST API.


## Installation and start-up ##

This is a standard node.js microservice. Use the following npm commands:

* **npm run lint** - runs the eslint and should be preformed before each check in
* **npm start** - starts the server
* **npm run debug** - starts the server with node's built-in debugger
* **npm run build** - transpiles the source code with babel
* **npm run serve** - starts the babel-transpiled server

Server runs by default on port 4100. Use http://localhost:4100/videos?sorted=true to get a sorted JSON list of videos.

## Modules ##

Module separation follows 'Clean Architecture' principles by Martin Fowler
The microservice conists of the following modules:

- __Controllers__
Express endponts that accept requests via the network. The main goal is to map incoming parameters for a Search Logic function, execute Search Logic and return the result to the consumer.

- __Models__
Thin models are responsible for data mapping and normalization between external sources and Search Logic.

- __Services/Search Logic__
Search functions accept incoming parameters, sanitize then and perform all required data requests. Search logic is the place for all business logic. It is operating independently of any data sources formats or interfaces. 

- __Services/Data Requests__
Commands, that perform network requests to different services and map incoming data for Search Logic consumption

## Technologies ##

This is an [Express.js](http://expressjs.com/) service that utilizes 
[Babel](https://babeljs.io/) to support JavaScript ES6 and ES7 features. It enforces the 
[AirBnb JavaScript styleguide](https://github.com/airbnb/javascript).

It uses these JavaScript libraries:

* config
  - for environment based network configuration
* winston
  - for logging
* express
  - for HTTP server
  - for middleware
* lodash
  - for data manipulation
* dot-object
  - for data transformation

