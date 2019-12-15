This is a simple Blog Post REST API with JSON Web Token Authentication.

The below are the allowed CRUD operational urls available.
http://localhost:3000/home
http://localhost:3000/login
http://localhost:3000/signup

POST http://localhost:3000/users/login

POST http://localhost:3000/users/signup

GET http://localhost:3000/users/{id}

GET http://localhost:3000/users/

DELETE http://localhost:3000/users/{id}


GET http://localhost:3000/posts/

GET http://localhost:3000/posts/{id}

POST http://localhost:3000/posts/{id} ref Users ObjectID

DELETE http://localhost:3000/posts/{id}

UPDATE http://localhost:3000/posts/{id}

UPDATE http://localhost:3000/posts/comment/{id}