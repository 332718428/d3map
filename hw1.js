/*
 * Homework 1
 * JavaScript skeleton code
 *
 * Author: Bozhao Lan
 * Version: 1.0
 */

"use strict";

function updateLinePlot(chart, county) {

}

function createLinePlot(chart) {
  const width = 1920,
  height = 1080,
  xAxesLength = 1600,
  yAxesLength = 900;

  chart.append("div")
  .classed("caption", true);

  const svg = chart
  .append("svg")
  .attr("id", "mapTooltipSVG")
  .attr("width", "500")
  .attr("height", "300")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + width + " " + height);
}

function createSlider(element) {
  let sliderRange = element
  .append("div")
  .attr("id", "slider-range");

  let gRange = sliderRange
  .append("svg")
  .attr("width", 600)
  .attr("height", 100)
  .append("g")
  .attr("transform", "translate(30,30)");

  var svgDefs = sliderRange.select("svg").append("defs");
  var sliderGradient = svgDefs
  .append("linearGradient")
  .attr("id", "sliderGradient");
  sliderGradient.append("stop")
  .attr("class", "stop-left")
  .attr("offset", "0");
  sliderGradient.append("stop")
  .attr("class", "stop-middle")
  .attr("offset", "0.3");
  sliderGradient.append("stop")
  .attr("class", "stop-right")
  .attr("offset", "1");

  let slider = d3
  .sliderBottom()
  .min(0)
  .max(100)
  .width(500)
  .tickFormat(d3.format(".0f"))
  .ticks(10)
  .default([0.100])
  .on("onchange", val => {
    d3.selectAll("#mapSVG path")
    .filter(function(d) {
      let v = this.getAttribute("value");
      if(v < val[0] || v > val[1]) {
        this.setAttribute("fill", "grey");
      }
      else {
        this.setAttribute("fill", d3
        .scaleLinear()
        .domain([-1, 0, 30, 100])
        .range(["grey", "green", "yellow", "red"])
        .interpolate(d3.interpolateRgb)(v));
      }

      return this.toString() === (100 + "");
    });

    d3.selectAll("text")
    .style("opcaity", 1.0);
  });

  gRange.call(slider);

  sliderRange.select("svg")
  .select("line.track-inset")
  .attr("y1", "0")
  .attr("y2", "1");
}

const jsonURL = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/VA-51-virginia-counties.json";

const cvsURL = "https://cors-anywhere.herokuapp.com/http://www.cs.vt.edu/~gracanin/course/cs3744/hw1.csv";

const width = 1920,
  height = 1080;

const map = d3
  .select("body")
  .append("div")
  .attr("class", "map");  

const svg = map
  .append("svg")
  .attr("id", "mapSVG")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + width + " " + height);

svg.append("text")
  .attr("x", width / 2)
  .attr("y", 40)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "central")
  .attr("font-size", "40")
  .attr("font-weight", "bold")
  .text("Overall Housing Affordability Index at 60% of Median Household Income");

svg.append("text")
  .attr("x", width / 2)
  .attr("y", 90)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "central")
  .attr("font-size", "35")
  .text("by Virginia Counties and independent Cities, 3rd Qtr. 2019");

// svg.append("path")
//   .attr("d", "M 0 0 L 1920 0 L 1920 1080 L 0 1080 z");

const projection = d3
  .geoMercator()
  .scale(11000)
  .translate([0, 0]);

const countyPath = d3
  .geoPath()
  .projection(projection);

const mapTooltip = d3
.select("body")
.append("div")
.classed("mapTooltip", true);

var jsonData = d3
  .json(jsonURL)
  .then((data) => {
    const state = topojson.feature(data, data.objects.cb_2015_virginia_county_20m),
      bounds = countyPath.bounds(state);
    projection.translate([width / 2 - (bounds[0][0] + bounds[1][0]) / 2, height / 2 - (bounds[0][1] + bounds[1][1]) / 2]);
    console.log(state.features);
    svg.selectAll("path")
      .data(state.features)
      .enter().append("path")
      .classed("county", true)
      .attr("id", county => {
        return "id" + county.properties.COUNTYFP;
      })
      .attr("name", county => {
        return county.properties.NAME;
      })
      .attr("fill", "grey")
      .attr("value", -1)
      .attr("d", countyPath)
          .on("mouseover", function(county) {
              updateLinePlot(mapTooltip, this);
              return mapTooltip.style("visibility", "visible");
            })
            .on("mousemove", d => {
              return mapTooltip
              .style("top", (d3.event.pageY + 10) + "px")
              .style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", d => {
              return mapTooltip.style("visibility", "hidden");
            });

  });

jsonData.then(() => {
  return d3.csv(cvsURL)
    .then((data) => {
      data.forEach((item, ) => {
        svg.select("[id=id" + item.id + "]")
          .attr("value", item.v2019q3)
          .attr("trend", Object.values(item).slice(1))
          .attr("fill", ()=> {
            return d3.scaleLinear()
            .domain([-1, 0, 30, 100])
            .range(["grey", "green", "yellow", "red"])
            .interpolate(d3.interpolateRgb)(item.v2019q3);
          })
      });
    })


});

createLinePlot(mapTooltip);

createSlider(map);


//   svg.append("path")
//     .datum({
//       "type": "FeatureCollection",
//       features: state.features
//     })
//     .attr("d", countyPath)
//     .on("mouseover", function() {
//
//     })
//     .on("mouseenter", function() {
//       console.log("mouse enter");
//     });
// })
// .catch((error) => {
//   console.error("Error loading the JSON data: " + error);
// });
