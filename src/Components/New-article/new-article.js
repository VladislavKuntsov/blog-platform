import React, {useState} from "react";
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import {Spin} from 'antd';
import { nanoid } from 'nanoid'
import { useForm } from "react-hook-form";
import {connect} from 'react-redux';
import { withRouter, Redirect} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from '../../Store/actions';
import classesNewArticle from './new-article.module.scss';

import Services from '../../Services/services';

const realWorldDBService = new Services;

const NewArticle = ({fullArticle, match, setIsLoading, isLogin}) => {
    
    const [redirect, setRedirect] = useState(false); // redirect

    const {register, handleSubmit, formState: { errors }} = useForm();

    const urlPathname = match.url.indexOf("/edit") > 0; // определяем .../edit или .../new-article

    const arrTagsList = urlPathname ? fullArticle.article.tagList.map((item) => {
        const obj = {id: nanoid(3), tag: item}
        return obj
    }) : null

    const [arrayTags, setArrayTags] = useState( !urlPathname ? [{id: nanoid(3), tag: ""}] : arrTagsList)
    const [isLoadingNewArticle, setIsLoadingNewArticle] = useState(false); // отвечает за загрузку данных

    const update = () => {
        setIsLoadingNewArticle(false)
        setIsLoading(true)
        setRedirect(true)
    }

    const onDeletedTag = (id) => {
        const newArr = arrayTags.filter((item) => item.id !== id);
        setArrayTags(newArr);
    }

    const onAddTag = () => {
        const newTagId = [{id: nanoid(3)}];
        setArrayTags([...arrayTags, ...newTagId])
    }

    const tags = arrayTags.map( item => (

        <div className={classesNewArticle["bl-tag"]} key={item.id}>
            <input
                type="text"
                placeholder="Tag"
                {...register(`tag-${item.id}`, {
                    value: item.tag !== "" ? item.tag : "",
                })}
            />
            { arrayTags.length !== 1 ? 
                <div 
                    className={classesNewArticle["tag-delete"]}
                    onClick={() => onDeletedTag(item.id)}
                    role="presentation"
                >
                    <span>Delete</span>
                </div> 
            : null}
            { arrayTags[arrayTags.length - 1].id === item.id ?
                <div 
                    className={classesNewArticle["tag-add"]}
                    onClick={onAddTag}
                    role="presentation"
                >
                    <span>Add Tag</span>
                </div>
            : null}      
        </div>
    ))

    const onNewArticle = (data) => {
        setIsLoadingNewArticle(true)
        const {token} = isLogin;
        const {title, description, body, ...rest} = data;
        const arrTags = Object.values(rest);

        const userDataNewArticle = {
            article: {
                title,
                description,
                body,
                tagList: arrTags 
            }
        }

        if(urlPathname) {
            realWorldDBService.updateArticle(token, userDataNewArticle, fullArticle.article.slug).then(() => {
                update();
            });
        } else {
                realWorldDBService.postNewArticles(userDataNewArticle, token).then(() => {
                update();
            });
        }
    }

    if(redirect) return <Redirect to="/articles"/>;
    if(urlPathname && isLogin.username !== fullArticle.article.author.username ) return <Redirect to="/articles"/>

    return (
        !isLoadingNewArticle ?
        <>
            <div className={classesNewArticle["bl-new-article"]}>                                                                  
                <h2 className={classesNewArticle.title}>{urlPathname ? "Edit article" : "Create new article"}</h2>
                <form 
                    className={classesNewArticle.form}
                    onSubmit={handleSubmit(data => onNewArticle(data))}
                >
                    <label className={classesNewArticle["input-field"]}>
                        <div>Title</div>
                        <input
                            className={errors.title ? classesNewArticle["warning-border"] : null} 
                            type="text"
                            placeholder="Title"
                            {...register("title", {
                                value: urlPathname ? fullArticle.article.title : "",
                                required: "Required field",
                            })}
                        />
                        <div className={classesNewArticle["warning-text"]}>{errors.title?.message}</div>
                    </label>

                    <label className={classesNewArticle["input-field"]}>
                        <div>Short description</div>
                        <input
                            className={errors.description ? classesNewArticle["warning-border"] : null} 
                            type="text"
                            placeholder="Title"
                            {...register("description", {
                                value: urlPathname ? fullArticle.article.description : "",
                                required: "Required field",
                            })}
                        />
                        <div className={classesNewArticle["warning-text"]}>{errors.description?.message}</div>
                    </label>

                    <label className={classesNewArticle["input-field"]}>
                        <div>Text</div>
                        <textarea 
                            className={errors.body ? classesNewArticle["warning-border"] : null}  
                            wrap="soft"
                            placeholder="Text"
                            {...register("body", {
                                value: urlPathname ? fullArticle.article.body : "",
                                required: "Required field",
                            })}
                        />
                        <div className={classesNewArticle["warning-text"]}>{errors.body?.message}</div>
                    </label>
                    <label className={classesNewArticle["input-tags"]}>
                        <div>Tags</div>
                        {tags}
                    </label>
                    <label className={classesNewArticle["input-create"]}>
                        <input 
                            type="submit" 
                            value="Send" 
                        />
                    </label>
                </form>
            </div>
        </>
        :
        <>
            <div className ={classesNewArticle.spinnerContainer}>
                <Spin size="large" />   
            </div>  
        </>
        
    )
}

NewArticle.defaultProps = {
    isLogin: {},
    fullArticle: {},
}

NewArticle.propTypes = {
    isLogin: PropTypes.shape({
        token: PropTypes.string.isRequired,
        username: PropTypes.string,
        email: PropTypes.string,
    }),
    history: PropTypes.shape({
        length: PropTypes.number.isRequired,
        push: PropTypes.objectOf.isRequired,
        location: PropTypes.objectOf.isRequired,
    }).isRequired,
    setIsLoading: PropTypes.func.isRequired,
    fullArticle: PropTypes.shape({
        article: PropTypes.shape({
            body: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            tagList: PropTypes.arrayOf(PropTypes.string).isRequired,
            author:  PropTypes.shape({
                username: PropTypes.string,
            })
        }).isRequired,
        articlesCount: PropTypes.number
    }),
    isLoading: PropTypes.bool.isRequired,
    match: PropTypes.shape({
        url: PropTypes.string.isRequired
    }).isRequired,
}

const mapStateToProps = (state) => ({
    articlesUser: state.articlesUser,
    fullArticle: state.fullArticle,
    isLogin: state.isLogin,
    isLoading: state.isLoading,
})

const mapDispatchToProps = (dispatch) => {
    const {setIsLoading} = bindActionCreators(actions, dispatch);

    return {
        setIsLoading: (payload) => setIsLoading(payload),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewArticle));