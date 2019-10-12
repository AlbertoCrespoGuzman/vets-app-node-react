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
import Partners from './components/Partners'
import AdminExams from './components/AdminExams'
import AddAdminExams from './components/AddAdminExams'
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
    typography: {
      fontFamily: "Open Sans",
      fontSize: 14,
      fontWeightLight: 100,
      fontWeightRegular: 400,
      fontWeightMedium: 500
     },
    palette: {
      type: "light",
      primary: {
        main: '#0188FE'
      },
      secondary: {
        main: '#F7F8F9'
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
              <Navbar theme={muiTheme}/>
                <div style={{marginLeft:0}}>
                  <Route exact path="/login" component={ Login } />
                  <Route exact path="/" component={ Home } />
                  <Route exact path="/partners" component={ Partners } />
                  <Route exact path="/forgot_password" component={ ForgotPassword } />
                  <Route exact path="/reset_password" component={ ResetPassword } />
                  <Route exact path="/users" component={ Users } />
                  <Route exact path="/profile" component={ Profile } />
                  <Route exact path="/exams" component={ Exams } />
                  <Route exact path="/add_admin_exams" component = { AddAdminExams } />
                  <Route exact path="/admin_exams" component={ AdminExams } />
                  <Route exact path="/register" component={ Register } />
                </div>
            </div>
          </Router>
          </ThemeProvider>
        </Provider>
    );
  }


export default App;
