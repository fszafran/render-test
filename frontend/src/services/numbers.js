import axios from "axios"
const baseUrl = '/api/persons'


const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (person) => {
    const request = axios.post(baseUrl, person)
    return request.then(response => response.data)
}   

const update = (id, newObject) => {
    const personUrl = `${baseUrl}/${id}`
    const request = axios.put(personUrl, newObject)
    return request.then(response => response.data)
}

const remove = (id) => {
    const personUrl = `${baseUrl}/${id}`
    const request = axios.delete(personUrl)
    return request.then(response => response.data)
}

export default { getAll, create, update, remove }

