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
  import Navbar from "./navbar.svelte";
  import { writable } from "svelte/store";

  let selectedAuthorId = "";
  let isTrue = writable<boolean>(false);
  let result: any;
  const client = new Client({
    url: "http://localhost:8000/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });

  setContextClient(client);

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

  const findBooksQuery = gql`
    query MyQuery($authorId: Int!) {
      getAuthorWithBooks(authorId: $authorId) {
        author {
          name
        }
        books {
          title
          bid
        }
      }
    }
  `;

  const handleSubmit = async () => {
    try {
      result = await client
        .query(findBooksQuery, {
          authorId: selectedAuthorId,
        })
        .toPromise();
      if (!result.error) {
        isTrue.set(true);
        selectedAuthorId = "";
        console.log(
          "Got the Books Successfully",
          result.data.getAuthorWithBooks
        );
      } else {
        console.error("Failed to get book:", result.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
</script>

<main>
  <Navbar />
  <select name="" id="author-select" bind:value={selectedAuthorId}>
    {#if $authorsQuery.data && $authorsQuery.data.getAuthors}
      <option value="">Select an author</option>
      {#each $authorsQuery.data.getAuthors as author (author.id)}
        <option value={author.id}>{author.name}</option>
      {/each}
    {:else}
      <option disabled>Loading authors...</option>
    {/if}
  </select>
  <button id="search-button" on:click={handleSubmit}>Search the Author</button>
  {#if $isTrue}
    <h2>Books:</h2>
    <table>
      <thead>
        <tr>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>
        {#each result.data.getAuthorWithBooks.books as book (book.bid)}
          <tr>
            <td>{book.title}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>

<style>
  #author-select {
    width: 20%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 20px;
  }

  #search-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
  }

  table {
    width: 25%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    padding: 8px 12px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }


</style>
