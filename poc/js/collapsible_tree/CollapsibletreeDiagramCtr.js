(function(){

function collapsibletreeDiagramCtr ($scope){
     "ngInject";

 /* function CSData(){
    this.nodes = [];
    this.links = [];

    this.computeNodeLinks = function () {
      
      this.nodes.forEach(function(node) {
        this.node.sourceLinks = [];
        this.node.targetLinks = [];
      });

      this.links.forEach(function(link) {
        var source = link.source,
            target = link.target;
        if (typeof source === "number"){
          source = link.source = this.node[link.source];
        } 
        if (typeof target === "number"){
          target = link.target = this.node[link.target];
        } 
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      });
    }

    

  }
  CSData.prototype.compute = function(){
       this.computeNodeLinks();
       console.log(" compute ");
       console.dir(this.nodes);
  };

  CSData.prototype.setNodes = function(arg){
     this.nodes = arg;
  };

  CSData.prototype.setLinks = function(args){
     this.links = args;
  };

  function CSRenderer(container,csData){
    this.csData  = csData;
    this.container = d3.select(container);
    this.width = 500;
    this.height = 500;
  }

  CSRenderer.prototype.setSize= function(width,height) {
     this.width = width;
     this.height = height;
     this.csData.compute();
  };

  CSRenderer.prototype.draw = function(){
   var margin = {top: 10, right: 10, bottom: 10, left: 10};
   var width = this.width - margin.left - margin.right;
   var height = this.height - margin.top - margin.bottom;


   var svg = this.container.append("svg")
   var gc = svg.
        attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
    var border=1;
    var bordercolor='black';
    var borderPath = svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", width)
            .style("stroke", bordercolor)
            .style("fill", "none")
            .style("stroke-width", border);
    };

  d3.json("data/sankey.json", function(error, data) {
        console.log(" collapsibletreeDiagramCtr data ");
        console.dir(data);
        var csData = new CSData();
        csData.setNodes(data.nodes);
        csData.setLinks(data.links);

        var csRenderer = new CSRenderer("#collapsibletree",csData);
        csRenderer.setSize(1500,750);
        csRenderer.draw();
  }); */  



     var units = "Widgets";

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1200 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20();
 var temp = d3.select("#collapsibletree");
    temp = temp.append("svg")
// append the svg canvas to the page
var svg = temp.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(100)
    .nodePadding(40)
    .size([width, height]);

var path = sankey.link();



// load the data (using the timelyportfolio csv method)
d3.json("data/energy.json", function(error, data) {
var graph = data;
console.log(" graph "+graph);
console.dir(graph);
sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(32);

// add in the links
var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, 10); })
      .sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
link.append("title")
        .text(function(d) {
        return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });

// add in the nodes
var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { 
      this.parentNode.appendChild(this); })
      .on("drag", dragmove));

   

  node.append("g")
  .call(drawPi)
  .attr("transform", function(d){
        console.log(" transform ");
        console.dir(d);
       return "translate(" + d.dx/2 + "," + d.dy/2 + ")"}
    );     

// add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

// the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr("transform", 
        "translate(" + d.x + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }

  function drawPi(args){
    console.log("start drawing pi "+args);
    console.dir(args);
    var dataset = [20,30,40,10];
    var colourSet = ['#f03e3e','#fd7e14','#fcc419','#d0cd02','#ffffff'];
    var radius = 40;
    args.each(function() {
        var pic= d3.select(this);
        console.log(" drawPi "+pic);
        console.dir(pic);
        
         var pie = d3.layout.pie()
                .sort(null);
         var arc = d3.svg.arc()
                .innerRadius(radius - 20)
                .outerRadius(radius); 

        /*var circle = pic.append("circle")
                         .attr("cx", 30)
                          .attr("cy", 30)
                         .attr("r", 20);*/

       pic.selectAll("path")
                .data(pie(dataset))
                .enter().append("path")
                .attr("fill", function(d, i) { 
                    return colourSet[i]; 
                })
                .attr("d", arc);                     
    });
  }


});
}   

angular.module('pifzerPOCApp').controller('collapsibletreeDiagramCtr', collapsibletreeDiagramCtr);
})();