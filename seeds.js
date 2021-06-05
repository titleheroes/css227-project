var mongoose    = require('mongoose');
var Movies      = require('./models/movies.js');
var Cinemas     = require('./models/cinema.js');
var Liked       = require('./models/liked.js');
var User        = require('./models/user.js');

var data = [
    {
        name: "Mortal Kombat",
        image: "/images/movies/mortal-kombat/poster.png",
        logo: "/images/movies/mortal-kombat/logo.png",
        banner: "/images/movies/mortal-kombat/banner.png",
        trailer: "https://www.youtube-nocookie.com/embed/QJHY4ggYCk4",
        desc: "MMA fighter Cole Young seeks out Earth's greatest champions in order to stand against the enemies of Outworld in a high stakes battle for the universe.",
        genre: "Action/Fantasy",
        director: "Simon McQuoid",
        date: "April 8, 2021",
        runtime: "110",
        score: 6.2,
    },
    {
        name: "Nobody",
        image: "/images/movies/nobody/poster.jpg",
        logo: "/images/movies/nobody/logo.png",
        banner: "/images/movies/nobody/banner.jpg",
        trailer: "https://www.youtube-nocookie.com/embed/wZti8QKBWPo",
        desc: "A bystander who intervenes to help a woman being harassed by a group of men becomes the target of a vengeful drug lord.",
        genre: "Action/Thriller",
        director: "Ilya Naishuller",
        date: "April 13, 2021",
        runtime: "92",
        score: 7.4,
    },
    {
        name: "Godzilla vs. Kong",
        image: "/images/movies/god-kong/poster.jfif",
        logo: "/images/movies/god-kong/logo.png",
        banner: "/images/movies/god-kong/banner.jpg",
        trailer: "https://www.youtube-nocookie.com/embed/odM92ap8_c0",
        desc: "The epic next chapter in the cinematic Monsterverse pits two of the greatest icons in motion picture history against one another - the fearsome Godzilla and the mighty Kong - with humanity caught in the balance.",
        genre: "Sci-fi/Action",
        director: "Adam Wingard",
        date: "March 25, 2021",
        runtime: "113",
        score: 6.5,
    },
    {
        name: "Stand by Me Doraemon 2",
        image: "/images/movies/stand-by-me-2/poster.jpg",
        logo: "/images/movies/stand-by-me-2/logo.png",
        banner: "/images/movies/stand-by-me-2/banner.jpg",
        trailer: "https://www.youtube-nocookie.com/embed/5bDCZMdKa_4",
        desc: "One day Nobita decided to go back in time to meet his grandmother. Nobita' s grandmother said 'I want to see your bride once.' And from this one sentence of grandma Doraemon and Nobita's big blasphemy begins.",
        genre: "Sci-fi/Anime",
        director: "Takashi Yamazaki, Ryuichi Yagi",
        date: "April 6, 2021",
        runtime: "96",
        score: 7.5,
    },
    {
        name: "Judas and the Black Messiah",
        image: "/images/movies/judas/poster.jfif",
        logo: "/images/movies/judas/logo.png",
        banner: "/images/movies/judas/banner.jpg",
        trailer: "https://www.youtube-nocookie.com/embed/sSjtGqRXQ9Y",
        desc: "Offered a plea deal by the FBI, William O'Neal infiltrates the Illinois chapter of the Black Panther Party to gather intelligence on Chairman Fred Hampton.",
        genre: "Drama",
        director: "Shaka King",
        date: "April 22, 2021",
        runtime: "126",
        score: 7.5,
    },
    {
        name: "Promising Young Woman",
        image: "/images/movies/promising-young-woman/poster.jfif",
        logo: "/images/movies/promising-young-woman/logo.png",
        banner: "/images/movies/promising-young-woman/banner.jpg",
        trailer: "https://www.youtube-nocookie.com/embed/7i5kiFDunk8",
        desc: "A young woman, traumatized by a tragic event in her past, seeks out vengeance against those who crossed her path.",
        genre: "Thriller/Comedy",
        director: "Emerald Fennell",
        date: "April 22, 2021",
        runtime: "114",
        score: 7.5,
    },
    {
        name: "Minari",
        image: "/images/movies/minari/poster.jfif",
        logo: "/images/movies/minari/logo.png",
        banner: "/images/movies/minari/banner.jpg",
        trailer: "https://www.youtube-nocookie.com/embed/KQ0gFidlro8",
        desc: "A Korean family starts a farm in 1980s Arkansas.",
        genre: "Drama",
        director: "Lee Isaac Chung",
        date: "April 1, 2021",
        runtime: "116",
        score: 7.6,
    },
]

var cData = [
    {
        name: "Cinemania",
        image: "/images/cinema/cinemania/image.jfif",
        logo: "/images/cinema/cinemania/logo.png",
        slogan: "Premium cinema that deserve right to you.",
        seat: [ [0, 0, 0 ,0] , [0, 0, 0, 0] ],
        time: [11,14,17,20],
    },
    {
        name: "CinemaX",
        image: "/images/cinema/cinemax/image.jfif",
        logo: "/images/cinema/cinemax/logo.png",
        slogan: "The Best Xperience of cinema that you can taste.",
        seat: [ [0, 0, 0 ,0] , [0, 0, 0, 0] ],
        time: [10,13,16,19,22],
    },
]



function seedDB(){
    Movies.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Remove Movies Complete");
            data.forEach(function(seed){
                Movies.create(seed, function(err, movie){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('Movies data added');
                    }
                });
            });
        }
    });
    Cinemas.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Remove Cinemas Complete");
            cData.forEach(function(seed){
                Cinemas.create(seed, function(err, cinema){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('Cinemas data added');
                    }
                });
            });
        }
    });
    Liked.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            User.updateMany({likes: []}, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Remove Liked Complete");
                }
            });
        }
    });
}

module.exports = seedDB;