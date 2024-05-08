const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

// Cors configuration - Allows requests from localhost:4200
const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 204,
  methods: "GET, POST, PUT, DELETE",
};

// Use cors middleware
app.use(cors(corsOptions));

// Use express.json() middleware to parse JSON bodies of requests
app.use(express.json());

// GET route - Allows to get all the items
// example: localhost:3000/clothes?page=0&perPage=2
app.get("/clothes", (req, res) => {
  // Recupera i parametri di paginazione dalla query string
  const page = parseInt(req.query.page) || 0;
  const perPage = parseInt(req.query.perPage) || 10;

  // Legge i dati dal file JSON
  fs.readFile("db.json", "utf8", (err, data) => {
    // Gestione degli errori di lettura
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Parsing dei dati JSON
    const jsonData = JSON.parse(data);

    // Calcolo degli elementi da restituire in base alla paginazione
    const start = page * perPage;
    const end = start + perPage;
    const result = jsonData.items.slice(start, end);

    // Restituzione della risposta con i dati paginati
    res.status(200).json({
      items: result,
      total: jsonData.items.length,
      page,
      perPage,
      totalPages: Math.ceil(jsonData.items.length / perPage),
    });
  });
});

// POST route - Allows to add a new item
// example: localhost:3000/clothes
/*
  body: {
    "image": "https://your-image-url.com/image.png",
    "name": "T-shirt",
    "price": "10",
    "rating": 4
  }
*/
app.post("/clothes", (req, res) => {
  // Parsing dei dati dalla richiesta POST
  const { image, name, price, rating } = req.body;

  // Lettura dei dati dal file JSON
  fs.readFile("db.json", "utf8", (err, data) => {
    // Gestione degli errori di lettura
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Parsing dei dati JSON
    const jsonData = JSON.parse(data);

    // Calcolo del nuovo ID per il nuovo elemento
    const maxId = jsonData.items.reduce(
      (max, item) => Math.max(max, item.id),
      0
    );
    const newItem = { id: maxId + 1, image, name, price, rating };

    // Aggiunta del nuovo elemento
    jsonData.items.push(newItem);

    // Scrittura dei dati aggiornati nel file JSON
    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      // Gestione degli errori di scrittura
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Restituzione della risposta con il nuovo elemento aggiunto
      res.status(201).json(newItem);
    });
  });
});

// PUT route - Allows to update an item
// example: localhost:3000/clothes/1
/*
  body: {
    "image": "https://your-image-url.com/image.png",
    "name": "T-shirt",
    "price": "10",
    "rating": 4
  }
*/
app.put("/clothes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { image, name, price, rating } = req.body;

  // Lettura dei dati dal file JSON
  fs.readFile("db.json", "utf8", (err, data) => {
    // Gestione degli errori di lettura
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Parsing dei dati JSON
    const jsonData = JSON.parse(data);

    // Trova l'indice dell'elemento da aggiornare
    const index = jsonData.items.findIndex((item) => item.id === id);

    // Gestione dell'elemento non trovato
    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    // Aggiorna l'elemento con i nuovi dati
    jsonData.items[index] = { id, image, name, price, rating };

    // Scrittura dei dati aggiornati nel file JSON
    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      // Gestione degli errori di scrittura
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Restituzione della risposta con l'elemento aggiornato
      res.status(200).json(jsonData.items[index]);
    });
  });
});

// DELETE route - Allows to delete an item
// example: localhost:3000/clothes/1
app.delete("/clothes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Lettura dei dati dal file JSON
  fs.readFile("db.json", "utf8", (err, data) => {
    // Gestione degli errori di lettura
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Parsing dei dati JSON
    const jsonData = JSON.parse(data);

    // Trova l'indice dell'elemento da eliminare
    const index = jsonData.items.findIndex((item) => item.id === id);

    // Gestione dell'elemento non trovato
    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    // Rimuovi l'elemento dall'array
    jsonData.items.splice(index, 1);

    // Scrittura dei dati aggiornati nel file JSON
    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      // Gestione degli errori di scrittura
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Restituzione della risposta con successo
      res.status(204).send();
    });
  });
});

app.listen(port, () => {
  console.log(`Server avviato at http://localhost:${port}`);
});
