;;; -*- Mode: Javascript; Character-encoding: utf-8; -*-


if (typeof OK === 'undefined') 
    var OK=
    (function(){
	var rooturi=false;
	var rootid=false;

	var knotes={};

	var run_time=100;
	var gap_time=100;

	function startup(){
	    rooturi=fdjtDOM.getLink("OK.refuri")||
		fdjtDOM.getLink("refuri")||
		fdjtDOM.getLink("canonical")||
		window.location.url;
	    if (rooturi.indexOf('#')>0) 
		rooturi=rooturi.slice(0,rooturi.indexOf('#'));
	    rootid=fdjtDOM.getMeta("OK.baseid")||
		fdjtDOM.getMeta("baseid");
	    if (!(rootid)) setTimeout(assign_ids,100);}

	function assign_ids(scan,block){
	    var idcounts={};
	    function statefn() {
		var time=fdjtTime(), limit=time+run_time;
		while ((scan)&&((time<limit))) {
		    if (scan.nodeType!==1) {
			scan=fdjtDOM.forwardNode(scan);
			continue;}
		    else {
			var style=getStyle(scan);
			if (style.display!=='inline') {
			    var text=fdjtString.normString(fdjtDOM.textify(scan));
			    if (text.length<500) {
				scan=fdjtDOM.forwardNode(scan);
				continue;}
			    var idstring=fdjtHash.md5(text);
			    var count=idcounts[idstring]||0;
			    if (count) {
				scan.id=idstring+"_"+count;
				idcounts[idstring]=count+1;}
			    else {
				scan.id=idstring;
				idcounts[idstring]=1;}}}}
		setTimeout(statefn,gap_time);}
	    statefn();}
	
	function get_refuri(node){
	    while (node) {
		if ((node.getAttributeNS)&&
		    (node.getAttributeNS("refuri","http://openknotes.org/")))
		    return node.getAttributeNS("refuri","http://openknotes.org/");
		else if (node.getAttribute)
		    return ((node.getAttribute("data-refuri"))||
			    (node.getAttribute("refuri"))||
			    false);
		else node=node.parentNode;}
	    return false;}

	function knoteDialog(node){
	    var refuri=get_refuri(node); var baseid=false;
	    if ((refuri)&&(refuri.indexOf('#')>0)) {
		var hashpos=refuri.indexOf('#');
		baseid=refuri.slice(hashpos+1);
		refuri=refuri.slice(0,hashpos);}
	    else if (refuri)
		baseid=false;
	    else if (!(rooturi)) {
		startup();
		refuri=rooturi; baseid=rootid;}
	    else {refuri=rooturi; baseid=rootid;}
	    var scan=node;
	    while (scan) {
		if (scan.nodeType!==1) scan=scan.parentNode;
		else if (!(scan.id)) scan=scan.parentNode;
		else if (((!baseid))||(scan.id.search(baseid)===0)) {
		    node=scan; baseid=scan.id; break;}
		else scan=scan.parentNode;}
	    if (!(scan)) {
		scan=fdjtDOM.getParent(node,"P,H1,H2,H3,H4,H5,H6,DIV,LI");
		baseid=fdjtHash.md5(fdjtString.normString(fdjtDOM.textify(scan)));}
	    var dialog=fdjtDOM("div.knotepad.knotetext");
	    dialog.innerHTML=OK.formhtml;
	    var hidden=fdjtDOM.getChildren(".hidden");
	    var refuri_elt=fdjtDOM.getInput(dialog,"REFURI")[0];
	    var frag_elt=fdjtDOM.getInput(dialog,"FRAG")[0];
	    refuri_elt.value=refuri;
	    frag_elt.value=baseid;
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
	    return dialog;}
	
	
	


    })();
