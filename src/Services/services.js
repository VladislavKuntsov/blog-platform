import { Component } from "react";

export default class realWorldDBService extends Component {

  API_BASE = 'https://conduit.productionready.io/api/';

  async getResourse(url) {
    const response = await fetch(url);

    if (!response.ok) {
    return new Error(`Could not fetch ${url} received ${response.status}`);
    }

    const body = await response.json();

    return body;
  }
  
  getArticles(offset) {
    return this.getResourse(`${this.API_BASE}articles?offset=${offset}`);
  }

  getArticlesUser(username) {
    return this.getResourse(`${this.API_BASE}articles?author=${username}`);
  }

  getFullArticle(slug) {
    return this.getResourse(`${this.API_BASE}articles/${slug}`);
  }






  async postResourse(url, options) {

    const response = await fetch(url, options);

 /*    if (!response.ok) {
      return {error: response.status};
    }
 */
    const body = await response.json();

    return body;
  }


  postNewAccoun(userData) {
    return this.postResourse(`${this.API_BASE}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(userData),
    });
  }


  postAuthentication(userData){
    return this.postResourse(`${this.API_BASE}users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(userData),
    });
  }

  postEditProfile(userData, token) {
    return this.postResourse(`${this.API_BASE}user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  postNewArticles(userDataNewArticle, token) {
    return this.postResourse(`${this.API_BASE}articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(userDataNewArticle),
    });
  }

  deleteArticle(token, slug) {
    return this.postResourse(`${this.API_BASE}articles/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Token ${token}`,
      }
    });
  }

  updateArticle(token, userDataNewArticle, slug) {
    return this.postResourse(`${this.API_BASE}articles/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(userDataNewArticle),
    });
  }

}