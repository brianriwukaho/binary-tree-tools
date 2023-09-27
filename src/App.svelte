<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { data } from "./stub";

  interface NodeData {
    name: string;
    children?: NodeData[];
  }

  type PositionedNode = d3.HierarchyNode<NodeData> & {
    x: number;
    y: number;
  };

  interface PositionedLink extends d3.HierarchyLink<NodeData> {
    source: PositionedNode;
    target: PositionedNode;
  }

  const width = 600;
  const height = 400;
  const dx = width / 2;
  const dy = -200;

  function initZoom(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    svgGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  ) {
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => {
        svgGroup.attr("transform", event.transform.toString());
      });

    // @ts-ignore
    svg.call(zoom);

    const initialScale = 0.2;
    const initialX = (width * (1 - initialScale)) / 2;
    const initialY = (height * (1 - initialScale)) / 2;

    svg.call(
      // @ts-ignore
      zoom.transform,
      d3.zoomIdentity.translate(initialX, initialY).scale(initialScale)
    );
  }

  function drawLines(
    svgGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    links: PositionedLink[]
  ) {
    svgGroup
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x + dx)
      .attr("y1", (d) => d.source.y + dy)
      .attr("x2", (d) => d.target.x + dx)
      .attr("y2", (d) => d.target.y + dy)
      .attr("stroke", "black")
      .attr("stroke-width", 1.5);
  }

  function drawCircles(
    svgGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    rootNode: PositionedNode
  ) {
    svgGroup
      .selectAll("circle")
      .data(rootNode.descendants())
      .enter()
      .append("circle")
      .attr("cx", (d: PositionedNode) => d.x + dx)
      .attr("cy", (d: PositionedNode) => d.y + dy)
      .attr("r", 40)
      .style("fill", "#eee")
      .style("stroke", "black")
      .style("stroke-width", "1.5")
      .on("click", (event, d) => console.log("click", d));
  }

  function drawText(
    svgGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    rootNode: PositionedNode
  ) {
    svgGroup
      .selectAll("text")
      .data(rootNode.descendants())
      .enter()
      .append("text")
      .attr("x", (d: PositionedNode) => d.x + dx)
      .attr("y", (d: PositionedNode) => d.y + dy)
      .attr("dy", "0.32em")
      .attr("text-anchor", "middle")
      .attr("font-size", "3.25em")
      .text((d) => d.data.name);
  }

  onMount(() => {
    const svg = d3
      .select<SVGSVGElement, unknown>("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black");

    const svgGroup = svg.append("g");
    const rootNode = d3.hierarchy(data) as PositionedNode;
    const treeLayout = d3.tree().size([height, width]).nodeSize([125, 250]);
    const links: PositionedLink[] = treeLayout(rootNode as any).links() as any;

    initZoom(svg, svgGroup);
    drawLines(svgGroup, links);
    drawCircles(svgGroup, rootNode);
    drawText(svgGroup, rootNode);
  });
</script>

<svg width="600" height="400" />

<style>
</style>
