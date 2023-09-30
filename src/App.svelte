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
  import { arrayToBinaryTree, convertToD3Node } from "./lib/tree.helpers";
  import Modal from "./Modal.svelte";
  import AddNodeModal from "./AddNodeModal.svelte";
  import { treeDefinitionStore } from "./store";

  let nodeToAdd: PositionedNode | undefined;
  let isAddNodeModalOpen = false;
  let isModalOpen = false;

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

  function openAddNodeModal(positionedNode: PositionedNode): void {
    nodeToAdd = positionedNode;
    isAddNodeModalOpen = true;
  }

  function closeAddNodeModal() {
    isAddNodeModalOpen = false;
  }

  let treeDefinition: string;

  const width = 600;
  const height = 400;
  const dx = width / 2;
  const dy = -200;

  const renderGraph = () => {
    console.log("RENDERING");
    console.log({ treeDefinition });
    const arr = JSON.parse(treeDefinition);
    console.log({ arr });
    const tree = arrayToBinaryTree(arr);
    const treeNodeRepresentation = convertToD3Node(tree);

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

  treeDefinitionStore.subscribe((value: any) => {
    treeDefinition = value;
    renderGraph();
  });

  onMount(() => {
    renderGraph();
  });
</script>

<div>
  <input bind:value={treeDefinition} type="text" placeholder="Enter new tree" />
  <button on:click={renderGraph}>Render</button>
  <button on:click={openModal}>Export</button>
  <Modal isOpen={isModalOpen} {closeModal} {treeDefinition} />
  <AddNodeModal
    isOpen={isAddNodeModalOpen}
    closeModal={closeAddNodeModal}
    {nodeToAdd}
    {treeDefinition}
    {renderGraph}
  />
</div>

<svg width="600" height="400" />

<style>
</style>
