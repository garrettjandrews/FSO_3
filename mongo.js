const mongoose = require('mongoose')


// define person schema and person constructor
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model("Person", personSchema)

// check if user gave invalid number of arguments
if (process.argv.length < 3) {
    console.log("Must provide password")
    process.exit(1)
}

if (process.argv.length === 4) {
    console.log(" error: must provide number ")
    process.exit(1)
}

if (process.argv.length > 5) {
    console.log(" error: too many args ")
    process.exit(1)
}

// at this point we know we got either 3 or 5 args, so we can connect and take the needed action
const password = process.argv[2]
const url = `mongodb+srv://garrettjandrews:${password}@cluster0.g17gybo.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        process.exit(0)
    })
    
}

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`person added with name ${person.name} and number ${person.number}`)
        mongoose.connection.close()
    })
}