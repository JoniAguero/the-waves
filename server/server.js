const app = require('./app')
const chalk = require('chalk');


const port = process.env.PORT || 1234;

app.listen(port, () => {
    console.log(`Server Running on port ${chalk.green(`${port}`)}`)
})