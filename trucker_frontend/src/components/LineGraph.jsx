import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import * as d3 from "d3";

const LineGraph = ({ entries }) => {
  const svgRef = useRef(null);
  const [points, setPoints] = useState([{ x: 0, y: "" }]);

  useEffect(() => {
    setPoints([{ x: 0, y: "" }]);
    if (!entries || entries.length === 0) return;

    const status = {
      on_duty: "On duty",
      off_duty: "Off duty",
      driving: "Driving",
      sleeper: "Sleeper Berth",
    };
    entries.forEach((entry) => {
      setPoints((prevPoints) => {
        prevPoints[prevPoints.length - 1].y = status[entry.duty_status];
        const point = {
          x: entry.duration + prevPoints[prevPoints.length - 1].x,
          y: status[entry.duty_status],
        };
        const nextPoint = { x: point.x, y: "" };
        return [...prevPoints, point, nextPoint];
      });
    });
    setPoints((prevPoints) => {
      const updatedPoints = [...prevPoints];
      updatedPoints.pop();
      return updatedPoints;
    });
  }, [entries]);
  console.log(points);

  useEffect(() => {
    // SVG dimensions
    const screenWidth = window.innerWidth;
    let width, height;
    let margin = { top: 20, right: 20, bottom: 30, left: 40 };
    if (screenWidth < 576) {
      width = 300;
      height = 200;
    } else if (screenWidth < 768) {
      width = 580;
      height = 400;
    } else if (screenWidth >= 768) {
      width = 800;
      height = 400;
    }

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Clear previous content
    svg.selectAll("*").remove();

    // Define scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([margin.left, width - margin.right]);

    const yValues = ["Off duty", "Sleeper Berth", "Driving", "On duty"];
    const yScale = d3
      .scalePoint()
      .domain(yValues)
      .range([height - margin.bottom, margin.top])
      .padding(0.5);

    // Create line generator
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    // Draw the line
    svg
      .append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1)
      .attr("d", line);

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(24).tickFormat(d3.format("d")))
      .selectAll("text") // Format x-axis text
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "8px");

    // Add x-axis grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(24)
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat("")
      )
      .attr("stroke-opacity", 0.2);

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll("text") // Format y-axis text
      .style("font-size", "12px");

    // Add y-axis grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat("")
      )
      .attr("stroke-opacity", 0.2);

    // Add dots for each data point
    svg
      .selectAll(".dot")
      .data(points)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 4)
      .attr("fill", "steelblue");
  }, [points]); // Redraw when data changes

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineGraph;
