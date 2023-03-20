require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express();
const cors = require('cors')
app.use(express.static('build'))
app.use(express.json())
app.use(cors())

const Person = require('./models/person');

morgan.token('body', function(reqest, response) {
    return `{"name": "${reqest.body.name}","number": "${reqest.body.number}"}`
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456",
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

app.get('/info', (request,response) => {
    response.send(`Phonebook has info for ${persons.length} persons
    ${new Date}`);
})
app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person)
        response.json(person)
    response.status(404).end('person does not exist')
})
// app.delete('/api/persons/:id', (request,response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(p => p.id !== id)
//     response.status(204).end()
// })

app.delete('/api/persons/:id', (request,response,next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if(!body.name)
        return response.status(400).end('name is missing')
    if(!body.number)
        return response.status(400).end('number is missing')
    //if(Person.find({name:body.name}))
      //  return response.status(400).end('name already exists')

    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
