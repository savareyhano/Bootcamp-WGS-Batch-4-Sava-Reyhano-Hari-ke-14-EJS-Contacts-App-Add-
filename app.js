const { urlencoded } = require('express')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const contacts = require('./data/contacts.js')
const app = express()
const port = 3000

app.use(express.static("public"));
app.use(express.json());
app.use(urlencoded({extended:true}));

// pake bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// pake ejs dan layout
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layout/layout')
app.use(morgan('dev'))

app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
})

// buka halaman index.ejs
app.get('/', (req, res) => {
    res.render('index',
    {
        nama: 'AKW',
        title: 'WebServer EJS',
    })
})

// buka halaman about.ejs
app.get('/about', (req, res) => {
    res.render('about', {title: 'About'})
})

// buka halaman contact.ejs
app.get('/contact', (req, res) => {
    cont = contacts.loadContacts();

    // if (typeof cont !== 'undefined') {
    //     res.render('contact', {
    //         nama: 'AKW',
    //         title: 'WebServer EJS',
    //         cont,
    //     })
    // } else {
    //     res.send('Error!')
    // }

    res.render('contact', {
        title: 'Contact',
        cont,
    })
})

app
    .get('/create', (req, res) => {
        res.render('contactAdd', {
            title: 'Add Contact',
        })
    })
    .post('/create', (req, res) => {
        
        console.log(req.body)
        let name = req.body.name;
        let phone = req.body.phone;
        let email = req.body.email;
        contacts.save(name, phone, email);

        return res.render('contactAdd', {
            title: 'Add Contact',
        })
    })

app.get('/contact/:name', (req, res) => {
    cont = contacts.getName(req.params.name);

    res.render('contactDetail', {
        title: 'Detail Contact',
        cont,
    })
})

app.get('/product/:id', (req, res) => {
    res.send('product id : ' + req.params.id + '<br></br>'
        + 'category id : ' + req.query.idCat)
})

// diluar route diatas maka akan tampil halaman ini
app.use('/', (req, res) => {
    res.status(404)
    res.send('404: Page not found!')
})

// nampilin di CLI "example app port 3000"
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})