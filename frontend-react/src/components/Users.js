import React, { Component } from 'react';
import { loadUsersRequest } from '../actions/actions'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/Grid'
import MaterialTable from 'material-table'
import Moment from 'moment'
import Tooltip from '@material-ui/core/Tooltip'

class Users extends Component {
    
    constructor(props){
        super(props)
    
    }
    
    componentDidMount(){
        this.props.loadUsers()
    }

    render() {
        return (
            <div style={{marginLeft:10, marginTop: 50}}>
               
               <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh',  }}
                >
                
                    <Grid item xs={12}>
                    <MaterialTable
                        title="Usuários"
                        columns={columns}
                        data={this.props.users}
                        editable={{

                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        {
                                            
                                        }
                                        resolve();
                                    }, 1000);
                                }),
                            onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        {
                                            
                                        }
                                        resolve();
                                    }, 1000);
                                })
                        }}
                        options={{
                            actionsColumnIndex: -1,
                            exportButton: true,
                            exportFileName: 'Usuarios'
                          }}
                          
                        />
                    </Grid>
             </Grid>
            
            </div>
        );
    }
}
function convertDate(date){
    return  Moment(date).format('DD/MM/YYYY hh:mm A')
 }
const columns = [
{ title: 'E-mail', field: 'username' },
{ title: 'Verificado', field: 'verified', type: 'boolean' },
{ title: 'Nome Completo', field: 'completename' },
{ title: 'CPF/CNPJ', field: 'cpf' },
{ title: 'Endereço',
  field: 'address',
  render: rowData => <Tooltip title={rowData.address ? rowData.address : 'Sem Endereço definido'} placement="top"><div> {( rowData.address && rowData.address.length > 5) ? (rowData.address.substring(0,5) + '...') : rowData.address} </div></Tooltip>  },
{ title: 'Última atividade', 
  field: 'lastActivity',
  type: 'datetime', 
  render: rowData => <div> {convertDate(rowData.lastActivity) }</div> },
{
  title: 'Tipo Usuário',
  field: 'type',
  lookup: { 1: 'Client', 2: 'Clínica', 3: 'Veterinário', 4: 'Admin' },
},]
const mapStateToProps = (state) => {
    return {
        isFetching: state.users.isFetching,
        users: state.users.data,
        error: state.users.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadUsers: () => dispatch(loadUsersRequest())
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Users)