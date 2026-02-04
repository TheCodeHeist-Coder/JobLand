import express, {Express} from 'express';
import { configDotenv } from 'dotenv';
configDotenv();

import authRoute from "./routes/auth.route.js"


const app:Express = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT || 3000;


app.use("/api/v1/user/", authRoute)



app.listen(PORT, () => {
    console.log('Server is still alive...')
})