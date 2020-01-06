import React, { Component } from 'react'
import dotenv from 'dotenv'
import { Card, Grid, FormControl, TextField, Select, FormHelperText, CircularProgress, Button, Tooltip } from '@material-ui/core/'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadUsersRequest } from '../actions/actions'
import moment from 'moment'
import MaterialTable from 'material-table'
dotenv.config()

class AdminExamsFilter extends Component {
    constructor(props){
        super(props)
        this.state = {

            user: false,
            displayName : '',
            userId: 0,
            userFilter: '',
            filteredUsers: [],
            firstTimeUpdated: false,
            monthFilter: moment().format('MM/YYYY'),
            filteredMonths: [],
            exams: false,
            isFetchingExams: false
        }
        this.handleUserFilterChange = this.handleUserFilterChange.bind(this)
        this.handleSelectedUser = this.handleSelectedUser.bind(this)
        this.handleSelectedMonth = this.handleSelectedMonth.bind(this)
    }
    componentDidMount(){
        this.props.loadUsers()
        const currentMonth = moment().month()
        let months = []

        let i = 0

        while(moment().format('MM/YYYY') != moment([2019, 7, 1]).add(i, 'months').format('MM/YYYY')){
            months.push(moment([2019, 7, 1]).add(i, 'months').format('MM/YYYY'))
            i++
        }
        months.push(moment([2019, 7, 1]).add(i, 'months').format('MM/YYYY'))
        this.setState({
            filteredMonths: months
        })
    }
    componentDidUpdate(){
        if(!this.state.firstTimeUpdated){
            if(this.props.users && this.props.users.length > 0){
                this.setState({
                    firstTimeUpdated: true,
                    filteredUsers: this.props.users
                })
            }
        }
    }
    handleUserFilterChange(e){
        var tempUsers = []
        this.props.users.forEach((user)=> {
            if(user.completename.toLowerCase().includes(e.target.value.toLowerCase())){
                tempUsers.push(user)
            }
        })
        this.setState({
            filteredUsers: tempUsers,
            userFilter: e.target.value,
        })
    }
    handleSelectedMonth(e) {
        this.setState({
            monthFilter: e.target.value
        }, () => {
            console.log(this.state.monthFilter)
        })
        
    }
    handleSelectedUser(e){
        if(e && e.target.value != 0){
            var userOk = ''
            this.props.users.map((user, index)=>{
                if(user._id === e.target.value) userOk = user
            })
            this.setState({
                userId: e.target.value,
                user: userOk,
                errors: ''
            })
        }else{
            this.setState({
                userNameSelected: false,
                userId: 0
            })
        }
        
    }
    render(){
        return (
            <div style={{width: '80%',margin: 40, marginTop:120, marginLeft:80}}>
            <Card style={{minHeight: 300}}
            alignitems="center"
                        justify="center">
                         {this.props.isFetchingUsers && (
                     <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        style={{marginTop: 30}}
                    >
                            <CircularProgress />
                        </Grid>
            )}
            { !this.props.isFetchingUsers && (
                <div>
                        <FormControl style={{marginLeft: 50, marginTop:10}}>
                                <TextField
                                label="Filtrar Usuário"
                                type="text"
                                id="userFilter"
                                value={ this.state.userFilter }
                                name="userFilter"
                                onChange={this.handleUserFilterChange}
                                aria-describedby="userFilter-text"
                                />
                        </FormControl>
                        <FormControl fullWidth={true} style={{paddingLeft: 50, paddingRight:50, paddingTop:10, paddingBottom:10}}>
                            <Select
                            native
                            variant="outlined"
                            value={this.state.userId}
                            onChange={this.handleSelectedUser}
                            >
                            <option value={0} > Escolher Usuário </option>
                                {this.state.filteredUsers.map( (user, index) => {
                                    return (
                                        <option key={user._id} value={user._id}>{user.completename} 
                                        </option>
                                    )
                                })}
                            </Select>
                            {this.state.errors && (<FormHelperText id="username-text" style={{color: 'red'}}>{this.state.errors}</FormHelperText>)}
                        </FormControl>
                        <FormControl fullWidth={true} style={{paddingLeft: 50, paddingRight:50, paddingTop:10, paddingBottom:10}}>
                            <Select
                            native
                            variant="outlined"
                            value={this.state.monthFilter}
                            onChange={this.handleSelectedMonth}
                            >
                            
                                {this.state.filteredMonths.map( (month, index) => {
                                    return (
                                        <option key={index} value={month}>{month} 
                                        </option>
                                    )
                                })}
                            </Select>
                            
                        </FormControl>
                        <div style={{width:'100%', display: 'flex', justifyContent: 'center'}}>
                                <Button onClick={ () => {
                                    console.log('filtar', this.state.userId + ' | ' + this.state.monthFilter)
                                    if(this.state.userId === 0 ){
                                        console.log('ola')
                                        this.setState({
                                            errors: 'Escolha um usuário'
                                        })
                                    }else{
                                        this.setState({
                                            isFetchingExams: true
                                        }, ()=> {
                                            axios.get(process.env.REACT_APP_API_HOST + '/api/files/filtering', {
                                                        params: {
                                                            userId: this.state.userId,
                                                            month: this.state.monthFilter
                                                    }
                                                })
                                                .then(response => {
                                                    console.log(response.data)
                                                this.setState({
                                                    exams: response.data,
                                                    isFetchingExams: false
                                                })
                                                })
                                                .catch(error => {
                                                    console.log(error);
                                                
                                                })
                                        })
                                        
                                    }
                                }}>
                                    Filtrar
                                </Button>
                        </div>
                </div>
                )} 
                {this.state.isFetchingExams && (
                    <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{marginTop: 30}}
                    >
                        <CircularProgress />
                    </Grid>
                )}
                {!this.state.isFetchingExams &&this.state.exams && (
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        Total exames achados: {this.state.exams.length}
                    </div>
                )}
                
                {!this.state.isFetchingExams && this.state.exams && this.state.exams.length >  0 && (
                    <div style={{marginTop: 30}}>
                    
                    <MaterialTable
                    title="Exames"
                    columns={columns}
                    data={this.state.exams}
                    options={{
                        actionsColumnIndex: -1,
                        exportButton: true,
                        exportFileName: 'Lista de Exames',
                        paging: false
                      }}
                    />
                    </div>
                )}
            </Card>
            </div>
        )
    }
}
AdminExamsFilter.propTypes = {
    auth: PropTypes.object.isRequired
}
const mapStateToProps = (state) => {
    return {
        isFetchingUsers: state.users.isFetching,
        users: state.users.data,
        error: state.users.error,
        auth: state.auth
    }
}
function convertDateMin(date){
    if(date != null){
        return  moment(date).format('DD/MM/YY')
    }else{
        return '-'
    }
 }
 function convertDateMax(date){
    if(date != null){
        return  moment(date).format('DD/MM/YYYY hh:mm A')
    }else{
        return '-'
    }
 }
const mapDispatchToProps = (dispatch) => {
    return {
        loadUsers: () => dispatch(loadUsersRequest())
    }
} 
const columns = [
    { title: 'Nome', field: 'displayName' },
    { title: 'Subido', 
      field: 'lastActivity',
      type: 'datetime', 
      render: rowData => <Tooltip title={convertDateMax(rowData.lastActivity)}><div> {convertDateMin(rowData.lastActivity) }</div></Tooltip> },
    { title: 'Usuário', field: 'user.completename' },
    //{ title: 'Tipo', field: 'type' },
    { title: 'Lido', field: 'read', type: 'boolean' },
    
    { title: 'Arquivo lido', 
      field: 'lastRead',
      type: 'datetime', 
      render: rowData => <Tooltip title={convertDateMax(rowData.lastRead)}><div> {convertDateMin(rowData.lastRead) }</div></Tooltip> },
      { title: 'Mensagens', field: 'commentsEnabled', type: 'boolean' },
      { title: 'Msgs Não lidas', field: 'adminNoReadCommentsCount'},
    
    ]
export default connect(mapStateToProps, mapDispatchToProps)(AdminExamsFilter)
