<script lang="ts">
    import {
      Client,
      cacheExchange,
      fetchExchange,
      getContextClient,
      gql,
      mutationStore,
      queryStore,
      setContextClient,
    } from "@urql/svelte";
    import Navbar from "./navbar.svelte";
  
    let newBookTitle = "";
    let selectedAuthorName = "";
    let newAuthorName ="";

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
  
    const addBookMutation = gql`
      mutation CreateBook($title: String!, $author_id: Int!) {
        createBook(title: $title, authorId: $author_id) {
          bid
          title
          Author {
            id
            name
          }
        }
      }
    `;
      const addAuthorMutation = gql`
      mutation CreateAuthorName($author_name: String!,$book_name: String!) {
        createAuthorName(authorName: $author_name, bookName: $book_name) {
          bid
          title
          Author {
            id
            name
          }
        }
      }
    `;
     
    let isInputDisabled = false;
  
    const handleSubmit = async () => {
    if(selectedAuthorName!=="")
    {
        try {
        const result = await client.mutation(addBookMutation, {
          title: newBookTitle,
          author_id: selectedAuthorName,
        }).toPromise();
  
        if (!result.error) {
          newBookTitle = "";
          selectedAuthorName = "";
          console.log("Book created successfully:", result.data.createBook);
        } else {
          console.error("Failed to create book:", result.error);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
     else
     {
        try {
        const result = await client.mutation(addAuthorMutation, {
          author_name:newAuthorName,
          book_name:newBookTitle
        }).toPromise();
  
        if (!result.error) {
          newBookTitle = "";
          newAuthorName = "";
          console.log("Book created successfully:", result.data. createAuthorName);
        } else {
          console.error("Failed to create book:", result.error);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
     }
    };
  
    $: {
      isInputDisabled = !!selectedAuthorName;
    }

  </script>
  
  <style>
    button {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
      margin-left: 20px;
    }
  
    button:hover {
      background-color: #0056b3;
    }
  
    select {
      padding: 8px; 
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 20%;
      margin-top: 5px; 
    }
  
    input[type="text"] {
      padding: 8px; 
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 20%;
      margin-top: 5px; 
    }
  
    label {
      display: block;
      font-weight: bold;
      margin-top: 10px; 
    }
  </style>
  
  <main>
    <Navbar />
    <label for="">Enter the BookName</label>
    <input type="text" bind:value={newBookTitle} />
    <label for="">Choose the Author Name</label>
    <select name="" id="" bind:value={selectedAuthorName}>
      {#if $authorsQuery.data && $authorsQuery.data.getAuthors}
        <option value="">Select an author</option>
        {#each $authorsQuery.data.getAuthors as author (author.id)}
          <option value={author.id}>{author.name}</option>
        {/each}
      {:else}
        <option disabled>Loading authors...</option>
      {/if}
    </select>
    <label for="">Enter the Author Name</label>
    <input type="text" bind:value={newAuthorName} disabled={isInputDisabled} />
    <button on:click={handleSubmit}   >Insert the Book</button>
  </main>