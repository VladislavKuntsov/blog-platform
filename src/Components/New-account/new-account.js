
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import {Spin} from 'antd';
import  {Link, Redirect} from "react-router-dom";
import {useForm} from "react-hook-form";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../Store/actions';
import classesNewAccount from './new-account.module.scss';

import Services from '../../Services/services';

const realWorldDBService = new Services;

const NewAccount = ({setIsLogin}) => {

    const [errorEmailIsTaken, setErrorEmailIsTaken] = useState(false) // почта занята
    const [errorUsernameIsTaken, setErrorUsernameIsTaken] = useState(false) // имя занято
    const [errorEmailAndUsernameAreBusy, setErrorEmailAndUsernameAreBusy] = useState(false) // Почта и имя уже занято
    const [isLoadingNewAccount, setIsLoadingNewAccount] = useState(false); // отвечает за загрузку данных этого компонента
    const [redirect, setRedirect] = useState(false); // redirect


    const { register, handleSubmit, watch, formState: { errors }} = useForm(); // работа с формой

    const onNewAccount = (userData) => { // обрабатываем форму и отправляем запрос

        setIsLoadingNewAccount(true);
        setErrorEmailAndUsernameAreBusy(false);
        setErrorEmailIsTaken(false);
        setErrorUsernameIsTaken(false);            

        const userDataRegistration = {
            user: userData
        };

        delete userDataRegistration.user["repeat-password"];

        realWorldDBService.postNewAccoun(userDataRegistration).then( (body) => {

            if(body.errors) {
                if(body.errors.email && body.errors.username) setErrorEmailAndUsernameAreBusy(true);  
                if(body.errors.email && !body.errors.username) setErrorEmailIsTaken(true);
                if(body.errors.username && !body.errors.email) setErrorUsernameIsTaken(true);  
                setIsLoadingNewAccount(false);              
            }            

            if(body.user) {
                delete userDataRegistration.user.username; 

                realWorldDBService.postAuthentication(userDataRegistration).then( (dataUser) => {
                    localStorage.setItem("isLogin", JSON.stringify(dataUser.user));
                    setIsLogin();
                    setIsLoadingNewAccount(false);   
                    setRedirect(true);
                }) 
            }
        });
    }

    const errorEmail = errorEmailIsTaken ? (
        <div className={classesNewAccount.errorInvalidData}>
            <img src="https://image.flaticon.com/icons/png/128/258/258393.png" alt='logo User' />
            <span>A user with such mail is already registered in the system</span>
            </div> 
    ) : null
    
    const errorUsername = errorUsernameIsTaken ? (
        <div className={classesNewAccount.errorInvalidData}>
            <img src="https://image.flaticon.com/icons/png/128/258/258393.png" alt='logo User' />
            <span>A user with this name is already registered in the system</span>
            </div> 
    ) : null

    const errorEmailAndUsername = errorEmailAndUsernameAreBusy ? (
        <div className={classesNewAccount.errorInvalidData}>
            <img src="https://image.flaticon.com/icons/png/128/258/258393.png" alt='logo User' />
            <span>A user with the same name and mail is already registered in the system</span>
            </div> 
    ) : null

    if(redirect) return <Redirect to="/articles"/>

    return (
        !isLoadingNewAccount ?
        <>
            <div className={classesNewAccount["bl-new-account"]}>
                <h2 className={classesNewAccount.title}>Create new account</h2>
                {errorEmail}
                {errorUsername}
                {errorEmailAndUsername}
                <form 
                    className={classesNewAccount.form} 
                    onSubmit={handleSubmit((data) => onNewAccount(data))}
                >
                    <label className={classesNewAccount["input-field"]}>
                        <div>Username</div>
                        <input 
                            className={errors.username || errorUsernameIsTaken || errorEmailAndUsernameAreBusy ? classesNewAccount["warning-border"] : null} 
                            type="text" 
                            placeholder="Username" 
                            {...register("username", {
                                required: "Your name needs be less than 3 characters",
                                minLength: {value: 3, message: "Your name needs be less than 3 characters"},
                                maxLength: {value: 20, message: "Your name needs be no more than 20 characters"},
                            })} 
                        />
                        <div className={classesNewAccount["warning-text"]}>{errors.username?.message}</div>
                    </label>
                    <label className={classesNewAccount["input-field"]}>
                        <div>Email address</div>
                        <input 
                            className={errors.email || errorEmailIsTaken || errorEmailAndUsernameAreBusy ? classesNewAccount["warning-border"] : null} 
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
                        <div className={classesNewAccount["warning-text"]}>{errors.email?.message}</div>
                    </label>
                    <label className={classesNewAccount["input-field"]}>
                        <div>Password</div>
                        <input 
                            className={errors.password ? classesNewAccount["warning-border"] : null} 
                            type='password' 
                            placeholder="Password" 
                            {...register("password", {
                                required: "Your password needs to be at least 8 characters",
                                minLength: {value: 8, message: "Your password needs to be at least 8 characters"},
                                maxLength: {value: 40, message: "Your password needs be no more than 40 characters"}
                            })} 
                        />
                        <div className={classesNewAccount["warning-text"]}>{errors.password?.message}</div>
                    </label>
                    <label className={classesNewAccount["input-field"]}>
                        <div>Repeat Password</div>
                        <input 
                            className={errors["repeat-password"] ? classesNewAccount["warning-border"] : null} 
                            type='password' 
                            placeholder="Password" 
                            {...register("repeat-password", {
                                required: "Passwords must match",
                                validate: {
                                    coincidence: value => value === watch('password')
                                }
                            })} 
                        />
                        <div className={classesNewAccount["warning-text"]}>{errors["repeat-password"] ? "Passwords must match" : null}</div>
                    </label>
                    <label className={classesNewAccount["input-agreement"]}>
                        <input 
                            type="checkbox" 
                            required="required" 
                            defaultChecked
                        />
                        <span>I agree to the processing of my personal information</span>                    
                    </label>
                    <label className={classesNewAccount["input-create"]}>
                        <input 
                            type="submit" 
                            value="Create" 
                        />
                    </label>    
                </form>  
                <div className={classesNewAccount["meta-sign-in"]}>
                    Already have an account? <Link to="sign-in"><span>Sign In</span>.</Link>
                </div>     
            </div>    
        </> 
        :
        <>
            <div className ={classesNewAccount.spinnerContainer}>
                <Spin size="large" />   
            </div>                 
        </>
    )
}

NewAccount.defaultProps = {
}


NewAccount.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(NewAccount);