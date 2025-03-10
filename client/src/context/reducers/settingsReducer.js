// client/src/context/reducers/settingsReducer.js
const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        loading: false
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        loading: false
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
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

export default settingsReducer;