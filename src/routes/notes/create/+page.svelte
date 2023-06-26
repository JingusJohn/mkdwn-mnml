<script lang="ts">
	import { page } from "$app/stores";
	import { marked } from "marked";
  import { highlight, getLanguage } from 'highlightjs';

  export let data;

  let { redirectTo } = data;

  let newNoteTitle: string = "";
  let newNoteContent: string = "";

  let contentMode: "edit" | "preview" = "edit"
  $: rows = newNoteContent.split('\n').length;

  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
      const language = getLanguage(lang) ? lang : 'plaintext';
      console.log(language);
      console.log(code);
      return highlight(language, code).value
    },
    langPrefix: 'hljs language-'
  });

</script>


<div class="flex flex-col min-h-screen xl:px-24 md:px-8 px-4">
  <h1 class="text-3xl text-center">Create New Note</h1>
  <label for="note-title">Title</label>
  <div class="join">
    <input name="note-title" bind:value={newNoteTitle} type="text" placeholder="Astronomy lecture #1 (the sun)" class="w-full join-item input input-bordered input-primary" />
    <button class="join-item btn btn-primary">Create</button>
    <a href={redirectTo ? redirectTo : "/"} class="join-item btn hover:btn-warning">Cancel</a>
  </div>

  <!-- content -->
  <div class="tabs pt-2">
    <button on:click={() => contentMode = "edit"} class={`tab tab-lifted ${contentMode === "edit" ? "tab-active" : ""}`}>Edit</button> 
    <button on:click={() => contentMode = "preview"} class={`tab tab-lifted ${contentMode === "preview" ? "tab-active" : ""}`}>Preview</button> 
  </div>

  {#if contentMode === "edit"}
    <textarea placeholder="The Sun holds the solar system together, keeping everything – from the biggest planets to the smallest debris – in its orbit. ~ Nasa" {rows} class="textarea resize-none textarea-secondary w-full" name="note-content" bind:value={newNoteContent} />
  {:else if contentMode === "preview"}
    {#if newNoteContent === ""}
      <p>No note content!</p>
    {:else}
      <article class="prose dark:prose-invert font-sans text-white max-w-none pt-2 sm:px-8">
        {@html marked.parse(newNoteContent)}
      </article>
    {/if}
  {/if}

</div>
