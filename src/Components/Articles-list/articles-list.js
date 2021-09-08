import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux'; 
import 'antd/dist/antd.css';
import { Pagination as Pagin, Spin } from 'antd';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import SmoothScroll from 'smooth-scroll';
import * as actions from '../../Store/actions'; 
import ArticleItem from "../Article-item/article-item";
import classesArticlesList from './articles-list.module.scss';


const ArticlesList = ({articles,  isLoading, currentPage, setCurrentPage, setIsLoading}) =>   {

    const сhangePageNumber = (nextPage) => {
        const  scroll  =  new  SmoothScroll() ; 
        scroll.animateScroll (0);
        setIsLoading(true);
        setCurrentPage(nextPage);
    }

    return (
            !isLoading ? 
            <>
                {articles.articles.map((item) => (
                    <div key={uuidv4()}>
                        <ArticleItem articleData={item}/>    
                    </div>
                ))}
                <div className={classesArticlesList.articlesPagination}>
                    <Pagin
                        defaultCurrent={1}
                        current={currentPage}
                        total={articles.articlesCount} 
                        showSizeChanger={false}
                        pageSize={20}
                        showQuickJumper={false}
                        onChange={сhangePageNumber}
                    />   
                </div>
            </>    
            :
            <>
                <div className ={classesArticlesList.spinnerContainer}>
                    <Spin size="large" />   
                </div>                 
            </>
    )
};

ArticlesList.defaultProps = {
    articles: {},
};

ArticlesList.propTypes = {
    setCurrentPage: PropTypes.func.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    currentPage: PropTypes.number.isRequired,
    articles: PropTypes.shape({
        articles: PropTypes.arrayOf(PropTypes.object).isRequired,
        articlesCount: PropTypes.number.isRequired
    }),
};

const mapStateToProps = (state) => ({
    isLoading: state.isLoading,
    currentPage: state.currentPage,
    articles: state.articles,
    articlesUser: state.articlesUser,
    isLogin: state.isLogin,
});

const mapDispatchToProps = (dispatch) => {
    const {setCurrentPage, setIsLoading} = bindActionCreators(actions, dispatch);

    return {
        setCurrentPage: (payload) => setCurrentPage(payload),
        setIsLoading: (payload) => setIsLoading(payload),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesList);