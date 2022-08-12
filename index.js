const http = require('http')
const express = require('express')

const app = express();
const PORT = 5002;
const options = {};

app.use( express.static( "./", { maxAge: 5*1000 } ) )

http.createServer(options, app).listen(PORT, ()=>{
	console.log("App listening on port " + PORT)
})

