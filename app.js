const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb+srv://kalash:Kalash@cluster0.adqwmwo.mongodb.net/todolistDB");

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);
const Item1 = new Item({
    name: "first Item"
});

// Item.insertMany([Item1]);


app.get('/', (req, res) => {
    var data = [];
    async function findItem() {
        data = await Item.find();
        if (data.length === 0) {
            data = [{ name: "Enter tasks to your todo List!!" }];
        }
        res.render('index', { data: data });
    }
    findItem();
});
app.post('/', (req, res) => {
    var item = req.body.item;
    console.log(item);
    const Item2 = new Item({
        name: item
    });
    Item.insertMany([Item2]);
    res.redirect('/');
});
app.post('/delete', (req, res) => {
    console.log(req.body);
    Item.deleteOne({ _id: req.body.tobedeleted }).then(function () {
        console.log("Data deleted"); // Success
        res.redirect('/');
    }).catch(function (error) {
        console.log(error); // Failure
    });
});

app.post('/search', (req, res) => {
    var data = [];
    async function findItem() {
        data = await Item.find({ name: req.body.search });
        res.render('index', { data: data });
    }
    findItem();
});
app.listen(3000, () => {
    console.log('listening on port 3000');
})