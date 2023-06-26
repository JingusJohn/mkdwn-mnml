<script lang="ts">
  import "../app.css";
  import { liveQuery } from "dexie";
  import { db, type Reminder } from "$lib/db";

  let newReminderTitle: string = "";
  let newReminderDescription: string = "";
  let newReminderStatus: {success: boolean, message: string} | null;
  let reminderDeletionErrorMap = new Map<number, string>();

  let reminders = liveQuery(
    () => db.reminders.toArray()
  );

  function handleNewReminder() {
    // validate that the inputs are good
    addReminder();
  }

  async function addReminder() {
    try {
      // Add the new reminder
      const id = await db.reminders.add({
        title: newReminderTitle,
        description: newReminderDescription,
        dateCreated: new Date(Date.now()),
        dateUpdated: new Date(Date.now())
      });

      newReminderStatus = {
        success: true,
        message: `Reminder ${newReminderTitle} successfully added. Got id ${id}`
      };
      
      // Reset form:
      newReminderTitle = "";
      newReminderDescription = "";
    } catch (error) {
      newReminderStatus = {
        success: false,
        message: `Failed to add ${newReminderTitle}: ${error}`
      };
    }
  };

  async function deleteReminder(r: Reminder) {
    console.log(r);
    try {
      // delete reminder from the database
      await db.reminders.delete(r.id);
    } catch (error) {
      console.log(error)
    }
  }


</script>

<svelte:head>
  <title>MKDWN MNML</title>
  <meta name="description" content="Minimal, local, markdown-based note-taking application and organization tool." />
</svelte:head>

<div class="flex flex-row justify-between px-8 py-2 items-center">
  <div class="flex flex-row">
    <a href="/" class="text-4xl font-bold">MKDWN MNML</a>
    <p>v 1.0.0</p>
  </div>
  <div class="indicator">
    {#if $reminders && $reminders.length > 0}
      <span class="indicator-item badge badge-secondary">{$reminders.length}</span> 
    {/if}
    <label for="reminder-drawer" class="btn btn-sm btn-primary drawer-button">Reminders</label>
  </div>
</div>
  <!-- DRAWER -->
<div class="drawer">
  <input id="reminder-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content here -->
    <slot />
  </div> 
  <div class="drawer-side">
    <label for="reminder-drawer" class="drawer-overlay"></label>
    <ul class="menu p-4 min-w-80 min-h-full bg-base-200 text-base-content">
      <!-- Sidebar content here -->
      <h1 class="text-3xl">Reminders</h1>
      {#if $reminders}
        <div class="flex flex-col space-y-2">
          {#each $reminders as r}
            <div class="card w-96 bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title">{r.title}</h2>
                <p>{r.description}</p>
                <p>{r.dateCreated.toDateString()}</p>
                {#if r.id && reminderDeletionErrorMap.get(r.id)}
                  <p class="text-error">{reminderDeletionErrorMap.get(r.id)}</p>
                {/if}
                <div class="card-actions justify-end">
                  <div class="tooltip tooltip-bottom" data-tip="Removal is permanent!">
                    <button on:click={() => deleteReminder(r)} class="btn hover:btn-warning">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <div class="divider">NEW</div>
      <div class="flex flex-col space-y-2">
        <label>Name</label>
        <input bind:value={newReminderTitle} type="text" placeholder="take out the trash" class="input input-bordered input-primary w-full" />
        <label>More Info</label>
        <textarea bind:value={newReminderDescription} class="textarea textarea-secondary w-full" placeholder="The trash... it needs to be taken out. It stinks. It needs to go."></textarea>
        <button disabled={newReminderTitle == ""} on:click={handleNewReminder} class="btn btn-accent w-full">Remind Me!</button>
        {#if newReminderStatus}
          {#if newReminderStatus.success}
            <p class="text-success">{newReminderStatus.message}</p>
          {:else}
            <p class="text-error">{newReminderStatus.message}</p>
          {/if}
        {/if}
      </div>
      <!-- show the user their reminders -->
    </ul>
  </div>
</div>
<!-- <slot /> -->

<footer class="footer p-10 bg-base-200 text-base-content">
  <div>
    <p class="text-2xl">Jack Branch</p>
    <p>Software developer. This was just a quick project to learn about the native IndexedDB API in JavaScript.</p>
    <p>Like the project? Let me know by giving it a star on GitHub!</p>
    <p>Any issues? Report them on GitHub as well!</p>
    <p>Made with love using SvelteKit, Dexie, and TailwindCSS + DaisyUI.</p>
  </div>
  <div>
    <span class="footer-title">Other Projects</span> 
    <a target="_blank" href="https://github.com/JingusJohn/Community-BOSS-API" class="link link-hover">BOSS API</a> 
    <a target="_blank" href="https://github.com/CamJak/Boss-Integrated-Scheduler/tree/dev" class="link link-hover">BOSS Scheduling Tool</a> 
    <a target="_blank" href="https://github.com/JingusJohn/craft-gpt-v2" class="link link-hover">CraftGPT v2</a>
    <a class="link link-hover">Advertisement</a>
  </div>
  <div>
    <span class="footer-title">Me</span> 
    <a target="_blank" href="https://jackbranch.dev" class="link link-hover">Personal Site</a> 
    <a target="_blank" href="https://github.com/JingusJohn" class="link link-hover">GitHub</a> 
    <a target="_blank" href="https://www.linkedin.com/in/jack-branch-a412b6246?original_referer=https%3A%2F%2Fwww.jackbranch.dev%2F" class="link link-hover">LinkedIn</a> 
  </div> 
</footer>
