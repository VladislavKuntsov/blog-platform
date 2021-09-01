export const setArticles = (payload) => ({type: "SERVICES/SET_ARTICLES", articles: payload});

export const setArticlesUser = (payload) => ({type: "SERVICES/SET_ARTICLES_USER", articlesUser: payload});

export const setCurrentPage = (payload) => ({type: "SET_CURRENT_PAGE", currentPage: payload});

export const setIsLogin = () => ({type: "SET_IS_LOGIN"});

export const setFullArticle = () => ({type: "SET_FULL_ARTICLE"});

export const setIsLoading = (payload) => ({type: "SET_IS_LOADING_STATUS", isLoading: payload});