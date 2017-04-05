(function(){

 function matariaDiagramCtr ($scope){
     "ngInject";


     var units = "Widgets";

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20();

 var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([10, 10])
    .html(function(d) {
        var name = "aa";
        //console.log("info ");
        //console.dir(d);
        
        var html =   html = "<div style=\"padding: 5px;\" layout-xs=\"column\"> <div style=\"padding: 5px;\"> Metarial </div> <div style=\"padding: 5px;\"> ID :"+ d.v.id +"</div><div style=\"padding: 5px;\" >description: "+d.v.description+" </div><div layout=\"column\"><div style=\"padding: 5px;\"> Legends :</div><div style=\"padding: 5px;\" id=\"legendInfo\"></div><div>";
       
       // }
        return html;
    })

    tip.direction('e');
 function drawlegend(){
   d3.select("#legendInfo").select("svg").remove();
   var psvg = d3.select("#legendInfo").append("svg");
   psvg.attr("height","70px");
   psvg.append("g")
   .attr("transform", "translate(" + 10+ "," +  10 + ")")
   .style("font-size", "10px")
   .call(drawLegend)
 }


 function drawLegend( g ){
   //console.log("  drawLegend ");
  // console.dir(g);

    g.each(function() {
          var g= d3.select(this);
          lb = g.selectAll(".legend-box").data([true]);
          li = g.selectAll(".legend-items").data([true]);
          lb.enter().append("rect").classed("legend-box",true);
          li.enter().append("g").classed("legend-items",true);
          var labels = ["QA","QC","PROD","ReCIVED"];
          var dataset = [20,30,40,10];
          var colourSet = ['#f03e3e','#fd7e14','#fcc419','#d0cd02','#ffffff'];
          //var colourSet = ['#f03e3e','#fd7e14','#fcc419','#d0cd02'];
           
           var items = [{key:labels[0],color:colourSet[0]},
           {key:labels[1],color:colourSet[1]},
           {key:labels[2],color:colourSet[2]},
           {key:labels[3],color:colourSet[3]}
           ];
          li.attr("transform", "translate(" + 40 + "," + 10 + ")")
          li.selectAll("text")
          .data(items,function(d) { return d.key})
          .call(function(d) { d.enter().append("text")})
          .call(function(d) { d.exit().remove()})
          .attr("y",function(d,i) { return i+"em"})
          .attr("x","1em")
          .text(function(d) { return d.key})

          li.append("g").selectAll("text")
          .data(dataset,function(d) { return d})
          .call(function(d) { d.enter().append("text")})
          .call(function(d) { d.exit().remove()})
          .attr("y",function(d,i) { return i+"em"})
          .attr("x","10em")
          .text(function(d) { ;return d+"%"})

          li.selectAll("circle")
          .data(items,function(d) { return d.key})
          .call(function(d) { d.enter().append("circle")})
          .call(function(d) { d.exit().remove()})
          .attr("cy",function(d,i) { return i-0.25+"em"})
          .attr("cx",0)
          .attr("r","0.4em")
          .style("fill",function(d) { //console.log(d.color);
            return d.color
          });
           
          /* legendPadding = 10;
           var lbbox = li[0][0].getBBox();
           console.log(" rect bound >>  ");
           console.dir(lbbox);  
           lb.attr("x",0)
              .attr("y",0)
              .attr("height",100)
              .attr("width",100) */

    });
  }
// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(100)
    .nodePadding(40)
    .size([width, height]);

var path = sankey.link();
$scope.batcheInfo = [];
$scope.batchIndex = {};
function parseData(data){
 //console.log(" data recived >>> 2"); 
 //console.dir(data);
 for(var i=0; i<data.length;i++){
  var tempData = data[i];
  tempData.links
  var tempNodeInfo = [];
  for(var j=0; j< tempData.nodes.length; j++)
  {
       tempNodeInfo.push({
         sourceLinks:0,
         targetLinks:0
       });
  }

  for(var k=0; k< tempData.links.length; k++)
  {
       var linkTemp = tempData.links[k];
       tempNodeInfo[linkTemp.source].sourceLinks  = tempNodeInfo[linkTemp.source].sourceLinks  + 1;
       tempNodeInfo[linkTemp.target].targetLinks  = tempNodeInfo[linkTemp.target].targetLinks + 1;
  }
   
  var rootNode = {}; 
  for(var l=0; l< tempData.nodes.length; l++)
  {
       if(tempNodeInfo[l].sourceLinks === 0){
            rootNode = tempData.nodes[l];
       }
  }
  var batch ={
    d:tempData,
    rootInfo:rootNode
  };
  $scope.batcheInfo.push(batch);

 }
//console.log("after data processing 2");
 //console.dir($scope.batcheInfo);
}

$scope.applyFilter = function(){
  //console.log("apply filtter ");
  //console.dir($scope.batchIndex);
  drawChart($scope.batchIndex.d);
}

function drawChart(data){
var graph = data;
d3.select("#chartmetarial").select("svg").remove();  
 var temp = d3.select("#chartmetarial");
    temp = temp.append("svg")
    temp.call(tip);
// append the svg canvas to the page
var svg = temp.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

//console.log(" graph "+graph);
//console.dir(graph);
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
var labels = [];
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
      .on("drag", dragmove))
      .on("mouseout",function(evt){
         //console.log(" mouseout ");
         tip.hide();
      })
      .on("mouseover",function(evt){
        var d = {
          v:evt,
          node:this
        };
         tip.show(d);
         drawlegend();
      })
      .call(function(d){
        console.log(" node rendered");
        console.dir(d); 
        d.each(function(e){
          console.log(" node rendered 2");
        console.dir(e);
         var alradyExit = false; 
         for(var i=0; i<labels.length; i++){
             if(labels[i].x === e.x){
               alradyExit = true;
               break;
             }
         } 
         if(!alradyExit){
            var label = "Semifinised";
            if(e.sourceLinks.length === 0){
               label = "packaged";
            }else if(e.targetLinks.length === 0){
                label = "bulk";
            }
            labels.push({x:e.x,l:label})
         }
        

        })
      });

   

  node.append("g")
  .call(drawPi)
  .attr("transform", function(d){
        //console.log(" transform ");
        //console.dir(d);
       return "translate(" + d.dx/2 + "," + d.dy/2 + ")"}
    ); 
   /* var cir = node.append("g"); 
    var circle = cir.append("circle")
                         .attr("cx", function(d){
                             return d.dx/2;
                          })
                          .attr("cy", function(d){
                             return d.dy/2;
                          })
                         .attr("r", 12); */ 

  svg.append("g").selectAll(".labels")
      .data(labels)
      .enter().append("text")
      .attr("x", function(d){
        return d.x;
      })
      .attr("y", function(d) { return height-40; })
      .text(function(d) { return d.l; })                       
                         

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
    //console.log("start drawing pi "+args);
    //console.dir(args);
    var dataset = [20,30,40,10];
    var colourSet = ['#f03e3e','#fd7e14','#fcc419','#d0cd02','#ffffff'];
    var radius = 40;
    args.each(function() {
        var pic= d3.select(this);
        //console.log(" drawPi "+pic);
        //console.dir(pic);
        
         var pie = d3.layout.pie()
                .sort(null);
         var arc = d3.svg.arc()
                .innerRadius(radius - 20)
                .outerRadius(radius); 

        
    
      /* var selectedNode = pic.selectAll("path")
                .data(pie(dataset))
                .enter().append("path")
                .attr("fill", function(d, i) { 
                    return colourSet[i]; 
                })
                .attr("d", arc); 

      selectedNode.append("text")
      .text("new");*/

      var g = pic.selectAll(".arc")
      .data(pie(dataset))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d, i) { return colourSet[i]; });

  /*g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data+"%"; }); */ 

    });
  }
}

// load the data (using the timelyportfolio csv method)
d3.json("data/BN_metarial_design.json", function(error, data) {
 parseData(data);
 
});
  
 }   

angular.module('pifzerPOCApp').controller('matariaDiagramCtr', matariaDiagramCtr);
})();