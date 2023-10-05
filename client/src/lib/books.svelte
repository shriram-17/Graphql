<script>
  import { onMount } from "svelte";
  import {queryStore, setContextClient } from "@urql/svelte";
  import { Client, cacheExchange, fetchExchange, getContextClient, gql } from "@urql/svelte";
  import Navbar from "./navbar.svelte";

  const client = new Client({
    url: "http://localhost:8000/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });
  
  setContextClient(client);

  const booksQuery = queryStore({
    client: getContextClient(),
    query: gql`
      query MyQuery {
        getBooks {
          Author {
            name
          }
          bid
          title
        }
      }
    `,
  });
</script>

<style>
  /* Add your CSS styles here */
  main {
    text-align: center;
  }

  p {
    margin: 0;
    padding: 8px;
  }

  .loading {
    font-weight: bold;
    color: #007bff;
  }

  .error {
    font-weight: bold;
    color: #ff0000;
  }

  .books {
    margin-top: 20px;
    border-collapse: collapse;
    width: 100%;
  }

  .books th,
  .books td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .books th {
    background-color: #f2f2f2;
  }
</style>

<main>
  <Navbar/>
  {#if $booksQuery.fetching}
    <p class="loading">Loading...</p>
  {:else if $booksQuery.error}
    <p class="error">{$booksQuery.error.message}</p>
  {:else}
    <table class="books">
      <thead>
        <tr>
          <th>Author</th>
          <th>Book</th>
        </tr>
      </thead>
      <tbody>
        {#each $booksQuery.data.getBooks as book (book.bid)}
          <tr>
            <td>{book.Author.name}</td>
            <td>{book.title}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>
