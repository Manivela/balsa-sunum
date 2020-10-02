import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client";
import { USERS_QUERY } from "./query";
import { CREATE_USER_MUTATION } from "./mutation";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

function ExchangeRates() {
  const { loading, error, data } = useQuery(USERS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.users.map((user) => (
    <div key={user.firstName}>
      <p>
        {user.id}
        {user.firstName}
      </p>
    </div>
  ));
}

function CreateUser() {
  const [firstName, setFirstName] = useState("");
  const [createUser, { data }] = useMutation(CREATE_USER_MUTATION, {
    refetchQueries: [{ query: USERS_QUERY }],
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUser({ variables: { firstName: firstName } });
          setFirstName("");
        }}
      >
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save selam
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <CreateUser />
          <ExchangeRates />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
