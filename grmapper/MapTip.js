

define([
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/MapTip.html", 
	"dojo/dom-style", 
	"dojo/dom-class", 
	"dojo/_base/fx", 
	"dojo/_base/lang", 
	"dojo/on", 
	"dojo/mouse", 
	"dojo/query",
	"bootstrap/Tooltip",
	"bootstrap/Popover",
	"dojo/dom-geometry"
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
    	Tooltip,
    	Popover,
    	domGeom
    	){
        return declare([WidgetBase, TemplatedMixin], {
            // Some default values for our author
            // These typically map to whatever you're handing into the constructor
            name: "No Name",
            // Using require.toUrl, we can get a path to our AuthorWidget's space
            // and we want to have a default avatar, just in case
            //avatar: require.toUrl("custom/AuthorWidget/images/defaultAvatar.png"),
            bio: "",
 
            locked: true,
            // Our template - important!
            templateString: template,
 
            // A class to be applied to the root node in our template
            baseClass: "maptip",
 
            maptipson: true,
            
            defaultTitle: "Map Navigation (Pan and Zoom)",
            
            defaultText: "Click and drag the map to pan (move the extent of the map).  To zoom in or out click the +/- symbols above or hold the shift key down while dragging a rectangle.",
            
            
            postCreate: function(){
			    // Get a DOM node reference for the root of our widget
			    var domNode = this.domNode;
			   
			 
			    // Run any parent postCreate processes - can be done at any point
			    this.inherited(arguments);	          


		   },
		   
		   startup: function() {
	             
			 this.map.reposition();
			 
			 this.inherited(arguments);
			 
			 query('.esriSimpleSliderIncrementButton').popover({title:"Zoom In",placement:"top",trigger:"hover",content:"Click this button to zoom the map in (i.e. show less area).  You can also hold the shift key down and drag a rectangle on the map to zoom in to a specific area."})
	         query('.esriSimpleSliderDecrementButton').popover({title:"Zoom Out",placement:"bottom",trigger:"hover",content:"Click this button to zoom the map out (i.e. show more area)."})
	         

	      this.setContent();
	      	      
	        
          tooltiper = this.domNode;
          
          //dojo.style(tooltiper, "position", "fixed");
          
         
          
/*           // update the tooltip as the mouse moves over the map
          dojo.connect(this.map, "onMouseMove", this, function(evt) {
          
          	// dojo.style(tooltiper, "display", "");
          	obj = domGeom.position(this.map.id);
          	
          	if (this.maptipson == true) {
            var px, py;        
            if (evt.clientX || evt.pageY) {
              px = evt.clientX;
              py = evt.clientY;
            } else {
              px = evt.clientX + dojo.body().scrollLeft - dojo.body().clientLeft;
              py = evt.clientY + dojo.body().scrollTop - dojo.body().clientTop;
            }
                           
            // dojo.style(tooltip, "display", "none");
            //tooltiper.style.display = "none";
            
            if (this.locked != true) {
                dojo.style(tooltiper, { left: (px-250) + "px", top: (py-160) + "px" });
            }
            
            // dojo.style(tooltip, "display", "");
            //tooltiper.style.display = "";
            // console.log("updated tooltip pos.");

            b = baseFx.animateProperty({
				   		node: this.domNode,
				   		//onEnd: lang.hitch(this, function() {}),
				   		properties: {
					   		opacity: { start: 0.8, end: 0 }
					   		},
					   		duration: 1000
			});            
           
            
            a = baseFx.animateProperty({
				   		node: this.domNode,
				   		onEnd: lang.hitch(this, function() {b.play()}),
				   		properties: {
					   		opacity: { start: 0.9, end: 0.9 }
					   		},
					   		duration: 3000
			});
			
			
			a.play();
            
            
            }
          });

         
          // hide the tooltip the cursor isn't over the map
          dojo.connect(this.map, "onMouseOut", function(evt){
            dojo.style(tooltiper, "opacity", 0.0);
          });
      */
           
           this.map.tip = this;   
			 

		   },
		   
		   hide: function() {
		   
		   tooltiper = this.domNode;
		     
		   b = baseFx.animateProperty({
				   		node: this.domNode,
				   		onEnd: lang.hitch(this, function() {tooltiper.style.display = "none";}),
				   		properties: {
					   		opacity: { start: 0.8, end: 0 }
					   		},
					   		duration: 1000
			}); 
			
			b.play();
		   
		   },
		   
		   show: function() {
		   
		   
		   tooltiper = this.domNode;
		   
		   tooltiper.style.display = "";
		   
		   b = baseFx.animateProperty({
				   		node: this.domNode,
				   		//onEnd: lang.hitch(this, function() {tooltiper.style.display = "none";}),
				   		properties: {
					   		opacity: { start: 0, end: 0.8 }
					   		},
					   		duration: 1000
			}); 
			
			b.play();
		   
		   },
		   
		   setContent: function(content) {
		   
		     	  titdiv = query("#" + this.domNode.id + " .popover-title");
		   	      this.title = titdiv[0];
		   	      
		   	      textdiv = query("#" + this.domNode.id + " .popover-content");
		   	      this.text = textdiv[0];
	      
		   
		   		  if (content == undefined) {
			   		  
			   		  this.title.innerHTML = this.defaultTitle;
			   		  this.text.innerHTML = this.defaultText;
			   		  
		   		  } else {
		   
		   	      	this.title.innerHTML = content.title;
		   	      	this.text.innerHTML = content.text;
	      
		   	      }
			   
		   }
		   
		 

        });
});