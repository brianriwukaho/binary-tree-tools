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
  import { TreeNode, toD3Node } from "./lib/tree.helpers";
  import { treeDefinitionStore } from "./store";

  let treeDefinition: TreeNode | null = null;

  const width = 600;
  const height = 400;
  const dx = width / 2;
  const dy = -200;

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
    drawCircles(svgGroup, rootNode, dx, dy, () => console.log("clicked"));
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

<svg width="600" height="400" />
