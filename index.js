const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('entry', function (req, res) { return JSON.stringify(req.body)})
morgan.format('tiny-more', ':method :url :status :res[content-length] - :response-time ms :entry')
app.use(morgan("tiny-more"))

// finally, define a custom error handler
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id"})
    }

    next(error)
}

app.use(errorHandler)

app.get("/", (req, res, next) => {
    res.send('<h1>Phonebook API</h1>')
})

app.get("/info", (req, res, next) => {
    Person.find({}).then(response => {
        res.write(`<p>Phonebook has info for ${response.length} people</p>`)
        res.write(`<p>${Date()}</p>`)
        res.end()
    })
    .catch(error => next(error))
})

app.get("/api/persons", (req, res, next) => {
    Person.find({}).then(response => {
        res.json(response)
    })
    .catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(result => {
        res.status(204)
        res.write("User deleted")
        res.end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
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
    Person.find({ name: newName }).then(result => {
        if (result.length !== 0) {
            res.status(400)
            res.write("Error: name must be unique")
            res.end()
            return
        }
        const personToAdd = new Person({
            name: person.name,
            number: person.number
        })
        personToAdd.save().then(savedPerson => {
            res.json(savedPerson)
        })
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
    console.log(req.params.id)
    const person = {
        name: req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})


const PORT = process.env.port || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})