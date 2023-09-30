<script lang="ts">
  export let isOpen = false;
  export let closeModal: any;
  export let treeDefinition: string | undefined;

  function close() {
    closeModal();
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-background" on:click={close}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      <p>This is a modal!</p>
      {#if treeDefinition}
        <pre>{treeDefinition}</pre>
      {/if}
      <button on:click={close}>Close Modal</button>
    </div>
  </div>
{/if}

<style>
  pre {
    color: "black";
  }

  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background: grey;
    padding: 20px;
    border-radius: 8px;
  }
</style>
