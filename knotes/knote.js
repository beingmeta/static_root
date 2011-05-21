/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */


if (typeof OK === 'undefined') 
    var OK=
    (function(){
	var result={};
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
	var meta=false;
	
	function getschemaprefix(url){
	    if (!(links)) links=document.getElementsByTagName('LINK');
	    var prefix=false;
	    var i=0; var lim=links.length;
	    while (i<lim) {
		if (links[i].href===url) {
		    var match=(/schema\.([^.]+)/.exec(links[i].rel))||
			(/([^.]+\.schema)/.exec(links[i].rel))||
			[links[i].rel];
		    return match[0];}
		else i++;}
	    return false;}
	
	function getinfo(ref){
	    if (knotes[ref]) return knotes[ref];}

	function newNode(spec){
	    var dot=spec.indexOf('.');
	    var hash=spec.indexOf('#');
	    var elt=((dot>0)?(document.createElement(spec.slice(0,dot))):
		     (hash>0)?(document.createElement(spec.slice(0,hash))):
		     (document.createElement(spec)));
	    if (dot>0) {
		var classes=
		    ((hash>0)?(spec.slice(dot+1,hash)):(spec.slice(dot+1)));
		elt.className=classes.replace(/\./g,' ');}
	    if (hash>0) elt.id=spec.slice(hash+1);
	    if (arguments.length>1) {
		var i=1; var lim=arguments.length;
		while (i<lim) {
		    var arg=arguments[i++];
		    if (!(arg)) {}
		    else if (typeof arg === 'string')
			elt.appendChild(document.createTextNode(arg));
		    else if (arg.nodeType)
			elt.appendChild(arg);
		    else elt.appendChild(document.createTextNode
					 (arg.toString()));}}
	    return elt;}
	function newImage(src,classname){
	    var elt=document.createElement("IMG");
	    if (classname) elt.className=classname;
	    elt.src=src;
	    return elt;}

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

	function getParent(node,classname){
	    var classpat=new RegExp("\\b"+classname+"\\b");
	    while (node) {
		if ((node.className)&&(node.className.search(classpat)>=0))
		    return node;
		else node=node.parentNode;}}

	/* Startup */

	var startup_done=false;

	function startup(){
	    if (startup_done) return;
	    var prefix=getschemaprefix("http://openknotes.org/")||
		getschemaprefix("http://sbooks.net/")||
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
		[rooturi];
	    
	    var servers=
		((getLink(prefix+".server"))&&(getLink(prefix+".server",[])))||
		[];
	    var saved=localStorage["openknote.servers"];
	    if (saved) servers=servers.concat(JSON.parse(saved));
	    OK.servers=servers;
	    
	    var i=0; var lim=refuris.length;
	    while (i<lim) {
		var j=0; var jlim=servers.length;
		while (j<jlim)
		    getKnotes(refuris[i],servers[j++]);
		i++;}
	    
	    window.onclick=add_knote_handler;

	    startup_done=true;}
	result.startup=startup;
	
	function addKnote(knote,server){
	    var id=knote._id; var frag=knote.frag;
	    if (knotes[id]) return false;
	    knotes[id]=knote;
	    if (frags2knotes[frag])
		frags2knotes[frag].push(id);
	    else frags2knotes[frag]=[id];
	    if ((knote.maker)&&(typeof knote.maker !== 'string')&&
		(knote.maker._id)) {
		var id=knote.maker._id; knotes[id]=knote; knotes.maker=id;}
	    if (knote.tags) {
		var tags=knote.tags;
		if (typeof tags === 'string') tags=[tags];
		var i=0; var lim=tags.length;
		while (i<lim) {
		    var tag=tags[i++];
		    if (tags2knotes[tag]) {
			tags2knotes[tag].push(id);
			tags2knotes[tag].push(frag);}
		    else tags2knotes[tag]=[id,frag];}}
	    addKnote2DOM(knote,"div.knote",server);
	    return true;}
	result.addKnote=addKnote;

	function addKnote2DOM(knote,spec,server){
	    if (!(spec)) spec="div.knote";
	    var id=knote._id;
	    var elt=document.getElementById(id);
	    if (elt) return elt;
	    var node=getNode4Knote(knote);
	    if (!(node)) {
		fdjtLog("No node for %o",knote);
		return;}
	    var knoteselt=getKnotes4DOM(node);
	    var elt=Knote2DOM(knote,spec,server);
	    knoteselt.appendChild(elt);}
	
	function getNode4Knote(knote){
	    return document.getElementById(knote.frag);}
	
	function toggle_knotes(evt){
	    evt=evt||event;
	    var target=evt.target||evt.fromElt;
	    var knotes=getParent(target,"knotes");
	    if (!(knotes)) return;
	    else if (knotes.className.search(/\bexpanded\b/)>=0)
		knotes.className=knotes.className.replace(
			/\bexpanded\b/,"").replace(/\s$/,"");
	    else knotes.className=knotes.className+" expanded";}
	
	function getKnotes4DOM(node){
	    var knotesid="KNOTES4"+node.id;
	    var elt=document.getElementById(knotesid);
	    if (elt) return elt;
	    var asterisk=newNode("img.asterisk");
	    asterisk.src=
		"http://static.beingmeta.com/graphics/Asterisk32x32.png";
	    asterisk.alt="*";
	    elt=newNode("div.knotes",asterisk);
	    elt.id=knotesid;
	    asterisk.onclick=toggle_knotes;
	    node.parentNode.insertBefore(elt,node);
	    return elt;}

	function Knote2DOM(knote,spec,server){
	    var elt=newNode(spec);
	    var maker=knotes[spec.maker];
	    return newNode(
		spec,," ",
		((maker)&&(maker.pic)&&(newImage(maker.pic,"userpic"))),
		newNode("span.maker",((maker)?(maker.name):(spec.maker)))
		((knote.note)&&(newNode("span.knote",knote.note)))," ",
		((knote.tags)&&tagspan(knote.tags))," ",
		((knote.links)&&linkspan(knote.links)));}

	function tagspan(tags){
	    if (!(tags)) return false;
	    var tags=newNode("span.tags");
	    var i=0; var lim=tags.length;
	    while (i<lim) {
		tags.appendChild(newNode("span.tag",tags[i++]));
		tags.appendChild(document.createTextNode(" "));}
	    return tags;}

	function linkspan(links){
	    if (!(links)) return false;
	    var linkspan=newNode("span.links");
	    for (url in links) {
		var title=links[url];
		var anchor=newNode("A",title);
		anchor.href=url; anchor.title=url;
		linkspan.appendChild(anchor);
		linkspan.appendChild(document.createTextNode(' '));}
	    return links;}

	function getKnotes(refuri,server){
	    fdjtLog("Getting notes for %s from %s",refuri,server);
	    var uri=server+"?REFURI="+encodeURIComponent(refuri);
	    var req=new XMLHttpRequest();
	    var ok=req.open('GET',server+"?REFURI="+encodeURIComponent(refuri));
	    req.withCredentials=true;
	    req.onreadystatechange=function(){
		if ((req.readyState === 4) && (req.status>=200) && (req.status<300)) {
		    var knotes=JSON.parse(req.responseText);
		    var i=0; var lim=knotes.length;
		    fdjtLog("Got %d knotes",lim);
		    while (i<lim) addKnote(knotes[i++],server);}};
	    req.send();}
	
	function find_refuri(node){
	    var scan=node;
	    while (scan) {
		if ((scan.getAttributeNS)&&
		    (scan.getAttributeNS("refuri","http://openknotes.org/")))
		    return scan.getAttributeNS("refuri","http://openknotes.org/");
		else node=node.parentNode;}
	    return false;}

	function get_scopeuri(scan){
	    return ((scan.getAttributeNS)&&
		    (scan.getAttributeNS("refuri","http://openknotes.org/")))||
		((scan.getAttribute)&&(scan.getAttribute("data-refuri")))||
		((scan.getAttribute)&&(scan.getAttribute("refuri")));}

	function find_scope(node){
	    var scan=node;
	    while (scan) {
		if ((scan.nodeType===1)&&(get_scopeuri(scan)))
		    return scan;
		else scan=scan.parentNode;}
	    return false;}

	function find_passage(node,prefix,scope){
	    var scan=node;
	    while (scan) {
		if ((scan.id)&&((!(prefix))||(scan.id.search(prefix)===0)))
		    return scan;
		else if (scan===scope) return false;
		else scan=scan.parentNode;}
	    return false;}

	function tagcheckspan(tag){
	    var span=newNode("span.checkspan");
	    var input=newNode('input');
	    input.type='CHECKBOX'; input.name='TAG'; input.value=tag;
	    var barpos=tag.indexOf('|');
	    var textspan=newNode("span.tag");
	    if (barpos>0) textspan.title=tag;
	    textspan.appendChild(document.createTextNode((barpos>0)?(tag.slice(0,barpos)):(tag)));
	    span.appendChild(input); span.appendChild(input); span.appendChild(textspan);
	    return span;}
	
	function linkcheckspan(link){
	    var span=newNode("span.checkspan");
	    var input=newNode('input');
	    input.type='CHECKBOX'; input.name='LINK'; input.value=link;
	    var space=link.indexOf(' ');
	    var anchor=newNode("A");
	    var url=((space>0)?(link.slice(0,space)):(link));
	    var title=((space>0)?(link.slice(space+1)):(link));
	    anchor.href=href; if (spacepos>0) anchor.title=title;
	    anchor.appendChild(document.createTextNode((spacepos>0)?(link.slice(spacepos+1)):(link)));
	    span.appendChild(input); span.appendChild(input); span.appendChild(textspan);
	    return span;}

	function knoteDialog(knote){
	    var dialog=fdjtDOM("div.knotepad.knotetext");
	    dialog.innerHTML=OK.knotepad;
	    var hidden=dialog.getElementsByClassName("hidden")[0];
	    var form_elt=dialog.getElementsByTagName(dialog,"FORM")[0];
	    var refuri_elt=getInput(dialog,"REFURI");
	    var frag_elt=getInput(dialog,"FRAG");
	    var maker_elt=getInput(dialog,"MAKER");
	    var note_elt=getInput(dialog,"NOTE");
	    refuri_elt.value=knote.refuri;
	    frag_elt.value=knote.frag;
	    maker_elt.value=OK.maker;
	    if (knote.note) note_elt.value=knote.note;
	    var altfrags=[];
	    var node=getNode4Knote(knote);
	    var children=node.childNodes;
	    var i=0; var lim=children.length;
	    while (i<lim) {
		var child=children[i++]; var id=false;
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

	var knotemodes=/(knotetext)|(knotetag)|(knotelink)/;

	function button(evt){
	    evt=evt||event;
	    var target=evt.target||evt.srcElement;
	    var form=getParent(target,"knotepad");
	    if (!(form)) return;
	    var b=getParent(target,"button");
	    if (!(b)) return;
	    if (!(b.alt)) return;
	    if (b.alt==='close') {
		form.parentNode.removeChild(form);
		return;}
	    fdjtDOM.swapClass(form,knotemodes,"knote"+b.alt);}
	result.button=button;

	function add_knote_handler(evt){
	    evt=evt||event;
	    var target=evt.target||evt.fromElt;
	    var scan=target;
	    while (scan) {
		if (scan.nodeType!==1) scan=scan.parentNode;
		else if ((scan.tagName==='A')||(scan.tagName==='INPUT')||
			 (scan.tagName==='TEXTAREA'))
		    return false;
		else if (scan.onclick) return false;
		else scan=scan.parentNode;}
	    var scope=find_scope(target), prefix=false;
	    var refuri=rooturi;
	    if (scope) {
		var scopeuri=get_scopeuri(scope);
		var hashpos=scopeuri.indexOf('#');
		if (hashpos>0) {
		    prefix=scopeuri.slice(hashpos+1);
		    refuri=scopeuri.slice(0,hashpos);}
		else prefix=false;}
	    else prefix=rootid;
	    var passage=find_passage(target,prefix,scope);
	    var knote={_id: fdjtState.getUUID(), refuri: refuri,
		       frag: passage.id};
	    return knoteDialog(knote);}

	function assign_ids(){
	    var idcounts={};
	    var i=0; var ilim=block_specs.length;
	    while (i<ilim) {
		var nodes=
		    ((document.querySelectorAll)?
		     (document.querySelectorAll(block_specs[i++])):
		     (document.getElementsByTagName(block_specs[i++])));
		var j=0; var jlim=nodes.length;
		while (j<jlim) {
		    var node=nodes[j++];
		    if (node.id) continue;
		    var text=fdjtString.normString(fdjtDOM.textify(node));
		    var idstring="MD5"+fdjtHash.md5(text);
		    var count=idcounts[idstring]||0;
		    if (count) {
			node.id=idstring+"_"+count;
			idcounts[idstring]=count+1;}
		    else {
			node.id=idstring;
			idcounts[idstring]=1;}}}}
	
	return result;
    })();


/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
