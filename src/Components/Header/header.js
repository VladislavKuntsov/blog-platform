import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../Store/actions';
import defaultLogoUser from '../../Images/logoProfile.svg';


import classesHeader from './header.module.scss';

const Header = ({setIsLogin, isLogin, setIsLoading}) => {

    const checkingUserAuthorization = isLogin ? (
        <>
            <div className={classesHeader.header_createArticle}>
                <Link to="/new-article"><span>Create article</span></Link>
            </div>
            <div className={classesHeader.header_authorized}>

                <div>
                    <Link to="/profile"><span>{isLogin.username}</span></Link>    
                </div>
                <div>
                    <Link to="/profile"><img src={!isLogin.image  ? defaultLogoUser : isLogin.image} alt='logo User' /></Link>    
                </div>
                
            </div>    
            <div className={classesHeader.header_logOut}>
                <span 
                    onClick={() => {
                        localStorage.clear();
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
            <Link to="/sign-up">
                <div className={classesHeader.header_signUp}>
                    <span>Sign Up</span>
                </div>
            </Link>
        </> 
    )

    return (
        <div className={classesHeader["wrapper-header"]}>
            <div className={classesHeader.header}>
                <div className={classesHeader.header_blogName}>
                    <Link to="/articles"><span onClick={() => setIsLoading(true)} role="presentation">Realworld Blog</span></Link>
                </div>
                {checkingUserAuthorization}
            </div>
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
    }),
    setIsLoading: PropTypes.func.isRequired, 
}

const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
})

const mapDispatchToProps = (dispatch) => {
    const {setIsLogin, setIsLoading} = bindActionCreators(actions, dispatch);

    return {
        setIsLogin: () => setIsLogin(),
        setIsLoading: (payload) => setIsLoading(payload),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);