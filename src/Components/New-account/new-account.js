
import React/* , {useState} */ from 'react';
import PropTypes from 'prop-types';
import {useForm} from "react-hook-form";

import  {Link, withRouter} from "react-router-dom";
import classesNewAccount from './new-account.module.scss';

import Services from '../../Services/services';

const realWorldDBService = new Services;

const NewAccount = ({history}) => {

    const { register, handleSubmit, watch, formState: { errors }} = useForm();

    return (
        <div className={classesNewAccount["bl-new-account"]}>
            <h2 className={classesNewAccount.title}>Create new account</h2>
            <form 
                className={classesNewAccount.form} 
                onSubmit={handleSubmit((data) => {
                    const userDataRegistration = {
                        user: data
                    };
                    delete userDataRegistration.user["repeat-password"];
                    realWorldDBService.postNewAccoun(userDataRegistration);
                    history.push("/sign-in")
                })}
            >
                <label className={classesNewAccount["input-field"]}>
                    <div>Username</div>
                    <input 
                        className={errors.username ? classesNewAccount["warning-border"] : null} 
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
                        className={errors.email ? classesNewAccount["warning-border"] : null} 
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
    )
}

NewAccount.defaultProps = {
    history: {},
}


NewAccount.propTypes = {
    history: PropTypes.shape({
        length: PropTypes.number.isRequired,
        push: PropTypes.objectOf.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string
            })
        }),
}

export default withRouter(NewAccount);