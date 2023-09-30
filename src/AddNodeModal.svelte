<script lang="ts">
  import { tree } from "d3";
  import type { PositionedNode } from "./lib/d3.helpers";
  import { d3NodeToArray } from "./lib/tree.helpers";

  export let isOpen = false;
  export let closeModal: any;
  export let nodeToAdd: PositionedNode | undefined;
  export let treeDefinition: string | undefined;
  export let renderGraph: () => void;
  import { treeDefinitionStore } from "./store";

  let valueAdd = "";

  function appendNode() {
    if (nodeToAdd === undefined) {
      return;
    }

    console.log({ nodeToAdd });

    const traverseToRoot = (node: PositionedNode): PositionedNode => {
      if (node.parent === null) {
        return node;
      }

      return traverseToRoot(node.parent);
    };

    nodeToAdd.children
      ? //@ts-ignore
        nodeToAdd.children.push({
          data: {
            name: valueAdd,
          },
          children: [],
        })
      : (nodeToAdd.children = [
          //@ts-ignore
          {
            data: {
              name: valueAdd,
            },
            children: [],
          },
        ]);

    const root = traverseToRoot(nodeToAdd);

    treeDefinitionStore.set(JSON.stringify(d3NodeToArray(root)));
    closeModal();
  }

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
      <p>Add node!</p>
      <input type="text" bind:value={valueAdd} />
      <button on:click={appendNode}>Append node</button>
      <p>{JSON.stringify(nodeToAdd?.data)}</p>
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
