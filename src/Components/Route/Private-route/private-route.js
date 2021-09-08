import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, isLogin, ...rest}) => (
    <Route {...rest} render={props => (
        isLogin ?
                <Component {...props} />
        : <Redirect to="/sign-in" />
    )}/>   
)

PrivateRoute.defaultProps = {
    isLogin: {},
    component: () => {},

}

PrivateRoute.propTypes = {
    component: PropTypes.func,
    isLogin: PropTypes.shape({
        username: PropTypes.string,
    }),

}

const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
})

export default connect(mapStateToProps)(PrivateRoute)