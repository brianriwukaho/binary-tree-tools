import * as d3 from "d3";

export interface NodeData {
  id: string;
  name: string;
  children?: NodeData[];
}

export type PositionedNode = d3.HierarchyNode<NodeData> & {
  x: number;
  y: number;
};

export interface PositionedLink extends d3.HierarchyLink<NodeData> {
  source: PositionedNode;
  target: PositionedNode;
}

export function initZoom(
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  svgGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  height: number,
  width: number
) {
  const zoom = d3
    .zoom()
    .scaleExtent([0.2, 5])
    .on("zoom", (event) => {
      svgGroup.attr("transform", event.transform.toString());
    });

  // @ts-ignore
  svg.call(zoom);

  const initialScale = 0.4;
  const initialX = (width * (1 - initialScale)) / 2;
  const initialY = (height * (1 - initialScale)) / 2;

  svg.call(
    // @ts-ignore
    zoom.transform,
    d3.zoomIdentity.translate(initialX, initialY).scale(initialScale)
  );
}

export function drawLines(
  svgGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  links: PositionedLink[],
  x: number,
  y: number
) {
  svgGroup
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", (d) => {
      if (d.target.x < d.source.x) {
        return d.source.x + x - 30;
      } else {
        return d.source.x + x + 30;
      }
    })
    .attr("y1", (d) => d.source.y + y + 35)
    .attr("x2", (d) => d.target.x + x)
    .attr("y2", (d) => d.target.y + y - 40)
    .attr("stroke", "black")
    .attr("stroke-width", 1.5);
}

export function drawCircles(
  svgGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  rootNode: PositionedNode,
  x: number,
  y: number,
  addNode: (
    positionedNode: PositionedNode,
    childDirection: "left" | "right"
  ) => void
) {
  svgGroup
    .selectAll("circle.main")
    .data(rootNode.descendants())
    .enter()
    .append("circle")
    .attr("class", "main")
    .attr("cx", (d: PositionedNode) => d.x + x)
    .attr("cy", (d: PositionedNode) => d.y + y)
    .attr("r", 40)
    .style("fill", "#eee")
    .style("stroke", "black")
    .style("stroke-width", "1.5");

  svgGroup
    .selectAll("circle.left")
    .data(rootNode.descendants())
    .enter()
    .append("circle")
    .attr("class", "left")
    .attr("cx", (d: PositionedNode) => d.x + x - 30)
    .attr("cy", (d: PositionedNode) => d.y + y + 35)
    .attr("r", 10)
    .style("fill", "#ddd")
    .style("stroke", "black")
    .style("stroke-width", "1.5")
    .on("click", (_, d) => addNode(d, "left"));

  svgGroup
    .selectAll("circle.right")
    .data(rootNode.descendants())
    .enter()
    .append("circle")
    .attr("class", "right")
    .attr("cx", (d: PositionedNode) => d.x + x + 30)
    .attr("cy", (d: PositionedNode) => d.y + y + 35)
    .attr("r", 10)
    .style("fill", "#ddd")
    .style("stroke", "black")
    .style("stroke-width", "1.5")
    .on("click", (_, d) => addNode(d, "right"));
}

export function drawText(
  svgGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  rootNode: PositionedNode,
  x: number,
  y: number
) {
  svgGroup
    .selectAll("text")
    .data(rootNode.descendants())
    .enter()
    .append("text")
    .attr("x", (d: PositionedNode) => d.x + x)
    .attr("y", (d: PositionedNode) => d.y + y)
    .attr("dy", "0.32em")
    .attr("text-anchor", "middle")
    .attr("font-size", "3.25em")
    .text((d) => d.data.name);
}
