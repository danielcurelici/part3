const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(express.static('build'))


app.use(cors())
console.log();


morgan.token('body', function(req, res) {
    return `{"name": "${req.body.name}","number": "${req.body.number}"}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
    },
    { 
        "id": 5,
        "name": "Daniel Hellas", 
        "number": "040-123456"
      }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
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
app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})
const generateId = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}
app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name)
        response.status(400).end('name is missing')
    if(!body.number)
        response.status(400).end('number is missing')
    if(persons.find(p => p.name === body.name))
        response.status(400).end('name already exists')
    const person = {
        id: generateId(1, 1000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
