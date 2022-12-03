import React from 'react';
import { TextField } from '@material-ui/core';
import { styled } from '@mui/material/styles';

const CssTextField = styled(TextField)({
  label:{
    fontSize:'13px'
  },
  '& .MuiInputBase-input': {
    padding: '10px 4px',
    fontSize:'13px'
  },
  '& label.Mui-focused': {
    color: 'rgb(0, 110, 110)',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'rgb(0, 110, 110)',
  },
  '& .MuiInput-underline:before': { 
    borderBottomColor: 'rgb(151, 151, 151)' 
  },
});

const Input = ({ name, handleChange, label, type, value, disabled, authData, user, form }) => (
    <CssTextField onKeyDown={(event) => {
      event.code === 'Space' && event.preventDefault()
    }}
      inputProps={{ maxLength: 15}}
      style={{margin:'13px 0px'}}
      string
      name={name}
      required
      value={!authData ? user.result.name.split(' ')[0] : form.firstName}
      disabled={disabled}
      label={label}
      type={type}
      onChange={handleChange}>
    </CssTextField>
);

export default Input;