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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Badge from '@material-ui/core/Badge';
import MoreIcon from '@material-ui/icons/MoreVert'
import MenuIcon from '@material-ui/icons/Menu';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx'
import Drawer from './Drawer'
import './css/navbar.css'

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


    constructor(props){
      super(props)
      this.state = {
        anchorEl: null,
        mobileMoreAnchorEl: null,
        isMenuOpen: false,
        isMobileMenuOpen: false,
        menuId: 'primary-search-account-menu'
      }
      this.setAnchorEl = this.setAnchorEl.bind(this)
      this.setMobileMoreAnchorEl = this.setMobileMoreAnchorEl.bind(this)
      this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this)
      this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this)
      this.handleMenuClose = this.handleMenuClose.bind(this)
      this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this)
      this.renderMenu = this.renderMenu.bind(this)
    }
    setAnchorEl(anchorEl) {
      this.setState({
        anchorEl: anchorEl,
        isMenuOpen: !this.state.isMenuOpen
      })
    }
    setMobileMoreAnchorEl(mobileMoreAnchorEl) {
      this.setState({
        mobileMoreAnchorEl: mobileMoreAnchorEl,
        isMobileMenuOpen: !this.state.isMobileMenuOpen
      })
    }


 handleProfileMenuOpen = event => {
    this.setAnchorEl(event.currentTarget);
  };

  handleMobileMenuClose = () => {
    console.log('handleMobileMenuClose')
    this.setMobileMoreAnchorEl(null);
  };

  handleMenuClose = () => {
    this.setAnchorEl(null);
    this.handleMobileMenuClose();
  };

 handleMobileMenuOpen = event => {
   console.log('handleMobileMenuOpen')
      this.setState({
        mobileMoreAnchorEl: event.currentTarget,
        isMobileMenuOpen: !this.state.isMobileMenuOpen
      })
  };

  renderMenu() {
    return (
    <Menu
      anchorEl={this.state.anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={this.state.menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={this.state.isMenuOpen}
      onClose={this.handleMenuClose}
    >
      <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
    </Menu>
  )
  }

  renderMobileMenu(){ 
    console.log('renderMobileMenu')
    return(
      <Menu
      anchorEl={this.state.mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={this.state.mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={this.state.isMobileMenuOpen}
    >
      <MenuItem component={ Link } color="inherit" to="/#about-us"> 
          <Button style={{textTransform: 'none', fontSize: 20, color: '#0188FE' }} onClick={()=>{this.setState({isMobileMenuOpen:false})}} >Sobre nós</Button>
      </MenuItem>
      <MenuItem  component={ Link } color="inherit" to="/#exams" >  
          <Button style={{textTransform: 'none', fontSize: 20, color: '#0188FE' }} onClick={()=>{this.setState({isMobileMenuOpen:false})}}>Exames</Button>
      </MenuItem>
      <MenuItem  component={ Link } color="inherit" to="/#partners">
          <Button style={{textTransform: 'none', fontSize: 20, color: '#0188FE' }} onClick={()=>{this.setState({isMobileMenuOpen:false})}}>Parceiros</Button>
      </MenuItem>
      <MenuItem component={ Link } color="inherit" to="/#contact" >
          <Button style={{textTransform: 'none', fontSize: 20, color: '#0188FE' }} onClick={()=>{this.setState({isMobileMenuOpen:false})}} >Contato</Button>
      </MenuItem>
    </Menu>
     )
  }




    render() {
       
        const {isAuthenticated, user} = this.props.auth;   
        
        const authLinks = (
     //       <div className={classes.sectionDesktop} style={{ position: 'absolute', right: '0'}}>
     //           <Button  onClick={this.onLogout.bind(this)} color="inherit" style={{ marginRight:30}} >Sair</Button>
     //       </div>
     ''
        )
      const guestLinks = (
        <div style={{float: 'right', right:0, position: 'relative'}}>

              <Button style={{marginLeft: -40, marginRight: 40, textTransform: 'none', fontSize: 20, color: '#0188FE' }} component={ Link } color="inherit" to="/#about-us" >Sobre nós</Button>
              <Button style={{marginLeft: 40, marginRight: 40, textTransform: 'none', fontSize: 20, color: '#0188FE' }} component={ Link } color="inherit" to="/#exams" >Exames</Button>
              <Button style={{marginLeft: 40, marginRight: 40, textTransform: 'none', fontSize: 20, color: '#0188FE' }} component={ Link } color="inherit" to="/#partners" >Parceiros</Button>
              <Button style={{marginLeft: 40, marginRight: 40, textTransform: 'none', fontSize: 20, color: '#0188FE' }}  component={ Link } color="inherit" to="/#contact" >Contato</Button>
              
        </div>
      )
      
        return(
            <div>
            <CssBaseline />
                <AppBar position="fixed" className={clsx(classes.appBar, {
                        [classes.appBarShift]: false,
                        })} style={{padding: 15, backgroundColor: 'white'}}>
                    <Toolbar>
                     <a href="/" >
                        <img src='/img/logo_blue.png' height={80}/>
                    </a>
                    <div />
                        <div  />
                            <div className={"navbar-desktop"} style={{
                                  
                                  float: 'right',
                                  position: 'absolute',
                                  right: '0'
                                          }}>
                                {isAuthenticated ? authLinks : guestLinks}
                            </div>
                            <div className={"navbar-mobile"} style={{
                              
                              float: 'right',
                              position: 'absolute',
                               right: '0',
                               color: '#0188FE'
                            }}>
                              <IconButton
                                aria-label="Mostrar Mais"
                                aria-controls={this.state.mobileMenuId}
                                aria-haspopup="true"
                                onClick={this.handleMobileMenuOpen}
                                color="inherit"
                              >
                                <MoreIcon />
                              </IconButton>
                            </div>
                    </Toolbar>
                </AppBar>
                {!isAuthenticated && this.renderMobileMenu()}
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