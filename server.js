// Setting up the requirements
const express = require("express");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

// route to get /notes.html
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// route to get all notes
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "db/db.json"));
});

//  route to get single note
app.get("/api/notes/:id", function(req, res) {
    // Defining the route to find note by id
    let savedNotes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    let chosen = req.params.id

    console.log(chosen);

    // if statement to display an error if there is no note with the requested id.
    for (var i = 0; i < savedNotes.length; i++) {
        if (chosen === savedNotes[i].id) {
          return res.json(savedNotes[i]);
        }
      }
    
      return res.json(false);
})

// get index
// NOTE: This must be placed AFTER the /notes routes
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"))
});


// Posting the notes
app.post('/api/notes', (req, res) => {

    // Getting the array from db.json
    let savedNotes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));

    // newNote will be the body of the request
    var newNote = {
        id: uuid.v4(),
        title: req.body.title,
        text: req.body.text 
    }

    if(!newNote.title || !newNote.text) {
        return res.status(400).json({ msg: 'Please include a title and body for the note' });
    }

    console.log(newNote);

    // The new note will be pushed to savedNotes
    savedNotes.push(newNote);

    fs.writeFileSync("db/db.json", JSON.stringify(savedNotes));

    // The JSON will be displayed to the users
    res.json(savedNotes);
});


// //  route to delete note
// app.delete("/api/notes/:id", function(req, res) {
//     // Defining the route to find note by id
//     let savedNotes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
//     let chosen = req.params.id

//     console.log(chosen);

//     // if statement to display an error if there is no note with the requested id.
//     for (var i = 0; i < savedNotes.length; i++) {
//         if (chosen === savedNotes[i].id) {
//             res.json({ msg: 'Note deleted',
//             savedNotes: savedNotes.filter(note => note.id !== parseInt(req.params.id))
//             })
//         }
//       }
    
//       return res.json(false);
// })

//  route to delete note
app.delete("/api/notes/:id", function(req, res) {
    // Defining the route to find note by id
    let savedNotes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    let chosen = req.params.id

    savedNotes = savedNotes.filter(deletedNote => {
        return deletedNote.id != chosen;
    })

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes)
})

/////////////////////////////////////////////////////////////////

app.listen(PORT, function() {
    console.log(`App listening on PORT: ${PORT}`);
})





