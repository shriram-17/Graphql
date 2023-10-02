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

</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    font-size: 18px;
    margin: 5px 0;
    color: black ;
  }
</style>

<main>
  {#if $authorsQuery.fetching}
    <p>Loading...</p>
  {:else if $authorsQuery.error}
    <p>Error: {$authorsQuery.error.message}</p>
  {:else if $authorsQuery.data && $authorsQuery.data.getAuthors}
    <ul>
      {#each $authorsQuery.data.getAuthors as author (author.id)}
        <li>{author.name}</li>
      {/each}
    </ul>
  {/if}
</main>
