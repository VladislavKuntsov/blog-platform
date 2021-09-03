import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../Store/actions';
import PrivateRoute from '../Route/Private-route/private-route';

import Header from '../Header/header';
import SignIn from '../Sign-in/sign-in';
import EditProfile from '../Edit-profile/edit-profile';
import NewAccount from '../New-account/new-account';
import ArticlesList from '../Articles-list/articles-list';
import NewArticle from '../New-article/new-article';
import FullArticle from '../Full-article/full-article';

import Services from '../../Services/services';

const realWorldDBService = new Services;


const App = ({setArticles, setArticlesUser, setIsLoading, currentPage, isLogin}) =>  {

    useEffect(() => {

        realWorldDBService.getArticles(currentPage * 20).then(body => {
            setArticles(body);
            if(isLogin) {
                realWorldDBService.getArticlesUser(isLogin.username).then(bodyy => {
                    setArticlesUser(bodyy);
                    setIsLoading(false);
                })
            }  else setIsLoading(false);
        })     

        if(isLogin) {
            setIsLoading(true);
            realWorldDBService.getArticlesUser(isLogin.username).then(bodyy => {
                setArticlesUser(bodyy);
                setIsLoading(false);
            })
        }
        
    }, [setArticles, setArticlesUser, setIsLoading, currentPage, isLogin]);


    return (
        <div>
            <Router>
                <Header/>
                <Route path={["/", "/articles"]} exact component={ArticlesList} />
                <Route path="/new-account" exact component={NewAccount} />
                <Route path="/sign-in" exact component={SignIn} />
                <Route path="/articles/:slug" exact component={FullArticle} />
                <PrivateRoute path="/edit-profile" exact component={EditProfile} />
                <PrivateRoute path="/new-article" exact component={NewArticle} />
                <PrivateRoute path="/new-article/:slug/edit" component={NewArticle} />
            </Router>
        </div>
    )
}

App.defaultProps = {
    isLogin: {},
}

App.propTypes = {
    setIsLoading: PropTypes.func.isRequired,
    setArticles: PropTypes.func.isRequired,
    setArticlesUser: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    isLogin: PropTypes.shape({
        username: PropTypes.string,
    }),
}

const mapStateToProps = (state) => ({
    currentPage: state.currentPage,
    isLogin: state.isLogin,
}) 

const mapDispatchToProps = (dispatch) => {
    const {setArticles, setIsLoading, setArticlesUser} = bindActionCreators(actions, dispatch);

    return {
        setIsLoading: (payload) => setIsLoading(payload),
        setArticles: (payload) => setArticles(payload),
        setArticlesUser: (payload) => setArticlesUser(payload),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

