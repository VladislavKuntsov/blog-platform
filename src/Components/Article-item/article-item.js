import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown'
import { withRouter, Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import * as actions from '../../Store/actions'; 
import likeOff from '../../Images/likeOff.svg';

import classesArticlesItem from './article-item.module.scss';

const ArticleItem = ({articleData, body, button}) => {

    const {title, favoritesCount, author, updatedAt, tagList, description} = articleData;

    const сhangingDateFormat = (data) => new Date(data).toLocaleString('en-us', { month: 'long', year: 'numeric', day: 'numeric' });

    return (
        <div className={classesArticlesItem.articlesContainer}>
            <div>
                <div>
                    <div className={classesArticlesItem.headers}>
                        <h3 className={classesArticlesItem.title}>
                            <Link to={`/articles/${articleData.slug}`} role="presentation">
                                {title}   
                            </Link>
                        </h3>
                        <div className={classesArticlesItem.reactionsLikes}>
                            <div className={classesArticlesItem.reactionsLikes__items}>
                                <img src={likeOff} alt='Rate article'/>
                            </div>
                            <div className={classesArticlesItem.reactionsLikes__count}>
                                {favoritesCount}
                            </div>
                        </div>
                    </div>
                    <div className={classesArticlesItem.someTags}>
                        <Tags data={tagList} />
                    </div>
                    <div className={classesArticlesItem.articlesText}>
                        {description}
                    </div>
                </div>
                <div className={classesArticlesItem.profileInformation}>
                    <div className={classesArticlesItem.profileInformation__dataPerson}>
                        <div className={classesArticlesItem.fullName}>
                            {author.username}
                        </div>
                        <div className={classesArticlesItem.postDate}>
                            {сhangingDateFormat(updatedAt)}
                        </div>    
                    </div>
                    <div className={classesArticlesItem.profileInformation__logo}>
                        <img src={author.image} alt='logo User' />
                    </div>
                </div>                
            </div>
            <div className={classesArticlesItem.articlesBody}>
                <ReactMarkdown >
                    {body}
                </ReactMarkdown >
            </div>
            <div className={classesArticlesItem.articlesButton}>
                    {button}  
            </div>
        </div>
    )
}

const Tags = ({data}) => (
    data.slice(0,6).map((item) => (
        <div key={uuidv4()}>
            {item}
        </div>
    ))
)

ArticleItem.defaultProps = {
    body: "",
    button: null,
}

ArticleItem.propTypes = {
    articleData:  PropTypes.shape({
        body: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        favoritesCount: PropTypes.number.isRequired,
        author: PropTypes.shape({
            username: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
        }).isRequired,
        updatedAt: PropTypes.string.isRequired,
        tagList: PropTypes.arrayOf(PropTypes.string).isRequired,
        description: PropTypes.string.isRequired,
      }).isRequired,
    body: PropTypes.string,
    button: PropTypes.shape({
        $$typeof: PropTypes.objectOf.isRequired,
        type: PropTypes.string.isRequired
    }),
}

const mapDispatchToProps = (dispatch) => {
    const {setFullArticle} = bindActionCreators(actions, dispatch);

    return {
        setFullArticle: () => setFullArticle(),
    }
}

export default withRouter(connect(null, mapDispatchToProps)(ArticleItem));