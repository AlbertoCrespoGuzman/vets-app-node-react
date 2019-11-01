import React, { Component } from 'react';
import { loadAdminExamsRequest } from '../actions/actions'
import { connect } from 'react-redux'
import ChatDialog from './ChatDialog'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/Grid'
import MaterialTable from 'material-table'
import Moment from 'moment'
import Tooltip from '@material-ui/core/Tooltip'
import axios from 'axios'
import Grow from '@material-ui/core/Grow'
import Button from '@material-ui/core/Button'
import Badge from '@material-ui/core/Badge'
import MailIcon from '@material-ui/icons/Mail'
import CircularProgress from '@material-ui/core/CircularProgress'
import dotenv from 'dotenv'
dotenv.config()

class AdminExams extends Component {
    
    constructor(props){
        super(props)
        this.state= {

        }
        this.removeDialog = this.removeDialog.bind(this)
        this.updateFile = this.updateFile.bind(this)
    }
    updateFile(fileUpdated){
        console.log('updateFile', JSON.stringify(fileUpdated))
        for(var i=0;i<this.props.adminExams.length;i++){
            if(this.props.adminExams[i]._id === fileUpdated._id){
                this.props.adminExams[i] = fileUpdated
                console.log('coinciden! intento cambiar! despues del cambio...', this.props.adminExams[i])
            }
        }
        this.setState({})
    }
    componentDidMount(){
        this.props.loadAdminExams()
    }
    removeDialog(){
        this.setState({
            currentDialog: null
        })
    }
    render() {
        return (
            <div style={{marginLeft:20,marginTop:120, width:'100%', height:'100%'}}>
            {this.props.isFetching && (
                            <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                            style={{flex:1, marginTop:150,justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}
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
                    style={{ minHeight: '120vh', marginLeft: 65 }}
                >
                
                    <Grid item xs={12}>
                    <MaterialTable
                        title="Exames"
                        columns={columns}
                        data={this.props.adminExams}
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
                                if(rowData.displayName && rowData.displayName.split('.').length < 2){
                                    anchor.download = rowData.displayName + '.' + rowData.type;
                                }else{
                                    anchor.download = rowData.displayName
                                }
                                anchor.href = fileURL;
                                anchor.click()
                                //    window.open(fileURL);
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                              }
                            },
                            rowData => ({
                                icon: rowData.commentsEnabled ?  (rowData.adminNoReadCommentsCount === 0 || !rowData.adminNoReadCommentsCount ? badgeEmailNoMessages : (rowData.adminNoReadCommentsCount === 1 ? badgeEmail1Messages : (rowData.adminNoReadCommentsCount === 2 ? badgeEmail2Messages : (rowData.adminNoReadCommentsCount === 3 ? badgeEmail3Messages : badgeEmailMoreThan3Messages)))) : '',
                                tooltip: rowData.commentsEnabled ? 'Mensagens' : '',
                                onClick: (event, rowData) => {
                                    this.setState({
                                        currentDialog: <ChatDialog updateFile={this.updateFile} file={rowData} removeDialog={this.removeDialog}/>
                                    })
                                },
                                disabled: !rowData.commentsEnabled ,
                                
                              })
                          ]}
                          components={[
                                  {
                                    Action: props => (
                                    <Button
                                        onClick={(event) => props.action.onClick(event, props.data)}
                                        color="primary"
                                        variant="contained"
                                        style={{textTransform: 'none'}}
                                        size="small"
                                    >
                                        Olhar
                                    </Button>
                                    ),
                                },
                                {
                                    Action: props => (
                                    <Button
                                        onClick={(event) => props.action.onClick(event, props.data)}
                                        color="primary"
                                        variant="contained"
                                        style={{textTransform: 'none'}}
                                        size="small"
                                    >
                                        Deletar
                                    </Button>
                                    ),
                                }
                        ]}
                        editable={{
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                        console.log('newData', newData)
                                        
                                        axios.patch(process.env.REACT_APP_API_HOST + '/api/files/' + oldData._id, newData)
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
                            exportFileName: 'Lista de Exames',
                            paging: true,
                            pageSize: this.props.adminExams.length
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
             </Grow>
             )}
             <div>
                {this.state.currentDialog}
            </div>
            </div>
        );
    }
}
const badgeEmailNoMessages = () => 
 (
    <Badge  color="primary">
          <MailIcon />
        </Badge>
  )
  const badgeEmail1Messages = () => (
    <Badge  badgeContent={1} color="primary">
          <MailIcon />
        </Badge>
  )
  const badgeEmail2Messages = () => (
    <Badge  badgeContent={2} color="primary">
          <MailIcon />
        </Badge>
  )
  const badgeEmail3Messages = () => (
    <Badge  badgeContent={3} color="primary">
          <MailIcon />
        </Badge>
  )
  const badgeEmailMoreThan3Messages = () => (
    <Badge  badgeContent="+3" color="primary">
          <MailIcon />
        </Badge>
  )
function convertDateMin(date){
    if(date != null){
        return  Moment(date).format('DD/MM/YY')
    }else{
        return '-'
    }
 }
 function convertDateMax(date){
    if(date != null){
        return  Moment(date).format('DD/MM/YYYY hh:mm A')
    }else{
        return '-'
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