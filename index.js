const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())


const customMorganFunction = (tokens, req, res) => {
    let data = ''    
    if (tokens.method(req, res) === 'POST'){
        data = JSON.stringify(req.body)
    }
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        data
      ].join(' ')
}

app.use(morgan(customMorganFunction))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    const phonebookLength = persons.length
    response.send(
        `
        <p>Phonebook has info about ${phonebookLength} people</p>
        <p>${date}</p>
        `
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.statusMessage = 'Person not found'
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
}
app.post('/api/persons', (request, response) => {
    const id = getRandomInt(1000)
    const phoneNumber = request.body.number
    const name = request.body.name
    if (!phoneNumber){
        return response.status(400).json({error: 'a person has to have a number'})
    }
    if (!name){
        return response.status(400).json({error: 'a person has to have a name'})
    }
    if (persons.find(p => p.name === name)){
        return response.status(400).json({error: 'name must be unique'})
    }
    const person = {
        "id" : String(id),
        "name": name,
        "number": phoneNumber
    }
    persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})