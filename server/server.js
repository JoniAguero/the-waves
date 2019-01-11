const app = require('./app')
const chalk = require('chalk');

if (process.env.NODE_ENV === 'production') {
    /* Express will serve up production assets
       like our main.js file, or main.css file  */

    app.use(express.static('client/build'));

    /* Express will serve up the index.html file
       if it doesn't recognize the route */

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })

}

const port = process.env.PORT || 1234;

app.listen(port, () => {
    console.log(`Server Running on port ${chalk.green(`${port}`)}`)
})