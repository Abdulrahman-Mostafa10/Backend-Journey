import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    const graphqlQuery = {
      query: `
      query updateSinglePost($id: ID!){
        post(id: $id){
          title
          content
          imageUrl
          creator {
            name
          }
          createdAt
        }
      }`,
      variables: {
        id: postId
      }
    };

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          console.log(resData.errors);
          throw new Error('Post fetching failed!');
        }

        this.setState({
          title: resData.data.post.title,
          author: resData.data.post.creator.name,
          image: 'http://localhost:8080/' + resData.data.post.imageUrl,
          date: new Date(resData.data.post.createdAt).toLocaleDateString('en-US'),
          content: resData.data.post.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
