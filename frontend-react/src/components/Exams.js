import React, { Component } from 'react';
import { loadExamsRequest } from '../actions/actions'
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
import Badge from '@material-ui/core/Badge'
import MailIcon from '@material-ui/icons/Mail'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardTab from '@material-ui/icons/KeyboardTab'
import { CircularProgress, Dialog, DialogTitle, Button, Fab }  from '@material-ui/core/'
import dotenv from 'dotenv'
import ChatDialog from './ChatDialog'

dotenv.config()

class Exams extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            currentDialog: null,
            openErrorDialog: false,
            numPage: 1
        }
        this.removeDialog = this.removeDialog.bind(this)
        this.updateFile = this.updateFile.bind(this)
        this.onCloseErrorDialog = this.onCloseErrorDialog.bind(this)
    }
    updateFile(fileUpdated){
        console.log('updateFile', JSON.stringify(fileUpdated))
        for(var i=0;i<this.props.exams.length;i++){
            if(this.props.exams[i]._id === fileUpdated._id){
                this.props.exams[i] = fileUpdated
                console.log('coinciden! intento cambiar! despues del cambio...', this.props.exams[i])
            }
        }
        this.setState({})
    }
    componentDidMount(){
        this.props.loadExams(this.state.numPage)
    }
    removeDialog(){
        this.setState({
            currentDialog: null
        })
    }
    onCloseErrorDialog() {
        this.setState({
            openErrorDialog: false
        })
    }
    render() {
        return (
            <div style={{marginTop:80, marginLeft:80, width:'100%', height:'100%'}}>
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
                            style={{ minHeight: '100vh',  }}
                        >
                        
                            <Grid item xs={12}>
                            <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'  , displayDirection: 'row', borderRadius: 10, background: 'white', padding: 10}}>
                        <Fab  style={{marginRight: 5}} size="small"  color="secondary" aria-label="Anterior" disabled={this.state.numPage === 1 ? true : false} onClick={ () => {
                            this.setState({
                                numPage: this.state.numPage - 1
                            }, () => {
                                this.props.loadExams(this.state.numPage)
                            })
                        }}>
                            <KeyboardArrowLeft />
                        </Fab>
                        <Typography style={{verticalAlign: 'center', fontSize: 12, marginTop: 10, marginRight: 5 }}>
                            Página {this.state.numPage} de {this.props.pages} Págs. Total : {this.props.total}
                        </Typography>
                        <Fab style={{marginRight: 5}} size="small"  color="secondary" aria-label="Seguinte" disabled={this.state.numPage === this.props.pages ? true : false}  onClick={ () => {
                            this.setState({
                                numPage: this.state.numPage + 1
                            }, () => {
                                this.props.loadExams(this.state.numPage)
                            })
                        }}>
                            <KeyboardArrowRight />
                        </Fab>
                        <Fab style={{marginRight: 5}} size="small"  color="secondary" aria-label="Última" disabled={this.state.numPage === this.props.pages ? true : false}  onClick={ () => {
                            this.setState({
                                numPage: this.props.pages
                            }, () => {
                                this.props.loadExams(this.state.numPage)
                            })
                        }}>
                            <KeyboardTab />
                        </Fab>
                    </div>
                            <MaterialTable
                                title="Exames"
                                columns={columns}
                                data={this.props.exams}
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
                                            {type: 'application/pdf'});
                                            const fileURL = URL.createObjectURL(file);
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
                                            this.setState({
                                                openErrorDialog: true,
                                                errorTitle: 'O Arquivo não está disponível',
                                                errorText: 'O arquivo' + rowData.displayName + ' não se encontra disponível no momento. Uma mensagem automática foi enviada para nossos administradores. ' 
                                            })
                                        });
                                    }
                                    },
                                    rowData => ({
                                        icon: rowData.commentsEnabled ?  (rowData.customerNoReadCommentsCount === 0 || !rowData.customerNoReadCommentsCount ? badgeEmailNoMessages : (rowData.customerNoReadCommentsCount === 1 ? badgeEmail1Messages : (rowData.customerNoReadCommentsCount === 2 ? badgeEmail2Messages : (rowData.customerNoReadCommentsCount === 3 ? badgeEmail3Messages : badgeEmailMoreThan3Messages)))) : '',
                                        tooltip: rowData.commentsEnabled ? 'Mensagens' : '',
                                        onClick: (event, rowData) => {
                                            this.setState({
                                                currentDialog: <ChatDialog updateFile={this.updateFile} file={rowData} removeDialog={this.removeDialog}/>
                                            })
                                        },
                                        disabled: !rowData.commentsEnabled ,
                                        
                                      })
                                ]}
                                
                                options={{
                                    actionsColumnIndex: -1,
                                    exportButton: false,
                                    exportFileName: 'Lista de Exames',
                                    paging: false,
                                    rowStyle: rowData => {
                                        if(rowData.read) {
                                          return {backgroundColor: '#EEE'};
                                        }else{
                                           return { backgroundColor: 'white' }
                                        }
                                      },
                                      
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
                                 <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'  , displayDirection: 'row', borderRadius: 10, background: 'white', padding: 10}}>
                        <Fab  style={{marginRight: 5}} size="small"  color="secondary" aria-label="Anterior" disabled={this.state.numPage === 1 ? true : false} onClick={ () => {
                            this.setState({
                                numPage: this.state.numPage - 1
                            }, () => {
                                this.props.loadAdminExams(this.state.numPage)
                            })
                        }}>
                            <KeyboardArrowLeft />
                        </Fab>
                        <Typography style={{verticalAlign: 'center', fontSize: 12, marginTop: 10, marginRight: 5 }}>
                            Página {this.state.numPage} de {this.props.pages} Págs. Total : {this.props.total}
                        </Typography>
                        <Fab style={{marginRight: 5}} size="small"  color="secondary" aria-label="Seguinte" disabled={this.state.numPage === this.props.pages ? true : false}  onClick={ () => {
                            this.setState({
                                numPage: this.state.numPage + 1
                            }, () => {
                                this.props.loadAdminExams(this.state.numPage)
                            })
                        }}>
                            <KeyboardArrowRight />
                        </Fab>
                        <Fab style={{marginRight: 5}} size="small"  color="secondary" aria-label="Última" disabled={this.state.numPage === this.props.pages ? true : false}  onClick={ () => {
                            this.setState({
                                numPage: this.props.pages
                            }, () => {
                                this.props.loadAdminExams(this.state.numPage)
                            })
                        }}>
                            <KeyboardTab />
                        </Fab>
                    </div>
                            </Grid>
                    </Grid>
                    
             </Grow>
             )}
             <div>
                        {this.state.currentDialog}
             </div>
             <Dialog open={this.state.openErrorDialog} onClose={this.onCloseErrorDialog}>
                <DialogTitle style={{extAlign: 'center'}}>
                    {this.state.errorTitle}
                </DialogTitle>
                    <div style={{textAlign: 'center', marginBottom: 20}}>
                        {this.state.errorText}
                    </div>
                    <Button style={{width:'50%', margin: 10, textAlign:'center',marginLeft:'25%'}} color="primary" onClick={() => {
                        this.setState({
                            openErrorDialog: false
                        })
                } } >Aceitar
                </Button>
             </Dialog>
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
    return  Moment(date).format('DD/MM/YY')
 }
 function convertDateMax(date){
    return  Moment(date).format('DD/MM/YYYY hh:mm A')
 }
const columns = [
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
        isFetching: state.exams.isFetching,
        exams: state.exams.data,
        pages: state.exams.pages,
        total: state.exams.total,
        error: state.exams.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadExams: (numPage) => dispatch(loadExamsRequest(numPage))
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Exams)