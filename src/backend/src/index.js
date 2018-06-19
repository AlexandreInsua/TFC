const app = require('./config/server');

require('./app/routes/rutas')(app);

app.listen(app.get('port'), function () {
    console.log("Greenhouse server en porto ", app.get('port'));
});