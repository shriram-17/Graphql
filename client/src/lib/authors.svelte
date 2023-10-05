<script lang="ts">
  import {
    Client,
    cacheExchange,
    fetchExchange,
    getContextClient,
    gql,
    queryStore,
    setContextClient, 
  } from "@urql/svelte";

  import { writable } from "svelte/store";
  import Navbar from "./navbar.svelte";

  const client = new Client({
    url: "http://localhost:8000/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });

  setContextClient(client);

  let authors = writable([]);
  let isLoading = writable<boolean>(false);

  const authorsQuery = queryStore({
    client: getContextClient(),
    query: gql`
      query MyQuery {
        getAuthors {
          id
          name
        }
      }
    `,
  });

  let fetchAuthors = () => {
    isLoading.set(true);
    authors.set($authorsQuery.data.getAuthors);
  }

  let clearData = () => {
    authors.set([]);
    isLoading.set(false);
  }
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    font-size: 18px;
    margin: 5px 0;
    color: black;
    border: 1px solid #ccc;
    padding: 10px;
    background-color: #f5f5f5;
  }

  button {
    margin-top: 20px;
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    margin-right: 10px;
  }

  button[disabled] {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>

<main>
  <Navbar/>
  {#if $isLoading}
    <h1>Authors</h1>
    {#each $authorsQuery.data.getAuthors as author(author.id)}
      <ul>
        <li>{author.name}</li>
      </ul>
    {/each}
  {/if}
  <button on:click={fetchAuthors} disabled={$isLoading}>Fetch the authors</button>
  <button on:click={clearData} disabled={!$isLoading}>Clear the data</button>
</main>
