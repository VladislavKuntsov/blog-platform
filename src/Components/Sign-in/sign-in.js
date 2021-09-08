import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import {Spin} from 'antd';
import {useForm} from 'react-hook-form';
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../Store/actions';

import classesSignIn from './sign-in.module.scss';

import Services from '../../Services/services';

const realWorldDBService = new Services;


const SignIn = ({setIsLogin}) => {

    const [invalidPasswordEmail, setInvalidPasswordEmail] = useState(false); // неверный пароль или емайл
    const [isLoadingSignIn, setIsLoadingSignIn] = useState(false); // отвечает за загрузку данных
    const [redirect, setRedirect] = useState(false); // redirect

    const {register, handleSubmit, formState: { errors }} = useForm();  // работа с формой

    const onSignIn = (data) => {  // обрабатываем форму и отправляем запрос
        setIsLoadingSignIn(true);

        realWorldDBService.postAuthentication({user: data}).then(body => {

            if(body.errors) {
                setInvalidPasswordEmail(true);    
            } 
            if(body.user) {
                setInvalidPasswordEmail(false);
                localStorage.setItem("isLogin", JSON.stringify(body.user));
                setIsLogin();
                setRedirect(true);
            }
            setIsLoadingSignIn(false);
        }) 
    }

    const errorInvalidData = invalidPasswordEmail ? (

        <div className={classesSignIn.errorInvalidPassword}>
            <img src="https://image.flaticon.com/icons/png/128/258/258393.png" alt='logo User' />
            <span>Wrong login or password</span>
            </div> 
    ) : null

        if(redirect) return <Redirect to="/articles"/>

    return(
        !isLoadingSignIn ?
        <>
            <div className={classesSignIn["bl-sign-in"]}>
                <h2 className={classesSignIn.title}>Sign In</h2>
                {errorInvalidData}
                <form className={classesSignIn.form} onSubmit={handleSubmit( data => onSignIn(data))}>
                    <label className={classesSignIn["input-field"]}>
                        <div>Email address</div>
                        <input 
                            className={errors.email || invalidPasswordEmail ? classesSignIn["warning-border"] : null} 
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
                            className={errors.password || invalidPasswordEmail ? classesSignIn["warning-border"] : null} 
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
                    Don’t have an account? <Link to="/sign-up"><span>Sign Up</span>.</Link>
                </div>     
            </div>    
        </>
        :
        <>
            <div className ={classesSignIn.spinnerContainer}>
                <Spin size="large" />   
            </div>  
        </>
        
    )   
}

SignIn.defaultProps = {
}

SignIn.propTypes = {
    setIsLogin: PropTypes.func.isRequired,
}

const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch) => {
    const {setIsLogin} = bindActionCreators(actions, dispatch);

    return {
        setIsLogin: () => setIsLogin(),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);