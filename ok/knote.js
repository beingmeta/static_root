;;; -*- Mode: Javascript; Character-encoding: utf-8; -*-


if (typeof OK === 'undefined') 
    var OK=
    (function(){
		var refuri=false;
    var baseid=false;

     var knotes={};

    function startup(){
	refuri=fdjtDOM.getLink("OK.refuri")||
	    fdjtDOM.getLink("refuri")||
	    fdjtDOM.getLink("canonical")||
	    window.location.url;
	if (refuri.indexOf('#')>0) 
	    refuri=refuri.slice(0,refuri.indexOf('#'));
	baseid=fdjtDOM.getMeta("OK.baseid")||
	    fdjtDOM.getMeta("baseid")||
	    "OK";}

     


    })();
