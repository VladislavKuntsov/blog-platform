import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux'; 
import 'antd/dist/antd.css';
import { Pagination as Pagin, Spin } from 'antd';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import * as actions from '../../Store/actions'; 
import ArticleItem from "../Article-item/article-item";
import classesArticlesList from './articles-list.module.scss';


const ArticlesList = ({articles,  isLoading, currentPage, setCurrentPage, setIsLoading, articlesUser, isLogin}) =>   {

    const newArticles = articlesUser &&  !isLoading && isLogin ? articlesUser : articles

    const сhangePageNumber = (nextPage) => {
        window.scroll(0, 0);
        setIsLoading(true);
        setCurrentPage(nextPage);
    }

    const spinner = isLoading ? 
        <div className ={classesArticlesList.spinnerContainer}>
            <Spin size="large" />   
        </div> : 
        null;

    const articlesList = !isLoading /* && articles */ ? newArticles.articles.map((item) => (
        <div key={uuidv4()}>
            <ArticleItem articleData={item}/>    
        </div>)) : 
        null

    const pagination = !isLoading ? 
        <div className={classesArticlesList.articlesPagination}>
            <Pagin
                defaultCurrent={1}
                current={currentPage}
                total={newArticles.articlesCount} 
                showSizeChanger={false}
                pageSize={20}
                showQuickJumper={false}
                onChange={сhangePageNumber}
            />   
        </div> :
        null

    return (
        <div>
            {articlesList}
            {spinner}
            {pagination}
        </div>
    )
}

ArticlesList.defaultProps = {
    articlesUser: {},
    articles: {},
    isLogin: {},
}

ArticlesList.propTypes = {
    setCurrentPage: PropTypes.func.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    currentPage: PropTypes.number.isRequired,
    articles: PropTypes.shape({
        articles: PropTypes.arrayOf(PropTypes.object).isRequired,
        articlesCount: PropTypes.number.isRequired
      }),
    articlesUser: PropTypes.shape({
        articles: PropTypes.arrayOf(PropTypes.object).isRequired,
        articlesCount: PropTypes.number.isRequired
    }),
    isLogin: PropTypes.shape({
        username: PropTypes.string,
    }),
}

const mapStateToProps = (state) => ({
    isLoading: state.isLoading,
    currentPage: state.currentPage,
    articles: state.articles,
    articlesUser: state.articlesUser,
    isLogin: state.isLogin,
})

const mapDispatchToProps = (dispatch) => {
    const {setCurrentPage, setIsLoading} = bindActionCreators(actions, dispatch);

    return {
        setCurrentPage: (payload) => setCurrentPage(payload),
        setIsLoading: (payload) => setIsLoading(payload),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesList);