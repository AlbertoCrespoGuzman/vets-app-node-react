import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx'
import Drawer from './Drawer'

const drawerWidth = 240;

const classes = makeStyles(theme => ({
    root: {
        display: "flex"
      },
      appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        })
      },
      appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })
      },
      menuButton: {
        marginLeft: 12,
        marginRight: 36
      },
      hide: {
        display: "none"
      },
      drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap"
      },
      drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })
      },
      drawerClose: {
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: "hidden",
        width: theme.spacing.unit * 7 + 1,
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing.unit * 9 + 1
        }
      },
      toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3
      },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        },
        float: 'right',
        position: 'absolute',
         right: '0'
      },
    title: {
      flexGrow: 1,
      marginLeft: 300
    },
  }))

class Navbar extends Component {
  
    render() {
       
        const {isAuthenticated, user} = this.props.auth;   
        
        const authLinks = (
     //       <div className={classes.sectionDesktop} style={{ position: 'absolute', right: '0'}}>
     //           <Button  onClick={this.onLogout.bind(this)} color="inherit" style={{ marginRight:30}} >Sair</Button>
     //       </div>
     ''
        )
      const guestLinks = (
        <div style={{margin:'auto'}}>
    
              <Button style={{marginLeft: -40, marginRight: 40}} component={ Link } color="inherit" to="/#about-us" >Sobre nós</Button>
              <Button style={{marginLeft: 40, marginRight: 40}} component={ Link } color="inherit" to="/#exams" >Exames</Button>
              <Button style={{marginLeft: 40, marginRight: 40}} component={ Link } color="inherit" to="/#contact" >Contato</Button>
              <Button style={{marginLeft: 40, marginRight: 40}} component={ Link } color="inherit" to="/partners" >Parceiros</Button>
              <Button style={{position: 'absolute', right: 10}} component={ Link } color="inherit" to="/login" >Consulte seu exame</Button>
 
          
        </div>
      )
      
        return(
            <div className={classes.root}>
            <CssBaseline />
                <AppBar position="fixed" className={clsx(classes.appBar, {
                        [classes.appBarShift]: false,
                        })}>
                    <Toolbar>
                    
                    <Typography variant="h6" className={classes.title} >
                        Vets
                    </Typography>
                    <div />

                        {isAuthenticated ? authLinks : guestLinks}
                    </Toolbar>
                </AppBar>
                { isAuthenticated ? (
                    <Drawer logoutUser={this.props.logoutUser} history={this.props.history} user={user}/>

                ) : ''}
            </div>
          
        )
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

//ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
 //   container: PropTypes.object,
 // };
export default connect(mapStateToProps, { logoutUser })(withRouter(Navbar));