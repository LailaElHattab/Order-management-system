import { useState, useEffect, createContext } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState();

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (error.response.status === 401) {
      setUser(null);
    }
    return Promise.reject(error);
    
  });

  useEffect(() => {
    axios.get('/profile')
      .then(resp => setUser(resp.data))
      .catch(() => setUser(null));
  }, []);

  return { user, setUser };
};

export const AuthContext = createContext({
  user: null,
  setUser: () => { },
});




