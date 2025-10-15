import "./config.js"
import connectDb from "./db/index.js"
import { app } from "./app.js";

const port = process.env.PORT || 8080;

//connectDB here
//if success connection
//start server

connectDb()
.then(()=>{
  app.listen(port, () => {
    console.log(`⚙ Server Running at port : ${port} `);
  })
}).catch((err)=>{
  console.log("MongoDb failed to connect with the server.")
})


