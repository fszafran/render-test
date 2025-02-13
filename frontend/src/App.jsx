import { useState, useEffect } from "react"
import Filter from "./components/Filter" 
import PersonForm from "./components/PersonForm" 
import Person from "./components/Person" 
import numberService from "./services/numbers"
import Notification from "./components/Notification"

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newFilter, setNewFilter] = useState("")
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    numberService
    .getAll()
    .then(allNumbers => {
      setPersons(allNumbers)
    })
    }, []
  )

  const addPerson = (event) => {
    event.preventDefault()
    if(persons.some(person => person.name === newName)){
      const confirmed = confirm(`${newName} is already added to the phonebook, replace number?`)
      if(confirmed){
        const person = persons.find(person=>person.name===newName)
        const updateId = person.id
        const newPerson = {...person, number: newNumber}
        numberService
        .update(person.id, newPerson)
        .then(updatedPerson => {
          setPersons(persons.map(person => person.id === updateId ? updatedPerson : person))
          setNewName("")
          setNewNumber("")
        })
        .catch(error => {
          const notificationObject = {
            message: `${newName} has already been deleted from server`,
            color: 'red'
          }
          setNotification(notificationObject)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setPersons(persons.filter(p => p.name !== newName))
        })
      }
      return
    }
    const newPerson = {name: newName, number: newNumber}
    numberService
    .create(newPerson)
    .then(addedPerson => {
      setPersons(persons.concat(addedPerson))
      setNewName("")
      setNewNumber("")
    })
    const notificationObject = {
      message: `added ${newName}`,
      color: 'green'
    }
    setNotification(notificationObject)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const deletePerson = (id) => {
    const thePerson = persons.find(person => person.id === id)
    const confirmed = confirm(`Are you sure you want to delete ${thePerson.name}?`)
    if(confirmed){
      numberService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  const personsToShow = newFilter 
    ? persons.filter(person=>person.name.toLowerCase().includes(newFilter)) 
    : persons

  const handleNameChange = (event) => setNewName(event.target.value)
  
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => {
    const lowerCaseValue = event.target.value.toLowerCase()
    setNewFilter(lowerCaseValue)
  }
  
  return (
    <div>
      <h2>Phonebook </h2>
      {notification &&
        <Notification message={notification.message} color={notification.color}/>
      }
      <Filter value={newFilter} onChange={handleFilterChange}/>
      <h2>Add a new </h2>
      <PersonForm onSubmit={addPerson} nameValue={newName} nameOnChange={handleNameChange} numberValue={newNumber} numberOnChange={handleNumberChange}/>
      <h2>Numbers </h2>
      {personsToShow.map(person => <Person key={person.name} name={person.name} number={person.number} onDelete={()=>deletePerson(person.id)} />)}
    </div>
  )
}

export default App