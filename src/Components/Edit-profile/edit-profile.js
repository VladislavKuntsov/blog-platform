import React from 'react';
import PropTypes from 'prop-types';
import {useForm} from 'react-hook-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter} from 'react-router-dom';
import * as actions from '../../Store/actions';
import Services from '../../Services/services';

import classesEditProfile from './edit-profile.module.scss';

const realWorldDBService = new Services;


const SignIn = ({dataAuthorizationUser, setDataAuthorizationUser, history}) => {

    const {register, handleSubmit, formState: {errors}} = useForm();

    const isValidUrl = (url) => {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

        if(url === "") return true;

        return pattern.test(url)
    }

    const onEditProfile = (data) => {
        const {token} = dataAuthorizationUser;
        const userDataEditProfile = {user: data};

        realWorldDBService.postEditProfile(userDataEditProfile, token).then(body => {
            setDataAuthorizationUser(body.user)    
            history.push(`/articles`)
        })
    }

    return (
        <div className={classesEditProfile["bl-edit-profile"]}>
            <h2 className={classesEditProfile.title}>Edit Profile</h2>
            <form className={classesEditProfile.form} onSubmit={handleSubmit(data => onEditProfile(data))}>
                <label className={classesEditProfile["input-field"]}>
                    <div>Username</div>
                    <input 
                        className={errors.username ? classesEditProfile["warning-border"] : null}
                        type="text" 
                        placeholder="Username" 
                        {...register("username", {
                            value: dataAuthorizationUser ? dataAuthorizationUser.username : "",
                            required: "Your name needs be less than 3 characters",
                            minLength: {value: 3, message: "Your name needs be less than 3 characters"},
                            maxLength: {value: 20, message: "Your name needs be no more than 20 characters"},
                        })}
                    />
                    <div className={classesEditProfile["warning-text"]}>{errors.username?.message}</div>
                </label>
                <label className={classesEditProfile["input-field"]}>
                    <div>Email address</div>
                    <input 
                        className={errors.email ? classesEditProfile["warning-border"] : null} 
                        type="email" 
                        placeholder="Email address"
                        {...register("email", {
                            value: dataAuthorizationUser ? dataAuthorizationUser.email : "",
                            required: "Please enter a valid email address",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter a valid email address'
                            }
                        })}
                    />
                     <div className={classesEditProfile["warning-text"]}>{errors.email?.message}</div>
                </label>
                <label className={classesEditProfile["input-field"]}>
                    <div>New password</div>
                    <input 
                        className={errors.password ? classesEditProfile["warning-border"] : null} 
                        type='password' 
                        placeholder="Password" 
                        {...register("password", {
                            required: "Your password needs to be at least 8 characters",
                            minLength: {value: 8, message: "Your password needs to be at least 8 characters"},
                            maxLength: {value: 40, message: "Your password needs be no more than 40 characters"}
                        })} 
                    />
                    <div className={classesEditProfile["warning-text"]}>{errors.password?.message}</div>
                </label>
                <label className={classesEditProfile["input-field"]}>
                    <div>Avatar image (url)</div>
                    <input 
                        className={errors.image ? classesEditProfile["warning-border"] : null} 
                        type="text" 
                        placeholder="Avatar image"
                        {...register("image", {
                            validate: {
                                validUrl: value => isValidUrl(value)
                            }
                        })}
                    />
                    <div className={classesEditProfile["warning-text"]}>{errors.image ? "Please enter a valid url adress" : null}</div>
                </label>
                <label className={classesEditProfile["input-create"]}>
                    <input 
                        type="submit" 
                        value="Save" 
                    />
                </label>    
            </form>   
        </div>    
    )
}

SignIn.defaultProps = {
    dataAuthorizationUser: null,
    history: {},
}

SignIn.propTypes = {
    dataAuthorizationUser:  PropTypes.shape({
        token: PropTypes.string.isRequired,
        username: PropTypes.string,
        email: PropTypes.string,
    }),
    setDataAuthorizationUser: PropTypes.func.isRequired,
    history: PropTypes.objectOf(PropTypes.object),
}

const mapStateToProps = (state) => ({
    dataAuthorizationUser: state.dataAuthorizationUser,
})

const mapDispatchToProps = (dispatch) => {
    const {setDataAuthorizationUser} = bindActionCreators(actions, dispatch);

    return {
        setDataAuthorizationUser: (payload) => setDataAuthorizationUser(payload)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));