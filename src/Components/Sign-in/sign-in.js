import React from 'react';
import PropTypes from 'prop-types';
import {useForm} from 'react-hook-form';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../Store/actions';

import classesSignIn from './sign-in.module.scss';

import Services from '../../Services/services';

const realWorldDBService = new Services;


const SignIn = ({setIsLoading, history, setIsLogin}) => {

    const {register, handleSubmit, formState: { errors }} = useForm();

    const onSignIn = (data) => {
        setIsLoading(true);
        history.push(`/articles`);

        realWorldDBService.postAuthentication({user: data})
            .then(body => {
                localStorage.setItem("isLogin", JSON.stringify(body.user))
                setIsLogin();
                setIsLoading(false);
            });
    }

    return(
        <div className={classesSignIn["bl-sign-in"]}>
            <h2 className={classesSignIn.title}>Sign In</h2>
            <form className={classesSignIn.form} onSubmit={handleSubmit( data => onSignIn(data))}>
                <label className={classesSignIn["input-field"]}>
                    <div>Email address</div>
                    <input 
                        className={errors.email ? classesSignIn["warning-border"] : null} 
                        type="email" 
                        placeholder="Email address" 
                        {...register("email", {
                            required: "Please enter a valid email address",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter a valid email address'
                            }
                        })}
                    />
                    <div className={classesSignIn["warning-text"]}>{errors.email?.message}</div>
                </label>
                <label className={classesSignIn["input-field"]}>
                    <div>Password</div>
                    <input 
                        className={errors.password ? classesSignIn["warning-border"] : null} 
                        type='password' 
                        placeholder="Password" 
                        {...register("password", {
                            required: "Your password needs to be at least 8 characters",
                            minLength: {value: 8, message: "Your password needs to be at least 8 characters"},
                            maxLength: {value: 40, message: "Your password needs be no more than 40 characters"},
                        })}
                    />
                    <div className={classesSignIn["warning-text"]}>{errors.password?.message}</div>
                </label>
                <label className={classesSignIn["input-create"]}>
                    <input 
                        type="submit" 
                        value="Login" 
                    />
                </label> 
            </form>  
            <div className={classesSignIn["meta-sign-up"]}>
                Don’t have an account? <Link to="/new-account"><span>Sign Up</span>.</Link>
            </div>     
        </div>    
    )   
}

SignIn.defaultProps = {
}

SignIn.propTypes = {
    history: PropTypes.shape({
        length: PropTypes.number.isRequired,
        push: PropTypes.objectOf.isRequired,
        }).isRequired,
        setIsLoading: PropTypes.func.isRequired,
    setIsLogin: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
    const { setIsLoading, setIsLogin} = bindActionCreators(actions, dispatch);

    return {
        setIsLoading: (payload) => setIsLoading(payload),
        setIsLogin: () => setIsLogin(),
    }
}

export default withRouter(connect(null, mapDispatchToProps)(SignIn));