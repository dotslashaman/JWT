const app = require('')


const serverStart = function () {
    return app.listen(3000, () => {
        console.log("Server is up and listening : )");
    })
}

module.exports = serverStart;

