import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000


//get the file path from the url of the current module
const __filename = fileURLToPath(import.meta.url)
// get the directory name from the file path
const __dirname = dirname(__filename)

// middleware
app.use(express.json())


// serve the html file from the /public directory
// tells express to serve all the firls friom the public folder as static asset
// /file., Any requests to the css file will be resolved to the public directory

app.use(express.static(path.join(__dirname, '../public'))) // tells our code way to find the public directory


// serving up the html file from the /public directory 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname , 'public', 'index.html'))
})

//routes
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)


app.listen(PORT, () => {
    console.log(`Server has started at the port ${PORT}`)
})