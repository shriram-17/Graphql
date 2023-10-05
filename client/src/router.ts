import Authors from "./lib/authors.svelte";
import Books from "./lib/books.svelte";
import Search from "./lib/search.svelte";
import Insert from "./lib/insert.svelte";

export const routes = {
  "/": Authors,
  "/search": Search,
  "/book": Books,
  "/insert":Insert
};