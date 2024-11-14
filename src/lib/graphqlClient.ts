import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("http://localhost:8081/query");

export const setAuthToken = (token: string) => {
    client.setHeader('authorization', `Bearer ${token}`);
};
