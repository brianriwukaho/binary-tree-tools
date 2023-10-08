<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import {
    type PositionedNode,
    type PositionedLink,
    initZoom,
    drawLines,
    drawCircles,
    drawText,
  } from "./lib/d3.helpers";
  import { TreeNode, calculateTraversals, findTreeNode, toD3Node } from "./lib/tree.helpers";

  let treeDefinition: TreeNode | null = new TreeNode("1");
  let valueToAdd: string = "";
  let selectedNode: TreeNode | null = null;
  let childDirection: "left" | "right" | null = null;
  let showAddNodeModal = false;
  let showTraversalsModal = false;
  let showCodeModal = false;

  let { levelOrder, preOrder, inOrder, postOrder } = calculateTraversals(treeDefinition)

  const width = 600;
  const height = 400;
  const dx = width / 2;
  const dy = -200;

  const openCodeModal = () => {
    showCodeModal = true;
  }; 
  
  const closeCodeModal = () => {
    showCodeModal = false;
  };

  const openTraversalsModal = () => {
    let { levelOrder: a, preOrder: b, inOrder: c, postOrder: d }  = calculateTraversals(treeDefinition)

    levelOrder = a
    preOrder = b
    inOrder = c
    postOrder = d

    showTraversalsModal = true;
  };

  const closeTraversalsModal = () => {
    showTraversalsModal = false;
  };

  const openAddNodeModal = (
    positionedNode: PositionedNode,
    direction: "left" | "right"
  ) => {
    selectedNode = findTreeNode(treeDefinition, positionedNode.data.id);
    childDirection = direction;
    showAddNodeModal = true;
  };

  const closeAddNodeModal = () => {
    selectedNode = null;
    showAddNodeModal = false;
  };

  const addNode = () => {
    if (!selectedNode) {
      return;
    }

    if (childDirection !== "left" && childDirection !== "right") {
      return;
    }

    if (childDirection === "left") {
      selectedNode.left = new TreeNode(valueToAdd);
    } else if (childDirection === "right") {
      selectedNode.right = new TreeNode(valueToAdd);
    }
    renderGraph();
    childDirection = null;
    valueToAdd = "";
    showAddNodeModal = false;
  };

  const renderGraph = () => {
    const treeNodeRepresentation = toD3Node(treeDefinition);

    const svg = d3
      .select<SVGSVGElement, unknown>("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black");

    svg.selectAll("g").remove();

    const svgGroup = svg.append("g");

    const rootNode = d3.hierarchy(treeNodeRepresentation) as PositionedNode;
    const treeLayout = d3.tree().size([height, width]).nodeSize([125, 250]);
    const links: PositionedLink[] = treeLayout(rootNode as any).links() as any;

    initZoom(svg, svgGroup, height, width);
    drawLines(svgGroup, links, dx, dy);
    drawCircles(svgGroup, rootNode, dx, dy, openAddNodeModal);
    drawText(svgGroup, rootNode, dx, dy);
  };

  onMount(() => {
    renderGraph();
  });
</script>

<div>
  <button on:click={openCodeModal}>Code</button>
  <button on:click={openTraversalsModal}>Traversals</button>
</div>

{#if showCodeModal  }
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal" on:click={closeCodeModal}>
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      <p>&gt; Array Representation</p>
      <pre></pre>
      <p>&gt; Manual Representation</p>
      <pre></pre>
      <p>&gt; Link to Share</p>
      <pre></pre>
    </div>
  </div>
{/if}


{#if showTraversalsModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal" on:click={closeTraversalsModal}>
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      <h3>Level order</h3>
      <pre>{JSON.stringify(levelOrder)}</pre>
      <h3>Pre order</h3>
      <pre>{JSON.stringify(preOrder)}</pre>
      <h3>In order</h3>
      <pre>{JSON.stringify(inOrder)}</pre>
      <h3>Post order</h3>
      <pre>{JSON.stringify(postOrder)}</pre>
    </div>
  </div>
{/if}

{#if showAddNodeModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal" on:click={closeAddNodeModal}>
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      <input bind:value={valueToAdd} />
      <button on:click={addNode}>Add node</button>
    </div>
  </div>
{/if}

<svg width="600" height="400" />

<style>
  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    
  }

  pre {
    background-color: black;
  }

  .modal-content {
    background-color: darkslategray;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border: 1px solid #888;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
