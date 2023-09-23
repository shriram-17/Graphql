<script lang="ts">
  import { onMount } from "svelte";
  import { derived, writable } from 'svelte/store';
  import axios from "axios";
  import type { Author,Sample } from "./types";

  const messageStore = writable<Sample>({ Message: "" });
  const authorsStore = writable<Author[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000");
      console.log(response.data);
      messageStore.set(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get<Author[]>("http://localhost:8000/author/all"); // Specify the response type as Author[]
      authorsStore.set(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const clearData = () => {
    authorsStore.set([]);
  };

  const hasAuthors = derived(authorsStore, ($authors) => $authors.length > 0);

  onMount(() => {
    fetchData();
    console.log($messageStore);
  });

</script>

<style>

  div {
    text-align: center;
    margin: 20px;
  }


  h1 {
    font-size: 24px;
    color: blue;
  }


  div.authors {
    text-align: center;
    margin: 20px;
  }

  
  ul {
    list-style-type: none;
    padding: 0;
  }


  li {
    font-size: 18px;
    margin: 5px 0;
    color: green;
  }

  
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 10px;
    cursor: pointer;
  }
</style>

<main>
  <div>
    <h1>{$messageStore.Message}</h1>
  </div>
  {#if $hasAuthors}
    <div>
      <h1>Authors</h1>
      <ul>
        {#each $authorsStore as author (author.author_id)}
          <li>{author.name}</li>
        {/each}
      </ul>
    </div>
    <button on:click={clearData}>Clear the data</button>
  {:else}
    <div>
      <p>No Authors Available</p>
    </div>
    <button on:click={fetchAuthors}>Click here to fetch authors</button>
  {/if}
</main>
