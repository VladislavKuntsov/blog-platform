import React,  { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import * as actions from '../../Store/actions';
import ArticleItem from "../Article-item/article-item";
import Modal from "../Modal/modal"
import classesFullArticle from './full-article.module.scss';

import Services from '../../Services/services';

const realWorldDBService = new Services;

const FullArticle = ({fullArticle, setIsLoading, history, setArticlesUser, isLogin}) => {

    const [modalActive, setModalActive] = useState(false);

    const updateArticle = () => {
        realWorldDBService.getArticlesUser(isLogin.username).then(bodyy => {
            setArticlesUser(bodyy);
            setIsLoading(false);   
        })
    }

    const onDelete = () => {
        setModalActive(false)
        setIsLoading(true);
        realWorldDBService.deleteArticle(isLogin.token, fullArticle.article.slug).then( () => {
            history.push(`/articles`);
            updateArticle();
        })  
    }

    const button = isLogin && isLogin.username === fullArticle.article.author.username ? (
        <div>
            <div className={classesFullArticle.button}>
                <div onClick={() => setModalActive(true)} role="presentation"><span>Delete</span></div>
                <div onClick={() => history.push(`/new-article/${fullArticle.article.slug}/edit`)}  role="presentation" ><span>Edit</span></div> 
            </div>  
        </div>  
    ) : null

    return (
        <div className={classesFullArticle["bl-full-article"]}>
            <ArticleItem articleData={fullArticle.article} body={fullArticle.article.body} button={button}/>
                <Modal className={classesFullArticle.modal} active={modalActive} setActive={setModalActive}>
                    <p className={classesFullArticle["modal-warning-text"]}>Are you sure to delete this article?</p>
                    <div className={classesFullArticle["modal-button"]}>
                        <div onClick={() => setModalActive(false)} role="presentation"><span>No</span></div>
                        <div onClick={() => {
                            onDelete();
                        }} role="presentation"><span>Yes</span></div>                    
                    </div>    
                </Modal>     
        </div>
    )
}

FullArticle.defaultProps = {
    fullArticle: {},
    history: {},
    isLogin: {},
}

FullArticle.propTypes = {
    fullArticle: PropTypes.shape({
        article: PropTypes.shape({
            body: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            author: PropTypes.shape({
                username: PropTypes.string.isRequired,    
            }).isRequired
        }).isRequired,
    }),
    setIsLoading: PropTypes.func.isRequired,
    history: PropTypes.shape({
    length: PropTypes.number.isRequired,
    push: PropTypes.objectOf.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string
        })
    }),
    setArticlesUser: PropTypes.func.isRequired,
    isLogin: PropTypes.shape({
        username: PropTypes.string,
        image: PropTypes.string,
        token: PropTypes.string,
    })
}

const mapStateProps = (state) => ({
    fullArticle: state.fullArticle,
    isLogin: state.isLogin,
})

const mapDispatchToProps = (dispatch) => {
    const {setArticles, setIsLoading, setArticlesUser} = bindActionCreators(actions, dispatch);

    return {
        setArticles: (payload) => setArticles(payload),
        setIsLoading: payload => setIsLoading(payload),
        setArticlesUser: payload => setArticlesUser(payload),
    }
}

export default withRouter(connect(mapStateProps, mapDispatchToProps)(FullArticle));