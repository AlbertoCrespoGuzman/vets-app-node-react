import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText'
import GroupIcon from '@material-ui/icons/Group'
import ContactMailIcon from '@material-ui/icons/ContactMail'
import ExistToAppIcon from '@material-ui/icons/ExitToApp'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PersonAddIcon from '@material-ui/icons/PersonAdd'

import Register from './Register'
import Users from './Users'
import Profile from './Profile'
import Exams from './Exams'
import AdminExams from './AdminExams'
import AddAdminExams from './AddAdminExams'
import { Link } from 'react-router-dom';
import AddNoteIcon from '@material-ui/icons/NoteAdd'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer(props) {
 
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }
  function onLogout() {
    props.logoutUser(props.history)
  }
  return (
    <div className={classes.root}>
    
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Vets
          </Typography>
          <div className={classes.sectionDesktop} style={{ position: 'absolute', right: '0', top: 15, marginRight:50}}>
            {props.user.completename}
            </div>
            <div className={classes.sectionDesktop} style={{ fontSize: 10, position: 'absolute', right: '0',top:38, marginRight:50}}>
            {props.user.username}
            </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        {props.user.admin && ( 
            <div>
                <List>
                    <ListItem button component={ Link } color="inherit" to="/register" >
                        <ListItemIcon><PersonAddIcon /></ListItemIcon>
                        <ListItemText primary='Adicionar Usuário'/>
                    </ListItem>
                    <ListItem button component={ Link } color="inherit" to="/users" >
                        <ListItemIcon><GroupIcon /></ListItemIcon>
                        <ListItemText primary='Usuários'/>
                    </ListItem>
                    
                </List>
                <Divider />
                <List>
                    <ListItem button component={ Link } color="inherit" to="/add_admin_exams" >
                        <ListItemIcon><AddNoteIcon /></ListItemIcon>
                        <ListItemText primary='Adicionar Exame'/>
                    </ListItem>
                    <ListItem button component={ Link } color="inherit" to="/admin_exams" >
                        <ListItemIcon><PictureAsPdfIcon /></ListItemIcon>
                        <ListItemText primary='Exames'/>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button component={ Link } color="inherit" to="/profile" >
                        <ListItemIcon><ContactMailIcon /></ListItemIcon>
                        <ListItemText primary='Perfil'/>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button  onClick={onLogout} color="inherit"  >
                        <ListItemIcon><ExistToAppIcon /></ListItemIcon>
                        <ListItemText primary='Sair'/>
                    </ListItem>
                </List>
            </div>
        )}
        {!props.user.admin && ( 
            <div>
                <List>
                    <ListItem button component={ Link } color="inherit" to="/exams" >
                        <ListItemIcon><PictureAsPdfIcon /></ListItemIcon>
                        <ListItemText primary='Exames'/>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button component={ Link } color="inherit" to="/profile" >
                        <ListItemIcon><ContactMailIcon /></ListItemIcon>
                        <ListItemText primary='Perfil'/>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button color="inherit" onClick={onLogout}  >
                        <ListItemIcon><ExistToAppIcon /></ListItemIcon>
                        <ListItemText primary='Sair'/>
                    </ListItem>
                </List>
            </div>
        )}
      </Drawer>
      </div>
  );
}
