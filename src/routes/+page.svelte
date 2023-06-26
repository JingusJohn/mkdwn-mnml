
<script lang="ts">
  import { onMount } from 'svelte';
  import { liveQuery } from "dexie";
  import { db, type Subject } from "$lib/db";

  let subjectSearchString: string = "";
  let newSubjectName: string = "";
  let placeholderIndex = -1;
  const placeholderOptions = ["work stuff", "school stuff", "house stuff"];

  let invalidSubjectName: boolean = true;

  $: if (newSubjectName !== "") {
    // validate that the name is not in use already
    let tempInvalid = false;
    if ($subjects) {
      for (let s of $subjects) {
        if (s.title === newSubjectName) {
          invalidSubjectName = true;
          tempInvalid = true;
          break;
        }
      }
    } else {
      tempInvalid = true;
      invalidSubjectName = true;
    }

    if (!tempInvalid) {
      invalidSubjectName = false;
    }
  } else {
    invalidSubjectName = true;
  }

  let subjects = liveQuery(
    () => db.subjects.toArray()
  );

  async function createSubject() {
    try {
      // add the new subject
      const id = await db.subjects.add({
        title: newSubjectName,
        dateCreated: new Date(Date.now())
      });
    } catch (error) {

    }
  }

  async function deleteSubject(s: Subject) {
    try {
      // validate that subject has id (it always should)
      if (s.id) {
        await db.notes.where('subjectId').equals(s.id).delete();
        await db.tasks.where('subjectId').equals(s.id).delete();
        await db.subjects.where('id').equals(s.id).delete();
      }
    } catch (error) {
      console.log(error);
    }
  }

  let dialog: HTMLDialogElement; // Reference to the dialog tag
	onMount(() => {
		dialog = document.getElementById('creation-modal') as HTMLDialogElement;
	});

  function showCreationModal() {
    // reset input values
    newSubjectName = "";
    invalidSubjectName = true;
    placeholderIndex = (placeholderIndex + 1) % placeholderOptions.length;
  try {
			dialog['showModal']();
		} catch(e) {
		}  
  }

</script>

<dialog id="creation-modal" class="modal">
  <form method="dialog" class="modal-box flex flex-col space-y-4">
    <h3 class="font-bold text-lg">New Subject</h3>
    <input bind:value={newSubjectName} type="text" placeholder={placeholderOptions[placeholderIndex]} class="input input-bordered input-primary min-w-full max-w-xs" />
    {#if $subjects}
      <button on:click={createSubject} disabled={invalidSubjectName} class="btn btn-secondary w-full">Confirm</button>
    {/if}
  </form>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<div class="w-full flex flex-col items-center min-h-screen">
  <!-- If a user has no subjects, prompt them to create one -->

  <div class="flex flex-row items-center space-x-4">
    <!-- Search Bar -->
    <div class="join">
      <div>
        <div>
          <input bind:value={subjectSearchString} class="input input-bordered join-item" placeholder="Search Subjects" />
        </div>
      </div>
      <div>
        <button class="btn join-item">Search</button>
      </div>
    </div>

    <button on:click={showCreationModal} class="btn btn-secondary">Create</button>
  </div>


  {#if $subjects}

    <p>{$subjects.filter(s => s.title.includes(subjectSearchString)).length} results</p>
    <div class="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-2 xl:grid-cols-3 py-4">
      {#each $subjects.filter(s => s.title.includes(subjectSearchString)) as s}
        <div class="card w-96 bg-secondary hover:bg-primary transition-colors duration-300 text-secondary-content hover:text-primary-content">
          <div class="card-body">
            <h2 class="card-title">{s.title}</h2>
            <p>{s.dateCreated.toDateString()}</p>
            <div class="card-actions justify-end">
              <a href="/subjects/{s.id}" class="btn hover:btn-primary transition-colors duration-300">View</a>
              <button on:click={() => deleteSubject(s)} class="btn hover:btn-warning">Remove</button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <span class="loading loading-ring loading-lg py-16"></span>
  {/if}
</div>

