const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Recipe server in running')
})

app.listen(port,() => {
    console.log('Recipe server is running on port:',port);
})