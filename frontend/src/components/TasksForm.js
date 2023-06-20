import { useState } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import { useAuthContext } from "../hooks/useAuthContext"

const TaskFrom = () => {
    const {dispatch} = useTasksContext()
    const {user} = useAuthContext()

    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')
    const [deadline, setDeadline] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user){
            setError('You must be logged in')
            return
        }

        const task = {title, note, deadline}

        const response = await fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(!response.ok){
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }

        if (response.ok) {
            setTitle('')
            setNote('')
            setDeadline('')
            setError(null)
            setEmptyFields([])
            console.log('new task added', json)
            dispatch({type: 'CREATE_TASK', payload: json})
        }
        
    }

    return(
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Task</h3>

            <label>Task Title:</label>
            <input 
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />

            <label>Note (Optional):</label>
            <input 
                type="text"
                onChange={(e) => setNote(e.target.value)}
                value={note}
                className={emptyFields.includes('note') ? 'error' : ''}
            />

            <label>Deadline:</label>
            <input 
                type="date"
                onChange={(e) => setDeadline(e.target.value)}
                value={deadline}
                className={emptyFields.includes('deadline') ? 'error' : ''}
            />

            <button>Add Task</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default TaskFrom