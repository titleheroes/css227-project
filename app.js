const { db } = require('./models/user');

const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        
        User            = require('./models/user'),
        seedDB          = require('./seeds');

var indexRoutes = require('./routes/index'),
    moviesRoutes = require('./routes/movies'),
    cinemasRoutes = require('./routes/cinema');
    commentRoutes = require('./routes/comment');
    reserveRoutes = require('./routes/reserve');
    userRoutes = require('./routes/user');

mongoose.connect('mongodb://localhost/Movies');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
// seedDB();

//Settings Passport
app.use(require('express-session')({
    secret: 'secret is always secret.',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//  Routes
app.use('/', indexRoutes);
app.use('/movies', moviesRoutes);
app.use('/cinemas', cinemasRoutes);
app.use('/user', userRoutes);
app.use('/reserve', reserveRoutes);
app.use('/movies/:id/comments', commentRoutes);

app.listen(3000, function(){
    console.log('Server is running.');
});