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
import Button from '@material-ui/core/Button'
import dotenv from 'dotenv'
dotenv.config()

class Users extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            collapse: true
        }
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
                    <div style={{flex: 1, alignContent: 'center', margin: 10}}><Button onClick={()=>{ this.setState({ collapse: !this.state.collapse})}}>{this.state.collapse ? 'Ver todas Colunas' :  'Ocultar Colunas'}</Button></div>
               
                    <MaterialTable
                        title="Usuários"
                        columns={!this.state.collapse ? columns : collapsedColumns}
                        data={this.props.users}
                        editable={{

                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    if(!this.state.collapse){
                                        axios.patch(process.env.REACT_APP_API_HOST + '/api/users/' + oldData._id, newData)
                                        .then(res => {
                                            this.props.loadUsers()
                                            resolve()
                                        })
                                       .catch(err => {
                                            reject()
                                       })
                                    }else{
                                        alert('Habilite todas as colunas para realizar essa ação')
                                        resolve()
                                    }
                                    
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
                        detailPanel={[
                            {
                              tooltip: 'Ver Exames',
                              render: rowData => {
                                return (
                                    <Grow
                                        in={!this.props.isFetching}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!this.props.isFetching ? { timeout: 1000 } : {})}
                                        >
                                  <div
                                    style={{
                                      fontSize: 100,
                                      textAlign: 'center',
                                      color: 'white',
                                      backgroundColor: '#43A047',
                                      padding: 20
                                    }}
                                  >
                                    <MaterialTable
                                            title="Exames"
                                            columns={columnsFiles}
                                            data={rowData.files}
                                            actions={[
                                                {
                                                icon: 'remove_red_eye',
                                                tooltip: 'Visualizar Arquivo',
                                                onClick: (event, rowData) => {
                                                axios(process.env.REACT_APP_API_HOST + '/api/files/' + rowData._id, {
                                                        method: 'GET',
                                                        responseType: 'blob' //Force to receive data in a Blob Format
                                                    })
                                                    .then(response => {
                                                        const file = new Blob(
                                                        [response.data], 
                                                        {type: 'application/pdf'})
                                                        
                                                        const fileURL = URL.createObjectURL(file)
                                                    var anchor = document.createElement("a");
                                                    anchor.download = rowData.displayName + '.' + rowData.type;
                                                    anchor.href = fileURL;
                                                    anchor.click()
                                                    //    window.open(fileURL);
                                                    })
                                                    .catch(error => {
                                                        console.log(error);
                                                    });
                                                }
                                                }
                                            ]}
                                            editable={{

                                                onRowDelete: oldData =>
                                                    new Promise((resolve, reject) => {
                                                        axios.delete(process.env.REACT_APP_API_HOST + '/api/files/' + oldData._id)
                                                            .then(res => {
                                                                this.props.loadAdminExams()
                                                                resolve(res)
                                                            })
                                                            .catch(err => {
                                                                reject(err)
                                                            })
                                                    })
                                            }}
                                    options={{
                                        actionsColumnIndex: -1,
                                        exportButton: true,
                                        exportFileName: 'Lista de Exames'
                                    }}
                                    localization={{
                                        header: {
                                            actions: 'Ações'
                                        },
                                        body: {
                                        emptyDataSourceMessage: 'Sem dados para mostrar',
                                        editRow: {
                                            deleteText: 'Tem certeza que quer deletar o exame?'
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
                                  </div>
                                 </Grow>
                                )
                              },
                            },]}
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
{
    title: 'Tipo',
    field: 'type',
    lookup: { 1: 'Cliente', 2: 'Clínica', 3: 'Veterinário', 4: 'Admin' },
},
{ title: 'CPF/CNPJ', field: 'cpf' },
{ title: 'Endereço',
  field: 'address' },
 // render: rowData => <Tooltip title={rowData.address ? rowData.address : 'Sem Endereço definido'} placement="top"><div> {( rowData.address && rowData.address.length > 5) ? (rowData.address.substring(0,5) + '...') : rowData.address} </div></Tooltip>  },
{ title: 'Atividade', 
  field: 'lastActivity',
  type: 'datetime', 
  render: rowData => <Tooltip title={convertDateMax(rowData.lastActivity)}><div> {convertDateMin(rowData.lastActivity) }</div></Tooltip> },
{ title: 'Fone', field: 'phone' },
{ title: 'Responsável  Tecnico', field: 'technicalSupport' },
{ title: 'CRMV', field: 'crmv' },
]
const collapsedColumns = [
    { title: 'Nome', field: 'completename' },
    {
        title: 'Tipo',
        field: 'type',
        lookup: { 1: 'Cliente', 2: 'Clínica', 3: 'Veterinário', 4: 'Admin' },
    },
    
    { title: 'Atividade', 
      field: 'lastActivity',
      type: 'datetime', 
      render: rowData => <Tooltip title={convertDateMax(rowData.lastActivity)}><div> {convertDateMax(rowData.lastActivity) }</div></Tooltip> },
   
    ]

const columnsFiles = [
    { title: 'Nome', field: 'displayName' },
    { title: 'Tipo', field: 'type' },
    { title: 'Lido', field: 'read', type: 'boolean' },
    { title: 'Data subida', 
      field: 'lastActivity',
      type: 'datetime', 
      render: rowData => <Tooltip title={convertDateMax(rowData.lastActivity)}><div> {convertDateMax(rowData.lastActivity) }</div></Tooltip> },
    ]



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