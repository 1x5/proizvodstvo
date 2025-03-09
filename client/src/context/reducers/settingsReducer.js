export default (state, action) => {
    switch (action.type) {
      case 'GET_SETTINGS':
      case 'UPDATE_SETTINGS':
        return {
          ...state,
          settings: action.payload,
          loading: false
        };
      case 'SETTINGS_ERROR':
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