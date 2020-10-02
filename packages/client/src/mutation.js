import { gql } from "@apollo/client";

export const CREATE_USER_MUTATION = gql`
  mutation createUser($firstName: String!) {
    createUser(firstName: $firstName) {
      id
      firstName
      lastName
      age
    }
  }
`;
