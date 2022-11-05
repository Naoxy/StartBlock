//load the things we need
const express = require('express')
const app = new express()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newPostController = require('./controllers/newPost')
const validateMiddleWare = require('./middleware/validateMiddleWare')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const expressSession = require('express-session')
const authMiddleware = require('./middleware/authMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const logoutController = require('./controllers/logout')
const flash = require('connect-flash')


let port = process.env.PORT;
if (port == null || port == "") {
    port = 4000;
}
app.listen(port, () => {
    console.log('App listening...')
})


//Connecting to MongoDB from node
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://newuser1:<your_password>@cluster0- vxjpr.mongodb.net/my_database', { useNewUrlParser: true })


app.set('view engine', 'ejs')

app.use(expressSession({
    secret: 'keyboard cat'
}))



global.loggedIn = null;

app.use(flash())

app.use("*", (req, res, next) => {
    loggedIn = req.session.userId
    next()
})

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())

app.use('posts/store', validateMiddleWare)


app.get('/', homeController)
app.get('/post/:id', getPostController)
app.get('/posts/new', authMiddleware, newPostController)
app.post('/posts/store', authMiddleware, storePostController)
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/auth/logout', logoutController)

app.use((req, res) => res.render('notfound'))



