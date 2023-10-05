<script lang="ts">
  import { Client, cacheExchange, fetchExchange, getContextClient, gql, queryStore, setContextClient } from "@urql/svelte";
  import Navbar from "./navbar.svelte";

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

<main>
    <Navbar/>
    <select name="" id="">
      <option value="">Select an Author</option>
      {#each $authorsQuery.data.getAuthors as author (author.id)}
          <option value={author.id}>{author.name}</option>
      {/each}
    </select>
</main>