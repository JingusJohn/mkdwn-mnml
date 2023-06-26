<script lang="ts">
  import { marked } from 'marked';
	import { db } from '$lib/db.js';
	import { liveQuery } from 'dexie';
	import { page } from '$app/stores';

  export let data;
  
  const { subjectId } = data;

  // create liveQueries for notes and tasks
  let notes = liveQuery(
    () => db.notes
      .where('subjectId')
      .equals(subjectId)
      .toArray()
  );
  let tasks = liveQuery(
    () => db.tasks
      .where('subjectId')
      .equals(subjectId)
      .toArray()
  );
</script>

<div class="flex flex-row w-full min-h-screen justify-between py-4">

  <!-- NOTES -->
  <div class="w-full px-2 flex flex-col items-center">
    <h1 class="text-center text-2xl">NOTES</h1>
    <a href={"/notes/create" + ($page ? `?redirectTo=${$page.url}` : "")} class="btn btn-accent w-full">NEW</a>
    {#if $notes}
      {#each $notes as note}
        <div>
          <div class="flex flex-row justify-between">
            <h2>{note.title}</h2>
            <p>updated: {note.dateUpdated.toDateString()}</p>
            <article>{@html marked.parse(note.content)}</article>
          </div>
          <div class="divider"></div> 
        </div>
      {/each}
    {:else}
      <div class="flex flex-col items-center">
        <span class="center loading loading-ring loading-lg py-16"></span>
      </div>
    {/if}
  </div>

  <div class="divider lg:divider-horizontal"></div>

  <!-- TASKS -->
  <div class="w-full px-2">
    <h1 class="text-center text-2xl">TASKS</h1>
    {#if $tasks}
      {#each $tasks as task}
        <div>
          <h2>{task.title}</h2>
        </div>
      {/each}
    {:else}
      <div class="flex flex-col items-center">
        <span class="center loading loading-ring loading-lg py-16"></span>
      </div>
    {/if}
  </div>

</div>

