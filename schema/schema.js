const graphql = require('graphql');
const axios = require('axios').default;

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parentValue, args) {
              const response = await axios.get(`http://localhost:3000/companies/${ parentValue.id }/users`)
                console.log(response.data)
                return response.data
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            async resolve(parentValue, args) {
                const response = await axios.get(`http://localhost:3000/companies/${ parentValue.companyId }`)
                console.log(response.data)
                return response.data
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'rootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLInt } },
            async resolve(parentValue, args) {
                const response = await axios.get(`http://localhost:3000/users/${ args.id }`)
                return response.data
            },
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLInt } },
            async resolve(parentValue, args) {
                const response = await axios.get(`http://localhost:3000/companies/${ args.id }`)
                return response.data
            },
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})