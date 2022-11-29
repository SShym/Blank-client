import { makeStyles } from '@material-ui/core/styles';
import mainPng from '../../png/main.png'

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  successSvg: {
    userSelect:'none',
    width:'80px',
    height:'80px'
  },
  verifyMail: {
    zIndex:'777',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    textAlign:'center',
    position:'absolute',
    width:'100%',
    height:'100%',
    backgroundColor: 'rgb(24, 247, 98)',
    fontSize:'15px',
    padding:'5px 15px',
    border:'1px solid',
    animation: `$myEffect 1500ms`
  },
  verifyMailText:{
    userSelect:'none'
  },
  "@keyframes myEffect": {
    "0%": {
      opacity: 0,
      transform: "translateY(0%)"
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)"
    }
  },
  confirmMail: {
    margin: theme.spacing(1),
    backgroundColor: 'dark',
  },
  mailSvg: {
    width:'20px'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  formConfirmMail: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  navigateToMainPage: {
    textDecoration:'none',
    fontSize:'18px'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submitMail: {
    margin: theme.spacing(1, 0, 1),
  },
}));