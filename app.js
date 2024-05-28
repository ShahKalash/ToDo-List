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
const listSchema = {
    name: String,
    items: [itemSchema]
}

const list = mongoose.model("List", listSchema);
app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/signup', (req, res) => {
    res.redirect('/' + req.body.name);
});
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get("/:customListName", (req, res) => {
    const customListName = req.params.customListName;
    list.findOne({ name: customListName })
        .then((docs) => {
            if (!docs) {
                const list1 = new list({
                    name: customListName,
                    items: [{ name: "Enter tasks to your todo List" }]
                })
                list.insertMany([list1]);
                res.redirect('/' + customListName);
            }
            else {
                res.render('index', { data: docs.items, title: customListName });
            }
        })
        .catch((err) => {
            console.log(err);
        });


});
app.post('/', (req, res) => {
    var item = req.body.item;
    var listName = req.body.title;
    console.log(listName);
    const Item2 = new Item({
        name: item
    });
    list.findOne({ name: listName })
        .then((docs) => {
            docs.items.push(Item2);
            docs.save();
            res.redirect('/' + listName);
        })
        .catch((err) => {
            console.log(err);
        });
});
app.post('/delete', async (req, res) => {
    console.log(req.body);
    const listName = req.body.title;
    try {
        await list.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: req.body.tobedeleted } } }
        ).exec();

        res.redirect('/' + listName);
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send("Error deleting item.");
    }
});

app.post('/search', async (req, res) => {
    const search = req.body.search;
    const listName = req.body.title;
    try {
        const list1 = await list.findOne({ name: listName });

        if (!list1) {
            // Handle case where list doesn't exist
            return res.status(404).send("List not found");
        }

        // Use filter to find items matching the search value
        const matchedItems = list1.items.filter(item => item.name === search);

        // Send the matched items to the client
        res.render('index', { title: listName, data: matchedItems });
    } catch (error) {
        console.error("Error finding items:", error);
        res.status(500).send("Error finding items.");
    }
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, () => {
    console.log("listening on port {port}");
});
