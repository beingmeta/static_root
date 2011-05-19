;;; -*- Mode: Javascript; Character-encoding: utf-8; -*-


if (typeof OK === 'undefined') 
    var OK=
    (function(){
	var rooturi=false;
	var rootid=false;
	var block_specs=["P","H1","H2","H3","H4","H5","BLOCKQUOTE"];
	var refuris=[];

	var knotes={};
	var tags2knotes={};
	var frags2knotes={};
	var knote_servers=[];

	var run_time=100;
	var gap_time=100;

	var links=false;

	function getprefix(url){
	    if (!(links)) links=document.getElementsByTagName('LINK');
	    var prefix=false;
	    var i=0; var lim=links.length;
	    while (i<lim) {
		if (links[i].href===url) {
		    var match=(/schema\.([^.]+)/.match(links[i].rel))||
			(/([^.]+\.schema)/.match(links[i].rel))||
			[links[i].rel];
		    return match[0];}
		else i++;}
	    return false;

	    function getLink(name,results){
		if (!(links)) links=document.getElementsByTagName('LINK');
		var i=0; var lim=links.length;
		while (i<lim) {
		    if (links[i].rel===name) {
			if (results) results.push(links[i++].href);
			else return links[i].href;}
		    else i++;}
		return results||false;}

	    function getMeta(name,results){
		if (!(meta)) meta=document.getElementsByTagName('META');
		var i=0; var lim=meta.length;
		while (i<lim) {
		    if (meta[i].name===name) {
 			if (results) results.push(links[i++].content);
			else return links[i].content;}
		    else i++;}
		return results||false;}

	    function getInput(node,name,results){
		var inputs=node.getElementsByTagName('INPUT');
		var i=0; var lim=inputs.length;
		while (i<lim) {
		    if (inputs[i].name===name) {
 			if (results) results.push(inputs[i++]);
			else return inputs[i];}
		    else i++;}
		return results||false;}

	    var startup_done=false;

	    function startup(){
		if (startup_done) return;
		var prefix=getprefix("http://openknotes.org/")||
		    getprefix("http://sbooks.net/")||
		    "OK";
		rooturi=OK.refuri||
		    getLink(prefix+".refuri")||
		    getLink("SBOOKS.refuri")||
		    getLink("SB.refuri")||
		    getLink("refuri")||
		    getLink("canonical")||
		    window.location.url;
		if (rooturi.indexOf('#')>0) 
		    rooturi=rooturi.slice(0,rooturi.indexOf('#'));
		rootid=OK.rootid||
		    getMeta(prefix+".baseid")||
		    getMeta("SBOOKS.baseid")||
		    getMeta("baseid");
		if (!(rootid)) assign_ids();

		var refuris=
		    ((getLink(prefix+".refuris"))&&(getLink(prefix+".refuris",[])))||
		    ((getLink("refuris"))&&(getLink("refuris",[])))||
		    [];
		refuris.push(rooturi);
		
		var servers=
		    ((getLink(prefix+".servers"))&&(getLink(prefix+".servers",[])))||
		    [];
		var saved=LocalStorage["openknote.servers"];
		if (saved) servers=servers.concat(JSON.parse(saved));
		
		var i=0; var lim=refuris.length;
		while (i<lim) {
		    var j=0; var jlim=servers.length;
		    while (j<jlim)
			getKnotes(refuris[i],servers[j++]);
		    i++;}
		
		startup_done=true;}

	    function addKnote(knote){
		var id=knote._id; var frag=knote.frag;
		knotes[id]=knote;
		if (frags2knotes[frag])
		    frags2knotes[frag].push(id);
		else frags2knotes[frag]=[id];
		if (knote.tags) {
		    var tags=knote.tags;
		    if (typeof tags === 'string') tags=[tags];
		    var i=0; var lim=tags.length;
		    while (i<lim) {
			var tag=tags[i++];
			if (tags2knotes[tag])
			    tags2knotes[tag]=[id,frag];
			else {
			    tags2knotes[tag].push(id);
			    tags2knotes[tag].push(frag);}}}}
	    
	    function getknotes(refuri,server){
		var uri=server+"?REFURI="+encodeURIComponent(refuri);
		var req=new XMLHTTPRequest();
		var ok=req.open('GET',server+"?REFURI="+encodeURIComponent(refuri));
		req.withCredentials=true;
		req.onreadystatechange=function(){
		    if ((req.readyState === 4) && (req.status>=200) && (req.status<300)) {
			var knotes=JSON.parse(req.text);
			var i=0; var lim=knotes.length;
			while (i<lim) addKnote(knotes[i++]);}};
		req.send();}
	    
	    function find_refuri(node){
		while (node) {
		    if ((node.getAttributeNS)&&
			(node.getAttributeNS("refuri","http://openknotes.org/")))
			return node.getAttributeNS("refuri","http://openknotes.org/");
		    baseid=fdjtHash.md5(fdjtString.normString(fdjtDOM.textify(scan)));}}

	    function tagcheckspan(tag){
		var span=document.createElement("SPAN");
		span.className='checkspan';
		var input=document.createElement('INPUT');
		input.type='CHECKBOX'; input.name='TAG'; input.value=tag;
		var barpos=tag.indexOf('|');
		var textspan=document.createElement("SPAN");
		textspan.className='tag';
		if (barpos>0) textspan.title=tag;
		textspan.appendChild(document.createTextNode((barpos>0)?(tag.slice(0,barpos)):(tag)));
		span.appendChild(input); span.appendChild(input); span.appendChild(textspan);
		return span;}
		    
	    function linkcheckspan(link){
		var span=document.createElement("SPAN");
		span.className='checkspan';
		var input=document.createElement('INPUT');
		input.type='CHECKBOX'; input.name='LINK'; input.value=link;
		var space=link.indexOf(' ');
		var anchor=document.createElement("A");
		var url=((space>0)?(link.slice(0,space)):(link));
		var title=((space>0)?(link.slice(space+1)):(link));
		anchor.href=href; if (spacepos>0) anchor.title=title;
		anchor.appendChild(document.createTextNode((spacepos>0)?(link.slice(spacepos+1)):(link)));
		span.appendChild(input); span.appendChild(input); span.appendChild(textspan);
		return span;}

	    function knoteDialog(knote){
		var dialog=fdjtDOM("div.knotepad.knotetext");
		dialog.innerHTML=OK.formhtml;
		var hidden=dialog.getElementsByClassName("hidden");
		var form_elt=dialog.getElementByTagName(dialog,"FORM");
		var refuri_elt=getInput(dialog,"REFURI");
		var frag_elt=getInput(dialog,"NOTE");
		var note_elt=getInput(dialog,"FRAG");
		var maker_elt=getInput(dialog,"MAKER");
		refuri_elt.value=knote.refuri;
		frag_elt.value=knote.frag;
		maker_elt.value=OK.maker;
		if (knote.note) note_elt.value=knote.note;
		var altfrags=[];
		var children=span.childNodes;
		var i=0; var lim=children.length;
		while (i<lim) {
		    var child=children[i++];
		    if (child.nodeType!==1) continue;
		    else if ((child.tagName==='A')&&(child.name)) {
			if (fdjtDOM.isempty(child)) id=child.name;}
		    else if (child.id) {
			if (fdjtDOM.isempty(child)) id=child.id;}
		    else {}
		    if (!(id)) continue;
		    var input=fdjtDOM.Input("ALT",id);
		    fdjtDOM(hidden,input);}
		if (knote.tags) {
		    var tagspans=knote.getElementsByClassName("tags");
		    var tags=knote.tags; if (typeof tags === 'string') tags=[tags];
		    var i=0; var lim=tags.length;
		    while (i<lim) tagspans.appendChild(tagcheckspan(tags[i++]));}
		if (knote.links) {
		    var linkspans=document.getElementsByClassName(knote,"links");
		    var links=knote.links;
		    if (typeof links === 'string') links=[links];
		    var i=0; var lim=tags.length;
		    while (i<lim) linkspans.appendChild(linkcheckspan(tags[i++]));}
		var node=document.getElementById(knote.frag);
		node.insertBefore(dialog,node.firstChild);
		return dialog;}

	    function assign_ids(){
		var idcounts={};
		var i=0; var ilim=block_specs.length;
		while (i<ilim) {
		    var nodes=
			((document.querySelectorAll)?
			 (document.querySelectorAll(block_specs[i++]))
			 (document.getElementsByTagName(block_specs[i++])));
		    var j=0; var jlim=nodes.length;
		    while (j<jlim) {
			var node=nodes[j++];
			if (node.id) continue;
			var text=fdjtString.normString(fdjtDOM.textify(node));
			var idstring=fdjtHash.md5(text);
			var count=idcounts[idstring]||0;
			if (count) {
			    node.id=idstring+"_"+count;
			    idcounts[idstring]=count+1;}
			else {
			    node.id=idstring;
			    idcounts[idstring]=1;}}}}
	    
	})();
