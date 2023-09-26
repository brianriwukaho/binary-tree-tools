<script script="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { data } from "./stub";

  onMount(() => {
    const width = 600;
    const height = 400;

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => {
        svgGroup.attr("transform", event.transform);
      });

    const svg = d3
      .select("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black");

    svg.call(zoom);
    const svgGroup = svg.append("g");

    const rootNode = d3.hierarchy(data);

    const treeLayout = d3.tree().size([height, width]).nodeSize([125, 250]);

    const links = treeLayout(rootNode).links();

    svgGroup
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", "black")
      .attr("stroke-width", 1.5);

    svgGroup
      .selectAll("circle")
      .data(rootNode.descendants())
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 40)
      .style("fill", "#eee")
      .style("stroke", "black")
      .style("stroke-width", "1.5");

    svgGroup
      .selectAll("text")
      .data(rootNode.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("dy", "0.32em")
      .attr("text-anchor", "middle")
      .attr("font-size", "3.25em")
      .text((d) => d.data.name);

    const initialScale = 0.2;
    const initialX = (width * (1 - initialScale)) / 2;
    const initialY = (height * (1 - initialScale)) / 2;

    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(initialX, initialY).scale(initialScale)
    );
  });
</script>

<svg width="600" height="400" />

<style>
  .font-size {
    font-size: 3.25em;
  }
</style>
