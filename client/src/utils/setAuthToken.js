// client/src/utils/setAuthToken.js
import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
    console.log('Токен установлен в заголовки axios');
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    console.log('Токен удален из заголовков axios');
  }
};

export default setAuthToken;