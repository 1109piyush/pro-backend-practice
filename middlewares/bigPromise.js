// try catch and async - await || use promise

module.exports = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);

  /* So whenever we building any large scale project wer first goal should be it's scalable and manageable when we create
a BigPromise middleware we are basically writing a code fr one time and reusing that code everywhere so it's dynamic in
nature...for example we want to validate headers that are coming from the front-end before every function so we have 2
options either add same logic inside every function where we want to check the headers or create a middleware to write
logic once and use that middleware before executing the function...in Ist case if logic changes we need to spend wer
whole night to change logic in every function in 2nd case just change it in middleware so BigPromise is executing some
logic before executing the function that is getting wrapped inside.


When we have a synchronous function then express catches errors for us. But when we have some asynchronous code
that is throwing some error then we have to pass that error to express's default error handler explicitly or else whenever our
asynchronous code crashes then we get that ugly Unhandled Promise stuff on our terminal.

Say we are building 2-3 routes and those routes do some database operation or some other asynchronous operation. We
can either user .then().catch() to handle our error. Or we can wrap the entire code of those route in a try catch block. Or
even better use a BigPromise ! we just need to wrap our code in the BigPromise and whenever error occurs the error get
passed to catch then as a parameter to the next() and express's default error handler handles that error for us. */
