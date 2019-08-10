import React, { Component } from 'react';
import { loadAdminExamsRequest } from '../actions/actions'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/Grid'
import MaterialTable from 'material-table'
import Moment from 'moment'
import Tooltip from '@material-ui/core/Tooltip'
import axios from 'axios'

class AdminExams extends Component {
    
    constructor(props){
        super(props)
    
    }
    
    componentDidMount(){
        this.props.loadAdminExams()
    }

    render() {
        return (
            <div style={{marginLeft:10, marginTop: 40}}>
               
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
                        title="Exames"
                        columns={columns}
                        data={this.props.adminExams}
                        editable={{

                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    axios.patch('api/files/' + oldData._id, newData)
                                        .then(res => {
                                            this.props.loadAdminExams()
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
                                            
                                        }
                                        resolve();
                                    }, 1000);
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
                    </Grid>
             </Grid>
            
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
{ title: 'Nome', field: 'displayName' },
{ title: 'Usuário', field: 'user.completename' },
{ title: 'Lido', field: 'read', type: 'boolean' },
{ title: 'Data subida', 
  field: 'lastActivity',
  type: 'datetime', 
  render: rowData => <Tooltip title={convertDateMax(rowData.lastActivity)}><div> {convertDateMin(rowData.lastActivity) }</div></Tooltip> },
]
const mapStateToProps = (state) => {
    return {
        isFetching: state.adminExams.isFetching,
        adminExams: state.adminExams.data,
        error: state.adminExams.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadAdminExams: () => dispatch(loadAdminExamsRequest())
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(AdminExams)