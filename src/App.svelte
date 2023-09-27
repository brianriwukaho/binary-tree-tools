<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { data } from "./stub";
  import {
    type PositionedNode,
    type PositionedLink,
    initZoom,
    drawLines,
    drawCircles,
    drawText,
  } from "./lib/d3.helpers";

  let treeDefinition: string | undefined;

  const width = 600;
  const height = 400;
  const dx = width / 2;
  const dy = -200;

  const renderGraph = () => {
    console.log(treeDefinition);

    const svg = d3
      .select<SVGSVGElement, unknown>("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black");

    const svgGroup = svg.append("g");
    const rootNode = d3.hierarchy(data) as PositionedNode;
    const treeLayout = d3.tree().size([height, width]).nodeSize([125, 250]);
    const links: PositionedLink[] = treeLayout(rootNode as any).links() as any;

    initZoom(svg, svgGroup, height, width);
    drawLines(svgGroup, links, dx, dy);
    drawCircles(svgGroup, rootNode, dx, dy);
    drawText(svgGroup, rootNode, dx, dy);
  };

  onMount(() => {
    renderGraph();
    console.log(treeDefinition);
  });
</script>

<div>
  <input bind:value={treeDefinition} type="text" placeholder="Enter new tree" />
  <button on:click={renderGraph}>Render</button>
</div>

<svg width="600" height="400" />

<style>
</style>
