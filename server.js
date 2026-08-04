const app = require('./src/app');
const port = 3000;

const serverStart = function () {
    return app.listen(port, () => {
        console.log(`Server is up at ${port} and listening : )`);
    })
}


serverStart();
module.exports = serverStart;

