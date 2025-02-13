const Person = ({name, number, onDelete}) => {
    return (
    <p>
        {name} {number} 
        <button onClick={onDelete}> Delete </button>
    </p>
    )
}

export default Person
