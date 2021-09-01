import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../Store/actions';
import defaultLogoUser from '../../Images/logoProfile.svg';


import classesHeader from './header.module.scss';

const Header = ({setIsLogin, isLogin}) => {

    const checkingUserAuthorization = isLogin ? (
        <>
            <div className={classesHeader.header_createArticle}>
                <Link to="/new-article"><span>Create article</span></Link>
            </div>
            <div className={classesHeader.header_authorized}>
                <div>
                    <Link to="/edit-profile"><span>{isLogin.username}</span></Link>    
                </div>
                <div>
                    <Link to="/edit-profile"><img src={!isLogin.image  ? defaultLogoUser : isLogin.image} alt='logo User' /></Link>    
                </div>
            </div>    
            <div className={classesHeader.header_logOut}>
                <span 
                    onClick={() => {
                        localStorage.setItem("isLogin", null);
                        setIsLogin();
                    }} 
                    role="presentation"
                >
                Log Out
                </span>
            </div>           
        </> 
    ) : ( 
        <>
            <Link to="/sign-in">    
                <div className={classesHeader.header_signIn}>
                    <span>Sign In</span>
                </div>  
            </Link>
            <Link to="/new-account">
                <div className={classesHeader.header_signUp}>
                    <span>Sign Up</span>
                </div>
            </Link>
        </> 
    )

    return (
        <div className={classesHeader.header}>
            <div className={classesHeader.header_blogName}>
                <Link to="/articles"><span>Realworld Blog</span></Link>
            </div>
            {checkingUserAuthorization}
        </div>
    )    
}

Header.defaultProps = {
    isLogin: {}
}

Header.propTypes = {
    setIsLogin: PropTypes.func.isRequired,
    isLogin: PropTypes.shape({
        username: PropTypes.string,
        image: PropTypes.string
    })
}

const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
})

const mapDispatchToProps = (dispatch) => {
    const {setIsLogin} = bindActionCreators(actions, dispatch);

    return {
        setIsLogin: () => setIsLogin(),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);