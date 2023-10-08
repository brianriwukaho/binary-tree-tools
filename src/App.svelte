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
  import { TreeNode, findTreeNode, toD3Node } from "./lib/tree.helpers";

  let treeDefinition: TreeNode | null = new TreeNode("1");
  let valueToAdd: string = "";
  let selectedNode: TreeNode | null = null;
  let childDirection: "left" | "right";
  let showModal = false;

  const width = 600;
  const height = 400;
  const dx = width / 2;
  const dy = -200;

  const openAddNodeModal = (
    positionedNode: PositionedNode,
    direction: "left" | "right"
  ) => {
    selectedNode = findTreeNode(treeDefinition, positionedNode.data.id);
    childDirection = direction;
    showModal = true;
  };

  const closeAddNodeModal = () => {
    selectedNode = null;
    showModal = false;
  };

  const addNode = () => {
    if (childDirection === "left") {
      selectedNode.left = new TreeNode(valueToAdd);
    } else if (childDirection === "right") {
      selectedNode.right = new TreeNode(valueToAdd);
    }
    renderGraph();
    childDirection = null;
    valueToAdd = "";
    showModal = false;
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

{#if showModal}
  <div class="modal" on:click={closeAddNodeModal}>
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      <span on:click={closeAddNodeModal}>Close</span>
      <input bind:value={valueToAdd} />
      <button on:click={addNode}>Add node</button>
    </div>
  </div>
{/if}

<svg width="600" height="400" />

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    padding: 20px;
    border-radius: 4px;
  }
</style>
