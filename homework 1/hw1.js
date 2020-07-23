/*
 * Homework 1
 * JavaScript skeleton code
 *
 * Author: Bozhao Lan
 * Version: 1.0
 */

"use strict";

function createLinePlot(chart) {
  const width = 1920,
  height = 1080,
  xAxesLength = 1600;
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

const jsonURL = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/VA-51-virginia-counties.json";

const cvsURL = "https://cors-anywhere.herokuapp.com/http://www.cs.vt.edu/~gracanin/course/cs3744/hw1.csv";

const width = 1920,
  height = 1080;

const map = d3
  .select("body")
  .append("div")
  .classed("map", true)
  .attr("id", "VAmap");

const svg = map
  .append("svg")
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

svg.append("path")
  .attr("d", "M 0 0 L 1920 0 L 1920 1080 L 0 1080 z");

const projection = d3
  .geoMercator()
  .scale(11000)
  .translate([0, 0]);

const countyPath = d3
  .geoPath()
  .projection(projection);

var jsonData = d3
  .json(jsonURL)
  .then((data) => {
    const state = topojson.feature(data, data.objects.cb_2015_virginia_county_20m),
      bounds = countyPath.bounds(state);
    projection.translate([width / 2 - (bounds[0][0] + bounds[1][0]) / 2, height / 2 - (bounds[0][1] + bounds[1][1]) / 2]);

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
      .attr("value", -1)
      .attr("d", countyPath)
          .on("mouseover", function() {

            })
            .on("mouseenter", function() {
              console.log("mouse enter");
            });

  });
jsonData.then(() => {
  return d3.csv(cvsURL)
    .then((data) => {
      data.forEach((item, ) => {
        svg.select("[id=id" + item.id + "]")
          .attr("value", item.v2019q3)
      });
    })


});


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
