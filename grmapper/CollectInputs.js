//

define([
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/CollectInputs.html", 
	"dojo/dom-style", 
	"dojo/dom-class", 
	"dojo/_base/fx", 
	"dojo/_base/lang", 
	"dojo/on", 
	"dojo/mouse", 
	"dojo/query",  
	"esri/layers/graphics", 
	"esri/tasks/gp", 
	"esri/tasks/geometry",
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
	"dojo/Evented"
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
    on, 
    mouse, 
    query, 
    esrigraphics, 
    esrigp,
    esrigeometryserv, 
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
    Evented
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
            
            stepNumber: 1,
            
            another: "a",
            
            symbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 250, 30]), 2), new dojo.Color([230, 230, 20, 0.25])),
 
            // A reference to our background animation
            mouseAnim: null,
            
            inputLayer: null,
            
            landCoverClasses: {"1":{title:"Urban, Highways",lctype:"Other"},"2":{title:"Developed, Herbaceous",lctype:"Other"},"3":{title:"Agriculture",lctype:"Other"},"4":{title:"Forest",lctype:"Natural"},"5":{title:"Wetland",lctype:"Natural"},"6":{title:"Open Water",lctype:"Natural"},"7":{title:"Bare Earth, Shore",lctype:"Natural"},"8":{title:"Unclassified",lctype:"Other"}},
            
            destroy: function(){
  	   
	//		 item = this.domNode;
	
	//			if (this.inputLayer != undefined) {   	
	//		 	 this.map.removeLayer(this.inputLayer);
	//		 	}
			 	
	//			if (this.UnitClickHandle != undefined) {   	
	//		 	 this.map.removeLayer(this.UnitClickHandle);
	//		 	}	
	
			 	if (this.inputLayer.type == undefined) {
			 		this.inputLayer.clear(); 
			 		this.inputLayer.redraw(); 			 		 	
			 	} else {
			 		this.inputLayer.clearSelection(); 
			 		this.inputLayer.redraw(); 
			 	}
	     

		   		if (this.UnitMapService != undefined) {   	
			 	 this.map.removeLayer(this.UnitMapService);
			 	}
			 		
			   	dojo.disconnect(this.UnitClickHandle);
		   		dojo.disconnect(this.clicklisten);
		   		
		    this.inherited(arguments);
		   	  	
            },
            
            postCreate: function(){
            
			    // Get a DOM node reference for the root of our widget
			    var domNode = this.domNode;

			    // Run any parent postCreate processes - can be done at any point
			    
			    this.inherited(arguments);
			    
			    
		   },
		   
		   startup: function() {
		   			                	
			    if (this.stepNumber > 1) {
				    this.another = "<i>another</i>"
			    }
			   
			  //classtoADD = "step-startingCLASS" + this.stepNumber; 
			  //step1s = query("#" + this.domNode.id + " .step-step1")[0];
			  //domClass.add(step1s, classtoADD);
			  
			  //this.hidesteps(classtoADD);
			  
			  this.geomserver = new esri.tasks.GeometryService("http://maps.usm.edu:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");
			    
			  itext = query("#" + this.domNode.id + " .introText")[0];

			  itext.innerHTML = '<span class="badge badge-inverse">' + this.stepNumber + '</span> Choose ' + this.another 
			  
			  numText = query("#" + this.domNode.id + " .secondNumber");
			  
			  outnum = this.stepNumber + 1;
			  numText[0].innerHTML = outnum;
			  numText[1].innerHTML = outnum;
			   
		   	this.inherited(arguments);
		   		   
		     query("#" + this.domNode.id + " a").onclick(function(e){
	           e.preventDefault(); 
	           });
	             
			 
			 this.map.reposition();
			
			 
			 clearfeats = query("#" + this.domNode.id + " .clearfeatures");
			 on(clearfeats, "click", lang.hitch(this,this.clearmap));
			 
			 
			 usesites = query("#" + this.domNode.id + " .usesite");			 
			 on(usesites[0], "click", lang.hitch(this,this.dosite, {data:"out"})); 
			 
			 usepolys = query("#" + this.domNode.id + " .usepoly");
			 
			 //on(usepolys[0], "click", lang.hitch(this,this.dopoly));
			 dojo.forEach(usepolys, lang.hitch(this,function(item, i){
			 	on(item, "click", lang.hitch(this,this.dopoly,item)); 
			 }));
			 
			 //subfeats = query("#" + this.domNode.id + " .submit-features");
			 //on(subfeats[0], "click", lang.hitch(this,this.submitFeatures)); 
			 //on(subfeats[0], "click", lang.hitch(this,this.complete));
			 
			 subfeats = query("#" + this.domNode.id + " .submit-features");
			 //on(subfeats[0], "click", lang.hitch(this,this.submitFeatures2));
			 on(subfeats, "click", lang.hitch(this,this.complete));
			 
		   },
		   
		   complete: function() {
			 
			  	if (this.toolbar != undefined) {
			  	this.toolbar.deactivate(); }
		   		
		   		this.map.tip.setContent()
		   		
		   		dojo.disconnect(this.UnitClickHandle);
		   		dojo.disconnect(this.clicklisten);
		   	
		   	
		   		if (this.UnitMapService != undefined) {   	
			 	 this.map.removeLayer(this.UnitMapService);
			 	}		

			  this.emit("finished", {inputLayer:this.inputLayer}); 
			  
			  this.hidesteps("all"); 
			  
			   
		   },
		   
		   clearmap: function() {
			 
			 	//this.inputLayer.clear(); 
			 	//this.inputLayer.redraw(); 
			 	if (this.inputLayer.type == undefined) {
			 		this.inputLayer.clear(); 
			 		this.inputLayer.redraw(); 			 		 	
			 	} else {
			 		this.inputLayer.clearSelection(); 
			 		this.inputLayer.redraw(); 
			 	}
			   
		   },
		   
		   _close: function() {
            
           //this.map.removeLayer(this.inputLayer);
           
           //this.destroy();
			   
			   
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
		   
		   dopoly: function(item) {
		   
		   	//alert(item.rel)
		   	this.hidesteps("step-step2area")
		   	
		   	this.UnitMapService = new esri.layers.ArcGISDynamicMapServiceLayer("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/Units/MapServer",
		   		{useMapImage:true});
		   		
		   	this.UnitMapService.setVisibleLayers([item.rel])
		   	
		   	this.map.addLayer(this.UnitMapService);
		   	
		   	this.inputLayer = new esri.layers.FeatureLayer("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/Units/MapServer/" + item.rel,{
			   						mode:esri.layers.FeatureLayer.MODE_SELECTION
			   						});

		   	symbol = this.symbol;
		   				   						
			this.inputLayer.setSelectionSymbol(symbol)
			   						
			this.map.addLayer(this.inputLayer);
			
			this.UnitClickHandle = dojo.connect(this.map,"onClick", this, this.SelectUnit);
			   				
		   
		   },
		   
	SelectUnit: function(evt) {
	

	      var query = new esri.tasks.Query();
		  
		  toleranceInPixel = 1;
		  point = evt.mapPoint;
		  var pixelWidth = this.map.extent.getWidth() / this.map.width;
       	  var toleraceInMapCoords = toleranceInPixel * pixelWidth;
		  query.geometry = new esri.geometry.Extent(point.x - toleraceInMapCoords,
                    point.y - toleraceInMapCoords,
                    point.x + toleraceInMapCoords,
                    point.y + toleraceInMapCoords,
                    this.map.spatialReference );
                    
           
		  //query.where = this.maplayer.layerDefinitions[1];	
          
		  thing = this;
		  
          this.inputLayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_ADD,function(f,sm) {thing.featureSelector(f,sm,thing)});
			 
			 
			 //alert(evt.mapPoint)  
			   
		},
		 
		   
	featureSelector: function(features, selectionMethod) {
		
		//alert(features)
		//this.removeAll();
		
		//feats = this.featureLayer.getSelectedFeatures()
		
	},
		   
		   dosite: function(e) {
		   
		   	 var layerDefinition = {
				  "geometryType": "esriGeometryPolygon",
				  "fields": [{
				    "name": "Name",
				    "type": "esriFieldTypeString",
				    "length": 200
				  }]
				} 
				var featureCollection = {
				  layerDefinition: layerDefinition,
				  featureSet: null
				};
				this.inputLayer = new esri.layers.FeatureLayer(featureCollection, {
				  mode: esri.layers.FeatureLayer.MODE_SNAPSHOT
				});
			 
			 //this.inputLayer = new esri.layers.GraphicsLayer();
			 this.map.addLayer(this.inputLayer);
		   	
		   	this.map.tip.setContent({title:"Click to draw a polygon on the map",text:"Click a location on the map to start drawing a polygon shape that represents the site you would like to create.  You will click the map several times each click will be a vertex on polygon.  Map navigation (pan and zoom) continue to work as normal."})
		   	
		   	this.hidesteps("step-step2site")

		   	this.toolbar = new esri.toolbars.Draw(map);

		   	this.toolbar.activate(esri.toolbars.Draw.POLYGON, {showTooltips:true});
		   	
		   	//on(this.toolbar, this.toolbar.onDrawEnd, function() {alert('')});
		   	
		   	//dojo.connect(this.toolbar, "onDrawEnd", this, this.addToMap);
		   	
		   	dojo.connect(this.toolbar, "onDrawEnd", this, this.addToMap);
		   	
		   	this.clicklisten = dojo.connect(map, "onClick", this, this.addPoint);
		   	
		   	this.clicks = [];
			   
			   
		   },
		   
		   
		   addPoint: function(evt) {

		   	this.map.tip.setContent({title:"Click to add another vertex to your site polygon.",text:"Click on another location that represents another vertex on the site polygon you are drawing.  When you are done drawing the polygon <b>double click to finish</b> it."})
		   			   
		   	this.clicks.push(evt.mapPoint)
		   	//console.log(evt.mapPoint);
		   	
		   	if (this.clicks.length > 2) {
		   	
		   	   parea = polygonArea(this.clicks);
		   	   
		   	   poly = new esri.geometry.Polygon(new esri.SpatialReference({wkid:102100}));

		   	   poly.addRing(this.clicks);

		   	   outSR = new esri.SpatialReference({wkid:3174});
		   	   
		   	   params = new esri.tasks.ProjectParameters();
		   	   params.geometries = this.clicks; //poly;
		   	   params.outSR = outSR;
		   	   //params.transformation = transformation;
		   	   this.geomserver.project(params, lang.hitch(this, function(outpoly) {
		   	   
		   	   
		   	   						parea = (polygonArea(outpoly))
		   	   						
		   	   						harea = parea / 10000;
		   	   
		   	   						acres = parea / 4046.86;
			   	
		   	   						areatext = "  <br>The area of the polygon you are currently drawing is: " + harea.toFixed(2) + " ha or " + acres.toFixed(2) + " acres";	
			   
		   	   						this.map.tip.setContent({title:"Click to add another vertex to your site polygon.",text:"Click on another location that represents another vertex on the site polygon you are drawing.  When you are done drawing the polygon <b>double click to finish</b> it." + areatext})
			   
		   	   						
		   	   						}));
		   	   
		   	   
			   
			   	
		   	}
	
		   
		   },
		   
		   addToMap: function(geometry) {
		   
		   	this.clicks = [];
		   
		   	this.map.tip.setContent({title:"Submit Site, or draw <i>another</i> polygon on the map",text:"If you would like you can draw multiple polygons on the map to represent a single non-continuous site.  If you are <b>done</b>, just click the <b>submit</b> button above.  Map navigation (pan and zoom) continue to work as normal."})
		   	
		   	
		   	symbol = this.symbol;
		   	
		   	
		   	graphic = new esri.Graphic(geometry, symbol);
		   	graphic.setAttributes( {"Name":"UserPolygon"});
		   	this.inputLayer.add(graphic);		   	
		   	
		   },
		   
		   
		   changecheck: function(e,cb) {
			   
			   cbs = dojo.query(cb).children();
			   
			   if (cbs[0].checked == true) {
				   
				   this.inputLayer.show()
				   
			   } else {
				   
				   this.inputLayer.hide() 
			   }
			   
		   }
		   


        });
});



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

