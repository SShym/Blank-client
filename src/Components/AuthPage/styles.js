import { makeStyles } from '@material-ui/core/styles';

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
  verifyMailText:{
    userSelect:'none'
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
  submitMail: {
    margin: theme.spacing(1, 0, 1),
  },
}));