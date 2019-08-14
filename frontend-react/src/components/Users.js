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
import axios from 'axios'
import Grow from '@material-ui/core/Grow'
import CircularProgress from '@material-ui/core/CircularProgress'
import dotenv from 'dotenv'
dotenv.config()

class Users extends Component {
    
    constructor(props){
        super(props)
    
    }
    
    componentDidMount(){
        this.props.loadUsers()
    }

    render() {
        return (
            <div style={{marginLeft:10, marginTop: 40, width:'100%', height:'100%'}}>
            {this.props.isFetching && (
                            <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                            style={{flex:1, marginTop:100,justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}
                          >
                                <CircularProgress />
                            </Grid>
                        )}
               {!this.props.isFetching && (
               <Grow
                in={!this.props.isFetching}
                style={{ transformOrigin: '0 0 0' }}
                {...(!this.props.isFetching ? { timeout: 1000 } : {})}
                >
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
                                    axios.patch(process.env.REACT_APP_API_HOST + '/api/users/' + oldData._id, newData)
                                        .then(res => {
                                            this.props.loadUsers()
                                            resolve()
                                        })
                                       .catch(err => {
                                            reject()
                                       })
                                }),
                            onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        {
                                            alert('opção não habilitada')
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
                          localization={{
                            header: {
                                actions: 'Ações'
                            },
                            body: {
                              emptyDataSourceMessage: 'Sem dados para mostrar',
                              editRow: {
                                deleteText: 'Tem certeza que quer deletar o usuário?'
                              }
                            },
                            toolbar: {
                              searchTooltip: 'Procurar',
                              searchPlaceholder: 'Procurar',
                              exportTitle: 'Exportar CSV',
                              exportAriaLabel: 'Exportar CSV',
                              exportName: 'Exportar CSV'

                            },
                            pagination: {
                              labelRowsSelect: 'Filas',
                              labelDisplayedRows: '{count} de {from}-{to} ',
                              firstTooltip: 'Primeira',
                              previousTooltip: 'Anterior',
                              nextTooltip: 'Seguinte',
                              lastTooltip: 'Última Página'
                            }
                          }}
                        />
                    </Grid>
             </Grid>
             </Grow>
             )}
            
            </div>
        );
    }
}
function convertDateMin(date){
    return  Moment(date).format('DD/MM/YY')
 }
 function convertDateMax(date){
    return  Moment(date).format('DD/MM/YYYY hh:mm A')
 }
const columns = [
{ title: 'E-mail', field: 'username' },
{ title: 'Nome', field: 'completename' },
{ title: 'CPF/CNPJ', field: 'cpf' },
{ title: 'Endereço',
  field: 'address',
  render: rowData => <Tooltip title={rowData.address ? rowData.address : 'Sem Endereço definido'} placement="top"><div> {( rowData.address && rowData.address.length > 5) ? (rowData.address.substring(0,5) + '...') : rowData.address} </div></Tooltip>  },
{ title: 'Atividade', 
  field: 'lastActivity',
  type: 'datetime', 
  render: rowData => <Tooltip title={convertDateMax(rowData.lastActivity)}><div> {convertDateMin(rowData.lastActivity) }</div></Tooltip> },
{
  title: 'Tipo',
  field: 'type',
  lookup: { 1: 'Cliente', 2: 'Clínica', 3: 'Veterinário', 4: 'Admin' },
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