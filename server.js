const express = require('express');
const fs = require('fs');
var data = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
const path = require("path");

// make express app work
var app = express();
 var PORT = process.env.PORT || 3001

// process data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public/assets", express.static(__dirname + "/public/assets"));


// HTML routes for index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});
// HTML routes for notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

// API for notes to get, save, and delete notes.
app.get("/api/notes", (req, res) => {
    res.json(data);
});

app.get("/api/notes/:id", (req, res) => {
    res.json(data[Number(req.params.id)]);
});

app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    let uniqueId = (data.length).toString();
    console.log(uniqueId);
    newNote.id = uniqueId;
    data.push(newNote);

    fs.writeFileSync('./db/db.json', JSON.stringify(data), function(err) {
        if (err) throw (err);
    });

    res.json(data);
});

app.delete("/api/notes/:id", (req, res) => {
    let noteId = req.params.id;
    let newId = 0;
    console.log(`Deleting note with id ${noteId}`);
    data = data.filter(currentNote => {
        return currentNote.id != noteId;
    })
    for (currentNote of data) {
        currentNote.id = newId.toString();
        newId++;
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(data));
    res.json(data);
});
// start the server
app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
