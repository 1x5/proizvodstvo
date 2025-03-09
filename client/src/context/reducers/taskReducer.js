// client/src/context/reducers/taskReducer.js
export default (state, action) => {
    switch (action.type) {
      case 'GET_TASKS':
        return {
          ...state,
          tasks: action.payload,
          loading: false
        };
      case 'GET_TASK':
        return {
          ...state,
          currentTask: action.payload,
          loading: false
        };
      case 'ADD_TASK':
        return {
          ...state,
          tasks: [action.payload, ...state.tasks],
          loading: false
        };
      case 'UPDATE_TASK':
        return {
          ...state,
          tasks: state.tasks.map(task =>
            task._id === action.payload._id ? action.payload : task
          ),
          currentTask: action.payload,
          loading: false
        };
      case 'DELETE_TASK':
        return {
          ...state,
          tasks: state.tasks.filter(task => task._id !== action.payload),
          loading: false
        };
      case 'FILE_UPLOADED':
        return {
          ...state,
          currentTask: {
            ...state.currentTask,
            attachments: [...state.currentTask.attachments, action.payload.file]
          },
          loading: false
        };
      case 'FILE_DELETED':
        return {
          ...state,
          currentTask: {
            ...state.currentTask,
            attachments: state.currentTask.attachments.filter(
              file => file._id !== action.payload.fileId
            )
          },
          loading: false
        };
      case 'CLEAR_CURRENT_TASK':
        return {
          ...state,
          currentTask: null
        };
      case 'TASK_ERROR':
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case 'CLEAR_ERRORS':
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
  