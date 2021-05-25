const { db } = require('./models/user');

const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        flash           = require('connect-flash'),
        methodOverride  = require('method-override'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        
        User            = require('./models/user'),
        seedDB          = require('./seeds');

var indexRoutes = require('./routes/index'),
    moviesRoutes = require('./routes/movies'),
    cinemasRoutes = require('./routes/cinema');
    commentRoutes = require('./routes/comment');
    reserveRoutes = require('./routes/reserve');
    sessionRoutes = require('./routes/session');
    userRoutes = require('./routes/user');

mongoose.connect('mongodb://localhost/Movies');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');
//seedDB();

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
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash('error');
    res.locals.success      = req.flash('success');
    next();
});

//  Routes
app.use('/', indexRoutes);
app.use('/movies', moviesRoutes);
app.use('/cinemas', cinemasRoutes);
app.use('/user', userRoutes);
app.use('/reserve', reserveRoutes);
app.use('/session', sessionRoutes);
app.use('/movies/:id/comments', commentRoutes);

app.listen(3000, function(){
    console.log('Server is running.');
});