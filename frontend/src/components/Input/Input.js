import React from 'react'
import InputContainer from '../InputContainer/InputContainer';
import classes from './input.module.css'

// not going to export this function directly (export default removed)
function Input( { label, type, defaultValue, onChange, onBlur, name, error },
    ref
) {

    // gives specific errors based on error types
    const getErrorMessage = () => {
        if (!error) return; // no error
        if (error.message) return error.message;
        //default error message based on type
        switch (error.type) {
            case 'required':
                return 'This field is required!';
            case 'minLength':
                return 'Field is too short!';
            default:
                return '*'; // general error symbol
        }
    };

  return (
    <InputContainer label={label}>
        <input
            defaultValue = {defaultValue}
            className={classes.input}
            type={type}
            placeholder={label}
            ref={ref}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
        />
        {error && <div className={classes.error}>{getErrorMessage()}</div>}
    </InputContainer>
  );
}

/* 
Instead, we will export this function. 
Do this when you have input inside your custom component 
and you want to forward its reference to its parent.
*/
export default React.forwardRef(Input);
