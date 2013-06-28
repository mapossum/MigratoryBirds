//

define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/SummarizeMap.html", "dojo/dom-style", "dojo/dom-class", "dojo/_base/fx", "dojo/_base/lang", "dojo/on", "dojo/mouse", "dojo/query", "esri/toolbars/Draw", "esri/layers/graphics", "esri/tasks/gp", "dojo/_base/array", "dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Default", "dojox/charting/plot2d/Bars", "dojox/charting/themes/Claro"],
    function(declare, WidgetBase, TemplatedMixin, template, domStyle, domClass, baseFx, lang, on, mouse, query, esridraw, esrigraphics, esrigp, array, Chart, axisDefault, plotDefault, Bars, ClaroTheme){
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
            baseClass: "summarizemap",
 
            // A reference to our background animation
            mouseAnim: null,
            
            inputLayer: null,
            
            toolbar: null,
 
            // Colors for our background animation
            baseBackgroundColor: "rgb(175, 205, 230)",
            mouseBackgroundColor: "rgb(0, 136, 204)",
            
            baseTextColor: "rgb(20, 20, 20)",
            mouseTextColor: "rgb(255, 255, 255)",
            
            expanded: true,
            
            destroy: function(){
            
  
					   	
			 item = this.domNode;
					   	
				b = baseFx.animateProperty({
				   		node: item,
				   		onEnd: lang.hitch(this, function(item) {domStyle.set(item, "display", "none");this.map.reposition();this.inherited(arguments);}),
				   		properties: {
					   		opacity: { start: 1, end: 0 }
					   		},
					   		duration: 400
					   	});
					   	
            	b.play();
            	
            },
            
            
            postCreate: function(){
			    // Get a DOM node reference for the root of our widget
			    var domNode = this.domNode;
			 
			    // Run any parent postCreate processes - can be done at any point
			    this.inherited(arguments);
			 
			    // Set our DOM node's background color to white -
			    // smoothes out the mouseenter/leave event animations
			    domStyle.set(domNode, "backgroundColor", this.baseBackgroundColor);
			    domStyle.set(domNode, "padding", "10px");
			    // Set up our mouseenter/leave events - using dojo/on
			    // means that our callback will execute with `this` set to our widget
			    
			    on(domNode, mouse.enter, lang.hitch(this,this._changeBackground));
			    
			    on(domNode, mouse.leave, lang.hitch(this,this._changeBackground));
			    
			    //alert(this.domNode.id)
			    
			    this.gp = new esri.tasks.Geoprocessor("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/SummarizeArea/GPServer/SummarizeArea");
			    //this.gp = new esri.tasks.Geoprocessor("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/SummarizeAreaSync/GPServer/SummarizeArea");
			    
		   },
		   
		   startup: function() {
		   
		     query("#" + this.domNode.id + " a").onclick(function(e){
	           e.preventDefault(); 
	           });
	             
			 
			 this.map.reposition();
			 
			 this.inputLayer = new esri.layers.GraphicsLayer();
			 
			 this.map.addLayer(this.inputLayer);
			 
			 usesites = query("#" + this.domNode.id + " .usesite")  
			 on(usesites[0], "click", lang.hitch(this,this.dosite, {data:"out"})); 
			 
			 subfeats = query("#" + this.domNode.id + " .submit-features");
			 on(subfeats[0], "click", lang.hitch(this,this.submitFeatures)); 
			 
			 minusbuts = query("#" + this.domNode.id + " .minimize");
			 on(minusbuts[0], "click", lang.hitch(this,this.minimize,minusbuts[0]));
			 
			 closebuts = query("#" + this.domNode.id + " .closeit");
			 on(closebuts[0], "click", lang.hitch(this,this.closeit));
			 
		   },
		   
		   closeit: function() {
		   
		   this.destroy();
			   
			   
		   },
		   
		   minimize: function(themin) {
		   
		   divInfo = dojo.position(this.domNode, true);
		   
		   item = query("#" + this.domNode.id + " .allContent")[0]	   
		   	 
			 if (this.expanded == true) {
			 
			 	//mic = query("#" + themin.id + " > .icon-minus")
			 	//mic.removeClass("icon-minus");
			 	//mic.addClass("icon-list");	
			 
			 	this.fullheight = divInfo.h;
			 	
			 	a = baseFx.animateProperty({
				   		node: this.domNode,
				   		onEnd: lang.hitch(this, function(item) {this.map.reposition();}),
				   		properties: {
					   		height: { start: divInfo.h-15, end: 21 }
					   		},
					   		duration: 400
					   	});
					   	
				b = baseFx.animateProperty({
				   		node: item,
				   		onEnd: lang.hitch(this, function(item) {domStyle.set(item, "display", "none");this.map.reposition();}),
				   		properties: {
					   		opacity: { start: 1, end: 0 }
					   		},
					   		duration: 600
					   	});


			    //domStyle.set(this.domNode, "height", "21px");
			    this.expanded = false;
			  } else {
			  
			 	//mic = query("#" + themin.id + " > .icon-list")
			 	//mic.removeClass("icon-list");
			 	//mic.addClass("icon-minus");	

			 	a = baseFx.animateProperty({
				   		node: this.domNode,
				   		onEnd: lang.hitch(this, function(item) {domStyle.set(this.domNode, "height", "auto"); this.map.reposition();}),
				   		properties: {
					   		height: { start: 21, end: this.fullheight - 15 }
					   		},
					   		duration: 400
					   	});
				
				domStyle.set(item, "display", "")
					   	
				b = baseFx.animateProperty({
				   		node: item,
				   		onEnd: lang.hitch(this, function(item) {domStyle.set(item, "display", "");this.map.reposition();}),
				   		properties: {
					   		opacity: { start: 0, end: 1 }
					   		},
					   		duration: 600
					   	});	   
								  
				 
				this.expanded = true; 
			  }
			  
			a.play();
			b.play();
			  
			//this.map.reposition();  
			   
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
		   
		   
		   dosite: function(e) {
		   
		   	//alert(e.data)
		   	
		   	this.hidesteps("step-step2site")
		   	
		   	this.toolbar = new esri.toolbars.Draw(this.map);
		   	
		   	this.toolbar.activate(esri.toolbars.Draw.POLYGON);
		   	
		   	//on(this.toolbar, "onDrawEnd", function(e) {alert(e)});
		   	dojo.connect(this.toolbar, "onDrawEnd", this, this.addToMap);
			   
			   
		   },
		   
		   
		   addToMap: function(geometry) {
		   	symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 250, 30]), 2), new dojo.Color([230, 230, 20, 0.25]));
		   	graphic = new esri.Graphic(geometry, symbol);
		   	this.inputLayer.add(graphic);		   	
		   	
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
		   
		   		this.processAnimationStart()
		   
		   	 	this.hidesteps("step-processing")
		   	 	this.toolbar.deactivate();
		   	 	
				features = this.inputLayer.graphics;
		        //features.push(graphic);
		        featureSet = new esri.tasks.FeatureSet();
		        featureSet.features = features;
		
		        params = {"InputFeatures": featureSet};
		        
		        thing = this;
		        
		        //runsub = dojo.hitch(this, this.gp.submitJob);
		        
		        //runsub(params, function(jobInfo) {this.getTable(jobInfo,this)} , function(jobInfo) {console.log(jobInfo.jobStatus)},function(error){alert(error);});
		        
		        this.gp.submitJob(params, function(jobInfo) {thing.getTable(jobInfo,thing)} , function(jobInfo) {console.log(jobInfo.jobStatus)},function(error){
		          alert(error);
		        });
				  
				//this.gp.execute(params, function(result, mess) {thing.displayTable(result,thing)}, function(error){alert(error)}) 	
		   
		   },
		   
		   getTable: function(jobInfo,thing) {
		   
		   	   this.processAnimationEnd()
		   	   
		   	   thing.mouseBackgroundColor = "rgb(70,136,71)",
		   	   thing.baseBackgroundColor = "rgb(236, 252, 236)",
			   
			   thing.gp.getResultData(jobInfo.jobId, "outputTable", function(result) {thing.displayTable(result,thing)}, function(error){alert(error)});
			   
		   },
		   
		   
		   displayTable: function(results, thing) {
		   
		   		//result = results[0];
		   		
		   		this.hidesteps("step-result")
			   
			   dataarray = []
			   labelarray = []
			   dojo.forEach(results.value.features, function(item, i){
				   		dataarray.push((item.attributes["Count"] * (30 * 30)) / 10000)
				   		labelarray.push({value:i+1, text:item.attributes["LandCover"]})
			   });
			   
			   //alert(labelarray.length)
			   
			   cloc = query("#" + thing.domNode.id + " .chartlocation");
			   
			   
			   var chart1 = new Chart(cloc[0], {stroke: "black"});
			   chart1.addPlot("default", { type: "Bars", gap: 2});
			   chart1.addAxis("x", {minorTicks: false});
			   chart1.addAxis("y", { vertical: true, leftBottom: true, labels: labelarray, minorTicks: false})
			   chart1.addSeries("Land Cover",dataarray);
			   //dojo.forEach(dataarray, function(item, i){
			   		//alert(labelarray[i].text)
			   	   //chart1.addSeries(labelarray[i].text,[item]);
			   	//});
			  // chart1.addPlot("grid", { type: "Grid" });
			  chart1.setTheme(ClaroTheme);
			   chart1.render();
			   
			   
			   
		   },
		   
		   _changeBackground: function(e) {
			    
		   
		   if (e.type == "mouseover") {
		    toCol = this.mouseBackgroundColor;
		    toCol2 = this.mouseTextColor;
		   } else {  
			toCol = this.baseBackgroundColor; 
			toCol2 = this.baseTextColor;
		   }
		   
		   titlenode = query("#" + this.domNode.id + "> h4")
		   
		   
		    // If we have an animation, stop it
		    if (this.mouseAnim) { this.mouseAnim.stop(); }
		 
		    // Set up the new animation
		    this.mouseAnim = baseFx.animateProperty({
		        node: this.domNode,
		        properties: {
		            backgroundColor: toCol
		        },
		        onEnd: lang.hitch(this, function() {
		            // Clean up our mouseAnim property
		            this.mouseAnim = null;
		        })
		    }).play();
		    
		    this.mouseAnim = baseFx.animateProperty({
		        node: titlenode[0],
		        properties: {
		            color: toCol2
		        },
		        onEnd: lang.hitch(this, function() {
		            // Clean up our mouseAnim property
		            this.mouseAnim = null;
		        })
		    }).play();
		  }


        });
});