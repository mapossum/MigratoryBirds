//

define([
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/SummarizeUnit.html", 
	"dojo/dom-style", 
	"dojo/dom-class", 
	"dojo/_base/fx", 
	"dojo/_base/lang",
	"dojox/lang/functional", 
	"dojo/on", 
	"dojo/mouse", 
	"dojo/query",  
	"esri/layers/graphics", 
	"esri/tasks/gp", 
	"dojo/_base/array", 
	"dojox/charting/Chart", 
	"dojox/charting/axis2d/Default", 
	"dojox/charting/plot2d/Default", 
	"dojox/charting/plot2d/Bars", 
	"dojox/charting/themes/Wetland", 
	"dojox/charting/plot2d/StackedBars",
	"dojox/charting/plot2d/Pie",
	"dojox/charting/widget/Legend",
	"dojo/aspect",
	"dijit/form/CheckBox",
	"dojo/parser",
	"esri/toolbars/draw",
	"dojox/charting/action2d/Tooltip",
	"bootstrap/Tooltip",
	"bootstrap/Popover",
	"grmapper/CollectInputs",
	"grmapper/mbResult"
	],
   function(
    declare, 
    WidgetBase, 
    TemplatedMixin, 
    template, 
    domStyle, 
    domClass, 
    baseFx, 
    lang,
    functional, 
    on, 
    mouse, 
    query, 
    esrigraphics, 
    esrigp, 
    array, 
    Chart, 
    axisDefault, 
    plotDefault, 
    Bars, 
    Wetland, 
    StackedBars,
    Pie,
    Legend,
    aspect,
    CheckBox,
    parser,
    esridraw,
    dc,
    Tooltip,
    Popover,
    CollectInputs,
    mbResult
    ){
        return declare([WidgetBase, TemplatedMixin], {
           
            // Some default values for our author
            // These typically map to whatever you're handing into the constructor
            name: "No Name",
            // Using require.toUrl, we can get a path to our AuthorWidget's space
            // and we want to have a default avatar, just in case
            //avatar: require.toUrl("custom/AuthorWidget/images/defaultAvatar.png"),
            bio: "",
 
            // Our template - important!
            templateString: template,
 
            // A class to be applied to the root node in our template
            baseClass: "compareunit",
            
            stype: "none",
 
            // A reference to our background animation
            mouseAnim: null,
            
            //inputLayers: [{},{}],
            
            jobs: ["",""],
            
            outputs: {"LandCoverSummary":{color:"#081",habtable:[]},"WaterBirdSummary":{color:"#018",habtable:["1","0.75","0.25","0"]},"ShoreBirdSummary":{color:"#F60",habtable:["1","0.5","0.25","0"]},"LandBirdSummary":{color:"#811",habtable:["1","0.5","0"]}},
            
            processedResults: 0,
            
            destroy: function(){
  	   	
	         this.inherited(arguments);
            	
            },
            
            
            postCreate: function(){
            
			    // Get a DOM node reference for the root of our widget
			    var domNode = this.domNode;
			 
			    // Run any parent postCreate processes - can be done at any point
			    
			    this.inherited(arguments);
			    
			    
			    if (this.stype == "model") {
			    	this.gp = new esri.tasks.Geoprocessor("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/MBSummarize/GPServer/SummarizeLayersByArea");
			    } else {
			    	this.gp = new esri.tasks.Geoprocessor("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/MBSummarize/GPServer/SummarizeHabitatByArea");
			    }
			    
			    
		   },
		   
		   startup: function() {
		   
		   	//inputLayers = [];
		   	
		   	this.inherited(arguments);
		   		   
		     query("#" + this.domNode.id + " a").onclick(function(e){
	           e.preventDefault(); 
	           });
	             
			 this.map.reposition();
			 
			 result1 = lang.clone(this.outputs);
			 result2 = lang.clone(this.outputs);
			 
			 this.outputs = [result1,result2]

			 this.map.tip.setContent({title:"Select a Summary Level Above", text: "There is nothing to do on the map now.  You will be able to choose a location to summarize after you choose an option form the Summary Level dropdown.  Map navigation (pan and zoom) continue to work as normal."});
			 
			 
			 colInputs = query("#" + this.domNode.id + " .collectInputs")[0]
			 
			 sy = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 250, 30]), 2), new dojo.Color([230, 230, 20, 0.25]))
			 
			 this.inputCollector = new CollectInputs({map:this.map,symbol:sy}).placeAt(colInputs);
			
			
			// must stop on!!!!! 
			 on(this.inputCollector, "finished", lang.hitch(this,function(e) {
			
			     //this.jobs = ["",""];
				 
				 //this.inputLayers.push(e.inputLayer);
				 
				 this.inputLabel0 = e.label;
				 
				 this.inputLayer0 = e.inputLayer;
				 
				 sy = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([10, 240, 250]), 2), new dojo.Color([0, 250, 255, 0.25]));
				 
				 colInputs2 = query("#" + this.domNode.id + " .collectInputs")[1]
				 this.inputCollector2 = new CollectInputs({map:this.map,symbol:sy,stepNumber:3}).placeAt(colInputs2);
				 
				 on(this.inputCollector2, "finished", lang.hitch(this,this.submitFeatures));
				 
			 }));   
			 			 
		   },

		   
		   _close: function() {
            
            if (this.inputLayer0 != undefined) {this.map.removeLayer(this.inputLayer0)};
            if (this.inputLayer1 != undefined) {this.map.removeLayer(this.inputLayer1)};
            
            if (this.inputCollector != undefined) (this.inputCollector.destroy())
            if (this.inputCollector2 != undefined) (this.inputCollector2.destroy())
            
   //         inputLayers = [this.inputLayer0, this.inputLayer1]
            
   //           if (inputLayers.length > 0) {
   //           	dojo.forEach(this.inputLayers, lang.hitch(this,function(item, i){
   //           	   alert(item.id)
   //        		   this.map.removeLayer(item);
   //        		}))
   //        	   };
  
		   },
		   		   
		   hidesteps: function(nohide) {
			   
			   steps = query("#" + this.domNode.id + " .step")
			   
			   dojo.forEach(steps, function(item, i){
			   
			   if (item.className.indexOf(nohide) < 0) {
			   		a = baseFx.animateProperty({
				   		node: item,
				   		onEnd: lang.hitch(this, function(item) {domStyle.set(item, "display", "none");this.map.reposition();}),
				   		properties: {
					   		opacity: { start: 1, end: 0 }
					   		},
					   		duration: 600
					   	});
       
        	} else {
	        	
	        		//alert("found " + nohide)
	        		domStyle.set(item, "display", "");
	        		domStyle.set(item, "opacity", 0);
	        		
			   		a = baseFx.animateProperty({
				   		node: item,
				   		onEnd: lang.hitch(this, function(item) {domStyle.set(item, "display", "");this.map.reposition();}),
				   		properties: {
					   		opacity: { start: 0, end: 1 }
					   		},
					   		duration: 600
					   	});	        	
	        	
        	}
        	
        	a.play(); 
				   		   
				   //domStyle.set(item, "display", "none");
				   
			   });
			   
			   //stepshow = query("#" + this.domNode.id + " ." + nohide)
			   
			   //	domStyle.set(stepshow[0], "display", "");
			   
		   },
		   
		   
		   processAnimationStart: function() {
		   	  
		   	  color1 =  "rgb(217, 237, 247)"
              color2 =  "rgb(175, 205, 230)"
              
              ccolor = dojo.getStyle(this.domNode, "backgroundColor");
              
              if (ccolor == color1) {
	              outcolor = color2
              } else {
	              outcolor = color1
              }
			  
			  this.processAnimation = baseFx.animateProperty({
		        node: this.domNode,
		        duration: 900,
		        properties: {
		            backgroundColor: outcolor,
		        },
		        onEnd: lang.hitch(this, function() {
		            // Clean up our mouseAnim property
		            //this.mouseAnim = null;
		            this.processAnimationStart();
		        })
		    }).play(); 
			   
		   },
		   
		   processAnimationEnd: function() {
		   
		   
		   this.processAnimation.stop();
		   
		   this.processAnimation = null;
		   
		   },
		   
		   	   
		   submitFeatures: function(e) {

			   	//alert(this.inputCollector)
			   	
			    //this.inputCollector.destroyRecursive(true);
			    //this.inputCollector2.destroyRecursive(true);
			    
			    //alert(this.inputCollector)
			    
		   		//this.inputLayers.push(e.inputLayer);
				
				this.inputLabel1 = e.label;
				
		   		this.inputLayer1 = e.inputLayer;
		   		
		   		this.container.processAnimationStart();
		   
		   	 	this.hidesteps("step-processing");
		   	 	
		   	 	allfeats = [];
		   	 	
		   	 	returncount = 0;
		   	 	
		   	 	inputLayers = [this.inputLayer0, this.inputLayer1]
		   	 	
		   	 	dojo.forEach(inputLayers, lang.hitch(this,function(inputLayer, i){
		   	 	
			   	 	if (inputLayer.mode == esri.layers.FeatureLayer.MODE_SELECTION) {
				   	   features = inputLayer.getSelectedFeatures();	
			   	 	} else {
					   features = inputLayer.graphics;
					}
			        //features.push(graphic);
			        featureSet = new esri.tasks.FeatureSet();
			        featureSet.features = features;
			        
			        allfeats.concat(features);
			
			        params = {"InputFeatures": featureSet};
			        
			        this.gp.submitJob(params, lang.hitch(this,function(jobInfo) {
			        
			        			//alert(i);
			        			returncount = returncount + 1;
			        			this.jobs[i] = jobInfo;
			        			if (returncount == 2) {
				        			this.getOutputs();
			        			}
			    
			        								 })); //lang.hitch(this,this.getOutputs(jobInfo,i))}));
			          
		        }));
		        
		        //FeatureExtent = esri.graphicsExtent(allfeats);
		
		        //this.map.setExtent(FeatureExtent, true);
				
				//this.gp.execute(params, function(result, mess) {thing.displayTable(result,thing)}, function(error){alert(error)}) 	
		   
		   },
		   
		   getOutputs: function() {
		   	  this.container.processAnimationEnd("success");
		   	  
		   	  dojo.forEach(this.jobs, lang.hitch(this,function(jobInfo, i){
			  
			  console.log(jobInfo.jobId + " JOBID");		
			  console.log(this.outputs[i]);
			   		
			 functional.forIn(this.outputs[i], lang.hitch(this,function(outp,pname){
			     
			   this.gp.getResultData(jobInfo.jobId, pname, lang.hitch(this, lang.hitch(this, function(results) {this.gatherResults(results,i)})));
			     
			     }));	
			    
			   }));		   	
			      
		   },
		   
		   
		   gatherResults: function(results,i) {
			
			 //console.log(this.processedResults);
			 
			 this.processedResults = this.processedResults + 1;
			 
			 this.outputs[i][results.paramName].results = results;
	
			 if (this.processedResults == 8) {
			 
			 	//alert(this.map.graphicsLayerIds);
			 	
				 mbres = query("#" + this.domNode.id + " .mbResults")[0];
				 resultWidget = new mbResult({map:this.map,inputLayer:[this.inputLayer0,this.inputLayer1],resultSet:this.outputs,stype:this.stype,label:[this.inputLabel0,this.inputLabel1]}).placeAt(mbres);
				 
				 console.log(this.outputs)
				 this.hidesteps("all");
			 }
			   
		   }

        });
});




var pad = function(num, totalChars) {
    var pad = '0';
    num = num + '';
    while (num.length < totalChars) {
        num = pad + num;
    }
    return num;
};

// Ratio is between 0 and 1
var changeColor = function(color, ratio, darker) {
    // Trim trailing/leading whitespace
    color = color.replace(/^\s*|\s*$/, '');

    // Expand three-digit hex
    color = color.replace(
        /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
        '#$1$1$2$2$3$3'
    );

    // Calculate ratio
    var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
        // Determine if input is RGB(A)
        rgb = color.match(new RegExp('^rgba?\\(\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '\\s*,\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '\\s*,\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '(?:\\s*,\\s*' +
            '(0|1|0?\\.\\d+))?' +
            '\\s*\\)$'
        , 'i')),
        alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

        // Convert hex to decimal
        decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
            /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
            function() {
                return parseInt(arguments[1], 16) + ',' +
                    parseInt(arguments[2], 16) + ',' +
                    parseInt(arguments[3], 16);
            }
        ).split(/,/),
        returnValue;

    // Return RGB(A)
    return !!rgb ?
        'rgb' + (alpha !== null ? 'a' : '') + '(' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
            ) +
            (alpha !== null ? ', ' + alpha : '') +
            ')' :
        // Return hex
        [
            '#',
            pad(Math[darker ? 'max' : 'min'](
                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
            ).toString(16), 2),
            pad(Math[darker ? 'max' : 'min'](
                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
            ).toString(16), 2),
            pad(Math[darker ? 'max' : 'min'](
                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
            ).toString(16), 2)
        ].join('');
};
var lighterColor = function(color, ratio) {
    return changeColor(color, ratio, false);
};
var darkerColor = function(color, ratio) {
    return changeColor(color, ratio, true);
};

function polygonArea(ptevs) 
{
  numPoints = ptevs.length;
  area = 0;         // Accumulates area in the loop
  j = numPoints-1;  // The last vertex is the 'previous' one to the first

  for (i=0; i<numPoints; i++)
    { 
      area = area +  (ptevs[j].x+ptevs[i].x) * (ptevs[j].y-ptevs[i].y); 
      j = i;  //j is previous vertex to i
    }
  return Math.abs(area/2);
}

