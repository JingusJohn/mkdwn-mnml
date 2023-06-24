
<script lang="ts">
  import { onMount } from 'svelte';
  import { liveQuery } from "dexie";
  import { db } from "$lib/db";

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

<!-- Open the modal using ID.showModal() method -->
<button class="btn" on:click={showCreationModal}>open modal</button>
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

<div class="w-full flex flex-col items-center">
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

    {#each $subjects.filter(s => s.title.includes(subjectSearchString)) as s}
      <h1 class="text-2xl">{s.title}</h1>
    {/each}
  {/if}
</div>

