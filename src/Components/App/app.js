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


const App = ({setArticles, setIsLoading, currentPage, isLoading}) =>  {

    const articleCountOffset = (currentPage - 1) * 20; // смещение колличества статей

    useEffect(() => {
        if(isLoading === true) {
            realWorldDBService.getArticles(articleCountOffset).then(body => {
                setArticles(body);
                setIsLoading(false); 
            })              
        }
   
    }, [setArticles, setIsLoading, articleCountOffset, isLoading]);

    return (
        <div>
            <Router>
                <Header/>
                <Route path={["/", "/articles"]} exact component={ArticlesList} />
                <Route path="/sign-up" exact component={NewAccount} />
                <Route path="/sign-in" exact component={SignIn} />
                <Route path="/articles/:slug" exact component={FullArticle} />
                <PrivateRoute path="/profile" exact component={EditProfile} />
                <PrivateRoute path="/new-article" exact component={NewArticle} />
                <PrivateRoute path="/articles/:slug/edit" component={NewArticle} />
            </Router>
        </div>
    )
}

App.defaultProps = {
}

App.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    setArticles: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
}

const mapStateToProps = (state) => ({
    currentPage: state.currentPage,
    isLoading: state.isLoading,
}) 

const mapDispatchToProps = (dispatch) => {
    const {setArticles, setIsLoading} = bindActionCreators(actions, dispatch);

    return {
        setIsLoading: (payload) => setIsLoading(payload),
        setArticles: (payload) => setArticles(payload),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

