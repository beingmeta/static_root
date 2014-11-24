/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var CodexStaticLayout=
    (function(){
	var fdjtDOM=fdjt.DOM, fdjtID=fdjt.ID, fdjtState=fdjt.State;
	var CodexLayout=fdjt.CodexLayout;
	var getStyle=fdjtDOM.getStyle;
	var getQuery=fdjtState.getQuery;
	var getGeometry=fdjtDOM.getGeometry;
	
	var pagerule, layout, content, page;

	function setupContent(){
	    var bodyclass=window.bodyclass;
	    if (bodyclass) document.body.className=((document.body.className)||"")+" "+bodyclass;
	    content=fdjt.ID("CODEXCONTENT");
	    if (content) 
		content.parentNode.removeChild(content);
	    else content=fdjtDOM("div#CODEXCONTENT");
	    var pages=fdjt.ID("CODEXPAGES");
	    if (pages) 
		pages.parentNode.removeChild(pages);
	    else pages=fdjtDOM("div#CODEXPAGES");
	    page=fdjtID("CODEXPAGE");
	    if (!(page)) page=fdjtDOM("div#CODEXPAGE");
	    else page.parentNode.removeChild(page);
	    setupPage();
	    var nodes=[], elts=[], children=document.body.childNodes;
	    var i=0, lim=children.length, block=false;
	    while (i<lim) nodes.push(children[i++]);
	    i=0; lim=nodes.length; while (i<lim) {
		var child=nodes[i++], style=false;
		if (child.nodeType===1) style=getStyle(child);
		if ((child.nodeType===3)||
		    ((style)&&((style.display==='inline')||
			       (style.display==='inline-block')))) {
		    if (block) block.appendChild(child);
		    else {
			var block=fdjtDOM("div");
			child.parentNode.replaceChild(block,child);
			block.appendChild(child);}}
		else if (block) {
		    elts.push(block);
		    elts.push(child);}
		else elts.push(child);}
	    document.body.innerHTML="";
	    i=0; lim=nodes.length;
	    while (i<lim) content.appendChild(nodes[i++]);
	    document.body.appendChild(page);
	    document.body.appendChild(content);
	    document.body.appendChild(pages);
	    return nodes;}

	function scale_oversize(){}
	
	function setupPage(){
	    if (getQuery("format")) {
		var fmt=getQuery("format");
		fdjtDOM.addClass(document.body,"_"+fmt.toUpperCase());
		return;}
	    else if ((getQuery("width"))&&(getQuery("height"))) {
		page.style.width=getQuery("width");
		page.style.height=getQuery("height");}
	    else fdjtDOM.addClass(document.body,"cxELASTIC");}

	function doLayout(){
	    var nodes=setupContent();
	    var pages=fdjtID("CODEXPAGES");
	    var geom=getGeometry(page,false,true);
	    var xwidth=geom.width, xheight=geom.height;
	    var width=geom.inner_width, height=geom.inner_height;
	    fdjt.Log("Geometry: %j",geom);
	    pagerule=fdjtDOM.addCSSRule(
		"div.codexpage",
		("width: "+geom.width+"px; "+"height: "+geom.height+"px; "));
	    fdjtDOM.addClass(document.body,"cxLAYOUT");
	    layout=new CodexLayout(
		{container: pages,page_width:width,page_height:height,
		 pagerule:pagerule});
	    var i=0, lim=nodes.length;
	    while (i<lim) {
		var node=nodes[i++];
		layout.addContent(node);}
	    setOffsets(layout,geom.height);
	    addPageNumbers(layout);
	    fdjtDOM.dropClass(document.body,"cxLAYOUT");
	    if (fdjtState.getQuery("debug"))
		fdjtDOM.addClass(document.body,"cxDEBUGLAYOUT");}

	function addPageNumbers(layout){
	    var pages=layout.pages;
	    var i=0, lim=pages.length;
	    while (i<lim) {
		var page=pages[i++];
		// fdjt.Log("Page %d: %j",i,getGeometry(page));
		var pagenum=page.getAttribute("data-pagenum");
		if (!(pagenum)) continue;
		page.appendChild(
		    fdjtDOM("span.codexpagenumber",pagenum));}}

	function setOffsets(layout,height){
	    var pages=layout.pages;
	    var i=0, lim=pages.length;
	    while (i<lim) {
		var page=pages[i++], style=page.style;
		style.position='absolute';
		style.top=((i-1)*height)+"px";}}
	/*
	function setOffsets(layout,height){
	    var pages=layout.pages;
	    var i=0, lim=pages.length;
	    while (i<lim) {
		var page=pages[i++], style=page.style;
		style.position='static';}}
	*/

	function updateLayout(){
	    if (!(layout)) doLayout();
	    else {
		var geom=getGeometry(page,false,true);
		var width=geom.inner_width, height=geom.inner_height;
		var pages=fdjtDOM("div#CODEXPAGES");
		var cur=fdjtID("CODEXPAGES");
		cur.parentNode.replaceChild(pages,cur);
		layout.Revert();
		fdjtDOM.addClass(document.body,"cxLAYOUT");
		pagerule.style.width=width+"px";
		pagerule.style.height=height+"px";
		layout=new CodexLayout(
		    {container: pages,page_width:width,page_height:height,
		     pagerule: pagerule});
		var children=content.childNodes, nodes=[];
		var i=0, lim=children.length;
		while (i<lim) nodes.push(children[i++]);
		i=0; lim=nodes.length; while (i<lim) {
		    layout.addContent(nodes[i++]);}
		addPageNumbers(layout);
		fdjtDOM.dropClass(document.body,"cxLAYOUT");}}

	var resize_timeout=false;
	function resize_handler(evt){
	    if (resize_timeout) clearTimeout(resize_timeout);
	    resize_timeout=setTimeout(function(){
		resize_timeout=false;
		updateLayout();},1000);}
	
	if (!(window.phantomJS)) {
	    fdjtDOM.addListener(window,"load",function(evt){
		doLayout();
		fdjtDOM.addListener(window,"resize",resize_handler);});}
	else fdjtDOM.addListener(window,"load",function(evt){doLayout();});

	window.doLayout=doLayout;
	window.updateLayout=updateLayout;

	if (getQuery("tracelevel")) {
	    var tl=parseInt(getQuery("tracelevel"));
	    if (typeof tl === "number") fdjt.CodexLayout.tracelevel=tl;}

	return {init: doLayout,
		update: updateLayout,
		getPagerule: function(){return pagerule;},
		getLayout: function(){return layout;}};})();
