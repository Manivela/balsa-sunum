import { gql } from "@apollo/client";

export const USERS_QUERY = gql`
  query getuser {
    users {
      id
      firstName
      lastName
      age
    }
  }
`;
