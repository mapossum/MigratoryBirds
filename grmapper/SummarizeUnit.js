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
            baseClass: "summarizeunit",
            
            stype: "none",
 
            // A reference to our background animation
            mouseAnim: null,
            
            inputLayer: null,
            
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
		   
		   	this.inherited(arguments);
		   		   
		     query("#" + this.domNode.id + " a").onclick(function(e){
	           e.preventDefault(); 
	           });
	             
			 
			 this.map.reposition();
			 

			 this.map.tip.setContent({title:"Select a Summary Level Above", text: "There is nothing to do on the map now.  You will be able to choose a location to summarize after you choose an option form the Summary Level dropdown.  Map navigation (pan and zoom) continue to work as normal."});
			 
			 
			 colInputs = query("#" + this.domNode.id + " .collectInputs")[0]
			 
			 sy = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 250, 30]), 2), new dojo.Color([230, 230, 20, 0.25]))
			 
			 inputCollector = new CollectInputs({map:this.map,symbol:sy}).placeAt(colInputs);
			 
			 on(inputCollector, "finished", lang.hitch(this,this.submitFeatures));

			 //colInputs = query("#" + this.domNode.id + " .collectInputs")[1]
			 
			 //sy = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 20, 30]), 2), new dojo.Color([230, 20, 20, 0.25]))
			 
			 //inputCollector = new CollectInputs({map:this.map,symbol:sy}).placeAt(colInputs);
			 
			 //on(inputCollector, "finished", lang.hitch(this,this.submitFeatures));
			 
			 
		   },

		   
		   _close: function() {
            
              if (this.inputLayer != undefined) {
           		this.map.removeLayer(this.inputLayer);
           		}
  
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
		   
		   
		   changecheck: function(e,cb) {
			   
			   cbs = dojo.query(cb).children();
			   
			   if (cbs[0].checked == true) {
				   
				   this.inputLayer.show()
				   
			   } else {
				   
				   this.inputLayer.hide() 
			   }
			   
		   },
		   	   
		   submitFeatures: function(e) {

				//alert(e.label);
				
				this.inputLabel = e.label;
		   
		   		this.inputLayer = e.inputLayer;
		   		
		   		this.container.processAnimationStart();
		   
		   	 	this.hidesteps("step-processing");
		   	 	
		   	 	if (this.inputLayer.mode == esri.layers.FeatureLayer.MODE_SELECTION) {
			   	   features = this.inputLayer.getSelectedFeatures();	
		   	 	} else {
				   features = this.inputLayer.graphics;
				}
		        //features.push(graphic);
		        featureSet = new esri.tasks.FeatureSet();
		        featureSet.features = features;
		
		        params = {"InputFeatures": featureSet};
		        
		        
		        this.gp.submitJob(params, lang.hitch(this,this.getOutputs));
		        
		        
		        FeatureExtent = esri.graphicsExtent(features);
		
		        this.map.setExtent(FeatureExtent, true);
				
				//this.gp.execute(params, function(result, mess) {thing.displayTable(result,thing)}, function(error){alert(error)}) 	
		   
		   },
		   
		   getOutputs: function(jobInfo) {
		   
		   	   this.container.processAnimationEnd("success")
		   	 
		   	   //this.container.mouseBackgroundColor = "rgb(70,136,71)";
		   	   //this.container.baseBackgroundColor = "rgb(236, 252, 236)";
			   
			   //Change these functions up!!!
			   
			   
			 //query("#" + this.domNode.id + " ." + this.stype + "Results").show()
			   
			   if (this.stype == "model") {
			   		displayFunction = this.displayModelResults;
			   	} else {
			   		displayFunction = this.displayHabitatResults;
			   		}
			   		
			  console.log(jobInfo.jobId);
			   		
			 functional.forIn(this.outputs, lang.hitch(this,function(outp,pname){
			     
			   this.gp.getResultData(jobInfo.jobId, pname, lang.hitch(this, this.gatherResults))
			  
			   								//		lang.hitch(this, function(results) { 
				   
				   //results.habtable = outp.habtable;
				   //a = lang.hitch(this, displayFunction, results, outp.color);
				   
				   //a();
				   
			    }));			   

			   
			//   }));		
			      
		   },
		   
		   
		   gatherResults: function(results) {
			
			 console.log(this.processedResults);
			 
			 this.processedResults = this.processedResults + 1;
			 
			 this.outputs[results.paramName].results = results;
	
			 if (this.processedResults == 4) {
				 
				 mbres = query("#" + this.domNode.id + " .mbResults")[0];
				 resultWidget = new mbResult({map:this.map,inputLayer:this.inputLayer,resultSet:this.outputs,stype:this.stype, label:this.inputLabel}).placeAt(mbres);
				 
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

