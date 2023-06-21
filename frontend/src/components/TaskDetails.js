import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { format } from "date-fns";
import { useState } from 'react';
import Confetti from './Confetti';

const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [isVisible, setIsVisible] = useState(false);

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

  const handleRadioButtonClick = () => {
    setIsVisible(true); // Set isVisible to true when the radio button is clicked
    setTimeout(() => {
      handleClick(); // Call handleClick to delete the task
    }, 5000);
  };

  const formattedDeadline = format(new Date(task.deadline), "MMMM dd, yyyy");

  return (
    <>
      {isVisible && <Confetti />}
      {!isVisible && (
        <div className="task-details">
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
          <span className="material-symbols-outlined" onClick={handleRadioButtonClick}>
            radio_button_unchecked
          </span>
        </div>
      )}
    </>
  );
};

export default TaskDetails;
