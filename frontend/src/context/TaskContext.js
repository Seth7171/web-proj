import { createContext, useReducer } from "react";

export const TasksContext = createContext()

export const tasksReducer = (state, action) => {
    switch (action.type) {
      case 'SET_TASKS':
        return {
          tasks: action.payload || state.tasks // Handle initial state if payload is null
        };
  
      case 'CREATE_TASK':
        return {
          tasks: [action.payload, ...state.tasks]
        };
  
      case 'DELETE_TASK':
        return {
          tasks: state.tasks.filter((w) => w._id !== action.payload._id)
        };
  
      default:
        return state;
    }
  };
  
  export const TasksContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tasksReducer, {
      tasks: [] // Set initial state with an empty array
    });
  
    return (
      <TasksContext.Provider value={{ ...state, dispatch }}>
        {children}
      </TasksContext.Provider>
    );
};
  