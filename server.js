const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const PATH = "stranice/";
const port = 5000;

let ID = 1;

const kategorije = ["Automobil", "Instrumenti", "Alati", "Igracke", "namestaj", "Drugo"];

let oglasi = [
    {
        "id": ID++,
        "kategorija": "Automobil",
        "datumIsteka": "2020-07-01",
        "tekst":  "Auto Opel Astra G 2004 godiste na prodaju.",
        "oznaka": "auto",
        "cena": "200000",
        "valuta": "DIN",
        "email": "milanmilenkovic91@hotmail.com"
    },
    {
        "id": ID++,
        "kategorija": "Instrumenti",
        "datumIsteka": "2020-09-01",
        "tekst":  "Fender elektricna Gitara na prodaju.",
        "oznaka": "gitara",
        "cena": "500",
        "valuta": "EUR",
        "email": "jovanjovanovic1993@live.com"
    },
    {
        "id": ID++,
        "kategorija": "Alati",
        "datumIsteka": "2020-08-01",
        "tekst":  "Kosilica Nova na prodaju.",
        "oznaka": "kosilica",
        "cena": "25000",
        "valuta": "DIN",
        "email": "milosradovic@gmail.com"
    }
];

http.createServer(function (req, res){    
    let urlObj = url.parse(req.url,true,false);
    
    if (req.method == "GET"){
        if (urlObj.pathname == "/oglasi" || urlObj.pathname == "/"){ 
            fs.readFile(PATH + "oglasi.html", function (err,data){
                if (err){
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
        }
        if (urlObj.pathname == "/api/svi-oglasi"){ 
            res.writeHead(200);
            data = JSON.stringify(sviOglasi());
            res.end(data);
        }

        if(urlObj.pathname == '/api/kategorije') {
            res.writeHead(200);
            data = JSON.stringify(sveKategorije());
            res.end(data);
        }

        if (urlObj.pathname == "/izmeniOglas"){
            fs.readFile(PATH + "izmeniOglas.html", function (err,data){
                if (err){
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
        }
        if (urlObj.pathname == "/dodajOglas"){
            fs.readFile(PATH + "dodajOglas.html", function (err,data){
                if (err){
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
        }
    }
    else if(req.method == "POST") {
        if (urlObj.pathname == "/izmeni-oglas"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                izmeniOglas(parseInt(querystring.parse(body).id),querystring.parse(body).kategorija, querystring.parse(body).datumIsteka, querystring.parse(body).tekst, querystring.parse(body).oznaka, querystring.parse(body).cena, querystring.parse(body).email, querystring.parse(body).valuta)
                res.writeHead(302, {
                    'Location': '/izmeniOglas'
                });
                res.end()
            });
        }

        if (urlObj.pathname == "/pripremi-oglas"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.writeHead(200);
                data = nadjiOglas(parseInt(querystring.parse(body).id));
                data['kategorije'] = sveKategorije();
                res.end(JSON.stringify(data))
            });
        }

        if (urlObj.pathname == "/api/filtriranje"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.writeHead(200);
                res.end(JSON.stringify(filtrirajOglase(querystring.parse(body).tekst)))
            });
        }

        if (urlObj.pathname == "/obrisi-oglas"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                obrisiOglas(parseInt(querystring.parse(body).id));
                res.writeHead(302, {
                    'Location': '/oglasi'
                });
                res.end();
            });
        }
        if (urlObj.pathname == "/dodaj-oglas"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                dodajOglas(querystring.parse(body).kategorija,
                           querystring.parse(body).datumIsteka,querystring.parse(body).tekst, querystring.parse(body).oznaka, querystring.parse(body).cena, querystring.parse(body).email, querystring.parse(body).valuta);

                res.writeHead(200);
                res.end(JSON.stringify('/oglasi'));
            });
        }
    }
}).listen(port, function(err) {
    if(err) {
        console.log("Something went wrong.");
        
    } else {
        console.log("Server listening on port: ", port);
        
    }
});

function sviOglasi(){
    return oglasi;
}

function sveKategorije() {
    return kategorije;
}

function nadjiOglas(id) {
    for(let i=0;i<oglasi.length;i++){
        if(oglasi[i].id === id){
            return oglasi[i];
        }
    }
}

function filtrirajOglase(tekst) {
    let pomocni = []
    for(let i=0;i<oglasi.length;i++){
        if(oglasi[i].tekst.toLowerCase().includes(tekst.trim().toLowerCase()) || oglasi[i].kategorija.toLowerCase().includes(tekst.trim().toLowerCase()) || oglasi[i].oznaka.toLowerCase().includes(tekst.trim().toLowerCase()) ){
            pomocni.push(oglasi[i])
        }
    }

    return pomocni;
}

function izmeniOglas(id, kategorija, datumIsteka, tekst, oznaka, cena, email, valuta){
   
    for(let i=0;i<oglasi.length;i++){
        if(oglasi[i].id == id){
            oglasi[i].kategorija = kategorija;
            oglasi[i].datumIsteka = datumIsteka;
            oglasi[i].tekst = tekst;
            oglasi[i].oznaka = oznaka;
            oglasi[i].cena = cena;
            oglasi[i].valuta = valuta;
            oglasi[i].email = email;
        }
    }

}
function obrisiOglas(id){
    let pomocni = []
    for(let i=0;i<oglasi.length;i++){
        if(oglasi[i].id != id){
            pomocni.push(oglasi[i])
        }
    }
    oglasi = pomocni;
    return oglasi;
}
function dodajOglas(kategorija, datumIsteka, tekst, oznaka, cena, email, valuta){
    let oglas =   {
        "id": ID++,
        "kategorija": kategorija,
        "datumIsteka": datumIsteka,
        "tekst":  tekst,
        "oznaka": oznaka,
        "cena": cena,
        "valuta": valuta,
        "email": email
    };

    oglasi.push(oglas);
}