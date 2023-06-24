import { useState } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import { useAuthContext } from "../hooks/useAuthContext"

const TaskForm = () => {
    const { dispatch } = useTasksContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')
    const [deadline, setDeadline] = useState('')
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const task = { title, note, deadline, type, priority }

        const response = await fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }

        if (response.ok) {
            setTitle('')
            setNote('')
            setDeadline('')
            setType('')
            setPriority('')
            setError(null)
            setEmptyFields([])
            console.log('new task added', json)
            dispatch({ type: 'CREATE_TASK', payload: json })
        }

    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Task</h3>

            <span>Task Title*:</span>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />

            <span>Note:</span>
            <input
                type="text"
                onChange={(e) => setNote(e.target.value)}
                value={note}
                className={emptyFields.includes('note') ? 'error' : ''}
            />

            <span>Deadline:</span>
            <input
                type="date"
                onChange={(e) => setDeadline(e.target.value)}
                value={deadline}
                className={emptyFields.includes('deadline') ? 'error' : ''}
            />
            
            <span>Type:</span>
            <select
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={emptyFields.includes("type") ? "error" : ''}
            >
                <option value="">Select a type</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="home">Home</option>
                <option value="educational">Educational</option>
            </select>

            <span>Priority:</span>
            <select
                type="text"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={emptyFields.includes("priority") ? "error" : ''}
            >
                <option value="none">Select a Priority</option>
                <option value="none">None</option>
                <option value="low">Low &#x1F7E9;</option>
                <option value="medium">Medium &#x1F7E8;</option>
                <option value="high">High &#x1F534;</option>
            </select>

            <button>Add Task</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default TaskForm;
