import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authentication';

import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Users from './components/Users'
import Profile from './components/Profile'
import Exams from './components/Exams'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles,createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

if(localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/login'
  }
}

function App() {
  const [theme, setTheme] = useState({
    palette: {
      type: "light",
      primary: {
        main: '#13aa52'
      },
      secondary: {
        main: '#E33E7F'
      },
      accent: {
        main: '#E33E7F'
      },
      background: {
        default: "#e6e6e6"
      }
    }
  })
  const muiTheme = createMuiTheme(theme);

    return (
      <Provider store = { store }>
        <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Router>
            <div>
              <Navbar />
                <Route exact path="/" component={ Home } />
                <div className="">
                  <Route exact path="/login" component={ Login } />
                  <Route exact path="/forgot_password" component={ ForgotPassword } />
                  <Route exact path="/reset_password" component={ ResetPassword } />
                </div>
            </div>
          </Router>
          </ThemeProvider>
        </Provider>
    );
  }


export default App;
