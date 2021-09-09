import React,  { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import {Spin} from 'antd';
import { connect } from 'react-redux';
import { withRouter, Redirect} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import * as actions from '../../Store/actions';
import ArticleItem from "../Article-item/article-item";
import Modal from "../Modal/modal"
import classesFullArticle from './full-article.module.scss';

import Services from '../../Services/services';

const realWorldDBService = new Services;

const FullArticle = ({fullArticle, setIsLoading, match, setFullArticle, isLogin}) => {

    const articleSlug = match.params.slug;

    const [modalActive, setModalActive] = useState(false);
    const [isLoadingFullArticle, setIsLoadingFullArticle] = useState(true); 
    const [redirect, setRedirect] = useState({articles: false, edit: false}); 

    useEffect (() => {
        if(isLoadingFullArticle) {
            realWorldDBService.getFullArticle(articleSlug).then( (article) => {
                localStorage.setItem("fullArticle", JSON.stringify(article))
                setFullArticle();
                setIsLoadingFullArticle(false)
            })    
        }
    }, [isLoadingFullArticle, setIsLoadingFullArticle, setFullArticle, articleSlug])

    const onDelete = () => {
        setModalActive(false)
        realWorldDBService.deleteArticle(isLogin.token, fullArticle.article.slug).then( () => {
            setIsLoading(true);
            setRedirect({articles: true, edit: false})
        })  
    }

    const onEdit = () => setRedirect({articles: false, edit: true})

    const button = isLogin && !isLoadingFullArticle && isLogin.username === fullArticle.article.author.username ? (
        <div>
            <div className={classesFullArticle.button}>
                <div onClick={() => setModalActive(true)} role="presentation"><span>Delete</span></div>
                <div onClick={() => onEdit()} role="presentation" ><span>Edit</span></div> 
            </div>  
        </div>  
    ) : null

    if(redirect.articles) return <Redirect to="/articles"/>
    if(redirect.edit) return <Redirect to={`/articles/${fullArticle.article.slug}/edit`}/>    

    return (
        !isLoadingFullArticle ?
        <>
            <div className={classesFullArticle["bl-full-article"]}>
                <ArticleItem articleData={fullArticle.article} body={fullArticle.article.body} button={button}/>
                    <Modal className={classesFullArticle.modal} active={modalActive} setActive={setModalActive}>
                        <p className={classesFullArticle["modal-warning-text"]}>Are you sure to delete this article?</p>
                        <div className={classesFullArticle["modal-button"]}>
                            <div onClick={() => setModalActive(false)} role="presentation"><span>No</span></div>
                            <div onClick={() => onDelete()} role="presentation"><span>Yes</span></div>                    
                        </div>    
                    </Modal>     
            </div>        
        </>
        :
        <>
        <div className ={classesFullArticle.spinnerContainer}>
            <Spin size="large" />   
        </div>           
        </>
    )
}

FullArticle.defaultProps = {
    fullArticle: {},
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
    setFullArticle: PropTypes.func.isRequired,
    isLogin: PropTypes.shape({
        username: PropTypes.string,
        image: PropTypes.string,
        token: PropTypes.string,
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            slug: PropTypes.string.isRequired,
        })
    }).isRequired,
}

const mapStateProps = (state) => ({
    fullArticle: state.fullArticle,
    isLogin: state.isLogin,
})

const mapDispatchToProps = (dispatch) => {
    const {setArticles, setIsLoading, setFullArticle} = bindActionCreators(actions, dispatch);

    return {
        setArticles: (payload) => setArticles(payload),
        setIsLoading: payload => setIsLoading(payload),
        setFullArticle: () => setFullArticle(),
    }
}

export default withRouter(connect(mapStateProps, mapDispatchToProps)(FullArticle));