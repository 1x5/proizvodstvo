export default (state, action) => {
    switch (action.type) {
      case 'GET_STATUSES':
      case 'UPDATE_STATUSES':
        return {
          ...state,
          statuses: action.payload,
          loading: false
        };
      case 'ADD_STATUS':
        return {
          ...state,
          statuses: [...state.statuses, action.payload],
          loading: false
        };
      case 'UPDATE_STATUS':
        return {
          ...state,
          statuses: state.statuses.map(status =>
            status._id === action.payload._id ? action.payload : status
          ),
          loading: false
        };
      case 'DELETE_STATUS':
        return {
          ...state,
          statuses: state.statuses.filter(status => status._id !== action.payload),
          loading: false
        };
      case 'STATUS_ERROR':
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