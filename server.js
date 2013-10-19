var connect = require('connect');
var port = process.env.PORT || 5000;

connect()
  // disabled compress for development where data size isn't enough to make it worth
  // .use( connect.compress() )
  .use( connect.logger({format:"dev"}) )
  .use( connect.static( __dirname + '/') )
  // also experiencing worse performance in dev while using in-memory caching
  // .use( connect.staticCache() )
  .listen( port );

console.log("Connect server listening on port %d", port);