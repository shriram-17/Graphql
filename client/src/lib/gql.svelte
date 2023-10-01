<script lang="ts">
  
  import { writable } from "svelte/store";
  import {
    Client,
    cacheExchange,
    createRequest,
    fetchExchange,
    gql,
  } from "@urql/svelte";

  import type { Author } from "../types";
  import { onMount } from "svelte";

  const authorsStore = writable<Author[]>([]);

  const client = new Client({
    url: "http://localhost:8000/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });

  const query = gql`
  query MyQuery {
    getAuthors {
      id
      name
    }
  }`;
    

</script>
