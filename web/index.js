// instanciation des modules ajoutés avec node.js
var express = require('express');
var upload = require('express-fileupload');
var app = express(); //Instanciation du module express
var sha1 = require('sha1');
var http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mkdirp = require('mkdirp');
var mysql = require('mysql');
var pdf = require('html-pdf');
var fs = require('fs');
var request = require('request');
var options = { format: 'A4' };

const zeco = require('./publics/blockchain/cli_app/zecoLib.js');


// Les informations pour la connexion à la base de données distante
// var con = mysql.createConnection({
//     host: "remotemysql.com",
//     user: "Rn6mm1eIfC",
//     password: "R4idlG4ec1",
//     database: "Rn6mm1eIfC"
// });

//Les informations pour la connexion à la base de données local
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zeco"
});

//L'erreur retournée quand il y a un problème avec la tentative de connexion à la base de données
con.on('error', function(err) {
    console.log(err.code);
});

//Les variables globales
let identifiant = {};
let plaintes = {};
let information = { diffuser: false };
let information_recu = [];
let redirigerLettre = false;
let timeElapsed = Date.now();
let today = new Date(timeElapsed);
let todayDate = today.toLocaleDateString();




//Les utilisations de node.js
app.use(express.static("publics"));
app.use(upload());

app.set('view engine', 'ejs');
app.set('views', './views');

//Définition des routes vers les dossiers publics
app.set('/images', 'publics/images');
app.set('/inscription', 'publics/inscription');
app.set('/upload', 'publics/upload');
app.set('/info_upload', 'publics/info_upload');

app.set('/zeco_connexion/css', 'publics/zeco_connexion/css');
app.set('/zeco_connexion/js', 'publics/zeco_connexion/js');

app.set('/zeco_info_partage/css', 'publics/zeco_info_partage/css');
app.set('/zeco_info_partage/js', 'publics/zeco_info_partage/js');

app.set('/zeco_denoncer/css', 'publics/zeco_denoncer/css');
app.set('/zeco_denoncer/js', 'publics/zeco_denoncer/js');

app.set('/zeco_enquete/css', 'publics/zeco_enquete/css');
app.set('/zeco_enquete/js', 'publics/zeco_enquete/js');

app.set('/zeco_fonctionnalite/css', 'publics/zeco_fonctionnalite/css');
app.set('/zeco_fonctionnalite/js', 'publics/zeco_fonctionnalite/js');

app.set('/zeco_generalite/css', 'publics/zeco_generalite/css');
app.set('/zeco_generalite/js', 'publics/zeco_generalite/js');
app.set('/zeco_generalite/minimal', 'publics/zeco_generalite/minimal');

app.set('/zeco_info/css', 'publics/zeco_info/css');
app.set('/zeco_info/js', 'publics/zeco_info/js');


function send(path) {
    zeco.init();
    console.log("Sending hash for file: " + path);
    let hash = zeco.calculateHash(path); //1
    console.log("SHA-256 hash value: " + hash);
    zeco.sendHash(hash, function(error, tx) { //2
        console.log("Transaction ID: " + tx);
    });
}

//Route vers la page de connexion (fini)
app.get("/", (req, res) => {
    res.render("connexion");
})

//Requete de connexion
app.post("/", (req, res) => {
    //On récupère les valeurs de pseudo et mot de passe de l'utilisateur
    let pseudo = req.body.pseudo_connexion;
    let pwd = req.body.password_connexion;

    //On recherche cette donnée dans la base de données
    var sql_check = "SELECT id, pseudo, password, etatUser FROM user WHERE pseudo='" + pseudo + "' AND password='" + sha1(pwd) + "'";
    con.query(sql_check, function(err, result, fields) {
        if (err) throw err;
        if (result.length === 1) {
            result.forEach(element => {
                identifiant.pseudo = element.pseudo;
                identifiant.iduser = element.id;
                identifiant.etat = element.etatUser;
            });
            res.redirect('/home');
        } else {
            res.redirect('/home?echec=1');
        }

    });
})

//Route vers la page d'inscription
app.get("/inscription", (req, res) => {
    res.render("inscription");
})

//Requete envoyer de la page inscription
app.post("/inscription", (req, res) => {

    //Récupération des valeurs de chaque champs
    let pseudo = req.body.pseudo;
    let pwd = req.body.pwd;
    let cpwd = req.body.cpwd;
    let etat = req.body.etat;
    let siren = "";

    if (etat === 'Entreprise') {
        siren = req.body.siren_societe;
    }

    // if (siren.length != 0) {
    //     request('https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/?denomination=' + pseudo + '&siren=' + siren, function(error, response, body) {
    //         res.json(body)
    //         console.log(response);
    //     });
    // }


    //  on vérifie le mot de passe
    if (pwd === cpwd && pwd.length != 0) {

        var sql_insert = "INSERT INTO user (pseudo, password, etatuser, siren) VALUES ('" + pseudo + "','" + sha1(pwd) + "', '" + etat + "', '" + siren + "')"; //insert dans la table
        var sql_check = "SELECT id, pseudo, password, etatUser FROM user WHERE pseudo='" + pseudo + "' AND password='" + sha1(pwd) + "'"; //Verifie l'existance 
        var sql_check_all = "SELECT * FROM user"; //Taille de la table

        var idElement = 0;
        con.query(sql_check_all, function(err, result, fields) {
            if (err) throw err;
            idElement = result.length + 1;
        });

        //Vérification et insertion dans la base de données
        con.query(sql_check, function(err, result, fields) {
            if (err) throw err;
            if (result.length === 0) {
                con.query(sql_insert, function(err, resultat) {
                    if (err) throw err;

                    identifiant.pseudo = pseudo;
                    identifiant.iduser = idElement;
                    identifiant.etat = etat;

                    console.log(etat)

                    res.redirect('/home');
                });
            } else {
                console.log('ce compte existe déjà');
            }

        });

    } else {
        res.redirect('/inscription?echec');
    }
})

// Routes vers les fonctionnalités
app.get("/home", (req, res) => {
    res.render("home");
})

// Routes vers les informations partagée
app.get("/partage", (req, res) => {
    res.render("info_partagee");
})

// Routes vers les renseignements sur la corruption
app.get("/home/generalite", (req, res) => {
    res.render("generalite");
})

// Routes vers la construction de la plainte
app.get("/home/denoncer", (req, res) => {
    res.render("denoncer");
})

// Routes vers la construction de la plainte
app.get("/home/denoncer/preview", (req, res) => {
    res.render("preview");
})
app.post("/home/denoncer/preview", (req, res) => {
    // res.render("lettre", function(err, html) {
    //     pdf.create(html, options).toFile('./publics/save/' + identifiant.pseudo + todayDate + '.pdf', function(err, res) {
    //         if (err) {
    //             return console.log(err);
    //         } else {
    //             console.log(res); // { filename: '/app/businesscard.pdf' }
    //             var dataFile = fs.readFileSync('./publics/save/preview.pdf');
    //             //res.header('content-type', 'application/pdf');
    //             // res.send(dataFile);
    //             redirigerLettre = true;
    //         }
    //     });
    // });
})


app.get("/home/enquete", (req, res) => {
    res.render("enquete1");
})
app.get("/home/enquete/confirmer", (req, res) => {
    res.render("enquete2");
})
app.get("/home/info", (req, res) => {
    res.render("info");
})
app.get("/home/actualites", (req, res) => {
    res.render("actualite");
})

// formulaire de plainte
app.post("/home/denoncer", (req, res) => {
    plaintes.organisme = req.body.organisme;
    plaintes.pays = req.body.pays;
    plaintes.lieu = req.body.lieu;
    plaintes.entreprise = req.body.entreprise;
    plaintes.service = req.body.service;
    plaintes.date = req.body.date;
    plaintes.description = req.body.description;
    plaintes.surveillance = req.body.surveillance;
    plaintes.statut = req.body.statut;
    plaintes.objet = req.body.objet;

    var chaine = "";

    if (plaintes.surveillance) {
        plaintes.surveillance = true
    } else {
        plaintes.surveillance = false;
    }

    if (req.files) {

        var alpha = "abcdefghijklmnopqrstuvwxyz".split("");
        let i = 0;

        while (i < 8) {
            var rnd_ltt = alpha[Math.floor(Math.random() * 26)];
            chaine += rnd_ltt;
            i++;
        }

        chaine = chaine.toUpperCase();
        plaintes.code = chaine;
        plaintes.preuves = req.files.file;

        mkdirp('publics/upload/' + chaine).then(made => {

            if (req.files.file.length === undefined) {
                //Insert a record in the "user" table:
                var sql_insert = "INSERT INTO preuves (pieceAttache, codePlainte, provenance) VALUES ('publics/upload/" + chaine + "/" + req.files.file.name + "','" + chaine + "', 'Plainte')";
                var sql_check = "SELECT pieceAttache, codePlainte FROM preuves WHERE pieceAttache='publics/upload/" + chaine + "/" + req.files.file.name + "' AND codePlainte='" + chaine + "'";

                req.files.file.mv('publics/upload/' + chaine + '/' + req.files.file.name, (err) => {
                    if (err) {
                        res.send(err);
                    } else {
                        //console.log('insertion dans la preuve la base de données')
                        con.query(sql_check, function(err, result, fields) {
                            if (err) throw err;
                            if (result.length === 0) {
                                con.query(sql_insert, function(err, resultat) {
                                    if (err) throw err;
                                });
                                //console.log('Insertion dans la table preuves reussi et dans le dossier de code :' + chaine)
                            } else {
                                console.log('Echec d\'insertion dans la base de données');
                            }
                        });
                    }
                })

            } else {
                //console.log('insertion des preuves la base de données')
                for (let index = 0; index < req.files.file.length; index++) {

                    req.files.file[index].mv('publics/upload/' + chaine + '/' + req.files.file[index].name, (err) => {
                        if (err) {
                            res.send(err);
                        } else {
                            //Insert a record in the "user" table:
                            var sql_insert = "INSERT INTO preuves (pieceAttache, codePlainte, provenance) VALUES ('publics/upload/" + chaine + "/" + req.files.file[index].name + "','" + chaine + "', 'Plainte')";
                            var sql_check = "SELECT pieceAttache, codePlainte FROM preuves WHERE pieceAttache='publics/upload/" + chaine + "/" + req.files.file[index].name + "' AND codePlainte='" + chaine + "'";

                            con.query(sql_check, function(err, result, fields) {
                                if (err) throw err;
                                if (result.length === 0) {
                                    con.query(sql_insert, function(err, resultat) {
                                        if (err) throw err;
                                    });
                                } else {
                                    console.log('Echec d\'insertion dans la base de données');
                                }
                            });
                        }
                    })
                }
                //console.log('Insertion de ' + req.files.file.length + ' dans la table preuves reussi et dans le dossier de code :' + chaine)
            }
        })
    } else {
        console.log('Plainte sans preuve(s)')
    }

    let surveille = plaintes.surveillance === false ? 4 : 1;
    var sql_insert1 = "INSERT INTO plainte (pays, lieu, entrepriseconcerne, serviceconcerne, date, description, objet, codePlainte, user_id, vecuTemoin, etatDeSuivi_id, organisme) VALUES (\"" + plaintes.pays + "\",\"" + plaintes.lieu + "\",\"" + plaintes.entreprise + "\",\"" + plaintes.service + "\",\"" + plaintes.date + "\",\"" + plaintes.description + "\",\"" + plaintes.objet + "\",\"" + chaine + "\",\"" + identifiant.iduser + "\",\"" + plaintes.statut + "\"," + surveille + ",\"" + plaintes.organisme + "\")";
    con.query(sql_insert1, function(err, resultat) {
        if (err) throw err;
        //console.log('insertiion dans la table plainte réussi');
    });

    res.redirect("/home/denoncer/preview");
})



app.post('/home/info', (req, res) => {
    information.description = req.body.description;;
    information.surveillance = req.body.surveillance;

    //console.log(information.surveillance);
    if (information.surveillance) {
        information.statut = "authentifique";

        //Coder la partie authentification de la blockchain

        //Recupérer le hash du document
    } else {
        information.statut = "non authentifique";

        //On enregistre l'information dans la base de données
        var chaine = "";

        if (req.files) {

            var alpha = "abcdefghijklmnopqrstuvwxyz".split("");
            let i = 0;

            while (i < 5) {
                var rnd_ltt = alpha[Math.floor(Math.random() * 26)];
                chaine += rnd_ltt;
                i++;
            }

            chaine = chaine.toUpperCase();
            information.code = chaine;
            information.preuves = req.files.file;

            mkdirp('publics/info_upload/' + chaine).then(made => {

                if (req.files.file.length === undefined) {
                    //Insert a record in the "user" table:
                    var sql_insert = "INSERT INTO preuves (pieceAttache, codePlainte, provenance) VALUES ('publics/info_upload/" + chaine + "/" + req.files.file.name + "','" + chaine + "', 'Information')";
                    var sql_check = "SELECT pieceAttache, codePlainte FROM preuves WHERE pieceAttache='publics/info_upload/" + chaine + "/" + req.files.file.name + "' AND codePlainte='" + chaine + "'";
                    req.files.file.mv('publics/info_upload/' + chaine + '/' + req.files.file.name, (err) => {
                        if (err) {
                            res.send(err);
                        } else {
                            //console.log('insertion dans la preuve de l\'information la base de données')
                            con.query(sql_check, function(err, result, fields) {
                                if (err) throw err;
                                if (result.length === 0) {
                                    con.query(sql_insert, function(err, resultat) {
                                        if (err) throw err;
                                    });
                                    //console.log('Insertion dans la table preuves reussi et dans le dossier de code :' + chaine)
                                } else {
                                    console.log('Echec d\'insertion dans la base de données');
                                }
                            });
                        }
                    })

                } else {
                    //console.log('insertion des preuves la base de données')
                    for (let index = 0; index < req.files.file.length; index++) {

                        req.files.file[index].mv('publics/info_upload/' + chaine + '/' + req.files.file[index].name, (err) => {
                            if (err) {
                                res.send(err);
                            } else {
                                //Insert a record in the "user" table:
                                var sql_insert = "INSERT INTO preuves (pieceAttache, codePlainte, provenance) VALUES ('publics/info_upload/" + chaine + "/" + req.files.file[index].name + "','" + chaine + "', 'Information')";
                                var sql_check = "SELECT pieceAttache, codePlainte FROM preuves WHERE pieceAttache='publics/info_upload/" + chaine + "/" + req.files.file[index].name + "' AND codePlainte='" + chaine + "'";

                                con.query(sql_check, function(err, result, fields) {
                                    if (err) throw err;
                                    if (result.length === 0) {
                                        con.query(sql_insert, function(err, resultat) {
                                            if (err) throw err;
                                        });
                                    } else {
                                        console.log('Echec d\insertion dans la base de données');
                                    }
                                });
                            }
                        })
                    }
                }
                let timeElapsed = Date.now();
                let today = new Date(timeElapsed);
                console.log('Insertion de ' + req.files.file.length + ' dans la table preuves reussi et dans le dossier de code :' + chaine)
                var sql_insert1 = "INSERT INTO information (description, codeInfo, statutInfo, user_id, datePublication) VALUES (\"" + information.description + "\",\"" + information.code + "\",\"" + information.statut + "\"," + identifiant.iduser + ", \"" + today.toLocaleDateString() + "\")";
                con.query(sql_insert1, function(err, resultat) {
                    if (err) throw err;
                    console.log('insertion dans la table information réussi');
                });
                //console.log("information sera diffusé grâce au socket ");
                res.redirect('/home');
            })
        } else {
            console.log('Information sans fichier partagé')
        }
    }
})



// Emission et réception avec les sockets
io.on('connection', function(socket) {

    // Ici on emet les informations concernant l'utilisateur
    socket.emit('identifiant', identifiant);

    // Ici on emet la plainte de l'utilisateur
    socket.emit('plainte', plaintes);

    // socket.broadcast.emit('information', information);

    // Sélection de toutes les informations enregistrer dans la base de données
    var sql_insert1 = "SELECT * FROM information, user WHERE user_id = id ORDER BY datePublication DESC";
    con.query(sql_insert1, function(err, resultat) {
        if (err) throw err;
        information_recu = resultat;
    });

    // Ici on emet La liste des information de la base de données
    socket.emit('information_recu', information_recu);

    //Emission de l'etat de la lettre redigée
    socket.emit('redirect', redirigerLettre);

})


//port d'écoute du serveur
server.listen(2911, () => { console.log('listening on *:2911'); });