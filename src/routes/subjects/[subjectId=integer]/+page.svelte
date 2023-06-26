<script lang="ts">
	import { db } from '$lib/db.js';
	import { liveQuery } from 'dexie';

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
  <div class="w-full px-2">
    <h1 class="text-center text-2xl">NOTES</h1>
    {#if $notes}
      {#each $notes as note}
        <div>
          <h2>{note.title}</h2>
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

