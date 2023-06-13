const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')


app.use(cors())
// custom morgan
app.use(express.json())
morgan.token('entry', function (req, res) { return JSON.stringify(req.body)})
morgan.format('tiny-more', ':method :url :status :res[content-length] - :response-time ms :entry')

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(morgan("tiny-more"))

app.get("/", (req, res) => {
    res.send('<h1>Phonebook API</h1>')
})

app.get("/info", (req, res) => {
    res.write(`<p>Phonebook has info for ${persons.length} people</p>`)
    res.write(`<p>${Date()}</p>`)
    res.end()
})

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        persons = persons.filter(person => person.id !== id)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

// define a post method for adding a person to the phonebook
const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}

app.post("/api/persons", (req, res) => {
    const person = req.body

    // check that the proper thing was passed in
    if (!person.name) {
        res.status(400)
        res.write("Error: must provide a name")
        res.end()
        return
    }

    if (!person.number) {
        res.status(400)
        res.write("Error: must provide a number")
        res.end()
        return
    }

    // validate that name isnt in there yet
    const newName = person.name
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
        res.status(400)
        res.write("Error: name must be unique")
        res.end()
        return
    }

    person.id = generateId()
    persons = persons.concat(person)

    res.json(person)
})


const PORT = process.env.port || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})