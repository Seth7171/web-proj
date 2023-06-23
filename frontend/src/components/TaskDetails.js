import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { format } from "date-fns";
import { useState } from "react";
import Confetti from "./Confetti";

const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track whether the task is being edited
  const [editedTask, setEditedTask] = useState(task); // Store the edited task details

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch("/api/tasks/" + task._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_TASK", payload: json });
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Set isEditing to true to switch to edit mode
  };

  const handleSave = async () => {
    const response = await fetch('/api/tasks/' + task._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(editedTask), // Send the updated task details
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_TASK', payload: json });
      setIsEditing(false); // Switch back to view mode after saving
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Cancel the edit mode and discard changes
    setEditedTask(task); // Reset the edited task details to the original task
  };

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value }); // Update the edited task details
  };

  const handleRadioButtonClick = () => {
    setIsVisible(true); // Set isVisible to true when the radio button is clicked
    setTimeout(() => {
      handleClick(); // Call handleClick to delete the task
    }, 3500);
  };

  const formattedDeadline = task.deadline
    ? format(new Date(task.deadline), "MMMM dd, yyyy")
    : "";


    return (
      <>
        {isVisible && <Confetti />}
        {!isVisible && (
          <div className="task-details">
            {isEditing ? (
              <>
                <h4>
                  <input
                    type="text"
                    name="title"
                    value={editedTask.title}
                    onChange={handleChange}
                  />
                </h4>
                <p>
                  <strong>Note: </strong>
                  <textarea
                    name="note"
                    value={editedTask.note}
                    onChange={handleChange}
                  />
                </p>
                <p>
                <label>Type:</label>
                <select
                  name="type"
                  value={editedTask.type}
                  onChange={handleChange}
                >
                  <option value="">Select a type</option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="home">Home</option>
                  <option value="educational">Educational</option>
                </select>
                </p>
                <p>
                  <strong>Deadline: </strong>
                  <input
                    type="date"
                    name="deadline"
                    value={editedTask.deadline}
                    onChange={handleChange}
                  />
                </p>
                <p>
                  <label>Priority:</label>
                  <select
                    name="priority"
                    value={editedTask.priority}
                    onChange={handleChange}
                  >
                    <option value="">Select a Priority</option>
                    <option value="low">Low &#x1F7E9;</option>
                    <option value="medium">Medium &#x1F7E8;</option>
                    <option value="high">High &#x1F534;</option>
                  </select>
                </p>
                <div className="edit-buttons">
                  <button onClick={handleSave}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h4>{task.title}</h4>
                <p>
                  <strong>Note: </strong>
                  {task.note}
                </p>
                <p>
                  <strong>Type: </strong>
                  {task.type}
                </p>
                <p>
                  <strong>Deadline: </strong>
                  {formattedDeadline}
                </p>
                <p>
                  <strong>Priority: </strong>
                  {task.priority}
                </p>
                <span className="material-symbols-outlined" onClick={handleRadioButtonClick}>
                    radio_button_unchecked
                </span>
                <div className="edit-buttons">
                    <button onClick={handleEdit}>Edit</button>
                </div>
              </>
            )}
          </div>
        )}
      </>
    );
  };
  
  export default TaskDetails;


