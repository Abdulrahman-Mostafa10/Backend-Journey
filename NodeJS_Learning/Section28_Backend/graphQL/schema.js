const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type User{
        _id: ID!
        email: String!
        name: String!
        password: String!
        status: String!
        posts: [Post!]!
    }
    
    type Post{
        _id: ID!
        title: String!
        imageUrl: String!
        content: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    input userDataInput{
        email: String!
        name: String!
        password: String!
    }

    input postInputData{
        title: String!
        imageUrl: String!
        content: String!
    }
    
    type AuthData{
        token:String!
        userId: String!
        email: String!
    }

    type PostsData{
        posts: [Post!]!
        totalPosts: Int!
}

    type RootQuery{
        login(email: String!, password: String!): AuthData!
        getPosts(currentPage: Int!): PostsData!
        post(id: ID!): Post!
        user: User!
    }

    type RootMutation{
        createUser(userData: userDataInput!): User!
        updateStatus(status: String!): User!
        createPost(postData: postInputData!): Post!
        updatePost(id: ID!, postData: postInputData!): Post!
        deletePost(id: ID!): Boolean
    }

    schema{
        query:      RootQuery
        mutation:   RootMutation
    }
    `);
