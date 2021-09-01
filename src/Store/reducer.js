const initialState = {
    isLoading: true,
    isLogin: JSON.parse(localStorage.getItem("isLogin")) || null,
    articles: null,
    articlesUser: null,
    fullArticle: JSON.parse(localStorage.getItem("fullArticle")) || null,
    currentPage: 1,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SERVICES/SET_ARTICLES":
            return { ...state, articles: action.articles}
        case "SERVICES/SET_ARTICLES_USER":
            return { ...state, articlesUser: action.articlesUser}
        case "SET_IS_LOADING_STATUS":
            return {...state, isLoading: action.isLoading}
        case "SET_CURRENT_PAGE":
            return {...state, currentPage: action.currentPage}
        case "SET_IS_LOGIN":
            return {...state, isLogin: JSON.parse(localStorage.getItem("isLogin"))}    
        case "SET_FULL_ARTICLE":
            return {...state, fullArticle: JSON.parse(localStorage.getItem("fullArticle"))}
        default:
            return state;
    }
}

export default reducer;