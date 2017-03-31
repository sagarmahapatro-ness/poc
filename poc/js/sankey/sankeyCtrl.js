
(function(){

 function sankeyCtrl ($scope){
     "ngInject";
       var colors = {
        'matarial_a':                     '#edbd00',
        'matarial_b':                      '#367d85',
        'matarial_c':                       '#97ba4c',
        'semi-finished_matarial_c':              '#f5662b',
        'semi-finished_matarial_d': '#3f3e47',
        'finished_matarial_e':            '#9f9fa3',
        'packaged_matarial':            '#ff9fa3'
    };
    $scope.showPIInTooltip = false; 
    var p=d3.scale.category10();
    var r=p.range();
    
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([10, 10])
    .html(function(d) {
        var name = "";
        var data = d.data;
        var html = "";
        if(!$scope.showPIInTooltip){
            if(d.type === "node" ){
               name =  data.name;
               html = "<div layout-xs=\"column\"> <div> Metarial </div> <div> name:"+ name +"</div><div>"+0+" </div>"
            } else if(d.type === "link" ){
                 name = data.source.name+" -- > "+data.target.name;
                 html = "<div layout-xs=\"column\"> <div> Link </div> <div> name:"+ name +"</div><div> delay :"+0+" </div>"
            }
        }
        return html;
    })
    tip.direction('e')
      d3.json("data/sankey_product.json", function(error, json) {
          console.log(" json ");
          console.dir(json);

          var svg = d3.select("#chart").append("svg");
          svg.call(tip);
          var chart = svg.chart("Sankey.Path");
          ["click", "mouseover", "mouseout"].forEach(function(evt) {
          chart.on("node:"+evt, function(node) {
               var obj = {
               type:"node",
               data:node
              };
              if(evt === "mouseover"){
                  tip.show(obj);
              } else if(evt === "mouseout"){
                  tip.hide();
              }
              console.log(" evt >> ");
              console.log(evt);
              showPi(node);
          });
          chart.on("link:"+evt, function(link) { 
              console.dir(link);
              var obj = {
               type:"link",
               data:link
              };
              if(evt === "mouseover"){
                  tip.show(obj);
              } else if(evt === "mouseout"){
                  tip.hide();
              }
             removePi()
           });
        });


        chart
          .name(label)
          .colorNodes(function(name, node) {
            return color(node, 1) || colors.fallback;
          })
         .colorLinks(function(link) {
            return color(link.source, 4) || color(link.target, 1) || colors.fallback;
          })
          .nodeWidth(25)
          .nodePadding(10)
          .spread(true)
          .alignLabel('end')
          .iterations(0)
          .draw(json);
          

        function label(node) {
          return node.name.replace(/\s*\(.*?\)$/, '');
        }

        function color(node, depth) {
          var id = node.id;
          if (colors[id]) {
            return colors[id];
          } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
            return color(node.targetLinks[0].source, depth-1);
          } else {
            return null;
          }
        }

        function removePi(){
             d3.select("#donuts-preview").select("svg").remove();
            // d3.select("#donuts-legend").select("svg").remove();
        }

        function showPi(node){
              
              var width = 150;
              var height = 150;
              var radius = Math.min(width, height) / 2;
              d3.select(".d3-tip").select("svg").remove();
              d3.select("#donuts-preview").select("svg").remove();
              var psvg;
              if($scope.showPIInTooltip){

                psvg = d3.select(".d3-tip").append("svg");
              } else {
                psvg = d3.select("#donuts-preview").append("svg");
              }
              
              var piOrgX = 40+ width / 2;
              var piOrgY = 70+ height / 2;
              var svg = psvg
                .attr("width", 320)
                .attr("height", 250)
                .append("g")
                .attr("transform", "translate(" + piOrgX + "," + piOrgY + ")");  

             var pie = d3.layout.pie()
                .sort(null); 
             var outerRadius = radius;

             var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(outerRadius); 

           var dataset = [node.data.QA, node.data.QC,node.data.PROD, node.data.Recived];
           var labels = ["QA","QC","PROD","ReCIVED"];
           var colourSet = ['#f03e3e','#fd7e14','#fcc419','#d0cd02'];
           
           var arcs = svg.selectAll("g.arc")
                .data(pie(dataset))
                .enter()
                .append("g");

           var itemHeader = ["Metarial Name : "+node.name];      
           psvg.selectAll("text")
                    .data(itemHeader)
                    .call(function(d) { d.enter().append("text")})
                    .call(function(d) { d.exit().remove()})
                    .attr("y","15")
                    .attr("x","10")
                    .text(function(d) { ;return d}) 
          
            arcs.append("path")
            .attr("fill", function (d, i) {
                    return colourSet[i];
            })
            .attr("d", arc);

           arcs.append("text")
                .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .text(function (d) {
                 console.log(" transform ");
                 console.dir(d.value);   
                 return d.value;
                });
          var legendWidth = 150;
          var legendHeight = 100; 
          var bordercolor = "#000000";
          var borderStrokeWidth = 2;
           var fillColor = "#ffffff"
          
             psvg.append("g")
                .attr("transform", "translate(" + (radius+100) + "," +  40 + ")")
                .style("font-size", "12px")
                .call(drawLegend);   

           function drawLegend( g ){
             console.log("  drawLegend ");
             console.dir(g);

              g.each(function() {
                    var g= d3.select(this);
                    lb = g.selectAll(".legend-box").data([true]);
                    li = g.selectAll(".legend-items").data([true]);
                    lb.enter().append("rect").classed("legend-box",true);
                    li.enter().append("g").classed("legend-items",true);
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
                    .text(function(d) { ;return d.key})

                    li.selectAll("circle")
                    .data(items,function(d) { return d.key})
                    .call(function(d) { d.enter().append("circle")})
                    .call(function(d) { d.exit().remove()})
                    .attr("cy",function(d,i) { return i-0.25+"em"})
                    .attr("cx",0)
                    .attr("r","0.4em")
                    .style("fill",function(d) { console.log(d.color);return d.color});
                     
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


        }


        function drawtTooltipDonut(options) {
             console.log(" drawtTooltipDonut ");
            var width = document.querySelector(options.elem).clientWidth,
                height = document.querySelector(options.elem).clientHeight,
            radius = Math.min(width, height) / 2;            

            var dataset = [options.dataset.severity.Critical,options.dataset.severity.High,options.dataset.severity.Medium,options.dataset.severity.Low,options.dataset.severity.None];
            var colourSet = ['#f03e3e','#fd7e14','#fcc419','#d0cd02','#ffffff'];

            var pie = d3.layout.pie()
                .sort(null);

            var arc = d3.svg.arc()
                .innerRadius(radius - 20)
                .outerRadius(radius);

            //Remove whatever chart with the same id/class was present before
            d3.select(options.elem).select("svg").remove();

            var svg = d3.select(options.elem).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");    

            var path = svg.selectAll("path")
                .data(pie(dataset))
                .enter().append("path")
                .attr("fill", function(d, i) { 
                    return colourSet[i]; 
                })
                .attr("d", arc);

        }


        
      });
 }   

angular.module('pifzerPOCApp').controller('sankeyCtrl', sankeyCtrl);
})();


