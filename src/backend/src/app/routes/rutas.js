const dbconexion = require('../../config/dbconexion');



module.exports = function (app) {
    const conn = dbconexion();

    app.get('/', function (req, res) {
        res.render('rows/main.ejs');
    });

    app.get('/actual', function (req, res) {
        conn.query('SELECT prDatetime, prTemp, prAirHr, prFloorHr, prLight, prDvpt FROM processed_data ORDER BY prDatetime DESC limit 1;', function (err, result) {               
            res.render('rows/actual.ejs', { row: result });
        });
    });

    app.get('/api/actual', function (req, res) {
        conn.query('SELECT prDatetime, prTemp, prAirHr, prFloorHr, prLight, prDvpt FROM processed_data ORDER BY prDatetime DESC limit 1;', function (err, result) {
            // console.log(result);
            // console.log(JSON.stringify(result))
                    
            // var str  = JSON.stringify(result)
            // str = str.replace("]","")
            // str = str.replace("[","")
            // console.log(str)
            // console.log(JSON.parse(str))

           res.render('rows/api/actual.ejs', { row: result })  
        });
    });

    app.get('/diario', function (req, res) {
        conn.query('SELECT hiDatetime, hiTemp, hiAirHr, hiFloorHr, hiLight, hiDvph FROM historical WHERE EXTRACT(day FROM hiDatetime) = EXTRACT(day FROM NOW());', function (err, result) {
            res.render('rows/diario.ejs', { row: result });
        });
    });

        app.get('/api/diario', function (req, res) {
            conn.query('SELECT hiDatetime, hiTemp, hiAirHr, hiFloorHr, hiLight, hiDvph FROM historical WHERE EXTRACT(day FROM hiDatetime) = EXTRACT(day FROM NOW());', function (err, result) {
                res.render('rows/api/diario.ejs', { row: result });
            });
        });    

  app.get('/historico', function (req, res) {
        conn.query('SELECT hiDatetime, hiTemp, hiAirHr, hiFloorHr, hiLight, hiDvph FROM historical;', function (err, result) {
            res.render('rows/historico.ejs', { row: result });
        });
    });

    app.get('/api/historico', function (req, res) {
        conn.query('SELECT hiDatetime, hiTemp, hiAirHr, hiFloorHr, hiLight, hiDvph FROM historical;', function (err, result) {
            console.log({row:result})
            res.render('rows/api/historico.ejs', { row: result });
        });
    });
}