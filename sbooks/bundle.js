/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

/* Copyright (C) 2009 beingmeta, inc.
   This file was created from several component files, some of
      which have different restrictions.

   For purposes of inclusion of this code in non-commercial web documents,
     use and redistribution of this file is permitted under the terms of
     the Creative Commons "Attribution-NonCommercial" license:
          http://creativecommons.org/licenses/by-nc/3.0/ 

   For all other purposes, the contents of this file are licensed
    under the terms of the nearest preceding copyright notice.  The
    copyright notices of the individual files are all prefixed by
    a line of the form "Copyright (C) ...".

    Other uses may be allowed based on prior agreement with
      beingmeta, inc.  Inquiries can be addressed to:

       licensing@biz.beingmeta.com

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

*/

var sbooks_revision='6642:6643';
var sbooks_buildhost='moby';
var sbooks_buildtime='Sat Apr 2 14:53:05 EDT 2011';
/* -*- Mode: Javascript; -*- */

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file was created from several component files and is
    part of the FDJT web toolkit (www.fdjt.org)

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   The copyright notice of the individual files are all prefixed by
    a copyright notice of the form "Copyright (C) ...".

    Use, modification, and redistribution of this program is permitted
    under either the GNU General Public License (GPL) Version 2 (or
    any later version) or under the GNU Lesser General Public License
    (version 3 or later).

    These licenses may be found at www.gnu.org, particularly:
      http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
      http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

var fdjt_versions=((fdjt_versions)||(new Array()));
fdjt_versions.decl=function(name,num){
    if ((!(fdjt_versions[name]))||(fdjt_versions[name]<num)) fdjt_versions[name]=num;};
/* -*- Mode: Javascript; -*- */

var fdjt_log_id="$Id$";
var fdjt_log_version=parseInt("$Revision$".slice(10,-1));
fdjt_versions.decl("fdjt/log",fdjt_log_version);
fdjt_versions.decl("fdjt",fdjt_log_version);

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

var fdjtLog=(function(){
    var backlog=[];

    function fdjtLog(string){
	var output=false;
	if ((fdjtLog.doformat)&&(typeof fdjtString !== 'undefined'))
	    output=fdjtString.apply(null,arguments);
	if (fdjtLog.console_fn) {
	    if (output) fdjtLog.console_fn.call(fdjtLog.console,output);
	    else fdjtLog.console_fn.apply(fdjtLog.console,arguments);}
	if (fdjtLog.console) {
	    var domconsole=fdjtLog.console;
	    var entry=fdjtDOM("div.fdjtlog",fdjtDOM("span.time",fdjtET()));
	    if (output) fdjtDOM(entry,output);
	    else fdjtDOM(entry,fdjtString.apply(null,arguments));
	    if (typeof domconsole === 'string') {
		var found=document.getElementById(domconsole);
		if (found) {
		    domconsole=fdjtLog.console=found;
		    var i=0; var lim=backlog.length;
		    while (i<lim) fdjtDOM(domconsole,backlog[i++]);
		    backlog=[];}
		else domconsole=false;}
	    else if (!(domconsole.nodeType)) domconsole=false;
	    if (domconsole)
		fdjtDOM.append(domconsole,entry);
	    else backlog.push(entry);}
	if ((fdjtLog.useconsole)||
	    ((!(fdjtLog.console))&&(!(fdjtLog.console_fn))))
	    if ((window.console) && (window.console.log) &&
		(window.console.count)) {
		if (output)
		    window.console.log.call(
			window.console,"["+fdjtET()+"s] "+output);
		else {
		    var newargs=new Array(arguments.length+1);
		    newargs[0]="[%fs] "+string;
		    newargs[1]=fdjtET();
		    var i=1; var lim=arguments.length;
		    while (i<lim) {newargs[i+1]=arguments[i]; i++;}
		    window.console.log.apply(window.console,newargs);}}}
    fdjtLog.console=null;
    fdjtLog.id="$Id$";
    fdjtLog.version=parseInt("$Revision$".slice(10,-1));

    fdjtLog.warn=function(string){
	if ((!(fdjtLog.console_fn))&&
	    (!(window.console)&&(window.console.log)&&(window.console.log.count))) {
	    var output=fdjtString.apply(null,arguments);
	    alert(output);}
	else fdjtLog.apply(null,arguments);};

    fdjtLog.uhoh=function(string){
	if (fdjtLog.debugging) fdjtLog.warn.call(this,arguments);}

    fdjtLog.bkpt=function(string){
	var output=false;
	if ((fdjtLog.doformat)&&(typeof fdjtString !== 'undefined'))
	    output=fdjtString.apply(null,arguments);
	if (fdjtLog.console_fn)
	    if (output) fdjtLog.console_fn(fdjtLog.console,output);
	else fdjtLog.console_fn.apply(fdjtLog.console,arguments);
	else if ((window.console) && (window.console.log) &&
		 (window.console.count))
	    if (output)
		window.console.log.call(window.console,output);
	else window.console.log.apply(window.console,arguments);
    };

    fdjtLog.useconsole=true;

    return fdjtLog;})();

// This is for temporary trace statements; we use a different name
//  so that they're easy to find.
var fdjtTrace=fdjtLog;

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

var fdjt_string_id="$Id$";
var fdjt_string_version=parseInt("$Revision$".slice(10,-1));
fdjt_versions.decl("fdjt/string",fdjt_string_version);
fdjt_versions.decl("fdjt",fdjt_string_version);

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

var fdjtString=
    (function(){
	function fdjtString(string){
	    var output="";
	    var cmd=string.indexOf('%'); var i=1;
	    while (cmd>=0) {
		if (cmd>0) output=output+string.slice(0,cmd);
		if (string[cmd+1]==='%') output=output+'%';
		else if (string[cmd+1]==='o') {
		    var arg=arguments[i++];
		    if (typeof arg === 'string')
			output=output+"'"+arg+"'";
		    else if (typeof arg === 'number')
			output=output+arg;
		    else output=output+stringify(arg);}
		else if (string[cmd+1]==='j') {
		    var arg=arguments[i++];
		    output=output+JSON.stringify(arg);}
		else if (arguments[i])
		    output=output+arguments[i++];
		else if (typeof arguments[i] === 'undefined') {
		    output=output+'?undef?'; i++;}
		else output=output+arguments[i++];
		string=string.slice(cmd+2);
		cmd=string.indexOf('%');}
	    output=output+string;
	    return output;
	}

	fdjtString.revid="$Id$";
	fdjtString.version=parseInt("$Revision$".slice(10,-1));

	fdjtString.nbsp="\u00A0";
	fdjtString.middot="\u00B7";
	fdjtString.emdash="\u2013";
	fdjtString.endash="\u2014";
	fdjtString.lsq="\u2018";
	fdjtString.rsq="\u2019";
	fdjtString.ldq="\u201C";
	fdjtString.rdq="\u201D";

	function stringify(arg){
	    if (typeof arg === 'undefined') return '?undef?';
	    else if (!(arg)) return arg;
	    else if (arg.tagName) {
		var output="<"+arg.tagName;
		if (arg.className)
		    output=output+"."+arg.className.replace(/\s+/g,'.');
		if (arg.id) output=output+"#"+arg.id;
		return output+">";}
	    else if (arg.nodeType)
		if (arg.nodeType===3)
		    return '<"'+arg.nodeValue+'">';
	    else return '<'+arg.nodeType+'>';
	    else if (arg.oid) return arg.oid;
	    else if (arg._fdjtid) return '#@'+arg._fdjtid;
	    else if ((arg.type)&&(arg.target)) 
		return "["+arg.type+"@"+stringify(arg.target)+"]";
	    else return arg;};

	var spacechars=" \n\r\t\f\x0b\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u202f\u205f\u3000\uf3ff";

	fdjtString.truncate=function(string,lim){
	    if (!(lim)) lim=42;
	    if (string.length<lim) return string;
	    else return string.slice(0,lim);}

	fdjtString.isEmpty=function(string){
	    if (typeof string === "string")  {
		var i=0; var lim=string.length;
		if (lim===0) return true;
		while (i<lim) {
		    if (spacechars.indexOf(string[i])>=0) i++;
		    else return false;}
		return true;}
	    else return false;}

	fdjtString.findSplit=function(string,split,escape){
	    var start=0;
	    var next;
	    while ((next=string.indexOf(split,start))>=0) 
		if ((escape) && (next>0) && (string[next-1]===escape))
		    start=next+1;
	    else return next;
	    return -1;};

	fdjtString.split=function(string,split,escape,mapfn){
	    if ((mapfn) || (escape)) {
		var results=[];
		var start=0; var next;
		while ((next=string.indexOf(split,start))>=0) 
		    if ((escape) && (next>0) && (string[next-1]===escape))
			start=next+1;
		else if ((mapfn) && (next>start)) {
		    results.push(mapfn(string.slice(start,next))); start=next+1;}
		else if (next>start) {
		    results.push(string.slice(start,next)); start=next+1;}
		else start=next+1;
		if (string.length>start)
		    if (mapfn) results.push(mapfn(string.slice(start)));
		else results.push(string.slice(start));
		return results;}
	    else return string.split(split);};

	fdjtString.semiSplit=function(string,escape,mapfn){
	    if ((mapfn) || (escape)) {
		var results=[];
		var start=0; var next;
		while ((next=string.indexOf(';',start))>=0) 
		    if ((escape) && (next>0) && (string[next-1]===escape))
			start=next+1;
		else if ((mapfn) && (next>start)) {
		    results.push(mapfn(string.slice(start,next))); start=next+1;}
		else if (next>start) {
		    results.push(string.slice(start,next)); start=next+1;}
		else start=next+1;
		if (string.length>start)
		    if (mapfn) results.push(mapfn(string.slice(start)));
		else results.push(string.slice(start));
		return results;}
	    else return string.split(';');};

	fdjtString.lineSplit=function(string,escapes,mapfn){
	    if ((mapfn) || (escape)) {
		var results=[];
		var start=0; var next;
		while ((next=string.indexOf('\n',start))>=0) 
		    if ((escape) && (next>0) && (string[next-1]===escape))
			start=next+1;
		else if ((mapfn) && (next>start)) {
		    results.push(mapfn(string.slice(start,next))); start=next+1;}
		else if (next>start) {
		    results.push(string.slice(start,next)); start=next+1;}
		else start=next+1;
		if (string.length>start)
		    if (mapfn) results.push(mapfn(string.slice(start)));
		else results.push(string.slice(start));
		return results;}
	    else return string.split('\n');};

	var spacechars=" \n\r\t\f\x0b\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u202f\u205f\u3000\uf3ff";
	
	function trim(string){
	    var start=0; var len=string.length; 
	    if (len<=0) return string;
	    while ((start<len)&&
		   (spacechars.indexOf(string.charAt(start))>-1))
		start++;
	    if (start===len) return "";
	    var end=len-1;
	    while ((end>start)&&(spacechars.indexOf(string.charAt(end))>-1))
		end--;
	    if ((start>0)||(end<len)) return string.slice(start,end+1);
	    else return string;}
	fdjtString.trim=trim;

	function stdspace(string){
	    var spacechars=" \n\r\t\f\x0b\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u202f\u205f\u3000\uf3ff";
	    string=string.replace(/\s+/," ");
	    var start=0; var len=string.length; 
	    if (len<=0) return string;
	    while ((start<len)&&
		   (spacechars.indexOf(string.charAt(start))>-1))
		start++;
	    if (start===len) return "";
	    var end=len-1;
	    while ((end>start)&&(spacechars.indexOf(string.charAt(end))>-1))
		end--;
	    if ((start>0)||(end<len)) return string.slice(start,end+1);
	    else return string;}
	fdjtString.stdspace=stdspace;

	function flatten(string){
	    return string.replace(/\s+/," ");}
	fdjtString.flatten=flatten;

	function oneline(string){
	    string=trim(string);
	    var flat=string.replace(/\s*[\f\n\r]+\s+/gm," //\u00B7 ").
		replace(/\s*[\f\n\r]+\s*/gm," // ");
	    var tight=flat.replace(/\s\s+/g,"");
	    return tight;}
	fdjtString.oneline=oneline;

	function stripMarkup(string){
	    return string.replace(/<[^>]*>/g,"");}
	fdjtString.stripMarkup=stripMarkup;

	function unEscape(string){
	    if (string.indexOf('\\')>=0)
		return string.replace(/\\(.)/g,"$1");
	    else return string;}
	fdjtString.unEscape=unEscape;

	function unEntify(string) {
	    return string.replace(/&#(\d+);/g,
				  function(whole,paren) {
				      return String.fromCharCode(+paren);});}
	fdjtString.unEntify=unEntify;

	function padNum(num,digits){
	    var ndigits=
		((num<10)?(1):(num<100)?(2):(num<1000)?(3):(num<10000)?(4):
		 (num<100000)?(5):(num<1000000)?(6):(num<1000000)?(7):
		 (num<100000000)?(8):(num<1000000000)?(9):(num<10000000000)?(10):(11));
	    var nzeroes=digits-ndigits;
	    switch (nzeroes) {
	    case 0: return ""+num;
	    case 1: return "0"+num;
	    case 2: return "00"+num;
	    case 3: return "000"+num;
	    case 4: return "0000"+num;
	    case 5: return "00000"+num;
	    case 6: return "000000"+num;
	    case 7: return "0000000"+num;
	    case 8: return "00000000"+num;
	    case 9: return "000000000"+num;
	    case 10: return "0000000000"+num;
	    default: return ""+num;}}
	fdjtString.padNum=padNum;

	/* Getting initials */

	function getInitials(string){
	  var words=string.split(/\W/); var initials="";
	  var i=0; var lim=words.length;
	  while (i<lim) {
	    var word=words[i++];
	    if (word.length)
	      initials=initials+word.slice(0,1);}
	  return initials;}
	fdjtString.getInitials=getInitials;

	/* More string functions */

	function hasPrefix(string,prefix){
	    return ((string.indexOf(prefix))===0);}
	fdjtString.hasPrefix=hasPrefix;

	function hasSuffix(string,suffix){
	    return ((string.lastIndexOf(suffix))===(string.length-suffix.length));}
	fdjtString.hasSuffix=hasSuffix;

	function commonPrefix(string1,string2,brk,foldcase){
	    var i=0; var last=0;
	    while ((i<string1.length) && (i<string2.length))
		if ((string1[i]===string2[i])||
		    ((foldcase)&&(string1[i].toLowerCase()===string2[i].toLowerCase())))
		    if (brk)
			if (brk===string1[i]) {last=i-1; i++;}
	    else i++;
	    else last=i++;
	    else break;
	    if (last>0) return string1.slice(0,last+1);
	    else return false;}
	fdjtString.commonPrefix=commonPrefix;

	function commonSuffix(string1,string2,brk,foldcase){
	    var i=string1.length, j=string2.length; var last=0;
	    while ((i>=0) && (j>=0))
		if ((string1[i]===string2[j])||
		    ((foldcase)&&(string1[i].toLowerCase()===string2[i].toLowerCase())))
		    if (brk)
			if (brk===string1[i]) {last=i+1; i--; j--;}
	    else {i--; j--;}
	    else {last=i; i--; j--;}
	    else break;
	    if (last>0) return string1.slice(last);
	    else return false;}
	fdjtString.commonSuffix=commonSuffix;

	function stripSuffix(string){
	    var start=string.search(/\.\w+$/);
	    if (start>0) return string.slice(0,start);
	    else return string;}
	fdjtString.stripSuffix=stripSuffix;

	function arrayContains(array,element){
	    if (array.indexOf)
		return (array.indexOf(element)>=0);
	    else {
		var i=0; var len=array.length;
		while (i<len)
		    if (array[i]===element) return true;
		else i++;
		return false;}}

	function prefixAdd(ptree,string,i) {
	    var strings=ptree.strings;
	    if (i===string.length) 
		if ((strings.indexOf) ?
		    (strings.indexOf(string)>=0) :
		    (arrayContains(strings,string)))
		    return false;
	    else {
		strings.push(string);
		return true;}
	    else if (ptree.splits) {
		var splitchar=string[i];
		var split=ptree[splitchar];
		if (!(split)) {
		    // Create a new split
		    split={};
		    split.strings=[];
		    // We don't really use this, but it might be handy for debugging
		    split.splitchar=splitchar;
		    ptree[splitchar]=split;
		    ptree.splits.push(split);}
		if (prefixAdd(split,string,i+1)) {
		    strings.push(string);
		    return true;}
		else return false;}
	    else if (ptree.strings.length<5)
		if ((strings.indexOf) ?
		    (strings.indexOf(string)>=0) :
		    (arrayContains(strings,string)))
		    return false;
	    else {
		strings.push(string);
		return true;}
	    else {
		// Subdivide
		ptree.splits=[];
		var strings=ptree.strings;
		var j=0; while (j<strings.length) prefixAdd(ptree,strings[j++],i);
		return prefixAdd(ptree,string,i);}}
	fdjtString.prefixAdd=prefixAdd;

	function prefixFind(ptree,prefix,i,plen){
	    if (!(plen)) plen=prefix.length;
	    if (i===plen)
		return ptree.strings;
	    else if (ptree.strings.length<=5) {
		var strings=ptree.strings;
		var results=[];
		var j=0; while (j<strings.length) {
		    var string=strings[j++];
		    if (hasPrefix(string,prefix)) results.push(string);}
		if (results.length) return results;
		else return false;}
	    else {
		var split=ptree[prefix[i]];
		if (split) return prefixFind(split,prefix,i+1,plen);
		else return false;}}
	fdjtString.prefixFind=prefixFind;

	return fdjtString;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

var fdjt_time_id="$Id$";
var fdjt_time_version=parseInt("$Revision$".slice(10,-1));
fdjt_versions.decl("fdjt/time",fdjt_time_version);
fdjt_versions.decl("fdjt",fdjt_time_version);

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
    of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

    Use, modification, and redistribution of this program is permitted
    under either the GNU General Public License (GPL) Version 2 (or
    any later version) or under the GNU Lesser General Public License
    (version 3 or later).

    These licenses may be found at www.gnu.org, particularly:
      http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
      http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

/* Time functions */

var fdjtTime=
    (function (){
	function fdjtTime() {
	    return (new Date()).getTime();}
	fdjtTime.revid="$Id$";
	fdjtTime.version=parseInt("$Revision$".slice(10,-1));

	var loaded=fdjtTime.loaded=(new Date()).getTime();
	fdjtTime.tick=function(){
	    return Math.floor((new Date()).getTime()/1000);};

	fdjtTime.dateString=function(tstamp){
	    return tstamp.toDateString();};
	function shortString(tstamp){
	    var now=new Date();
	    var diff=(now.getTime()-tstamp.getTime())/1000;
	    if (diff>(12*3600))
		return tstamp.toDateString();
	    else {
		var hours=tstamp.getHours();
		var minutes=tstamp.getMinutes();
		return tstamp.toDateString()+" ("+
		    ((hours<10)?"0":"")+hours+":"+
		    ((minutes<10)?"0":"");}}
	fdjtTime.shortString=shortString;
	fdjtTime.tick2shortstring=function(tick){
	    return shortString(new Date(tick*1000));};

	fdjtTime.tick2string=function(tick){
	    return (new Date(tick*1000)).toString();};
	fdjtTime.tick2date=function(tick){
	    return (new Date(tick*1000)).toDateString();};
	fdjtTime.tick2locale=function(tick){
	    return (new Date(tick*1000)).toLocaleString();};
	fdjtTime.tick2time=function(tick){
	    return (new Date(tick*1000)).toTimeString();};

	fdjtTime.secs2string=function(interval){
	    if (interval===1)
		return _("%1 second",interval);
	    else if (interval<10)
		return _("%1 seconds",interval);
	    else if (interval<60)
		return _("~%1 seconds",Math.round(interval/60));
	    else if (interval<120) {
		var minutes=Math.floor(interval/60);
		var seconds=Math.round(interval-(minutes*60));
		if (seconds===1)
		    return _("one minute, one second");
		else return _("one minute, %1 seconds",seconds);}
	    else if (interval<3600) {
		var minutes=Math.floor(interval/60);
		return _("~%1 minutes",minutes);}
	    else if (interval<(2*3600)) {
		var hours=Math.floor(interval/3600);
		var minutes=Math.round((interval-(hours*3600))/60);
		if (minutes===1)
		    return _("one hour and one minutes");
		else return _("one hour, %1 minutes",minutes);}
	    else if (interval<(24*3600)) {
		var hours=Math.floor(interval/3600);
		return _("~%1 hours",hours);}
	    else if (interval<(2*24*3600)) {
		var hours=Math.floor((interval-24*3600)/3600);
		if (hours===1)
		    return _("one day and one hour");
		else return _("one day, %1 hours",hours);}
	    else if (interval<(7*24*3600)) {
		var days=Math.floor(interval/(24*3600));
		return _("%1 days",days);}
	    else if (interval<(14*24*3600)) {
		var days=Math.floor((interval-(7*24*3600))/(24*3600));
		if (days===1)
		    return "one week and one day";
		else return _("one week and %1 days",days);}
	    else {
		var weeks=Math.floor(interval/(7*24*3600));
		var days=Math.round((interval-(days*7*24*3600))/(7*24*3600));
		return _("%1 weeks, %2 days",weeks,days);}};

	fdjtTime.secs2short=function(interval){
	    // This is designed for short intervals
	    if (interval<0.001)
		return Math.round(interval*1000000)+"us";
	    else if (interval<0.1)
		return Math.round(interval*1000)+"ms";
	    else if (interval<120)
		return (Math.round(interval*100)/100)+"s";
	    else {
		var min=Math.round(interval/60);
		var secs=Math.round(interval-min*6000)/100;
		return min+"m"+secs+"s";}};

	fdjtTime.runTimes=function(pname,start){
	    var point=start; var report="";
	    var i=2; while (i<arguments.length) {
		var phase=arguments[i++]; var time=arguments[i++];
		report=report+"; "+phase+": "+
		    ((time.getTime()-point.getTime())/1000)+"s";
		point=time;}
	    return pname+" "+((point.getTime()-start.getTime())/1000)+"s"+report;};

	fdjtTime.diffTime=function(time1,time2){
	    if (!(time2)) time2=new Date();
	    var diff=time1.getTime()-time2.getTime();
	    if (diff>0) return diff/1000; else return -(diff/1000);
	};

	fdjtTime.ET=function(arg){
	    if (!(arg)) arg=new Date();
	    return (arg.getTime()-loaded)/1000;};

	function timeslice(fcns,slice,space,done){
	    if (typeof slice !== 'number') slice=100;
	    if (typeof space !== 'number') space=100;
	    var i=0; var lim=fcns.length;
	    var slicefn=function(){
		var timelim=fdjtTime()+slice;
		var nextspace=false;
		while (i<lim) {
		    var fcn=fcns[i++];
		    if (!(fcn)) continue;
		    else if (typeof fcn === 'number') {
			nextspace=fcn; break;}
		    else fcn();
		    if (fdjtTime()>timelim) break;}
		if ((i<lim)&&((!(done))||(!(done()))))
		    setTimeout(slicefn,nextspace||space);};
	    return slicefn();}
	fdjtTime.timeslice=timeslice;

	function slowmap(fn,vec,done,slice){
	    var i=0; var lim=vec.length;
	    if (!(slice)) slice=100;
	    var stepfn=function(){
		var stopat=fdjtTime()+slice;
		while ((i<lim)||(fdjtTime()<stopat)) fn(vec[i++]);
		if (i<lim) setTimeout(stepfn,slice);
		else if (done) done();};
	    setTimeout(stepfn,slice);}
	fdjtTime.slowmap=slowmap;

	return fdjtTime;})();

var fdjtET=fdjtTime.ET;

/* Emacs local variables
;;;  Local variables: ***
;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

var fdjt_dom_id="$Id$";
var fdjt_dom_version=parseInt("$Revision$".slice(10,-1));
fdjt_versions.decl("fdjt/dom",fdjt_dom_version);
fdjt_versions.decl("fdjt",fdjt_dom_version);

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

var fdjtDOM=
  (function(){
    var usenative=true;

    function fdjtDOM(spec){
      var node;
      if (spec.nodeType) node=spec;
      else if (typeof spec==='string')
	if (spec[0]==='<') {
	  var container=document.createElement("DIV");
	  container.innerHTML=spec;
	  var children=container.childNodes;
	  var i=0; var len=children.length;
	  while (i<len)
	    if (children[i].nodeType===1) return children[i];
	    else i++;
	  return false;}
	else {
	  var elts=spec.match(css_selector_regex);
	  var classname=false;
	  node=document.createElement(elts[0]);
	  var i=1; var len=elts.length;
	  while (i<len) {
	    var sel=elts[i++];
	    if (sel[0]==='#') node.id=sel.slice(1);
	    else if (sel[0]==='.')
	      if (classname) classname=classname+" "+sel.slice(1);
	      else classname=sel.slice(1);
	    else if (sel[0]==='[') {
	      var eqpos=sel.indexOf('=');
	      if (eqpos<0) {
		node.setAttribute(
				  sel.slice(1,sel.length-1),
				  sel.slice(1,sel.length-1));}
	      else {
		node.setAttribute(
				  sel.slice(1,eqpos),
				  sel.slice(eqpos+1,sel.length-1));}}
	    else {}}
	  if (classname) node.className=classname;}
      else {
	node=document.createElement(spec.tagName||"span");
	for (attrib in spec) {
	  if (attrib==="tagName") continue;
	  else node.setAttribute(attrib,spec[attrib]);}}
      domappend(node,arguments,1);
      return node;}

    fdjtDOM.revid="$Id$";
    fdjtDOM.version=parseInt("$Revision$".slice(10,-1));
    fdjtDOM.useNative=function(flag) {
      if (typeof flag === 'undefined') return usenative;
      else usenative=flag;};
	
    fdjtDOM.clone=function(node){
      return node.cloneNode(true);}

    function domappend(node,content,i) {
      if (content.nodeType)
	node.appendChild(content);
      else if (typeof content === 'string')
	node.appendChild(document.createTextNode(content));
      else if (content.toDOM)
	domappend(node,content.toDOM());
      else if (content.toHTML)
	domappend(node,content.toHTML());
      else if (content.length) {
	if (typeof i === 'undefined') i=0;
	var len=content.length;
	while (i<len) {
	  var elt=content[i++];
	  if (!(elt)) {}
	  else if (typeof elt === 'string')
	    node.appendChild(document.createTextNode(elt));
	  else if (elt.nodeType)
	    node.appendChild(elt);
	  else if (elt.length)
	    domappend(node,elt,0);
	  else if (elt.toDOM)
	    domappend(node,elt.toDOM());
	  else if (elt.toHTML)
	    domappend(node,elt.toHTML());
	  else if (elt.toString)
	    node.appendChild(document.createTextNode(elt.toString()));
	  else node.appendChild(document.createTextNode(""+elt));}}
      else node.appendChild(document.createTextNode(""+content));}
    function dominsert(before,content,i) {
      var node=before.parentNode;
      if (content.nodeType)
	node.insertBefore(content,before);
      else if (typeof content === 'string')
	node.insertBefore(content,before);
      else if (content.toDOM)
	dominsert(before,content.toDOM());
      else if (content.toHTML)
	dominsert(before,content.toHTML());
      else if (content.length) {
	if (typeof i === 'undefined') i=0;
	var j=content.length-1;
	while (j>=i) {
	  var elt=content[j--];
	  if (!(elt)) {}
	  else if (typeof elt === 'string')
	    node.insertBefore(document.createTextNode(elt),before);
	  else if (elt.nodeType)
	    node.insertBefore(elt,before);
	  else if (elt.length)
	    dominsert(before,elt,0);
	  else if (elt.toDOM)
	    dominsert(before,elt.toDOM());
	  else if (elt.toHTML)
	    dominsert(before,elt.toHTML());
	  else if (elt.toString)
	    node.insertBefore(document.createTextNode(elt.toString()),before);
	  else node.insertBefore(document.createTextNode(""+elt),before);}}
      else node.insertBefore(document.createTextNode(""+elt),before);}

    function toArray(arg) {
      var result=new Array(arg.length);
      var i=0; var lim=arg.length;
      while (i<lim) {result[i]=arg[i]; i++;}
      return result;}
    fdjtDOM.toArray=toArray;
    function extendArray(result,arg) {
      var i=0; var lim=arg.length;
      while (i<lim) {result.push(arg[i]); i++;}
      return result;}
    function TOA(arg,start) {
      if (arg instanceof Array) {
	if (start) return arg.slice(start);
	else return arg;}
      start=start||0;
      var i=0; var lim=arg.length-start;
      var result=new Array(lim);
      while (i<lim) {result[i]=arg[i+start]; i++;}
      return result;}
    fdjtDOM.Array=TOA;

    /* Utility patterns and functions */

    function parsePX(arg,dflt){
      if (typeof dflt === 'undefined') dflt=0;
      if (arg===0) return 0;
      else if (!(arg)) return dflt;
      else if (arg==="none") return dflt;
      else if (arg==="auto") return dflt;
      else if (typeof arg === 'number') return arg;
      else if (typeof arg === 'string') {
	var len=arg.length; var num=false;
	if ((len>2)&&(arg[len-1]==='x')&&(arg[len-2]==='p'))
	  num=parseInt(arg.slice(0,-2));
	else num=parseInt(arg);
	if (num===0) return 0;
	else if (isNaN(num)) return dflt;
	else if (typeof num === 'number') return num;
	else return dflt;}
      else return false;}
    fdjtDOM.parsePX=parsePX;

    var css_selector_regex=/((^|[.#])\w+)|(\[\w+=\w+\])/g;

    var whitespace_pat=/(\s)+/;
    var trimspace_pat=/^(\s)+|(\s)+$/;
    var classpats={};
    function classPat(name){
      var rx=new RegExp("\\b"+name+"\\b","g");
      classpats[name]=rx;
      return rx;};

    function string_trim(string){
      var start=string.search(/\S/); var end=string.search(/\s+$/g);
      if ((start===0) && (end<0)) return string;
      else return string.slice(start,end);}

    function nodeString(node){
      if (node.nodeType===3) 
	return "<'"+node.value+"'>";
      else if (node.nodeType===1) {
	var output="<"+node.tagName;
	if (node.id) output=output+"#"+node.id;
	if (node.tagName==='input') {
	  output+"[type="+node.type+"]";
	  output+"[name="+node.name+"]";}
	else if (node.tagName==='textarea')
	  output+"[name="+node.name+"]";
	else if (node.tagName==='img') {
	  if (node.alt) output=output+"[alt="+node.alt+"]";
	  else if (node.src) output=output+"[src="+node.src+"]";}
	else {}
	if (node.className)
	  output=output+"."+node.className.replace(/\s+/g,'.');
	return output+">";}
      else return node.toString();}
    fdjtDOM.nodeString=nodeString;
	
    /* Simple class/attrib manipulation functions */

    function hasClass(elt,classname,attrib){
      var classinfo=((attrib) ? (elt.getAttribute(attrib)||"") : (elt.className));
      if (!(classinfo)) return false;
      else if (classname===true) return true;
      else if (classinfo===classname) return true;
      else if (typeof classname === 'string')
	if (classinfo.indexOf(' ')<0) return false;
	else classname=classpats[classname]||classPat(classname);
      else {}
      if (classinfo.search(classname)>=0) return true;
      else return false;}
    fdjtDOM.hasClass=hasClass;

    function addClass(elt,classname,attrib){
      if (typeof elt === 'string') elt=document.getElementById(elt);
      else if (elt instanceof Array) { // (elt instanceof NodeList)
	var elts=((elt instanceof Array)?(elt):(toArray(elt)));
	var i=0; var lim=elts.length;
	while (i<lim) addClass(elts[i++],classname,attrib||false);
	return;}
      else if ((NodeList)&&(elt instanceof NodeList))
	return addClass(TOA(elt),classname,attrib);
      var classinfo=
	(((attrib) ? (elt.getAttribute(attrib)||"") :(elt.className))||null);
      if (!(classinfo)) {
	elt.className=classname; return true;}
      var class_regex=classpats[classname]||classPat(classname);
      var newinfo=classinfo;
      if (classinfo===classname) return false;
      else if (classinfo.search(class_regex)>=0) return false;
      else newinfo=classname+" "+classinfo;
      if (attrib) {
	elt.setAttribute(attrib,newinfo);
	// This sometimes trigger a CSS update that doesn't happen otherwise
	elt.className=elt.className;}
      else elt.className=newinfo;
      return true;}
    fdjtDOM.addClass=addClass;
    fdjtDOM.aC=addClass;

    fdjtDOM.classAdder=function(elt,classname){
      return function() {
	if (elt) addClass(elt,classname);}};

    function dropClass(elt,classname,attrib){
      if (typeof elt === 'string') elt=document.getElementById(elt);
      else if (elt instanceof Array) {
	var elts=((elt instanceof Array)?(elt):(toArray(elt)));
	var i=0; var lim=elts.length;
	while (i<lim) dropClass(elts[i++],classname,attrib||false);
	return;}
      else if ((NodeList)&&(elt instanceof NodeList))
	return dropClass(TOA(elt),classname,attrib);
      var classinfo=
	(((attrib) ? (elt.getAttribute(attrib)||"") :(elt.className))||null);
      if (!(classinfo)) return false;
      var class_regex=
	((typeof classname === 'string')?
	 (classpats[classname]||classPat(classname)):
	 classname);
      var newinfo=classinfo;
      if (classinfo===classname) 
	newinfo=null;
      else if (classinfo.search(class_regex)>=0) 
	newinfo=classinfo.replace(class_regex,"");
      else return false;
      if (newinfo)
	newinfo=newinfo.
	  replace(whitespace_pat," ").
	  replace(trimspace_pat,"");
      if (attrib)
	if (newinfo) {
	  elt.setAttribute(attrib,newinfo);
	  elt.className=elt.className;}
	else if (!(keep)) {
	  elt.removeAttribute(attrib);
	  elt.className=elt.className;}
	else {}
      else elt.className=newinfo;
      return true;}
    fdjtDOM.dropClass=dropClass;
    fdjtDOM.dC=dropClass;

    fdjtDOM.classDropper=function(elt,classname){
      return function() {
	if (elt) dropClass(elt,classname);}};

    function swapClass(elt,drop,add,attrib) {
      dropClass(elt,drop,attrib); addClass(elt,add,attrib);}
    fdjtDOM.swapClass=swapClass;

    function toggleClass(elt,classname,attrib){
      if (typeof elt === 'string') elt=document.getElementById(elt);
      else if (elt instanceof Array) { // (elt instanceof NodeList)
	var elts=((elt instanceof Array)?(elt):(toArray(elt)));
	var i=0; var lim=elts.length;
	while (i<lim) toggleClass(elts[i++],classname,attrib||false);
	return;}
      else if ((NodeList)&&(elt instanceof NodeList))
	return toggleClass(TOA(elt),classname,attrib);
      var classinfo=
	(((attrib) ? (elt.getAttribute(attrib)||"") :
	  (elt.className))||null);
      if (!(classinfo)) {
	if (attrib) elt.setAttribute(attrib,classname);
	else elt.className=classname;
	return true;}
      var class_regex=
	((typeof classname === 'string')?
	 (classpats[classname]||classPat(classname)):
	 classname);
      var newinfo=classinfo;
      if (classinfo===classname) 
	newinfo=null;
      else if (classinfo.search(class_regex)>=0) 
	newinfo=classinfo.replace(class_regex,"");
      else {
	if (attrib)
	  elt.setAttribute(attrib,classinfo+' '+classname);
	else elt.className=classinfo+' '+classname;
	return true;}
      if (newinfo)
	newinfo=newinfo.
	  replace(whitespace_pat," ").
	  replace(trimspace_pat,"");
      if (attrib)
	if (newinfo) {
	  elt.setAttribute(attrib,newinfo);
	  elt.className=elt.className;}
	else if (!(keep)) {
	  elt.removeAttribute(attrib);
	  elt.className=elt.className;}
	else {}
      else elt.className=newinfo;
      return false;}
    fdjtDOM.toggleClass=toggleClass;
    fdjtDOM.tC=toggleClass;
	
    fdjtDOM.isTextInput=function(target){
      return ((target.tagName==='INPUT')||(target.tagName==='TEXTAREA'));};

    /* Simple CSS selectors */

    var selectors={};

    function Selector(spec,tagcs) {
      if (!(spec)) return this; // just cons with type
      else if (selectors[spec]) return selectors[spec]; // check cache
      else if (!(this instanceof Selector))
	// handle case of the forgotten 'new'
	return Selector.call(new Selector(),spec);
      if (spec.indexOf(',')>0) { // compound selectors
	var specs=spec.split(','); var compound=[];
	var i=0; var lim=specs.length;
	while (i<lim) {
	  var sub=string_trim(specs[i++]);
	  compound.push(new Selector(sub));}
	this.compound=compound;
	selectors[spec]=this;
	return this;}
      // Otherwise, parse and set up this
      var elts=spec.match(css_selector_regex);
      var i=0; var lim=elts.length;
      var classes=[]; var classnames=[]; var attribs=false;
      if (!((elts[0][0]==='.')||(elts[0][0]==='#')||(elts[0][0]==='['))) {
	this.tag=((tagcs)?(elts[0]):(elts[0].toUpperCase()));
	i=1;}
      while (i<lim)
	if (elts[i][0]==='#') this.id=elts[i++].slice(1);
	else if (elts[i][0]==='.') {
	  classnames.push(elts[i].slice(1));
	  classes.push(classPat(elts[i++].slice(1)));}
	else if (elts[i][0]==='[') {
	  var aelts=elts[i++]; var eltsend=aelts.length-1;
	  if (!(attribs)) attribs={};
	  var eqpos=aelts.indexOf('=');
	  if (eqpos<0)
	    attribs[aelts.slice(1,eltsend)]=true;
	  else if (aelts[eqpos+1]==='~') 
	    attribs[aelts.slice(1,eqpos)]=
	      classPat(aelts.slice(eqpos+2,eltsend));
	  else attribs[aelts.slice(1,eqpos)]=aelts.slice(eqpos+1,eltsend);}
	else fdjtLog.uhoh("weird elts %o",elts[i++]);
      if (classes.length) {
	this.classes=classes; this.classnames=classnames;}
      if (attribs) this.attribs=attribs;
      selectors[spec]=this;
      return this;}
    Selector.prototype.match=function(elt){
      if (this.compound) {
	var compound=this.compound; var i=0; var lim=compound.length;
	while (i<lim) if (compound[i++].match(elt)) return true;
	return false;} 
      if ((this.tag)&&(this.tag!==elt.tagName)) return false;
      else if ((this.id)&&(this.id!==elt.id)) return false;
      if (this.classes)
	if (elt.className) {
	  var classname=elt.className; var classes=this.classes;
	  var i=0; var lim=classes.length;
	  while (i<lim) if (classname.search(classes[i++])<0) return false;}
	else return false;
      if (this.attribs) {
	var attribs=this.attribs;
	for (var name in attribs) {
	  var val=elt.getAttribute(name);
	  if (!(val)) return false;
	  var need=this[name];
	  if (need===true) {}
	  else if (typeof need === 'string') {
	    if (need!==val) return false;}
	  else if (val.search(need)<0) return false;}}
      return true;};
    Selector.prototype.find=function(elt,results){
      var pickfirst=false;
      if (!(results)) results=[];
      if (this.compound) {
	var compound=this.compound; var i=0; var lim=compound.length;
	while (i<lim) compound[i++].find(elt,results);
	return results;}
      if (this.id) {
	var elt=document.getElementById(this.id);
	if (!(elt)) return results;
	else if (this.match(elt)) {
	  results.push(elt); return results;}
	else return results;}
      var candidates=[];
      var classnames=this.classnames; var attribs=this.attribs;
      if (this.classes) 
	if (elt.getElementsByClassName)
	  candidates=elt.getElementsByClassName(classnames[0]);
	else gatherByClass(elt,this.classes[0],candidates);
      else if ((this.tag)&&(elt.getElementsByTagName))
	candidates=elt.getElementsByTagName(this.tag);
      else if (this.attribs) {
	var attribs=this.attribs;
	for (var name in attribs) {
	  gatherByAttrib(elt,name,attribs[name],candidates);
	  break;}}
      else if (this.tag) {
	gatherByTag(elt,this.tag,candidates);}
      else {}
      if (candidates.length===0) return candidates;
      if (((this.tag)&&(!(this.classes))&&(!(this.attribs)))||
	  ((!(this.tag))&&(this.classes)&&(this.classes.length===1)&&
	   (!(this.attribs))))
	// When there's only one test, don't bother filtering
	if (results.length) return extendArray(results,candidates);
	else if (candidates instanceof Array)
	  return candidates;
	else return toArray(candidates);
      var i=0; var lim=candidates.length;
      while (i<lim) {
	var candidate=candidates[i++];
	if (this.match(candidate)) results.push(candidate);}
      return results;};
    fdjtDOM.Selector=Selector;
    fdjtDOM.sel=function(spec){
      if (!(spec)) return false;
      else if (spec instanceof Selector) return spec;
      else if (spec instanceof Array) {
	if (spec.length)
	  return new Selector(spec.join(","));
	else return false;}
      else if (typeof spec === 'string')
	return new Selector(spec);
      else {
	fdjtLog.warn("Non selector spec: %o",spec);
	return false;}};

    function gatherByClass(node,pat,results){
      if (node.nodeType===1) {
	if ((node.className)&&(node.className.search(pat)>=0))
	  results.push(node);
	var children=node.childNodes;
	if (children) {
	  var i=0; var lim=children.length; var result;
	  while (i<lim) gatherByClass(children[i++],pat,results);}}}
    function gatherByTag(node,tag,results){
      if (node.nodeType===1) {
	if (node.tagName===tag) results.push(node);
	var children=node.childNodes;
	if (children) {
	  var i=0; var lim=children.length; var result;
	  while (i<lim) gatherByTag(children[i++],tag,results);}}}
    function gatherByAttrib(node,attrib,val,results){
      if (node.nodeType===1) {
	if ((node.getAttribute(attrib))&&
	    ((typeof val === 'string')?
	     (node.getAttribute(attrib)===val):
	     (node.getAttribute(attrib).search(val)>=0)))
	  results.push(node);
	var children=node.childNodes;
	if (children) {
	  var i=0; var lim=children.length; var result;
	  while (i<lim) gatherByTag(children[i++],tag,results);}}}
	
    function gather_children(node,pat,attrib,results){
      if (!(attrib)) gatherByClass(node,pat,results);
      else if (attrib==='class') gatherByClass(node,pat,results);
      else if (attrib==='tagName') gatherByTag(node,pat,results);
      else gatherByAttrib(node,attrib,pat,results);}

    /* Real simple DOM search */

    function getParent(elt,parent,attrib){
      if (!(parent)) return false;
      else if (parent.nodeType) {
	while (elt) {
	  if (elt===parent) return parent;
	  else elt=elt.parentNode;}
	return false;}
      else if (typeof parent === 'function') {
	while (elt) {
	  if (parent(elt)) return elt;
	  else elt=elt.parentNode;}
	return false;}
      else if (parent instanceof Selector) {
	while (elt) {
	  if (parent.match(elt)) return elt;
	  else elt=elt.parentNode;}
	return false;}
      else if (typeof parent === 'string')
	return getParent(elt,new Selector(parent));
      else throw { error: 'invalid parent spec'};}
    fdjtDOM.getParent=getParent;
    fdjtDOM.hasParent=getParent;
    fdjtDOM.$P=getParent;
    fdjtDOM.inherits=function(node,spec) {
      var sel=new Selector(spec);
      return ((sel.match(node))?(node):(getParent(node,sel)));};

    function getChildren(node,classname,attrib,results){
      if (!(results)) results=[]; 
      if ((!(attrib))&&(typeof classname === 'function'))
	filter_children(node,classname,results);
      else if (!(attrib))
	if (classname instanceof Selector)
	  return classname.find(node,results);
	else if (typeof classname === 'string')
	  if ((usenative) && (node.querySelectorAll))
	    return node.querySelectorAll(classname);
	  else return getChildren(node,new Selector(classname),false,results);
	else throw { error: 'bad selector arg', selector: classname};
      else {
	var pat=(classpats[parent]||classPat(parent));
	gather_children(node,classname,attrib||false,results);}
      return results;}
    fdjtDOM.getChildren=getChildren;
    fdjtDOM.$=function(spec,root){
      return toArray(getChildren(root||document,spec));};
    fdjtDOM.getFirstChild=function(elt,spec){
      var children=getChildren(elt,spec);
      if (children.length) return children[0]; else return false;};
    fdjtDOM.getChild=fdjtDOM.getFirstChild;

    function filter_children(node,filter,results){
      if (node.nodeType===1) {
	if (filter(node)) results.push(node);
	var children=node.childNodes;
	if (children) {
	  var i=0; var lim=children.length; var result;
	  while (i<lim) filter_children(children[i++],filter,results);}}}

    fdjtDOM.getAttrib=function(elt,attrib,ns){
      var probe;
      if ((ns)&&(elt.getAttributeByNS))
	probe=elt.getAttributeNS(attrib,ns);
      if (probe) return probe;
      else return elt.getAttribute(attrib)||
	     elt.getAttribute("data-"+attrib);};

    fdjtDOM.findAttrib=function(scan,attrib,ns){
      var dattrib="data-"+attrib;
      while (scan) {
	if ((ns)&&(scan.getAttributeNS)&&
	    (scan.getAttributeNS(attrib,ns)))
	  return scan.getAttributeNS(attrib,ns);
	else if (scan.getAttribute) {
	  if (scan.getAttribute(attrib))
	    return scan.getAttribute(attrib);
	  else if (scan.getAttribute(dattrib))
	    return scan.getAttribute(dattrib);
	  else scan=scan.parentNode;}
	else scan=scan.parentNode;}
      return false;};
	    
    /* Manipulating the DOM */

    fdjtDOM.replace=function(existing,replacement){
      var cur=existing;
      if (typeof existing === 'string')
	if (existing[0]==='#')
	  cur=document.getElementById(existing.slice(1));
	else cur=document.getElementById(existing);
      if (cur) {
	cur.parentNode.replaceChild(replacement,cur);
	if ((cur.id)&&(!(replacement.id))) replacement.id=cur.id;}
      else fdjtLog.uhoh("Can't find %o to replace it with %o",
			existing,replacement);};
    function remove_node(node){
      if (node instanceof Array) {
	var i=0; var lim=node.length;
	while (i<lim) remove_node(node[i++]);
	return;}
      var cur=node;
      if (typeof node === 'string')
	if (node[0]==='#') cur=document.getElementById(node.slice(1));
	else cur=document.getElementById(node);
      if (cur) cur.parentNode.removeChild(cur);
      else fdjtLog.uhoh("Can't find %o to remove it",node);}
    fdjtDOM.remove=remove_node;
	
    fdjtDOM.append=function (node) {
      if (typeof node === 'string') node=document.getElementById(node);
      domappend(node,arguments,1);};
    fdjtDOM.prepend=function (node) {
      if (typeof node === 'string') node=document.getElementById(node);
      if (node.firstChild)
	dominsert(node.firstChild,arguments,1);
      else domappend(node,arguments,1);};

    fdjtDOM.insertBefore=function (before) {
      if (typeof before === 'string') before=document.getElementById(before);
      dominsert(before,arguments,1);};
    fdjtDOM.insertAfter=function (before) {
      if (typeof before === 'string') before=document.getElementById(before);
      if (before.nextSibling)
	dominsert(before.nextSibling,arguments,1);
      else domappend(before.parentNode,arguments,1);};
	
    /* DOM construction shortcuts */

    function tag_spec(spec,tag){
      if (!(spec)) return tag;
      else if (typeof spec === 'string') {
	var wordstart=spec.search(/\w/g);
	var puncstart=spec.search(/\W/g);
	if (puncstart<0) return tag+"."+spec;
	else if (wordstart!==0) return tag+spec;
	return spec;}
      else if (spec.tagName) return spec;
      else {
	spec.tagName=tag;
	return spec;}}

    fdjtDOM.Input=function(spec,name,value,title){
      if (spec.search(/\w/)!==0) spec='INPUT'+spec;
      var node=fdjtDOM(spec);
      node.name=name;
      if (value) node.value=value;
      if (title) node.title=title;
      return node;};
    fdjtDOM.Checkbox=function(name,value,checked){
      var node=fdjtDOM("INPUT");
      node.type="checkbox"
      node.name=name;
      if (value) node.value=value;
      if (checked) node.checked=true;
      else node.checked=false;
      return node;};
    fdjtDOM.Anchor=function(href,spec){
      spec=tag_spec(spec,"A");
      var node=fdjtDOM(spec); node.href=href;
      domappend(node,arguments,2);
      return node;};
    fdjtDOM.Image=function(src,spec,alt,title){
      spec=tag_spec(spec,"IMG");
      var node=fdjtDOM(spec); node.src=src;
      if (alt) node.alt=alt;
      if (title) node.title=title;
      domappend(node,arguments,4);
      return node;};

    function getInputs(root,name,type){
      var results=[];
      var inputs=root.getElementsByTagName('input');
      var i=0; var lim=inputs.length;
      while (i<lim) {
	if (((!(name))||(inputs[i].name===name))&&
	    ((!(type))||(inputs[i].type===type)))
	  results.push(inputs[i++]); 
	else i++;}
      if ((!type)||(type==='textarea')||(type==='text')) {
	var inputs=root.getElementsByTagName('textarea');
	var i=0; var lim=inputs.length;
	while (i<lim) {
	  if (((!(name))||(inputs[i].name===name))&&
	      ((!(type))||(inputs[i].type===type)))
	    results.push(inputs[i++]); 
	  else i++;}}
      if ((!type)||(type==='button')||(type==='submit')) {
	var inputs=root.getElementsByTagName('button');
	var i=0; var lim=inputs.length;
	while (i<lim) {
	  if (((!(name))||(inputs[i].name===name))&&
	      ((!(type))||(inputs[i].type===type)))
	    results.push(inputs[i++]); 
	  else i++;}}
      return results;}

    fdjtDOM.getInputs=getInputs;
    fdjtDOM.getInput=function(root,name,type){
      var results=getInputs(root,name||false,type||false);
      if ((results)&&(results.length===1))
	return results[0];
      else if ((results)&&(results.length)) {
	fdjtLog.warn(
		     "Ambiguous input reference name=%o type=%o under %o",
		     name,type,root);
	return results[0];}
      else return false;};
	
    function getInputValues(root,name){
      var results=[];
      var inputs=root.getElementsByTagName('input');
      var i=0; var lim=inputs.length;
      while (i<lim) {
	var input=inputs[i++];
	if (input.name!==name) continue;
	if ((input.type==='checkbox')||(input.type==='radio')) {
	  if (!(input.checked)) continue;}
	results.push(input.value);}
      return results;}
    fdjtDOM.getInputValues=getInputValues;

    /* Getting style information generally */

    function getStyle(elt,prop){
      if (typeof elt === 'string') elt=document.getElementById(elt);
      if (!(elt)) return elt;
      var style=
	((window.getComputedStyle)&&(window.getComputedStyle(elt,null)))||
	(elt.currentStyle);
      if (!(style)) return false;
      else if (prop) return style[prop];
      else return style;}
    fdjtDOM.getStyle=getStyle;

    function styleString(elt){
      var style=elt.style; var result;
      if (!(style)) return false;
      var i=0; var lim=style.length;
      if (lim===0) return false;
      while (i<lim) {
	var p=style[i];
	var v=style[p];
	if (i===0) result=fdjtString("%s: %o",p,v);
	else result=result+"; "+fdjtString("%s: %o",p,v);
	i++;}
      return result;}
    fdjtDOM.styleString=styleString;

    /* Getting display style */

    var display_styles={
      "DIV": "block","P": "block","BLOCKQUOTE":"block",
      "H1": "block","H2": "block","H3": "block","H4": "block",
      "H5": "block","H6": "block","H7": "block","H8": "block",
      "UL": "block","LI": "list-item",
      "DL": "block","DT": "list-item","DD": "list-item",
      "SPAN": "inline","EM": "inline","STRONG": "inline",
      "TT": "inline","DEFN": "inline","A": "inline",
      "TD": "table-cell","TR": "table-row",
      "TABLE": "table", "PRE": "preformatted"};

    function getDisplayStyle(elt){
      return (((window.getComputedStyle)&&(window.getComputedStyle(elt,null))&&
	       (window.getComputedStyle(elt,null).display))||
	      (display_styles[elt.tagName])||
	      "inline");}
    fdjtDOM.getDisplay=getDisplayStyle;

    /* Generating text from the DOM */

    function flatten(string){return string.replace(/\s+/," ");};

    function textify(arg,flat,inside){
      if (arg.text) return flatten(arg.text);
      else if (arg.nodeType)
	if (arg.nodeType===3) return arg.nodeValue;
	else if (arg.nodeType===1) {
	  var children=arg.childNodes;
	  var display_type=getDisplayStyle(arg);
	  var string=""; var suffix="";
	  // Figure out what suffix and prefix to use for this element
	  // If inside is false, don't use anything.
	  if (!(inside)) {}
	  else if (!(display_type)) {}
	  else if (display_type==="inline") {}
	  else if (flat) suffix=" ";
	  else if ((display_type==="block") ||
		   (display_type==="table") ||
		   (display_type==="preformatted")) {
	    string="\n"; suffix="\n";}
	  else if (display_type==="table-row") suffix="\n";
	  else if (display_type==="table-cell") string="\t";
	  else {}
	  var i=0; while (i<children.length) {
	    var child=children[i++];
	    if (!(child.nodeType)) continue;
	    if (child.nodeType===3)
	      if (flat)
		string=string+flatten(child.nodeValue);
	      else string=string+child.nodeValue;
	    else if (child.nodeType===1) {
	      var stringval=textify(child,flat,true);
	      if (stringval) string=string+stringval;}
	    else continue;}
	  return string+suffix;}
	else {}
      else if (arg.toString)
	return arg.toString();
      else return arg.toString();}
    fdjtDOM.textify=textify;

    /* Geometry functions */

    function getGeometry(elt,root,withstack){
      if (typeof elt === 'string')
	elt=document.getElementById(elt);
      var result={};
      var top = elt.offsetTop;
      var left = elt.offsetLeft;
      var stack = ((withstack) ? (new Array(elt)) : false);
      var width=elt.offsetWidth;
      var height=elt.offsetHeight;
	var rootp=((root)&&(root.offsetParent));

      if (elt===root) {
	result.left=0; result.top=0;
	result.width=width; result.height=height;
	return result;}
      elt=elt.offsetParent;
      while (elt) {
	  if ((root)&&((elt===root)||(elt===rootp))) break;
	if (withstack) withstack.push(elt);
	top += elt.offsetTop;
	left += elt.offsetLeft;
	elt=elt.offsetParent;}
	    
      result.left=left; result.top=top;
      result.width=width;
      result.height=height;
	    
      result.right=left+width; result.bottom=top+height;

      if (withstack) result.stack=withstack;

      return result;}
    fdjtDOM.getGeometry=getGeometry;

    function isVisible(elt,partial){
      var start=elt;
      if (!(partial)) partial=false;
      var top = elt.offsetTop;
      var left = elt.offsetLeft;
      var width = elt.offsetWidth;
      var height = elt.offsetHeight;
      var winx=(window.pageXOffset||document.documentElement.scrollLeft||0);
      var winy=(window.pageYOffset||document.documentElement.scrollTop||0);
      var winxedge=winx+(document.documentElement.clientWidth);
      var winyedge=winy+(document.documentElement.clientHeight);
	    
      while(elt.offsetParent) {
	if (elt===window) break;
	elt = elt.offsetParent;
	top += elt.offsetTop;
	left += elt.offsetLeft;}

      if ((elt)&&(!((elt===window)||(elt===document.body)))) {
	// fdjtLog("%o l=%o t=%o",elt,elt.scrollLeft,elt.scrollTop);
	if ((elt.scrollTop)||(elt.scrollLeft)) {
	  fdjtLog("Adjusting for inner DIV");
	  winx=elt.scrollLeft; winy=elt.scrollTop;
	  winxedge=winx+elt.scrollWidth;
	  winyedge=winy+elt.scrollHeight;}}

      /*
	fdjtLog("fdjtIsVisible%s %o top=%o left=%o height=%o width=%o",
	((partial)?("(partial)"):""),start,
	top,left,height,width);
	fdjtLog("fdjtIsVisible %o winx=%o winy=%o winxedge=%o winyedge=%o",
	elt,winx,winy,winxedge,winyedge);
      */
	    
      if (partial)
	// There are three cases we check for:
	return (
		// top of element in window
		((top > winy) && (top < winyedge) &&
		 (left > winx) && (left < winxedge)) ||
		// bottom of element in window
		((top+height > winy) && (top+height < winyedge) &&
		 (left+width > winx) && (left+width < winxedge)) ||
		// top above/left of window, bottom below/right of window
		(((top < winy) || (left < winx)) &&
		 ((top+height > winyedge) && (left+width > winxedge))));
      else return ((top > winy) && (left > winx) &&
		   (top + height) <= (winyedge) &&
		   (left + width) <= (winxedge));}
    fdjtDOM.isVisible=isVisible;

    function isAtTop(elt,delta){
      if (!(delta)) delta=50;
      var top = elt.offsetTop;
      var left = elt.offsetLeft;
      var width = elt.offsetWidth;
      var height = elt.offsetHeight;
      var winx=(window.pageXOffset||document.documentElement.scrollLeft||0);
      var winy=(window.pageYOffset||document.documentElement.scrollTop||0);
      var winxedge=winx+(document.documentElement.clientWidth);
      var winyedge=winy+(document.documentElement.clientHeight);
	    
      while(elt.offsetParent) {
	elt = elt.offsetParent;
	top += elt.offsetTop;
	left += elt.offsetLeft;}

      return ((top>winx) && (top<winyedge) && (top<winx+delta));}
    fdjtDOM.isAtTop=isAtTop;

    function textwidth(node){
      if (node.nodeType===3) return node.nodeValue.length;
      else if ((node.nodeType===1)&&(node.childNodes)) {
	var children=node.childNodes;
	var i=0; var lim=children.length; var width=0;
	while (i<lim) {
	  var child=children[i++];
	  if (child.nodeType===3) width=width+child.nodeValue.length;
	  else if (child.nodeType===1)
	    width=width+textwidth(child);
	  else {}}
	return width;}
      else return 0;}
    fdjtDOM.textWidth=textwidth;

    function hasContent(node,recur){
      if (node.childNodes) {
	var children=node.childNodes;
	var i=0; while (i<children.length) {
	  var child=children[i++];
	  if (child.nodeType===3)
	    if (child.nodeValue.search(/\w/g)>=0) return true;
	    else {}
	  else if ((recur) && (child.nodeType===1))
	    if (hasContent(child)) return true;
	    else {}}
	return false;}
      else return false;}
    fdjtDOM.hasContent=hasContent;

    function hasText(node){
      if (node.childNodes) {
	var children=node.childNodes;
	var i=0; while (i<children.length) {
	  var child=children[i++];
	  if (child.nodeType===3)
	    if (child.nodeValue.search(/\w/g)>=0) return true;
	    else {}}
	return false;}
      else return false;}
    fdjtDOM.hasText=hasText;

    /* A 'refresh method' does a className eigenop to force IE redisplay */

    fdjtDOM.refresh=function(elt){
      elt.className=elt.className;};
    fdjtDOM.setAttrib=function(elt,attrib,val){
      if ((typeof elt === 'string')&&(fdjtID(elt)))
	elt=fdjtID(elt);
      elt.setAttribute(attrib,val);
      elt.className=elt.className;};
    fdjtDOM.dropAttrib=function(elt,attrib){
      if ((typeof elt === 'string')&&(fdjtID(elt)))
	elt=fdjtID(elt);
      elt.removeAttribute(attrib);
      elt.className=elt.className;};

    /* Determining if something has overflowed */

    fdjtDOM.overflowing=function(node){
      // I haven't really tried this cross-browser, but I read it worked and
      //  have been in situations where it would be handy
      return (node.clientHeight!==node.scrollHeight);}

    /* Sizing to fit */

    var default_trace_adjust=false;

    function getInsideBounds(container){
      var left=false; var top=false;
      var right=false; var bottom=false;
      var children=container.childNodes;
      var i=0; var lim=children.length;
      while (i<lim) {
	var child=children[i++];
	if (typeof child.offsetLeft !== 'number') continue;
	var style=getStyle(child);
	if (style.position!=='static') continue;
	var child_left=child.offsetLeft-parsePX(style.marginLeft);
	var child_top=child.offsetTop-parsePX(style.marginTop);
	var child_right=child.offsetLeft+child.offsetWidth+parsePX(style.marginRight);
	var child_bottom=child.offsetTop+child.offsetHeight+parsePX(style.marginBottom);
	if (left===false) {
	  left=child_left; right=child_right;
	  top=child_top; bottom=child_bottom;}
	else {
	  if (child_left<left) left=child_left;
	  if (child_top<top) top=child_top;
	  if (child_right>right) right=child_right;
	  if (child_bottom>bottom) bottom=child_bottom;}}
      return {left: left,right: right,top: top, bottom: bottom,
	  width: right-left,height:bottom-top};}
    fdjtDOM.getInsideBounds=getInsideBounds;
    function applyScale(container,scale,traced){
      var images=fdjtDOM.getChildren(container,"IMG");
      var ilim=images.length;
      var oldscale=container.scale||100;
      if (scale) {
	container.scale=scale;
	container.style.fontSize=scale+'%';
	var rounded=10*Math.round(scale/10);
	fdjtDOM.addClass(container,"fdjtscaled");
	fdjtDOM.swapClass(
			  container,/\bfdjtscale\d+\b/,"fdjtscale"+rounded);}
      else if (!(container.scale)) return;
      else {
	delete container.scale;
	container.style.fontSize="";
	fdjtDOM.dropClass(container,"fdjtscaled");
	fdjtDOM.dropClass(container,/\bfdjtscale\d+\b/);}
      var iscan=0; while (iscan<ilim) {
	var image=images[iscan++];
	if ((fdjtDOM.hasClass(image,"nofdjtscale"))||
	    (fdjtDOM.hasClass(image,"noautoscale")))
	  continue;
	// Reset dimensions to get real info
	image.style.maxWidth=image.style.width=
	  image.style.maxHeight=image.style.height='';
	if (scale) {
	  var width=image.offsetWidth;
	  var height=image.offsetHeight;
	  image.style.maxWidth=image.style.width=
	    Math.round(width*(scale/100))+'px';
	  image.style.maxHeight=image.style.height=
	    Math.round(height*(scale/100))+'px';}}}
	
    function adjustToFit(container,threshold,padding){
      var trace_adjust=(container.traceadjust)||
	fdjtDOM.trace_adjust||
	((container.className)&&(container.className.search(/\btraceadjust\b/)>=0))||
	default_trace_adjust;
      var style=getStyle(container);
      var geom=getGeometry(container);
      var maxheight=((style.maxHeight)&&(parsePX(style.maxHeight)))||
	(geom.height);
      var maxwidth=((style.maxWidth)&&(parsePX(style.maxWidth)))||
	(geom.width);
      var goodenough=threshold||0.1;
      var scale=(container.scale)||100.0;
      var bounds=getInsideBounds(container);
      var hpadding=
	(fdjtDOM.parsePX(style.paddingLeft)||0)+
	(fdjtDOM.parsePX(style.paddingRight)||0)+
	(fdjtDOM.parsePX(style.borderLeftWidth)||0)+
	(fdjtDOM.parsePX(style.borderRightWidth)||0);
      var vpadding=
	(fdjtDOM.parsePX(style.paddingTop)||0)+
	(fdjtDOM.parsePX(style.paddingBottom)||0)+
	(fdjtDOM.parsePX(style.borderTopWidth)||0)+
	(fdjtDOM.parsePX(style.borderBottomWidth)||0);
      maxwidth=maxwidth-hpadding; maxheight=maxheight-vpadding; 
      var itfits=((bounds.height/maxheight)<=1)&&((bounds.width/maxwidth)<=1);
      if (trace_adjust) 
	fdjtLog("Adjust (%o) %s cur=%o%s, best=%o~%o, limit=%ox%o=%o, box=%ox%o=%o, style=%s",
		goodenough,fdjtDOM.nodeString(container),
		scale,((itfits)?" (fits)":""),
		container.bestscale||-1,container.bestfit||-1,
		maxwidth,maxheight,maxwidth*maxheight,
		bounds.width,bounds.height,bounds.width*bounds.height,
		styleString(container));
      if (itfits) {
	/* Figure out how well it fits */
	var fit=Math.max((1-(bounds.width/maxwidth)),
			 (1-(bounds.height/maxheight)));
	var bestfit=container.bestfit||1.5;
	if (!(trace_adjust)) {}
	else if (container.bestscale) 
	  fdjtLog("%s %o~%o vs. %o~%o",
		  ((fit<goodenough)?"Good enough!":
		   ((fit<bestfit)?"Better!":"Worse!")),
		  scale,fit,container.bestscale,container.bestfit);
	else fdjtLog("First fit %o~%o",scale,fit);
	if (fit<bestfit) {
	  container.bestscale=scale; container.bestfit=fit;}
	// If it's good enough, just return
	if (fit<goodenough) {
	  container.goodscale=scale; return;}}
      // Figure out the next scale factor to try
      var dh=bounds.height-maxheight; var dw=bounds.width-maxwidth;
      var rh=maxheight/bounds.height; var rw=maxwidth/bounds.width;
      var newscale=
	((itfits)?
	 (scale*Math.sqrt
	  ((maxwidth*maxheight)/(bounds.width*bounds.height))):
	 (rh<rw)?(scale*rh):(scale*rw));
      if (trace_adjust)
	fdjtLog("[%fs] Trying newscale=%o, rw=%o rh=%o",
		fdjtET(),newscale,rw,rh);
      applyScale(container,newscale,trace_adjust);}
    fdjtDOM.applyScale=applyScale;
    fdjtDOM.adjustToFit=adjustToFit;
    fdjtDOM.insideBounds=getInsideBounds;
    fdjtDOM.finishScale=function(container){
      var traced=(container.traceadjust)||
      fdjtDOM.trace_adjust||default_trace_adjust;
      if (!(container.bestscale)) {
	applyScale(container,false,traced);
	fdjtLog("No good scaling for %o style=%s",
		fdjtDOM.nodeString(container),
		fdjtDOM.styleString(container));
	return;}
      else if (container.scale===container.bestscale) {}
      else applyScale(container,container.bestscale,traced);
      if (traced)
	fdjtLog("Final scale %o~%o for %o style=%s",
		container.bestscale,container.bestfit,
		fdjtDOM.nodeString(container),
		fdjtDOM.styleString(container));
      delete container.bestscale;
      delete container.bestfit;
      delete container.goodscale;};
	
    /* Getting various kinds of metadata */

    function getHTML(){
      var children=document.childNodes;
      var i=0; var lim=children.length;
      while (i<lim)
	if (children[i].tagName==='HTML') return children[i];
	else i++;
      return false;}
    fdjtDOM.getHTML=getHTML;

    function getHEAD(){
      var children=document.childNodes;
      var i=0; var lim=children.length;
      while (i<lim)
	if (children[i].tagName==='HTML') {
	  var grandchildren=children[i].childNodes;
	  i=0; lim=grandchildren.length;
	  while (i<lim)
	    if (grandchildren[i].tagName==='HEAD')
	      return grandchildren[i];
	    else i++;
	  return false;}
	else i++;
      return false;}
    fdjtDOM.getHEAD=getHEAD;

    function getMeta(name,multiple,matchcase,dom){
      var results=[];
      var matchname=((!(matchcase))&&(name.toUpperCase()));
      var elts=((document.getElementsByTagName)?
		(document.getElementsByTagName("META")):
		(getChildren(document,"META")));
      var i=0; while (i<elts.length) {
	if (elts[i])
	  if ((elts[i].name===name)||
	      ((matchname)&&(elts[i].name)&&
	       (elts[i].name.toUpperCase()===matchname))) {
	    if (multiple) {
	      if (dom) results.push(elts[i++]);
	      else results.push(elts[i++].content);}
	    else if (dom) return elts[i];
	    else return elts[i].content;}
	  else i++;}
      if (multiple) return results;
      else return false;}
    fdjtDOM.getMeta=getMeta;

    // This gets a LINK href field
    function getLink(name,multiple,matchcase,dom){
      var results=[];
      var matchname=((!((matchcase)))&&(name.toUpperCase()));
      var elts=((document.getElementsByTagName)?
		(document.getElementsByTagName("LINK")):
		(getChildren(document,"LINK")));
      var i=0; while (i<elts.length) {
	if (elts[i])
	  if ((elts[i].rel===name)||
	      ((matchname)&&(elts[i].rel)&&
	       (elts[i].rel.toUpperCase()===matchname))) {
	    if (multiple) {
	      if (dom) results.push(elts[i++]);
	      else results.push(elts[i++].href);}
	    else if (dom) return elts[i];
	    else return elts[i].href;}
	  else i++;}
      if (multiple) return results;
      else return false;}
    fdjtDOM.getLink=getLink;

    /* Going forward */

    var havechildren=((document)&&
		      (document.body)&&
		      (document.body.childNodes)&&
		      (document.body.children));

    // NEXT goes to the next sibling or the parent's next sibling
    function next_node(node){
      while (node) {
	if (node.nextSibling)
	  return node.nextSibling;
	else node=node.parentNode;}
      return false;}
    function next_element(node){
      if (node.nextElementSibling)
	return node.nextElementSibling;
      else {
	var scan=node;
	while (scan=scan.nextSibling) {
	  if (!(scan)) return null;
	  else if (scan.nodeType===1) break;
	  else {}}
	return scan;}}
    function scan_next(node,test,justelts){
      if (!(test))
	if (justelts) {
	  if (havechildren) return node.nextElementSibling;
	  else return next_element(node);}
	else return next_node(node);
      var scan=((justelts)?
		((havechildren)?
		 (node.nextElementSibling):(next_element(node))):
		((node.nextSibling)||(next_node(node))));
      while (scan)
	if (test(scan)) return scan;
	else if (justelts)
	  scan=((scan.nextElementSibling)||(next_element(scan)));
	else scan=((scan.nextSibling)||(next_node(scan)));
      return false;}

    // FORWARD goes to the first deepest child
    function forward_node(node){
      if ((node.childNodes)&&((node.childNodes.length)>0))
	return node.childNodes[0];
      else while (node) {
	  if (node.nextSibling)
	    return node.nextSibling;
	  else node=node.parentNode;}
      return false;}
    function forward_element(node,n){
      var scan;
      if (n) {
	var i=0; scan=node;
	while (i<n) {scan=forward_element(scan); i++;}
	return scan;}
      if (havechildren) {
	if ((node.children)&&(node.children.length>0)) {
	  return node.children[0];}
	if (scan=node.nextElementSibling) return scan;
	while (node=node.parentNode)
	  if (scan=node.nextElementSibling) return scan;
	return false;}
      else {
	if (node.childNodes) {
	  var children=node.childNodes; var i=0; var lim=children.length;
	  while (i<lim)
	    if ((scan=children[i++])&&(scan.nodeType===1)) return scan;}
	while (scan=node.nextSibling) if (scan.nodeType===1) return scan;
	while (node=node.parentNode)
	  if (scan=next_element(node)) return scan;
	return false;}}
    function scan_forward(node,test,justelts){
      if (!(test)) {
	if (justelts) return forward_element(node);
	else return forward_node(node);}
      var scan=((justelts)?(forward_element(node)):(forward_node(node)));
      while (scan) {
	if (test(scan)) return scan;
	else if (justelts) scan=next_element(scan);
	else scan=next_node(scan);}
      return false;}

    fdjtDOM.nextElt=next_element;
    fdjtDOM.forwardElt=forward_element;
    fdjtDOM.forward=scan_forward;
    fdjtDOM.next=scan_next;

    /* Scanning backwards */

    // PREV goes the parent if there's no previous sibling
    function prev_node(node){
      while (node) {
	if (node.previousSibling)
	  return node.previousSibling;
	else node=node.parentNode;}
      return false;}
    function previous_element(node){
      if (havechildren)
	return node.previousElementSibling;
      else {
	var scan=node;
	while (scan=scan.previousSibling) 
	  if (!(scan)) return null;
	  else if (scan.nodeType===1) break;
	  else {}
	if (scan) return scan;
	else return scan.parentNode;}}
    function scan_previous(node,test,justelts){
      if (!(test))
	if (justelts) {
	  if (havechildren) return node.previousElementSibling;
	  else return previous_element(node);}
	else return previous_node(node);
      var scan=((justelts)?
		((havechildren)?(node.previousElementSibling):
		 (previous_element(node))):
		(previous_node(node)));
      while (scan)
	if (test(scan)) return scan;
	else if (justelts)
	  scan=((havechildren)?(scan.previousElementSibling):(previous_element(scan)));
	else scan=prev_node(scan);
      return false;}

    // BACKWARD goes to the final (deepest last) child
    //  of the previous sibling
    function backward_node(node){
      if (node.previousSibling) {
	var scan=node.previousSibling;
	// If it's not an element, just return it
	if (scan.nodeType!==1) return scan;
	// Otherwise, return the last and deepest child
	while (scan) {
	  var children=scan.childNodes;
	  if (!(children)) return scan;
	  else if (children.length===0) return scan;
	  else scan=children[children.length-1];}
	return scan;}
      else return node.parentNode;}

    function backward_element(node){
      if (havechildren)
	return ((node.previousElementSibling)?
		(get_final_child((node.previousElementSibling))):
		(node.parentNode));
      else if ((node.previousElementSibling)||(node.previousSibling)) {
	var start=(node.previousElementSibling)||(node.previousSibling);
	if (start.nodeType===1) 
	  return get_final_child(start);
	else return start;}
      else return node.parentNode;}
    // We use a helper function because 
    function get_final_child(node){
      if (node.nodeType===1) {
	if (node.childNodes) {
	  var children=node.childNodes;
	  if (!(children.length)) return node;
	  var scan=children.length-1;
	  while (scan>=0) {
	    var child=get_final_child(children[scan--]);
	    if (child) return child;}
	  return node;}
	else return node;}
      else return false;}
	
    function scan_backward(node,test,justelts){
      if (!(test)) {
	if (justelts) return backward_element(node);
	else return backward_node(node);}
      var scan=((justelts)?
		(backward_element(node)):
		(backward_node(node)));
      while (scan) {
	if (test(scan)) return scan;
	else if (justelts) scan=next_element(scan);
	else scan=next_node(scan);}
      return false;}
	
    fdjtDOM.prevElt=previous_element;
    fdjtDOM.backwardElt=backward_element;
    fdjtDOM.backward=scan_backward;
    fdjtDOM.prev=scan_previous;

    /* Viewport/window functions */

    fdjtDOM.viewTop=function(win){
      win=win||window;
      return (win.pageYOffset||win.scrollY||
	      win.document.documentElement.scrollTop||0);};
    fdjtDOM.viewLeft=function(win){
      win=win||window;
      return (win.pageXOffset||win.scrollX||
	      win.document.documentElement.scrollLeft||0);};
    fdjtDOM.viewHeight=function(win){
      win=win||window;
      var docelt=((win.document)&&(win.document.documentElement));
      return (win.innerHeight)||((docelt)&&(docelt.clientHeight));};
    fdjtDOM.viewWidth=function(win){
      win=win||window;
      var docelt=((win.document)&&(win.document.documentElement));
      return ((win.innerWidth)||((docelt)&&(docelt.clientWidth)));};

    /* Listeners (should be in UI?) */

    function addListener(node,evtype,handler){
      if (!(node)) node=document;
      if (typeof node === 'string') node=fdjtID(node);
      else if (node instanceof Array) {
	var i=0; var lim=node.length;
	while (i<lim) addListener(node[i++],evtype,handler);
	return;}
      else if (node.length)
	return addListener(TOA(node),evtype,handler);
      // OK, actually do it
      if (evtype==='title') { 
	// Not really a listener, but helpful
	if (typeof handler === 'string') 
	  if (node.title)
	    node.title='('+handler+') '+node.title;
	  else node.title=handler;}
      else if (evtype[0]==='=')
	node[evtype.slice(1)]=handler;
      else if (node.addEventListener)  {
	// fdjtLog("Adding listener %o for %o to %o",handler,evtype,node);
	return node.addEventListener(evtype,handler,false);}
      else if (node.attachEvent)
	return node.attachEvent('on'+evtype,handler);
      else fdjtLog.warn('This node never listens: %o',node);}
    fdjtDOM.addListener=addListener;

    function addListeners(node,handlers){
      if (handlers) 
	for (evtype in handlers) {
	  if (handlers[evtype])
	    addListener(node,evtype,handlers[evtype]);}}
    fdjtDOM.addListeners=addListeners;

    fdjtDOM.T=function(evt) {
      evt=evt||event; return (evt.target)||(evt.srcElement);};

    fdjtDOM.cancel=function(evt){
      evt=evt||event;
      if (evt.preventDefault) evt.preventDefault();
      else evt.returnValue=false;
      evt.cancelBubble=true;};

    fdjtDOM.init=function(){
      havechildren=((document)&&
		    (document.body)&&
		    (document.body.childNodes)&&
		    (document.body.children));};

    if (navigator.userAgent.search("WebKit")>=0) {
      fdjtDOM.transition='-webkit-transition';
      fdjtDOM.transitionProperty='-webkit-transition-property';
      fdjtDOM.transform='-webkit-transform';
      fdjtDOM.columnWidth='-webkit-column-width';
      fdjtDOM.columnGap='-webkit-column-gap';}
    else if (navigator.userAgent.search("Mozilla")>=0) {
      fdjtDOM.transitionProperty='-moz-transition-property';
      fdjtDOM.transition='-moz-transition';
      fdjtDOM.transform='-moz-transform';
      fdjtDOM.columnWidth='MozColumnWidth';
      fdjtDOM.columnGap='MozColumnGap';}
    else {
      fdjtDOM.transitionProperty='transition-property';
      fdjtDOM.transition='transition';
      fdjtDOM.transform='transform';}
	

    return fdjtDOM;
  })();

function fdjtID(id) {
    return ((id)&&
	    ((document.getElementById(id))||
	     ((id[0]==='#')&&
	      (document.getElementById(id.slice(1))))));}
function _(string) { return string;}

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

var fdjt_kb_id="$Id$";
var fdjt_kb_version=parseInt("$Revision$".slice(10,-1));
fdjt_versions.decl("fdjt/kb",fdjt_kb_version);
fdjt_versions.decl("fdjt",fdjt_kb_version);

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
    of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

    Use, modification, and redistribution of this program is permitted
    under either the GNU General Public License (GPL) Version 2 (or
    any later version) or under the GNU Lesser General Public License
    (version 3 or later).

    These licenses may be found at www.gnu.org, particularly:
      http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
      http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

/*
  _fdjtid: unique integer assigned to objects
  fdjtKB.register (assigns unique ID)
  fdjtKB.Pool (creates a pool of named objects)
  fdjtKB.Set (creates a sorted array for set operations)
  fdjtKB.Ref (objects created within a pool)
 */

var fdjtKB=
    (function(){
	// This is the top level object/module 
	fdjtKB={};
	fdjtKB.revid="$Id$";
	fdjtKB.version=parseInt("$Revision$".slice(10,-1));
	fdjtKB.persist=((window.localStorage)?(true):(false));

	// This turns on debugging, which is further controlled
	//  by properties on pools
	var debug=false;
	fdjtKB.setDebug=function(flag){debug=flag;};

	// This checks if a reference is a 'real object'
	// I.E., something which shouldn't be used as a key
	//  or fast set member and not an array either
	var arrayobjs=(typeof new Array(1,2,3) === 'object');
	var stringobjs=(typeof new String() === 'object');
	function isobject(x){
	  return ((typeof x === 'object')&&
		  (!((arrayobjs)&&(x instanceof Array))));}
	function objectkey(x){
	  if (typeof x !== 'object') return x;
	  else if (x instanceof String) return x.toString();
	  else return x.qid||x.oid||x.uuid||x._fdjtid||register(x);}
	fdjtKB.objectkey=objectkey;
	fdjtKB.isobject=isobject;
	

	// We allocate 16 million IDs for miscellaneous objects
	//  and use counter to track them.
	var counter=0;
	function register(x){
	    return (x._fdjtid)||(x._fdjtid=(++counter));}
	fdjtKB.register=register;

	// This lets us figure out what inits were run in this session.
	var init_start=fdjtTime();

	// Pools are uniquely named id->object mappings
	// This table maps those unique names to the objects themselves
	// Pools can have aliases, so the name->pool mapping is many to one
	var pools={};

	function Pool(name) {
	    if (!(name)) return this;
	    if (pools[name]) return pools[name];
	    pools[name]=this; this.name=name; this.map={};
	    this.index=false; this.storage=false;
	    this.inits=false; this.effects=false; this.xforms={};
	    this.absref=false; // Whether names in this pool are 'absolute'
	    return this;}
	fdjtKB.Pool=Pool;
	fdjtKB.PoolRef=Pool;
	
	Pool.prototype.toJSON=function(){return "@@"+this.name;};
	
	// Check if a named pool exists
	Pool.probe=function(id) {return pools[id]||false;};

	Pool.prototype.addAlias=function(name) {
	    if (pools[name])
		if (pools[name]===this) return this;
	    else throw {error: "pool alias conflict"};
	    else pools[name]=this;};

	Pool.prototype.addEffect=function(prop,handler) {
	    if (!(this.effects)) this.effects={};
	    this.effects[prop]=handler;};
	Pool.prototype.addInit=function(handler) {
	    if (!(this.inits)) this.inits=[];
	    this.inits.push(handler);};

	Pool.prototype.probe=function(id) {
	    if (this.map[id]) return (this.map[id]);
	    else return false;};

	Pool.prototype.load=function(ref) {
	  if (typeof ref==='string')
	    return this.ref(ref).load();
	  else return ref.load();};

	Pool.prototype.ref=function(qid,cons) {
	    if (qid instanceof Ref) return qid;
	    if (this.map[qid]) return this.map[qid];
	    if (!(cons)) cons=this.cons(qid);
	    else if (cons instanceof Ref) {}
	    else cons=this.cons(qid);
	    if (!(cons.qid)) cons.qid=qid;
	    this.map[qid]=cons; cons.pool=this;
	    return cons;};
	Pool.prototype.drop=function(qid) {
	    var val=this.map[qid];
	    if ((val)&&(val.ondrop)) val.ondrop();
	    if (this.storage) this.storage.drop(val);
	    if (!(val)) return;
	    delete this.map[qid];
	    if (val.uuid) delete this.map[val.uuid];
	    if (val.oid) delete this.map[val.oid];}
	
	Pool.prototype.Import=function(data) {
	    if (data instanceof Array) {
		var i=0; var lim=data.length; var results=[];
		while (i<lim) results.push(this.Import(data[i++]));
		return;}
	    else {
		var qid=data.qid||data.oid||data.uuid;
		if ((debug)&&(this.traceimport))
		  fdjtLog("[%fs] Import to %s %o <== %o",
			  fdjtET(),this.name,obj,data);
		if (this.storage) this.storage.Import(data);
		if (qid) {
		    var obj=(this.map[qid]);
		    if (obj) obj.update(data);
		    else {
			obj=this.ref(qid);
			obj.init(data);}
		    return obj;}
		else return data;}};
	
	Pool.prototype.find=function(prop,val){
	    if (!(this.index)) return [];
	    return this.index(false,prop,val);};

	var uuid_pattern=
	    /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/;
	var refmaps=[];
	fdjtKB.addRefMap=function(map){
	  var i=0; var lim=refmaps.length;
	  while (i<lim) if (refmaps[i++]===map) return false;
	  refmaps.push(map);
	  return refmaps.length;};

	function getPool(arg){
	    var atpos; 
	    if (arg instanceof Ref) return arg.pool;
	    else if (typeof arg === 'number') return false;
	    else if (typeof arg === 'string') {
		var ref=parseRef(arg);
		if (ref) return ref.pool;
		else return false;}
	    else return false;}
	fdjtKB.getPool=getPool;

	function parseRef(arg,kno){
	    if (((arg[0]===':')&&(arg[1]==='@'))&&
		(((slash=arg.indexOf('/',2))>=0)))  {
		var pool=fdjtKB.PoolRef(arg.slice(1,slash+1));
		return pool.ref(arg);}
	    else if (((arg[0]==='@'))&&
		     (((slash=arg.indexOf('/',2))>=0)))  {
		var pool=fdjtKB.PoolRef(arg.slice(0,slash+1));
		return pool.ref(arg);}
	    else if ((atpos=arg.indexOf('@'))>1)  {
		var pool=fdjtKB.PoolRef(arg.slice(atpos+1));
		return pool.ref(arg.slice(0,atpos));}
	    else if (arg.search(uuid_pattern)===0) {
		var uuid_type=arg.slice(34);
		var pool=fdjtKB.PoolRef("-UUIDTYPE="+uuid_type);
		return pool.ref(arg);}
	    else if ((arg[0]===':')&&(arg[1]==='#')&&(arg[2]==='U')&&
		     (arg.search(uuid_pattern)===3)) {
		var uuid_type=arg.slice(37);
		var pool=fdjtKB.PoolRef("-UUIDTYPE="+uuid_type);
		return pool.ref(arg.slice(3));}
	    else if (refmaps.length) {
		var i=0; var lim=refmaps.length;
		while (i<lim) {
		    var refmap=refmaps[i++];
		    var ref=((typeof refmap === 'function')?
			     (refmap(arg)):(refmap[arg]));
		    if (ref) return ref;}
		return false;}
	    else if (kno) return kno.ref(arg);
	    else return false;}

	function getRef(arg,kno){
	    if (!(arg)) return false;
	    else if (arg instanceof Ref) return arg;
	    else if (typeof arg === 'number') return false;
	    else if (typeof arg === 'string')
		return parseRef(arg,kno);
	    else return false;}
	fdjtKB.ref=fdjtKB.getRef=getRef;
	function loadRef(arg){
	  var obj=getRef(arg);
	  if (obj) return obj.load();
	  else return undefined;}
	fdjtKB.load=fdjtKB.loadRef=loadRef;
	
	function doimport(data){
	    if (data instanceof Array) {
		var i=0; var lim=data.length; var results=[];
		while (i<lim) results.push(doimport(data[i++]));
		return results;}
	    else {
		var qid=data.qid||data.uuid||data.oid;
		if (qid) {
		    var pool=getPool(qid);
		    if (pool) return pool.Import(data);
		    else return data;}
		else return data;}}
	fdjtKB.Import=doimport;

	// Array utility functions
	function contains(arr,val,start){
	    if (arr.indexOf)
		return (arr.indexOf(val,start)>=0);
	    var i=start||0; var len=arr.length;
	    while (i<len)
		if (arr[i]===val) return true;
	    else i++;
	    return false;}
	function position(arr,val,start){
	    if (arr.indexOf)
		return arr.indexOf(val,start);
	    var i=start||0; var len=arr.length;
	    while (i<len)
		if (arr[i]===val) return i;
	    else i++;
	    return -1;}

	/* Fast sets */
	function set_sortfn(a,b) {
	    if (a===b) return 0;
	    else if (typeof a === typeof b) {
		if (typeof a === "number")
		    return a-b;
		else if (typeof a === "string")
		    if (a<b) return -1;
		else return 1;
		else if (a.qid)
		    if (b.qid)
			if (a.qid<b.qid) return -1;
		else if (a.qid===b.qid) return 0;
		else return 1;
		else return 1;
		else if (b.qid) return -1;
		else if (a._fdjtid)
		    if (b._fdjtid) return a._fdjtid-b._fdjtid;
		else {
		    b._fdjtid=++counter;
		    return -1;}
		else if (b._fdjtid) {
		    a._fdjtid=++counter;
		    return 1;}
		else {
		    a._fdjtid=++counter;
		    b._fdjtid=++counter;
		    return -1;}}
	    else if (typeof a < typeof b) return -1;
	    else return 1;
	}

	function length_sortfn(a,b) {
	    if (a.length===b.length) return 0;
	    else if (a.length<b.length) return -1;
	    else return 1;}

	function intersection(set1,set2){
	    if ((!(set1))||(set1.length===0)) return [];
	    if ((!(set2))||(set2.length===0)) return [];
	    var results=new Array();
	    var i=0; var j=0; var len1=set1.length; var len2=set2.length;
	    var allstrings=set1._allstrings&&set2._allstrings;
	    var new_allstrings=true;
	    while ((i<len1) && (j<len2))
		if (set1[i]===set2[j]) {
		    if ((new_allstrings)&&(typeof set1[i] !== 'string'))
			new_allstrings=false;
		    results.push(set1[i]);
		    i++; j++;}
	    else if ((allstrings)?
		     (set1[i]<set2[j]):
		     (set_sortfn(set1[i],set2[j])<0)) i++;
	    else j++;
	    results._allstrings=new_allstrings;
	    results._sortlen=results.length;
	    return results;}
	fdjtKB.intersection=intersection;
	
	function union(set1,set2){
	    if ((!(set1))||(set1.length===0)) return set2;
	    if ((!(set2))||(set2.length===0)) return set1;
	    var results=new Array();
	    var i=0; var j=0; var len1=set1.length; var len2=set2.length;
	    var allstrings=set1._allstrings&&set2._allstrings;
	    while ((i<len1) && (j<len2))
		if (set1[i]===set2[j]) {
		    results.push(set1[i]); i++; j++;}
	    else if ((allstrings)?
		     (set1[i]<set2[j]):
		     (set_sortfn(set1[i],set2[j])<0))
		results.push(set1[i++]);
	    else results.push(set2[j++]);
	    while (i<len1) results.push(set1[i++]);
	    while (j<len2) results.push(set2[j++]);
	    results._allstrings=allstrings;
	    results._sortlen=results.length;
	    return results;}
	fdjtKB.union=union;

	function merge(set1,set2){
	    if ((!(set1))||(set1.length===0)) {
		set1.concat(set2);
		set1._sortlen=set2._sortlen;
		set1._allstrings=set2._allstrings;
		return set1;}
	    if ((!(set2))||(set2.length===0)) return set1;
	    var results=set1;
	    set1=[].concat(results);
	    var i=0; var j=0; var len1=set1.length; var len2=set2.length;
	    var allstrings=set1._allstrings&&set2._allstrings;
	    while ((i<len1) && (j<len2))
		if (set1[i]===set2[j]) {
		    results.push(set1[i]); i++; j++;}
	    else if ((allstrings)?
		     (set1[i]<set2[j]):
		     (set_sortfn(set1[i],set2[j])<0))
		results.push(set1[i++]);
	    else results.push(set2[j++]);
	    while (i<len1) results.push(set1[i++]);
	    while (j<len2) results.push(set2[j++]);
	    results._allstrings=allstrings;
	    results._sortlen=results.length;
	    return results;}
	fdjtKB.merge=merge;

	function overlaps(set1,set2){
	    if ((!(set1))||(set1.length===0)) return [];
	    if ((!(set2))||(set2.length===0)) return [];
	    var results=new Array();
	    var i=0; var j=0; var len1=set1.length; var len2=set2.length;
	    var allstrings=set1._allstrings&&set2._allstrings;
	    var new_allstrings=true;
	    while ((i<len1) && (j<len2))
		if (set1[i]===set2[j]) return true;
	    else if ((allstrings)?
		     (set1[i]<set2[j]):
		     (set_sortfn(set1[i],set2[j])<0)) i++;
	    else j++;
	    return false;}
	fdjtKB.overlaps=overlaps;

	/* Sets */
	/* sets are really arrays that are sorted to simplify set operations.
	   the ._sortlen property tells how much of the array is sorted */
	function Set(arg){
	    if (arguments.length===0) return [];
	    else if (arguments.length===1) {
		if (!(arg)) return [];
		else if (arg instanceof Array) {
		    if ((!(arg.length))||(arg._sortlen===arg.length))
			return arg;
		    else if (arg._sortlen) return setify(arg);
		    else return setify([].concat(arg));}
		else {
		    var result=[arg]; 
		    if (typeof arg === 'string') result._allstrings=true;
		    result._sortlen=1;
		    return result;}}
	    else {
		var result=[];
		for (arg in arguments)
		    if (!(arg)) {}
		else if (arg instanceof Array) result.concat(arg);
		else result.push(arg);
		return setify(result);}}
	fdjtKB.Set=Set;

	function setify(array) {
	    if (array._sortlen===array.length) return array;
	    // else if ((array._sortlen)&&(array._sortlen>1))
	    else if (array.length===0) return array;
	    else {
		var allstrings=true;
		for (elt in array)
		    if (typeof elt !== 'string') {allstrings=false; break;}
		array._allstrings=allstrings;
		if (allstrings) array.sort();
		else array.sort(set_sortfn);
		var read=1; var write=1; var lim=array.length;
		var cur=array[0];
		while (read<lim)
		    if (array[read]!==cur) {
			cur=array[read++]; write++;}
		else read++;
		array._sortlen=array.length=write;
		return array;}}
	
	fdjtKB.contains=contains;
	fdjtKB.position=position;
	
	function set_add(set,val) {
	    if (val instanceof Array) {
		var changed=false;
		for (elt in val) 
		    if (set_add(set,elt)) changed=true;
		return changed;}
	    else if (set.indexOf) {
		var pos=set.indexOf(val);
		if (pos>=0) return false;
		else set.push(val);
		return true;}
	    else {
		var i=0; var lim=set.length;
		while (i<lim)
		    if (set[i]===val) return false; else i++;
		if (typeof val !== 'string') set._allstrings=false;
		set.push(val);
		return true;}}
	
	function set_drop(set,val) {
	    if (val instanceof Array) {
		var changed=false;
		for (elt in val)
		    if (set_drop(set,elt)) changed=true;
		return changed;}
	    else if (set.indexOf) {
		var pos=set.indexOf(val);
		if (pos<0) return false;
		else set.splice(pos,1);
		return true;}
	    else {
		var i=0; var lim=set.length;
		while (i<lim)
		    if (set[i]===val) {
			array.splice(i,1);
			return true;}
		else i++;
		return false;}}
	
	/* Maps */
	function Map() {
	    this.scalar_map={}; this.object_map={};
	    return this;}
	Map.prototype.get=function(key) {
	  if (isobject(key))
	    return this.object_map
	      [key.qid||key.oid||key.uuid||key._fdjtid||register(key)];
	  else return this.scalar_map[key];};
	Map.prototype.set=function(key,val) {
	  if (isobject(key))
	    this.object_map
	      [key.qid||key.oid||key.uuid||key._fdjtid||register(key)]=val;
	  else this.scalar_map[key]=val;};
	Map.prototype.add=function(key,val) {
	  if (isobject(key)) {
	    var objkey=key.qid||key.oid||key.uuid||key._fdjtid||
	    register(key);
	    var cur=this.object_map[objkey];
	    if (!(cur)) {
	      this.object_map[objkey]=[val];
	      return true;}
	    else if (!(cur instanceof Array)) {
	      if (cur===val) return false;
	      else {
		this.object_map[objkey]=[cur,val];
		return true;}}
	    else if (contains(cur,val)) return false;
	    else {
	      cur.push(val); return true;}}
	  else  {
	    var cur=this.scalar_map[key];
	    if (!(cur)) {
	      this.scalar_map[key]=[val];
	      return true;}
	    else if (!(cur instanceof Array)) {
	      if (cur===val) return false;
	      else {
		this.scalar_map[key]=[cur,val];
		return true;}}
	    else if (contains(cur,val)) return false;
	    else {
	      cur.push(val); return true;}}};
	Map.prototype.drop=function(key,val) {
	  if (!(val)) {
	    if (isobject(key))
	      delete this.object_map
		[key.qid||key.oid||key.uuid||key._fdjtid||register(key)];
	    else delete this.scalar_map[key];}
	  else if (isobject(key)) {
	    var objkey=key.qid||key.oid||key.uuid||key._fdjtid||
	    register(key);
	    var cur=this.object_map[key];
	    if (!(cur)) return false;
	    else if (!(cur instanceof Array)) {
	      if (cur===val) {
		delete this.object_map[objkey];
		return true;}
	      else return false;}
	    else if ((pos=position(val,cur))>=0) {
	      if (cur.length===1) delete this.object_map[objkey];
	      else cur.splice(pos);
	      return true;}
	    else return false;}
	  else {
	    var cur=this.scalar_map[key]; var pos=-1;
	    if (!(cur)) return false;
	    else if (!(cur instanceof Array)) {
	      if (cur===val) {
		delete this.scalar_map[key];
		return true;}
	      else return false;}
	    else if ((pos=position(val,cur))>=0) {
	      if (cur.length===1)
		delete this.scalar_map[key];
	      else cur.splice(pos);
	      return true;}
	    else return false;}};
	fdjtKB.Map=Map;

	/* Indices */

	function Index() {
	    var scalar_indices={};
	    var object_indices={};
	    return function(item,prop,val,add){
	      var valkey; var indices=scalar_indices;
	      if (!(prop))
		return {scalars: scalar_indices, objects: object_indices};
	      else if (!(val))
		return {scalars: scalar_indices[prop],objects: object_indices[prop]};
	      else if (isobject(val)) {
		valkey=val.qid||val.uuid||val.oid||val._fdjtid||
		  register(val);
		indices=object_indices;}
	      else valkey=val;
	      var index=indices[prop];
	      if (!(item))
		if (!(index)) return [];
		else return Set(index[valkey]);
 	      var itemkey=
		((isobject(item))?
		 (item.qid||item.uuid||item.oid||
		  item._fdjtid||register(item)):
		 (item));
	      if (!(index))
		if (add) {
		  indices[prop]=index={};
		  index[valkey]=[itemkey];
		  return true;}
		else return false;
	      var curvals=index[valkey];
	      if (curvals) {
		var pos=position(curvals,itemkey);
		if (pos<0) {
		  if (add) {
		    curvals.push(itemkey);
		    return true;}
		  else return false;}
		else if (add) return false;
		else {
		  var sortlen=curvals._sortlen;
		  curvals.splice(pos,1);
		  if (pos<sortlen) curvals._sortlen--;
		  return true;}}
	      else if (add) {
		index[valkey]=Set(itemkey);
		return true;}
	      else return false;};}
	fdjtKB.Index=Index;

	/* Refs */

	function Ref(pool,qid) {
	    if (pool) this.pool=pool;
	    if (qid) this.qid=qid;
	    return this;}
	fdjtKB.Ref=Ref;
	Pool.prototype.cons=function(qid){return new Ref(this,qid);};

	Ref.prototype.load=function(){
	  if (this._init) return this;
	  else if (this.pool.storage) 
	    return this.pool.storage.load(this);
	  else return undefined;};
	Ref.prototype.get=function(prop){
	    if (this.hasOwnProperty(prop)) return this[prop];
	    else if (this.pool.storage) {
		var fetched=this.pool.storage.get(this,prop);
		if (typeof fetched !== 'undefined')
		    this[prop]=fetched;
		else if (this.hasOwnProperty(prop))
		    return this[prop];
		else return fetched;}
	    else return undefined;};
	Ref.prototype.getSet=function(prop){
	    if (this.hasOwnProperty(prop)) {
		var val=this[prop];
		if (val instanceof Array)
		    if (val._sortlen===val.length) return val;
		else return setify(val);
		else return [val];}
	    else if (this.pool.storage) {
		var fetched=this.pool.storage.get(this,prop);
		if (typeof fetched !== 'undefined')
		    this[prop]=fetched;
		return setify(fetched);}
	    else return [];};
	Ref.prototype.getArray=function(prop){
	    if (this.hasOwnProperty(prop)) {
		var val=this[prop];
		if (val instanceof Array) return val;
		else return [val];}
	    else if (this.pool.storage) {
		var fetched=this.pool.storage.get(this,prop);
		if (typeof fetched !== 'undefined')
		    this[prop]=fetched;
		return [fetched];}
	    else return [];};
	Ref.prototype.add=function(prop,val){
	    if (this.pool.xforms[prop])
		val=this.pool.xforms[prop](val)||val;
	    if (this.hasOwnProperty(prop)) {
		var cur=this[prop];
		if (cur===val) return false;
		else if (cur instanceof Array)
		    if (!(set_add(cur,val))) return false;
		else {}
		else this[prop]=Set([cur,val]);}
	    else this[prop]=val;
	    if (this.pool.storage)
		this.pool.storage.add(this,prop,val);
	    if ((this.pool.effects)&&(this.pool.effects[prop]))
		this.pool.effects[prop](this,prop,val);
	    if (this.pool.index)
		this.pool.index(this,prop,val,true);};
	Ref.prototype.drop=function(prop,val){
	    if (typeof val === 'undefined') val=this[prop];
	    if (this.pool.xforms[prop])
		val=this.pool.xforms[prop](val)||val;
	    var vals=false;
	    if (this.hasOwnProperty(prop)) {
		var cur=this[prop];
		if (cur===val) delete this[prop];
		else if (cur instanceof Array) {
		    if (!(set_drop(cur,val))) return false;
		    if (cur.length===0) delete this[prop];}
		else return false;
		if (this.pool.storage)
		    this.pool.storage.drop(this,prop,val);
		if (this.pool.index)
		    this.pool.index(this,prop,val,false);
		return true;}
	    else return false;};
	Ref.prototype.test=function(prop,val){
	    if (this.pool.xforms[prop])
		val=this.pool.xforms[prop](val)||val;
	    if (this.hasOwnProperty(prop)) {
		if (typeof val === 'undefined') return true;
		var cur=this[prop];
		if (cur===val) return true;
		else if (cur instanceof Array)
		    if (contains(cur,val)) return true;
		else return false;
		else return false;}
	    else if (this.pool.storage) {
		var fetched=this.pool.storage.get(this,prop);
		if (typeof fetched !== 'undefined')
		    this[prop]=fetched;
		else return false;
		if (typeof val === 'undefined') return true;
		else return this.test(prop,val);}
	    else return false;};
	Ref.prototype.ondrop=function(){
	    for (var prop in this)
		if ((prop!=='pool')&&(prop!=='qid'))
		    this.drop(prop,this[prop]);};
	function init_ref(data){
	  var pool=this.pool; var map=pool.map;
	  if ((this._init)&&(this._init>init_start)) return this;
	  if ((debug)&&(pool.traceref))
	    fdjtLog("Initial reference to %o <== %o",this,data);
	  for (key in data)
	    if (!((key==='qid')||(key==='pool'))) {
	      var value=data[key];
	      // Add ref aliases when unique
	      if ((key==='uuid')||(key==='oid')) {
		if (!(map[value])) map[value]=this;
		else if (map[value]!==this)
		  fdjtLog.warn("identifier conflict %o=%o for %o and %o",
			       key,value,map[value],this);
		else {}}
	      if (value instanceof Array) {
		var i=0; var len=value.length;
		while (i<len) this.add(key,value[i++]);}
	      else this.add(key,value);}
	  var inits=pool.inits;
	  if ((inits)&&(debug)&&(pool.traceinit))
	    fdjtLog("Running pool inits for %o: %o",this,inits);
	  var i=0; var lim;
	  this._init=fdjtTime();
	  if (inits) {
	    var lim=inits.length;
	    while (i<lim) inits[i++](this);}
	  var inits=this._inits; delete this._inits;
	  if ((inits)&&(debug)&&(pool.traceinit))
	    fdjtLog("Running delayed inits for %o: %o",this,inits);
	  if (inits) {
	      delete this._inits;
	      i=0; lim=inits.length;
	      while (i<lim) inits[i++](this);}
	  return this;}
	Ref.prototype.init=init_ref;
	// This isn't right
	Ref.prototype.update=init_ref;
	Ref.prototype.oninit=function(fcn,name){
	  var debugging=((debug)&&(this.pool.traceinit));
	    if (this._init) {
	      if (debugging) {
		if (name)
		  fdjtLog("Init (%s) %o on pre-existing %o",name,fcn,this);
		else fdjtLog("Init %o on pre-existing %o",fcn,this);}
	      fcn(this);
	      return true;}
	    else if (this._inits) {
	      // Save up the init functions
	      if (!(name)) {
		if (!(contains(this._inits,fcn))) {
		  if (debugging) fdjtLog("Delaying init on %o: %o",this,fcn);
		  this._inits.push(fcn);}}
	      // Don't do anything if the named init has already been added
	      else if (this._inits[name]) {
		/* Note that name can't be anything that an array object
		   might inherit (like 'length'). */ }
	      else {
		if (debugging)
		  fdjtLog("Delaying init %s on %o: %o",name,this,fcn);
		this._inits[name]=fcn;
		this._inits.push(fcn);}}
	    else if (name) {
	      if (debugging)
		fdjtLog("Delaying init %s on %o: %o",name,this,fcn);
	      this._inits=[fcn];
	      this._inits[name]=fcn;}
	    else {
	      fdjtLog("Delaying init on %o: %o",this,fcn);
	      this._inits=[fcn];}
	  return false;};

	/* Using offline storage to back up pools
	   In the simplest model, the QID is just used as a key
	   in local storage to store a JSON version of the object. */

	function OfflineKB(pool){
	    this.pool=pool;
	    return this;}
	function offline_get(obj,prop){
	    var qid=obj.qid||obj.uuid||obj.oid;
	    var data=fdjtState.getLocal(qid);
	    if (data) obj.init(data);
	    return obj[prop];}
	OfflineKB.prototype.load=function(obj){
	  var qid=obj.qid||obj.uuid||obj.oid;
	  var data=fdjtState.getLocal(qid,true);
	  if (data) return obj.init(data);
	  else return undefined;};
	OfflineKB.prototype.get=offline_get;
	OfflineKB.prototype.add=function(obj,slotid,val){
	    var qid=obj.qid||obj.uuid||obj.oid;
	    if ((slotid)&&(val))
		fdjtState.setLocal(qid,JSON.stringify(obj));};
	OfflineKB.prototype.drop=function(obj,slotid,val){
	    var qid=obj.qid||obj.uuid||obj.oid;
	    if (!(slotid)) fdjtState.dropLocal(qid);
	    else fdjtState.setLocal(qid,JSON.stringify(obj));};
	OfflineKB.prototype.Import=function(obj){
	    var qid=obj.qid||obj.uuid||obj.oid;
	    fdjtState.setLocal(qid,obj,true);};
	fdjtKB.OfflineKB=OfflineKB;
	
	/* Miscellaneous array and table functions */

	fdjtKB.add=function(obj,field,val,nodup){
	    if (arguments.length===2)
		return set_add(obj,field);
	    else if (obj instanceof Ref)
		return obj.add.apply(obj,arguments);
	    else if (nodup) 
		if (obj.hasOwnProperty(field)) {
		    var vals=obj[field];
		    if (!(contains(vals,val)))
			obj[field].push(val);
		    else {}}
	    else obj[field]=new Array(val);
	    else if (obj.hasOwnProperty(field))
		obj[field].push(val);
	    else obj[field]=new Array(val);
	    if ((obj._all) && (!(contains(obj._all,field))))
		obj._all.push(field);};

	fdjtKB.drop=function(obj,field,val){
	    if (arguments.length===2)
		return set_drop(obj,field);
	    else if (obj instanceof Ref)
		return obj.drop.apply(obj,arguments);
	    else if (!(val))
		/* Drop all vals */
		obj[field]=new Array();
	    else if (obj.hasOwnProperty(field)) {
		var vals=obj[field];
		var pos=position(vals,val);
		if (pos<0) return;
		else vals.splice(pos,1);}
	    else {}};

	fdjtKB.test=function(obj,field,val){
	    if (arguments.length===2)
		return set_contains(obj,field);
	    else if (obj instanceof Ref)
		return obj.test.apply(obj,arguments);
	    else if (typeof val === "undefined")
		return (((obj.hasOwnProperty) ?
			 (obj.hasOwnProperty(field)) : (obj[field])) &&
			((obj[field].length)>0));
	    else if (obj.hasOwnProperty(field)) 
		if (position(obj[field],val)<0)
		    return false;
	    else return true;
	    else return false;};

	fdjtKB.insert=function(array,value){
	    if (position(array,value)<0) array.push(value);};

	fdjtKB.remove=function(array,value,count){
	    var pos=position(array,value);
	    if (pos<0) return array;
	    array.splice(pos,1);
	    if (count) {
		count--;
		while ((count>0) &&
		       ((pos=position(array,value,pos))>=0)) {
		    array.splice(pos,1); count--;}}
	    return array;};

	fdjtKB.indexof=function(array,elt,pos){
	    if (array.indexOf)
		if (pos)
		    return array.indexOf(elt,pos);
	    else return array.indexOf(elt);
	    else {
		var i=pos||0;
		while (i<array.length)
		    if (array[i]===elt) return i;
		else i++;
		return -1;}};

	fdjtKB.contains=function(array,elt){
	    if (array.indexOf)
		return (array.indexOf(elt)>=0);
	    else {
		var i=0; var len=array.length;
		while (i<len)
		    if (array[i]===elt) return true;
		else i++;
		return false;}};
	
	return fdjtKB;})();

/* Emacs local variables
;;;  Local variables: ***
;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

var fdjt_ui_id="$Id$";
var fdjt_ui_version=parseInt("$Revision$".slice(10,-1));
fdjt_versions.decl("fdjt/ui",fdjt_ui_version);
fdjt_versions.decl("fdjt",fdjt_ui_version);

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

var fdjtUI=
    {CoHi: {classname: "cohi"},AutoPrompt: {}, InputHelp: {},
     Expansion: {},Collapsible: {},
     Tabs: {}, MultiText: {}};

/* Co-highlighting */
/* When the mouse moves over a named element, the 'cohi' class is added to
   all elements with the same name. */
(function(){
    var highlights={};
    function highlight(namearg,classname_arg){
	var classname=((classname_arg) || (fdjtUI.CoHi.classname));
	var newname=(namearg.name)||(namearg);
	var cur=highlights[classname];
	if (cur===newname) return;
	if (cur) {
	    var drop=document.getElementsByName(cur);
	    var i=0, n=drop.length;
	    while (i<n) fdjtDOM.dropClass(drop[i++],classname);}
	highlights[classname]=newname||false;
	if (newname) {
	    var elts=document.getElementsByName(newname);
	    var n=elts.length, i=0;
	    while (i<n) fdjtDOM.addClass(elts[i++],classname);}}
    
    fdjtUI.CoHi.onmouseover=function(evt,classname_arg){
	var target=fdjtDOM.T(evt);
	while (target)
	    if ((target.tagName==='INPUT') || (target.tagName==='TEXTAREA') ||
		((target.tagName==='A') && (target.href)))
		return;
	else if (target.name) break;  
	else target=target.parentNode;
	if (!(target)) return;
	highlight(target.name,classname_arg);};
    fdjtUI.CoHi.onmouseout=function(evt,classname_arg){
	var target=fdjtDOM.T(evt);
	highlight(false,((classname_arg) || (fdjtUI.CoHi.classname)));};
})();

/* CheckSpans:
   Text regions which include a checkbox where clicking toggles the checkbox. */
(function(){
    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;
    var toggleClass=fdjtDOM.toggleClass;
    var getParent=fdjtDOM.getParent;
    var getChildren=fdjtDOM.getChildren;

    function CheckSpan(spec,varname,val,checked){
	var input=fdjtDOM.Input('input[type=checkbox]',varname,val);
	var span=fdjtDOM(spec||"span.checkspan",input);
	if (checked) {
	    input.checked=true;
	    fdjtDOM.addClass(span,"ischecked");}
	else input.checked=false;
	return span;}
    fdjtUI.CheckSpan=CheckSpan;

    function checkspan_onclick(evt) {
	evt=evt||event;
	target=evt.target||evt.srcTarget;
	var checkspan=getParent(target,".checkspan");
	if ((target.tagName==='INPUT')&&
	    ((target.type=='checkbox')||(target.type=='radio'))) {
	    target.blur();
	    if (target.checked) addClass(checkspan,"checked");
	    else dropClass(checkspan,"checked");}
	else {
	    var inputs=getChildren
	    (checkspan,function(elt){
		return (elt.nodeType===1)&&
		    (elt.tagName==='INPUT')&&
		    ((elt.type=='checkbox')||(elt.type=='radio'));});
	    var input=((inputs)&&(inputs.length)&&(inputs[0]));
	    if (input) 
		if (input.checked) {
		    dropClass(checkspan,"ischecked");
		    input.checked=false; input.blur();}
	    else {
		addClass(checkspan,"ischecked");
		input.checked=true; input.blur();}
	    else toggleClass(checkspan,"ischecked");}}
    fdjtUI.CheckSpan.onclick=checkspan_onclick;

    function checkspan_set(checkspan,checked){
	if (!(hasClass(checkspan,".checkspan")))
	    checkspan=getParent(checkspan,".checkspan")||checkspan;
	var inputs=getChildren
	(checkspan,function(node){
	    return (node.tagName==='INPUT')&&
		((node.type=='checkbox')||(node.type=='radio'));});
	var input=((inputs)&&(inputs.length)&&(inputs[0]));
	if (checked) {
	    input.checked=true; addClass(checkspan,"ischecked");}
	else {
	    input.checked=false; dropClass(checkspan,"ischecked");}}
    fdjtUI.CheckSpan.set=checkspan_set;})();

(function(){

    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;

    function show_help_onfocus(evt){
	var target=fdjtDOM.T(evt);
	while (target)
	    if ((target.nodeType==1) &&
		((target.tagName === 'INPUT') ||
		 (target.tagName === 'TEXTAREA')) &&
		(target.getAttribute('helptext'))) {
		var helptext=fdjtID(target.getAttribute('helptext'));
		if (helptext) fdjtDOM.addClass(helptext,"showhelp");
		return;}
	else target=target.parentNode;}
    function autoprompt_onfocus(evt){
	evt=evt||event||null;
	var elt=fdjtDOM.T(evt);
	if ((elt) && (hasClass(elt,'isempty'))) {
	    elt.value=''; dropClass(elt,'isempty');}
	show_help_onfocus(evt);}

    function hide_help_onblur(evt){
	var target=fdjtDOM.T(evt);
	while (target)
	    if ((target.nodeType==1) &&
		((target.tagName === 'INPUT') || (target.tagName === 'TEXTAREA')) &&
		(target.getAttribute('HELPTEXT'))) {
		var helptext=fdjtID(target.getAttribute('HELPTEXT'));
		if (helptext) dropClass(helptext,"showhelp");
		return;}
	else target=target.parentNode;}
    function autoprompt_onblur(evt){
	var elt=fdjtDOM.T(evt);
	if (elt.value==='') {
	    addClass(elt,'isempty');
	    var prompt=(elt.prompt)||(elt.getAttribute('prompt'))||(elt.title);
	    if (prompt) elt.value=prompt;}
	else dropClass(elt,'isempty');
	hide_help_onblur(evt);}
    
    // Removes autoprompt text from empty fields
    function autoprompt_cleanup(form) {
	var elements=fdjtDOM.getChildren(form,".isempty");
	if (elements) {
	    var i=0; var lim=elements.length;
	    while (i<elements.length) elements[i++].value="";}}
    function autoprompt_onsubmit(evt) {
	var form=fdjtDOM.T(evt);
	autoprompt_cleanup(form);}

    var isEmpty=fdjtString.isEmpty;
    // Adds autoprompt handlers to autoprompt classes
    function autoprompt_setup(arg,nohandlers) {
	var forms=
	    ((arg.tagName==="FORM")?[arg]:
	     (fdjtDOM.getChildren(arg||document.body,"FORM")));
	var i=0; var lim=forms.length;
	while (i<lim) {
	    var form=forms[i++];
	    var inputs=fdjtDOM.getChildren
	    (form,"INPUT.autoprompt,TEXTAREA.autoprompt");
	    if (inputs.length) {
		var j=0; var jlim=inputs.length;
		while (j<jlim) {
		    var input=inputs[j++];
		    input.blur();
		    if (isEmpty(input.value)) {
			addClass(input,"isempty");
			var prompt=(input.prompt)||
			    (input.getAttribute('prompt'))||(input.title);
			if (prompt) input.value=prompt;}
		    if (!(nohandlers)) {
			fdjtDOM.addListener(input,"focus",autoprompt_onfocus);
			fdjtDOM.addListener(input,"blur",autoprompt_onblur);}}
		if (!(nohandlers))
		    fdjtDOM.addListener(form,"submit",autoprompt_onsubmit);}}}
    
    fdjtUI.AutoPrompt.setup=autoprompt_setup;
    fdjtUI.AutoPrompt.onfocus=autoprompt_onfocus;
    fdjtUI.AutoPrompt.onblur=autoprompt_onblur;
    fdjtUI.AutoPrompt.onsubmit=autoprompt_onsubmit;
    fdjtUI.AutoPrompt.cleanup=autoprompt_cleanup;
    fdjtUI.InputHelp.onfocus=show_help_onfocus;
    fdjtUI.InputHelp.onblur=hide_help_onblur;})();


(function(){
  function multitext_keypress(evt,sepch){
	evt=(evt)||(event);
	var ch=evt.charCode;
	var target=fdjtUI.T(evt);
	if (typeof sepch === 'string') sepch=sepch.charCodeAt(0);
	if ((ch!==13)&&(sepch)&&(sepch!=ch)) return;
	fdjtUI.cancel(evt);
	var checkbox=
	    fdjtDOM.Input("[type=checkbox]",target.name,target.value);
	var div=fdjtDOM("div.checkspan",checkbox,target.value);
	checkbox.checked=true;
	fdjtDOM(target.parentNode,div);
	target.value='';}
    fdjtUI.MultiText.keypress=multitext_keypress;})();

(function(){
    var serial=0;

    /* Constants */
    // Always set to distinguish no options from false
    var FDJT_COMPLETE_OPTIONS=1;
    // Whether the completion element is a cloud (made of spans)
    var FDJT_COMPLETE_CLOUD=2;
    // Whether to require that completion match an initial segment
    var FDJT_COMPLETE_ANYWORD=4;
    // Whether to match case in keys to completions
    var FDJT_COMPLETE_MATCHCASE=8;
    // Whether to an enter character always picks a completion
    var FDJT_COMPLETE_EAGER=16;
    // Whether the key fields may contain disjoins (e.g. (dog|friend))
    // to be accomodated in matching
    var FDJT_COMPLETE_DISJOINS=32;
    // Default options
    var default_options=FDJT_COMPLETE_OPTIONS;
    // Max number of completions to show
    var maxcomplete=50;
    // Milliseconds to wait for auto complete
    var complete_delay=100;

    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;
    var getChildren=fdjtDOM.getChildren;
    var getParent=fdjtDOM.getParent;
    var position=fdjtKB.position;

    var isEmpty=fdjtString.isEmpty;
    var hasPrefix=fdjtString.hasPrefix;
    var prefixAdd=fdjtString.prefixAdd;
    var prefixFind=fdjtString.prefixFind;
    var commonPrefix=fdjtString.commonPrefix;

    fdjtUI.FDJT_COMPLETE_OPTIONS=FDJT_COMPLETE_OPTIONS;
    fdjtUI.FDJT_COMPLETE_CLOUD=FDJT_COMPLETE_CLOUD;
    fdjtUI.FDJT_COMPLETE_ANYWORD=FDJT_COMPLETE_ANYWORD;
    fdjtUI.FDJT_COMPLETE_MATCHCASE=FDJT_COMPLETE_MATCHCASE;
    fdjtUI.FDJT_COMPLETE_EAGER=FDJT_COMPLETE_EAGER;

    function Completions(dom,input,options) {
	this.dom=dom||false; this.input=input||false;
	this.options=options||default_options;
	this.nodes=[]; this.values=[]; this.serial=++serial;
	this.cues=[]; this.displayed=[];
	this.prefixtree={strings: []};
	this.bykey={}; this.byvalue=new fdjtKB.Map();
	if (!(options&FDJT_COMPLETE_MATCHCASE)) this.stringmap={};
	this.initialized=false;
	return this;}
    Completions.probe=function(arg){
	if (arg.tagName==='INPUT') {
	    var cid=arg.getAttribute('COMPLETIONS');
	    arg=fdjtID(cid);
	    if (arg) completions.get(arg);
	    else return false;}
	else return completions.get(arg);};

    function getKey(node){
	return node.key||(node.getAttribute("key"))||(node.value)||
	    (node.getAttribute("value"))||
	    ((hasClass(node,"variation"))&&(fdjtDOM.textify(node)))||
	    ((hasClass(node,"completion"))&&(completionText(node,"")));}
    Completions.getKey=getKey;
    function completionText(node,sofar){
	if (hasClass(node,"variation")) return sofar;
	else if (node.nodeType===3) return sofar+node.nodeValue;
	else if ((node.nodeType===1)&&(node.childNodes)) {
	    var children=node.childNodes;
	    var i=0; var lim=children.length;
	    while (i<lim) {
		var child=children[i++];
		if (child.nodeType===3) sofar=sofar+child.nodeValue;
		else if (child.nodeType===1)
		    sofar=completionText(child,sofar);
		else {}}
	    return sofar;}
	else return sofar;}

    function getValue(node){
	if (!(hasClass(node,"completions")))
	    node=getParent(node,".completions");
	var completions=((node)&&(Completions.probe(node)));
	if (completions)
	    return completions.getValue(node);
	else return false;}
    Completions.getValue=getValue;

    function addNodeKey(node,keystring,ptree,bykey,anywhere){
	var keys=((anywhere)?(keystring.split(/\W/g)):[]).concat(keystring);
	var i=0; var lim=keys.length;
	while (i<lim) {
	    var key=keys[i++];
	    prefixAdd(ptree,key,0);
	    if ((bykey[key])&&(bykey.hasOwnProperty(key)))
		bykey[key].push(node);
	    else bykey[key]=new Array(node);
	    bykey._count++;}}

    function getNodes(string,ptree,bykey,matchcase){
	var result=[]; var direct=[]; var variations=[];
	var keystring=stdspace(string);
	if (isEmpty(keystring)) return [];
	if (!(matchcase)) keystring=string.toLowerCase();
	var strings=prefixFind(ptree,keystring,0);
	var prefix=false;
	var exact=[]; var exactheads=[]; var keys=[];
	var i=0; var lim=strings.length;
	while (i<lim) {
	    var string=strings[i++];
	    var isexact=(string===keystring);
	    if (prefix) prefix=commonPrefix(prefix,string);
	    else prefix=string;
	    var completions=bykey[string];
	    if (completions) {
		var j=0; var jlim=completions.length;
		while (j<jlim) {
		    var c=completions[j++];
		    if (hasClass(c,"completion")) {
			if (isexact) {exactheads.push(c); exact.push(c);}
			result.push(c); keys.push(string); direct.push(c);}
		    else {
			var head=getParent(c,".completion");
			if (head) {
			    if (isexact) exact.push(head);
			    result.push(head); keys.push(string);
			    variations.push(c);}}}}}
	if (exact.length) result.exact=exact;
	if (exactheads.length) result.exactheads=exactheads;
	result.prefix=prefix;
	result.strings=strings;
	result.matches=direct.concat(variations);
	return result;}

    function addCompletion(c,completion,key,value) {
	if (!(key)) key=completion.key||getKey(completion);
	if (!(value))
	    value=(completion.value)||(completion.getAttribute('value'))||key;
	var pos=position(c.nodes,completion);
	if (pos<0) {
	    c.nodes.push(completion); c.values.push(value);
	    c.byvalue.add(value,completion);}
	else return;
	var opts=c.options;
	var container=c.dom;
	var ptree=c.prefixtree;
	var bykey=c.bykey;
	var smap=c.stringmap;
	var stdkey=stdspace(key);
	var matchcase=(opts&FDJT_COMPLETE_MATCHCASE);
	var anyword=(opts&FDJT_COMPLETE_ANYWORD);
	if (!(matchcase)) {
	    var lower=stdkey.toLowerCase();
	    smap[lower]=stdkey;
	    stdkey=lower;}
	if (!(getParent(completion,container)))
	    fdjtDOM.append(container,completion," ");
	addNodeKey(completion,stdkey,ptree,bykey,anyword);
	if (hasClass(completion,"cue")) c.cues.push(completion);
	var variations=getChildren(completion,".variation");
	var i=0; var lim=variations.length;
	while (i<lim) {
	    var variation=variations[i++];
	    var vkey=stdspace(variation.key||getKey(variation));
	    addNodeKey(variation,vkey,ptree,bykey,anyword);}}

    function initCompletions(c){
	var completions=getChildren(c.dom,".completion");
	var i=0; var lim=completions.length;
	while (i<lim) addCompletion(c,completions[i++]);
	c.initialized=true;}

    Completions.prototype.addCompletion=function(completion) {
	if (!(this.initialized)) initCompletions(this);
	addCompletion(this,completion);};

    function updateDisplay(c,todisplay){
	var displayed=c.displayed;
	if (displayed) {
	    var i=0; var lim=displayed.length;
	    while (i<lim) dropClass(displayed[i++],"displayed");
	    c.displayed=displayed=[];}
	else c.displayed=displayed=[];
	if (todisplay) {
	    var i=0; var lim=todisplay.length;
	    while (i<lim) {
		var node=todisplay[i++];
		if (hasClass(node,"completion")) {
		    addClass(node,"displayed");
		    displayed.push(node);}
		else {
		    var head=getParent(node,".completion");
		    if ((head)&&(!(hasClass(head,"displayed")))) {
			displayed.push(node); displayed.push(head);
			addClass(head,"displayed");
			addClass(node,"displayed");}}}}}


    Completions.prototype.getCompletions=function(string) {
	if ((string===this.curstring)||(string===this.maxstring)||
	    ((this.curstring)&&(this.maxstring)&&
	     (hasPrefix(string,this.curstring))&&
	     (hasPrefix(this.maxstring,string))))
	    return this.result;
	else {
	    var result;
	    if (!(this.initialized)) initCompletions(this);
	    if (isEmpty(string)) {
		result=[]; result.prefix=""; result.matches=[];
		if (this.dom) addClass(this.dom,"noinput");}
	    else {
		result=getNodes(string,this.prefixtree,this.bykey);
		if (this.dom) dropClass(this.dom,"noinput");
		updateDisplay(this,result.matches);}
	    if ((this.stringmap)&&(this.strings)) {
		var stringmap=this.stringmap;
		var strings=this.strings;
		var i=0; var lim=strings.length;
		while (i<lim) {
		    var s=strings[i]; var m=stringmap[s];
		    if (m) strings[i++]=m;
		    else i++;}}
	    this.curstring=string;
	    this.maxstring=result.prefix||string;
	    this.result=result;
	    return result;}};

    Completions.prototype.getValue=function(completion) {
	if (completion.value) return completion.value;
	else if (completion.getAttribute("value"))
	    return completion.getAttribute("value");
	var pos=position(this.nodes,completion);
	if (pos<0) return false;
	else return this.values[pos];};
    Completions.prototype.getKey=function(completion) {
	if (completion.key) return completion.value;
	else if (completion.getAttribute("key"))
	    return completion.getAttribute("key");
	var pos=position(this.nodes,completion);
	if (pos<0) return false;
	else return this.values[pos];};

    Completions.prototype.complete=function(string){
	if (!(this.initialized)) initCompletions(this);
	// fdjtLog("Completing on %o",string);
	if ((!(string))&&(string!==""))
	    string=((this.getText)?(this.getText(this.input)):
		    (hasClass(this.input,"isempty"))?(""):
		    (this.input.value));
	if (isEmpty(string)) {
	    if (this.displayed) updateDisplay(this,false);
	    addClass(this.dom,"noinput");
	    dropClass(this.dom,"noresults");
	    return [];}
	var result=this.getCompletions(string);
	if ((!(result))||(result.length===0)) {
	    updateDisplay(this,false);
	    dropClass(this.dom,"noinput");
	    addClass(this.dom,"noresults");
	    return [];}
	else {
	    updateDisplay(this,result.matches);
	    dropClass(this.dom,"noinput");
	    dropClass(this.dom,"noresults");}
	return result;};

    Completions.prototype.getByValue=function(values,spec){
	if (!(this.initialized)) initCompletions(this);
	var result=[];
	var byvalue=this.byvalue;
	if (spec) spec=new fdjtDOM.Selector(spec);
	if (!(values instanceof Array)) values=[values];
	var i=0; var lim=values.length;
	while (i<lim) {
	    var value=values[i++];
	    var completions=byvalue.get(value);
	    if (completions) {
		if (spec) {
		    var j=0; var jlim=completions.length;
		    while (j<jlim) {
			if (spec.match(completions[j]))
			    result.push(completions[j++]);
			else j++;}}
		else result=result.concat(completions);}}
	return result;};
    Completions.prototype.getByKey=function(keys,spec){
	if (!(this.initialized)) initCompletions(this);
	var result=[];
	var byvalue=this.bykey;
	if (spec) spec=new fdjtDOM.Selector(spec);
	if (!(keys instanceof Array)) keys=[keys];
	var i=0; var lim=keys.length;
	while (i<lim) {
	    var key=keys[i++];
	    var completions=bykey.get(key);
	    if (completions) {
		if (spec) {
		    var j=0; var jlim=completions.length;
		    while (j<jlim) {
			if (spec.match(completions[j]))
			    result.push(completions[j++]);
			else j++;}}
		else result=result.concat(completions);}}
	return result;};

    Completions.prototype.setCues=function(values){
	if (!(this.initialized)) initCompletions(this);
	var cues=[];
	var byvalue=this.byvalue;
	var i=0; var lim=values.length;
	while (i<lim) {
	    var value=values[i++];
	    var completions=byvalue.get(value);
	    if (completions) {
		var j=0; var jlim=completions.length;
		while (j<jlim) {
		    var c=completions[j++];
		    if (hasClass(c,"cue")) continue;
		    addClass(c,"cue");
		    cues.push(c);}}}
	return cues;};
    
    Completions.prototype.docomplete=function(input,callback){
	if (!(this.initialized)) initCompletions(this);
	if (!(input)) input=this.input;
	var delay=this.complete_delay||complete_delay;
	var that=this;
	if (this.timer) {
	    clearTimeout(that.timer);
	    that.timer=false;}
	this.timer=setTimeout(
	    function(){
		if (!(input)) input=that.input;
		var completions=that.complete(input.value);
		if (callback) callback(completions);},
	    delay);}

    function stdspace(string){
	return string.replace(/\s+/," ").replace(/(^\s)|(\s$)/,"");}

    fdjtUI.Completions=Completions;

    var cached_completions={};

    var default_options=
	FDJT_COMPLETE_OPTIONS|
	FDJT_COMPLETE_CLOUD|
	FDJT_COMPLETE_ANYWORD;

    function onkey(evt){
	evt=evt||event;
	var target=fdjtUI.T(evt);
	var name=target.name;
	var completions=cached_completions[name];
	var compid=fdjtDOM.getAttrib(target,"completions");
	var dom=((compid)&&(fdjtID(compid)));
	if (!(dom)) return;
	if (!((completions)&&(completions.dom===dom))) {
	    completions=new Completions(dom,target,default_options);
	    cached_completions[name]=completions;}
	if (!(completions)) return;
	completions.docomplete();}
    fdjtUI.Completions.onkey=onkey;}());

/* Tabs */

(function(){
    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;
    
    function tab_onclick(evt,shownclass){
	var elt=fdjtUI.T(evt);
	if (!(shownclass)) {
	    shownclass=
		fdjtDOM.findAttrib(elt,"shownclass","http://fdjt.org/")||
		"fdjtshown";}
	if (elt) {
	    var content_id=false;
	    while (elt.parentNode) {
		if (content_id=fdjtDOM.getAttrib(elt,"contentid")) break;
		else elt=elt.parentNode;}
	    if (!(content_id)) return;
	    var content=document.getElementById(content_id);
	    var parent=fdjtDOM.getParent(elt,".tabs")||elt.parentNode;
	    var sibs=fdjtDOM.getChildren(parent,".tab")||parent.childNodes;
	    if (content===null) {
		fdjtLog("No content for "+content_id);
		return;}
	    var i=0; while (i<sibs.length) {
		var node=sibs[i++]; var cid;
		if ((node.nodeType===1) &&
		    (cid=fdjtDOM.getAttrib(node,"contentid"))) {
		    if (!(cid)) continue;
		    var cdoc=document.getElementById(cid);
		    if (node===elt) {}
		    else if (hasClass(node,shownclass)) {
			dropClass(node,shownclass);
			if (cdoc) dropClass(cdoc,shownclass);}}}
	    if (hasClass(elt,shownclass)) {
		dropClass(elt,shownclass);
		dropClass(content,shownclass);}
	    else {
		addClass(elt,shownclass);
		addClass(content,shownclass);}
	    var tabstate=fdjtDOM.findAttrib(elt,'tabstate');
	    if (!(tabstate)) {}
	    else if (tabstate==='#') {
		var scrollstate={};
		fdjtUI.scrollSave(scrollstate);
		document.location.hash=tabstate+content_id;
		fdjtUI.scrollRestore(scrollstate);}
	    else fdjtState.setCookie(tabstate,content_id);
	    // This lets forms pass tab information along
	    return false;}}
    fdjtUI.Tabs.click=tab_onclick;
    
    function select_tab(tabbar,contentid,shownclass){
	if (!(shownclass)) {
	    shownclass=
		fdjtDOM.findAttrib(tabbar,"shownclass","http://fdjt.org/")||
		"fdjtshown";}
	var tabseen=false;
	var tabs=fdjtDOM.getChildren(tabbar,".tab");
	var i=0; while (i<tabs.length) {
	    var tab=tabs[i++];
	    if ((tab.getAttribute("contentid"))===contentid) {
		addClass(tab,shownclass); tabseen=true;}
	    else if (hasClass(tab,shownclass)) {
		dropClass(tab,shownclass);
		var cid=fdjtDOM.getAttrib(tab,"contentid");
		var content=(cid)&&fdjtID(cid);
		if (!(content))
		    fdjtWarn("No reference for tab content %o",cid);
		else dropClass(content,shownclass);}
	    else dropClass(tab,shownclass);}
	if (fdjtID(contentid)) {
	    if (tabseen) addClass(contentid,shownclass);
	    else fdjtLog.warn("a tab for %s was not found in %o",
			      contentid,tabbar);}
	else fdjtLog.warn("No reference for tab content %o",contentid);}
    fdjtUI.Tabs.selectTab=select_tab;
    
    function setupTabs(elt){
	if (!(elt)) elt=fdjtDOM.$(".tabs[tabstate]");
	else if (typeof elt === 'string') elt=fdjtID(elt);
	if ((!(elt))||(!(elt.getAttribute("tabstate")))) return;
	var tabstate=elt.getAttribute("tabstate");
	var content_id=false;
	if (tabstate==='#') {
	    content_id=document.location.hash;
	    if (content_id[0]==='#') content_id=content_id.slice(1);
	    var content=((content_id)&&(fdjtID(content_id)));
	    if (!(content)) return;
	    var ss={}; fdjtUI.scrollSave(ss);
	    window.scrollTo(0,0);
	    if (!(fdjtDOM.isVisible(content)))
		fdjtUI.scrollRestore(ss);}
	else content_id=fdjtState.getQuery(tabstate)||
	    fdjtState.getCookie(tabstate);
	if (!(content_id)) return;
	if (content_id[0]==='#') content_id=content_id.slice(1);
	if (content_id) select_tab(elt,content_id);}
    fdjtUI.Tabs.setup=setupTabs;
    
    function selected_tab(tabbar){
	var tabs=fdjtDOM.getChildren(tabbar,".tab");
	var i=0; while (i<tabs.length) {
	    var tab=tabs[i++];
	    if (hasClass(tag,"shown"))
		return tag.getAttribute("contentid");}
	return false;}
    fdjtUI.Tabs.getSelected=selected_tab;}());


/* Delays */

(function(){
    var timeouts={};
    
    fdjtUI.Delay=function(interval,name,fcn){
	window.setTimeout(fcn,interval);};}());

/* Expansion */

fdjtUI.Expansion.toggle=function(evt,spec,exspec){
  evt=evt||event;
    var target=fdjtUI.T(evt);
    var wrapper=fdjtDOM.getParent(target,spec||".fdjtexpands");
    if (wrapper) fdjtDOM.toggleClass(wrapper,exspec||"fdjtexpanded");};
fdjtUI.Expansion.onclick=fdjtUI.Expansion.toggle;

fdjtUI.Collapsible.click=function(evt){
  evt=evt||event;
  var target=fdjtUI.T(evt);
  if (fdjtUI.isDefaultClickable(target)) return;
  var wrapper=fdjtDOM.getParent(target,".collapsible");
  if (wrapper) {
    fdjtUI.cancel(evt);
    fdjtDOM.toggleClass(wrapper,"expanded");};};

fdjtUI.Collapsible.focus=function(evt){
  evt=evt||event;
  var target=fdjtUI.T(evt);
  var wrapper=fdjtDOM.getParent(target,".collapsible");
  if (wrapper) {
    fdjtDOM.toggleClass(wrapper,"expanded");};};

/* Temporary Scrolling */

(function(){
    var saved_scroll=false;
    var use_native_scroll=false;
    var preview_elt=false;

    function scroll_discard(ss){
	if (ss) {
	    ss.scrollX=false; ss.scrollY=false;}
	else saved_scroll=false;}

    function scroll_save(ss){
	if (ss) {
	    ss.scrollX=window.scrollX; ss.scrollY=window.scrollY;}
	else {
	    if (!(saved_scroll)) saved_scroll={};
	    saved_scroll.scrollX=window.scrollX;
	    saved_scroll.scrollY=window.scrollY;}}
    
    function scroll_offset(wleft,eleft,eright,wright){
	var result;
	if ((eleft>wleft) && (eright<wright)) return wleft;
	else if ((eright-eleft)<(wright-wleft)) 
	    return eleft-Math.floor(((wright-wleft)-(eright-eleft))/2);
	else return eleft;}

    function scroll_into_view(elt,topedge){
	if ((topedge!==0) && (!topedge) && (fdjtDOM.isVisible(elt)))
	    return;
	else if ((use_native_scroll) && (elt.scrollIntoView)) {
	    elt.scrollIntoView(top);
	    if ((topedge!==0) && (!topedge) && (fdjtDOM.isVisible(elt,true)))
		return;}
	else {
	    var top = elt.offsetTop;
	    var left = elt.offsetLeft;
	    var width = elt.offsetWidth;
	    var height = elt.offsetHeight;
	    var winx=(window.pageXOffset||document.documentElement.scrollLeft||0);
	    var winy=(window.pageYOffset||document.documentElement.scrollTop||0);
	    var winxedge=winx+(document.documentElement.clientWidth);
	    var winyedge=winy+(document.documentElement.clientHeight);
	    
	    while(elt.offsetParent) {
		elt = elt.offsetParent;
		top += elt.offsetTop;
		left += elt.offsetLeft;}
	    
	    var targetx=scroll_offset(winx,left,left+width,winxedge);
	    var targety=
		(((topedge)||(topedge===0)) ?
		 ((typeof topedge === "number") ? (top+topedge) : (top)) :
		 (scroll_offset(winy,top,top+height,winyedge)));
	    
	    var vh=fdjtDOM.viewHeight();
	    var x=0; var y;
	    var y_target=top+(height/3);
	    if ((2*(height/3))<((vh/2)-50))
		y=y_target-vh/2;
	    else if ((height)<(vh-100))
		y=top-(50+(height/2));
	    else y=top-50;

	    window.scrollTo(x,y);}}

    fdjtUI.scrollTo=function(target,id,context,discard,topedge){
	scroll_discard(discard);
	if (id) document.location.hash=id;
	if (context) {
	    setTimeout(function() {
		scroll_into_view(context,topedge);
		if (!(fdjtDOM.isVisible(target))) {
		    scroll_into_view(target,topedge);}},
		       100);}
	else setTimeout(function() {scroll_into_view(target,topedge);},100);};

    function scroll_preview(target,context,delta){
	/* Stop the current preview */
	if (!(target)) {
	    stop_preview(); return;}
	/* Already previewing */
	if (target===preview_elt) return;
	if (!(saved_scroll)) scroll_save();
	if (typeof target === 'number')
	    window.scrollTo(((typeof context === 'number')&&(context))||0,target);
	else scroll_into_view(target,delta);
	preview_elt=target;}

    function scroll_restore(ss){
	if (preview_elt) {
	    preview_elt=false;}
	if ((ss) && (typeof ss.scrollX === "number")) {
	    // fdjtLog("Restoring scroll to %d,%d",ss.scrollX,ss.scrollY);    
	    window.scrollTo(ss.scrollX,ss.scrollY);
	    return true;}
	else if ((saved_scroll) &&
		 ((typeof saved_scroll.scrollY === "number") ||
		  (typeof saved_scroll.scrollX === "number"))) {
	    // fdjtLog("Restoring scroll to %o",_fdjt_saved_scroll);
	    window.scrollTo(saved_scroll.scrollX,saved_scroll.scrollY);
	    saved_scroll=false;
	    return true;}
	else return false;}

    function stop_preview(){
	fdjtDOM.dropClass(document.body,"preview");
	if ((preview_elt) && (preview_elt.className))
	    fdjtDOM.dropClass(preview_elt,"previewing");
	preview_elt=false;}

    fdjtUI.scrollSave=scroll_save;
    fdjtUI.scrollRestore=scroll_restore;
    fdjtUI.scrollIntoView=scroll_into_view;
    fdjtUI.scrollPreview=scroll_preview;
    fdjtUI.scrollRestore=scroll_restore;}());

(function(){
    function dosubmit(evt){
	evt=evt||event;
	var target=fdjtUI.T(evt);
	var form=fdjtDOM.getParent(target,"FORM");
	var submit_event = document.createEvent("HTMLEvents");
	submit_event.initEvent('submit',false,true);
	form.dispatchEvent(submit_event);
	form.submit();}
    fdjtUI.dosubmit=dosubmit;}());

(function(){
    var hasClass=fdjtDOM.hasClass;
    
    fdjtUI.T=function(evt) {
	evt=evt||event; return (evt.target)||(evt.srcElement);};

    fdjtUI.nodefault=function(evt){
	evt=evt||event;
	if (evt.preventDefault) evt.preventDefault();
	else evt.returnValue=false;
	return false;};

    fdjtUI.isClickable=function(target){
	if (target instanceof Event) target=fdjtUI.T(target);
	while (target) {
	    if (((target.tagName==='A')&&(target.href))||
		(target.tagName==="INPUT") ||
		(target.tagName==="TEXTAREA") ||
		(target.tagName==="SELECT") ||
		(target.tagName==="OPTION") ||
		(hasClass(target,"isclickable")))
		return true;
	    else if (target.onclick)
	      return true;
	    else target=target.parentNode;}
	return false;};

    fdjtUI.isDefaultClickable=function(target){
	if (target instanceof Event) target=fdjtUI.T(target);
	while (target) {
	    if (((target.tagName==='A')&&(target.href))||
		(target.tagName==="INPUT") ||
		(target.tagName==="TEXTAREA") ||
		(target.tagName==="SELECT") ||
		(target.tagName==="OPTION") ||
		(hasClass(target,"isclickable")))
		return true;
	    else target=target.parentNode;}
	return false;};

    fdjtUI.cancel=function(evt){
	evt=evt||event;
	if (evt.preventDefault) evt.preventDefault();
	else evt.returnValue=false;
	evt.cancelBubble=true;
	return false;};
    fdjtUI.nobubble=function(evt){
	evt=evt||event;
	evt.cancelBubble=true;};

}());

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

var fdjt_state_id="$Id$";
var fdjt_state_version=parseInt("$Revision$".slice(10,-1));
fdjt_versions.decl("fdjt/state",fdjt_state_version);
fdjt_versions.decl("fdjt",fdjt_state_version);

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

var fdjtState=
  (function(){

    function fdjtState(name,val,persist){
      if (arguments.length===1)
	return ((window.sessionStorage)&&(getSession(name)))||
	  ((window.sessionStorage)&&(getLocal(name)))||
	  getCookie(name);
      else if (persist)
	if (window.localStorage)
	  if (val) setLocal(name,val);
	  else dropLocal(name);
	else {
	  var domain=fdjtState.domain||location.hostname;
	  var path=fdjtState.path||"/";
	  var duration=fdjtState.duration||(3600*24*365*7);
	  if (val) setCookie(name,val,duration,path,domain);
	  else clearCookie(name,path,domain);}
      else if (val)
	if (window.sessionStorage) setSession(name,val);
	else setCookie(name,val);
      else if (window.sessionStorage) dropSession(name);
      else clearCookie(name);};
    fdjtState.domain=false;
    fdjtState.path=false;
    fdjtState.duration=false;

    /* Old-school cookies */

    function getCookie(name,parse){
      try {
	var cookies=document.cookie;
	var namepat=new RegExp("(^|(; ))"+name+"=");
	var pos=cookies.search(namepat);
	var valuestring;
	if (pos>=0) {
	  var start=cookies.indexOf('=',pos)+1;
	  var end=cookies.indexOf(';',start);
	  if (end>0) valuestring=cookies.slice(start,end);
	  else valuestring=cookies.slice(start);}
	else return false;
	if (parse)
	  return JSON.parse(decodeURIComponent(valuestring));
	else return decodeURIComponent(valuestring);}
      catch (ex) {
	return false;}}
    fdjtState.getCookie=getCookie;

    function setCookie(name,value,expires,path,domain){
      try {
	if (value) {
	  var valuestring=
	    ((typeof value === 'string') ? (value) :
	     (value.toJSON) ? (value.toJSON()) :
	     (value.toString) ? (value.toString()) : (value));
	  var cookietext=name+"="+encodeURIComponent(valuestring);
	  if (expires)
	    if (typeof(expires)==='string')
	      cookietext=cookietext+'; '+expires;
	    else if (expires.toGMTString)
	      cookietext=cookietext+"; expires="+expires.toGMTString();
	    else if (typeof(expires)==='number')
	      if (expires>0) {
		var now=new Date();
		now.setTime(now.getTime()+expires);
		cookietext=cookietext+"; expires="+now.toGMTString;}
	      else cookietext=cookietext+"; expires=Sun 1 Jan 2000 00:00:00 UTC";
	    else {}
	  if (path) cookietext=cookietext+"; path="+path;
	  // This certainly doesn't work generally and might not work ever
	  if (domain) cookietext=cookietext+"; domain="+domain;
	  // fdjtTrace("Setting cookie %o cookietext=%o",name,cookietext);
	  document.cookie=cookietext;}
	else clearCookie(name,path,domain);}
      catch (ex) {
	fdjtLog.warn("Error setting cookie %s",name);}}
    fdjtState.setCookie=setCookie;
    
    function clearCookie(name,path,domain){
      try {
	var valuestring="ignoreme";
	var cookietext=name+"="+encodeURIComponent(valuestring)+
	  "; expires=Sun 1 Jan 2000 00:00:00 UTC";
	if (path) cookietext=cookietext+"; path="+path;
	// This certainly doesn't work generally and might not work ever
	if (domain) cookietext=cookietext+"; domain="+domain;
	// fdjtTrace("Clearing cookie %o: text=%o",name,cookietext);
	document.cookie=cookietext;}
      catch (ex) {
	fdjtLog.warn("Error clearing cookie %s",name);}}
    fdjtState.clearCookie=clearCookie;

    /* Session storage */

    function setSession(name,val,unparse){
      if (unparse) val=JSON.stringify(val);
      if (window.sessionStorage)
	window.sessionStorage[name]=val;
      else setCookie(name,val);}
    fdjtState.setSession=setSession;

    function getSession(name,parse){
      var val=((window.sessionStorage)?
	       (window.sessionStorage[name]):
	       (fdjtGetCookie(name)));
      if (val)
	if (parse) return JSON.parse(val); else return val;
      else return false;}
    fdjtState.getSession=getSession;

    function dropSession(name){
      if (window.sessionStorage)
	return window.sessionStorage.removeItem(name);
      else clearCookie(name);}
    fdjtState.dropSession=dropSession;

    /* Local storage (persists between sessions) */

    function setLocal(name,val,unparse){
      if (!(name)) throw { error: "bad name",name: name};
      if (unparse) val=JSON.stringify(val);
      if (window.localStorage)
	window.localStorage[name]=val;}
    fdjtState.setLocal=setLocal;

    function getLocal(name,parse){
      if (window.localStorage) {
	var val=window.localStorage[name];
	if (val)
	  if (parse) return JSON.parse(val); else return val;
	else return false;}
      else return false;}
    fdjtState.getLocal=getLocal;

    function dropLocal(name){
      if (window.localStorage)
	return window.localStorage.removeItem(name);
      else return false;}
    fdjtState.dropLocal=dropLocal;
    
    function clearLocal(){
      if (window.localStorage) {
	var storage=window.localStorage;
	var i=0; var lim=storage.length;
	var keys=[];
	while (i<lim) keys.push(storage.key(i++));
	i=0; while (i<lim) storage.removeItem(keys[i++]);}}
    fdjtState.clearLocal=clearLocal;

    /* Gets arguments from the query string */
    function getQuery(name,multiple,matchcase,verbatim){
      if (!(location.search))
	if (multiple) return [];
	else return false;
      var results=[];
      var ename=encodeURIComponent(name);
      var namepat=new RegExp
	("(&|^|\\?)"+ename+"(=|&|$)",((matchcase)?"g":"gi"));
      var query=location.search;
      var start=query.search(namepat);
      while (start>=0) {
	// Skip over separator if non-initial
	if ((query[start]==='?')||(query[start]==='&')) start++;
	// Skip over the name
	var valstart=start+ename.length; var end=false;
	if (query[valstart]==="=") {
	  var valstring=query.slice(valstart+1);
	  end=valstring.search(/(&|$)/g);
	  if (end<=0) {
	    results.push("");
	    if (!(multiple)) break;}
	  else {
	    results.push(valstring.slice(0,end));
	    if (!(multiple)) break;}}
	else if (multiple)
	  results.push(query.slice(start,end));
	else if (verbatim)
	  return query.slice(start,end);
	else return querydecode(query.slice(start,end));
	if (end>0) {
	  query=query.slice(end);
	  start=query.search(namepat);}}
      if (!(verbatim)) {
	var i=0; var lim=results.length;
	while (i<lim) {results[i]=querydecode(results[i]); i++;}}
      if (multiple) return results;
      else if (results.length)
	return results[0];
      else return false;}
    fdjtState.getQuery=getQuery;
    
    function querydecode(string){
      if (decodeURIComponent)
	return decodeURIComponent(string);
      else return 
	     string.replace
	     (/%3A/gi,":").replace
	     (/%2F/gi,"/").replace
	     (/%3F/gi,"?").replace
	     (/%3D/gi,"=").replace
	     (/%20/gi," ").replace
	     (/%40/gi,"@").replace
	     (/%23/gi,"#");}

    function test_opt(pos,neg){
      var pospat=((pos)&&(new RegExp("\\b"+pos+"\\b")));
      var negpat=((neg)&&negative_opt_pat(neg));
      var i=2; while (i<arguments.length) {
	var arg=arguments[i++];
	if (!(arg)) continue;
	else if (typeof arg === 'string')
	  if ((pospat)&&(arg.search(pospat)>=0)) return true;
	  else if ((negpat)&&(arg.search(negpat)>=0)) return false;
	  else continue;
	else if (arg.length) {
	  var j=0; var len=arg.length;
	  while (j<len)
	    if ((pos)&&(arg[j]===pos)) return true;
	    else if ((neg)&&(arg[j]===neg)) return false;
	    else j++;
	  return false;}
	else continue;}
      return false;}
    fdjtState.testOption=test_opt;

    function negative_opt_pat(neg){
      if (!(neg)) return neg;
      else if (typeof neg === 'string')
	return (new RegExp("\\b"+neg+"\\b","gi"));
      else if (neg.length) {
	var rule="\\b(";
	var i=0; while (i<neg.length) {
	  var name=neg[i];
	  if (i>0) rule=rule+"|";
	  rule=rule+"("+name+")";
	  i++;}
	rule=rule+")\\b";
	return new RegExp(rule,"gi");}
      else return false;}

    fdjtState.argVec=function(argobj,start){
      var i=start||0;
      var result=new Array(argobj.length-i);
      while (i<argobj.length) {
	result[i-start]=argobj[i]; i++;}
      return result;};

    var zeros="000000000000000000000000000000000000000000000000000000000000000";
    function zeropad(string,len){
      if (string.length===len) return string;
      else if (string.length>len) return string.slice(0,len);
      else return zeros.slice(0,len-string.length)+string;}

    var nodeid=
      zeropad(((Math.floor(Math.random()*65536)).toString(16)+
	       (Math.floor(Math.random()*65536)).toString(16)+
	       (Math.floor(Math.random()*65536)).toString(16)+
	       (Math.floor(Math.random()*65536)|0x01)).toString(16),
	      12);
    
    var default_version=17; 
    var clockid=Math.floor(Math.random()*16384); var msid=1;
    var last_time=new Date().getTime();
    
    fdjtState.getNodeID=function(){return nodeid;};
    fdjtState.setNodeID=function(arg){
      if (typeof arg==='number')
	nodeid=zeropad(arg.toString(16),12);
      else if (typeof arg === 'string')
	if (arg.search(/[^0123456789abcdefABCDEF]/)<0)
	  nodeid=zeropad(arg,12);
	else throw {error: 'invalid node id',value: arg};
      else throw {error: 'invalid node id',value: arg};};

    function getUUID(node){
      var now=new Date().getTime();
      if (now<last_time) {now=now*10000; clockid++;}
      else if (now===last_time)	now=now*10000+(msid++);
      else {now=now*10000; msid=1;}
      now=now+122192928000000000;
      if (!(node)) node=nodeid;
      var timestamp=now.toString(16); var tlen=timestamp.length;
      if (tlen<15) timestamp=zeros.slice(0,15-tlen)+timestamp;
      return timestamp.slice(7)+"-"+timestamp.slice(3,7)+
	"-1"+timestamp.slice(0,3)+
	"-"+(32768+(clockid%16384)).toString(16)+
	"-"+((node)?
	     ((typeof node === 'number')?
	      (zeropad(node.toString(16),12)):
	      (zeropad(node,12))):
	     (nodeid));}
    fdjtState.getUUID=getUUID;
    
    // Getting version information
    function versionInfo(){
      var s=navigator.appVersion; var result={};
      var start;
      while ((start=s.search(/\w+\/\d/g))>=0) {
	var slash=s.indexOf('/',start);
	var afterslash=s.slice(slash+1);
	var num_end=afterslash.search(/\W/);
	var numstring=afterslash.slice(0,num_end);
	try {
	  result[s.slice(start,slash)]=parseInt(numstring);}
	catch (ex) {
	  result[s.slice(start,slash)]=numstring;}
	s=afterslash.slice(num_end);}
      return result;}
    fdjtState.versionInfo=versionInfo;

    return fdjtState;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

var fdjt_ajax_id="$Id$";
var fdjt_ajax_version=parseInt("$Revision$".slice(10,-1));
fdjt_versions.decl("fdjt/ajax",fdjt_ajax_version);
fdjt_versions.decl("fdjt",fdjt_ajax_version);

/* Copyright (C) 2007-2011 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides an abstraction layer for Ajax calls

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

    Use, modification, and redistribution of this program is permitted
    under either the GNU General Public License (GPL) Version 2 (or
    any later version) or under the GNU Lesser General Public License
    (version 3 or later).

    These licenses may be found at www.gnu.org, particularly:
      http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
      http://www.gnu.org/licenses/lgpl-3.0-standalone.html
*/

var fdjtAjax=
    (function(){
	
	function compose_uri(base_uri,args){
	    var uri=base_uri; var need_amp=false;
	    if (base_uri[-1]==='&') need_amp=false;
	    else if (base_uri.indexOf('?')>=0) need_amp=true;
	    else uri=base_uri+"?";
	    var i=0; while (i<args.length) {
		if (!(args[i])) {i=i+2; continue;}
		uri=uri+((need_amp) ? ("&") : (""))+args[i]+"="+args[i+1];
		need_amp=true;
		i=i+2;}
	    return uri;}

	var trace_ajax=false;
	
	function fdjtAjax(callback,base_uri,args){
	    var req=new XMLHttpRequest();
	    req.onreadystatechange=function () {
		if ((req.readyState == 4) && (req.status == 200)) {
		    callback(req);}};
	    var uri=compose_uri(base_uri,args);
	    req.open("GET",uri,true);
	    req.withCredentials='yes';
	    req.send(null);
	    return req;}
	fdjtAjax.revid="$Id$";
	fdjtAjax.version=parseInt("$Revision$".slice(10,-1));

	fdjtAjax.textCall=function(callback,base_uri){
	    return fdjtAjax(function(req) {
		callback(req.responseText);},
			    base_uri,fdjtDOM.Array(arguments,2));};

	fdjtAjax.jsonCall=function(callback,base_uri){
	    return fdjtAjax(function(req) {
		callback(JSON.parse(req.responseText));},
			    base_uri,fdjtDOM.Array(arguments,2));};

	fdjtAjax.xmlCall=function(callback,base_uri){
	    return fdjtAjax(function(req) {
		callback(req.responseXML);},
			    base_uri,fdjtDOM.Array(arguments,2));};

	fdjtAjax.jsonpCall=function(uri,id,cleanup){
	    if ((id)&&($ID(id))) return false;
	    var script_elt=fdjtNewElement("SCRIPT");
	    if (id) script_elt.id=id;
	    if (cleanup) script_elt.oncleanup=cleanup;
	    script_elt.language='javascript';
	    script_elt.src=uri;
	    document.body.appendChild(script_elt);};

	fdjtAjax.jsonpFinish=function(id){
	    var script_elt=$ID(id);
	    if (!(script_elt)) return;
	    if (script_elt.oncleanup) script_elt.oncleanup();
	    fdjtDOM.remove(script_elt);};

	function add_query_param(parameters,name,value){
	    return ((parameters)?(parameters+"&"):(""))+
		name+"="+encodeURIComponent(value);}

	function formParams(form) {
	    fdjtUI.AutoPrompt.cleanup(form);
	    var parameters=false;
	    var inputs=fdjtDOM.getChildren(form,"INPUT");
	    var i=0; while (i<inputs.length) {
		var input=inputs[i++];
		if (!(input.disabled)) {
		    if (((input.type==="RADIO") || (input.type==="CHECKBOX")) ?
			(input.checked) : (true))
			parameters=add_query_param(parameters,input.name,input.value);
		    else parameters=add_query_param(parameters,input.name,input.value);}}
	    var textareas=fdjtDOM.getChildren(form,"TEXTAREA");
	    i=0; while (i<textareas.length) {
		var textarea=textareas[i++];
		if (!(textarea.disabled)) {
		    parameters=add_query_param(parameters,textarea.name,textarea.value);}}
	    var selectboxes=fdjtDOM.getChildren(form,"SELECT");
	    i=0; while (i<selectboxes.length) {
		var selectbox=selectboxes[i++]; var name=selectbox.name;
		var options=fdjtDOM.getChildren(selectbox,"OPTION");
		var j=0; while (j<options.length) {
		    var option=options[j++];
		    if (option.selected)
			parameters=add_query_param(parameters,name,option.value);}}
	    return parameters;}
	fdjtAjax.formParams=formParams;

	function add_field(result,name,value,multifields,downcase) {
	    if (downcase) name=name.toLowerCase();
	    if ((multifields)&&(fdjtKB.contains(multifields,name))) {
		if (result[name]) result[name].push(value);
		else result[name]=[value];}
	    else {
		var cur=result[name];
		if (!cur) result[name]=value;
		else if (cur instanceof Array) cur.push(value);
		else result[name]=[cur,value];}}

	function formJSON(form,multifields,downcase) {
	    fdjtUI.AutoPrompt.cleanup(form);
	    var result={};
	    var inputs=fdjtDOM.getChildren(form,"INPUT");
	    var i=0; while (i<inputs.length) {
		var input=inputs[i++];
		if ((!(input.disabled)) &&
		    (((input.type==="radio") || (input.type==="checkbox")) ?
		     (input.checked) : (true)))
		    add_field(result,input.name,input.value,multifields,downcase||false);}
	    var textareas=fdjtDOM.getChildren(form,"TEXTAREA");
	    i=0; while (i<textareas.length) {
		var textarea=textareas[i++];
		if (!(textarea.disabled)) 
		    add_field(result,textarea.name,textarea.value,multifields,downcase||false);}
	    var selectboxes=fdjtDOM.getChildren(form,"SELECT");
	    i=0; while (i<selectboxes.length) {
		var selectbox=selectboxes[i++]; var name=selectbox.name;
		var options=fdjtDOM.getChildren(selectbox,"OPTION");
		var j=0; while (j<options.length) {
		    var option=options[j++];
		    if (option.selected) add_field(result,name,option.value,multifields,downcase||false);}}
	    return result;}
	fdjtAjax.formJSON=formJSON;

	function ajaxSubmit(form,callback){
	    var ajax_uri=form.getAttribute("ajaxaction");
	    if (!(ajax_uri)) return false;
	    // Whether to do AJAX synchronously or not.
	    var syncp=form.getAttribute("synchronous");
	    if (!(callback)) {
		if (form.oncallback) callback=form.oncallback;
		else if (form.getAttribute("ONCALLBACK")) {
		    callback=new Function
		    ("req","form",input_elt.getAttribute("ONCALLBACK"));
		    form.oncallback=callback;}}
	    if (trace_ajax)
		fdjtLog("Direct %s AJAX submit to %s for %o with callback %o",
			((syncp)?("synchronous"):("asynchronous")),
			ajax_uri,form,callback);
	    // Firefox doesn't run the callback on synchronous calls
	    var success=false; var callback_run=false;
	    var req=new XMLHttpRequest();
	    var params=formParams(form);
	    fdjtDOM.addClass(form,"submitting");
	    if (form.method==="GET")
		req.open('GET',ajax_uri+"?"+params,(!(syncp)));
	    else req.open('POST',ajax_uri,(!(syncp)));
	    req.withCredentials='true';
	    req.onreadystatechange=function () {
		if (trace_ajax)
		    fdjtLog("Got callback (%d,%d) %o for %o, calling %o",
			    req.readyState,req.status,req,ajax_uri,callback);
		if ((req.readyState === 4) && (req.status>=200) && (req.status<300)) {
		    fdjtDOM.dropClass(form,"submitting");
		    success=true; 
		    if (callback) callback(req,form);
	      	    callback_run=true;}
		else {
		    if (trace_ajax)
			fdjtLog("Got callback (%d,%d) %o for %o, not calling %o",
				req.readyState,req.status,req,ajax_uri,callback);
		    callback_run=false;}};
	    try {
		if (form.method==="GET") req.send();
		else {
		    // Setting the content type will force some browsers into preflight,
		    //  which gets us stuck.
		    if (!(fdjtAjax.noctype))
			req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		    req.send(params);}
		success=true;}
	    catch (ex) {}
	    if ((syncp) && (!(callback_run))) {
		if (trace_ajax)
		    fdjtLog("Running callback (rs=%d,status=%d) %o for %o, calling %o",
			    req.readyState,req.status,req,ajax_uri,callback);
		if ((req.readyState === 4) && (req.status>=200) && (req.status<300)) {
		    fdjtDOM.dropClass(form,"submitting");
		    success=true;
		    if (callback) callback(req,form);}};
	    return success;}
	fdjtAjax.formSubmit=ajaxSubmit;

	function jsonpSubmit(form){
	    var jsonp_uri=form.getAttribute("jsonpuri");
	    if (!(jsonp_uri)) return false;
	    var success=false;
	    var jsonid=((form.id)?("JSONP"+form.id):("FORMJSONP"));
	    var params=formParams(form);
	    fdjtDOM.addClass(form,"submitting");
	    try {
		jsonpCall(jsonp_uri+"?"+params,jsonid,
			  function(){fdjtDropClass(form,"submitting")});}
	    catch (ex) {
		jsonpFinish(jsonid);
		fdjtLog.warn("Attempted JSONP call signalled %o",ex);
		return false;}
	    return true;}

	function form_submit(evt,callback){
	    evt=evt||event||null;
	    var form=fdjtUI.T(evt);
	    fdjtUI.AutoPrompt.cleanup(form);
	    if (fdjtDOM.hasClass(form,"submitting")) {
		fdjtDOM.dropClass(form,"submitting");
		return;}
	    // if (form.fdjtlaunchfailed) return;
	    form.fdjtsubmit=true;
	    fdjtDOM.addClass(form,"submitting");
	    if (ajaxSubmit(form,callback)) {
		// fdjtLog("Ajax commit worked");
		fdjtUI.cancel(evt);
		return false;}
	    else if (jsonpSubmit(form)) {
		// fdjtLog("Json commit worked");
		fdjtUI.cancel(evt);
		return false;}
	    else return;}

	function copy_args(args,i){
	    var lim=args.length; if (!(i)) i=0;
	    var copy=new Array(lim-i);
	    while (i<lim) {copy[i]=args[i]; i++;}
	    return copy;}

	/* Synchronous calls */
	function sync_get(callback,base_uri,args){
	    var req=new XMLHttpRequest();
	    var uri=compose_uri(base_uri,args);
	    req.open("GET",uri,false);
	    req.send(null);
	    if (callback) return callback(req);
	    else return req;}
	fdjtAjax.get=function(base_uri){
	    return sync_get(false,base_uri,copy_args(arguments,1));};
	fdjtAjax.getText=function(base_uri) {
	    return sync_get(function (req) { return req.responseText; },
			    base_uri,copy_args(arguments,1));};
	fdjtAjax.getJSON=function(base_uri) {
	    return sync_get(function (req) { return JSON.parse(req.responseText); },
			    base_uri,fdjtDOM.Array(arguments,1));};
	fdjtAjax.getXML=function(base_uri) {
	    return fdjtAjaxGet(function (req) { return JSON.parse(req.responseXML); },
			       base_uri,fdjtDOM.Array(arguments,1));};

	fdjtAjax.onsubmit=form_submit;
	fdjtAjax.noctype=true;

	return fdjtAjax;})();

/* Emacs local variables
;;;  Local variables: ***
;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
;;;  End: ***
*/
/*
    http://www.JSON.org/json2.js
    2009-06-29

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON = JSON || {};

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file provides a Javascript/ECMAScript of KNODULES, 
   a lightweight knowledge representation facility.

   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library is built on the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification and redistribution of this program is permitted
   under the GNU General Public License (GPL) Version 2:

   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@biz.beingmeta.com

   Enjoy!

*/

var Knodule=
    (function(){
	var knodules={};
	var all_knodules=[];
	var knodule=false;
	var trace_parsing=0;
	var trace_edits=false;

	var kno_simple_oidpat=/@[0-9A-Fa-f]+\/[0-9A-Fa-f]+/;
	var kno_named_oidpat=/@[0-9A-Fa-f]+\/[0-9A-Fa-f]+(\x22([^\x22]+)\x22)*/;
	var kno_atbreak=/[^\\]@/g;
	
	function Knodule(id,lang) {
	    // Raw cons
	    if (!(id)) return this;
	    // Do lookup
	    if (knodules[id])
		if ((lang)&&(lang!==knodules[id].language))
		    throw { error: "language mismatch" };
	    else return knodules[id];
	    if (fdjtKB.Pool.probe(id))
		throw { error: "pool/knodule conflict"};
	    if (this instanceof Knodule)
		knodule=fdjtKB.Pool.call(this,id);
	    else knodule=fdjtKB.Pool.call((new Knodule()),id);
	    // The name of the knodule
	    knodule.name=id;
	    knodules[id]=knodule;
	    // The default language for this knodule
	    if (lang) knodule.language=lang.toUpperCase();
	    else knodule.language='EN';
	    // Mapping strings to KNode objects (many-to-one)
	    knodule.dterms={};
	    // A vector of all dterms local to this knodule
	    knodule.alldterms=[];
	    // Prime dterms
	    knodule.prime=[];
	    // Whether the knodule is indexed (e.g. keeps inverse indices for
	    // relations and rules)
	    knodule.index=fdjtKB.Index();
	    // Whether to validate asserted relations
	    knodule.validate=true;
	    // Whether the knodule is 'strict'
	    // (requiring dterm definitions for all references)
	    knodule.strict=false;
	    // Whether the knodule is 'finished' (all references declared)
	    knodule.finished=false;
	    // Terms which are assumed unique.  This is used in non-strict
	    // knodules to catch terms that become ambiguous.
	    knodule.assumed_dterms=[];
	    // Mapping external dterms to knowdes
	    knodule.xdterms={};
	    // A vector of all foreign references
	    knodule.allxdterms=[];
	    // Mapping terms to arrays of of KNodes (ambiguous)
	    knodule.terms={};
	    // Mapping hook terms to arrays of of KNodes (ambiguous)
	    knodule.hooks={};
	    // Inverted indices
	    knodule.genlsIndex={};
	    // This maps external OIDs to knowdes
	    knodule.oidmap={};
	    // Key concepts
	    knodule.key_concepts=[];
	    // DRULES (disambiguation rules)
	    knodule.drules={};
	    return knodule;}
	Knodule.prototype=new fdjtKB.Pool();
	Knodule.revid="$Id$";
	Knodule.version=parseInt("$Revision$".slice(10,-1));

	function KNode(knodule,string,lang){
	    if (!(knodule)) return this;
	    if (string.search(/[a-zA-Z]\$/)===0) {
		lang=string.slice(0,2).toUpperCase();
		string=string.slice(3);}
	    else if (lang) lang=lang.toUpperCase();
	    else lang=knodule.language;
	    var term=string;
	    if (knodule.language!==lang) term=lang+"$"+string;
	    if (knodule.dterms.hasOwnProperty(term))
		return knodule.dterms[term];
	    var dterm=((this instanceof KNode)?
		       (knodule.ref(string+"@"+knodule.name,this)):
		       (knodule.ref(string+"@"+knodule.name)));
	    dterm.dterm=term;
	    knodule.dterms[dterm.qid]=dterm;
	    knodule.dterms[term]=dterm;
	    knodule.alldterms.push(dterm);
	    if ((lang)&&(lang!==knodule.language)) dterm.language=lang;
	    dterm._always=fdjtKB.Set();
	    dterm.knodule=knodule;
	    dterm.addTerm(string,lang);
	    return dterm;}
	KNode.prototype=new fdjtKB.Ref();

	Knodule.KNode=KNode;
	Knodule.prototype.KNode=function(string,lang) {
	    if (string instanceof KNode) {
		if (string.pool===this)
		    // Should this do some kind of import?
		    return string;
		else return string;}
	    else return new KNode(this,string,lang);};
	Knodule.prototype.cons=function(string,lang) {
	    return new KNode(this,string,lang);};
	Knodule.prototype.probe=function(string,langid) {
	    if ((this.language===langid)||(!(langid)))
		return this.dterms[string]||false;
	    else return this.dterms[langid+"$"+string]||false;};
	
	KNode.prototype.add=function(prop,val){
	    if ((fdjtKB.Ref.prototype.add.call(this,prop,val))&&
		(prop==='genls')) {
		fdjtKB.add(this._always,val);
		fdjtKB.merge(this._always,val._always);
		return true;}
	    else return false;}
	KNode.prototype.addTerm=function(val,field){
	    if (val.search(/[a-zA-Z]\$/)===0)
		if (field)
		    this.add(val.slice(0,2)+'$'+field,val.slice(3));
	    else this.add(val.slice(0,2),val.slice(3));
	    else if (field) this.add(field,val);
	    else this.add(this.knodule.language,val);};
	KNode.prototype.oldtagString=function(kno) {
	    if ((kno===this.knodule)||(!(kno))) return this.dterm;
	    else return this.dterm+"@"+this.knodule.name;};
	KNode.prototype.tagString=function(kno) {
	    return this.dterm+"@"+this.knodule.name;};
	/* Text processing utilities */
	function stdspace(string) {
	    return string.replace(/\s+/," ").
		replace(/^\s/,"").replace(/\s$/,"");}
	
	function trimspace(string) {
	    return string.replace(/^\s/,"").replace(/\s$/,"");}

	function findBreak(string,brk,start) {
	    var pos=string.indexOf(brk,start||0);
	    while (pos>0)
		if (string[pos-1]!="\\")
		    return pos;
	    else pos=string.indexOf(brk,pos+1);
	    return pos;}

	var _knodule_oddpat=/(\\)|(\s\s)|(\s;)|(\s;)/g;
	
	function segmentString(string,brk,start,keepspace) {
	    if (start)
		if (string.slice(start).search(_knodule_oddpat)<0)
		    return string.slice(start).split(brk);
	    else {}
	    else if (string.search(_knodule_oddpat)<0)
		return string.split(brk);
	    else {}
	    var result=[]; var i=0, pos=start||0;
	    var nextpos=findBreak(string,brk,pos);
	    while (nextpos>=0) {
		var item=((keepspace) ? (string.slice(pos,nextpos)) :
			  (stdspace(string.slice(pos,nextpos))));
		if ((item) && (item !== "")) result.push(item);
		pos=nextpos+1;
		nextpos=findBreak(string,brk,pos);}
	    result.push(string.slice(pos));
	    return result;}
	function stripComments(string) {
	    return string.replace(/^\s*#.*$/g,"").
		replace(/^\s*\/\/.*$/g,"");}

	/* Processing the PLAINTEXT microformat */
	function handleClause(clause,subject) {
	    if (clause.indexOf('\\')>=0) clause=fdjtString.unEscape(clause);
	    if (trace_parsing>2)
		fdjtLog("Handling clause '%s' for %o",clause,subject);
	    switch (clause[0]) {
	    case '^':
		if (clause[1]==='~') 
		    subject.add('sometimes',this.KNode(clause.slice(2)));
		else if (clause[2]==='*') 
		    subject.add('commonly',this.KNode(clause.slice(2)));
		else {
		    var pstart=findBreak(clause,"(");
		    if (pstart>0) {
			var pend=findBreak(clause,")",pstart);
			if (pend<0) {
			    fdjtLog.warn(
				"Invalid Knodule clause '%s' for %o (%s)",
				clause,subject,subject.dterm);}
			else {
			    var role=this.KNode(clause.slice(1,pstart));
			    var object=this.KNode(clause.slice(pstart+1,pend));
			    object.add(role.dterm,subject);
			    subject.add('genls',role);}}
		    else subject.add('genls',this.KNode(clause.slice(1)));}
		break;
	    case '_': {
		var object=this.KNode(clause.slice(1));
		subject.add('examples',object);
		object.add('genls',subject);
		break;}
	    case '-':
		subject.add('never',this.KNode(clause.slice(1)));
		break;
	    case '&': {
		var value=clause.slice((clause[1]==="-") ? (2) : (1));
		var assoc=this.KNode(value);
		if (clause[1]==="-")
		    subject.add('antiassocs',assoc);
		else subject.add('assocs',assoc);
		break;}
	    case '@': 
		if (clause[1]==="#") 
		    subject.add('tags',clause.slice(2));
		else subject.add('uri',clause.slice(1));
		break;
	    case '=':
		if (clause[1]==='@')
		    subject.oid=clause.slice(1);
		else if (clause[1]==='*')
		    subject.add('equiv',this.KNode(clause.slice(2)));
		else if (clause[1]==='~')
		    subject.add('kinda',this.KNode(clause.slice(2)));
		else 
		    subject.add('identical',this.KNode(clause.slice(1)));
		break;
	    case '"': {
		var qend=((clause[-1]==='"') ? (-1) : (false));
		var gloss=((qend)?(clause.slice(2,qend)):(clause.slice(2)));
		if (clause[1]==="*") {
		    subject.gloss=gloss.slice(1);
		    subject.addTerm(subject.gloss,'glosses');}
		else {
		    subject.addTerm(gloss,"glosses");}
		break;}
	    case '%': {
		var mirror=this.KNode(clause.slice(1));
		if (subject.mirror===mirror) break;
		else {
		    var omirror=subject.mirror;
		    fdjtLog.warn("Inconsistent mirrors for %s: +%s and -%s",
				 subject,mirror,omirror);
		    omirror.mirror=false;}
		if (mirror.mirror) {
		    var oinvmirror=mirror.mirror;
		    fdjtLog.warn("Inconsistent mirrors for %s: +%s and -%s",
				 mirror,subject,oinvmirror);
		    omirror.mirror=false;}
		subject.mirror=mirror; mirror.mirror=subject;
		break;}
	    case '.': {
		var brk=findBreak(clause,'=');
		if (!(brk))
		    throw {name: 'InvalidClause', irritant: clause};
		var role=this.KNode(clause.slice(1,brk));
		var object=this.KNode(clause.slice(brk+1));
		this.add(role.dterm,object);
		object.add('genls',role);
		break;}
	    default: {
		var brk=findBreak(clause,'=');
		if (brk>0) {
		    var role=this.KNode(clause.slice(0,brk));
		    var object=this.KNode(clause.slice(brk+1));
		    subject.add(role.dterm,object);
		    object.add('genls',role);}
		else subject.addTerm(clause);}}
	    return subject;}
	Knodule.prototype.handleClause=handleClause;

	function handleSubjectEntry(entry){
	    var clauses=segmentString(entry,"|");
	    var subject=this.KNode(clauses[0]);
	    if (this.trace_parsing>2)
		fdjtLog("Processing subject entry %s %o %o",
			entry,subject,clauses);
	    var i=1; while (i<clauses.length)
		this.handleClause(clauses[i++],subject);
	    if (this.trace_parsing>2)
		fdjtLog("Processed subject entry %o",subject);
	    return subject;}
	Knodule.prototype.handleSubjectEntry=handleSubjectEntry;

	function handleEntry(entry){
	    entry=trimspace(entry);
	    if (entry.length===0) return false;
	    var bar=fdjtString.findSplit(entry,'|');
	    var atsign=fdjtString.findSplit(entry,'@');
	    if ((atsign>0) && ((bar<0)||(atsign<bar))) {
		var term=entry.slice(0,atsign);
		var knostring=((bar<0) ? (entry.slice(atsign+1)) :
			       (entry.slice(atsign+1,bar)));
		var knodule=Knodule(knostring);
		if (bar<0) return knodule.KNode(term);
		else return knodule.handleEntry(term+entry.slice(bar));}
	    switch (entry[0]) {
	    case '*': {
		var subject=this.handleSubjectEntry(entry.slice(1));
		if (!(fdjtKB.contains(this.key_concepts,subject)))
		    this.key_concepts.push(subject);
		return subject;}
	    case '-': {
		var subentries=segmentString(entry.slice(1),"/");
		var knowdes=[];
		var i=0; while (i<subentries.length) {
		    knowdes[i]=this.KNode(subentries[i]); i++;}
		var j=0; while (j<knowdes.length) {
		    var k=0; while (k<knowdes.length) {
			if (j!=k) knowdes[j].add('disjoin',knowdes[k]);
			k++;}
		    j++;}
		return knowdes[0];}
	    case '/': {
		var pos=1; var subject=false; var head=false;
		var next=findBreak(entry,'/',pos);
		while (true) {
		    var basic_level=false;
		    if (entry[pos]==='*') {basic_level=true; pos++;}
		    var next_subject=
			((next) ? (this.handleSubjectEntry(entry.slice(pos,next))) :
			 (this.handleSubjectEntry(entry.slice(pos))));
		    if (subject) subject.add('genls',next_subject);
		    else head=next_subject;
		    subject=next_subject;
		    if (basic_level) subject.basic=true;
		    if (next) {
			pos=next+1; next=findBreak(entry,"/",pos);}
		    else break;}
		return head;}
	    default:
		return this.handleSubjectEntry(entry);}}
	Knodule.prototype.handleEntry=handleEntry;

	function handleEntries(block){
	    if (typeof block === "string") {
		var nocomment=stripComments(block);
		var segmented=segmentString(nocomment,';');
		if (this.trace_parsing>1)
		    fdjtLog("Handling %d entries",segmented.length);
		return this.handleEntries(segmented);}
	    else if (block instanceof Array) {
		var results=[];
		var i=0; while (i<block.length) {
		    results[i]=this.handleEntry(block[i]); i++;}
		return results;}
	    else throw {name: 'TypeError', irritant: block};}
	Knodule.prototype.handleEntries=handleEntries;

	Knodule.prototype.def=handleSubjectEntry;

	Knodule.def=function(string,kno){
	    if (!(kno)) kno=Knodule.knodule;
	    return kno.def(string);};

	Knodule.prototype.trace_parsing=0;

	return Knodule;})();

var KNode=Knodule.KNode;


var KnoduleIndex=(function(){
    var isobject=fdjtKB.isobject;
    var objectkey=fdjtKB.objectkey;
    
    function KnoduleIndex(knodule) {
	if (knodule) this.knodule=knodule;
	this.byweight={}; this.bykey={}; this.tagweights={}; this._alltags=[];
	return this;}
    
    KnoduleIndex.prototype.add=function(item,key,weight,kno){
	if (key instanceof KNode) {
	    key=((key.tagString)?(key.tagString()):(key.dterm));}
	if (typeof weight !== 'number')
	    if (weight) weight=2; else weight=0;
	if ((weight)&&(!(this.byweight[weight])))
	    this.byweight[weight]={};
	var itemkey=((typeof item === 'object')?(objectkey(item)):(item));
	if (this.bykey.hasOwnProperty(key))
	    fdjtKB.add(this.bykey[key],itemkey);
	else {
	    this.bykey[key]=fdjtKB.Set(itemkey);
	    this._alltags.push(key);}
	if (weight) {
	    var byweight=this.byweight[weight];
	    if (byweight.hasOwnProperty(key))
		fdjtKB.add(byweight[key],itemkey);
	    else byweight[key]=fdjtKB.Set(itemkey);
	    (this.tagweights[key])=((this.tagweights[key])||0)+weight;}
	if (kno) {
	    var dterm=kno.probe(key);
	    if ((dterm)&&(dterm._always)) {
		var always=dterm._always;
		var i=0; var len=always.length;
		while (i<len)
		    this.add(itemkey,always[i++].dterm,((weight)&&(weight-1)));}}};
    KnoduleIndex.prototype.freq=function(key){
	if (this.bykey.hasOwnProperty(key))
	    return this.bykey[key].length;
	else return 0;};
    KnoduleIndex.prototype.find=function(key){
	if (this.bykey.hasOwnProperty(key)) return this.bykey[key];
	else return [];};
    KnoduleIndex.prototype.score=function(key,scores){
	var byweight=this.byweight;
	if (!(scores)) scores={};
	for (weight in byweight)
	    if (byweight[weight][key]) {
		var hits=byweight[weight][key];
		var i=0; var len=hits.length;
		while (i<len) {
		    var item=hits[i++]; var cur;
		    if (cur=scores[item]) scores[item]=cur+weight;
		    else scores[item]=weight;}}
	return scores;};
    KnoduleIndex.prototype.tagScores=function(){
	if (this._tagscores) return this._tagscores;
	var tagscores={}; var tagfreqs={}; var alltags=[];
	var book_tags=this._all; var max_score=0; var max_freq=0;
	var byweight=this.byweight;
	for (var w in byweight) {
	    var tagtable=byweight[w];
	    for (var tag in tagtable) {
		var howmany=tagtable[tag].length; var score; var freq;
		if (tagscores[tag]) {
		    score=tagscores[tag]=tagscores[tag]+w*howmany;
		    freq=tagfreqs[tag]=tagfreqs[tag]+howmany;}
		else {
		    score=tagscores[tag]=w*howmany;
		    freq=tagfreqs[tag]=howmany;	      
		    alltags.push(tag);}
		if (score>max_score) max_score=score;
		if (freq>max_freq) freq=max_freq;}}
	tagfreqs._count=alltags.length;
	alltags.sort(function (x,y) {
	    var xlen=tagfreqs[x]; var ylen=tagfreqs[y];
	    if (xlen==ylen) return 0;
	    else if (xlen>ylen) return -1;
	    else return 1;});
	tagscores._all=alltags; tagscores._freq=tagfreqs;
	tagscores._maxscore=max_score; tagscores._maxfreq=max_freq;
	this._tagscores=tagscores;
	return tagscores;};

    return KnoduleIndex;})();


/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file provides a Javascript/ECMAScript of KNODULES, 
     a lightweight knowledge representation facility.

   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library is built on the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

    Use, modification and redistribution of this program is permitted
    under the GNU General Public License (GPL) Version 2:

          http://www.gnu.org/licenses/old-licenses/gpl-2.0.html

    Use and redistribution (especially embedding in other
      CC licensed content) is permitted under the terms of the
      Creative Commons "Attribution-NonCommercial" license:

          http://creativecommons.org/licenses/by-nc/3.0/ 

    Other uses may be allowed based on prior agreement with
      beingmeta, inc.  Inquiries can be addressed to:

       licensing@biz.beingmeta.com

   Enjoy!

*/

KnoduleIndex.Query=
    (function(){
	function Query(index,query) {
	    if (!(index)) return this;
	    if (!(this instanceof Query)) return new Query(this,index);
	    if (typeof query === "string") query=this.string2query(query);
	    var qstring=this.query2string(query);
	    var cached=((index.cache)&&(index.cache[qstring]));
	    if (cached) return cached;
	    // Construct the results object
	    this.index=index; this._query=query; this._qstring=qstring;
	    this._results=[]; this._scores={};
	    if (query.length===0) {
		this._refiners={_results: index._alltags};
		return this;}
	    this._start=new Date();
	    // Do the search
	    this.do_search();
	    this._done=new Date();
	    if (this._refiners) {}
	    else if (this._results.length>1)
		this._refiners=this.get_refiners();
	    else this._refiners={_results: []};
	    this._refined=new Date();
	    if (this.index.trace)
		fdjtLog("In %f secs, %o yielded %d results: %o",
			((this._done.getTime()-this._start.getTime())/1000),
			query,result._results.length,result._results);
	    if (this.index.trace)
		fdjtLog("In %f secs, query %o yielded %d refiners: %o",
			((this._refined.getTime()-this._done.getTime())/1000),
			query,result._refiners._results.length,
			result._refiners._results);
	    if (index.cache) index.cache[qstring]=this;
	    return this;}
	Knodule.Query=Query;
	KnoduleIndex.Query=Query;
	KnoduleIndex.prototype.Query=function(query){
	    return new Query(this,query);}

	// Queries are sets of terms and interchangable between vectors
	// and strings with semi-separated tag names

	function string2query(string) {
	    if (typeof string === "string") {
		var lastsemi=string.lastIndexOf(';');
		if (lastsemi>0)
		    return string.slice(0,lastsemi).split(';');
		else return [];}
	    else return string;}
	Query.string2query=string2query;
	Query.prototype.string2query=string2query;

	function query2string(query){
	    if (!(query)) query=this.query;
	    if ((typeof query === "object") && (query instanceof Array))
		if (query.length===0) return "";
	    else return query.join(';')+';';
	    else return query;}
	Query.prototype.cache={};
	Query.prototype.query2string=query2string;
	Query.prototype.getString=query2string;
	Query.query2string=query2string;

	function do_search(results) {
	    if (!(results)) results=this;
	    var query=results._query; var scores=results._scores;
	    var matches=[];
	    // A query is an array of terms.  In a simple query,
	    // the results are simply all elements which are tagged
	    // with all of the query terms.  In a linear scored query,
	    // a score is based on how many of the query terms are matched,
	    // possibly with weights based on the basis of the match.
	    var i=0; while (i<query.length) {
		var term=query[i];
		if (typeof term !== 'string') term=term.qid||term.dterm;
		var items=matches[i]=results.index.find(term);
		if (results.index.trace)
		    fdjtLog("Query element '%s' matches %d items",term,items.length);
		i++;}
	    var allitems=false;
	    if (query.length===1) allitems=matches[0];
	    else {
		var i=0; var lim=query.length;
		while (i<lim) {
		    var j=0; while (j<lim) {
			if (j>=i) {j++; continue}
			else if (matches[j].length===0) {j++; continue;}
			else if (allitems) {
			    var join=fdjtKB.intersection(matches[i],matches[j]);
			    allitems=fdjtKB.union(allitems,join);}
			else allitems=fdjtKB.intersection(matches[i],matches[j]);
			j++;}
		    i++;}}
	    results._results=allitems;
	    i=0; var n_items=allitems.length;
	    while (i<n_items) {
		var item=allitems[i++];
		var tags=results.index.Tags(item);
		var j=0; var lim=query.length; var cur;
		while (j<lim) {
		    var tag=query[j++];
		    if (cur=scores[item])
			scores[item]=cur+tags[item]||1;
		    else scores[item]=tags[item]||1;}}
	    // Initialize scores for all of results
	    return results;}
	Query.do_search=do_search;
	Query.prototype.do_search=function() { return do_search(this);};

	function get_refiners(results) {
	    if (!(results)) results=this;
	    // This gets terms which can refine this search, particularly
	    // terms which occur in most of the results.
	    if (results._refiners) return results._refiners;
	    var query=results._query;
	    var rvec=(results._results);
	    var refiners={};
	    var scores=(results._scores)||false; var freqs={};
	    var alltags=[];
	    var i=0; while (i<rvec.length) {
		var item=rvec[i++];
		var item_score=((scores)&&(scores[item]));
		var tags=results.index.Tags(item)||[];
		if (typeof tags === 'string') tags=[tags];
		if (tags) {
		    var j=0; var len=tags.length; while (j<len) {
			var tag=tags[j++];
			// If the tag is already part of the query, we ignore it.
			if (fdjtKB.contains(query,tag)) {}
			// If the tag has already been seen, we increase its frequency
			// and its general score
			else if (freqs[tag]) {
			    freqs[tag]=freqs[tag]+1;
			    if (item_score) refiners[tag]=refiners[tag]+item_score;}
			else {
			    // If the tag hasn't been counted, we initialize its frequency
			    // and score, adding it to the list of all the tags we've found
			    alltags.push(tag); freqs[tag]=1;
			    if (item_score) refiners[tag]=item_score;}}}}
	    freqs._count=rvec.length;
	    refiners._freqs=freqs;
	    results._refiners=refiners;
	    alltags.sort(function(x,y) {
		if (freqs[x]>freqs[y]) return -1;
		else if (freqs[x]===freqs[y]) return 0;
		else return 1;});
	    refiners._results=alltags;
	    if ((results.index.trace)&&(results.index.trace>1))
		fdjtLog("Refiners for %o are (%o) %o",
			results._query,refiners,alltags);
	    return refiners;}
	Query.get_refiners=get_refiners;
	Query.prototype.get_refiners=function() {return get_refiners(this);};

	/* Dead code? */
	/*
	  Query.base=function(string) {
	  var lastsemi=string.lastIndexOf(';');
	  if (lastsemi>0)
	  return string.slice(0,lastsemi+1);
	  else return "";};
	  Query.tail=function(string) {
	  var lastsemi=string.lastIndexOf(';');
	  if (lastsemi>0)
	  return string.slice(lastsemi+1);
	  else return string;};

	*/
	return Query;
    })();


/* Emacs local variables
;;;  Local variables: ***
;;;  compile-command: "cd ..; make" ***
;;;  End: ***
*/

/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file provides for HTML documents using KNODULES, including
    the extraction and processing of embedded KNODULE definitions
    or references and interaction with interactive parts of the
    FDJT library.

   For more information on knodules, visit www.knodules.net
   This library is built on the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

    Use, modification and redistribution of this program is permitted
    under the GNU General Public License (GPL) Version 2:

          http://www.gnu.org/licenses/old-licenses/gpl-2.0.html

    Use and redistribution (especially embedding in other
      CC licensed content) is permitted under the terms of the
      Creative Commons "Attribution-NonCommercial" license:

          http://creativecommons.org/licenses/by-nc/3.0/ 

    Other uses may be allowed based on prior agreement with
      beingmeta, inc.  Inquiries can be addressed to:

       licensing@biz.beingmeta.com

   Enjoy!

*/

(function(){

    var knodules_trace_load=2;

    /* Getting knowdes into HTML */

    var KNode=Knodule.KNode;
    Knodule.KNode.prototype.toHTML=function(lang){
	if (this.gloss) {
	    var span=fdjtDOM("span.dterm",this.dterm);
	    span.title=fdjtString.strip_markup(this.gloss);
	    span.dterm=this.dterm;
	    return span;}
	else return fdjtDOM("span.dterm",this.dterm);};

    /* Making DTERM descriptions */

    function knoduleHTML(dterm,kno,varname,lang){
	var checkbox=false; var variations=[];
	var text=dterm; var def=false;
	// A non-false language arg generates a completion, and a
	// non-string language arg just uses the knodules default language
	if ((lang)&&(typeof lang !== 'string')) {
	    if (kno) lang=kno.language; else lang='EN';}
	// Resolve the KNode if you can
	if ((kno)&&(typeof dterm === 'string'))
	    if (kno.probe(dterm)) {
		dterm=kno.probe(dterm);
		text=dterm.dterm;}
	else if (dterm.indexOf('|')>=0) {
	    var pos=dterm.indexOf('|');
	    def=dterm.slice(pos);
	    dterm=kno.handleSubjectEntry(dterm);
	    text=dterm.dterm;}
	else dterm=dterm;
	var tagstring=false;
	if ((varname)||(lang)) {
	    tagstring=((dterm.tagString)?(dterm.tagString()):
		       ((dterm.qid)||(dterm)));
	    if (def) tagstring=tagstring+def;}
	if (varname) 
	    checkbox=fdjtDOM
	({tagName: "INPUT",type: "CHECKBOX",name: varname,value: tagstring});
	if ((lang)&&(dterm instanceof KNode)) {
	    var synonyms=dterm[lang];
	    if ((synonyms)&&(typeof synonyms === 'string'))
		synonyms=[synonyms];
	    if (synonyms) {
		var i=0; while (i<synonyms.length) {
		    var synonym=synonyms[i++];
		    if (synonym===dterm) continue;
		    var variation=fdjtDOM("span.variation",synonym,"=");
		    variation.setAttribute("key",synonym);
		    variations.push(variation);}}}
	var span=fdjtDOM("span.knode",checkbox,variations,text);
	if (varname) fdjtDOM.addClass(span,"checkspan");
	if (typeof text !== 'string') text=tagstring;
	if (lang) {
	    fdjtDOM.addClass(span,"completion");
	    span.key=text; span.value=tagstring;}
	if (!(dterm instanceof KNode)) fdjtDOM.addClass(span,"raw");
	if (dterm.gloss) span.title=dterm.gloss;
	return span;};
    Knodule.HTML=knoduleHTML;
    Knodule.prototype.HTML=function(dterm){
	var args=new Array(arguments.length+1);
	args[0]=arguments[0]; args[1]=this;
	var i=1; var lim=arguments.length; while (i<lim) {
	    args[i+1]=arguments[i]; i++;}
	return knoduleHTML.apply(this,args);};

    /* Getting Knodules out of HTML */

    var _knodulesHTML_done=false;

    function KnoduleLoad(elt,knodule){
      var src=((typeof elt === 'string')?(elt):(elt.src));
      var text=fdjtAjax.getText(src);
      var knowdes=knodule.handleEntries(text);
      if (knodules_trace_load)
	fdjtLog("Parsed %d entries from %s",knowdes.length,elt.src);}

    function knoduleSetupHTML(knodule){
	if (!(knodule)) knodule=Knodule(document.location.href);
	var doing_the_whole_thing=false;
	var start=new Date();
	var links=fdjtDOM.getLink("knodule",true,false).concat
	  (fdjtDOM.getLink("knowlet",true,false));
	var i=0; while (i<links.length) KnoduleLoad(links[i++],knodule);
	var elts=document.getElementsByTagName("META");
	var i=0; while (i<elts.length) {
	    var elt=elts[i++];
	    if (elt.name==="KNOWDEF") knodule.handleEntry(elt.content);}
	elts=document.getElementsByTagName("SCRIPT");
	i=0; while (i<elts.length) {
	  var elt=elts[i++]; var lang=elt.getAttribute("language");
	  if ((lang) &&
	      ((lang==="knodule") ||(lang==="KNODULE")||
	       (lang==="knowlet"||(lang==="KNOWLET")))) {
		if (elt.src) KnoduleLoad(elt,knodule);
		else if (elt.text) {
		    var dterms=knodule.handleEntries(elt.text);
		    if (knodules_trace_load)
			fdjtLog("Parsed %d inline knodule entries",
				dterms.length);}
		else {}}}
	var finished=new Date();
	if (knodules_trace_load)
	    fdjtLog("Processed knodules in %fs",
		    ((finished.getTime()-start.getTime())/1000));}
    Knodule.HTML.Setup=knoduleSetupHTML;

})();

/* Emacs local variables
;;;  Local variables: ***
;;;  compile-command: "cd ..; make" ***
;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_id="$Id$";
var codex_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements a Javascript/DHTML UI for reading
   large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

var Codex=
    {mode: false,hudup: false,scrolling: false,query: false,
     head: false,target: false,glosstarget: false,location: false,
     user: false,root: false,start: false,HUD: false,dosync: true,
     _setup: false,_user_setup: false,_gloss_setup: false,_social_setup: false,
     // Keeping track of paginated context
     curpage: false,curoff: false,curinfo: false, curbottom: false,
     // For tracking UI state
     last_mode: false, last_flyleaf: "about",
     // How long it takes a gesture to go from tap to hold
     holdmsecs: 500, edgeclick: 50, pagesize: 250,
     animate: {pages:true,hud: true},
     updatelocation: true,
     // This is the base URI for this document, also known as the REFURI
     // A document (for instance an anthology or collection) may include
     // several refuri's, but this is the default.
     refuri: false,
     // These are the refuris used in this document
     refuris: [],
     // This is the document URI, which is usually the same as the REFURI.
     docuri: false,
     // This is the unique signed DOC+USER identifier used by myCopy
     // social DRM
     mycopyid: false, 
     // This is the time of the last update
     syncstamp: false,
     // Whether to use native scrolling for body content
     nativescroll: false,
     // Whether to use native scrolling for embedded DIVs
     scrolldivs: true,
     // Dominant interaction mode
     mouse: true,touch: false,kbd: false,
     // Restrictions on excerpts
     min_excerpt: 3, max_excerpt: false,
     focusrules: false,
     UI: {handlers: {mouse: {}, kbd: {}, ios: {}}},
     Trace: {
	 startup: 1,	// Whether to debug startup
	 mode: false,	// Whether to trace mode changes
	 nav: false,	// Whether to trace book navigation
	 scan: false,	// Whether to trace DOM scanning
	 search: 0,	// Whether (and level) to trace searches
	 clouds: 0,	// Whether to trace cloud generation
	 focus: false,	// Whether to trace target changes
	 toc: false,	// Whether we're debugging TOC tracking
	 network: 0,	// Whether we're debugging server interaction
	 glosses: false,// Whether we're tracing gloss processing
	 layout: 0,	// Whether to trace pagination
	 dosync: false, // Whether to trace state saves
	 paging: false,	// Whether to trace paging (movement by pages)
	 scroll: false,	// Whether to trace scrolling within the HUD
	 gestures: 0},   // Whether to trace gestures
     version: codex_version, id: codex_id
    };
var _sbook_setup=false;

var CodexHUD=false;

var sbook_gloss_data=
    ((typeof sbook_gloss_data === 'undefined')?(false):
     (sbook_gloss_data));

(function(){

    function initDB() {
	if (Codex.Trace.start>1) fdjtLog("Initializing DB");
	var refuri=(Codex.refuri||document.location.href);
	if (refuri.indexOf('#')>0) refuri=refuri.slice(0,refuri.indexOf('#'));
	var docinfo=Codex.DocInfo=new fdjtKB.Pool(refuri+"#");
	fdjtKB.addRefMap(docinfo.map);
	fdjtKB.addRefMap(function(ref){
	    return ((typeof ref === 'string')&&(ref[0]==='#')&&
		    (docinfo.ref(ref.slice(1))));});
	
	var knodule_name=
	    fdjtDOM.getMeta("codex.knodule")||
	    fdjtDOM.getMeta("KNODULE")||
	    refuri;
	Codex.knodule=new Knodule(knodule_name);
	Codex.index=new KnoduleIndex(Codex.knodule);
	Codex.query=Codex.empty_query=Codex.index.Query([]);
	Codex.BRICO=new Knodule("BRICO");
	Codex.BRICO.addAlias(":@1/");
	Codex.glosses=new fdjtKB.Pool("glosses"); {
	    var superadd=Codex.glosses.add;
	    Codex.glosses.addAlias("glossdb");
	    Codex.glosses.addAlias("-UUIDTYPE=61");
	    Codex.glosses.addAlias(":@31055/");
	    Codex.glosses.xforms['tags']=function(tag){
		if (typeof tag==='string') {
		    var info=
			((tag.indexOf('|')>=0)?
			 (Codex.knodule.handleSubjectEntry(tag)):
			 (fdjtKB.ref(tag)));
		    if (info) return info.tagString(Codex.knodule);
		    else return tag;}
		else return tag.tagString(Codex.knodule);};
	    Codex.glosses.addInit(function(item) {
		var info=Codex.docinfo[item.frag];
		if (!(info))
		    fdjtLog("Gloss refers to nonexistent '%s': %o",
			    item.frag,item);
		if ((info)&&(info.starts_at)) {item.starts_at=info.starts_at;}
		if ((info)&&(info.starts_at)) {item.ends_at=info.ends_at;}
		Codex.index.add(item,item.maker);
		Codex.addTag2UI(item.maker);
		var tags=item.tags;
		if (tags) {
		    if (!(tags instanceof Array)) tags=[tags];
		    if ((tags)&&(tags.length)) {
			var i=0; var lim=tags.length;
			while (i<lim) {
			    var tag=tags[i++];
			    Codex.index.add(item,tag);
			    Codex.addTag2UI(fdjtKB.ref(tag),true);}}}
		var sources=item.sources;
		if (sources) {
		    if (typeof sources !== 'array') sources=[sources];
		    if ((sources)&&(sources.length)) {
			var i=0; var lim=sources.length;
			while (i<lim) {
			    var source=sources[i++];
			    Codex.index.add(item,source);
			    Codex.UI.addGlossSource(fdjtKB.ref(source),true);}}}});
	    Codex.glosses.index=new fdjtKB.Index();
	    if (Codex.offline)
		Codex.glosses.storage=new fdjtKB.OfflineKB(Codex.glosses);}
	Codex.sourcekb=new fdjtKB.Pool("sources");{
	    Codex.sourcekb.addAlias("@1961/");
	    Codex.sourcekb.index=new fdjtKB.Index();
	    if (Codex.offline)
		Codex.sourcekb.storage=new fdjtKB.OfflineKB(Codex.sourcekb);}
	if (Codex.Trace.start>1) fdjtLog("Initialized DB");}
    Codex.initDB=initDB;

    var trace1="%s %o in %o: mode%s=%o, target=%o, head=%o scanning=%o";
    var trace2="%s %o: mode%s=%o, target=%o, head=%o scanning=%o";
    function sbook_trace(handler,cxt){
	var target=fdjtUI.T(cxt);
	if (target)
	    fdjtLog(trace1,handler,cxt,target,
		    ((Codex.scanning)?("(scanning)"):""),Codex.mode,
		    Codex.target,Codex.head,Codex.scanning);
	else fdjtLog(trace2,handler,cxt,
		     ((Codex.scanning)?("(scanning)"):""),Codex.mode,
		     Codex.target,Codex.head,Codex.scanning);}
    Codex.trace=sbook_trace;

    // This is the hostname for the sbookserver.
    Codex.server=false;
    // Whether this sbook is set up for offline reading
    Codex.offline=false;
    // This is an array for looking up sbook servers.
    Codex.servers=[[/.sbooks.net$/g,"gloss.sbooks.net"]];
    //Codex.servers=[];
    // This is the default server
    Codex.default_server="gloss.sbooks.net";
    // There be icons here!
    function sbicon(name,suffix) {return Codex.graphics+name+(suffix||"");}
    function cxicon(name,suffix) {
	return Codex.graphics+"codex/"+name+(suffix||"");}
    Codex.graphics="http://static.beingmeta.com/graphics/";
    // Codex.graphics="https://www.sbooks.net/static/graphics/";
    // Codex.graphics="https://beingmeta.s3.amazonaws.com/static/graphics/";

    Codex.getRefURI=function(target){
	var scan=target;
	while (scan)
	    if (scan.refuri) return scan.refuri;
	else scan=scan.parentNode;
	return Codex.refuri;}

    Codex.getDocURI=function(target){
	var scan=target;
	while (scan) {
	    var docuri=
		(((scan.getAttributeNS)&&
		  (scan.getAttributeNS("docuri","http://sbooks.net/")))||
		 ((scan.getAttribute)&&(scan.getAttribute("docuri")))||
		 ((scan.getAttribute)&&(scan.getAttribute("data-docuri"))));
	    if (docuri) return docuri;
	    else scan=scan.parentNode;}
	return Codex.docuri;}

    Codex.getRefID=function(target){
	if (target.getAttributeNS)
	    return (target.getAttributeNS('sbookid','http://sbooks.net/'))||
	    (target.getAttributeNS('sbookid'))||
	    (target.getAttributeNS('data-sbookid'))||
	    (target.id);
	else return target.id;};

    function getHead(target){
	/* First, find some relevant docinfo */
	if ((target.id)&&(Codex.docinfo[target.id]))
	    target=Codex.docinfo[target.id];
	else if (target.id) {
	    while (target)
		if ((target.id)&&(Codex.docinfo[target.id])) {
		    target=Codex.docinfo[target.id]; break;}
	    else target=target.parentNode;}
	else {
	    /* First, try scanning forward to find a non-empty node */
	    var scan=target.firstChild; var next=target.nextNode;
	    while ((scan)&&(scan!=next)) {
		if (scan.id) break;
		if ((scan.nodeType===3)&&(!(fdjtString.isEmpty(scan.nodeValue)))) break;
		scan=fdjtDOM.forward(scan);}
	    /* If you found something, use it */
	    if ((scan)&&(scan.id)&&(scan!=next))
		target=Codex.docinfo[scan.id];
	    else {
		while (target)
		    if ((target.id)&&(Codex.docinfo[target.id])) {
			target=Codex.docinfo[target.id]; break;}
		else target=target.parentNode;}}
	if (target)
	    if (target.level)
		return target.elt||document.getElementById(target.frag);
	else if (target.head)
	    return target.head.elt||
	    document.getElementById(target.head.frag);
	else return false;
	else return false;}
    Codex.getHead=getHead;

    Codex.getRef=function(target){
	while (target)
	    if (target.about) break;
	else if ((target.getAttribute)&&(target.getAttribute("about"))) break;
	else target=target.parentNode;
	if (target) {
	    var ref=((target.about)||(target.getAttribute("about")));
	    if (!(target.about)) target.about=ref;
	    if (ref[0]==='#')
		return document.getElementById(ref.slice(1));
	    else return document.getElementById(ref);}
	else return false;}
    Codex.getRefElt=function(target){
	while (target)
	    if ((target.about)||
		((target.getAttribute)&&(target.getAttribute("about"))))
		break;
	else target=target.parentNode;
	return target||false;}

    Codex.checkTarget=function(){
	if ((Codex.target)&&(Codex.mode==='glosses'))
	    if (!(fdjtDOM.isVisible(Codex.target))) {
		CodexMode(false); CodexMode(true);}};

    function getTarget(scan,closest){
	scan=scan.target||scan.srcElement||scan;
	var target=false;
	while (scan) {
	    if (scan.sbookui)
		return false;
	    else if (scan===Codex.root) return target;
	    else if (scan.id) {
		if (fdjtDOM.hasParent(scan,CodexHUD)) return false;
		else if (fdjtDOM.hasParent(scan,".sbookmargin")) return false;
		else if ((fdjtDOM.hasClass(scan,"sbooknofocus"))||
			 ((Codex.nofocus)&&(Codex.nofocus.match(scan))))
		    scan=scan.parentNode;
		else if ((fdjtDOM.hasClass(scan,"sbookfocus"))||
			 ((Codex.focus)&&(Codex.focus.match(scan))))
		    return scan;
		else if (!(fdjtDOM.hasText(scan)))
		    scan=scan.parentNode;
		else if (closest) return scan;
		else if (target) scan=scan.parentNode;
		else {target=scan; scan=scan.parentNode;}}
	    else scan=scan.parentNode;}
	return target;}
    Codex.getTarget=getTarget;
    
    Codex.getTitle=function(target,tryhard) {
	return target.sbooktitle||
	    (((target.id)&&(Codex.docinfo[target.id]))?
	     (Codex.docinfo[target.id].title):
	     (target.title))||
	    ((tryhard)&&
	     (fdjtDOM.textify(target)).
	     replace(/\n\n+/g,"\n").
	     replace(/^\n+/,"").
	     replace(/\n+$/,""));};

    function getinfo(arg){
	if (arg)
	    if (typeof arg === 'string')
		return Codex.docinfo[arg]||fdjtKB.ref(arg);
	else if ((arg.qid)||(arg.oid)) return arg;
	else if (arg.id) return Codex.docinfo[arg.id];
	else return false;
	else return false;}
    Codex.Info=getinfo;

    /* Navigation functions */

    function setHead(head){
	if (head===null) head=Codex.root;
	else if (typeof head === "string") 
	    head=getHead(fdjtID(head));
	else head=getHead(head)||Codex.root;
	var headinfo=Codex.docinfo[head.id];
	if (!(head)) return;
	else if (head===Codex.head) {
	    if (Codex.Trace.focus) fdjtLog("Redundant SetHead");
	    return;}
	else if (head) {
	    if (Codex.Trace.focus) Codex.trace("Codex.setHead",head);
	    CodexTOC.update("CODEXTOC4",headinfo,Codex.Info(Codex.head));
	    CodexTOC.update("CODEXFLYTOC4",headinfo,Codex.Info(Codex.head));
	    window.title=headinfo.title+" ("+document.title+")";
	    if (Codex.head) fdjtDOM.dropClass(Codex.head,"sbookhead");
	    fdjtDOM.addClass(head,"sbookhead");
	    Codex.setLocation(Codex.location);
	    Codex.head=fdjtID(head.id);}
	else {
	    if (Codex.Trace.focus) Codex.trace("Codex.setHead",head);
	    CodexTOCUpdate(head,"CODEXTOC4");
	    CodexTOCUpdate(head,"CODEXFLYTOC4");
	    Codex.head=false;}}
    Codex.setHead=setHead;

    function setLocation(location,force){
	if ((!(force)) && (Codex.location===location)) return;
	if (Codex.Trace.toc)
	    fdjtLog("Setting location to %o",location);
	var info=Codex.Info(Codex.head);
	while (info) {
	    var tocelt=document.getElementById("CODEXTOC4"+info.frag);
	    var flytocelt=document.getElementById("CODEXFLYTOC4"+info.frag);
	    var start=tocelt.sbook_start; var end=tocelt.sbook_end;
	    var progress=((location-start)*100)/(end-start);
	    var bar=fdjtDOM.getFirstChild(tocelt,".progressbar");
	    var appbar=fdjtDOM.getFirstChild(flytocelt,".progressbar");
	    tocelt.title=flytocelt.title=Math.round(progress)+"%";
	    if (Codex.Trace.toc)
		fdjtLog("For tocbar %o loc=%o start=%o end=%o progress=%o",
			bar,location,start,end,progress);
	    if ((bar)&& (progress>=0) && (progress<=100)) {
		// bar.style.width=((progress)+10)+"%";
		// appbar.style.width=((progress)+10)+"%";
		bar.style.width=(progress)+"%";
		appbar.style.width=(progress)+"%";
	    }
	    info=info.head;}
	var spanbars=fdjtDOM.$(".spanbar");
	var i=0; while (i<spanbars.length) {
	    var spanbar=spanbars[i++];
	    var width=spanbar.ends-spanbar.starts;
	    var ratio=(location-spanbar.starts)/width;
	    if (Codex.Trace.toc)
		fdjtLog("ratio for spanbar %o[%d] is %o [%o,%o,%o]",
			spanbar,spanbar.childNodes[0].childNodes.length,
			ratio,spanbar.starts,location,spanbar.ends);
	    if ((ratio>=0) && (ratio<=1)) {
		var progressbox=fdjtDOM.$(".progressbox",spanbar);
		if (progressbox.length>0) {
		    progressbox[0].style.left=((Math.round(ratio*10000))/100)+"%";}}}
	Codex.location=location;}
    Codex.setLocation=setLocation;

    function setTarget(target,nogo,nosave){
	if (Codex.Trace.focus) Codex.trace("Codex.setTarget",target);
	if (target===Codex.target) return;
	else if ((!target)&&(Codex.target)) {
	    fdjtDOM.dropClass(Codex.target,"sbooktarget");
	    Codex.target=false;
	    return;}
	else if (!(target)) return;
	else if ((inUI(target))||(!(target.id))) return;
	else if ((target===Codex.root)||(target===Codex.body)||
		 (target===document.body)) {
	    if (!(nogo)) Codex.GoTo(target,true);
	    return;}
	if (Codex.target) {
	    fdjtDOM.dropClass(Codex.target,"sbooktarget");
	    Codex.target=false;}
	fdjtDOM.addClass(target,"sbooktarget");
	fdjtState.setCookie("sbooktarget",target.id);
	Codex.target=target;
	if (Codex.full_cloud)
	    Codex.setCloudCuesFromTarget(Codex.full_cloud,target);
	if (!(nosave))
	    setState({target: target.id,
		      location: Codex.location,
		      page: Codex.curpage});
 	if (!(nogo)) Codex.GoTo(target,true);}
    Codex.setTarget=setTarget;

    /* Navigation */

    function resizeBody(){
	if (Codex.nativescroll) {}
	else {
	    var curx=x_offset-fdjtDOM.parsePX(Codex.pages.style.left);
	    var cury=y_offset-fdjtDOM.parsePX(Codex.pages.style.top);
	    // Codex.body.style.left=''; Codex.body.style.top='';
	    var geom=fdjtDOM.getGeometry(Codex.body,Codex.body);
	    x_offset=geom.left; y_offset=geom.top;
	    Codex.bodyoff=[x_offset,y_offset];
	    Codex.pages.style.left='0px';
	    Codex.pages.style.top=(y_offset)+'px';}}
    Codex.resizeBody=resizeBody;

    Codex.viewTop=function(){
	if (Codex.nativescroll) return fdjtDOM.viewTop();
	else return -(fdjtDOM.parsePX(Codex.pages.style.top));}
    var sbookUIclasses=
	/(\bhud\b)|(\bglossmark\b)|(\bleading\b)|(\bsbookmargin\b)/;

    function inUI(elt){
	if (elt.sbookui) return true;
	else if (fdjtDOM.hasParent(elt,CodexHUD)) return true;
	else while (elt)
	    if (elt.sbookui) return true;
	else if (fdjtDOM.hasClass(elt,sbookUIclasses)) return true;
	else elt=elt.parentNode;
	return false;}

    function displayOffset(){
	var toc;
	if (Codex.mode)
	    if (toc=fdjtID("CODEXTOC"))
		return -((toc.offsetHeight||50)+15);
	else return -60;
	else return -40;}

    function setHashID(target){
	if ((!(target.id))||(window.location.hash===target.id)||
	    ((window.location.hash[0]==='#')&&
	     (window.location.hash.slice(1)===target.id)))
	    return;
	if ((target===Codex.body)||(target===document.body)) return;
	var saved_y=((fdjtDOM.isVisible(target))&&fdjtDOM.viewTop());
	var saved_x=((fdjtDOM.isVisible(target))&&(fdjtDOM.viewLeft()));
	window.location.hash=target.id;}
    Codex.setHashID=setHashID;

    var syncing=false;
    
    function setState(state){
	if ((Codex.state===state)||
	    ((Codex.state)&&
	     (Codex.state.target===state.target)&&
	     (Codex.state.location===state.location)&&
	     (Codex.state.page===state.page)))
	    return;
	if (syncing) return;
	if (!(Codex.dosync)) return;
	if (!(state.tstamp)) state.tstamp=fdjtTime.tick();
	if (!(state.refuri)) state.refuri=Codex.refuri;
	Codex.state=state;
	var statestring=JSON.stringify(state);
	var uri=Codex.docuri||Codex.refuri;
	fdjtState.setLocal("codex.state("+uri+")",statestring);}
    Codex.setState=setState;
	    
    function serverSync(){
	if ((Codex.user)&&(Codex.dosync)&&(navigator.onLine)) {
	    var state=Codex.state; var synced=Codex.syncstate;
	    // Warning when syncing doesn't return?
	    if (syncing) return;
	    if (!(state)) return;
	    if ((synced)&&
		(synced.target===state.target)&&
		(synced.location===state.location)&&
		(synced.page===state.page))
		return;
	    var refuri=((Codex.target)&&(Codex.getRefURI(Codex.target)))||
		(Codex.refuri);
	    var uri="https://"+Codex.server+"/v4/sync?ACTION=save"+
		"&DOCURI="+encodeURIComponent(Codex.docuri)+
		"&REFURI="+encodeURIComponent(refuri);
	    if (Codex.deviceId)
		uri=uri+"&deviceid="+encodeURIComponent(Codex.deviceId);
	    if (Codex.deviceName)
		uri=uri+"&devicename="+encodeURIComponent(Codex.deviceName);
	    if (state.target) uri=uri+"&target="+encodeURIComponent(state.target);
	    if ((state.location)||(state.hasOwnProperty('location')))
		uri=uri+"&location="+encodeURIComponent(state.location);
	    if (Codex.ends_at) uri=uri+"&maxloc="+encodeURIComponent(Codex.ends_at);
	    if ((state.page)||(state.hasOwnProperty('page')))
		uri=uri+"&page="+encodeURIComponent(state.page);
	    if (typeof Codex.pagecount === 'number')
		uri=uri+"&maxpage="+encodeURIComponent(Codex.pagecount);
	    if (Codex.Trace.dosync)
		fdjtLog("syncPosition(call) %s: %o",uri,state);
	    var req=new XMLHttpRequest();
	    syncing=state;
	    req.onreadystatechange=function(evt){
		Codex.syncstate=syncing;
		syncing=false;
		if (Codex.Trace.dosync)
		    fdjtLog("syncPosition(callback) reading=%o status=%o %o",
			    evt.readyState,evt.status,evt);};
	    req.open("GET",uri,true);
	    req.withCredentials='yes';
	    req.send();}}
    Codex.serverSync=serverSync;

    function scrollToElt(elt,cxt){
	if ((elt.getAttribute) &&
	    ((elt.tocleve)|| (elt.getAttribute("toclevel")) ||
	     ((elt.sbookinfo) && (elt.sbookinfo.level))))
	    setHead(elt);
	else if (elt.head)
	    setHead(elt.head);
	if (Codex.paginate)
	    Codex.GoToPage(Codex.getPage(elt),"scrollTo");
	else if (fdjtDOM.isVisible(elt)) {}
	else if ((!cxt) || (elt===cxt))
	    fdjtUI.scrollIntoView(elt,elt.id,false,true,displayOffset());
	else fdjtUI.scrollIntoView(elt,elt.id,cxt,true,displayOffset());}
    
    function getLocInfo(elt){
	var counter=0; var lim=200;
	var forward=fdjtDOM.forward;
	while ((elt)&&(counter<lim)) {
	    if ((elt.id)&&(Codex.docinfo[elt.id])) break;
	    else {counter++; elt=forward(elt);}}
	if ((elt.id)&&(Codex.docinfo[elt.id])) {
	    var info=Codex.docinfo[elt.id];
	    return {start: info.starts_at,end: info.ends_at,
		    len: info.ends_at-info.starts_at};}
	else return false;}
    Codex.getLocInfo=getLocInfo;

    function resolveLocation(loc){
	var allinfo=Codex.docinfo._allinfo;
	var i=0; var lim=allinfo.length;
	while (i<lim) {
	    if (allinfo[i].starts_at<loc) i++;
	    else break;}
	while (i<lim)  {
	    if (allinfo[i].starts_at>loc) break;
	    else i++;}
	return fdjtID(allinfo[i-1].frag);}
    Codex.resolveLocation=resolveLocation;


    // This moves within the document in a persistent way
    function CodexGoTo(arg,noset,nosave){
	var target; var location;
	if (typeof arg === 'string') {
	    target=document.getElementById(arg);
	    var info=getLocInfo(target);
	    location=info.start;}
	else if (typeof arg === 'number') {
	    location=arg;
	    target=resolveLocation(arg);}
	else if (arg.nodeType) {
	    var info=getLocInfo(arg);
	    if (arg.id) target=arg;
	    else target=getTarget(arg);
	    location=info.start;}
	else {
	    fdjtLog.warn("Bad CodexGoTo %o",arg);
	    return;}
	if (!(target)) return;
	var page=((Codex.paginate)&&
		  (Codex.pagecount)&&
		  (Codex.getPage(target)));
	var info=((target.id)&&(Codex.docinfo[target.id]));
	if (Codex.Trace.nav)
	    fdjtLog("Codex.GoTo() #%o@P%o/L%o %o",
		    target.id,page,((info)&&(info.starts_at)),target);
	if (target.id) setHashID(target);
	if (info) {
	    if (typeof info.level === 'number')
		setHead(target);
	    else if (info.head) setHead(info.head.frag);}
	setLocation(location);
	if ((!(noset))&&(target.id)&&(!(inUI(target))))
	    setTarget(target,true,nosave||false);
	if (nosave) {}
	else if (noset)
	    Codex.setState({
		target: ((Codex.target)&&(Codex.target.id)),
		location: location,page: page})
	else Codex.setState(
	    {target: (target.id),location: location,page: page});
	if (typeof page === 'number') 
	    Codex.GoToPage(page,"CodexGoTo",nosave||false);
	Codex.location=location;}
    Codex.GoTo=CodexGoTo;

    function anchorFn(evt){
	var target=fdjtUI.T(evt);
	while (target)
	    if (target.href) break; else target=target.parentNode;
	if ((target)&&(target.href)&&(target.href[0]==='#')) {
	    var goto=document.getElementById(target.href.slice(1));
	    if (goto) {CodexGoTo(goto); fdjtUI.cancel(evt);}}}
    Codex.anchorFn=anchorFn;

    // This jumps and disables the HUD at the same time
    // We try to animate the transition
    function CodexJumpTo(target){
      if (Codex.hudup) CodexMode(false);
      CodexGoTo(target);}
    Codex.JumpTo=CodexJumpTo;

    function getLevel(elt){
	if (elt.toclevel) {
	    if (elt.toclevel==='none')
		return elt.toclevel=false;
	    else return elt.toclevel;}
	var attrval=
	    ((elt.getAttributeNS)&&
	     (elt.getAttributeNS('toclevel','http://sbooks.net')))||
	    (elt.getAttribute('toclevel'))||
	    (elt.getAttribute('data-toclevel'));
	if (attrval) {
	    if (attrval==='none') return false;
	    else return parseInt(attrval);}
	if (elt.className) {
	    var cname=elt.className;
	    var tocloc=cname.search(/sbook\dhead/);
	    if (tocloc>=0) return parseInt(cname.slice(5,6));}
	if (elt.tagName.search(/H\d/)==0)
	    return parseInt(elt.tagName.slice(1,2));
	else return false;}
    Codex.getTOCLevel=getLevel;
    


})();

fdjt_versions.decl("codex",codex_version);
fdjt_versions.decl("codex/core",codex_version);

/* Adding qricons */

/*
  function sbookAddQRIcons(){
  var i=0;
  while (i<Codex.heads.length) {
  var head=Codex.heads[i++];
  var id=head.id;
  var title=(head.sbookinfo)&&sbook_get_titlepath(head.sbookinfo);
  var qrhref="https://"+Codex.server+"/v4/qricon.png?"+
  "URI="+encodeURIComponent(Codex.docuri||Codex.refuri)+
  ((id)?("&FRAG="+head.id):"")+
  ((title) ? ("&TITLE="+encodeURIComponent(title)) : "");
  var qricon=fdjtDOM.Image(qrhref,".sbookqricon");
  fdjtDOM.prepend(head,qricon);}}
*/

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_startup_id="$Id$";
var codex_startup_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements a Javascript/DHTML UI for reading
   large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

var _sbook_autoindex=
  ((typeof _sbook_autoindex === 'undefined')?(false):(_sbook_autoindex));

Codex.Startup=
  (function(){

    var sbook_faketouch=false;
    var sbook_showconsole=true;

    var sbook_fullpages=[];
    var sbook_heading_qricons=false;

    var https_graphics=
      "https://beingmeta.s3.amazonaws.com/static/graphics/";

    function sbicon(name,suffix) {return Codex.graphics+name+(suffix||"");}
    function cxicon(name,suffix) {
	return Codex.graphics+"codex/"+name+(suffix||"");}


    /* Initialization */
	
    var _sbook_setup_start=false;
	
    var TOA=fdjtDOM.Array;

    function startupLog(){
      var args=TOA(arguments);
      var div=fdjtDOM("div#CODEXSTARTUPMSG",fdjtString.apply(null,args));
      fdjtLog.apply(null,arguments);
      fdjtDOM.replace("CODEXSTARTUPMSG",div);}

    function startupMessage(){
      var args=TOA(arguments);
      var div=fdjtDOM("div#CODEXSTARTUPMSG",fdjtString.apply(null,args));
      if ((Codex.Trace.startup)&&
	  (typeof Codex.Trace.startup === "number")&&
	  (Codex.Trace.startup>1))
	fdjtLog.apply(null,arguments);
      fdjtDOM.replace("CODEXSTARTUPMSG",div);}
    Codex.startupMessage=startupMessage;

    function Startup(force){
      if (Codex._setup) return;
      if ((!force)&&(fdjtState.getQuery("nosbooks"))) return; 
      fdjtLog.console="CODEXCONSOLE";
      fdjtLog.consoletoo=true;
      fdjtLog("This is Codex version %d, built at %s on %s",
	      fdjt_versions.codex,sbooks_buildtime,sbooks_buildhost);
      if (navigator.appVersion)
	fdjtLog("App version: %s",navigator.appVersion);
      if (!(Codex._setup_start)) Codex._setup_start=new Date();
      // Get various settings
      readSettings();
      CodexPaginate.readSettings();
      // Execute and fdjt initializations
      fdjtDOM.init();
      // Declare this
      fdjtDOM.addClass(document.body,"codexstartup");
      var metadata=false;
      var helphud=false;
      fdjtTime.timeslice
	([// Setup sbook tables, databases, etc
	  Codex.initDB,
	  // This wraps the body in its own block and sets up
	  //  the DOM structure for pagination
	  initBody,
	  // This initializes the book tools (the HUD, or Heads Up Display)
	  Codex.initHUD,
	  (function(){initConfig(); CodexMode("help");}),
	  Codex.setupGestures,
	  getUser,
	  function(){
	    // This scans the DOM.  It would probably be a good
	    //  idea to do this asynchronously
	    metadata=new CodexDOMScan(Codex.root);
	    Codex.docinfo=Codex.DocInfo.map=metadata;
	    Codex.ends_at=Codex.docinfo[Codex.root.id].ends_at;},
	  // Now you're ready to paginate
	  function(){if (Codex.paginate) Codex.repaginate();},
	  function(){
	    startupLog("Building table of contents based on %d heads",
		       Codex.docinfo._headcount);
	    Codex.setupTOC(metadata[Codex.root.id]);},
	  10,
	  ((Knodule)&&(Knodule.HTML)&&
	   (Knodule.HTML.Setup)&&(Codex.knodule)&&
	   (function(){
	     startupLog("Processing knodule %s",Codex.knodule.name);
	     Knodule.HTML.Setup(Codex.knodule);})),
	  applyInlineTags,
	  function(){
	    startupLog("Indexing tag attributes");
	    Codex.indexContentTags(metadata);
	    startupLog("Indexing inline attributes");
	    Codex.indexInlineTags(Codex.knodule);
	    if (_sbook_autoindex) {
	      startupLog("Indexing automatic tags");
	      Codex.useAutoIndex(_sbook_autoindex,Codex.knodule);}},
	  function(){startupLog("Setting up tag clouds");},10,
	  function(){initClouds();},
	  function(){startupLog("Configuring gloss server");},10,
	  setupGlossServer,
	  function(){
	    if (Codex.user) startupLog("Getting glosses");},10,
	  function(){ if (Codex.user) setupGlosses();},
	  function(){
	    if ((Codex.user)&&(!(Codex.glossing))&&(!(Codex.glossed)))
	      startupLog("Getting glosses");},10,
	  function(){
	    if ((Codex.user)&&(!(Codex.glossing))&&(!(Codex.glossed)))
	      setupGlosses();},500,
	  function(){
	    if ((Codex.user)&&(!(Codex.glossing))&&(!(Codex.glossed)))
	      startupLog("Getting glosses");},10,
	  function(){
	    if ((!(Codex.glossing))&&(!(Codex.glossed))) {
	      if (Codex.user) setupGlosses();
	      else gotGlosses();}},
	  function(){
	    if ((fdjtState.getQuery("join"))||
		(fdjtState.getQuery("joined"))||
		(fdjtState.getQuery("action"))||
		(fdjtState.getQuery("invitation"))) {
	      CodexMode("sbookapp");}
	    else if (fdjtState.getQuery("startmode")) 
	      CodexMode(fdjtState.getQuery("startmode"));
	    if ((!(Codex.paginate))||(Codex.paginated))
	      startupDone();
	    else Codex.pagewait=startupDone;}],
	 100,25);}
    Codex.Startup=Startup;
    
    function startupDone(){
      initLocation();
      Codex.displaySync();
      setInterval(Codex.serverSync,60000);
      fdjtDOM.dropClass(document.body,"codexstartup");
      if ((Codex.mode==='help')&&(Codex.hidesplash)) {
	CodexMode(false);}
      _sbook_setup=Codex._setup=new Date();}

    /* Application settings */

    var optrules=
      {"paginate":["scrolling"],
       "scrolling":["paginate"],
       "touch":["mouse","kbd"],
       "mouse":["touch","kbd"],
       "kbd":["touch","mouse"]};

    function setopt(opt,flag){
      if (typeof flag === 'undefined') flag=true;
      if ((flag)&&(sbook[opt])) return;
      else if ((!(flag))&&(!(sbook[opt]))) return;
      var unset=optrules[opt];
      sbook[opt]=true;
      if (unset) {
	var i=0; var lim=unset.length;
	sbook[unset[i++]]=false;}}

    function workOffline(refuri){
      var value=fdjtState.getQuery("offline")||
	fdjtState.getLocal("codex.offline("+refuri+")")||
	fdjtState.getLocal("codex.mycopy("+refuri+")")||
	fdjtState.getLocal("codex.offline")||
	((fdjtDOM.getMeta("sbook.mycopyid")))||
	((fdjtDOM.getMeta("MYCOPYID")))||
	(fdjtDOM.getMeta("sbook.offline"));
      if ((!(value))||(value==="no")||(value==="off")||(value==="never"))
	return false;
      else if ((value==="ask")&&(window.confirm))
	return window.confirm("Read offline?");
      else return true;}
	
    var glossref_classes=false;

    function readSettings(){
      if (typeof _sbook_loadinfo === "undefined") _sbook_loadinfo=false;
      // Basic stuff
      var useragent=navigator.userAgent;
      var refuri=_getsbookrefuri();
      document.body.refuri=Codex.refuri=refuri;
      Codex.docuri=_getsbookdocuri();
      Codex.devinfo=fdjtState.versionInfo();
      var deviceid=fdjtState.getLocal("codex.deviceId",false);
      var devicename=fdjtState.getLocal("codex.deviceName",false);
      if (!(deviceid)) {
	deviceid=fdjtState.getUUID();
	fdjtState.setLocal("codex.deviceId",deviceid);}
      Codex.deviceId=deviceid;
      if (devicename) Codex.deviceName=devicename;
      var refuris=fdjtState.getLocal("codex.refuris",true)||[];
      var offline=workOffline(refuri);
      Codex.offline=((offline)?(true):(false));
      if (offline)
	fdjtState.setLocal("codex.offline("+refuri+")",offline);
      // Get the settings for scanning the document structure
      getScanSettings();
      // Get the settings for automatic pagination
      getPageSettings();
      if ((Codex.graphics==="http://static.beingmeta.com/graphics/")&&
	  (window.location.protocol==='https:'))
	Codex.graphics=https_graphics;
	    
      // Whether to suppress login, etc
      if ((fdjtState.getLocal("codex.nologin"))||
	  (fdjtState.getQuery("nologin")))
	Codex.nologin=true;
      Codex.max_excerpt=fdjtDOM.getMeta("sbook.maxexcerpt")||
	(Codex.max_excerpt);
      Codex.min_excerpt=fdjtDOM.getMeta("sbook.minexcerpt")||
	(Codex.min_excerpt);
      var sbooksrv=fdjtDOM.getMeta("sbook.server")||
	fdjtDOM.getMeta("SBOOKSERVER");
      if (sbooksrv) Codex.server=sbooksrv;
      else if (fdjtState.getCookie["SBOOKSERVER"])
	Codex.server=fdjtState.getCookie["SBOOKSERVER"];
      else Codex.server=lookupServer(document.domain);
      if (!(Codex.server)) Codex.server=Codex.default_server;
      sbook_ajax_uri=fdjtDOM.getMeta("sbook.ajax",true);
      Codex.mycopyid=fdjtDOM.getMeta("sbook.mycopyid")||
	((offline)&&(fdjtState.getLocal("mycopy("+refuri+")")))||
	false;
      Codex.syncstamp=fdjtState.getLocal("syncstamp("+refuri+")",true);
	    
      if ((offline)&&
	  (!(fdjtState.getLocal("codex.offline("+refuri+")")))) {
	fdjtState.setLocal("codex.offline("+refuri+")",true,true);
	refuris.push(refuri);
	fdjtState.setLocal("codex.refuris",refuris,true);}
	    
      var isIphone = (/iphone/gi).test(navigator.appVersion);
      var isIpad = (/ipad/gi).test(navigator.appVersion);
      var isAndroid = (/android/gi).test(navigator.appVersion);
      var isWebKit = navigator.appVersion.search("WebKit")>=0;
      var isWebTouch = isIphone || isIpad || isAndroid;

      if ((typeof Codex.colpage === 'undefined')&&
	  ((Codex.devinfo.Chrome)||
	   ((Codex.devinfo.AppleWebKit)&&
	    (Codex.devinfo.Mobile)&&
	    (Codex.devinfo.AppleWebKit>532))||
	   ((Codex.devinfo.AppleWebKit)&&
	    (Codex.devinfo.AppleWebKit>533))))
	Codex.colpage=true;
      if (isWebTouch) {
	fdjtDOM.addClass(document.body,"sbooktouch");
	viewportSetup();
	Codex.ui="webtouch"; Codex.touch=true;}
      if ((useragent.search("Safari/")>0)&&
	  (useragent.search("Mobile/")>0)) { 
	hide_mobile_safari_address_bar();
	Codex.nativescroll=false;
	Codex.scrolldivs=false;
	// Have fdjtLog do it's own format conversion for the log
	fdjtLog.doformat=true;}
      else if (sbook_faketouch) {
	fdjtDOM.addClass(document.body,"sbooktouch");
	viewportSetup();
	Codex.ui="faketouch"}
      else {
	Codex.ui="mouse";}
	    
      Codex.allglosses=
	((offline)?
	 ((fdjtState.getLocal("glosses("+refuri+")",true))||[]):
	 []);
      Codex.allsources=
	((offline)?
	 ((fdjtState.getLocal("sources("+refuri+")",true))||{}):
	{});
      Codex.glossetc=
	((offline)?
	 ((fdjtState.getLocal("glossetc("+refuri+")",true))||{}):
	{});}

    var config_handlers={};
    var default_config=
      {pageview: true,
       bodysize: 'normal',bodystyle: 'serif',
       uisize: 'normal',showconsole: false,
       animatepages: true,animatehud: true};
    var current_config={};

    var setCheckSpan=fdjtUI.CheckSpan.set;

    function addConfig(name,handler){
      config_handlers[name]=handler;}
    Codex.addConfig=addConfig;

    function setConfig(name,value){
      if (arguments.length===1) {
	var config=name;
	Codex.postconfig=[];
	for (var setting in config) {
	  if (config.hasOwnProperty(setting))
	    setConfig(setting,config[setting]);}
	var dopost=Codex.postconfig;
	Codex.postconfig=false;
	var i=0; var lim=dopost.length;
	while (i<lim) dopost[i++]();
	return;}
      if (current_config[name]===value) return;
      var input_name="CODEX"+(name.toUpperCase());
      var inputs=document.getElementsByName(input_name);
      var i=0; var lim=inputs.length;
      while (i<lim) {
	var input=inputs[i++];
	if (input.tagName!=='INPUT') continue;
	if (input.type==='checkbox') {
	  if (value) setCheckSpan(input,true);
	  else setCheckSpan(input,false);}
	else if (input.type==='radio') {
	  if (value===input.value) setCheckSpan(input,true);
	  else setCheckSpan(input,false);}
	else input.value=value;}
      if (config_handlers[name])
	config_handlers[name](name,value);
      current_config[name]=value;}
    Codex.setConfig=setConfig;

    function saveConfig(config){
      if (!(config)) config=current_config;
      else setConfig(config);
      var saved={};
      for (var setting in config) {
	if (config[setting]!==default_config[setting]) {
	  saved[setting]=config[setting];}}
      fdjtState.setLocal('codex.config',JSON.stringify(saved));}
    Codex.saveConfig=saveConfig;

    function initConfig(){
      var config=fdjtState.getLocal('codex.config',true);
      Codex.postconfig=[];
      if (config) {
	for (var setting in config) {
	  if (config.hasOwnProperty(setting)) 
	    setConfig(setting,config[setting]);}}
      else config={};
      for (var setting in default_config) {
	if (!(config[setting]))
	  if (default_config.hasOwnProperty(setting))
	    setConfig(setting,default_config[setting]);}
      var dopost=Codex.postconfig;
      Codex.postconfig=false;
      var i=0; var lim=dopost.length;
      while (i<lim) dopost[i++]();}

    Codex.addConfig("hidesplash",function(name,value){
	Codex.hidesplash=value;});

    /* Viewport setup */

    var viewport_spec="width=device-width,initial-scale=1.0";
    function viewportSetup(){
      var head=fdjtDOM.getHEAD();
      var viewport=fdjtDOM.getMeta("viewport",false,false,true);
      if (!(viewport)) {
	viewport=document.createElement("META");
	viewport.setAttribute("name","viewport");
	head.appendChild(viewport);}
      viewport.setAttribute("content",viewport_spec);
      var isapp=fdjtDOM.getMeta
	("apple-mobile-web-app-capable",false,false,true);
      if (!(isapp)) {
	isapp=document.createElement("META");
	isapp.setAttribute("name","apple-mobile-web-app-capable");
	head.appendChild(isapp);}}

    function hide_mobile_safari_address_bar(){
      window.scrollTo(0,1);
      setTimeout(function(){window.scrollTo(0,0);},0);}

    /* Getting settings */

    function _getsbookrefuri(){
      var refuri=fdjtDOM.getLink("sbook.refuri",false,false)||
	fdjtDOM.getLink("refuri",false,false)||
	fdjtDOM.getMeta("sbook.refuri",false,false)||
	fdjtDOM.getMeta("refuri",false,false)||
	fdjtDOM.getLink("canonical",false,true);
      if (refuri) return decodeURI(refuri);
      else {
	var locref=document.location.href;
	var qstart=locref.indexOf('?');
	if (qstart>=0) locref=locref.slice(0,qstart);
	var hstart=locref.indexOf('#');
	if (hstart>=0) locref=locref.slice(0,hstart);
	return decodeURI(locref);}}
    function _getsbookdocuri(){
      return fdjtDOM.getLink("sbook.docuri",false)||
	fdjtDOM.getLink("docuri",false)||
	fdjtDOM.getMeta("sbook.docuri",false)||
	fdjtDOM.getMeta("docuri",false)||
	fdjtDOM.getLink("canonical",false)||
	location.href;}

    function lookupServer(string){
      var sbook_servers=Codex.servers;
      var i=0;
      while (i<sbook_servers.length) 
	if (sbook_servers[i][0]===string)
	  return sbook_servers[i][1];
	else if (string.search(sbook_servers[i][0])>=0)
	  return sbook_servers[i][1];
	else if ((sbook_servers[i][0].call) &&
		 (sbook_servers[i][0].call(string)))
	  return sbook_servers[i][1];
	else i++;
      return false;}

    function hasTOCLevel(elt){
      if ((elt.toclevel)||
	  ((elt.getAttributeNS)&&
	   (elt.getAttributeNS('toclevel','http://sbooks.net/')))||
	  (elt.getAttribute('toclevel'))||
	  (elt.getAttribute('data-toclevel'))||
	  ((elt.className)&&
	   ((elt.className.search(/\bsbook\dhead\b/)>=0)||
	    (elt.className.search(/\bsbooknotoc\b/)>=0)||
	    (elt.className.search(/\bsbookignore\b/)>=0))))
	return true;
      else return false;}
    Codex.hasTOCLevel=hasTOCLevel;

    function getScanSettings(){
      if (!(Codex.root))
	if (fdjtDOM.getMeta("sbook.root"))
	  Codex.root=fdjtID(fdjtDOM.getMeta("sbook.root"));
	else Codex.root=fdjtID("SBOOKCONTENT")||document.body;
      if (!(Codex.start))
	if (fdjtDOM.getMeta("sbook.start"))
	  Codex.start=fdjtID(fdjtDOM.getMeta("sbook.start"));
	else if (fdjtID("SBOOKSTART"))
	  Codex.start=fdjtID("SBOOKSTART");
	else {
	  var titlepage=fdjtID("SBOOKTITLE")||fdjtID("TITLEPAGE");
	  while (titlepage)
	    if (fdjtDOM.nextElt(titlepage)) {
	      Codex.start=fdjtDOM.nextElt(titlepage); break;}
	    else titlepage=titlepage.parentNode;}
      var i=1; while (i<9) {
	var rules=fdjtDOM.getMeta("sbook.head"+i,true).
	  concat(fdjtDOM.getMeta("sbook"+i+"head",true));
	if ((rules)&&(rules.length)) {
	  var j=0; var lim=rules.length;
	  var elements=fdjtDOM.getChildren(document.body,rules[j++]);
	  var k=0; var n=elements.length;
	  while (k<n) {
	    var elt=elements[k++];
	    if (!(hasTOCLevel(elt))) elt.toclevel=i;}}
	i++;}
      if (fdjtDOM.getMeta("sbookignore")) 
	Codex.ignore=new fdjtDOM.Selector(fdjtDOM.getMeta("sbookignore"));
      if (fdjtDOM.getMeta("sbooknotoc")) 
	Codex.notoc=new fdjtDOM.Selector(fdjtDOM.getMeta("sbooknotoc"));
      if (fdjtDOM.getMeta("sbookterminal"))
	Codex.terminal_rules=
	  new fdjtDOM.Selector(fdjtDOM.getMeta("sbookterminal"));
      if (fdjtDOM.getMeta("sbookid")) 
	sbook_idify=new fdjtDOM.Selector(fdjtDOM.getMeta("sbookid"));
      if ((fdjtDOM.getMeta("sbookfocus"))) 
	Codex.focus=new fdjtDOM.Selector(fdjtDOM.getMeta("sbookfocus"));
      if (fdjtDOM.getMeta("sbooknofocus"))
	Codex.nofocus=new fdjtDOM.Selector(fdjtDOM.getMeta("sbooknofocus"));}

    function getPageSettings(){
      var tocmajor=fdjtDOM.getMeta("sbook.tocmajor",true);
      if (tocmajor) sbook_tocmajor=parseInt(tocmajor);
      var sbook_fullpage_rules=fdjtDOM.getMeta("sbookfullpage",true);
      if (sbook_fullpage_rules) {
	var i=0; while (i<sbook_fullpage_rules.length) {
	  sbook_fullpages.push
	    (fdjtDOM.Selector(sbook_fullpage_rules[i++]));}}
      sbook_fullpages.push
	(fdjtDOM.Selector(".sbookfullpage, .titlepage"));}

    function applyMetaClass(name){
      var meta=fdjtDOM.getMeta(name,true);
      var i=0; var lim=meta.length;
      while (i<lim) fdjtDOM.addClass(fdjtDOM.$(meta[i++]),name);}

    var note_count=1;
    function initBody(){
      var content=fdjtDOM("div#CODEXCONTENT");
      var nodes=fdjtDOM.toArray(document.body.childNodes);
      var i=0; var lim=nodes.length;
      while (i<lim) content.appendChild(nodes[i++]);
      Codex.content=content;
      var allnotes=fdjtID("SBOOKNOTES");
      var allasides=fdjtID("SBOOKASIDES");
      var alldetails=fdjtID("SBOOKDETAILS");
      if (!(alldetails)) {
	var alldetails=fdjtDOM("div#SBOOKDETAILS");
	fdjtDOM(content,alldetails);}
      if (!(allasides)) {
	var allasides=fdjtDOM("div#SBOOKASIDES");
	fdjtDOM(content,allasides);}
      if (!(allnotes)) {
	var allnotes=fdjtDOM("div.sbookbackmatter#SBOOKNOTES");
	fdjtDOM(content,allnotes);}
      var paginating=fdjtDOM("div#CODEXPAGINATING","Laid out ",
			     fdjtDOM("span#CODEXPAGEPROGRESS","")," pages");
      document.body.appendChild
	(fdjtDOM("div#CODEXPAGE",
		 paginating,fdjtDOM("div#CODEXPAGES",content)));
      Codex.page=fdjtID("CODEXPAGE");
      Codex.pages=fdjtID("CODEXPAGES");
      fdjtDOM.addClass(document.body,"sbook");
      applyMetaClass("sbookdetails");
      applyMetaClass("sbooknoteref");
      applyMetaClass("sbookbibref");
      applyMetaClass("sbookxnote");
      applyMetaClass("sbookaside");
      applyMetaClass("sbookbackmatter");
      var sbookxnotes=fdjtDOM.$("sbookxnote");
      // Add refs for all of the xnotes
      var i=0; var lim=sbookxnotes.length;
      while (i<lim) {
	var note=sbookxnotes[i++];
	var anchor=fdjtDOM("A.sbooknoteref","\u2193");
	var count=note_count++;
	anchor.id="SBOOKNOTEREF"+count;
	if (!(note.id)) note.id="SBOOKNOTE"+count;
	anchor.href="#"+note.id;
	fdjtDOM.insertBefore(note,anchor);}
      // Move all the notes to the end
      var noterefs=fdjtDOM.$(".sbooknoteref,.sbookbibref");
      var i=0; var lim=noterefs.length;
      while (i<lim) {
	var noteref=noterefs[i++];
	var idcontext=Codex.getTarget(noteref.parentNode);
	if ((noteref.href)&&(noteref.href[0]==='#')) {
	  var noteid=noteref.href.slice(1);
	  var notenode=fdjtID(noteid);
	  if (!(notenode)) continue;
	  if ((noteref.id)||(idcontext)) {
	    var backanchor=fdjtDOM("A.sbooknotebackref","\u2191");
	    backanchor.href="#"+noteref.id||(idcontext.id);
	    fdjtDOM.prepend(notenode,backanchor);}
	  if ((idcontext)&&(fdjtDOM.hasClass(noteref,"sbooknoteref")))
	    notenode.codextocloc=idcontext.id;
	  if ((fdjtDOM.hasClass(noteref,"sbooknoteref"))&&
	      (!(fdjtDOM.hasParent(notenode,".sbookbackmatter"))))
	    fdjtDOM.append(allnotes,notenode);}}
      // Move all the details to the end
      var details=fdjtDOM.$("detail,.sbookdetail");
      var i=0; var lim=details.length;
      while (i<lim) {
	var detail=details[i++];
	var head=fdjtDOM.getChild(detail,"summary,.sbooksummary");
	var detailhead=((head)?(fdjtDOM.clone(head)):
			fdjtDIV("div.sbookdetailstart",
				(fdjtString.truncate(fdjtDOM.textify(detail),42))));
	var anchor=fdjtDOM("A.sbookdetailref",detailhead);
	var count=detail_count++;
	if (!(detail.id)) detail.id="SBOOKDETAIL"+count;
	anchor.href="#"+detail.id; anchor.id="SBOOKDETAILREF"+count;
	fdjtDOM.replace(detail,anchor);
	detail.codextocloc=anchor.id;
	fdjtDOM.append(alldetails,detail);}
      // Move all the asides to the end
      var asides=fdjtDOM.$("aside,.sbookaside");
      var i=0; var lim=asides.length;
      while (i<lim) {
	var aside=asides[i++];
	var head=fdjtDOM.getChild(aside,".sbookasidehead")||
	  fdjtDOM.getChild(aside,"HEADER")||
	  fdjtDOM.getChild(aside,"H1")||
	  fdjtDOM.getChild(aside,"H2")||
	  fdjtDOM.getChild(aside,"H3")||
	  fdjtDOM.getChild(aside,"H4")||
	  fdjtDOM.getChild(aside,"H5")||
	  fdjtDOM.getChild(aside,"H6");
	var asidehead=((head)?(fdjtDOM.clone(head)):
		       fdjtDIV("div.sbookasidestart",
			       (fdjtString.truncate(fdjtDOM.textify(aside),42))));
	var anchor=fdjtDOM("A.sbookasideref",asidehead);
	var count=aside_count++;
	if (!(aside.id)) aside.id="SBOOKASIDE"+count;
	anchor.href="#"+aside.id; anchor.id="SBOOKASIDEREF"+count;
	fdjtDOM.insertBefore(aside,anchor);
	aside.codextocloc=anchor.id;
	fdjtDOM.append(allasides,aside);}
      // Initialize the margins
      initMargins();
      if (Codex.Trace.startup>1)
	fdjtLog("Initialized body");}
	
    /* Margin creation */

    function initMargins(){
      var topleading=fdjtDOM("div#SBOOKTOPLEADING.leading.top"," ");
      var bottomleading=fdjtDOM("div#SBOOKBOTTOMLEADING.leading.bottom"," ");
      topleading.sbookui=true; bottomleading.sbookui=true;
	    
      var pagehead=fdjtDOM("div.sbookmargin#SBOOKPAGEHEAD"," ");
      var pageinfo=
	fdjtDOM("div#CODEXPAGEINFO",
		fdjtDOM("div.progressbar#CODEXPROGRESSBAR",""),
		fdjtDOM("div#CODEXPAGENO",
			fdjtDOM("span#CODEXPAGENOTEXT","p/n")));
      var pagefoot=fdjtDOM
	("div.sbookmargin#SBOOKPAGEFOOT",
	 pageinfo," ",
	 fdjtDOM.Image(cxicon("PageNext50x50.png"),
		       "img#CODEXPAGENEXT.hudbutton.bottomright",
		       "pagenext","go to the next result/section/page"));
      pagehead.sbookui=true; pagefoot.sbookui=true;
      sbookPageHead=pagehead; sbookPageFoot=pagefoot;
	    
      fdjtDOM.addListeners
	(pageinfo,Codex.UI.handlers[Codex.ui]["#CODEXPAGEINFO"]);
	    
      fdjtDOM.prepend(document.body,pagehead,pagefoot);
	    
      fdjtID("CODEXPAGENEXT").onclick=Codex.Forward;
	    
      window.scrollTo(0,0);
	    
      // The better way to do this might be to change the stylesheet,
      //  but fdjtDOM doesn't currently handle that 
      var bgcolor=getBGColor(document.body)||"white";
      if (bgcolor==='transparent')
	bgcolor=fdjtDOM.getStyle(document.body).backgroundColor;
      if ((bgcolor)&&(bgcolor.search("rgba")>=0)) {
	if (bgcolor.search(/,\s*0\s*\)/)>0) bgcolor='white';
	else {
	  bgcolor=bgcolor.replace("rgba","rgb");
	  bgcolor=bgcolor.replace(/,\s*((\d+)|(\d+.\d+))\s*\)/,")");}}
      else if (bgcolor==="transparent") bgcolor="white";
      pagehead.style.backgroundColor=bgcolor;
      pagefoot.style.backgroundColor=bgcolor;
      fdjtDOM.addListener(false,"resize",CodexPaginate.onresize);}
	
    function getBGColor(arg){
      var color=fdjtDOM.getStyle(arg).backgroundColor;
      if (!(color)) return false;
      else if (color==="transparent") return false;
      else if (color.search(/rgba/)>=0) return false;
      else return color;}

    /* Getting the current user */

    function getUser() {
      var refuri=Codex.refuri;
      var loadinfo=_sbook_loadinfo||false;
      if (Codex.Trace.startup>1)
	fdjtLog("Getting user for %o cur=%o",refuri,Codex.user);
      if (Codex.user) return;
      else if (Codex.nologin) return;
      if ((loadinfo)&&
	  (setUser(loadinfo.userinfo,loadinfo.nodeid,
		   loadinfo.sources,loadinfo.outlets,
		   loadinfo.etc,loadinfo.sync))) 
	return;
      if ((Codex.offline)&&
	  (fdjtState.getLocal("codex.user"))&&
	  (fdjtState.getLocal("codex.nodeid("+refuri+")"))) {
	var refuri=Codex.refuri;
	var user=fdjtState.getLocal("codex.user");
	if (Codex.trace.startup)
	  fdjtLog("Restoring offline user info for %o reading %o",
		  user,refuri);
	var userinfo=JSON.parse(fdjtState.getLocal(user));
	var sources=fdjtState.getLocal("codex.sources("+refuri+")",true);
	var outlets=fdjtState.getLocal("codex.outlets("+refuri+")",true);
	var etc=fdjtState.getLocal("codex.etc("+refuri+")",true);
	var nodeid=fdjtState.getLocal("codex.nodeid("+refuri+")");
	var sync=fdjtState.getLocal("codex.usersync",true);
	var etcinfo=[];
	if (etc) {
	  var i=0; var lim=etc.length;
	  while (i<lim) {
	    var ref=etc[i++];
	    fdjtKB.load(ref); etcinfo.push(ref);}}
	setUser(userinfo,nodeid,sources,outlets,etcinfo,sync);
	return;}
      else if (!(fdjtID("SBOOKGETUSERINFO"))) {
	var user_script=fdjtDOM("SCRIPT#SBOOKGETUSERINFO");
	user_script.language="javascript";
	user_script.src=
	  "https://"+Codex.server+"/v4/user.js";
	document.body.appendChild(user_script);
	fdjtDOM.addClass(document.body,"nosbookuser");}
      else fdjtDOM.addClass(document.body,"nosbookuser");}
	
    function setUser(userinfo,nodeid,sources,outlets,etc,sync){
      var persist=((Codex.offline)&&(navigator.onLine));
      var refuri=Codex.refuri;
      if (Codex.user)
	if (userinfo.oid===Codex.user.oid) {}
	else throw { error: "Can't change user"};
      var syncstamp=Codex.syncstamp;
      if ((syncstamp)&&(syncstamp>=sync)) {
	fdjtLog.warn(
		     "Cached user information is newer (%o) than loaded (%o)",
		     syncstamp,sync);
	return false;}
      Codex.user=fdjtKB.Import(userinfo);
      if (persist) {
	fdjtState.setLocal(Codex.user.oid,Codex.user,true);
	fdjtState.setLocal("codex.nodeid("+Codex.refuri+")",nodeid);
	fdjtState.setLocal("codex.user",Codex.user.oid);}
      gotInfo("sources",sources,persist);
      gotInfo("outlets",outlets,persist);
      gotInfo("etc",etc,persist);
      if (outlets) {
	var i=0; var ilim=outlets.length;
	while (i<ilim) {
	  var outlet=outlets[i++];
	  var span=fdjtID("SBOOKGLOSSOUTLET"+outlet.humid);
	  if (!(span)) {
	    var completion=
	      fdjtDOM("span.completion.outlet.cue",outlet.name);
	    completion.id="SBOOKGLOSSOUTLET"+outlet.humid;
	    completion.setAttribute("value",outlet.qid);
	    completion.setAttribute("key",outlet.name);
	    fdjtDOM(fdjtID("CODEXGLOSSOUTLETS"),completion," ");
	    if (Codex.gloss_cloud)
	      Codex.gloss_cloud.addCompletion(completion);}}}
      if (sync) {
	Codex.usersync=sync;
	if (persist) fdjtState.setLocal("codex.usersync",sync);}
      if (!(Codex.nodeid)) {
	Codex.nodeid=nodeid;
	if ((nodeid)&&(persist))
	  fdjtState.setLocal("codex.nodeid("+refuri+")",nodeid);}
      setupUser();
      return Codex.user;}
    function gotInfo(name,info,persist) {
      var refuri=Codex.refuri;
      if (info)
	if (info instanceof Array) {
	  var i=0; var lim=info.length; var qids=[];
	  while (i<lim) {
	    if (typeof info[i] === 'string') {
	      var qid=info[i++];
	      if (Codex.offline) fdjtKB.load(qid);
	      qids.push(qid);}
	    else {
	      var obj=fdjtKB.Import(info[i++]);
	      if (persist) 
		fdjtState.setLocal(obj.qid,obj,true);
	      qids.push(obj.qid);}}
	  sbook[name]=qids;
	  if (Codex.offline)
	    fdjtState.setLocal
	      ("codex."+name+"("+refuri+")",qids,true);}
	else {
	  var obj=fdjtKB.Import(info);
	  if (persist) 
	    fdjtState.setLocal(obj.qid,obj,true);
	  sbook[name]=obj.qid;
	  if (persist)
	    fdjtState.setLocal("codex."+name+"("+refuri+")",qid,true);}}
    Codex.setUser=setUser;
    function setupUser(){
      if (Codex._user_setup) return;
      if (!(Codex.user)) {
	fdjtDOM.addClass(document.body,"nosbookuser");
	return;}
      fdjtDOM.dropClass(document.body,"nosbookuser");
      var username=Codex.user.name;
      fdjtID("SBOOKUSERNAME").innerHTML=username;
      if (fdjtID("SBOOKMARKUSER"))
	fdjtID("SBOOKMARKUSER").value=Codex.user.oid;
      var pic=
	(Codex.user.pic)||
	((Codex.user.fbid)&&
	 ("https://graph.facebook.com/"+Codex.user.fbid+"/picture?type=square"));
      if (pic) {
	if (fdjtID("SBOOKMARKIMAGE")) fdjtID("SBOOKMARKIMAGE").src=pic;
	if (fdjtID("SBOOKUSERPIC")) fdjtID("SBOOKUSERPIC").src=pic;}
      if (fdjtID("SBOOKFRIENDLYOPTION"))
	if (Codex.user)
	  fdjtID("SBOOKFRIENDLYOPTION").value=Codex.user.oid;
	else fdjtID("SBOOKFRIENDLYOPTION").value="";
      var idlinks=document.getElementsByName("IDLINK");
      if (idlinks) {
	var i=0; var len=idlinks.length;
	while (i<len) {
	  var idlink=idlinks[i++];
	  idlink.target='_blank';
	  idlink.title='click to edit your personal information';
	  idlink.href='https://auth.sbooks.net/admin/identity';}}
      if (Codex.user.friends) {
	var friends=Codex.user.friends; var i=0; var lim=friends.length;
	while (i<lim) {
	  var friend=fdjtKB.ref(friends[i++]);
	  Codex.addTag2UI(friend);}}
      Codex._user_setup=true;}

    function setupGlosses() {
      var allglosses=[];
      Codex.glossing=fdjtTime();
      var latest=Codex.syncstamp||0;
      var loaded=((_sbook_loadinfo)&&(_sbook_loadinfo.glosses))||[];
      var cached=fdjtState.getLocal("glosses("+Codex.refuri+")",true);
      if ((_sbook_loadinfo)&&(_sbook_loadinfo.sync)) {
	if ((latest)&&(latest>_sbook_loadinfo.sync)) {
	  fdjtLog.warn("Cached data is fresher than loaded data");
	  return;}
	else latest=Codex.syncstamp=(_sbook_loadinfo.sync);}
      Codex.glosses.Import(loaded);
      if (cached) allglosses=cached;
      if (loaded.length) {
	var n=loaded.length; var i=0; while (i<n) {
	  var gloss=loaded[i++];
	  var id=gloss.qid||gloss.uuid||gloss.oid;
	  var tstamp=gloss.syncstamp||gloss.tstamp;
	  if (tstamp>latest) latest=tstamp;
	  allglosses.push(id);}}
      if ((_sbook_loadinfo)&&(_sbook_loadinfo.etc))
	fdjtKB.Import(_sbook_loadinfo.etc);
      Codex.syncstamp=latest;
      Codex.allglosses=allglosses;
      if (Codex.offline) {
	fdjtState.setLocal("glosses("+Codex.refuri+")",allglosses,true);
	fdjtState.setLocal("syncstamp("+Codex.refuri+")",latest);}
      if ((allglosses.length===0) &&
	  (!(Codex.nologin)) && (Codex.user) && (navigator.onLine) &&
	  (!(_sbook_loadinfo))) {
	var glosses_script=fdjtDOM("SCRIPT#SBOOKGETGLOSSES");
	glosses_script.language="javascript";
	glosses_script.src="https://"+Codex.server+
	  "/v4/glosses.js?CALLBACK=Codex.Startup.initGlosses&REFURI="+
	  encodeURIComponent(Codex.refuri);
	if (Codex.Trace.glosses)
	  fdjtLog("setupGlosses/JSONP %o sync=%o",
		  glosses_script.src,Codex.syncstamp||false);
	if (Codex.syncstamp)
	  glosses_script.src=
	    glosses_script.src+"&SYNCSTAMP="+Codex.syncstamp;
	document.body.appendChild(glosses_script);}
      else gotGlosses();}
	
    function go_online(evt){return offline_update();}
    function offline_update(){
      Codex.writeGlosses();
      var uri="https://"+Codex.server+
	"/v4/update?REFURI="+
	encodeURIComponent(Codex.refuri)+
	"&ORIGIN="+
	encodeURIComponent
	(document.location.protocol+"//"+document.location.hostname);
      if (Codex.syncstamp) uri=uri+"&SYNCSTAMP="+(Codex.syncstamp+1);
      fdjtAjax.jsonCall(offline_import,uri);}
    function offline_import(results){
      fdjtKB.Import(results);
      var i=0; var lim=results.length;
      var syncstamp=Codex.syncstamp; var tstamp=false;
      while (i<lim) {
	tstamp=results[i++].tstamp;
	if ((tstamp)&&(tstamp>syncstamp)) syncstamp=tstamp;}
      Codex.syncstamp=syncstamp;
      fdjtState.setLocal("syncstamp("+Codex.refuri+")",syncstamp);}
    Codex.update=offline_update;
	
    /* This initializes the sbook state to the initial location with the
       document, using the hash value if there is one. */ 
    function initLocation() {
      var hash=window.location.hash; var target=Codex.root;
      if ((typeof hash === "string") && (hash.length>0)) {
	if ((hash[0]==='#') && (hash.length>1))
	  target=document.getElementById(hash.slice(1));
	else target=document.getElementById(hash);
	if (Codex.Trace.startup>1)
	  fdjtLog("sbookInitLocation hash=%s=%o",hash,target);
	if (target) Codex.GoTo(target,false,true);}
      else {
	var uri=Codex.docuri||Codex.refuri;
	var statestring=fdjtState.getLocal("codex.state("+uri+")");
	if (statestring) {
	  var state=JSON.parse(statestring);
	  if (state.target)
	    Codex.setTarget(state.target,(state.location),true);
	  if (state.location) Codex.GoTo(state.location,true,true);
	  Codex.state=state;}
	if ((Codex.user)&&(Codex.dosync)&&(navigator.onLine))
	  syncLocation();}}
	
    function syncLocation(){
      if (!(Codex.user)) return;
      var uri="https://"+Codex.server+"/v4/sync"+
	"?DOCURI="+encodeURIComponent(Codex.docuri)+
	"&REFURI="+encodeURIComponent(Codex.refuri);
      if (Codex.Trace.dosync)
	fdjtLog("syncLocation(call) %s",uri);
      fdjtAjax.jsonCall(
			function(d){
			  if (Codex.Trace.dosync)
			    fdjtLog("syncLocation(response) %s: %o",uri,d);
			  if ((!(d))||(!(d.location))) {
			    if (!(Codex.state))
			      Codex.GoTo(Codex.start||Codex.root||Codex.body,false,false);
			    return;}
			  else if ((!(Codex.state))||(Codex.state.tstamp<d.tstamp)) {
			    if ((d.location)&&(d.location<Codex.location)) return;
			    var msg=
			      "Sync to L"+d.location+
			      ((d.page)?(" (page "+d.page+")"):"")+"?";
			    if (confirm(msg)) {
			      if (d.location) Codex.setLocation(d.location);
			      if (d.target) Codex.setTarget(d.target,true,true);
			      if (d.location) Codex.GoTo(d.location,true,true);
			      Codex.state=d;}}
			  else {}},
			uri);}

    function gotGlosses(){
      delete Codex.glossing; Codex.glossed=fdjtTime();
      if (Codex.Trace.glosses) fdjtLog("gotGlosses");}

    function initGlosses(glosses,etc){
      var allglosses=Codex.allglosses;
      if (etc) {
	startupLog("Assimilating %d new glosses/%d sources...",
		   glosses.length,etc.length);}
      else {
	startupLog("Assimilating %d new glosses...",glosses.length);}
      fdjtKB.Import(etc);
      Codex.glosses.Import(glosses);
      var i=0; var lim=glosses.length;
      var latest=Codex.syncstamp||0;
      while (i<lim) {
	var gloss=glosses[i++];
	var id=gloss.qid||gloss.uuid||gloss.oid;
	var tstamp=gloss.syncstamp||gloss.tstamp;
	if (tstamp>latest) latest=tstamp;
	allglosses.push(id);}
      Codex.syncstamp=latest;
      Codex.allglosses=allglosses;
      if (Codex.offline) {
	fdjtState.setLocal("glosses("+Codex.refuri+")",allglosses,true);
	fdjtState.setLocal("syncstamp("+Codex.refuri+")",latest);}
      gotGlosses();}
    Codex.Startup.initGlosses=initGlosses;

    function applyInlineTags(){
      startupMessage("Applying inline tags");
      var tags=fdjtDOM.$(".sbooktags");
      var i=0; var lim=tags.length;
      while (i<lim) {
	var tagelt=tags[i++];
	var target=Codex.getTarget(tagelt);
	var info=Codex.docinfo[target.id];
	var tagtext=fdjtDOM.textify(tagelt);
	var tagsep=tagelt.getAttribute("tagsep")||";";
	var tagstrings=tagtext.split(tagsep);
	if (tagstrings.length) {
	  if (info.tags)
	    info.tags=info.tags.concat(tagstrings);
	  else info.tags=tagstrings;}}}
	
    /* Indexing tags */

    function indexContentTags(docinfo){
      var sbook_index=Codex.index;
      knodule=(knodule)||(knodule=Codex.knodule);
      /* One pass processes all of the inline KNodes and
	 also separates out primary and auto tags. */
      for (var eltid in docinfo) {
	var tags=docinfo[eltid].tags;
	if (!(tags)) continue;
	var k=0; var ntags=tags.length; var scores=tags.scores||false;
	if (!(scores)) tags.scores=scores={};
	while (k<ntags) {
	  var tag=tags[k]; var score=1; var tagbase=false;
	  if (tag[0]==='*') {
	    var tagstart=tag.search(/[^*]+/);
	    score=2*(tagstart+1);
	    tagbase=tag.slice(tagstart);}
	  else if (tag[0]==='~') {
	    var tagstart=tag.search(/[^~]+/);
	    tag=tag.slice(tagstart);
	    if (tagstart>1) {
	      if (!(scores)) tags.scores=scores={};
	      score=1/tagstart;}
	    else score=1;}
	  else {
	    tagbase=tag;
	    score=2;}
	  if (tagbase) {
	    var knode=((tagbase.indexOf('|')>0)?
		       (knodule.handleSubjectEntry(tagbase)):
		       (knodule.ref(tagbase)));
	    if ((knode)&&(knode.tagString)) tag=knode.tagString();}
	  tags[k]=tag;
	  scores[tag]=score;
	  k++;}
	if (scores) {
	  tags.sort(function(t1,t2){
	      var s1=scores[t1]||1; var s2=scores[t2]||1;
	      if (s1>s2) return -1;
	      else if (s1<s2) return 1;
	      else if (t1<t2) return -1;
	      else if (t1>t2) return 1;
	      else return 0;});}
	else tags.sort();}
      var knodule=Codex.knodule||false;
      sbook_index.Tags=function(item){
	var info=docinfo[item]||
	Codex.glosses.ref(item)||
	fdjtKB.ref(item);
	return ((info)&&(info.tags))||[];};
      for (var eltid in docinfo) {
	var tags=docinfo[eltid].tags; 
	if (!(tags)) continue;
	var scores=tags.scores;
	var k=0; var ntags=tags.length;
	while (k<ntags) {
	  var tag=tags[k++];
	  if (scores)
	    sbook_index.add(eltid,tag,scores[tag]||1,knodule);
	  else sbook_index.add(eltid,tag,1,knodule);}}}
    Codex.indexContentTags=indexContentTags
	
      /* Inline tags */
      function indexInlineTags(kno) {
      var sbook_index=Codex.index;
      if (!(kno)) kno=knodule;
      var anchors=document.getElementsByTagName("A");
      if (!(anchors)) return;
      var i=0; var len=anchors.length;
      while (i<len)
	if (anchors[i].rel==='tag') {
	  var elt=anchors[i++];
	  var href=elt.href;
	  var cxt=elt;
	  while (cxt) if (cxt.id) break; else cxt=cxt.parentNode;
	  if (!((href)&&(cxt))) return;
	  var tagstart=(href.search(/[^/]+$/));
	  var tag=((tagstart<0)?(href):href.slice(tagstart));
	  var dterm=((kno)?(kno.handleEntry(tag)):(fdjtString.stdspace(tag)));
	  sbook_index.add(cxt,dterm);}
	else i++;}
    Codex.indexInlineTags=indexInlineTags;

    function useAutoIndex(autoindex,knodule){
      var sbook_index=Codex.index;
      if (!(autoindex)) return;
      if (!(sbook_index)) return;
      for (var tag in autoindex) {
	var ids=autoindex[tag];
	var starpower=tag.search(/[^*]/);
	// all stars or empty string, just ignore
	if (starpower<0) continue;
	var weight=((tag[0]==='~')?(1):(2*(starpower+1)));
	var knode=((tag.indexOf('|')>=0)?
		   (knodule.handleSubjectEntry(tag.slice(starpower))):
		   (tag[0]==='~')?(tag.slice(1)):
		   (knodule.handleSubjectEntry(tag.slice(starpower))));
	var i=0; var lim=ids.length;
	while (i<lim) {
	  var info=Codex.docinfo[ids[i++]];
	  if (!(info)) continue;
	  var tagval=((typeof knode === 'string')?(knode):(knode.dterm));
	  if (info.autotags) info.autotags.push(tagval);
	  else info.autotags=[tagval];
	  sbook_index.add(info.frag,knode,weight,knodule);}}}
    Codex.useAutoIndex=useAutoIndex;

    /* Setting up the clouds */

    function initClouds(){
      startupMessage("setting up search cloud...");
      fdjtDOM.replace("CODEXSEARCHCLOUD",Codex.fullCloud().dom);
      startupMessage("setting up glossing cloud...");
      fdjtDOM.replace("CODEXGLOSSCLOUD",Codex.glossCloud().dom);
      if (Codex.cloud_queue) {
	fdjtLog("Starting to sync gloss cloud");
	fdjtTime.slowmap(
			 Codex.addTag2UI,Codex.cloud_queue,
			 function(){
			   Codex.cloud_queue=false;
			   fdjtLog("Gloss cloud synced");});}
      if (Codex.search_cloud_queue) {
	fdjtLog("Starting to sync search cloud");
	fdjtTime.slowmap(
			 Codex.addTag2UI,Codex.search_cloud_queue,
			 function(){
			   Codex.search_cloud_queue=false;
			   fdjtLog("Search cloud synced");});}
	 
      if (Codex.knodule) {
	fdjtLog("Beginning knodule integration");
	fdjtTime.slowmap(Codex.addTag2UI,Codex.knodule.alldterms,
			 function(){fdjtLog("Knodule integrated");});}
      Codex.sizeCloud(Codex.full_cloud);
      Codex.sizeCloud(Codex.gloss_cloud);}
     
    /* Clearing offline data */

    function clearOffline(refuri){
      if (refuri) {
	var glosses=
	  fdjtState.getLocal("codex.glosses("+refuri+")",true);
	var i=0; var lim=glosses.length;
	while (i<lim) fdjtState.dropLocal(glosses[i++]);
	fdjtState.dropLocal("codex.sources("+refuri+")");
	fdjtState.dropLocal("codex.outlets("+refuri+")");
	fdjtState.dropLocal("codex.etc("+refuri+")");
	fdjtState.dropLocal("codex.offline("+refuri+")");
	var refuris=fdjtState.getLocal("codex.refuris",true);
	refuris=fdjtKB.remove(refuris,refuri);
	fdjtState.setLocal("codex.refuris",refuris,true);}
      else {
	var refuris=fdjtState.getLocal("codex.refuris",true);
	var i=0; var lim=refuris.length;
	while (i<lim) clearOffline(refuris[i++]);
	fdjtState.dropLocal("codex.refuris");}}
    Codex.clearOffline=clearOffline;

    /* Other setup */
     
    function setupGlossServer(){}

    return Startup;})();
sbookStartup=Codex.Startup;
Codex.Setup=Codex.Startup;
sbook={Start: Codex.Startup,setUser: Codex.setUser};

fdjt_versions.decl("codex",codex_startup_version);
fdjt_versions.decl("codex/startup",codex_startup_version);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_domscan_id="$Id$";
var codex_domscan_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements a Javascript/DHTML UI for reading
   large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

/* Scanning the document for Metadata */

function CodexDOMScan(root,docinfo){
  var stdspace=fdjtString.stdspace;
  if (typeof root === 'undefined') return this;
  if (!(docinfo))
    if (this instanceof CodexDOMScan)
      docinfo=this;
    else docinfo=new CodexDOMScan();
  if (!(root)) root=Codex.root||document.body;
  var start=new Date();
  docinfo._root=root;
  if (!(root.id)) root.id="SBOOKROOT";
  if (Codex.Trace.startup) {
    if (root.id) 
      fdjtLog("Scanning %s#%s for structure and metadata",root.tagName,root.id);
    else fdjtLog("Scanning DOM for structure and metadata: %o",root);}
  var nodefn=docinfo.nodeFn||false;
  var children=root.childNodes, level=false;
  var scanstate=
    {curlevel: 0,idserial:0,location: 0,
     nodecount: 0,eltcount: 0,headcount: 0,
     tagstack: [],taggings: [],allinfo: [],locinfo: [],
     idstate: {prefix: false,count: 0},
     idstack: [{prefix: false,count: 0}],
     pool: Codex.DocInfo};
  var rootinfo=(((nodefn)&&(nodeFn(root)))||(docinfo[root.id])||
		(docinfo[root.id]=new scanInfo(root.id,scanstate)));
  scanstate.curhead=root; scanstate.curinfo=rootinfo;
  // Location is an indication of distance into the document
  var location=0;
  rootinfo.pool=scanstate.pool;
  rootinfo.title=root.title||document.title;
  rootinfo.starts_at=0;
  rootinfo.level=0; rootinfo.sub=new Array();
  rootinfo.head=false; rootinfo.heads=new Array();
  rootinfo.frag=root.id;
  rootinfo.qid="#"+root.id;
  rootinfo.elt=root;
  scanstate.allinfo.push(rootinfo);
  scanstate.allinfo.push(0);
  /* Build the metadata */
  var i=0; while (i<children.length) {
    var child=children[i++];
    if (!((child.sbookskip)||(child.sbookui)))
      scanner(child,scanstate,docinfo,docinfo.nodeFn||false);} 
  docinfo._nodecount=scanstate.nodecount;
  docinfo._headcount=scanstate.headcount;
  docinfo._eltcount=scanstate.eltcount;
  docinfo._maxloc=scanstate.location;
  docinfo._allinfo=scanstate.allinfo;
  docinfo._locinfo=scanstate.locinfo;
  var scaninfo=scanstate.curinfo;
  /* Close off all of the open spans in the TOC */
  while (scaninfo) {
    scaninfo.ends_at=scanstate.location;
    scaninfo=scaninfo.head;}
  var done=new Date();
  if (Codex.Trace.startup)
    fdjtLog('Gathered metadata in %f secs over %d/%d heads/nodes',
	    (done.getTime()-start.getTime())/1000,
	    scanstate.headcount,scanstate.eltcount);
  return docinfo;

  function scanInfo(id,scanstate) {
    if (docinfo[id]) return docinfo[id];
    this.pool=scanstate.pool;
    this.frag=id;
    this.qid="#"+id;
    docinfo[id]=this;
    scanstate.allinfo.push(this);
    scanstate.locinfo.push(scanstate.location);
    return this;}
  CodexDOMScan.scanInfo=scanInfo;

  function getTitle(head) {
    var title=
      (head.toctitle)||
      ((head.getAttributeNS)&&
       (head.getAttributeNS('toctitle','http://sbooks.net')))||
      (head.getAttribute('toctitle'))||
      (head.getAttribute('data-toctitle'))||
      (head.title);
    if (!(title)) title=gatherText(head);
    if (typeof title === "string") {
      var std=stdspace(title);
      if (std==="") return false;
      else return std;}
    else return fdjtDOM.textify(title,true);}

  function gatherText(head,s) {
    if (!(s)) s="";
    if (head.nodeType===3)
      return s+head.nodeValue;
    else if (head.nodeType!==1) return s;
    else {
      var children=head.childNodes;
      var i=0; var len=children.length;
      while (i<len) {
	var child=children[i++];
	if (child.nodeType===3) s=s+child.nodeValue;
	else if (child.nodeType===1)
	  s=gatherText(child,s);
	else {}}
      return s;}}

  function textWidth(elt){
    if (elt.nodeType===3) return elt.nodeValue.length;
    else if (elt.nodeType===1) {
      var children=elt.childNodes; var loc=0;
      var i=0; var len=children.length;
      while (i<len) {
	var child=children[i++];
	if (child.nodeType===3) loc=loc+child.nodeValue.length;
	else if (child.nodeType===1)
	  loc=loc+textWidth(child);
	else {}}
      return loc;}
    else return 0;}

  function getLevel(elt){
    if (elt.toclevel) {
      if (elt.toclevel==='none')
	return elt.toclevel=false;
      else return elt.toclevel;}
    var attrval=
      ((elt.getAttributeNS)&&
       (elt.getAttributeNS('toclevel','http://sbooks.net')))||
      (elt.getAttribute('toclevel'))||
      (elt.getAttribute('data-toclevel'));
    if (attrval) {
      if (attrval==='none') return false;
      else return parseInt(attrval);}
    if (elt.className) {
      var cname=elt.className;
      if (cname.search(/\bsbooknotoc\b/)>=0) return 0;
      if (cname.search(/\bsbookignore\b/)>=0) return 0;
      var tocloc=cname.search(/\bsbook\dhead\b/);
      if (tocloc>=0) return parseInt(cname.slice(5,6));}
    if ((Codex.notoc)&&(Codex.notoc.match(elt))) return 0;
    if ((Codex.ignore)&&(Codex.ignore.match(elt))) return 0;
    if ((elt.tagName==='HGROUP')||(elt.tagName==='HEADER'))
      return getFirstTocLevel(elt,true);
    if (elt.tagName.search(/H\d/)==0)
      return parseInt(elt.tagName.slice(1,2));
    else return false;}

  function getFirstTocLevel(node,notself){
    if (node.nodeType!==1) return false;
    var level=((!(notself))&&(getLevel(node)));
    if (level) return level;
    var children=node.childNodes;
    var i=0; var lim=children.length;
    while (i<lim) {
      var child=children[i++];
      if (child.nodeType!==1) continue;
      level=getFirstTocLevel(child);
      if (level) return level;}
    return false;}

  function handleHead(head,docinfo,scanstate,level,curhead,curinfo,curlevel,nodefn){
    var headid=head.id;
    var headinfo=((nodefn)&&(nodefn(head)))||docinfo[headid]||
      (docinfo[headid]=new scanInfo(headid,scanstate));
    scanstate.headcount++;
    if ((headinfo.elt)&&(headinfo.elt!==head)) {
      var newid=headid+"x"+scanstate.location;
      fdjtLog.warn("Duplicate ID=%o newid=%o",headid,newid);
      head.id=headid=newid;
      headinfo=((nodefn)&&(nodefn(head)))||docinfo[headid]||
	(docinfo[headid]=new scanInfo(headid,scanstate));}
    if (Codex.Trace.scan)
      fdjtLog("Scanning head item %o under %o at level %d w/id=#%s ",
	      head,curhead,level,headid);
    /* Iniitalize the headinfo */
    headinfo.starts_at=scanstate.location;
    headinfo.elt=head; headinfo.level=level;
    headinfo.sub=new Array();
    headinfo.frag=headid; headinfo.qid="#"+headid;
    headinfo.title=getTitle(head);
    headinfo.next=false; headinfo.prev=false;
    if (level>curlevel) {
      /* This is the simple case where we are a subhead
	 of the current head. */
      headinfo.head=curinfo;
      if (!(curinfo.intro_ends_at))
	curinfo.intro_ends_at=scanstate.location;
      curinfo.sub.push(headinfo);}
    else {
      /* We're not a subhead, so we're popping up at least one level. */
      var scan=curhead;
      var scaninfo=curinfo;
      var scanlevel=curinfo.level;
      /* Climb the stack of headers, closing off entries and setting up
	 prev/next pointers where needed. */
      while (scaninfo) {
	if (Codex.Trace.scan)
	  fdjtLog("Finding head: scan=%o, info=%o, sbook_head=%o, cmp=%o",
		  scan,scaninfo,scanlevel,scaninfo.head,
		  (scanlevel<level));
	if (scanlevel<level) break;
	if (level===scanlevel) {
	  headinfo.prev=scaninfo;
	  scaninfo.next=headinfo;}
	scaninfo.ends_at=scanstate.location;
	scanstate.tagstack=scanstate.tagstack.slice(0,-1);
	scaninfo=scaninfo.head; scan=scaninfo.elt;
	scanlevel=((scaninfo)?(scaninfo.level):(0));}
      if (Codex.Trace.scan)
	fdjtLog("Found parent: up=%o, upinfo=%o, atlevel=%d, sbook_head=%o",
		scan,scaninfo,scaninfo.level,scaninfo.head);
      /* We've found the head for this item. */
      headinfo.head=scaninfo;
      scaninfo.sub.push(headinfo);} /* handled below */
    /* Add yourself to your children's subsections */
    var supinfo=headinfo.head;
    var newheads=new Array();
    if (supinfo.heads)
      newheads=newheads.concat(supinfo.heads);
    if (supinfo) newheads.push(supinfo);
    headinfo.heads=newheads;
    if (Codex.Trace.scan)
      fdjtLog("@%d: Found head=%o, headinfo=%o, sbook_head=%o",
	      scanstate.location,head,headinfo,headinfo.head);
    /* Update the toc state */
    scanstate.curhead=head;
    scanstate.curinfo=headinfo;
    scanstate.curlevel=level;
    if (headinfo)
      headinfo.ends_at=scanstate.location+fdjtDOM.textWidth(head);
    scanstate.location=scanstate.location+fdjtDOM.textWidth(head);}

  function scanner(child,scanstate,docinfo,nodefn){
    var location=scanstate.location;
    var curhead=scanstate.curhead;
    var curinfo=scanstate.curinfo;
    var curlevel=scanstate.curlevel;
    scanstate.nodecount++;
    // Location tracking and TOC building
    if (child.nodeType===3) {
      var content=stdspace(child.nodeValue);
      var width=content.length;
      // Need to regularize whitespace
      scanstate.location=scanstate.location+width;
      return 0;}
    else if (child.nodeType!==1) return 0;
    else {}
    if ((Codex.ignore)&&(Codex.ignore.match(child))) return;
    // Having a section inside a notoc zone probably indicates malformed
    //  HTML
    if (((child.tagName==='section')||(child.tagName==='article'))&&
	(!(scanstate.notoc))) {
      var head=fdjtDOM.findChild(child,'header')||
	fdjtDOM.findChild(child,'hgroup,h1,h2,h3,h4,h5,h6,h7');
      var curlevel=scanstate.curlevel;
      var curhead=scanstate.curhead;
      var curinfo=scanstate.curinfo;
      var notoc=scanstate.notoc;
      var header=fdjtDOM.getChild(child,"header");
      var nextlevel=getLevel(child)||
	getFirstTocLevel(header)||
	getFirstTocLevel(child)||
	((curlevel)?(curlevel+1):(1));
      handleHead(child,docinfo,scanstate,nextlevel,
		 curhead,curinfo,curlevel,
		 nodefn);
      if ((Codex.terminals)&&(Codex.terminals.match(child)))
	scanstate.notoc=true;
      var headinfo=docinfo[child.id];
      headinfo.tocdone=true;
      scanstate.curhead=child; scanstate.curinfo=headinfo;
      scanstate.curlevel=nextlevel;
      var children=child.childNodes;
      var i=0; var lim=children.length;
      while (i<lim) {
	var child=children[i++];
	if (child.nodeType===1)
	  scanner(child,scanstate,docinfo,nodefn);}
      // Put everything back
      scanstate.curlevel=curlevel; scanstate.notoc=notoc;
      scanstate.curhead=curhead; scanstate.curinfo=curinfo;
      return;}
    // Get the location in the TOC for this out of context node
    var tocloc=(child.codextocloc)||(child.getAttribute("data-tocloc"));
    if ((tocloc)&&(docinfo[tocloc])) {
      var tocinfo=docinfo[tocloc];
      var curlevel=scanstate.curlevel;
      var curhead=scanstate.curhead;
      var curinfo=scanstate.curinfo;
      var notoc=scanstate.notoc;
      var headinfo=tocinfo.head;
      scanstate.curinfo=headinfo;
      scanstate.curhead=headinfo.elt;
      scanstate.curlevel=headinfo.level;
      scanstate.notoc=true;
      var children=child.childNodes;
      var i=0; var lim=children.length;
      while (i<lim) {
	var child=children[i++];
	if (child.nodeType===1)
	  scanner(child,scanstate,docinfo,nodefn);}
      // Put everything back
      scanstate.curlevel=curlevel; scanstate.notoc=notoc;
      scanstate.curhead=curhead; scanstate.curinfo=curinfo;
      return;}
    var toclevel=((child.id)&&(getLevel(child)));
    // The header functionality (for its contents too) is handled by the
    // section
    if ((scanstate.notoc)||(child.tagName==='header')) {
      scanstate.notoc=true; toclevel=0;}
    scanstate.eltcount++;
    var info=((nodefn)&&(nodefn(child)));
    if ((!(info))&&(child.id)&&(!(info=docinfo[child.id]))) {
      var id=child.id;
      info=new scanInfo(id,scanstate);}
    if ((info)&&(info.elt)&&(child.id)&&(info.elt!==child)) {
      var newid=child.id+"x"+scanstate.location;
      fdjtLog.warn("Duplicate ID=%o newid=%o",child.id,newid);
      child.id=id=newid;
      info=((nodefn)&&(nodefn(head)))||docinfo[id]||
	(docinfo[id]=new scanInfo(id,scanstate));}
    if (info) {
      info.starts_at=scanstate.location;
      info.sbookhead=curhead.id;
      info.headstart=curinfo.starts_at;}
    if (info) info.head=curinfo;
    if ((child.sbookskip)||(child.sbookui)||
	((child.className)&&(child.className.search(/\bsbookignore\b/)>=0))||
	((Codex.ignore)&&(Codex.ignore.match(child))))
      return;
    if ((info)&&(toclevel)&&(!(info.toclevel))) info.toclevel=toclevel;
    if (child.id) {
      var tags=
	((child.getAttributeNS)&&
	 (child.getAttributeNS('tags','http://sbooks.net/')))||
	(child.getAttribute('tags'))||
	(child.getAttribute('data-tags'));
      if (tags) info.tags=tags.split(';');}
    if ((toclevel)&&(!(info.tocdone)))
      handleHead(child,docinfo,scanstate,toclevel,
		 curhead,curinfo,curlevel,nodefn);
    var children=child.childNodes;
    var i=0; var len=children.length;
    while (i<len) {
      var grandchild=children[i++];
      if (grandchild.nodeType===3) {
	var content=stdspace(grandchild.nodeValue);
	scanstate.location=scanstate.location+
	  content.length;}
      else if (grandchild.nodeType===1) {
	scanner(grandchild,scanstate,docinfo,nodefn);}}
    if (info) info.ends_at=scanstate.location;}}

fdjt_versions.decl("codex",codex_domscan_version);
fdjt_versions.decl("codex/domscan",codex_domscan_version);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_hud_id="$Id$";
var codex_hud_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements a Javascript/DHTML UI for reading
   large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

var CodexMode=
    (function(){
	// The foot HUD
	var sbookHead=false; var head_height=false;
	// The foot HUD
	var sbookFoot=false; var foot_height=false;
	// The HELP HUD, and its margins
	var sbookHelp=false; var help_top=false; var help_bottom=false;
	// The BOX HUD (contains scrollable content) and its margins
	var box_top=false; var box_bottom=false;
	// This is the HUD where all glosses are displayed
	var sbookGlossesHUD=false;
	// This is the HUD for tag searching
	var sbookSearchHUD=false;
	// How long to let messages flash up
	var message_timeout=5000;
	
	function initHUD(){
	    if (fdjtID("CODEXHUD")) return;
	    else {
		Codex.HUD=CodexHUD=fdjtDOM("div#CODEXHUD");
		CodexHUD.sbookui=true;
		CodexHUD.innerHTML=sbook_hudtext;
		fdjtDOM.prepend(document.body,CodexHUD);}
	    // Setup flyleaf
	    var flyleaf=fdjtID("CODEXFLYLEAF");
	    flyleaf.innerHTML=sbook_flyleaftext;
	    // Setup settings
	    var settings=fdjtID("CODEXSETTINGS");
	    settings.innerHTML=sbook_settingstext;
	    // Setup help text
	    var help=fdjtID("CODEXHELP");
	    help.innerHTML=sbook_helptext;
	    // Initialize search UI
	    var search=fdjtID("CODEXSEARCH");
	    search.innerHTML=sbook_searchbox;
	    Codex.empty_cloud=
		new fdjtUI.Completions(fdjtID("CODEXSEARCHCLOUD"));
	    var login=fdjtID("SBOOKAPPLOGIN");
	    login.innerHTML=sbook_loginform;

	    if (Codex.hidehelp) Codex.setConfig("hidehelp");

	    fdjtID("SBOOK_RETURN_TO").value=location.href;

	    // Initialize gloss UI
	    var glosses=fdjtID("CODEXALLGLOSSES");
	    Codex.UI.setupSummaryDiv(glosses);
	    Codex.glosses.addEffect("maker",function(f,p,v){
		Codex.sourcekb.ref(v).oninit
		(Codex.UI.addGlossSource,"newsource");});
	    Codex.glosses.addEffect("sources",function(f,p,v){
		Codex.sourcekb.ref(v).oninit
		(Codex.UI.addGlossSource,"newsource");});

	    function initUI4Item(item){
		if (document.getElementById(item.frag)) {
		    Codex.UI.addToSlice(item,glosses,false);
		    var glossmark=Codex.UI.addGlossmark(item.frag); {
			if (glossmark) {
			    var curglosses=glossmark.glosses;
			    curglosses.push(item.qid);}
			if (item.tstamp>Codex.syncstamp)
			    Codex.syncstamp=item.tstamp;
			var pic=((fdjtKB.ref(item.maker)).pic)||
			    ((fdjtKB.ref(item.feed)).pic);
			if (pic) {
			    var img=fdjtDOM.getFirstChild(glossmark,"IMG.big");
			    if (img) img.src=pic;}}
		    if (item.tags) addTag2UI(item.tags,true);}}
	    Codex.glosses.addInit(initUI4Item);

	    function addTag2UI(tag,forsearch){
		if (!(tag)) return;
		else if (tag instanceof Array) {
		    var i=0; var lim=tag.length;
		    while (i<lim) addTag2UI(tag[i++],forsearch||false);
		    return;}
		else if (!(Codex.gloss_cloud)) {
		    var queue=Codex.cloud_queue;
		    if (!(queue)) queue=Codex.cloud_queue=[];
		    queue.push(tag);
		    if (forsearch) {
			var squeue=Codex.search_cloud_queue;
			if (!(squeue)) squeue=Codex.search_cloud_queue=[];
			squeue.push(tag);}}
		else {
		    var gloss_cloud=Codex.glossCloud();
		    var search_cloud=Codex.fullCloud();
		    var gloss_tag=gloss_cloud.getByValue(tag,".completion");
		    if (!((gloss_tag)&&(gloss_tag.length))) {
			gloss_tag=Knodule.HTML(tag,Codex.knodule,false,true);
			fdjtDOM(fdjtID("CODEXGLOSSTAGS"),gloss_tag," ");
			gloss_cloud.addCompletion(gloss_tag);}
		    var search_tag=((forsearch)&&(search_cloud.getByValue(tag,".completion")));
		    if ((forsearch)&&(!((search_tag)&&(search_tag.length)))) {
			search_tag=Knodule.HTML(tag,Codex.knodule,false,true);
			fdjtDOM(fdjtID("CODEXSEARCHTAGS"),search_tag," ");
			search_cloud.addCompletion(search_tag);}}}
	    Codex.addTag2UI=addTag2UI;
	    
	    sbookFoot=fdjtID("CODEXFOOT");
	    sbookHead=fdjtID("CODEXHEAD");
	    sbookHelp=fdjtID("CODEXHELP");
	    fillinFlyleaf();
	    resizeHUD();
	    Codex.scrollers={};
	    updateScroller("CODEXGLOSSCLOUD");
	    updateScroller("CODEXSEARCHCLOUD");
	}
	Codex.initHUD=initHUD;
	
	function fixStaticRefs(string){
	  if (Codex.graphics==="http://static.beingmeta.com/graphics/")
	    return string;
	  else return string.replace
		 (/http:\/\/static.beingmeta.com\/graphics\//g,
		  Codex.graphics);}

	function resizeHUD(){
	    var vh=fdjtDOM.viewHeight();
	    var vw=fdjtDOM.viewWidth();
	    var hf=fdjtID("CODEXFOOT");
	    var fh=fdjtDOM.getGeometry(hf).height;
	    // fdjtLog("resizeHUD vh=%o vw=%o fh=%o",vh,vw,fh);
	    if (!(Codex.nativescroll)) hf.style.top=(vh-fh)+'px';}

	/* This is used for viewport-based browser, where the HUD moves
	   to be aligned with the viewport */
	
	var sbook_sync_off=false;
	var sbook_sync_height=false;
	
	function getBounds(elt){
	    var style=fdjtDOM.getStyle(elt);
	    return { top: fdjtDOM.parsePX(style.marginTop)||0+
		     fdjtDOM.parsePX(style.borderTop)||0+
		     fdjtDOM.parsePX(style.paddingTop)||0,
		     bottom: fdjtDOM.parsePX(style.marginBottom)||0+
		     fdjtDOM.parsePX(style.borderBottom)||0+
		     fdjtDOM.parsePX(style.paddingBottom)||0};}
	fdjtDOM.getBounds=getBounds;
	
	/* Creating the HUD */
	
	function setupTOC(root_info){
	    var navhud=createNavHUD("div#CODEXTOC.hudpanel",root_info);
	    var toc_button=fdjtID("CODEXTOCBUTTON");
	    toc_button.style.visibility='';
	    Codex.TOC=navhud;
	    fdjtDOM.replace("CODEXTOC",navhud);
	    var flytoc=createStaticTOC("div#CODEXFLYTOC",root_info);
	    Codex.Flytoc=flytoc;
	    fdjtDOM(fdjtID("FLYTOC"),flytoc);}
	Codex.setupTOC=setupTOC;

	function createNavHUD(eltspec,root_info){
	    var toc_div=CodexTOC(root_info,0,false,"CODEXTOC4",
				 ((root_info.sub.length>1)));
	    var div=fdjtDOM(eltspec||"div#CODEXTOC.hudpanel",toc_div);
	    Codex.UI.addHandlers(div,"toc");
	    return div;}

	function createStaticTOC(eltspec,root_info){
	    var toc_div=CodexTOC(root_info,0,false,"CODEXFLYTOC4");
	    var div=fdjtDOM(eltspec||"div#CODEXFLYTOC",toc_div);
	    Codex.UI.addHandlers(div,"toc");
	    return div;}

	/* HUD animation */

	function setHUD(flag){
	    if (Codex.Trace.gestures)
		fdjtLog("setHUD %o mode=%o hudup=%o bc=%o hc=%o",
			flag,Codex.mode,Codex.hudup,
			document.body.className,
			CodexHUD.className);
	    if (flag) {
		Codex.hudup=true;
		fdjtDOM.addClass(document.body,"hudup");}
	    else {
		Codex.mode=false;
		Codex.hudup=false;
		Codex.scrolling=false;
		fdjtDOM.dropClass(CodexHUD,"flyleaf");
		fdjtDOM.dropClass(CodexHUD,"full");
		fdjtDOM.dropClass(CodexHUD,CodexMode_pat);
		fdjtDOM.dropClass(document.body,"hudup");}}

	/* Mode controls */
	
	var CodexMode_pat=
	    /(login)|(device)|(sbookapp)|(help)|(scanning)|(tocscan)|(search)|(searchresults)|(toc)|(glosses)|(allglosses)|(context)|(flytoc)|(about)|(console)|(minimal)|(addgloss)|(gotoloc)|(gotopage)/g;
	var codexflyleafMode_pat=/(login)|(device)|(sbookapp)|(flytoc)|(about)|(console)/g;
	var sbook_mode_scrollers=
	    {allglosses: "CODEXALLGLOSSES",
	     searchresults: "CODEXSEARCHRESULTS",
	     search: "CODEXSEARCHCLOUD",
	     addgloss: "CODEXGLOSSCLOUD",
	     sbookapp: "MANAGEAPP",
	     flytoc: "CODEXFLYTOC",
	     login: "CODEXFLYLOGIN",
	     about: "APPABOUT"
	     /* ,
		login: "SBOOKAPPLOGIN",
		device: "CODEXSETTINGS",
	     */
	    };
	var sbook_mode_foci=
	    {gotopage: "CODEXPAGEINPUT",
	     gotoloc: "CODEXLOCINPUT",
	     search: "CODEXSEARCHINPUT",
	     addgloss: "CODEXGLOSSINPUT"};
	
	function CodexMode(mode){
	    if (typeof mode === 'undefined') return Codex.mode;
	    if (mode==='last') mode=Codex.last_mode||'help';
	    if (mode==='none') mode=false;
	    if (Codex.Trace.mode)
		fdjtLog("CodexMode %o, cur=%o dbc=%o",
			mode,Codex.mode,document.body.className);
	    if ((Codex.mode==='help')&&(!(mode))) mode=Codex.last_mode;
	    if (mode) {
		if (mode!=="scanning") Codex.scanning=false;
		if ((mode==="scanning")||(mode==="tocscan"))
		    fdjtDOM.addClass(document.body,"sbookscanning");
		else fdjtDOM.dropClass(document.body,"sbookscanning");
		if (mode===Codex.mode) {}
		else if (mode===true) {
		    /* True just puts up the HUD with no mode info */
		    if (sbook_mode_foci[Codex.mode]) {
			var input=fdjtID(sbook_mode_foci[Codex.mode]);
			input.blur();}
		    Codex.mode=false;
		    Codex.last_mode=true;}
		else if (typeof mode !== 'string') 
		    throw new Error('mode arg not a string');
		else {
		  if (sbook_mode_foci[Codex.mode]) {
		    var input=fdjtID(sbook_mode_foci[Codex.mode]);
		    input.blur();}
		    Codex.mode=mode;
		    if (Codex.mode!=='help') Codex.last_mode=Codex.mode;}
		// If we're switching to the inner app but the iframe
		//  hasn't been initialized, we do it now.
		if ((mode==="sbookapp")&&(!(fdjtID("MANAGEAPP").src)))
		    sbookSetupFlyleaf();
		// Update Codex.scrolling which is the scrolling
		// element in the HUD for this mode
		if (!(typeof mode === 'string'))
		    Codex.scrolling=false;
		else if (sbook_mode_scrollers[mode]) 
		    Codex.scrolling=(sbook_mode_scrollers[mode]);
		else Codex.scrolling=false;
		// Actually change the class on the HUD object
		if (mode===true) {
		    fdjtDOM.swapClass(CodexHUD,CodexMode_pat,"minimal");
		    fdjtDOM.dropClass(CodexHUD,"flyleaf");}
		else {
		    if (mode.search(codexflyleafMode_pat)!==0)
			fdjtDOM.dropClass(CodexHUD,"flyleaf");
		    fdjtDOM.swapClass(CodexHUD,CodexMode_pat,mode);}
		// Update the body scanning mode
		if ((mode==="scanning")||(mode==="tocscan"))
		    fdjtDOM.addClass(document.body,"sbookscanning");
		else fdjtDOM.dropClass(document.body,"sbookscanning");
		// Update the 'flyleaf' meta mode
		if ((mode)&&(typeof mode === 'string')) {
		    if (mode.search(codexflyleafMode_pat)===0)
			fdjtDOM.addClass(CodexHUD,"flyleaf");
		    else fdjtDOM.dropClass(CodexHUD,"flyleaf");
		    fdjtID("CODEXBUTTON").className=mode;}
		// Help mode (on the hud) actually dims the body
		if (mode==="help")
		    fdjtDOM.addClass(document.body,"dimmed");
		else fdjtDOM.dropClass(document.body,"dimmed");
		// Scanning is a funny mode in that the HUD is down
		//  for it.  We handle all of this stuff here.
		if (mode==='scanning') {
		    Codex.hudup=false;
		    fdjtDOM.dropClass(CodexHUD,"flyleaf");
		    fdjtDOM.dropClass(CodexHUD,"full");
		    fdjtDOM.dropClass(document.body,"hudup");}
		// And if we're not scanning, we just raise the hud
		else setHUD(true);
		// This updates scroller dimensions, we delay it
		//  because apparently, on some browsers, the DOM
		//  needs to catch up with CSS
		if (Codex.scrolling) {
		  var scroller=fdjtID(Codex.scrolling);
		  setTimeout(function(){updateScroller(scroller);},
			     100);}
		// If we're scanning all glosses, we sync the glosses
		//  with the current book location.
		if ((mode==="allglosses")&&
		    (Codex.curinfo)&&(Codex.curinfo.first)) {
		    Codex.UI.scrollGlosses(
			Codex.curinfo.first,fdjtID("CODEXALLGLOSSES"));}
		// We autofocus any input element appropriate to the
		// mode
		if (sbook_mode_foci[mode]) {
		  var input=fdjtID(sbook_mode_foci[mode]);
		  if (input) input.focus();}
		// Moving the focus back to the body lets keys work
		else document.body.focus();
		Codex.displaySync();}
	    else {
		// Clearing the mode is a lot simpler, in part because
		//  setHUD clears most of the classes when it brings
		//  the HUD down.
		if (Codex.mode!=='help') Codex.last_mode=Codex.mode;
		document.body.focus();
		fdjtDOM.dropClass(document.body,"dimmed");
		fdjtDOM.dropClass(document.body,"sbookscanning");
		setHUD(false);
		Codex.displaySync();}}

	function fadeUpHUD(){
	    fdjtLog("Setting properties");
	    CodexHUD.style.opacity=0.001;
	    setTimeout(function(){
		fdjtLog("Changing opacity");
		CodexHUD.style.opacity=1.00;
		setTimeout(function(){
		    fdjtLog("Clearing setup");
		    CodexHUD.style.opacity='';},
			   1500);},
		       1500);}
	Codex.fadeUpHUD=fadeUpHUD;

	function updateScroller(elt){
	    if (typeof elt === 'string') elt=fdjtID(elt);
	    var c=elt.parentNode; var cc=c.parentNode;
	    // Remove all constraint
	    c.style.height=''; c.style.overflow='visible';
	    // Compute bounds to get height
	    var cstyle=fdjtDOM.getStyle(c);
	    var ccstyle=fdjtDOM.getStyle(cc);
	    var cbounds=
		fdjtDOM.parsePX(cstyle.borderTopWidth)+
		fdjtDOM.parsePX(cstyle.borderBottomWidth)+
		fdjtDOM.parsePX(cstyle.paddingTop)+
		fdjtDOM.parsePX(cstyle.paddingBottom)+
		fdjtDOM.parsePX(cstyle.marginTop)+
		fdjtDOM.parsePX(cstyle.marginBottom);
	    var ccbounds=
		fdjtDOM.parsePX(ccstyle.borderTopWidth)+
		fdjtDOM.parsePX(ccstyle.borderBottomWidth)+
		fdjtDOM.parsePX(ccstyle.paddingTop)+
		fdjtDOM.parsePX(ccstyle.paddingBottom)+
		fdjtDOM.parsePX(ccstyle.marginTop)+
		fdjtDOM.parsePX(ccstyle.marginBottom);
	    if (Codex.scrolldivs) {
		c.style.height=
		    ((cc.offsetHeight-(ccbounds+cbounds))-c.offsetTop)+'px';
	    	c.style.overflow='';}
	    else {
		if ((!(Codex.scrollers))||(!(elt.id))) return;
		if (Codex.Trace.scroll) {
		    fdjtLog("cco=%o ct=%o nh=%o",
			    cc.offsetHeight,c.offsetTop,
			    cc.offsetHeight-c.offsetTop);}
		c.style.height=
		    ((cc.offsetHeight-(ccbounds+cbounds))-c.offsetTop)+'px';
		c.style.overflow='hidden';
		if ((Codex.scrollers[elt.id])&&
		    (Codex.scrollers[elt.id].element===elt))
		    Codex.scrollers[elt.id].refresh();
		else Codex.scrollers[elt.id]=new iScroll(elt);}
	    if (Codex.Trace.scroll) {
		fdjtLog("updateScroller %o %o %o ch=%o h=%o",
			elt,c,cc,cc.offsetHeight-c.offsetTop,elt.offsetHeight);
		fdjtLog("updateScroller e=%o,c=%o,cc=%o",
			fdjtDOM.getStyle(elt).overflow,
			fdjtDOM.getStyle(c).overflow,
			fdjtDOM.getStyle(cc).overflow);
		if ((!(Codex.nativescroll))&&
		    (elt.id)&&(Codex.scrollers)&&
		    (Codex.scrollers[elt.id])) {
		    var scroller=Codex.scrollers[elt.id];
		    fdjtLog("e=%o w=%o wo=%o,%o wc=%o,%o i=%o,%o o=%o,%o d=%o,%o m=%o,%o",
			    scroller.element,scroller.wrapper,
			    scroller.wrapper.offsetWidth,
			    scroller.wrapper.offsetHeight,
			    scroller.wrapper.clientWidth,
			    scroller.wrapper.clientHeight,
			    elt.offsetWidth,elt.offsetHeight,
			    scroller.scrollerWidth,scroller.scrollerHeight,
			    scroller.scrollWidth,scroller.scrollHeight,
			    scroller.maxScrollX,scroller.maxScrollY);}}}
	Codex.UI.updateScroller=updateScroller;

	function CodexHUDToggle(mode,keephud){
	    if (!(Codex.mode)) CodexMode(mode);
	    else if (mode===Codex.mode)
		if (keephud) CodexMode(true); else CodexMode(false);
	    else if ((mode==='flyleaf')&&
		     (Codex.mode.search(codexflyleafMode_pat)===0))
		if (keephud) CodexMode(true); else CodexMode(false);
	    else CodexMode(mode);}
	CodexMode.toggle=CodexHUDToggle;

	Codex.dropHUD=function(){return CodexMode(false);}
	Codex.toggleHUD=function(evt){
	    if (fdjtUI.isClickable(fdjtUI.T(evt))) return;
	    if (Codex.mode) CodexMode(false);
	    else CodexMode(true);};
	
	/* The App HUD */
	
	function fillinFlyleaf(){
	    var hidehelp=fdjtID("SBOOKHIDEHELP");
	    var dohidehelp=fdjtState.getCookie("sbookhidehelp");
	    if (!(hidehelp)) {}
	    else if (dohidehelp==='no') hidehelp.checked=false;
	    else if (dohidehelp) hidehelp.checked=true;
	    else hidehelp.checked=false;
	    if (hidehelp)
		hidehelp.onchange=function(evt){
		    if (hidehelp.checked)
			fdjtState.setCookie("sbookhidehelp",true,false,"/");
		    else fdjtState.setCookie("sbookhidehelp","no",false,"/");};
	    var refuris=document.getElementsByName("REFURI");
	    if (refuris) {
		var i=0; var len=refuris.length;
		while (i<len)
		    if (refuris[i].value==='fillin')
			refuris[i++].value=Codex.refuri;
		else i++;}
	    fillinAboutInfo();
	    /* Get various external APPLINK uris */
	    var offlineuri=fdjtDOM.getLink("codex.offline")||altLink("offline");
	    var epuburi=fdjtDOM.getLink("codex.epub")||altLink("ebub");
	    var mobiuri=fdjtDOM.getLink("codex.mobi")||altLink("mobi");
	    var zipuri=fdjtDOM.getLink("codex.mobi")||altLink("mobi");
	    if (offlineuri) {
		var elts=document.getElementsByName("SBOOKOFFLINELINK");
		var i=0; while (i<elts.length) {
		    var elt=elts[i++];
		    if (offlineuri!=='none') elt.href=offlineuri;
		    else {
			elt.href=false;
			fdjtDOM.addClass(elt,"deadlink");
			elt.title='this sBook is not available offline';}}}
	    if (epuburi) {
		var elts=document.getElementsByName("SBOOKEPUBLINK");
		var i=0; while (i<elts.length) {
		    var elt=elts[i++];
		    if (epuburi!=='none') elt.href=epuburi;
		    else {
			elt.href=false;
			fdjtDOM.addClass(elt,"deadlink");
			elt.title='this sBook is not available as an ePub';}}}
	    if (mobiuri) {
		var elts=document.getElementsByName("SBOOKMOBILINK");
		var i=0; while (i<elts.length) {
		    var elt=elts[i++];
		    if (mobiuri!=='none') elt.href=mobiuri;
		    else {
			elt.href=false;
			fdjtDOM.addClass(elt,"deadlink");
			elt.title='this sBook is not available as a MOBIpocket format eBook';}}}
	    if (zipuri) {
		var elts=document.getElementsByName("SBOOKZIPLINK");
		var i=0; while (i<elts.length) {
		    var elt=elts[i++];
		    if (zipuri!=='none') elt.href=zipuri;
		    else {
			elt.href=false;
			fdjtDOM.addClass(elt,"deadlink");
			elt.title='this sBook is not available as a ZIP bundle';}}}
	    initManageIFrame();
	    /* If the book is offline, don't bother showing the link to the offline
	       version. */
	    if (Codex.offline) fdjtDOM.addClass(document.body,"sbookoffline");}

	function altLink(type,uri){
	    uri=uri||Codex.refuri;
	    if (uri.search("http://")===0)
		return "http://offline."+uri.slice(7);
	    else if (uri.search("https://")===0)
		return "https://offline."+uri.slice(8);
	    else return false;}

	function _sbookFillTemplate(template,spec,content){
	    if (!(content)) return;
	    var elt=fdjtDOM.$(spec,template);
	    if ((elt)&&(elt.length>0)) elt=elt[0];
	    else return;
	    if (typeof content === 'string')
	      elt.innerHTML=content;
	    else if (content.cloneNode)
		fdjtDOM.replace(elt,content.cloneNode(true));
	    else fdjtDOM(elt,content);}

	function fillinAboutInfo(){
	    if (fdjtID("SBOOKABOUT")) {
		fdjtDOM.replace("APPABOUTCONTENT",fdjtID("SBOOKABOUT"));
		return;}
	    var about=fdjtID("APPABOUT");
	    var title=
		fdjtID("SBOOKTITLE")||
		fdjtDOM.getMeta("codex.title")||
		fdjtDOM.getMeta("TITLE")||
		fdjtDOM.getMeta("DC.title")||
		document.title;
	    var byline=
		fdjtID("SBOOKBYLINE")||fdjtID("SBOOKAUTHOR")||
		fdjtDOM.getMeta("codex.byline")||fdjtDOM.getMeta("BYLINE")||
		fdjtDOM.getMeta("codex.author")||fdjtDOM.getMeta("AUTHOR");
	    var copyright=
		fdjtID("SBOOKCOPYRIGHT")||
		fdjtDOM.getMeta("codex.copyright")||fdjtDOM.getMeta("COPYRIGHT")||
		fdjtDOM.getMeta("RIGHTS");
	    var publisher=
		fdjtID("SBOOKPUBLISHER")||
		fdjtDOM.getMeta("codex.publisher")||
		fdjtDOM.getMeta("PUBLISHER");
	    var description=
		fdjtID("SBOOKDESCRIPTION")||
		fdjtDOM.getMeta("codex.description")||
		fdjtDOM.getMeta("DESCRIPTION");
	    var digitized=
		fdjtID("SBOOKDIGITIZED")||
		fdjtDOM.getMeta("codex.digitized")||
		fdjtDOM.getMeta("DIGITIZED");
	    var sbookified=fdjtID("SBOOKIFIED")||fdjtDOM.getMeta("SBOOKIFIED");
	    _sbookFillTemplate(about,".title",title);
	    _sbookFillTemplate(about,".byline",byline);
	    _sbookFillTemplate(about,".publisher",publisher);
	    _sbookFillTemplate(about,".copyright",copyright);
	    _sbookFillTemplate(about,".description",description);
	    _sbookFillTemplate(about,".digitized",digitized);
	    _sbookFillTemplate(about,".sbookified",sbookified);
	    _sbookFillTemplate(about,".about",fdjtID("SBOOKABOUT"));
	    var cover=fdjtDOM.getLink("cover");
	    if (cover) {
		var cover_elt=fdjtDOM.$(".cover",about)[0];
		if (cover_elt) fdjtDOM(cover_elt,fdjtDOM.Image(cover));}}

	function initManageIFrame(){
	    var query=document.location.search||"?";
	    var refuri=Codex.refuri;
	    var appuri="https://"+Codex.server+"/v4/flyleaf"+query;
	    if (query.search("REFURI=")<0)
		appuri=appuri+"&REFURI="+encodeURIComponent(refuri);
	    if (query.search("TOPURI=")<0)
		appuri=appuri+"&TOPURI="+
		encodeURIComponent(document.location.href);
	    if (document.title) {
		appuri=appuri+"&DOCTITLE="+encodeURIComponent(document.title);}
	    fdjtID("MANAGEAPP").src=appuri;}

	CodexMode.selectApp=function(){
	    /* initManageIFrame(); */
	    if (Codex.mode==='sbookapp') CodexMode(false);
	    else CodexMode('sbookapp');}

	/* Scanning */

	function CodexScan(elt,src){
	    var cxt=false;
	    var body=document.body;
	    var pelt=Codex.scanning;
	    if (Codex.Trace.mode)
		fdjtLog("CodexScan() %o (src=%o) mode=%o scn=%o/%o",
			elt,src,Codex.mode,Codex.scanning,Codex.target);
	    // Save the source HUD element for the preview (when provided)
	    if (Codex.scanning!==src) {
		var clone=src.cloneNode(true);
		clone.id="CODEXSCAN";
		fdjtDOM.replace("CODEXSCAN",clone);
		if (Codex.nextSlice(src))
		    fdjtDOM.dropClass("CODEXHUD","scanend");
		else fdjtDOM.addClass("CODEXHUD","scanend");
		if (Codex.prevSlice(src))
		    fdjtDOM.dropClass("CODEXHUD","scanstart");
		else fdjtDOM.addClass("CODEXHUD","scanstart");
		Codex.scanning=src;}
	    else {}
	    Codex.setTarget(elt);
	    Codex.GoTo(elt);
	    CodexMode("scanning");}
	Codex.Scan=CodexScan;

	Codex.addConfig("uisize",function(name,value){
	    fdjtDOM.swapClass(CodexHUD,"codexuifont"+value,/codexuifont\w+/);});
	Codex.addConfig("showconsole",function(name,value){
	    if (value) fdjtDOM.addClass(CodexHUD,"codexshowconsole");
	    else fdjtDOM.dropClass(CodexHUD,"codexshowconsole");});
	Codex.addConfig("animatepages",function(name,value){
	    if (value) fdjtDOM.addClass(Codex.page,"codexanimate");
	    else fdjtDOM.dropClass(Codex.page,"codexanimate");});
	Codex.addConfig("animatehud",function(name,value){
	    if (value) fdjtDOM.addClass(Codex.HUD,"codexanimate");
	    else fdjtDOM.dropClass(Codex.HUD,"codexanimate");});

	/* Settings apply/save handlers */

	function getSettings(){
	  var result={};
	  var settings=fdjtID("CODEXSETTINGS");
	  var pageview=fdjtDOM.getInputValues(settings,"CODEXPAGEVIEW");
	  result.pageview=((pageview)&&(pageview.length));
	  var bodysize=fdjtDOM.getInputValues(settings,"CODEXBODYSIZE");
	  if ((bodysize)&&(bodysize.length))
	    result.bodysize=bodysize[0];
	  var bodystyle=fdjtDOM.getInputValues(settings,"CODEXBODYSTYLE");
	  if ((bodystyle)&&(bodystyle.length))
	    result.bodystyle=bodystyle[0];
	  var uisize=fdjtDOM.getInputValues(settings,"CODEXUISIZE");
	  if ((uisize)&&(uisize.length))
	    result.uisize=uisize[0];
	  var hidesplash=fdjtDOM.getInputValues(settings,"CODEXHIDESPLASH");
	  result.hidesplash=((hidesplash)&&(hidesplash.length));
	  var showconsole=fdjtDOM.getInputValues(settings,"CODEXSHOWCONSOLE");
	  result.showconsole=((showconsole)&&(showconsole.length));
	  return result;}

	Codex.UI.applySettings=function(){
	  Codex.setConfig(getSettings());};
	Codex.UI.saveSettings=function(){
	  Codex.saveConfig(getSettings());};
	
	/* Button methods */

	function LoginButton_onclick(evt){
	    evt=evt||event||null;
	    if (Codex.mode==="login") CodexMode(false);
	    else CodexMode("login");
	    evt.cancelBubble=true;}

	return CodexMode;})();

fdjt_versions.decl("codex",codex_hud_version);
fdjt_versions.decl("codex/hud",codex_hud_version);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_interaction_id="$Id$";
var codex_interaction_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements a Javascript/DHTML UI for reading
   large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

/* New body interaction model:
   With mouse:
   mouseup: 
   if non-empty selection, save, set target, raise hud
   otherwise toggle hud

   With touch:
   touchstart: after 0.5s: set target, raise hud, set context mode (after ~0.5s)
   touchmove: clear context mode (or timer)
   touchend: clear context mode, if scrolled, 
   if non-empty selection, save, otherwise lower hud
*/

/*

  Body behavior:
  hold either temporarily hides the HUD or temporarily engages context mode
  (this might also be selecting some text)
  click when Codex.mode is non-context just drops the HUD
  click on a non-target makes it the target and enters context mode
  click on a target opens the mark HUD
  Marginal behavior:
  click on top or bottom margin, either hides HUD or engages last relevant
  mode
  click on left or right margin goes forward or backward
  hold on left or right margin auto-advances, springs back on release,
  stops on mouseout/touchout
  
  Handling hold with mouse:
  onmousedown enters mode, sets tick
  onmouseup leaves mode (unless shift is down)
  onmouseout leaves mode (unless shift or mouse is down)
  clears mouse_focus
  onmouseover shifts mode target when mode is live, sets mouse_focus on move
  shiftkey down enters mode on mouse_focus
  shiftkey up leaves mode (unless mousedown tick is set)

  Hold-free mode:
  click enters/leaves mode

*/

(function(){

    // Imports (kind of )
    var hasClass=fdjtDOM.hasClass;

    var unhold=false;
    var hold_timer=false;
    var hold_interval=1500;
    var start_x=-1; var start_y=-1; var last_x=-1; var last_y=-1;
    
    function sbicon(base){return Codex.graphics+base;}
    function cxicon(base) {return Codex.graphics+"codex/"+base;}

    /* Setup for gesture handling */

    function addHandlers(node,type){
	var mode=Codex.ui;
	fdjtDOM.addListeners(node,Codex.UI.handlers[mode][type]);}
    Codex.UI.addHandlers=addHandlers;

    function setupGestures(){
	var mode=Codex.ui;
	if (!(mode)) Codex.ui=mode="mouse";
	addHandlers(false,'window');
	addHandlers(fdjtID("CODEXPAGE"),'content');
	addHandlers(Codex.HUD,'hud');
	var handlers=Codex.UI.handlers[mode];
	if (mode)
	    for (key in handlers)
		if ((key[0]==='.')||(key[0]==='#')) {
		    var nodes=fdjtDOM.$(key); var h=handlers[key];
		    fdjtDOM.addListeners(nodes,h);}}
    Codex.setupGestures=setupGestures;

    var dont=fdjtUI.nobubble;
    function passmultitouch(evt){
	if ((evt.touches)&&(evt.touches.length>1)) return;
	else fdjtUI.nobubble(evt);}

    Codex.UI.updateLogin=function(){
	if (fdjtID("SBOOKREGISTER").checked) {
	    fdjtDOM.addClass(fdjtID("SBOOKNATIVELOGIN"),"registering");
	    fdjtDOM.addClass(fdjtID("SBOOKNATIVELOGIN"),"expanded");}
	else {
	    fdjtDOM.dropClass(fdjtID("SBOOKNATIVELOGIN"),"registering");
	    fdjtDOM.dropClass(fdjtID("SBOOKNATIVELOGIN"),"expanded");}}
    Codex.UI.checkLogin=function(evt){
	if (fdjtID("SBOOKREGISTER").checked) {
	    var tbody=fdjtID("SBOOKNATIVELOGIN");
	    var passin=fdjtDOM.getInput(tbody,"PASSWD");
	    var xpassin=fdjtDOM.getInput(tbody,"XPASSWD");
	    if (passin.value!==xpassin.value) {
		alert("Passwords don't match!");
		return fdjtUI.cancel(evt);}}};

    /* New simpler UI */

    function inUI(node){
	while (node)
	    if (!(node)) return false;
	else if (node.sbookui) return true;
	else node=node.parentNode;
	return false;}

    /* Adding a gloss button */

    function addGlossButton(target){
	var passage=Codex.getTarget(target);
	if (!(passage)) return;
	var img=fdjtDOM.getChild(passage,".codexglossbutton");
	if (img) return;
	img=fdjtDOM.Image(cxicon("remarkballoon32x32.png"),".codexglossbutton",
			  "+","click to add a gloss to this passage");
	Codex.UI.addHandlers(img,"glossbutton");
	fdjtDOM.prepend(passage,img);}
    
    function glossbutton_onclick(evt){
	evt=evt||event;
	var target=fdjtUI.T(evt);
	var passage=Codex.getTarget(target);
	if ((Codex.mode==="addgloss")&&
	    (Codex.glosstarget===passage))
	    CodexMode(true);
	else if (passage) {
	    fdjtUI.cancel(evt);
	    Codex.setGlossTarget(passage);
	    CodexMode("addgloss");}}

    var excerpts=[];

    /* New handlers */

    function emptySelection(sel){
	return ((!(sel))||
		(!(sel.focusNode))||
		(!(sel.anchorNode))||
		((sel.anchorNode===sel.focusNode)&&
		 (sel.anchorOffset===sel.focusOffset)));}

    /* Functionality:
       on selection:
       save but keep selection,
       set target (if available)
       if hud is down, raise it
       on tap: (no selection)
       if hud is down, set target and raise it
       if no target, raise hud
       if tapping target, lower HUD
       if tapping other, set target, drop mode, and raise hud
       (simpler) on tap:
       if hudup, drop it
       otherwise, set target and raise HUD
    */

    /* Holding */

    var held=false; var handled=false;

    function clear_hold(caller){
	if (held) {
	    clearTimeout(held); held=false;
	    //alert("clear_hold "+(caller||"someone"));
	}}

    /* Generic content handler */

    function content_tapped(evt,target){
	if (!(target)) target=fdjtUI.T(evt);
	var anchor=fdjtDOM.getParent(target,"A"), href;
	// If you tap on a relative anchor, move there using Codex
	// rather than the browser default
	if ((anchor)&&(anchor.href)&&
	    (href=anchor.getAttribute("href"))&&(href[0]==='#')&&
	    (document.getElementById(href.slice(1)))) {
	    var goto=document.getElementById(href.slice(1));
	    // This would be the place to provide smarts for
	    // asides/notes/etc, so they (for example) pop up
	    Codex.JumpTo(goto);
	    fdjtUI.cancel(evt);
	    return;}
	var passage=Codex.getTarget(target);
	// We get the passage here so we can include it in the trace message
	if (Codex.Trace.gestures)
	    fdjtLog("content_tapped (%o) on %o passage=%o mode=%o",
		    evt,target,passage,Codex.mode);
	// These should have their own handlers
	if ((fdjtUI.isClickable(target))||
	    (fdjtDOM.hasParent(target,".codexglossbutton"))||
	    (fdjtDOM.hasParent(target,".codexglossmark"))) {
	    if (Codex.Trace.gestures)
		fdjtLog("deferring content_tapped (%o) on %o",
			evt,target,passage,Codex.mode);
	    return;}
	else fdjtUI.cancel(evt); 
	// If you tap an edge, page forward or backward
	if (edgeTap(evt)) return;
	var sel=window.getSelection();
	// If there's a selection, store it as an excerpt.
	if ((sel)&&(sel.anchorNode)&&(!(emptySelection(sel)))) {
	    Codex.selection=sel;
	    var p=Codex.getTarget(sel.anchorNode)||
		Codex.getTarget(sel.focusNode)||
		passage;
	    if (p) {
		Codex.excerpt=sel;
		return xtapTarget(p);}
	    else CodexMode(false);}
	if (passage) {
	    if (Codex.target===passage) {
		if (Codex.hudup) CodexMode(false);
		else {
		    addGlossButton(passage);
		    CodexMode(true);}}
	    else if ((evt.ctrlKey)||(evt.shiftKey)||(n_touches>1))
		xtapTarget(passage);
	    else if (fdjtDOM.hasClass(document.body,"sbookscanning"))
		CodexMode(false);
	    else tapTarget(passage);}
	else if (Codex.hudup||Codex.mode) {
	    if (Codex.Trace.gestures) fdjtLog("Dropping HUD");
	    CodexMode(false);
	    return;}
	else CodexMode(true);}

    function glossExcerpt(passage){
	Codex.setTarget(passage);
	addGlossButton(passage);
	var text=fdjtDOM.textify(passage);
	Codex.selection=fdjtString.oneline(text);
	Codex.glossTarget(passage);
	CodexMode("addgloss");
	return;}

    /* Tap actions */

    function tapTarget(target){
	if (Codex.Trace.gestures)
	    fdjtLog("Tap on target %o mode=%o",target,Codex.mode);
	addGlossButton(target);
	if ((Codex.mode==='glosses')&&(Codex.target===target)) {
	    // If you're already showing glosses, hide them
	    CodexMode(false);
	    return;}
	else {
	    Codex.setTarget(target);
	    CodexMode(true);}}

    function xtapTarget(target){
	if (Codex.Trace.gestures)
	    fdjtLog("Tap (extended) on target %o mode=%o",target,Codex.mode);
	Codex.setTarget(target);
	addGlossButton(target);
	Codex.setGlossTarget(target);
	CodexMode("addgloss");}

    function edgeTap(evt,x){
	if (!(evt)) evt=event||false;
	if (typeof x !== 'number') x=((evt)&&(evt.clientX));
	if (typeof x !== 'number') x=last_x;
	if (typeof x === 'number') {
	    if (Codex.Trace.gestures)
		fdjtLog("edgeTap %o x=%o w=%o",evt,x,fdjtDOM.viewHeight());
	    if (x<50) {Backward(evt); return true;}
	    else if (x>(fdjtDOM.viewWidth()-50)) {
		Forward(evt); return true;}
	    else return false}
	else return false;}
    Codex.edgeTap=edgeTap;
    
    function edge_click(evt) {
	var target=fdjtUI.T(evt);
	if ((fdjtUI.isClickable(target))||
	    (fdjtDOM.hasParent(target,".codexglossbutton"))||
	    (fdjtDOM.hasParent(target,".codexglossmark")))
	    return;
	if (edgeTap(evt)) fdjtUI.cancel(evt);}

    /* HUD handlers */

    function hud_tapped(evt,target){
	if (!(target)) target=fdjtUI.T(evt);
	if (fdjtUI.isClickable(target)) return;
	else if (fdjtDOM.hasParent(target,".helphud")) {
	    var mode=fdjtDOM.findAttrib(target,"data-hudmode")||
		fdjtDOM.findAttrib(target,"hudmode");
	    if (mode) CodexMode(mode)
	    else CodexMode(false);
	    return fdjtUI.cancel(evt);}
	while (target) {
	    if (target.about) {
		Codex.Scan(fdjtID(target.about),target);
		return fdjtUI.cancel(evt);}
	    else if (target.frag) {
		Codex.tocJump(evt,target);
		return fdjtUI.cancel(evt);}
	    else target=target.parentNode;}}
    
    /* Mouse handlers */

    /* Keyboard handlers */

    // We use keydown to handle navigation functions and keypress
    //  to handle mode changes
    function onkeydown(evt){
	evt=evt||event||null;
	var kc=evt.keyCode;
	// Codex.trace("sbook_onkeydown",evt);
	if (evt.keyCode===27) { /* Escape works anywhere */
	    if (Codex.mode) {
		Codex.last_mode=Codex.mode;
		CodexMode(false);
		Codex.setTarget(false);
		fdjtID("CODEXSEARCHINPUT").blur();}
	    else if (Codex.last_mode) CodexMode(Codex.last_mode);
	    else {}
	    return;}
	else if ((evt.altKey)||(evt.ctrlKey)||(evt.metaKey)) return true;
	else if (kc===34) Codex.Forward(evt);   /* page down */
	else if (kc===33) Codex.Backward(evt);  /* page up */
	else if (kc===37) Codex.scanBackward(evt); /* arrow left */
	else if (kc===39) Codex.scanForward(evt); /* arrow right */
	// Don't interrupt text input for space, etc
	else if (fdjtDOM.isTextInput(fdjtDOM.T(evt))) return true;
	else if (kc===32) Codex.Forward(evt); // Space
	// backspace or delete
	else if ((kc===8)||(kc===45)) Codex.Backward(evt);
	// Home goes to the current head.
	else if (kc===36) Codex.JumpTo(Codex.head);
	else return;
	fdjtUI.cancel(evt);}

    // At one point, we had the shift key temporarily raise/lower the HUD.
    //  We might do it again, so we keep this definition around
    function onkeyup(evt){
	evt=evt||event||null;
	var kc=evt.keyCode;
	// Codex.trace("sbook_onkeyup",evt);
	if (fdjtDOM.isTextInput(fdjtDOM.T(evt))) return true;
	else if ((evt.ctrlKey)||(evt.altKey)||(evt.metaKey)) return true;
	else {}}
    Codex.UI.handlers.onkeyup=onkeyup;

    /* Keypress handling */

    // We have a big table of command characters which lead to modes
    var modechars={
	63: "searching",102: "searching",
	65: "flyleaf", 97: "flyleaf",
	83: "searching",115: "searching",
	80: "gotopage",112: "gotopage",
	76: "gotoloc",108: "gotoloc",
	70: "searching",
	100: "device",68: "device",
	110: "toc",78: "toc",
	116: "flytoc",84: "flytoc",
	104: "help",72: "help",
	103: "allglosses",71: "allglosses",
	67: "console", 99: "console"};

    // Handle mode changes
    function onkeypress(evt){
	var modearg=false; 
	evt=evt||event||null;
	var ch=evt.charCode||evt.keyCode;
	// Codex.trace("sbook_onkeypress",evt);
	if (fdjtDOM.isTextInput(fdjtDOM.T(evt))) return true;
	else if ((evt.altKey)||(evt.ctrlKey)||(evt.metaKey)) return true;
	else modearg=modechars[ch];
	if (modearg==="flyleaf") modearg=Codex.last_flyleaf||"about";
	var mode=CodexMode();
	if (modearg) {
	    if (mode===modearg) {
		CodexMode(false); mode=false;}
	    else {
		CodexMode(modearg); mode=modearg;}}
	else {}
	if (mode==="searching")
	    fdjtID("CODEXSEARCHINPUT").focus();
	else fdjtID("CODEXSEARCHINPUT").blur();
	fdjtDOM.cancel(evt);}
    Codex.UI.handlers.onkeypress=onkeypress;

    function goto_keypress(evt){
	evt=evt||event||null;
	var target=fdjtUI.T(evt);
	var ch=evt.charCode||evt.keyCode;
	var max=false; var min=false;
	if (target.name==='GOTOLOC') {
	    min=0; max=Math.floor(Codex.ends_at/128);}
	else if (target.name==='GOTOPAGE') {
	    min=1; max=Codex.pagecount;}
	else if (ch===13) fdjtUI.cancel(evt);
	if (ch===13) {
	    var num=parseInt(target.value);
	    fdjtUI.cancel(evt);
	    if ((typeof num !== 'number')||(num<min)||(num>max)) {
		alert("Enter a number between "+min+" and "+max+" (inclusive)");
		return;}
	    if (target.name==='GOTOLOC') Codex.JumpTo(128*num);
	    else if (target.name==='GOTOPAGE') Codex.GoToPage(num-1);
	    else {}
	    target.value="";
	    CodexMode(false);}}
    Codex.UI.goto_keypress=goto_keypress;

    /* HUD button handling */

    var mode_hud_map={
	"toc": "CODEXTOC",
	"searching": "CODEXSEARCH",
	"allglosses": "SBOOKSOURCES",
	"flyleaf": "CODEXFLYHEAD"};
    
    function hudbutton(evt){
	var target=fdjtUI.T(evt);
	var mode=target.getAttribute("hudmode");
	if ((Codex.Trace.gestures)&&
	    ((evt.type==='click')||(Codex.Trace.gestures>1)))
	    fdjtLog("hudbutton() %o mode=%o cl=%o scan=%o sbh=%o mode=%o",
		    evt,mode,(fdjtUI.isClickable(target)),
		    Codex.scanning,Codex.hudup,CodexMode());
	fdjtUI.cancel(evt);
	if (!(mode)) return;
	var hudid=((mode)&&(mode_hud_map[mode]));
	var hud=fdjtID(hudid);
	if (mode==='flyleaf') mode=Codex.last_flyleaf||"help";
	if (evt.type==='click') {
	    if (hud) fdjtDOM.dropClass(hud,"hover");
	    if (fdjtDOM.hasClass(Codex.HUD,mode)) CodexMode(false);
	    else CodexMode(mode);}
	else if ((evt.type==='mouseover')&&(Codex.mode))
	    return;
	else {
	    if (!(hud)) {}
	    else if (evt.type==='mouseover')
		fdjtDOM.addClass(hud,"hover");
	    else if (evt.type==='mouseout')
		fdjtDOM.dropClass(hud,"hover");
	    else {}}}
    Codex.UI.hudbutton=hudbutton;

    Codex.UI.dropHUD=function(evt){
	if (Codex.Trace.gestures) fdjtLog("dropHUD %o",evt);
	fdjtUI.cancel(evt); CodexMode(false);};

    /* Gesture state */

    var touch_started=false; var touch_ref=false;
    var page_x=-1; var page_y=-1; var sample_t=-1;
    var touch_moves=0;
    var touch_timer=false;
    var touch_held=false;
    var touch_moved=false;
    var touch_scrolled=false;
    var n_touches=0;

    var doubletap=false, tripletap=false;

    function cleartouch(){
	touch_started=false; touch_ref=false;
	start_x=start_y=last_x=last_y=-1;
	page_x=page_y=sample_t=-1; touch_moves=0;
	touch_timer=false; touch_held=false;
	touch_moved=false; touch_scrolled=false;
	doubletap=false; tripletap=false;}

    function tracetouch(handler,evt){
	var touches=evt.touches;
	var touch=(((touches)&&(touches.length))?(touches[0]):(evt));
	var target=fdjtUI.T(evt); var ref=Codex.getRef(target);
	if (touch_started)
	    fdjtLog("%s() n=%o %sts=%o %s@%o\n\t+%o %s%s%s%s%s%s%s s=%o,%o l=%o,%o p=%o,%o d=%o,%o ref=%o tt=%o tm=%o",
		    handler,((touches)&&(touches.length)),
		    ((!(touch))?(""):
		     ("c="+touch.clientX+","+touch.clientY+";s="+touch.screenX+","+touch.screenY+" ")),
		    touch_started,evt.type,target,
		    fdjtTime()-touch_started,
		    ((Codex.mode)?(Codex.mode+" "):""),
		    ((Codex.scanning)?"scanning ":""),
		    ((touch_held)?("held "):("")),
		    ((touch_moved)?("moved "):("")),
		    ((touch_scrolled)?("scrolled "):("")),
		    ((fdjtUI.isClickable(target))?("clickable "):("")),
		    ((touch)?"":"notouch "),
		    start_x,start_y,last_x,last_y,page_x,page_y,
		    (((touch)&&(touch.screenX))?(touch.screenX-page_x):0),
		    (((touch)&&(touch.screenY))?(touch.screenY-page_y):0),
		    touch_ref,touch_timer,touch_moves);
	else fdjtLog("%s() n=%o %s%s c=%o,%o p=%o,%o ts=%o %s@%o ref=%o",
		     handler,((touches)&&(touches.length)),
		     ((Codex.mode)?(Codex.mode+" "):""),
		     ((Codex.scanning)?"scanning ":""),
		     touch.clientX,touch.clientY,touch.screenX,touch.screenY,
		     touch_started,evt.type,target,ref);
	if (ref) fdjtLog("%s() ref=%o from %o",handler,ref,target);}

    /* Touch handling */

    function shared_touchstart(evt){
	evt=evt||event||false;
	var target=fdjtUI.T(evt);
	if (fdjtUI.isClickable(target)) return;
	fdjtUI.cancel(evt);
	if (Codex.Trace.gestures) tracetouch("touchstart",evt);
	touch_started=fdjtTime();
	var touches=evt.touches;
	var touch=(((touches)&&(touches.length))?(touches[0]):(evt));
	if (touches) n_touches=touches.length;
	else if (evt.shiftKey) n_touches=2;
	else n_touches=1;
	if (touch) {
	    start_x=last_x=touch.clientX;
	    start_y=last_y=touch.clientY;
	    page_x=touch.screenX; page_y=touch.screenY;}
	else if (evt.clientX) { /* faketouch */
	    if (evt.shiftKey) n_touches=2; else n_touches=1;
	    start_x=last_x=evt.clientX;
	    start_y=last_y=evt.clientY;
	    page_x=touch.screenX; page_y=evt.screenY;}
	touch_held=false; touch_moved=false; touch_scrolled=false;}
    function content_touchstart(evt){
	evt=evt||event||false;
	handled=false;
	var target=fdjtUI.T(evt);
	shared_touchstart(evt);
	var passage;
	if ((!((fdjtUI.isClickable(target))||(n_touches>1)))&&
	    (passage=Codex.getTarget(target)))
	    held=setTimeout(function(evt){
		glossExcerpt(passage);
		held=false; handled=true;},
			    500);}

    var mouseisdown=false;

    function content_touchmove(evt){
	// When faking touch, moves only get counted if the mouse is down.
	if ((evt.type==="mousemove")&&(!(mouseisdown))) return;
	fdjtUI.cancel(evt);
	touch_moves++;
	var touches=evt.touches;
	var touch=
	    (((evt.touches)&&(evt.touches.length))?(evt.touches[0]):(evt));
	if (page_x<0) page_x=touch.screenX;
	if (page_y<0) page_y=touch.screenY;
	if ((touches)&&(touches.length>n_touches)) n_touches=touches.length;
	var dx=touch.screenX-page_x; var dy=touch.screenY-page_y;
	var adx=((dx<0)?(-dx):(dx)); var ady=((dy<0)?(-dy):(dy));
	// if (Codex.Trace.gestures) tracetouch("touchmove",evt);
	if ((held)&&((adx+ady)>10)) {
	    clear_hold("touchmove"+(adx+ady)); handled=false;}
	if (Codex.Trace.gestures>1)
	    fdjtLog("body_touchmove d=%o,%o a=%o,%o p=%o,%o l=%o,%o n=%o scan=%o ",
		    dx,dy,adx,ady,
		    touch.clientX,touch.clientY,last_x,last_y,
		    touch_moves,Codex.scanning);
	last_x=touch.clientX; last_y=touch.clientY;
	touch_moved=true;
	return;}

    function content_touchend(evt,tap){
	var target=fdjtUI.T(evt);
	if (held) clear_hold("touchend");
	if (Codex.Trace.gestures) tracetouch("touchend",evt);
	mouseisdown=false; // For faketouch
	if (fdjtUI.isClickable(target)) return;
	if (handled) return;
	else if (touch_moved) {
	    var dx=last_x-start_x; var dy=last_y-start_y;
	    var adx=((dx<0)?(-dx):(dx)); var ady=((dy<0)?(-dy):(dy));
	    var ad=((adx<ady)?(ady-adx):(adx-ady));
	    if (Codex.Trace.gestures)
		fdjtLog("touchend/gesture l=%o,%o s=%o,%o d=%o,%o |d|=%o,%o",
			last_x,last_y,start_x,start_y,dx,dy,adx,ady);
	    if (adx>(ady*3)) { /* horizontal */
		if (n_touches===1) {
		    if (dx<0) Codex.Forward(evt);
		    else Codex.Backward(evt);}
		else {
		    if (dx<0) Codex.scanForward(evt);
		    else Codex.scanBackward(evt);}}
	    else {}
	    return;}
	else if (touch_scrolled) return;  // Gesture already intepreted
	else return content_tapped(evt,target);}

    /* HUD touch */

    function hud_touchmove(evt){
	// When faking touch, moves only get counted if the mouse is down.
	if ((evt.type==="mousemove")&&(!(mouseisdown))) return;
	var target=fdjtUI.T(evt);
	if (fdjtUI.isClickable(target)) return;
	fdjtUI.cancel(evt);
	touch_moves++;
	var touch=
	    (((evt.touches)&&(evt.touches.length))?(evt.touches[0]):(evt));
	var dx=touch.screenX-page_x; var dy=touch.screenY-page_y;
	var adx=((dx<0)?(-dx):(dx)); var ady=((dy<0)?(-dy):(dy));
	if (page_x<0) page_x=touch.screenX;
	if (page_y<0) page_y=touch.screenY;
	if (Codex.Trace.gestures>1) tracetouch("hud_touchmove",evt);
	if ((hold_timer)&&((adx+ady)>4)) {
	    clearTimeout(hold_timer); hold_timer=false;}
	last_x=touch.clientX; last_y=touch.clientY;
	touch_moved=true;
	page_x=touch.screenX; page_y=touch.screenY;
	touch_scrolled=true;}

    function hud_touchend(evt){
	if (Codex.Trace.gestures) tracetouch("hud_touchend",evt);
	var target=fdjtUI.T(evt);
	mouseisdown=false; // For faketouch
	var scroller=((Codex.scrolling)&&(Codex.scrollers)&&
		      (Codex.scrollers[Codex.scrolling]));
	// fdjtLog("hud_touchend scroller=%o(%o) moved=%o",scroller,scroller.element,scroller.moved);
	if ((scroller)&&(scroller.motion)&&(scroller.motion>10)) return;
	else if (fdjtUI.isClickable(target)) {
	    if (Codex.ui==="faketouch") {
		// This happens automatically when faking touch
		fdjtUI.cancel(evt);
		return;}
	    else {
		var click_evt = document.createEvent("MouseEvents");
		while (target)
		    if (target.nodeType===1) break;
		else target=target.parentNode;
		if (!(target)) return;
		if (Codex.Trace.gestures)
		    fdjtLog("Synthesizing click on %o",target);
		click_evt.initMouseEvent("click", true, true, window,
					 1,page_x,page_y,last_x, last_y,
					 false, false, false, false, 0, null);
		fdjtUI.cancel(evt);
		target.dispatchEvent(click_evt);
		return;}}
	else return hud_tapped(evt);}

    /* Glossmarks */
    
    function glossmark_tapped(evt){
	evt=evt||event||null;
	if (held) clear_hold("glossmark_tapped");
	var target=fdjtUI.T(evt);
	var glossmark=fdjtDOM.getParent(target,".codexglossmark");
	var passage=Codex.getTarget(glossmark.parentNode,true);
	if (Codex.Trace.gestures)
	    fdjtLog("glossmark_tapped (%o) on %o gmark=%o passage=%o mode=%o target=%o",
		    evt,target,glossmark,passage,Codex.mode,Codex.target);
	if (!(glossmark)) return false;
	fdjtUI.cancel(evt);
	if ((Codex.mode==='glosses')&&(Codex.target===passage)) {
	    CodexMode(true);
	    return;}
	else Codex.openGlossmark(passage);}
    function glossmark_onmouseover(evt){
	evt=evt||event||null;
	var target=Codex.getTarget(fdjtUI.T(evt))
	fdjtDOM.addClass(target,"sbooklivespot");}
    function glossmark_onmouseout(evt){
	evt=evt||event||null;
	var target=Codex.getTarget(fdjtUI.T(evt));
	fdjtDOM.dropClass(target,"sbooklivespot");}

    /* Moving forward and backward */

    var last_motion=false;

    function Forward(evt){
	var now=fdjtTime();
	if (!(evt)) evt=event||false;
	if (evt) fdjtUI.cancel(evt);
	if ((last_motion)&&((now-last_motion)<100)) return;
	else last_motion=now;
	if (Codex.Trace.nav)
	    fdjtLog("Forward e=%o h=%o t=%o",evt,Codex.head,Codex.target);
	if ((Codex.mode==="glosses")||(Codex.mode==="addgloss"))
	    CodexMode(true);
	if (((evt)&&(evt.shiftKey))||(n_touches>1))
	    scanForward();
	else pageForward();}
    Codex.Forward=Forward;
    function Backward(evt){
	var now=fdjtTime();
	if (!(evt)) evt=event||false;
	if (evt) fdjtUI.cancel(evt);
	if ((last_motion)&&((now-last_motion)<100)) return;
	else last_motion=now;
	if ((Codex.mode==="glosses")||(Codex.mode==="addgloss"))
	    CodexMode(true);
	if (Codex.Trace.nav)
	    fdjtLog("Backward e=%o h=%o t=%o",evt,Codex.head,Codex.target);
	if (((evt)&&(evt.shiftKey))||(n_touches>1))
	    scanBackward();
	else pageBackward();}
    Codex.Backward=Backward;

    function pageForward(){
	if (Codex.Trace.gestures)
	    fdjtLog("pageForward c=%o n=%o",Codex.curpage,Codex.pagecount);
	if ((Codex.mode==="scanning")||(Codex.mode==="tocscan"))
	    CodexMode(false);
	if ((Codex.paginate)&&(Codex.colpage)&&(Codex.pages)) {
	    if (Codex.curpage===Codex.pagecount) {}
	    else Codex.GoToPage(Codex.curpage=(Codex.curpage+1));}
	else if ((Codex.paginate)&&(Codex.pagecount)) {
	    var newpage=false;
	    if (Codex.mode==="glosses") CodexMode(true);
	    if (Codex.curpage===Codex.pagecount) {}
	    else Codex.GoToPage(newpage=Codex.curpage+1);
	    if ((false)&&(newpage)&&(Codex.mode==='allglosses')) /* to fix */
		Codex.UI.scrollGlosses(
		    Codex.pageinfo[newpage].first,
		    fdjtID("CODEXALLGLOSSES"),true);}
	else {
	    var delta=fdjtDOM.viewHeight()-50;
	    if (delta<0) delta=fdjtDOM.viewHeight();
	    var newy=fdjtDOM.viewTop()+delta;
	    window.scrollTo(fdjtDOM.viewLeft(),newy);}}
    Codex.pageForward=pageForward;

    function pageBackward(){
	if (Codex.Trace.gestures)
	    fdjtLog("pageBackward c=%o n=%o",Codex.curpage,Codex.pagecount);
	if ((Codex.mode==="scanning")||(Codex.mode==="tocscan"))
	    CodexMode(false);
	if ((Codex.paginate)&&(Codex.colpage)&&(Codex.pages)) {
	    if (Codex.curpage===0) {}
	    else Codex.GoToPage(Codex.curpage=(Codex.curpage-1));}
	else if ((Codex.paginate)&&(Codex.pagecount)) {
	    var newpage=false;
	    if (Codex.mode==="glosses") CodexMode(true);
	    if (Codex.curpage===0) {}
	    else {
		Codex.GoToPage(newpage=Codex.curpage-1);}
	    if ((false)&&(newpage)&&(Codex.mode==='allglosses')) /* to fix */
		Codex.UI.scrollGlosses(
		    Codex.pageinfo[newpage].first,
		    fdjtID("CODEXALLGLOSSES"),true);}
	else {
	    var delta=fdjtDOM.viewHeight()-50;
	    if (delta<0) delta=fdjtDOM.viewHeight();
	    var newy=fdjtDOM.viewTop()-delta;
	    window.scrollTo(fdjtDOM.viewLeft(),newy);}}
    Codex.pageBackward=pageBackward;

    function scanForward(){
	if (Codex.mode==="scanning") {}
	else if (Codex.mode==="tocscan") {}
	else if (Codex.scanning) CodexMode("scanning");
	else CodexMode("tocscan");
	if (Codex.mode==="tocscan") {
	    var head=Codex.head; var headinfo=Codex.docinfo[head.id];
	    if (Codex.Trace.nav) 
		fdjtLog("scanForward/toc() head=%o info=%o n=%o h=%o",
			head,headinfo,headinfo.next,headinfo.head);
	    if (headinfo.next) Codex.GoTo(headinfo.next.elt);
	    else if ((headinfo.head)&&(headinfo.head.next)) {
		Codex.GoTo(headinfo.head.next.elt); CodexMode("toc");}
	    else if ((headinfo.head)&&(headinfo.head.head)&&
		     (headinfo.head.head.next)) {
		Codex.GoTo(headinfo.head.head.next.elt);
		CodexMode("toc");}
	    else CodexMode(false);
	    return;}
	var start=Codex.scanning;
	var scan=Codex.nextSlice(start);
	var ref=((scan)&&(Codex.getRef(scan)));
	if (Codex.Trace.nav) 
	    fdjtLog("scanForward() from %o/%o to %o/%o under %o",
		    start,Codex.getRef(start),scan,ref,slice);
	if ((ref)&&(scan)) Codex.Scan(ref,scan);
	return scan;}
    Codex.scanForward=scanForward;

    function scanBackward(){
	if (Codex.mode==="scanning") {}
	else if (Codex.mode==="tocscan") {}
	else if (Codex.scanning) CodexMode("scanning");
	else CodexMode("tocscan");
	if (Codex.mode==="tocscan") {
	    var head=Codex.head; var headinfo=Codex.docinfo[head.id];
	    if (Codex.Trace.nav) 
		fdjtLog("scanBackward/toc() head=%o info=%o p=%o h=%o",
			head,headinfo,headinfo.prev,headinfo.head);
	    if (headinfo.prev) Codex.GoTo(headinfo.prev.elt);
	    else if (headinfo.head) {
		Codex.GoTo(headinfo.head.elt); CodexMode("toc");}
	    else CodexMode(false);
	    return;}
	var scan=Codex.prevSlice(Codex.scanning);
	var ref=((scan)&&(Codex.getRef(scan)));
	if (Codex.Trace.nav) 
	    fdjtLog("scanBackward() from %o/%o to %o/%o under %o",
		    start,Codex.getRef(start),scan,ref,slice);
	if ((ref)&&(scan)) Codex.Scan(ref,scan);
	return scan;}
    Codex.scanBackward=scanBackward;

    function scanner_click(evt){
	evt=evt||event;
	var target=fdjtUI.T(evt);
	if (fdjtUI.isClickable(target)) return;
	var scanning=Codex.scanning;
	if (!(scanning)) return;
	var hudparent=fdjtDOM.getParent(scanning,".hudpanel");
	if (!(hudparent)) return;
	else if (hudparent===fdjtID("CODEXBROWSEGLOSSES"))
	    CodexMode("allglosses");
	else if (hudparent===fdjtID("CODEXSEARCH"))
	    CodexMode("searchresults");
	else {}};

    /* Entering page numbers and locations */

    function enterPageNum(evt) {
	evt=evt||event;
	fdjtUI.cancel(evt);
	if (Codex.hudup) {CodexMode(false); return;}
	CodexMode.toggle("gotopage");}
    function enterLocation(evt) {
	evt=evt||event;
	fdjtUI.cancel(evt);
	if (Codex.hudup) {CodexMode(false); return;}
	CodexMode.toggle("gotoloc");}
    
    /* Other handlers */

    function flyleaf_tap(evt){
	if (fdjtUI.isClickable(evt)) return;
	else CodexMode(false);}

    function getOffX(evt){
	if (typeof evt.offsetX === "number") return evt.offsetX;
	else if ((evt.touches)&&(evt.touches.length)) {
	    var touch=evt.touches[0];
	    var pinfo=fdjtID("CODEXPAGEINFO");
	    var target=touch.target;
	    while ((target)&&(target.nodeType!==1)) target=target.parentNode;
	    var geom=fdjtDOM.getGeometry(target,pinfo);
	    var tx=geom.left;
	    return touch.clientX-(tx+pinfo.offsetLeft);}
	else return false;}

    function head_click(evt){
	if (Codex.Trace.gestures) fdjtLog("head_click %o",evt);
	if (fdjtUI.isClickable(evt)) return;
	else if (Codex.mode==='help') {
	    fdjtUI.cancel(evt);
	    CodexMode(true);}
	else if (Codex.mode) return;
	else {
	    fdjtUI.cancel(evt);
	    CodexMode(true);}}
    function foot_click(evt){
	if (Codex.Trace.gestures) fdjtLog("foot_click %o",evt);
	if (fdjtUI.isClickable(evt)) return;
	else if (Codex.mode) {
	    fdjtUI.cancel(evt);
	    CodexMode(false);
	    return;}}

    function pageinfo_click(evt){
	var pageinfo=fdjtID("CODEXPAGEINFO"); var offx;
	if ((Codex.hudup)||(Codex.mode)) {
	    fdjtUI.cancel(evt);
	    CodexMode(false);
	    return;}
	if (evt.offsetX) {
	    // This is the case where we're passed an actual node
	    //  rather than a real event
	    var tx=fdjtDOM.getGeometry(fdjtUI.T(evt),pageinfo).left;
	    offx=evt.offsetX+tx;}
	else if (evt.pageX) {
	    var geom=fdjtDOM.getGeometry(pageinfo);
	    offx=evt.pageX-geom.left;}
	else if (evt.clientX) {
	    var geom=fdjtDOM.getGeometry(pageinfo);
	    offx=evt.clientX-geom.left;}
	else offx=getOffX(evt);
	var offwidth=pageinfo.offsetWidth;
	var goloc=Math.round((offx/offwidth)*Codex.ends_at);
	if (Codex.Trace.gestures)
	    fdjtLog("pageinfo_click %o off=%o/%o goloc=%o/%o",
		    evt,offx,offwidth,goloc,Codex.ends_at);
	if (!(offx)) return;
	fdjtUI.cancel(evt);
	Codex.GoTo(goloc);
	if ((Codex.mode==="gotoloc")||(Codex.mode==="gotopage"))
	    CodexMode(false);}
    /* This doesn't quite work on the iPad, so we're not currently
       using it. */
    function pageinfo_move(evt){
	var pageinfo=fdjtID("CODEXPAGEINFO"); var offx;
	if (evt.offsetX) {
	    var tx=fdjtDOM.getGeometry(fdjtUI.T(evt),pageinfo).left;
	    offx=evt.offsetX+tx;}
	else offx=getOffX(evt);
	var offwidth=fdjtID("CODEXPAGEINFO").offsetWidth;
	var goloc=Math.floor((offx/offwidth)*Codex.ends_at);
	var page=((Codex.paginate)&&Codex.getPageAt(goloc));
	fdjtUI.cancel(evt);
	fdjtLog("%o type=%o ox=%o ow=%o gl=%o p=%o",
		evt,evt.type,offx,offwidth,goloc,page);
	if ((evt.type==='touchmove')||
	    ((evt.type==='mousemove')&&((evt.button)||(evt.shiftKey)))) {
	    if ((typeof page === 'number')&&(page!==Codex.curpage))
		Codex.GoToPage(page);}}

    /* Rules */

    var nobubble=fdjtUI.nobubble;
    var cancel=fdjtUI.cancel;

    Codex.UI.handlers.mouse=
	{window: {
	    keyup: onkeyup,
	    keydown: onkeydown,
	    keypress: onkeypress,
	    click: edge_click},
	 content: {mouseup: content_tapped},
	 hud: {click: hud_tapped},
	 glossmark: {mouseup: glossmark_tapped},
	 glossbutton: {mouseup: glossbutton_onclick,mousedown: cancel},
	 ".sbookmargin": {click: edge_click},
	 "#CODEXHELP": {click: Codex.dropHUD},
	 "#CODEXFLYLEAF": {click: flyleaf_tap},
	 "#CODEXPAGEINFO": {click: pageinfo_click},
	 "#CODEXPAGENOTEXT": {click: enterPageNum},
	 "#CODEXLOCOFF": {click: enterLocation},
	 "#CODEXSCANNER": {click: scanner_click},
	 "#SBOOKPAGEHEAD": {click: head_click},
	 "#CODEXHEAD": {click: head_click},	 
	 "#SBOOKPAGEFOOT": {click: foot_click},
	 "#HIDESPLASHCHECKSPAN" : {click: function (evt){
	     evt=evt||event;
	     Codex.setConfig('hidesplash',(!(Codex.hidesplash)));
	     Codex.saveConfig(); fdjtUI.cancel(evt);}},
	 "#HIDEHELPBUTTON" : {click: Codex.dropHUD},
	 /* ".hudbutton": {mouseover:hudbutton,mouseout:hudbutton}, */
	 ".hudmodebutton": {click:hudbutton,mouseup:cancel,mousedown:cancel},
	 toc: {mouseover: fdjtUI.CoHi.onmouseover,
	       mouseout: fdjtUI.CoHi.onmouseout}};

    Codex.UI.handlers.webtouch=
	{window: {keyup:onkeyup,keydown:onkeydown,keypress:onkeypress,
		  touchstart: cancel, touchmove: cancel, touchend: cancel},
	 content: {touchstart: content_touchstart,
		   touchmove: content_touchmove,
		   touchend: content_touchend},
	 hud: {touchstart: shared_touchstart,
	       touchmove: hud_touchmove,
	       touchend: hud_touchend},
	 "#SBOOKPAGEHEAD": {
	     touchstart: cancel,
	     touchmove: cancel,
	     touchend: head_click},
	 "#SBOOKPAGEFOOT": {
	     touchstart: cancel,
	     touchmove: cancel,
	     touchend: foot_click},
	 "#CODEXHELP": {touchstart: Codex.dropHUD,
			  touchmove: cancel,
			  touchend: cancel},
	 "#CODEXFLYLEAF": {touchend: flyleaf_tap},
	 "#CODEXPAGEINFO": {touchstart: pageinfo_click,
			    touchmove: cancel,touchend: cancel},
	 "#CODEXPAGENOTEXT": {touchstart: enterPageNum,
			      touchmove: cancel,touchend: cancel},
	 "#CODEXLOCOFF": {touchstart: enterLocation,
			  touchmove: cancel,touchend: cancel},
	 ".hudbutton": {touchstart: dont,touchmove: dont, touchend: dont},
	 "#CODEXTABS": {touchstart: dont,touchmove: dont, touchend: dont},
	 "#HIDESPLASHCHECKSPAN" : {touchstart: function (evt){
	     evt=evt||event;
	     Codex.setConfig('hidesplash',Codex.hidesplash);
	     Codex.saveConfig(); fdjtUI.cancel(evt);},
				   touchmove: cancel,
				   touchend: cancel},
	 "#HIDEHELPBUTTON" : {click: Codex.dropHUD,
			      touchmove: cancel,
			      touchend: cancel},
	 glossmark: {touchend: glossmark_tapped,
		     touchstart: cancel,
		     touchmove: cancel},
	 glossbutton: {touchend: glossbutton_onclick,
		       touchstart: cancel,
		       touchmove: cancel}
	};
    
})();

fdjt_versions.decl("codex",codex_interaction_version);
fdjt_versions.decl("codex/interaction",codex_interaction_version);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/

/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_toc_id="$Id$";
var codex_toc_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements a Javascript/DHTML UI for reading
   large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

/* New NAV hud design
   One big DIV for the whole TOC, use CSS to change what's visible
   General structure:
   div.codextoc.toc0
   div.head (contains section name)
   div.spanbar (contains spanbar)
   div.sub (contains all the subsections names)
   div.codextoc.toc1 (tree for first section)
   div.codextoc.toc1 (tree for second section)
   Controlling display:
   .cur class on current head
   .live class on div.codextoc and parents
*/

/* Building the DIV */

var CodexTOC=
    (function(){
	function sbicon(base){return Codex.graphics+base;}
	function cxicon(base){return Codex.graphics+"codex/"+base;}
	function navicon(kind){
	    if (Codex.touch) {
		switch (kind) {
		case 'right': return cxicon("GoldRightTriangle32.png");
		case 'left': return cxicon("GoldLeftTriangle32.png");
		case 'start': return cxicon("GoldLeftStop32.png");
		case 'end': return cxicon("GoldRightStop32.png");}}
	    else {
		switch (kind) {
		case 'right': return cxicon("GoldRightTriangle24.png");
		case 'left': return cxicon("GoldLeftTriangle24.png");
		case 'start': return cxicon("GoldLeftStop24.png");
		case 'end': return cxicon("GoldRightStop24.png");}}}
	Codex.navicon=navicon;

	function CodexTOC(headinfo,depth,tocspec,prefix,headless){
	    var progressbar=fdjtDOM("HR.progressbar");
	    var head=((headless)?(false):
		      (fdjtDOM("A.sectname",headinfo.title)));
	    var spec=tocspec||"DIV.codextoc";
	    var next_button=
		((head)&&
		 ((headinfo.next)?
		  (fdjtDOM.Image(navicon("right"),false,"next")):
		  (fdjtDOM.Image(navicon("end"),false,"nextstop"))));
	    if ((next_button)&&(headinfo.next))
		next_button.frag=headinfo.next.frag;
	    var back_button=
		((head)&&
		 ((headinfo.prev)?
		  (fdjtDOM.Image(navicon("left"),false,"back")):
		  (fdjtDOM.Image(navicon("start"),false,"backstop"))));
	    if ((back_button)&&(headinfo.prev))
		back_button.frag=headinfo.prev.frag;
	    var toc=fdjtDOM(spec,
			    next_button,back_button,
			    ((head)&&(fdjtDOM("DIV.head",progressbar,head))),
			    generate_spanbar(headinfo),
			    generate_subsections(headinfo));
	    var sub=headinfo.sub;
	    if (!(depth)) depth=0;
	    head.name="SBR"+headinfo.frag;
	    head.frag=headinfo.frag;
	    toc.sbook_start=headinfo.starts_at;
	    toc.sbook_end=headinfo.ends_at;
	    fdjtDOM.addClass(toc,"toc"+depth);
	    toc.id=(prefix||"CODEXTOC4")+headinfo.frag;
	    head.name="SBR"+headinfo.frag;
	    if ((!(sub)) || (!(sub.length))) {
		fdjtDOM.addClass(toc,"codextocleaf");
		return toc;}
	    var i=0; var n=sub.length;
	    while (i<n) {
		toc.appendChild(CodexTOC(sub[i++],depth+1,spec,prefix));}
	    return toc;}
	
	function tocJump(evt,target){
	    if (!(target)) target=fdjtUI.T(evt);
	    while (target) {
		if (target.frag) break;
		else target=target.parentNode;}
	    if (target) {
		var info=Codex.docinfo[target.frag];
		Codex.GoTo(target.frag);
		if ((info.sub)&&(info.sub.length>2))
		    CodexMode("toc");
		else CodexMode("tocscan");
		fdjtUI.cancel(evt);}}
	Codex.tocJump=tocJump;

	function generate_subsections(headinfo) {
	    var sub=headinfo.sub;
	    if ((!(sub)) || (!(sub.length))) return false;
	    var div=fdjtDOM("div.sub");
	    var i=0; var n=sub.length;
	    while (i<n) {
		var subinfo=sub[i];
		var subspan=fdjtDOM("A.sectname",subinfo.title);
		subspan.frag=subinfo.frag;
		subspan.name="SBR"+subinfo.frag;
		fdjtDOM(div,((i>0)&&" \u00b7 "),subspan);
		i++;}
	    return div;}
	
	function generate_spanbar(headinfo){
	    var spanbar=fdjtDOM("div.spanbar.codexslice");
	    var spans=fdjtDOM("div.spans");
	    var start=headinfo.starts_at;
	    var end=headinfo.ends_at;
	    var len=end-start;
	    var subsections=headinfo.sub; var last_info;
	    var sectnum=0; var percent=0;
	    spanbar.starts=start; spanbar.ends=end;
	    if ((!(subsections)) || (subsections.length===0))
		return false;
	    var progress=fdjtDOM("div.progressbox","\u00A0");
	    var range=false; var lastspan=false;
	    fdjtDOM(spanbar,spans);
	    fdjtDOM(spans,range,progress);
	    progress.style.left="0%";
	    if (range) range.style.left="0%";
	    var i=0; while (i<subsections.length) {
		var spaninfo=subsections[i++];
		var subsection=document.getElementById(spaninfo.frag);
		var spanstart; var spanend; var addname=true;
		if ((sectnum===0) && ((spaninfo.starts_at-start)>0)) {
		    /* Add 'fake section' for the precursor of the first actual section */
		    spanstart=start;  spanend=spaninfo.starts_at;
		    spaninfo=headinfo;
		    subsection=document.getElementById(headinfo.frag);
		    i--; sectnum++; addname=false;}
		else {
		    spanstart=spaninfo.starts_at; spanend=spaninfo.ends_at;
		    sectnum++;}
		var span=generate_span
		(sectnum,subsection,spaninfo.title,spanstart,spanend,len,
		 ((addname)&&("SBR"+spaninfo.frag)),start);
		lastspan=span;
		spans.appendChild(span);
		last_info=spaninfo;}
	    if ((end-last_info.ends_at)>0) {
		/* Add 'fake section' for the content after the last
		 * actual section */
		var span=generate_span
		(sectnum,head,headinfo.title,last_info.ends_at,end,len,start);
		spanbar.appendChild(span);}    
	    return spanbar;}
	
	function generate_span(sectnum,subsection,title,spanstart,spanend,len,name,pstart){
	    var spanlen=spanend-spanstart;
	    var anchor=fdjtDOM("A.brick","\u00A0");
	    var span=fdjtDOM("DIV.codexhudspan",anchor);
	    var width=(Math.round(100000000*(spanlen/len))/1000000);
	    var left=(Math.round(100000000*((spanstart-pstart)/len))/1000000);
	    span.style.left=left+"%";
	    span.style.width=width+"%";
	    span.title=(title||"section")+
		" ("+Math.round(left)+"%-"+(Math.round(left+width))+"%)";
	    span.frag=subsection.id;
	    if (name) anchor.name=name;
	    return span;}
	CodexTOC.id="$Id$";
	CodexTOC.version=parseInt("$Revision$".slice(10,-1));

	function updateTOC(prefix,head,cur){
	    if (!(prefix)) prefix="CODEXTOC4";
	    if (cur) {
		// Hide the current head and its (TOC) parents
		var tohide=[];
		var spans=document.getElementsByName("SBR"+cur.frag);
		var base_elt=document.getElementById(prefix+cur.frag);
		fdjtDOM.dropClass(spans,"live");
		while (cur) {
		    var tocelt=document.getElementById(prefix+cur.frag);
		    tohide.push(tocelt);
		    // Get TOC parent
		    cur=cur.head;}
		var n=tohide.length-1;
		// Go backwards (up) to potentially accomodate some redisplayers
		while (n>=0) {fdjtDOM.dropClass(tohide[n--],"live");}
		fdjtDOM.dropClass(base_elt,"cur");}
	    if (!(head)) return;
	    var base_elt=document.getElementById(prefix+head.frag);
	    var toshow=[];
	    while (head) {
		var tocelt=document.getElementById(prefix+head.frag);
		var spans=document.getElementsByName("SBR"+head.frag);
		fdjtDOM.addClass(spans,"live");
		toshow.push(tocelt);
		head=head.head;}
	    var n=toshow.length-1;
	    // Go backwards to accomodate some redisplayers
	    while (n>=0) {fdjtDOM.addClass(toshow[n--],"live");}
	    fdjtDOM.addClass(base_elt,"cur");};
	CodexTOC.update=updateTOC;

	return CodexTOC;})();


fdjt_versions.decl("codex",codex_toc_version);
fdjt_versions.decl("codex/toc",codex_toc_version);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_slices_id="$Id$";
var codex_slices_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements the search component of a 
   Javascript/DHTML UI for reading large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.
   This file assumes that the sbooks.js file has already been loaded.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

var sbook_details_icon="detailsicon16x16.png";
var sbook_outlink_icon="outlink16x16.png";
var sbook_small_remark_icon="remarkballoon16x13.png";
var sbook_delete_icon_touch="redx24x24.png";
var sbook_delete_icon="redx16x16.png";
var sbook_edit_icon_touch="remarkedit32x25.png";
var sbook_edit_icon="remarkedit20x16.png";
var sbook_reply_icon_touch="replyballoons41x24.png";
var sbook_reply_icon="replyballoons26x15.png";

(function () {

    var div_threshold=7;
    var debug_locbars=false;
    var odq="\u201c"; var cdq="\u201d";

    function renderNote(info,query,idprefix,standalone){
	var key=info.qid||info.oid||info.id;
	var target_id=(info.frag)||(info.id);
	var target=((target_id)&&(fdjtID(target_id)));
	var target_info=Codex.docinfo[target_id];
	var head_info=target_info.head;
	var head=((head_info)&&(head_info.elt));
	var refiners=((query) && (query._refiners));
	var score=((query)&&(query[key]));
	var div=
	    fdjtDOM(((info.maker) ? "div.codexnote.gloss" : "div.codexnote"),
		    ((head)&&(makeTOCHead(head))),
		    ((head_info)&&(makeIDHead(target,head_info,true))),
		    ((standalone)&&(makelocbar(target_info))),
		    // (makelocrule(target_info,target_info.head)),
		    ((info.maker)&&(showglossinfo(info)))," ",
		    // Makes it noisy (and probably slow) on the iPad
		    ((standalone)&&(showtocloc(target_info))),
		    ((score)&&(showscore(score))),
		    ((info.note)&&(fdjtDOM("span.note",info.note)))," ",
		    ((info.audience)&&(info.audience.length)&&
		     (info.audience.length<div_threshold)&&
		     (showaudience(info.audience)))," ",
		    ((info.excerpt)&&(showexcerpts(info.excerpt)))," ",
		    ((info.links)&&(showlinks(info.links,"span.link")))," ",
		    ((info.attachments)&&
		     (showlinks(info.attachments,"span.attachments")))," ",
		    ((info.audience)&&(info.audience.length)&&
		     (info.audience.length>=div_threshold)&&
		     (showaudience(info.audience))),
		    (((info.tags)||(info.autotags))&&(showtags(info)))," ");
	if (!(info.tstamp))
	    div.title=Codex.getTitle(target,true);
	// if (info.qid) div.about=info.qid;
	div.about="#"+info.frag;
	// div.setAttribute('about',"#"+info.id);
	if (idprefix) div.id=idprefix+info.id;
	if (info.qid) {
	    div.name=div.qref=info.qid;
	    div.setAttribute("name",info.qid);}
	return div;}
    Codex.renderNote=renderNote;
    
    var prime_thresh=7;
    function getprimetags(info){
	if (info.primetags) return info.primetags;
	var tags=info.tags;
	if (typeof tags==='string') tags=[tags];
	if (tags.length<=prime_thresh) return tags;
	var tagscores=Codex.index.tagweights;
	var prime=[].concat(info.tags);
	prime.sort(function(t1,t2){
	    var s1=tagscores[t1]; var s2=tagscores[t2];
	    if ((s1)&&(s2)) {
		if (s1<s2) return -1;
		else if (s1>s2) return 1;
		else return 0;}
	    else if (s1) return -1;
	    else if (s3) return 1;
	    else return 0;});
	info.primetags=prime.slice(0,prime_thresh);
	return info.primetags;}

    var show_tag_thresh=7;

    var expander_toggle=fdjtUI.Expansion.toggle;
    function tagexpand_click(evt){
	return expander_toggle(evt);}

    function showtags(info){
	var ctags=info.tags, atags=info.autotags, tags, scores;
	if ((typeof ctags === 'string')||(ctags instanceof String))
	    ctags=[ctags];
	if ((atags)&&(!(atags.sorted))) {
	    var weights=Codex.index.tagweights;
	    atags.sort(function(t1,t2){
		var v1=weights[t1], v2=weights[t2];
		if ((v1)&&(v2)) {
		    if (v1<v2) return -1;
		    else if (v1>v2) return 1;
		    else return 0;}
		else if (v1) return 1;
		else return -1;});
	    
	    atags.sorted=true;}
	if (!(atags)) {tags=ctags; scores=tags.scores||false;}
	else if (!(ctags)) {tags=atags; scores=false;}
	else {
	    scores=ctags.scores||false;
	    tags=[].concat(ctags).concat(atags);}
	var tagcount=0;
	var countspan=fdjtDOM("span.count");
	var tagicon=fdjtDOM.Image
	  (cxicon("TagIcon16x16.png"),"img.tagicon","tags");
	var span=fdjtDOM("span.tags.fdjtexpands",tagicon);
	var tagspan=span;
	var controller=false;
	var i=0; var lim=tags.length;
	while (i<tags.length) {
	    var tag=tags[i]; var score=((scores)&&(scores[tag]))||false;
	    if ((typeof tag === 'string')&&(tag.indexOf('@')>=0))
		tag=fdjtKB.ref(tag)||tag;
	    var togo=tags.length-i;
	    if ((!controller)&&((!(score))||(score<=1))&&
		(i>show_tag_thresh)&&(togo>4)) {
		controller=fdjtDOM("span.controller",
				   "all ",tags.length," tags",
				   fdjtDOM("span.whenexpanded","-"),
				   fdjtDOM("span.whencollapsed","+"));
		var subspan=fdjtDOM("span.whenexpanded");
		controller.onclick=tagexpand_click;
		fdjtDOM(span," ",controller," ",subspan);
		tagspan=subspan;}
	    fdjtDOM.append(tagspan,((i>0)?" \u00b7 ":" "),Knodule.HTML(tag));
	    i++;}
	return span;}
    function showaudience(tags){
	if (!(tags instanceof Array)) tags=[tags];
	var span=fdjtDOM(
	    ((tags.length>=div_threshold)?"div.audience":"span.audience"),
	    ((tags.length>=div_threshold)&&
	     (fdjtDOM("span.count",tags.length, " outlets"))));
	var i=0; var lim=tags.length;
	// This might do some kind of more/less controls and sorted
	// or cloudy display
	while (i<tags.length) {
	    var tag=tags[i]; var info=fdjtKB.ref(tag);
	    fdjtDOM.append(span,((i>0)?" \u00b7 ":" "),info.name);
	    i++;}
	return span;}
    function showlinks(refs,spec){
	var span=fdjtDOM(spec);
	for (url in refs) {
	    if (url[0]==='_') continue;
	    var urlinfo=refs[url];
	    var title; var icon=sbicon("outlink16x8.png");
	    if (typeof urlinfo === 'string') title=urlinfo;
	    else {
		title=urlinfo.title;
		icon=urlinfo.icon;}
	    var image=fdjtDOM.Image(icon);
	    var anchor=(fdjtDOM.Anchor(url,{title:url},title,image));
	    anchor.target='_blank';
	    fdjtDOM(span,anchor,"\n");}
	return span;}
    function showexcerpts(excerpts){
	if (typeof excerpts==='string')
	    return fdjtDOM("span.excerpt",odq,excerpts,cdq);
	else {
	    var espan=fdjtDOM("div.excerpts");
	    var i=0; var lim=excerpts.length;
	    while (i<lim)
		fdjtDOM(espan,
			((i>0)&&" "),
			fdjtDOM("span.excerpt",odq,excerpts[i++],cdq));
	    return espan;}}
    function showscore(score){
	var scorespan=fdjtDOM("span.score");
	var score=query[key]; var k=0;
	while (k<score) {fdjtDOM(scorespan,"*"); k++;}
	return scorespan;}
    function showglossinfo(info) {
	var user=info.maker;
	var feed=info.feed||false;
	var userinfo=Codex.sourcekb.map[user];
	var feedinfo=Codex.sourcekb.map[feed];
	var agestring=timestring(info.modified||info.created);
	var age=fdjtDOM("span.age",agestring);
	age.title=(((user===Codex.user)||(user===Codex.user.qid))?
		   ("edit this gloss"):
		   ("relay/reply to this gloss"));
	// This should be made to work
	// age.onclick=relayoredit_gloss;
	var deleteicon=
	    // No delete icons for the ipad right now (too small)
	    ((user===Codex.user.oid)&&
	     (fdjtDOM(
		 "span",
		 (fdjtDOM.Image(sbicon(sbook_delete_icon),
				"img.delete.button.mouseicon","x",
				"delete this gloss")),
	     (fdjtDOM.Image(sbicon(sbook_delete_icon_touch),
			    "img.delete.button.touchicon","x",
			    "delete this gloss")))));
	if (deleteicon) deleteicon.onclick=deletegloss_onclick;
	var editicon=
	    ((user===Codex.user.oid)&&
	     (fdjtDOM(
		 "span",
		 (fdjtDOM.Image(
		     sbicon(sbook_edit_icon),"img.edit.button.mouseicon","!",
		     "edit this gloss")),
		 (fdjtDOM.Image(
		     sbicon(sbook_edit_icon_touch),
		     "img.edit.button.touchicon","!",
		     "edit this gloss")))));
	if (editicon) editicon.onclick=editicon_onclick;
	var replyicon=
	     fdjtDOM(
		 "span",
		 (fdjtDOM.Image(cxicon(sbook_reply_icon),
				"img.reply.button.mouseicon","++",
				"respond to this gloss")),
		 (fdjtDOM.Image(cxicon(sbook_reply_icon_touch),
				"img.reply.button.touchicon","++",
				"respond to this gloss")));
	replyicon.onclick=replyicon_onclick;
	var picinfo=getpicinfo(info);
	var overdoc=getoverdoc(info);
	
	return [(fdjtDOM("span.glossinfo",deleteicon,editicon,replyicon)),
		((picinfo)?
		 (fdjtDOM.Image(picinfo.src,picinfo.classname,picinfo.alt)):
		 (getfakepic(info.maker,"div.sourcepic"))),
		((overdoc)&&(overdoc.name)&&
		 (fdjtDOM("span.overdoc",(overdoc.name)))),
		((overdoc)&&(overdoc.name)&&(" \u00b7 ")),
		(((!(overdoc))&&(userinfo)&&
		  ((userinfo.name)||(userinfo.userid)))&&
		 (fdjtDOM("span.user",((userinfo.name)||(userinfo.userid))))),
		((!(overdoc))&&(userinfo)&&
		 ((userinfo.name)||(userinfo.userid))&&
		 (" \u2014 ")),
		age];}

    function getoverdoc(info){
	if (info.sources) {
	    var sources=info.sources;
	    var i=0; var lim=sources.length;
	    while (i<lim) {
		var source=fdjtKB.ref(sources[i++]);
		if ((source)&&(source.kind===':OVERDOC'))
		    return source;}
	    return false;}
	else return false;}

    function getfakepic(maker,spec){
      var userinfo=fdjtKB.ref(maker);
      var pic=fdjtDOM(spec||"div.sbooksourcepic",
		      fdjtString.getInitials(userinfo.name));
      return pic;}

    function getpicinfo(info){
	if (info.pic) return {src: info.pic,alt: info.pic};
	else if (info.sources) {
	    var sources=info.sources;
	    if (typeof sources==='string') sources=[sources];
	    var i=0; var lim=sources.length;
	    while (i<lim) {
		var source=fdjtKB.ref(sources[i++]);
		if ((source)&&(source.kind===':OVERDOC')&&(source.pic))
		    return { src: source.pic, alt: source.name,
			     classname: "sourcepic"};}}
	if (info.maker) {
	    var userinfo=fdjtKB.ref(info.maker);
	    if (userinfo.pic)
		return { src: userinfo.pic, alt: userinfo.name,
			 classname: "userpic"};
	    else if (userinfo.fbid)
		return {
		    src: "https://graph.facebook.com/"+
			userinfo.fbid+"/picture?type=square",
		    classname: "userpic fbpic"};
	    else return false;}
	else return false;}

    var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    function timestring(tick){
	var now=fdjtTime.tick();
	if ((now-tick)<(12*3600)) {
	    var date=new Date(1000*tick);
	    var hour=date.getHours();
	    var minute=date.getMinutes();
	    return ""+hour+":"+((minute<10)?"0":"")+minute;}
	else {
	    var date=new Date(1000*tick);
	    var year=date.getFullYear();
	    var month=date.getMonth();
	    var date=date.getDate();
	    var shortyear=year%100;
	    if (year<10)
		return ""+date+"/"+months[month]+"/0"+year;
	    else return ""+date+"/"+months[month]+"/"+year;}}

    function makelocbar(target_info,cxt_info){
	var locrule=fdjtDOM("HR");
	var locbar=fdjtDOM("DIV.locbar",locrule);
	var target_start=target_info.starts_at;
	var target_end=target_info.ends_at;
	var target_len=target_end-target_start;
	if (!(cxt_info)) cxt_info=Codex.docinfo[document.body.id];
	var cxt_start=cxt_info.starts_at;
	var cxt_end=cxt_info.ends_at;
	var cxt_len=cxt_end-cxt_start;
	if (debug_locbars)
	    locbar.setAttribute(
		"debug","ts="+target_start+"; te="+target_end+"; cl="+cxt_len);
	locrule.style.width=((target_len/cxt_len)*100)+"%";
	locrule.style.left=(((target_start-cxt_start)/cxt_len)*100)+"%";
	var id=target_info.id||target_info.frag;
	if (id) {
	    locbar.about="#"+id;
	    locbar.title=sumText(fdjtID(id));}
	return locbar;}
    function showtocloc(target_info){
	var head=((target_info.toclevel)?(target_info):(target_info.head));
	var heads=head.heads;
	var anchor=fdjtDOM.Anchor(
	    "javascript:Codex.JumpTo('"+(head.frag||head.id)+"');","a.headref",
	    fdjtDOM("span.spacer","\u00A7"),
	    head.title);
	var title="jump to "+head.title;
	var i=heads.length-1; 
	while (i>0) {
	    var head=heads[i--]; title=title+"// "+head.title;}
	anchor.title=title;
	return [" ",anchor];}

    function makelocspan(target_info,cxtinfo){
	if (!(cxtinfo)) cxtinfo=Codex.docinfo[(Codex.body||document.body).id];
	var locrule=fdjtDOM("div.locrule");
	var cxt_start=cxtinfo.starts_at;
	var cxt_end=cxtinfo.ends_at;
	var cxt_len=cxt_end-cxt_start;
	var location_start=target_info.starts_at-cxt_start;
	var location_len=target_info.ends_at-target_info.starts_at;
	locrule.setAttribute("about","#"+(target_info.id||target_info.frag));
	locrule.title='click or hold to glimpse';
	locrule.style.width=((location_len/cxt_len)*100)+"%";
	locrule.style.left=((location_start/cxt_len)*100)+"%";
	return locrule;}
    function makelocrule(target_info,cxtinfo){
	if (!(cxtinfo)) cxtinfo=Codex.docinfo[(Codex.body||document.body).id];
	var locrule=fdjtDOM("hr.locrule");
	var cxt_start=cxtinfo.starts_at;
	var cxt_end=cxtinfo.ends_at;
	var cxt_len=cxt_end-cxt_start;
	var target_start=target_info.starts_at-cxt_start;
	var target_len=target_info.ends_at-target_info.starts_at;
	var locstring="~"+Math.ceil(target_len/5)+ " words long ~"+
	    Math.ceil((target_start/cxt_len)*100)+"% along";
	locrule.setAttribute("about","#"+(target_info.id||target_info.frag));
	locrule.locstring=locstring+".";
	locrule.title=locstring+": click or hold to glimpse";
	locrule.style.width=((target_len/cxt_len)*100)+"%";
	locrule.style.left=((target_start/cxt_len)*100)+"%";
	return locrule;}

    function deletegloss_onclick(evt){
	var scan=fdjtUI.T(evt);
	fdjtUI.cancel(evt);
	while (scan) {
	    if (scan.qref) break;
	    else scan=scan.parentNode;}
	if (!(scan)) return;
	var qref=scan.qref;
	var frag=Codex.glosses.ref(qref).get("frag");
	if (scan)
	    fdjtAjax.jsonCall(
		function(response){deletegloss(response,qref,frag);},
		"https://"+Codex.server+"/v4/delete",
		"gloss",scan.qref);}
    function deletegloss(response,glossid,frag){
	if (response===glossid) {
	    Codex.glosses.drop(glossid);
	    Codex.allglosses=fdjtKB.remove(Codex.allglosses,glossid);
	    if (Codex.offline)
		fdjtState.setLocal("glosses("+Codex.refuri+")",
				   Codex.allglosses,true);
	    var renderings=fdjtDOM.Array(document.getElementsByName(glossid));
	    if (renderings) {
		var i=0; var lim=renderings.length;
		while (i<lim) fdjtDOM.remove(renderings[i++]);}
	    var glossmark=fdjtID("SBOOK_GLOSSMARK_"+frag);
	    if (glossmark) {
		var newglosses=fdjtKB.remove(glossmark.glosses,glossid);
		if (newglosses.length===0) fdjtDOM.remove(glossmark);
		else glossmark.glosses=newglosses;}}
	else alert(response);}
    
    function editicon_onclick(evt){
	var target=fdjtUI.T(evt);
	var note=fdjtDOM.getParent(target,'.codexnote');
	var gloss=((note)&&(note.name)&&(fdjtKB.ref(note.name)));
	Codex.setGlossTarget(gloss);
	CodexMode("addgloss");}
    function replyicon_onclick(evt){
	var target=fdjtUI.T(evt);
	var note=fdjtDOM.getParent(target,'.codexnote');
	var gloss=((note)&&(note.name)&&(fdjtKB.ref(note.name)));
	Codex.setGlossTarget(gloss);
	CodexMode("addgloss");}

    function relayoredit_gloss(evt){
	var scan=fdjtUI.T(evt);
	fdjtUI.cancel(evt);
	while (scan) {
	    if (scan.qref) break;
	    else scan=scan.parentNode;}
	if (!(scan)) return;
	var qref=scan.qref;
	var gloss=Codex.glosses.ref(qref);
	var frag=gloss.get("frag");
	Codex.setGlossTarget(gloss);
	CodexMode("addgloss");}

    function sourceIcon(info){
	if (info) return info.pic;}
    
    function sbicon(name,suffix) {return Codex.graphics+name+(suffix||"");}
    function cxicon(name,suffix) {
	return Codex.graphics+"codex/"+name+(suffix||"");}

    // Displayings sets of notes organized into threads

    function sortbyloctime(x,y){
	if (x.starts_at<y.starts_at) return -1;
	else if (x.starts_at>y.starts_at) return 1;
	else if (x.ends_at<y.ends_at) return -1;
	else if (x.ends_at>y.ends_at) return 1;
	else if ((x.tstamp)&&(y.tstamp)) {
	    if (x.tstamp<y.tstamp) return -1;
	    else if (x.tstamp>y.tstamp) return 1;
	    else return 0;}
	else if (x.tstamp) return 1;
	else if (y.tstamp) return -1;
	else return 0;}

    function showSlice(results,div,scores,sort){
      var notes=new Array(results.length);
      var i=0; var lim=results.length;
      while (i<lim) {
	var r=results[i];
	if (typeof r === 'string') {
	  var ref=Codex.docinfo[r]||Codex.glosses.ref(r);
	  if (!(ref)) fdjtLog("No resolution for %o",r);
	  notes[i]=ref;}
	else notes[i]=r;
	i++;}
      if (!(sort)) {}
      else if (scores)
	notes.sort(function(n1,n2){
	    var s1=(scores[n1.qid]);
	    var s2=(scores[n2.qid]);
	    if ((s1)&&(s2)) {
	      if (s1>s2) return -1;
	      else if (s2>s1) return 1;}
	    else if (s1) return -1;
	    else if (s2) return 1;
	    if (n1.starts_at<n2.starts_at) return -1;
	    else if (n1.starts_at>n2.starts_at) return 1;
	    else if (n1.ends_at<n2.ends_at) return -1;
	    else if (n1.ends_at>n2.ends_at) return 1;
	    else if ((n1.tstamp)&&(n2.tstamp)) {
	      if (n1.tstamp>n2.tstamp) return -1;
	      else if (n1.tstamp>n2.tstamp) return 1;
	      else return 0;}
	    else if (n1.tstamp) return 1;
	    else if (n2.tstamp) return -1;
	    else return 0;});
      else notes.sort(function(n1,n2){
	  if (n1.starts_at<n2.starts_at) return -1;
	  else if (n1.starts_at>n2.starts_at) return 1;
	  else if (n1.ends_at<n2.ends_at) return -1;
	  else if (n1.ends_at>n2.ends_at) return 1;
	  else if ((n1.tstamp)&&(n2.tstamp)) {
	    if (n1.tstamp>n2.tstamp) return -1;
	    else if (n1.tstamp>n2.tstamp) return 1;
	    else return 0;}
	  else if (n1.tstamp) return 1;
	  else if (n2.tstamp) return -1;
	  else return 0;});
	
      var headelt=false; var threadelt=false;
      var curhead=false; var curinfo=false;
      var i=0; var len=notes.length; while (i<len) {
	var note=notes[i++];
	var frag=note.id||note.frag;
	if (!(frag)) continue;
	var target=fdjtID(frag);
	var docinfo=Codex.docinfo[target.id];
	var headinfo=docinfo.head;
	var head=document.getElementById(headinfo.frag);
	// var tochead=makeTOCHead(head);
	if (curinfo!==docinfo) {
	  if (headinfo!==curhead) {
	    headelt=fdjtDOM("div.codexthread.tocthread"); // ,tochead
	    headelt.frag=headinfo.frag;
	    fdjtDOM.append(div,headelt);
	    curhead=headinfo;}
	  threadelt=fdjtDOM("div.codexthread.idthread");
	  // ,makeIDHead(target,headinfo,true)
	  threadelt.about="#"+frag;
	  threadelt.title=Codex.getTitle(target,true);
	  fdjtDOM.append(headelt,threadelt);
	  curinfo=docinfo;}
	fdjtDOM.append(threadelt,renderNote(note));}
      return div;}
    Codex.UI.showSlice=showSlice;

    function sumText(target){
	var title=Codex.getTitle(target,true);
	if (title.length<40) return title;
	/* title.slice(0,40)+"\u22ef "; */
	else return title;}
    
    function makeTOCHead(target,head){
	if (!(head)) head=Codex.getHead(target);
	var basespan=fdjtDOM("span");
	basespan.title='this location in the structure of the book';
	var title=Codex.getTitle(target,true);
	var info=Codex.docinfo[target.id];
	if (target!==head) {
	    var paratext=
		fdjtDOM.Anchor("javascript:Codex.JumpTo('"+target.id+"');",
			       "a.paratext",
			       fdjtDOM("span.spacer","\u00B6"),
			       sumText(target));
	    paratext.title='(click to jump to this passage) '+title;
	    fdjtDOM(basespan,paratext," ");}
	if (head) {
	    var text=sumText(head);
	    var headtext=
		fdjtDOM.Anchor("javascript:Codex.JumpTo('"+head.id+"');",
			       "a.headtext",
			       fdjtDOM("span.spacer","\u00A7"),
			       text);
	    var curspan=fdjtDOM("span.head",headtext);
	    headtext.title='jump to the section: '+text;
	    fdjtDOM.append(basespan," ",curspan);
	    var heads=Codex.Info(head).heads;
	    if (heads) {
		var j=heads.length-1; while (j>=0) {
		    var hinfo=heads[j--]; var elt=fdjtID(hinfo.frag);
		    if ((!(elt))||(!(hinfo.title))||
			(elt===Codex.root)||(elt===document.body))
			continue;
		    var anchor=
			fdjtDOM.Anchor(
			    "javascript:Codex.JumpTo('"+hinfo.frag+"');",
			    "a.headtext",
			    fdjtDOM("span.spacer","\u00A7"),
			    hinfo.title);
		    var newspan=fdjtDOM("span.head"," ",anchor);
		    anchor.title=
			((hinfo.title)?('jump to the section: '+hinfo.title):
			 "(jump to this section)");
		    if (target===head) fdjtDOM(curspan,newspan);
		    else fdjtDOM(curspan," \u22ef ",newspan);
		    curspan=newspan;}}}
	var locrule=makelocrule(info);
	var tochead=fdjtDOM("div.tochead",locrule,basespan);
	tochead.title=locrule.locstring;
	return tochead;}

    function makeIDHead(target,headinfo,locrule){
	var info=Codex.docinfo[target.id];
	var headinfo=info.head;
	var tochead=fdjtDOM("div.idhead",
			    ((locrule)&&(makelocrule(info,headinfo))),
			    fdjtDOM("span",sumText(target)));
	var title=Codex.getTitle(target,true);
	return tochead;}

    function findTOCref(div,ref,loc) {
	var children=div.childNodes;
	if (!(children)) return false;
	var i=0; var lim=children.length;
	while (i<lim) {
	    var child=children[i++];
	    if (!(child.nodeType===1)) continue;
	    else if (child.tocref===ref) return child;
	    else if (child.starts>loc) return child;
	    else continue;}
	return false;}

    function addToSlice(note,div,query){
	var frag=(note.id||note.frag);
	var eltinfo=Codex.docinfo[frag];
	var about=document.getElementById(frag);
	var headinfo=((eltinfo.toclevel)?(eltinfo):(eltinfo.head));
	var headid=headinfo.frag;
	var head=document.getElementById(headid);
	var starts=note.starts_at;
	var head_starts=headinfo.starts_at;
	var insertion=false; var insdiff=0;
	var headelt=findTOCref(div,headid,head_starts);
	if ((!(headelt))||(headelt.tocref!==headid)) {
	    var insertion=headelt;
	    headelt=fdjtDOM("div.codexthread.tocthread");
	    // ,makeTOCHead(head,head)
	    headelt.tocref=headid; headelt.starts=head_starts;
	    if (insertion) fdjtDOM.insertBefore(insertion,headelt);
	    else fdjtDOM.append(div,headelt);}
	var idelt=((frag===headid)?(headelt):(findTOCref(headelt,frag,starts)));
	if ((!(idelt))||(idelt.tocref!==frag)) {
	    var insertion=idelt;
	    idelt=fdjtDOM("div.codexthread.idthread");
	    // ,makeIDHead(about,headinfo,true)
	    idelt.tocref=frag; idelt.start=starts; idelt.about="#"+frag;
	    idelt.title=Codex.getTitle(about,true);
	    if (insertion) fdjtDOM.insertBefore(insertion,idelt);
	    else fdjtDOM.append(headelt,idelt);}
	var tstamp=note.tstamp; var qid=note.qid;
	var children=headelt.childNodes;
	var ishead=(frag===headid);
	var i=0; var lim=children.length;
	while (i<lim) {
	    var child=children[i++];
	    if (child.nodeType!==1) continue;
	    if ((ishead)&&(fdjtDOM.hasClass(child,"codexthread"))) {
		fdjtDOM.insertBefore(child,renderNote(note));
		return;}
	    // If unrelated, continue
	    if (!((fdjtDOM.hasClass(child,"codexnote"))||
		  (fdjtDOM.hasClass(child,"codexthread"))))
		continue;
	    // If the same thing, replace
	    if (child.qref===qid) {
		fdjtDOM.replace(child,renderNote(note));
		return;}
	    // if you're earlier, insert yourself and return
	    if (tstamp<=child.tstamp) {
		fdjtDOM.insertBefore(child,renderNote(note));
		return;}
	    else continue;}
	fdjtDOM.append(idelt,renderNote(note));}
    Codex.UI.addToSlice=addToSlice;

    Codex.nextSlice=function(start){
	var slice=fdjtDOM.getParent(start,".codexslice");
	var scan=fdjtDOM.forwardElt(start); var ref=false;
	while (scan) {
	    if (((scan.about)||
		 ((scan.getAttribute)&&(scan.getAttribute("about"))))&&
		((fdjtDOM.hasClass(scan,"codexnote"))||
		 (fdjtDOM.hasClass(scan,"passage"))))
		break;
	    else scan=fdjtDOM.forwardElt(scan);}
	if (fdjtDOM.hasParent(scan,slice)) return scan;
	else return false;};
    Codex.prevSlice=function(start){
	var slice=fdjtDOM.getParent(start,".codexslice");
	var scan=fdjtDOM.backwardElt(start); var ref=false;
	while (scan) {
	    if (((scan.about)||
		 ((scan.getAttribute)&&(scan.getAttribute("about"))))&&
		((fdjtDOM.hasClass(scan,"codexnote"))||
		 (fdjtDOM.hasClass(scan,"passage"))))
		break;
	    else scan=fdjtDOM.backwardElt(scan);}
	if (fdjtDOM.hasParent(scan,slice)) return scan;
	else return false;};

    /* Selecting a subset of glosses to display */

    var hasClass=fdjtDOM.hasClass;

    function selectSourcesRecur(thread,sources){
	var empty=true; var children=thread.childNodes;
	var i=0; var lim=children.length;
	while (i<children.length) {
	    var child=children[i++];
	    if (child.nodeType!==1) continue;
	    if (hasClass(child,"codexnote")) {
		var gloss=(child.qref)&&Codex.glosses.map[child.qref];
		if (!(gloss)) fdjtDOM.dropClass(child,"sourced");
		else if ((fdjtKB.contains(sources,gloss.maker))||
			 (fdjtKB.overlaps(sources,gloss.sources))) {
		    fdjtDOM.addClass(child,"sourced");
		    empty=false;}
		else fdjtDOM.dropClass(child,"sourced");}
	    else if (hasClass(child,"codexthread")) {
		if (!(selectSourcesRecur(child,sources)))
		    empty=false;}
	    else {}}
	if (!(empty)) fdjtDOM.addClass(thread,"sourced");
	else fdjtDOM.dropClass(thread,"sourced");
	return empty;}

    function selectSources(results_div,sources){
	if (!(sources)) {
	    fdjtDOM.dropClass(results_div,"sourced");
	    fdjtDOM.dropClass(fdjtDOM.$(".sourced",results_div),"sourced");
	    return;}
	selectSourcesRecur(results_div,sources);
	if (Codex.target) scrollGlosses(Codex.target,results_div);}
    Codex.UI.selectSources=selectSources;

    /* Scrolling slices */

    function scrollGlosses(elt,glosses,top){
	if (!(elt.id)) elt=getFirstID(elt);
	var info=Codex.docinfo[elt.id];
	var targetloc=((info)&&(info.starts_at))||(elt.starts_at);
	if (targetloc) {
	    var scrollto=getFirstElt(glosses,targetloc);
	    if ((scrollto)&&((top)||(!(fdjtDOM.isVisible(scrollto))))) {
		if ((Codex.scrollers)&&(glosses.id)&&
		    (Codex.scrollers[glosses.id])) {
		    var scroller=Codex.scrollers[glosses.id];
		    scroller.scrollToElement(scrollto);}
		else scrollto.scrollIntoView(true);}}}
    Codex.UI.scrollGlosses=scrollGlosses;
    
    function getFirstID(node){
	if (node.id) return node;
	else if (node.childNodes) {
	    var children=node.childNodes;
	    var i=0; var lim=children.length;
	    while (i<lim) {
		var child=children[i++];
		if (child.nodeType===1) {
		    var found=getFirstID(child);
		    if (found) return found;}}
	    return false;}
	else return false;}

    function getFirstElt(glosses,location){
	var children=glosses.childNodes; var last=false;
	var i=0; var lim=children.length;
	while (i<lim) {
	    var child=children[i++];
	    if (child.nodeType!==1) continue;
	    else if (!(child.starts)) continue;
	    else if (child.starts===location)
		return child;
	    else if (child.starts>location) {
		if (last)
		    return getFirstElt(last,location)||last;
		else return last;}
	    else last=child;}
	if (last) getFirstElt(last,location);
	return false;}
    
    function getScrollOffset(elt,inside){
	if (elt.parentNode===inside) {
	    var children=inside.childNodes;
	    var i=0; var lim=children.length; var off=0;
	    while (i<lim) {
		var child=children[i++];
		if (child===elt) return off;
		if (child.offsetHeight) off=off+child.offsetHeight;}
	    return off;}
	else return getScrollOffset(elt,elt.parentNode)+
	    getScrollOffset(elt.parentNode,inside);}

    /* Results handlers */

    function setupSummaryDiv(div){
	Codex.UI.addHandlers(div,'summary');}
    Codex.UI.setupSummaryDiv=setupSummaryDiv;
    
})();

fdjt_versions.decl("codex",codex_slices_version);
fdjt_versions.decl("codex/slices",codex_slices_version);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_social_id="$Id$";
var codex_social_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements a Javascript/DHTML UI for reading
    large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

    Use and redistribution (especially embedding in other
      CC licensed content) is permitted under the terms of the
      Creative Commons "Attribution-NonCommercial" license:

          http://creativecommons.org/licenses/by-nc/3.0/ 

    Other uses may be allowed based on prior agreement with
      beingmeta, inc.  Inquiries can be addressed to:

       licensing@beingmeta.com

   Enjoy!

*/

(function(){

    var sbook_sources=false;
    var sbook_glosses_target=false;
    var sbookGlossesHUD=false;
    var sbookSourceHUD=false;

    // The highlighted glossmark
    var sbook_glossmark=false;
    var sbook_glossmark_qricons=false;

    // The glosses element
    var CodexHUDglosses=false;
    // The user/tribe bar
    var CodexHUDsocial=false;

    /* Social UI components */

    function sbicon(name,suffix) {return Codex.graphics+name+(suffix||"");}
    function cxicon(name,suffix) {
	return Codex.graphics+"codex/"+name+(suffix||"");}
    

    function addSource(info,withgloss){
	if (typeof info === 'string') info=fdjtKB.ref(info);
	var humid=info.humid;
	if (!(info.name)) return;
	if (withgloss) {
	    var icon=fdjtID("SBOOKSOURCEICON"+humid);
	    if (!(icon)) { // Add icon to the sources bar
		var pic=(info.pic)||
		    ((info.fbid)&&
		     ("https://graph.facebook.com/"+info.fbid+
		      "/picture?type=square"));
		var kind=info.kind;
		if (pic) {}
		else if (kind===':CIRCLE')
		    pic=cxicon("sbookscircle50x50.png");
		else if (kind===':OVERDOC')
		    pic=cxicon("sbooksoverdoc50x50.png");
		else {}
		if (pic)
		  icon=fdjtDOM.Image
		    (pic,".button.source",info.name|info.kind,
		     ("click to show/hide glosses from "+info.name));
		else {
		  icon=fdjtDOM("div.button.source",
			       fdjtString.getInitials(info.name));}
		icon.title=info.name;
		icon.oid=info.oid; icon.id="SBOOKSOURCEICON"+humid;
		fdjtDOM(fdjtID("SBOOKSOURCES")," ",icon);}}
	var sharetag=fdjtID("SBOOKSHARETAG"+humid);
	if (!(sharetag)) { // Add entry to the share cloud
	    var completion=fdjtDOM("span.completion.cue.source",info.name);
	    completion.id="SBOOKSHARETAG"+humid;
	    completion.setAttribute("value",info.qid);
	    completion.setAttribute("key",info.name);}
	var sourcetag=fdjtID("SBOOKSOURCETAG"+humid);
	if (!(sourcetag)) { // Add entry to the share cloud
	    var completion=fdjtDOM("span.completion.source",info.name);
	    completion.id="SBOOKSOURCETAG"+humid;
	    completion.setAttribute("value",info.qid);
	    completion.setAttribute("key",info.name);
	    fdjtDOM(fdjtID("CODEXGLOSSCLOUDSOURCES"),completion," ");
	    if (Codex.gloss_cloud)
	      Codex.gloss_cloud.addCompletion(completion);}
	// This is tricky because fdjtID may not work when the full
	//  cloud is not in the DOM for some reason
	var searchtag=
	  fdjtID("CODEXSEARCHSOURCE"+humid)||
	  ((Codex.full_cloud)&&(Codex.full_cloud.getByValue(info.qid)));
	if ((!(searchtag))||(searchtag.length===0)) {
	  // Add entry to the search cloud
	  var completion=fdjtDOM("span.completion.source",info.name);
	  completion.id="CODEXSEARCHSOURCE"+humid;
	  completion.setAttribute("value",info.qid);
	  completion.setAttribute("key",info.name);
	  fdjtDOM(fdjtID("CODEXSEARCHCLOUD"),completion," ");
	  if (Codex.full_cloud)
	    Codex.full_cloud.addCompletion(completion);}
	return info;};
    Codex.UI.addSource=addSource;
    Codex.UI.addGlossSource=function(info){addSource(info,true);};

    function everyone_onclick(evt)
    {
	evt=evt||event||null;
	var target=fdjtDOM.T(evt);
	// var sources=fdjtDOM.getParent(target,".sbooksources");
	// var glosses=fdjtDOM.getParent(target,".sbookglosses");
	var sources=fdjtID("SBOOKSOURCES");
	var glosses=fdjtID("CODEXALLGLOSSES");
	var new_sources=[];
	if ((!(sources))||(!(glosses)))
	    return; /* Warning? */
	if (fdjtDOM.hasClass(target,"selected")) {
	    CodexMode(false);
	    fdjtDOM.cancel(evt);
	    return;}
	var selected=fdjtDOM.$(".selected",sources);
	fdjtLog("Everyone click sources=%o glosses=%o selected=%o/%d",
		sources,glosses,selected,selected.length);
	fdjtDOM.toggleClass(selected,"selected");
	fdjtDOM.addClass(target,"selected");
	Codex.UI.selectSources(glosses,false);
	fdjtDOM.cancel(evt);
    }
    Codex.UI.handlers.everyone_onclick=everyone_onclick;

    function sources_onclick(evt)
    {
	evt=evt||event||null;
	// if (!(Codex.user)) return;
	var target=fdjtDOM.T(evt);
	// var sources=fdjtDOM.getParent(target,".sbooksources");
	// var glosses=fdjtDOM.getParent(target,".sbookglosses");
	var sources=fdjtID("SBOOKSOURCES");
	var glosses=fdjtID("CODEXALLGLOSSES");
	var new_sources=[];
	if ((!(sources))||(!(glosses))||(!(target.oid)))
	    return; /* Warning? */
	if ((evt.shiftKey)||(fdjtDOM.hasClass(target,"selected"))) {
	    fdjtDOM.toggleClass(target,"selected");
	    var selected=fdjtDOM.$(".selected",sources);
	    var i=0; var len=selected.length;
	    while (i<len) {
		var oid=selected[i++].oid;
		if (oid) new_sources.push(oid);}}
	else {
	    var selected=fdjtDOM.$(".selected",sources);
	    var i=0; var len=selected.length;
	    while (i<len) fdjtDOM.dropClass(selected[i++],"selected");
	    fdjtDOM.addClass(target,"selected");
	    new_sources=[target.oid];}
	var everyone=fdjtDOM.$(".everyone",sources)[0];
	if (new_sources.length) {
	    if (everyone) fdjtDOM.dropClass(everyone,"selected");
	    Codex.UI.selectSources(glosses,new_sources);}
	else {
	    if (everyone) fdjtDOM.addClass(everyone,"selected");
	    Codex.UI.selectSources(glosses,false);}
	fdjtDOM.cancel(evt);
    }
    Codex.UI.handlers.sources_onclick=sources_onclick;

    Codex.UI.addGlossmark=function(id){
	var target=fdjtID(id);
	if (!(target)) return false;
	var glossmarkid="SBOOK_GLOSSMARK_"+id;
	if (fdjtID(glossmarkid)) return fdjtID(glossmarkid);
	var imgsrc=(cxicon("sbookspeople32x32.png"));
	var glossmark=fdjtDOM
	("span.codexglossmark",
	 fdjtDOM.Image(imgsrc,"big","comments"),
	 fdjtDOM.Image(sbicon("Asterisk16x16.png"),"tiny","+"));
	glossmark.id=glossmarkid;
	Codex.UI.addHandlers(glossmark,"glossmark");
	if (sbook_glossmark_qricons) {
	    var qrhref="http://"+Codex.server+"/v3/qricon.png?"+
		"URI="+encodeURIComponent(Codex.refuri)+
		((id)?("&FRAG="+id):"")+
		((title) ? ("&TITLE="+encodeURIComponent(title)) : "");
	    var i=0; while (i<tags.length) qrhref=qrhref+"&TAGCUE="+tags[i++];
	    fdjtDOM.prepend(target,fdjtDOM.Image(qrhref,"sbookqricon"));}
	fdjtDOM.addClass(target,"glossed");
	fdjtDOM.prepend(target,glossmark);
	glossmark.glosses=[];
	glossmark.sbookui=true;
	return glossmark;};

    function openGlossmark(target,addmark) {
	var glosses=Codex.glosses.find('frag',target.id);
	var sumdiv=fdjtDOM("div.codexslice.hudpanel");
	if ((!(glosses))||(!(glosses.length)))
	    fdjtDOM.addClass(sumdiv,"noglosses");
	Codex.UI.setupSummaryDiv(sumdiv);
	if (glosses)
	  Codex.UI.showSlice(glosses,sumdiv,false);
	fdjtDOM.replace("CODEXGLOSSES",sumdiv);
	Codex.setTarget(target);
	fdjtDOM.replace("SBOOKINFO",
			Codex.glossBlock(target.id,"div.sbookgloss"));
	CodexMode("glosses");}
    Codex.openGlossmark=openGlossmark;

})();

fdjt_versions.decl("codex",codex_social_version);
fdjt_versions.decl("codex/social",codex_social_version);

/* Emacs local variables
;;;  Local variables: ***
;;;  compile-command: "cd ..; make" ***
;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_search_id="$Id$";
var codex_search_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements the search component of a 
   Javascript/DHTML UI for reading large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.
   This file assumes that the sbooks.js file has already been loaded.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

(function(){
    Codex.full_cloud=false;
    if (!(Codex.empty_cloud)) Codex.empty_cloud=false;
    if (!(Codex.show_refiners)) Codex.show_refiners=25;
    if (!(Codex.search_gotlucky)) Codex.search_gotlucky=7;
    
    function sbicon(name,suffix) {return Codex.graphics+name+(suffix||"");}
    function cxicon(name,suffix) {
	return Codex.graphics+"codex/"+name+(suffix||"");}

    /* Query functions */

    /* Set on main search input */
    // id="CODEXSEARCHINPUT" 
    // completions="CODEXSEARCHCLOUD"

    var Query=KnoduleIndex.Query;

    Codex.getQuery=function(){return Codex.query;}
    
    function setQuery(query){
      if (Codex.Trace.search) fdjtLog("Setting working query to %o",query);
      Codex.query=useQuery(query,fdjtID("CODEXSEARCH"));}

    Codex.setQuery=setQuery;

    function useQuery(query,box_arg){
	var result;
	if (query instanceof Query) result=query;
	else result=Codex.index.Query(query);
	var qstring=result.getString();
	if ((box_arg)&&(typeof box_arg === 'string'))
	    box_arg=document.getElementById(box_arg);
	var box=box_arg||result._box||fdjtID("CODEXSEARCH");
	if ((query.dom)&&(box)&&(box!==query.dom))
	  fdjtDOM.replace(box_arg,query.dom);
	if (qstring===box.getAttribute("qstring")) {
	  fdjtLog("No change in query for %o to %o: %o/%o (%o)",
		  box,result._query,result,result._refiners,qstring);
	  return;}
	if (Codex.Trace.search>1)
	    fdjtLog("Setting query for %o to %o: %o/%o (%o)",
		    box,result._query,result,result._refiners,qstring);
	else if (Codex.Trace.search)
	    fdjtLog("Setting query for %o to %o: %d results/%d refiners (%o)",
		    box,result._query,result._results.length,
		    result._refiners._results.length,qstring);
	var input=fdjtDOM.getChild(box,".searchinput");
	var cloudid=input.getAttribute("completions");
	var resultsid=input.getAttribute("results");
	var qtags=fdjtDOM.getChild(box,".qtags");
	var cloud=((cloudid)&&(fdjtID(cloudid)))||
	    fdjtDOM.getChild(box,".searchcloud");
	var results=((resultsid)&&(fdjtID(resultsid)))||
	    fdjtDOM.getChild(box,".searchresults");
	var resultcount=fdjtDOM.getChild(box,".resultcount");
	var refinecount=fdjtDOM.getChild(box,".refinecount");
	// Update (clear) the input field
	input.value='';
	var elts=result._query; var i=0; var lim=elts.length;
	// Update 'notags' class
	if (elts.length) fdjtDOM.dropClass(box,"notags");
	else fdjtDOM.addClass(box,"notags");
	// Update the query tags
	var newtags=fdjtDOM("span.qtags");
	while (i<lim) {
	    var tag=elts[i];
	    if (typeof tag === 'string') tag=fdjtKB.ref(tag)||tag;
	    if (i>0) fdjtDOM(newtags," \u00B7 ");
	    if (typeof tag === "string")
		fdjtDOM(newtags,fdjtDOM("span.dterm",tag));
	    else if (tag.name)
		fdjtDOM(newtags,tag.name);
	    else fdjtDOM(newtags,tag);
	    i++;}
	if (qtags.id) newtags.id=qtags.id;
	fdjtDOM.replace(qtags,newtags);
	// Update the results display
	if (result._results.length) {
	    resultcount.innerHTML=result._results.length+
		" passage"+((result._results.length===1)?"":"s");
	    fdjtDOM.dropClass(box,"noresults");}
	else {
	    resultcount.innerHTML="no results";
	    fdjtDOM.addClass(box,"noresults");}
	// Update the search cloud
	var n_refiners=
	    ((result._refiners)&&(result._refiners._results.length))||0;
	if (n_refiners) {
	    var completions=Codex.queryCloud(result);
	    refinecount.innerHTML=n_refiners+
		((n_refiners===1)?(" association"):(" associations"));
	    fdjtDOM.dropClass(box,"norefiners");
	    if (cloudid) completions.id=cloudid;
	    if (Codex.Trace.search>1)
		fdjtLog("Setting search cloud for %o to %o",
			box,completions.dom);
	    cloudid=cloud.id;
	    fdjtDOM.replace(cloud,completions.dom);
	    completions.complete("");
	    Codex.UI.updateScroller(completions.dom);}
	else {
	    fdjtDOM.addClass(box,"norefiners");
	    refinecount.innerHTML="no refiners";}
	result._box=box; box.setAttribute(qstring,qstring);
	return result;}
    Codex.useQuery=useQuery;

    function extendQuery(query,elt){
	var elts=[].concat(query._query);
	if (typeof elt === 'string') 
	    elts.push(fdjtKB.ref(elt)||elt);
	else elts.push(elt);
	return useQuery(query.index.Query(elts),query._box);}
    Codex.extendQuery=extendQuery;

    Codex.updateQuery=function(input_elt){
	var q=Knodule.Query.string2query(input_elt.value);
	if ((q)!==(Codex.query._query))
	    Codex.setQuery(q,false);};

    function showSearchResults(){
	fdjtDOM.replace("CODEXSEARCHRESULTS",Codex.query.showResults());
	CodexMode("searchresults");
	fdjtID("CODEXSEARCHINPUT").blur();
	fdjtID("CODEXSEARCHRESULTS").focus();
	Codex.UI.updateScroller(fdjtID("CODEXSEARCHRESULTS"));}
    Codex.showSearchResults=showSearchResults;

    /* Call this to search */

    function startSearch(tag){
	setQuery([tag]);
	CodexMode("searching");}
    Codex.startSearch=startSearch;

    /* Text input handlers */

    var _sbook_searchupdate=false;
    var _sbook_searchupdate_delay=200;
    
    function searchInput_keyup(evt){
	evt=evt||event||null;
	var ch=evt.charCode||evt.keyCode;
	var target=fdjtDOM.T(evt);
	// fdjtLog("Input %o on %o",evt,target);
	// Clear any pending completion calls
	if ((ch===13)||(ch===13)||(ch===59)||(ch===93)) {
	    var qstring=target.value;
	    if (fdjtString.isEmpty(qstring)) showSearchResults();
	    else {
		var completeinfo=queryCloud(Codex.query);
		if (completeinfo.timer) {
		    clearTimeout(completeinfo.timer);
		    completeinfo.timer=false;}
		var completions=completeinfo.complete(qstring);
		if (completions.length) {
		    var value=completeinfo.getValue(completions[0]);
		    Codex.query=extendQuery(Codex.query,value);}}
	    fdjtDOM.cancel(evt);
	    if ((Codex.search_gotlucky) && 
		(Codex.query._results.length>0) &&
		(Codex.query._results.length<=Codex.search_gotlucky))
		showSearchResults();
	    else {
		/* Handle new info */
		var completeinfo=queryCloud(Codex.query);
		completeinfo.complete("");}
	    return false;}
	else if (ch==32) { /* Space */
	    var qstring=target.value;
	    var completeinfo=queryCloud(Codex.query);
	    var completions=completeinfo.complete(qstring);
	    if (completions.prefix!==qstring) {
		target.value=completions.prefix;
		fdjtDOM.cancel(evt);
		return;}}
	else {
	    var completeinfo=queryCloud(Codex.query);
	    completeinfo.docomplete(target);;}}
    Codex.UI.handlers.search_keyup=searchInput_keyup;

    /*
    function searchInput_onkeyup(evt){
	evt=evt||event||null;
	var kc=evt.keyCode;
	if ((kc===8)||(kc===46)) {
	    if (_sbook_searchupdate) {
		clearTimeout(_sbook_searchupdate);
		_sbook_searchupdate=false;}
	    var target=fdjtDOM.T(evt);
	    _sbook_searchupdate=
		setTimeout(function(target){
		    _sbook_searchupdate=false;
		    searchUpdate(target);},
			   _sbook_searchupdate_delay,target);}}
    Codex.UI.handlers.SearchInput_onkeyup=searchInput_onkeyup;
    */

    function searchUpdate(input,cloud){
	if (!(input)) input=fdjtID("CODEXSEARCHINPUT");
	if (!(cloud)) cloud=queryCloud(Codex.query);
	cloud.complete(input.value);}
    Codex.searchUpdate=searchUpdate;

    function searchInput_focus(evt){
	evt=evt||event||null;
	var input=fdjtDOM.T(evt);
	sbook_search_focus=true;
	if ((Codex.mode)&&(Codex.mode==='searchresults'))
	    CodexMode("searching");
	searchUpdate(input);}
    Codex.UI.handlers.search_focus=searchInput_focus;

    function searchInput_blur(evt){
	evt=evt||event||null;
	sbook_search_focus=false;}
    Codex.UI.handlers.search_blur=searchInput_blur;

    function clearSearch(evt){
	var target=fdjtUI.T(evt||event);
	var box=fdjtDOM.getParent(target,".searchbox");
	var input=fdjtDOM.getChild(box,".searchinput");
	setQuery(Codex.empty_query);
	input.focus();}
    Codex.UI.handlers.clearSearch=clearSearch;
    
    Codex.toggleSearch=function(evt){
	evt=evt||event;
	if ((Codex.mode==="searching")||(Codex.mode==="searchresults"))
	    CodexMode(false);
	else {
	    CodexMode("searching");
	    fdjtID("CODEXSEARCHINPUT").focus();}
	fdjtUI.cancel(evt);};
    
    /* Show search results */

    function makelocrule(target_info,cxtinfo_arg,cxtname){
	var cxtinfo=cxtinfo_arg||Codex.docinfo[(Codex.body||document.body).id];
	if (!(cxtname)) {
	    if (cxtinfo_arg) cxtname="into the section";
	    else cxtname="into the book";}
	var locrule=fdjtDOM("hr.locrule");
	var cxt_start=cxtinfo.starts_at;
	var cxt_end=cxtinfo.ends_at;
	var cxt_len=cxt_end-cxt_start;
	var target_start=target_info.starts_at-cxt_start;
	var target_len=target_info.ends_at-target_info.starts_at;
	var locstring="~"+Math.ceil(target_len/5)+ " words long ~"+
	    Math.ceil((target_start/cxt_len)*100)+"% "+cxtname;
	locrule.setAttribute("about","#"+(target_info.id||target_info.frag));
	locrule.locstring=locstring+".";
	locrule.title=locstring+": click or hold to glimpse";
	locrule.style.width=((target_len/cxt_len)*100)+"%";
	locrule.style.left=((target_start/cxt_len)*100)+"%";
	return locrule;}

    function showResults(result){
      if (result._results_div) return result._results_div;
      var results=result._results; var rscores=result._scores;
      var scores={}; var sorted=[];
      var i=0; var lim=results.length;
      var scores=new Array(lim);
      while (i<lim) {
	var r=results[i++];
	var ref=Codex.docinfo[r]||Codex.glosses.map[r]||fdjtKB.ref(r)||r;
	if (!(ref)) continue;
	var frag=ref.frag;
	if (!(frag)) continue;
	sorted.push(ref);
	if (scores[frag]) 
	  scores[frag]=scores[frag]+(rscores[r]||1);
	else {
	  scores[frag]=rscores[r];}
	i++;}
      sorted.sort(function(x,y){
	  var xfrag=x.frag; var yfrag=y.frag;
	  if (xfrag===yfrag) {}
	  else if (scores[x.frag]>scores[yfrag]) return -1;
	  else if (scores[xfrag]<scores[yfrag]) return 1;
	  var xqid=x.qid; var yqid=y.qid;
	  if (rscores[xqid]>rscores[yqid]) return -1;
	  else if (rscores[xqid]<rscores[yqid]) return 1;
	  var xstart=x.starts_at; var ystart=y.starts_at;
	  if (xstart<ystart) return -1;
	  else if (xstart>ystart) return 1;
	  var xend=x.ends_at; var yend=y.ends_at;
	  if (xend<yend) return -1;
	  else if (xend>yend) return 1;
	  else return 0;});
      if (!(result)) result=Codex.query;
      var div=fdjtDOM("div.codexslice.sbookresults");
      Codex.UI.addHandlers(div,'summary');
      Codex.UI.showSlice(result._results,div,rscores);
      result._results_div=div;
      return div;}
    KnoduleIndex.Query.prototype.showResults=
	function(){return showResults(this);};
    
    /* Getting query cloud */

    function queryCloud(query){
	if (query._cloud) return query._cloud;
	else if ((query._query.length)===0) {
	    query._cloud=fullCloud();
	    return query._cloud;}
	else if (!(query._refiners)) {
	    result._cloud=Codex.empty_cloud;
	    return query._cloud;}
	else {
	    var completions=makeCloud(query._refiners._results,query._refiners._freqs);
	    completions.onclick=Cloud_onclick;
	    var n_refiners=query._refiners._results.length;
	    var hide_some=(n_refiners>Codex.show_refiners);
	    if (hide_some) {
		var cues=fdjtDOM.$(".cue",completions);
		if (!((cues)&&(cues.length))) {
		    var compelts=fdjtDOM.$(".completion",completions);
		    var i=0; var lim=((compelts.length<Codex.show_refiners)?
				      (compelts.length):(Codex.show_refiners));
		    while (i<lim) fdjtDOM.addClass(compelts[i++],"cue");}}
	    else fdjtDOM.addClass(completions,"showempty");

	    query._cloud=
		new fdjtUI.Completions(completions,fdjtID("CODEXSEARCHINPUT"));

	    return query._cloud;}}
    Codex.queryCloud=queryCloud;
    KnoduleIndex.Query.prototype.getCloud=function(){return queryCloud(this);};

    function Cloud_onclick(evt){
	evt=evt||event;
	var target=fdjtDOM.T(evt);
	var completion=fdjtDOM.getParent(target,".completion");
	if (completion) {
	    var cinfo=Codex.query._cloud;
	    var value=cinfo.getValue(completion);
	    add_searchtag(value);
	    fdjtDOM.cancel(evt);}
	else if (fdjtDOM.inherits(target,".resultcounts")) {
	    showSearchResults(Codex.query);
	    CodexMode("searchresults");
	    fdjtID("CODEXSEARCHINPUT").blur();
	    fdjtID("CODEXSEARCHRESULTS").focus();
	    fdjtDOM.cancel(evt);}
	else if (fdjtDOM.inherits(target,".refinercounts")) {
	    var completions=fdjtDOM.getParent(target,".completions");
	    fdjtDOM.toggleClass(completions,"showempty");
	    fdjtDOM.cancel(evt);}
	else if (fdjtDOM.inherits(target,".maxcompletemsg")) {
	    var completions=fdjtDOM.getParent(target,".completions");
	    fdjtID("CODEXSEARCHINPUT").focus();
	    fdjtDOM.toggleClass(container,"showall");
	    fdjtDOM.cancel(evt);}
	else {}}
    Codex.UI.handlers.Cloud_onclick=Cloud_onclick;

    function makeCloud(dterms,scores,noscale){
	var sbook_index=Codex.index;
	var start=new Date();
	if (Codex.Trace.clouds)
	    fdjtLog("Making cloud from %d dterms using scores=%o and scores=%o",
		    dterms.length,scores,scores);
	var spans=fdjtDOM("span");  
	var tagicon=fdjtDOM.Image
	  (cxicon("TagSearch50x50.png"),
	   ".cloudtoggle","show/hide all","show all tags");
	tagicon.onclick=showempty_onclick;
	var completions=fdjtDOM("div.completions",tagicon,spans);
	var n_terms=dterms.length;
	var i=0; var max_score=0;
	if (scores) {
	    var i=0; while (i<dterms.length) {
		var score=scores[dterms[i++]];
		if ((score) && (score>max_score)) max_score=score;}}
	var copied=[].concat(dterms);
	var bykey=sbook_index.bykey;
	// We sort the keys by absolute frequency
	copied.sort(function (x,y) {
	    var xlen=((bykey[x])?(bykey[x].length):(0));
	    var ylen=((bykey[y])?(bykey[y].length):(0));
	    if (xlen==ylen)
		if (x>y) return -1;
	    else if (x===y) return 0;
	    else return 1;
	    else if (xlen>ylen) return -1;
	    else return 1;});
	// Then we scale the keys by the ratio of result frequency to
	// absolute frequency
	var nspans=0; var sumscale=0;
	var minscale=false; var maxscale=false;
	var domnodes=[]; var nodescales=[];
 	i=0; while (i<copied.length) {
	    var dterm=copied[i++];
	    var count=((bykey[dterm]) ? (bykey[dterm].length) : (1));
	    var freq=((scores)?(scores[dterm]||1):(1));
	    var score=((scores) ?(scores[dterm]||false) : (false));
	    var title=
		((Codex.noisy_tooltips) ?
		 (dterm+": "+(((score)?("s="+score+"; "):"")+freq+"/"+count+" items")) :
		 (dterm+": "+freq+((freq==1) ? " item" : " items")));
	    var span=KNodeCompletion(dterm,title);
	    domnodes.push(span);
	    if (freq===1) fdjtDOM.addClass(span,"singleton");
	    if ((scores)&&(!(noscale))) {
		var relfreq=
		  ((freq/scores._count)/(count/Codex.docinfo._eltcount));
		var scaling=Math.sqrt(relfreq);
		if ((!(minscale))||(scaling<minscale)) minscale=scaling;
		if ((!(maxscale))||(scaling>maxscale)) maxscale=scaling;
		nodescales.push(scaling);}
	    fdjtDOM(spans,span,"\n");}
	if (nodescales.length) {
	  var j=0; var jlim=domnodes.length;
	  var overscale=100/(maxscale-minscale);
	  while (j<jlim) {
	    var node=domnodes[j];
	    var scale=nodescales[j];
	    node.style.fontSize=(100+((scale-minscale)*overscale))+'%';
	    j++;}}
	var maxmsg=fdjtDOM
	  ("div.maxcompletemsg",
	   "There are a lot ","(",fdjtDOM("span.completioncount","really"),")",
	   " of completions.  ");
	fdjtDOM.prepend(completions,maxmsg);
	var end=new Date();
	if (Codex.Trace.clouds)
	    fdjtLog("Made cloud for %d dterms in %f seconds",
		    dterms.length,(end.getTime()-start.getTime())/1000);

	return completions;}
    Codex.makeCloud=makeCloud;

    function showempty_onclick(evt){
      var target=fdjtUI.T(evt);
      var completions=fdjtDOM.getParent(target,".completions");
      if (completions)
	fdjtDOM.toggleClass(completions,"showempty");}

    function KNodeCompletion(term,title){
	var sbook_index=Codex.index;
	if ((typeof term === "string") && (term[0]==="\u00A7")) {
	    var showname=term;
	    if (showname.length>17) {
		showname=showname.slice(0,17)+"...";
		title=term;}
	    var span=fdjtDOM("span.completion",fdjtDOM("span.sectname",showname));
	    span.key=term; span.value=term; span.anymatch=true;
	    if (title)
		span.title="("+term+": "+sbook_index.freq(term)+" items) "+title;
	    else span.title=term+": "+sbook_index.freq(term)+" items";
	    return span;}
	var dterm=Codex.knodule.probe(term);
	if (!(dterm)) {}
	else if (!(dterm.dterm)) {
	    fdjtLog("Got bogus dterm reference for %s: %o",term,dterm);
	    dterm=false;}
	var term_node=((dterm) ? (dterm.toHTML()) : (fdjtDOM("span.raw",term)));
	if (!(title))
	    if (sbook_index.freq(dterm))
		title=dterm+": "+sbook_index.freq(dterm)+" items";
	else title=false;
	var span=fdjtDOM("span.completion");
	if (dterm) {
	    if (dterm.gloss)
		if (title) span.title=title+": "+dterm.gloss;
	    else span.title=dterm.gloss;
	    else span.title=title;
	    /* Now add variation elements */
	    var variations=[];
	    var i=0; var terms=dterm.getSet('EN');
	    while (i<terms.length) {
		var term=terms[i++];
		if (term===dterm.dterm) continue;
		var vary=fdjtDOM("span.variation",term);
		vary.key=term;
		span.appendChild(vary);
		span.appendChild(document.createTextNode(" "));}
	    span.appendChild(term_node);
	    span.key=dterm.dterm;
	    span.value=((dterm.tagString)?(dterm.tagString()):(dterm.dterm));
	    span.setAttribute("dterm",dterm.dterm);}
	else {
	    // This is helpful for debugging
	    span.key=term; span.value=term;
	    span.appendChild(term_node);
	    if (title) span.title=title;}
	return span;}
    
    function add_searchtag(value){
	Codex.query=Codex.extendQuery(Codex.query,value);}

    function fullCloud(){
	if (Codex.full_cloud) return Codex.full_cloud;
	else {
	    var tagscores=Codex.index.tagScores();
	    var alltags=tagscores._all;
	    var tagfreqs=tagscores._freq;
	    var completions=Codex.makeCloud(alltags,tagfreqs);
	    var cues=fdjtDOM.getChildren(completions,".cue");
	    completions.onclick=Cloud_onclick;
	    Codex.full_cloud=new fdjtUI.Completions(completions);
	    return Codex.full_cloud;}}
    Codex.fullCloud=fullCloud;

    function sizeCloud(completions,container,index){
      if (!(index)) index=Codex.index;
      if (!(container)) container=completions.dom;
      var nodes=fdjtDOM.getChildren(container,".completion");
      var tagscores=index.tagScores();
      var max_score=tagscores._maxscore;
      var alltags=tagscores._all;
      var i=0; var lim=nodes.length;
      while (i<lim) {
	var tagnode=nodes[i++];
	var tag=tagnode.value||completions.getValue(tagnode);
        if (!(tag)) continue;
	if ((typeof tag === "string") && (tag[0]==="\u00A7")) continue;
	var score=tagscores[tag];
	if (score) tagnode.style.fontSize=(100+(100*(score/max_score)))+"%";}}
    Codex.sizeCloud=sizeCloud;

})();


fdjt_versions.decl("codex",codex_search_version);
fdjt_versions.decl("codex/search",codex_search_version);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_glosses_id="$Id: notes.js 5410 2010-07-31 12:28:42Z haase $";
var codex_glosses_version=parseInt("$Revision: 5410 $".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements the search component of a 
   Javascript/DHTML UI for reading large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.
   This file assumes that the sbooks.js file has already been loaded.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

(function () {

    function sbicon(base){return Codex.graphics+base;}

    function getbracketed(input,erase){
	var string=input.value;
	var pos=input.selectionStart;
	var start=pos, end=pos, lim=string.length;
	while (start>=0) {
	    if (string[start]==='[') {
		if ((start>0)&&(string[start-1]==='\\')) {
		    start--; continue;}
		break;}
	    else start--;}
	if (start<0) return false;
	while (end<lim) {
	    if (string[end]===']') break;
	    else if (string[end]==='\\') end=end+2;
	    else end++;}
	if (start===end) return false;
	if (erase)
	    input.value=string.slice(0,start)+string.slice(end+1);
	else {}
	return string.slice(start+1,end);}

    // set the gloss target for a particular passage
    function getGlossForm(arg,response) {
	if (typeof arg === 'string')
	    arg=fdjtID(arg)||Codex.glosses.ref(arg)||false;
	if (!(arg)) return false;
	var gloss=((arg.qid)&&(arg));
	if (!(gloss)) reponse=false;
	else if ((arg.maker)&&(arg.maker!==Codex.user.qid))
	    response=true;
	else {}
	var passage=((gloss)?(fdjtID(gloss.frag)):(arg));
	var formid=((gloss)?
		    ((response)?
		     ("CODEXRESPONDGLOSS_"+gloss.qid):
		     ("CODEXEDITGLOSS_"+gloss.qid)):
		    ("CODEXADDGLOSS_"+passage.id));
	var form=fdjtID(formid);
	var div=((form)&&(form.parentNode));
	if (!(div)) {
	    div=fdjtDOM(((gloss)&&(!(response)))?
			("div.codexglossform.glossedit"):
			("div.codexglossform"));
	    div.innerHTML=sbook_addgloss;
	    fdjtDOM(fdjtID("CODEXGLOSSFORMS"),div);
	    form=fdjtDOM.getChildren(div,"form")[0];
	    form.id=formid;
	    setupGlossForm(form,passage,gloss,response||false);}
	else form=fdjtDOM.getChildren(div,"form")[0];
	// Use any current selection to add as an excerpt
	var sel=window.getSelection();
	if (Codex.selection) {
	    var sel=Codex.selection;
	    var seltext=sel.toString();
	    if (seltext.length) {
		addExcerpt(form,seltext);}}
	return div;}
    Codex.getGlossForm=getGlossForm;
    
    function setupGlossForm(form,passage,gloss,response){
	if (form.getAttribute("sbooksetup")) return;
	form.onsubmit=submitGloss;
	fdjtDOM.getInput(form,"REFURI").value=Codex.refuri;
	fdjtDOM.getInput(form,"USER").value=Codex.user.qid;
	fdjtDOM.getInput(form,"DOCTITLE").value=document.title;
	fdjtDOM.getInput(form,"DOCURI").value=document.location.href;
	fdjtDOM.getInput(form,"FRAG").value=passage.id;
	var noteinput=fdjtDOM.getInput(form,"NOTE");
	if (noteinput) {
	    noteinput.onkeypress=addgloss_keypress;
	    noteinput.onkeydown=addgloss_keydown;
	    if (gloss) noteinput.value=gloss.note||"";
	    else noteinput.value="";}
	if (Codex.syncstamp)
	    fdjtDOM.getInput(form,"SYNC").value=(Codex.syncstamp+1);
	var info=Codex.docinfo[passage.id];
	var loc=fdjtDOM.getInput(form,"LOCATION");
	var loclen=fdjtDOM.getInput(form,"LOCLEN");
	var tagline=fdjtDOM.getInput(form,"TAGLINE");
	var respondsto=fdjtDOM.getInput(form,"RE");
	var thread=fdjtDOM.getInput(form,"THREAD");
	var uuidelt=fdjtDOM.getInput(form,"UUID");
	if (loc) {loc.value=info.starts_at;}
	if (loclen) {loclen.value=info.ends_at-info.starts_at;}
	if ((response)&&(gloss)&&(gloss.thread)) {
	    thread.thread=gloss.thread;
	    respondsto.value=gloss.respondsto||gloss.thread;}
	else {
	    fdjtDOM.remove(respondsto);
	    fdjtDOM.remove(thread);}
	var tagline=getTagline(passage);
	if (tagline) tagline.value=tagline;
	if ((gloss)&&(gloss.tags)) {
	    var tagselt=fdjtDOM.getChild(form,".tags");
	    var tags=gloss.tags;
	    var i=0; var lim=tags.length;
	    while (i<lim) addTag(form,tags[i++]);}
	if ((gloss)&&(gloss.links)) {
	    var links=fdjtDOM.getChild(form,".links");
	    var links=gloss.links;
	    for (url in links) {
		if (url[0]==='_') continue;
		var urlinfo=links[url];
		var title;
		if (typeof urlinfo === 'string') title=urlinfo;
		else title=urlinfo.title;
		addLink(form,url,title);}}
	if ((gloss)&&(gloss.share)) {
	    var tags=gloss.share;
	    if (typeof tags === 'string') tags=[tags];
	    var i=0; var lim=tags.length;
	    while (i<lim) addTag(form,tags[i++],"SHARE");}
	if ((gloss)&&((gloss.qid)||(gloss.uuid)))
	    uuidelt.value=gloss.qid||gloss.uuid;
	else uuidelt.value=fdjtState.getUUID(Codex.nodeid);
	if ((Codex.outlets)||((gloss)&&(gloss.outlets))) {
	    var outlets=Codex.outlets;
	    var current=((gloss)&&(gloss.outlets));
	    if (current) outlets=[].concat(outlets).concat(current);
	    var seen=[];
	    var i=0; var lim=outlets.length;
	    while (i<lim) {
		var outlet=outlets[i++];
		if (fdjtKB.contains(seen,outlet)) continue;
		else addOutlet(
		    form,outlet,
		    ((current)&&(fdjtKB.contains(current,outlet))));}}
	form.setAttribute("sbooksetup","yes");}
    Codex.setupGlossForm=setupGlossForm;

    function getTagline(target){
	var attrib=
	    target.getAttributeNS("tagline","https://sbooks.net/")||
	    target.getAttribute("data-tagline")||
	    target.getAttribute("tagline");
	if (attrib) return attrib;
	var text=fdjtDOM.textify(target);
	if (!(text)) return false;
	text=fdjtString.stdspace(text);
	if (text.length>40) return text.slice(0,40)+"...";
	else return text;}

    /***** Adding outlets ******/
    function addOutlet(form,outlet,checked) {
	var outletspan=fdjtDOM.getChild(form,".outlets");
	if (typeof outlet === 'string') outlet=fdjtKB.ref(outlet);
	var checkbox=fdjtDOM.Checkbox(outlet,outlet.qid);
	var checkspan=fdjtDOM("span.checkspan.outlet",checkbox,
			      outlet.name);
	if (outlet.about) checkspan.title=outlet.about;
	if (checked) {
	    checkbox.checked=true;
	    fdjtDOM.addClass(checkspan,"ischecked");}
	fdjtDOM(outletspan,checkspan," ");}
 
    /***** Adding links ******/
    function addLink(form,url,title) {
	var tagselt=fdjtDOM.getChild(form,'.tags');
	var linkval=((title)?("["+url+" "+title+"]"):(url));
	var img=fdjtDOM.Image(sbicon("outlink16x8.png"));
	var checkbox=fdjtDOM.Checkbox("LINKS",linkval,true);
	var checkspan=fdjtDOM("span.checkspan",checkbox,((title)||url),img);
	checkspan.title=url;
	fdjtDOM(tagselt,checkspan," ");
	return checkspan;}

    /***** Adding excerpts ******/
    function addExcerpt(form,excerpt,id) {
	var tagselt=fdjtDOM.getChild(form,'.tags');
	var value=((id)?("[#"+id+" "+excerpt):(excerpt));
	var checkbox=fdjtDOM.Checkbox("EXCERPT",value,true);
	var checkspan=fdjtDOM("span.checkspan.excerpt",checkbox,
			      "\u201c",
			      ((id)?(fdjtDOM.Anchor("#"+id),excerpt):
			       (excerpt)),
			      "\u201d");
	fdjtDOM(tagselt,checkspan," ");
	return checkspan;}

    /***** Adding tags ******/
    function addTag(form,tag,varname) {
	// fdjtLog("Adding %o to tags for %o",tag,form);
	if (!(tag)) tag=form;
	if (form.tagName!=='FORM')
	    form=fdjtDOM.getParent(form,'form')||form;
	var tagselt=fdjtDOM.getChild(form,'.tags');
	var info; var title=false; var textspec='span.term';
	if (!(varname)) varname='TAGS';
	if ((tag.nodeType)&&(fdjtDOM.hasClass(tag,'completion'))) {
	    if (fdjtDOM.hasClass(tag,'outlet')) {
		varname='OUTLETS'; textspec='span.outlet';}
	    else if (fdjtDOM.hasClass(tag,'source')) {
		varname='SHARE'; textspec='span.source';}
	    else {}
	    if (tag.title) title=tag.title;
	    tag=gloss_cloud.getValue(tag);
	    var input=fdjtDOM.getInput(form,"NOTE");
	    if (input) getbracketed(input,true);}
	var info=
	    ((typeof tag === 'string')&&
	     ((tag.indexOf('|')>0)?
	      (Codex.knodule.handleSubjectEntry(tag)):
	      (fdjtKB.ref(tag)||Codex.knodule.probe(tag))));
	var text=((info)?
		  ((info.toHTML)&&(info.toHTML())||info.name||info.dterm):
		  (tag));
	if (info) {
	    if (info.knodule===Codex.knodule) tag=info.dterm;
	    else tag=info.qid||info.oid||info.dterm||tag;}
	if ((info)&&(info.pool===Codex.sourcekb)) varname='OUTLETS';
	var checkspans=fdjtDOM.getChildren(tagselt,".checkspan");
	var i=0; var lim=checkspans.length;
	while (i<lim) {
	    var cspan=checkspans[i++];
	    if (((cspan.getAttribute("varname"))===varname)&&
		((cspan.getAttribute("tagval"))===tag))
		return cspan;}
	var span=fdjtUI.CheckSpan("span.checkspan",varname,tag,true);
	if (title) span.title=title;
	span.setAttribute("varname",varname);
	span.setAttribute("tagval",tag);
	fdjtDOM.addClass(span,varname.toLowerCase());
	if (typeof text === 'string')
	    fdjtDOM.append(span,fdjtDOM(textspec,text));
	else fdjtDOM.append(span,text);
	fdjtDOM.append(tagselt,span," ");
	return span;}
    
    /***** Setting the gloss target ******/

    // The target can be either a passage or another gloss
    function setGlossTarget(target,form){
	if (!(target)) {
	    var cur=fdjtID("CODEXLIVEGLOSS");
	    if (cur) cur.id=null;
	    Codex.glosstarget=false;
	    return;}
	if (!gloss_cloud) Codex.glossCloud();
	var gloss=false; var form=getGlossForm(target);
	if ((typeof target === 'string')&&(fdjtID(target))) 
	    target=fdjtID(target);
	else if ((typeof target === 'string')&&
		 (Codex.glosses.ref(target))) {
	    gloss=Codex.glosses.ref(target);
	    target=fdjtID(gloss.frag);}
	else if (target.pool===Codex.glosses) {
	    gloss=target; target=fdjtID(gloss.frag);}
	else {}
	var cur=fdjtID("CODEXLIVEGLOSS");
	if (cur) cur.id=null;
	form.id="CODEXLIVEGLOSS";
	var curinput=fdjtID("CODEXGLOSSINPUT");
	if (curinput) curinput.id=null;
	curinput=fdjtDOM.getChild(form,"textarea");
	if (curinput) curinput.id="CODEXGLOSSINPUT";
	var syncelt=fdjtDOM.getInput(form,"SYNC");
	syncelt.value=(Codex.syncstamp+1);
	Codex.glosstarget=target;
	Codex.setTarget(target);
	setCloudCuesFromTarget(gloss_cloud,target);}
    Codex.setGlossTarget=setGlossTarget;

    function setCloudCues(cloud,tags){
      	// Clear any current tagcues from the last gloss
	var cursoft=fdjtDOM.getChildren(cloud.dom,".cue.softcue");
	var i=0; var lim=cursoft.length;
	while (i<lim) {
	    var cur=cursoft[i++];
	    fdjtDOM.dropClass(cur,"cue");
	    fdjtDOM.dropClass(cur,"softcue");}
	// Get the tags on this element as cues
	var newcues=cloud.getByValue(tags);
	var i=0; var lim=newcues.length;
	while (i<lim) {
	    var completion=newcues[i++];
	    if (!(fdjtDOM.hasClass(completion,"cue"))) {
		fdjtDOM.addClass(completion,"cue");
		fdjtDOM.addClass(completion,"softcue");}}}
    function setCloudCuesFromTarget(cloud,target){
	var info=Codex.docinfo[target.id];
	var tags=[].concat(((info)&&(info.tags))||[]);
	var glosses=Codex.glosses.find('frag',target.id);
	var i=0; var lim=glosses.length;
	while (i<lim) {
	    var g=glosses[i++]; var gtags=g.tags;
	    if (gtags) tags=tags.concat(gtags);}
	setCloudCues(cloud,tags);}
    Codex.setCloudCues=setCloudCues;
    Codex.setCloudCuesFromTarget=setCloudCuesFromTarget;
    
    /* Text handling for the gloss text input */

    var addgloss_timer=false;
    
    function bracket_click (evt){
	evt=evt||event;
	var target=fdjtUI.T(evt);
	var form=fdjtDOM.getParent(target,'form');
	var input=fdjtDOM.getInput(form,'NOTE');
	var string=input.value;
	var bracketed=getbracketed(input);
	fdjtUI.cancel(evt);
	if (bracketed)
	    handleBracketed(form,getbracketed(input,true));
	else {
	    var pos=input.selectionStart;
	    input.value=string.slice(0,pos)+"[]"+string.slice(pos);
	    input.selectionStart=input.selectionEnd=pos+1;}}
    Codex.UI.bracket_click=bracket_click;

    function handleBracketed(form,content){
	if (content[0]==='!') {
	    var brk=content.indexOf(' ');
	    if (brk<0) addLink(form,content.slice(1,-1));
	    else {
		addLink(form,content.slice(1,brk),
			content.slice(brk+1));}}
	else if (content.indexOf('|')>=0) addTag(form,content);
	else {
	    var completions=gloss_cloud.complete(content);
	    if (!(completions)) {
		addTag(form,content);
		return;}
	    var i=0; var lim=completions.length;
	    var std=fdjtString.stdspace(content);
	    while (i<lim) {
		var completion=completions[i++];
		if (content===gloss_cloud.getKey(completion)) {
		    addTag(form,completion);
		    return;}}
	    addTag(form,std);}}

    function addgloss_keypress(evt){
	var target=fdjtUI.T(evt);
	var string=target.value;
	var form=fdjtDOM.getParent(target,"FORM");
	var ch=evt.charCode;
	if (addgloss_timer) clearTimeout(addgloss_timer);
	if (ch===91) {
	    var pos=target.selectionStart, lim=string.length;
	    if ((pos>0)&&(string[pos-1]==='\\')) return; 
	    fdjtUI.cancel(evt);
	    target.value=string.slice(0,pos)+"[]"+string.slice(pos);
	    target.selectionStart=target.selectionEnd=pos+1;}
	else if (ch===93) {
	    var pos=target.selectionStart;
	    if ((pos>0)&&(string[pos-1]==='\\')) return; 
	    var content=getbracketed(target,true);
	    if (!(content)) return;
	    fdjtUI.cancel(evt);
	    handleBracketed(form,content);}
	else {
	    var content=getbracketed(target);
	    if ((content)&&(content[0]!=='!'))
		addgloss_timer=setTimeout(function(){
		    var span=getbracketed(target,false);
		    gloss_cloud.complete(span);},100);}}

    function addgloss_keydown(evt){
	evt=evt||event;
	var kc=evt.keyCode;
	var target=fdjtUI.T(evt);
	var form=fdjtDOM.getParent(target,'form');
	if (kc===13) {
	    var bracketed=getbracketed(target);
	    if (bracketed) {
		fdjtUI.cancel(evt);
		handleBracketed(form,getbracketed(target,true));}
	    else if (!(evt.shiftKey)) {
		fdjtUI.cancel(evt);
		submitEvent(target);}}}

    function get_addgloss_callback(form){
      return function(req){
	return addgloss_callback(req,form);}}

    function addgloss_callback(req,form){
	if (Codex.Trace.network)
	  fdjtLog("Got AJAX gloss response %o from %o",req,sbook_mark_uri);
	fdjtDOM.dropClass(form.parentNode,"submitting");
	fdjtKB.Import(JSON.parse(req.responseText));
	clearGlossForm(form);
	Codex.preview_target=false;
	/* Turn off the target lock */
	setGlossTarget(false);
	Codex.setTarget(false);
	CodexMode(false);}

    function clearGlossForm(form){
	// Clear the UUID, and other fields
	var uuid=fdjtDOM.getInput(form,"UUID");
	if (uuid) uuid.value="";
	var note=fdjtDOM.getInput(form,"NOTE");
	if (note) note.value="";
	var taginput=fdjtDOM.getInput(form,"TAG");
	if (taginput) taginput.value="";
	var href=fdjtDOM.getInput(form,"HREF");
	if (href) href.value="";
	var tagselt=fdjtDOM.getChildren(form,"div.tags");
	if ((tagselt)&&(tagselt.length)) {
	    var tags=fdjtDOM.getChildren(tagselt[0],".checkspan");
	    fdjtDOM.remove(fdjtDOM.Array(tags));}}

    /***** The Gloss Cloud *****/

    var gloss_cloud=false;
    
    /* The completions element */
    function glossCloud(){
	if (gloss_cloud) return gloss_cloud;
	var completions=fdjtID("CODEXGLOSSCLOUD");
	completions.onclick=glosscloud_onclick;
	Codex.gloss_cloud=gloss_cloud=new fdjtUI.Completions(
	    completions,fdjtID("SBOOKTAGINPUT"),
	    fdjtUI.FDJT_COMPLETE_OPTIONS|
		fdjtUI.FDJT_COMPLETE_CLOUD|
		fdjtUI.FDJT_COMPLETE_ANYWORD);
	return gloss_cloud;}
    Codex.glossCloud=glossCloud;

    function glosscloud_onclick(evt){
	var target=fdjtUI.T(evt);
	var completion=fdjtDOM.getParent(target,'.completion');
	if (completion) {
	    var live=fdjtID("CODEXLIVEGLOSS");
	    var form=((live)&&(fdjtDOM.getChild(live,"form")));
	    addTag(form,completion);}
	fdjtUI.cancel(evt);}

    /***** Saving (submitting/queueing) glosses *****/

    // Submits a gloss, queueing it if offline.
    function submitGloss(evt){
	evt=evt||event||null;
	var target=fdjtUI.T(evt);
	fdjtDOM.addClass(target.parentNode,"submitting");
	var form=(fdjtUI.T(evt));
	var uuidelt=fdjtDOM.getInput(form,"UUID");
	if (!((uuidelt)&&(uuidelt.value)&&(uuidelt.value.length>5))) {
	    fdjtLog.warn('missing UUID');
	    if (uuidelt) uuidelt.value=fdjtState.getUUID(Codex.nodeid);}
	if (!(Codex.offline))
	    return fdjtAjax.onsubmit(evt,get_addgloss_callback(target));
	if (!(navigator.onLine)) return saveGloss(form,evt);
	// Eventually, we'll unpack the AJAX handler to let it handle
	//  connection failures by calling saveGloss.
	else return fdjtAjax.onsubmit(evt,get_addgloss_callback(target));}
    Codex.submitGloss=submitGloss;

    function submitEvent(arg){
      var form=((arg.nodeType)?(arg):(fdjtUI.T(arg)));
      while (form)
	if (form.tagName==='FORM') break;
	else form=form.parentNode;
      if (!(form)) return;
      var submit_evt = document.createEvent("HTMLEvents");
      submit_evt.initEvent("submit", true, true);
      form.dispatchEvent(submit_evt);
      return;}
    Codex.UI.submitEvent=submitEvent;

    // Queues a gloss when offline
    function saveGloss(form,evt){
	var json=fdjtAjax.formJSON(form,["tags","xrefs"],true);
	var params=fdjtAjax.formParams(form);
	var queued=fdjtState.getLocal("queued("+Codex.refuri+")",true);
	if (!(queued)) queued=[];
	queued.push(json.uuid);
	var glossdata=
	    {refuri: json.refuri,frag: json.frag,
	     maker: json.maker,uuid: json.uuid,
	     qid: json.uuid,gloss: json.uuid};
	glossdata.tstamp=fdjtTime.tick();
	if ((json.note)&&(!(fdjtString.isEmpty(json.note))))
	    glossdata.note=json.note;
	if ((json.excerpt)&&(!(fdjtString.isEmpty(json.excerpt))))
	    glossdata.excerpt=json.excerpt;
	if ((json.details)&&(!(fdjtString.isEmpty(json.details))))
	    glossdata.details=json.details;
	if ((json.tags)&&(json.tags.length>0)) glossdata.tags=json.tags;
	if ((json.xrefs)&&(json.xrefs.length>0)) glossdata.xrefs=json.xrefs;
	Codex.glosses.Import(glossdata);
	fdjtState.setLocal("params("+json.uuid+")",params);
	fdjtState.setLocal("queued("+Codex.refuri+")",queued,true);
	// Clear the UUID
	clearGlossForm(form);
	Codex.preview_target=false;
	if (evt) fdjtUI.cancel(evt);
	fdjtDOM.dropClass(form.parentNode,"submitting");
	/* Turn off the target lock */
	setGlossTarget(false); Codex.setTarget(false); CodexMode(false);}

    // Saves queued glosses
    function writeGlosses(){
	if (!(Codex.offline)) return;
	var queued=fdjtState.getLocal("queued("+Codex.refuri+")",true);
	if ((!(queued))||(queued.length===0)) {
	    fdjtState.dropLocal("queued("+Codex.refuri+")");
	    return;}
	var ajax_uri=fdjtID("SBOOKMARKFORM").getAttribute("ajaxaction");
	var i=0; var lim=queued.length; var pending=[];
	while (i<lim) {
	    var uuid=queued[i++];
	    var params=fdjtState.getLocal("params("+uuid+")");
	    if (params) pending.push(uuid);
	    var req=new XMLHttpRequest();
	    req.open('POST',ajax_uri);
	    req.withCredentials='yes';
	    req.onreadystatechange=function () {
		if ((req.readyState === 4) &&
		    (req.status>=200) && (req.status<300)) {
		    fdjtState.dropLocal("params("+uuid+")");
		    oncallback(req);}};
	    try {
		req.setRequestHeader
		("Content-type", "application/x-www-form-urlencoded");
		req.send(params);}
	    catch (ex) {failed.push(uuid);}}
	if ((pending)&&(pending.length))
	    fdjtState.setLocal("queued("+Codex.refuri+")",pending,true);
	else fdjtState.dropLocal("queued("+Codex.refuri+")");
	if ((pending)&&(pending.length>0)) return pending;
	else return false;}
    Codex.writeGlosses=writeGlosses;
    
    /* Gloss display */

    var objectkey=fdjtKB.objectkey;

    function glossBlock(id,spec,xfeatures,glosses,detail){
	var docinfo=Codex.docinfo[id];
	var all=[].concat(xfeatures||[]);
	var freq={}; var notes={}; var links={};
	if (!(glosses)) glosses=Codex.glosses.find('frag',id);
	// Initialize given features
	var i=0; var lim=all.length;
	while (i<lim) freq[all[i++]]=1;
	// Scan glosses
	var i=0; var lim=glosses.length;
	while (i<lim) {
	    var gloss=glosses[i++]; var glossid;
	    if (typeof gloss === 'string') {
		glossid=gloss; gloss=Codex.glosses.ref(glossid);}
	    else glossid=gloss.qid;
	    var user=gloss.maker;
	    var sources=gloss.audience;
	    var tags=gloss.tags;
	    if ((sources)&&(!(sources instanceof Array))) sources=[sources];
	    if ((tags)&&(!(tags instanceof Array))) tags=[tags];
	    if (freq[user]) freq[user]++;
	    else {freq[user]=1; all.push(user);}
	    if (gloss.note) {
		if (notes[user]) fdjtKB.add(notes,user,glossid,true);
		else notes[user]=[glossid];}
	    if (gloss.link) {
		if (links[user]) fdjtKB.add(links,user,glossid,true);
		else links[user]=[glossid];}
	    if (sources) {
		var j=0; var jlim=sources.length;
		while (j<jlim) {
		    var source=sources[j++];
		    if (freq[source]) freq[source]++;
		    else {freq[source]=1; all.push(source);}
		    if (gloss.note) {
			if (notes[source])
			    fdjtKB.add(notes,source,glossid,true);
			else notes[source]=[glossid];}
		    if (gloss.link) {
			if (links[source])
			    fdjtKB.add(links,source,glossid,true);
			else links[source]=[glossid];}}}
	    if (tags) {
		var j=0; var jlim=tags.length;
		while (j<jlim) {
		    var tag=tags[j++];
		    if (typeof tag === 'object') tag=objectkey(tag);
		    if (freq[tag]) freq[tag]++;
		    else {freq[tag]=1; all.push(tag);}}}}
	var tags=docinfo.tags;
	if ((tags)&&(!(tags instanceof Array))) tags=[tags];
	if (tags) {
	    var i=0; var lim=tags.length;
	    while (i<lim) {
		var tag=tags[i++];
		if (typeof tag === 'object') tag=objectkey(tag);
		if (freq[tag]) freq[tag]++;
		else {freq[tag]=1; all.push(tag);}}}
	var info=fdjtDOM(spec||"div.sbookgloss");
	var i=0; var lim=all.length;
	while (i<lim) {
	    var tag=all[i]; var span=false;
	    var taginfo=fdjtKB.ref(tag);
	    if ((taginfo)&&(taginfo.kind)) {
		var srcspan=fdjtDOM("span.source",taginfo.name||tag);
		srcspan.setAttribute("tag",(((taginfo)&&(taginfo.qid))||tag));
		span=fdjtDOM("span",srcspan);
		if (links[tag]) {
		    var sg=links[tag];
		    var j=0; var jlim=sg.length;
		    while (j<jlim) {
			var icon=fdjtDOM.Image(sbicon("DiagLink16x16.png"));
			var gloss=Codex.glosses.ref(sg[j++]);
			var anchor=fdjtDOM.Anchor(gloss.link,"a",icon);
			anchor.title=gloss.note;
			fdjtDOM(span," ",anchor);}}
		if (notes[tag]) {
		    var sg=notes[tag];
		    var j=0; var jlim=sg.length;
		    var icon=fdjtDOM.Image(cxicon("remarkballoon16x13.png"));
		    while (j<jlim) {
			var gloss=Codex.glosses.ref(sg[j++]);
			icon.title=gloss.note; fdjtDOM(span," ",icon);}}}
	    else {
		span=fdjtDOM("span.dterm",taginfo||tag);
		span.setAttribute("tag",(((taginfo)&&(taginfo.qid))||tag));}
	    fdjtDOM(info,((i>0)&&(" \u00b7 ")),span);
	    i++;}
	info.onclick=sbookgloss_onclick;
	return info;}
    Codex.glossBlock=glossBlock;

    function sbookgloss_onclick(evt){
	var target=fdjtUI.T(evt);
	var parent=false;
	while (target) {
	    if (!(target.getAttribute)) target=target.parentNode;
	    else if (target.getAttribute("gloss")) 
		return Codex.showGloss(target.getAttribute("gloss"));
	    else if (target.getAttribute("tag"))
		return Codex.startSearch(target.getAttribute("tag"));
	    else if (target.getAttribute("source"))
		return Codex.startSearch(target.getAttribute("source"));
	    else target=target.parentNode;}
	fdjtUI.cancel(evt);}

    Codex.setInfoTarget=function(passage){
	var infodiv=Codex.glossBlock(passage.id,"div.sbookgloss")
	fdjtDOM.replace("SBOOKTARGETINFO",infodiv);
	fdjtDOM.adjustToFit(fdjtID("SBOOKFOOTINFO"));}

})();

fdjt_versions.decl("codex",codex_glosses_version);
fdjt_versions.decl("codex/glosses",codex_glosses_version);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

var codex_pagination_id=
  "$Id$";
var codex_pagination_version=parseInt("$Revision$".slice(10,-1));

/* Copyright (C) 2009-2011 beingmeta, inc.
   This file implements a Javascript/DHTML UI for reading
   large structured documents (sBooks).

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use and redistribution (especially embedding in other
   CC licensed content) is permitted under the terms of the
   Creative Commons "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

var CodexPaginate=
  (function(){
    var debug_pagination=false;
    var sbook_paginated=false;
    var sbook_left_px=40;
    var sbook_right_px=40;
    var sbook_widow_limit=3;
    var sbook_orphan_limit=3;
    var sbook_pagesize=-1;
    var sbook_pagemaxoff=-1;
    var sbook_pagescroll=false;
    var sbook_fudge_bottom=false;
	
    var pagebreakbefore=false;
    var pagebreakafter=false;
	
    var pretweak_page_breaks=true;

    var sbook_edge_taps=true;

    var sbook_avoidpagebreak=false;
    var sbook_forcebreakbefore=false;
    var sbook_forcebreakafter=false;
    var sbook_avoidpagefoot=false;
    var sbook_avoidpagehead=false;
    var sbook_pageblock=false;
    var sbook_fullpages=false;

    var isEmpty=fdjtString.isEmpty;
    var getGeometry=fdjtDOM.getGeometry;
    var getStyle=fdjtDOM.getStyle;
    var parsePX=fdjtDOM.parsePX;
    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var nextElt=fdjtDOM.nextElt;
    var forward=fdjtDOM.forward;
	
    var sbook_body=false;
    var page_width=false;
    var page_height=false;
    var page_gap=false;
    var flip_width=false;
	
    var runslice=100; var runwait=100;

    var dropClass=fdjtDOM.dropClass;
    var addClass=fdjtDOM.addClass;

    Codex.pageTop=function(){return sbook_top_px;}
    Codex.pageBottom=function(){return sbook_bottom_px;}
    Codex.pageLeft=function(){return sbook_left_px;}
    Codex.pageRight=function(){return sbook_right_px;}
    Codex.pageSize=function(){return Codex.page.offsetHeight;}

    function readSettings(){
      sbook_avoidpagebreak=
	fdjtDOM.sel(fdjtDOM.getMeta("avoidbreakinside",true));
      sbook_forcebreakbefore=
	fdjtDOM.sel(fdjtDOM.getMeta("forcebreakbefore",true));
      sbook_forcebreakafter=
	fdjtDOM.sel(fdjtDOM.getMeta("forcebreakafter",true));
      sbook_avoidpagefoot=
	fdjtDOM.sel(fdjtDOM.getMeta("avoidbreakafter",true));
      sbook_avoidpagehead=
	fdjtDOM.sel(fdjtDOM.getMeta("avoidbreakbefore",true));
      sbook_fullpages=
	fdjtDOM.sel(fdjtDOM.getMeta("sbookfullpage",true));}
    Paginate.readSettings=readSettings;

    /* Updating the page display */

    function updatePageDisplay(pagenum,location) {
      var npages=Codex.pagecount;
      var pbar=fdjtDOM("div.progressbar#CODEXPROGRESSBAR");
      var book_len=Codex.ends_at;
      pbar.style.left=(100*(pagenum/npages))+"%";
      pbar.style.width=(100/npages)+"%";
      var locoff=fdjtDOM
	("span.locoff#CODEXLOCOFF","L"+Math.floor(location/128));
      var pageno_text=fdjtDOM
	("span#CODEXPAGENOTEXT.pageno",pagenum+1,"/",npages);
      var pageno=fdjtDOM("div#CODEXPAGENO",locoff,pageno_text);
      fdjtDOM.replace("CODEXPAGENO",pageno);
      fdjtDOM.replace("CODEXPROGRESSBAR",pbar);
      locoff.title="click to jump to a particular location";
      fdjtDOM.addListeners
	(locoff,Codex.UI.handlers[Codex.ui]["#CODEXLOCOFF"]);
      pageno_text.title="click to jump to a particular page";
      fdjtDOM.addListeners
	(pageno_text,Codex.UI.handlers[Codex.ui]["#CODEXPAGENOTEXT"]);}

    /* Pagination */

    // Whether the DOM geometry reflects conversion into columns or not
    // (Gecko does, Webkit doesnt)
    var talldom=true;

    function Paginate(callback){
      var start_time=fdjtTime(); var chunks=0;
      var page=Codex.page;
      var pages=Codex.pages;
      var content=Codex.content;
      var booktop=fdjtDOM.getGeometry(content).top;
      var vwidth=fdjtDOM.viewWidth();
      var vheight=fdjtDOM.viewHeight();
      var height=page.offsetHeight;
      var width=page.offsetWidth;
      var gap=vwidth-width;
      var forced=[]; var pagetops=[];
      var debug=Paginate.debug;
      var trace=Codex.Trace.layout;
      var curpage=-1;
      var scan=scanContent(content);
      var geom=getGeometry(scan,content);
      var style=getStyle(scan,content);
      var next=scanContent(scan,style);
      var ngeom=getGeometry(next,content);
      var nstyle=getStyle(next,content);
      var prev=false, pgeom=false, pstyle=false;
      if ((trace)||((!(Codex._setup))&&(Codex.Trace.startup)))
	fdjtLog("Starting page layout");
      var fullpages;
      fdjtDOM.replace("CODEXPAGEPROGRESS",
		      fdjtDOM("span#CODEXPAGEPROGRESS","0"));
      fdjtTime.timeslice
	([initLayout,
	  adjustFullPages,adjustFullPages,
	  adjustFullPages,adjustFullPages,
	  finishFullPages,// scaleFullPages,
	  handleDeclaredBreaks,forceBreaks]);
      /* Here are the parts of the process */
      function scanStep() {
	var top=geom.top; var bottom=geom.top+geom.height;
	var starts_at=((talldom)?(geom.top/height):(geom.left/vwidth));
	var ends_at=((talldom)?(geom.bottom/height):(geom.right/vwidth));
	var startpage=Math.floor(starts_at);
	var endpage=Math.floor(ends_at);
	var nextpage=((ngeom)&&
		      (Math.floor((talldom)?
				  (ngeom.top/height):
				  (ngeom.left/vwidth))));
	var at_top=((talldom)?(((geom.top/height)%1)<0.001):
		    (geom.top<2));
	var break_after=((next)&&(nextpage>endpage));
	if (at_top) {}
	else if (forceBreakBefore(scan,style)) forceBreak(scan,false);
	else if ((avoidBreakInside(scan,style))&&
		 (endpage>startpage)&&(nextpage>startpage))
	  forceBreak(scan,prev);
	else if ((next)&&(forceBreakAfter(scan,style)))
	  forceBreak(next,prev);
	else if ((break_after)&&(avoidBreakAfter(scan,style)))
	  forceBreak(scan,prev);
	else if ((break_after)&&(avoidBreakBefore(next,nstyle)))
	  forceBreak(scan,prev);
	else {}
	var newpage=
	  Math.floor((talldom)?(geom.top/height):(geom.left/vwidth));
	if (newpage!==curpage) {
	  pagetops[newpage]=scan;
	  curpage=newpage;}
	if (debug)
	  scan.setAttribute(
			    "sbookpagedbg",
			    _paginationInfo(scan,style,startpage,endpage,nextpage));
	prev=scan; pgeom=geom; pstyle=style;
	geom=ngeom; style=nstyle;
	if (scan=next) next=scanContent(scan,style);
	else next=null;
	if (next) {
	  ngeom=getGeometry(next,content);
	  nstyle=getStyle(next);}}
      function forceBreaks(){
	var stopblock=fdjtTime()+runslice;
	while ((scan)&&(fdjtTime()<stopblock)) scanStep();
	if (scan) {
	  chunks++;
	  page_progress(curpage);
	  setTimeout(forceBreaks,runwait);}
	else {
	  finishUp(); chunks++;
	  page_progress(true);
	  if (callback) callback();}}
      function initLayout(){
	// Clear forced breaks
	if (Codex.forced_breaks)
	  dropClass(Codex.forced_breaks,"codexpagebreak");
	Codex.forced_breaks=[];
	// Set up the column layout
	content.style.maxWidth=content.style.minWidth=(width-32)+"px";
	content.style.marginLeft=content.style.marginRight="16px";
	pages.style.height=height+"px";
	pages.style[fdjtDOM.columnWidth]=width+"px";
	pages.style[fdjtDOM.columnGap]=(vwidth-width)+"px";
	// Figure out whether column layout is expressed in the DOM
	var content_dim=getGeometry(content,pages);
	Codex.talldom=talldom=(!(content_dim.width>vwidth));
	// Get the fullsized pages
	fullpages=getFullPages();}
      function forceBreak(elt,prev){
	var g=getGeometry(elt,content);
	var oldpage=Math.floor((talldom)?((g.top-booktop)/height):
			       (g.left/vwidth));
	if (hasClass(elt,"codexpagebreak")) return;
	if ((prev)&&((avoidBreakAfter(prev))||(avoidBreakBefore(elt))))
	  addClass(prev,"codexpagebreak");
	else addClass(elt,"codexpagebreak");
	// Some browsers don't recognize columnBreakBefore, so
	// we check that the change actually worked (assuming
	// synchronous DOM updates) and go kludgier if it
	// didn't
	var g=getGeometry(elt,content);
	var newpage=Math.floor((talldom)?((g.top-booktop)/height):
			       (g.left/vwidth));
	if (oldpage===newpage) {
	  // We have to kludge the margin top, and first we
	  // get the geometry without any existing margin
	  elt.style.marginTop='0px';
	  g=getGeometry(elt,content);
	  var top_margin=0;
	  if (talldom) {
	    var pageoff=((oldpage+1)*height)+booktop;
	    top_margin=(pageoff-g.top);
	    if ((trace)&&(typeof trace === 'number')&&(trace>1))
	      fdjtLog("forceBreak/ g=%j height=%o page_height=%o page=%o/%o tm=%o",
		      elt,g,height,newpage,pageoff,top_margin);}
	  else {
	    top_margin=height-(g.top-booktop);
	    if ((trace)&&(typeof trace === 'number')&&(trace>1))
	      fdjtLog("forceBreak/ g=%j height=%o page_height=%o page=%o tm=%o",
		      elt,g,height,newpage,top_margin);}
	  if (top_margin<0) top_margin=0;
	  else top_margin=top_margin%height;
	  elt.style.marginTop=(Math.floor(top_margin))+"px";}
	else if ((trace)&&(typeof trace === 'number')&&(trace>1))
	  fdjtLog("forceBreak g=%j height=%o page_height=%o page=%o",
		  elt,g,height,newpage);
	else {}
	// Update geometries, assuming the DOM is updated synchronously
	if (scan) geom=getGeometry(scan,content);
	if (next) ngeom=getGeometry(next,content);
	if (prev) pgeom=getGeometry(prev,content);
	forced.push(elt);}
      function handleDeclaredBreaks() {
	var breaks=fdjtDOM.getChildren(content,"sbookpagebreak");
	var i=0; var lim=breaks.length;
	while (i<lim) forceBreak(breaks[i++],false);
	if (sbook_forcebreakbefore) {
	  var breaks=fdjtDOM.getChildren(content,sbook_forcebreakbefore);
	  var i=0; var lim=breaks.length;
	  while (i<lim) forceBreak(breaks[i++],false);}}
      function finishUp() {
	var content_dim=getGeometry(content,pages);
	var pagecount=Codex.pagecount=
	  ((content_dim.width>vwidth)?
	   (Math.ceil(content_dim.width/vwidth)):
	   (Math.ceil(content_dim.height/height)));
	pages.style.width=pages.style.maxWidth=
	  pages.style.minWidth=(pagecount*vwidth)+"px";
	Codex.page_width=width;
	Codex.page_gap=page_gap=gap;
	Codex.page_height=height;
	Codex.left_margin=page.offsetLeft;
	Codex.top_margin=page.offsetTop;
	Codex.right_margin=vwidth-(page.offsetLeft+page.offsetWidth);
	Codex.bottom_margin=vheight-(page.offsetTop+page.offsetHeight);
	Codex.vwidth=vwidth;
	Codex.vheight=vheight;
	Codex.flip_width=flip_width=gap+
	  getGeometry(Codex.content).width+
	  parsePX(getStyle(Codex.content).marginLeft)+
	  parsePX(getStyle(Codex.content).marginRight);
	Codex.pagetops=pagetops;
	Codex.forced_breaks=forced;}
      function getFullPages(){
	var pages=
	  fdjtDOM.$(".sbookfullpage,.sbookcover,.sbooktitlepage");
	if (sbook_fullpages)
	  pages=pages.concat(fdjtDOM.$(sbook_fullpages));
	var i=0; var lim=pages.length;
	while (i<lim) {
	  var block=pages[i++];
	  block.style.maxHeight=height+'px';
	  block.style.maxWidth=width+'px';}
	return pages;}
      function adjustFullPages(){
	var i=0; var lim=fullpages.length;
	while (i<lim) {
	  var block=fullpages[i++];
	  if (block.tagName!=='IMG')
	    fdjtDOM.adjustToFit(block,0.1,24);}}
      function finishFullPages(){
	var i=0; var lim=fullpages.length;
	while (i<lim)
	  if (fullpages[i].tagName!=='IMG')
	    fdjtDOM.finishScale(fullpages[i++]);
	  else i++;}
      function scaleFullPages(){
	// Direct scaling doesn't seem to interact well with
	// horizontal scrolling
	// This uses CSS transformation
	var i=0; var lim=fullpages.length;
	while (i<lim) {
	  var block=fullpages[i++];
	  var scaleby=1.0;
	  if (true) {
	    var bwidth=block.offsetWidth;
	    var bheight=block.offsetHeight;
	    scaleby=Math.min(width/bwidth,height/bheight);
	    block.style[fdjtDOM.transform]="scale("+scaleby+")";
	    block.style.transform="scale("+scaleby+")";}}
	Codex.startupMessage("Scaled %d full-size pages",lim);}
      function page_progress(arg){
	var now=fdjtTime();
	if (!(Codex._setup)) {
	  if (typeof arg === 'number')
	    Codex.startupMessage("Laid out %d pages so far",arg);
	  else Codex.startupMessage("Finished page layout");}
	if (!(arg)) {}
	else if (typeof arg === 'number') {
	  fdjtDOM.replace("CODEXPAGEPROGRESS",
			  fdjtDOM("span#CODEXPAGEPROGRESS",arg));
	  if ((trace)&&(typeof trace === 'number')&&(trace>1))
	    fdjtLog("So far, laid out %d pages in %d chunks and %f seconds",
		    arg,chunks,fdjtTime.secs2short((now-start_time)/1000));}
	else if ((trace)||((!(Codex._setup))&&(Codex.Trace.startup)))
	  fdjtLog("Laid out %d pages over %d chunks in %f seconds (rt~%f)",
		  Codex.pagecount,chunks,
		  fdjtTime.secs2short((now-start_time)/1000),
		  fdjtTime.secs2short(chunks*(1/runslice)));
	else {}}}
	
    function clearPagination(){
      /* Reset pageination info */
      var pages=Codex.pages;
      pages.style.height="";
      pages.style[fdjtDOM.columnWidth]="";
      pages.style[fdjtDOM.columnGap]="";}
	
    /* Pagination support functions */

    function forceBreakBefore(elt,style){
      if ((sbook_tocmajor)&&(elt.id)&&
	  ((Codex.docinfo[elt.id]).toclevel)&&
	  (((Codex.docinfo[elt.id]).toclevel)<=sbook_tocmajor))
	return true;
      if (!(elt)) return false;
      if (!(style)) style=getStyle(elt);
      return (style.pageBreakBefore==='always')||
	((sbook_forcebreakbefore)&&(sbook_forcebreakbefore.match(elt)));}

    function forceBreakAfter(elt,style){ 
      if (!(elt)) return false;
      if (!(style)) style=getStyle(elt);
      return (style.pageBreakAfter==='always')||
	((sbook_forcebreakafter)&&(sbook_forcebreakafter.match(elt)));}

    // We explicitly check for these classes because some browsers
    //  which should know better (we're looking at you, Firefox) don't
    //  represent (or handle) page-break 'avoid' values.  Sigh.
    var page_block_classes=
      /(\bfullpage\b)|(\btitlepage\b)|(\bsbookfullpage\b)|(\bsbooktitlepage\b)/;
    function avoidBreakInside(elt,style){
      if (!(elt)) return false;
      if (elt.tagName==='IMG') return true;
      if (!(style)) style=getStyle(elt);
      return (style.pageBreakInside==='avoid')||
	(elt.className.search(page_block_classes)>=0)||
	((sbook_avoidpagebreak)&&(sbook_avoidpagebreak.match(elt)));}

    function avoidBreakBefore(elt,style){
      if (!(elt)) return false;
      if (!(style)) style=getStyle(elt);
      return ((style.pageBreakBefore==='avoid')||
	      ((sbook_avoidpagehead)&&(sbook_avoidpagehead.match(elt))));}

    function avoidBreakAfter(elt,style){
      if (!(elt)) return false;
      if (!(style)) style=getStyle(elt);
      if (style.pageBreakAfter==='avoid') return true;
      else if ((style.pageBreakAfter)&&
	       (style.pageBreakAfter!=="auto"))
	return false;
      else if ((elt.id)&&(Codex.docinfo[elt.id])&&
	       ((Codex.docinfo[elt.id]).toclevel))
	return true;
      else return false;}

    /* Scanning the content */

    var nextfn=fdjtDOM.next;
    function scanContent(start,style,skipchildren){
      var scan=start; var next=null;
      // Get out of the UI
      if (scan.sbookui) while ((scan)&&(scan.sbookui)) scan=scan.parentNode;
      if (avoidBreakInside(scan,((scan===start)?(style):(getStyle(scan))))) {
	while (!(next=nextfn(scan,isContentBlock))) scan=scan.parentNode;}
      else next=forward(scan,isContentBlock);
      if ((next)&&(Paginate.debug)) {
	if (next.id) scan.setAttribute("sbooknextnode",next.id);
	if (scan.id) next.setAttribute("sbookprevnode",scan.id);}
      return next;}
    Codex.scanContent=scanContent;

    var sbook_block_tags=
      {"IMG": true, "HR": true, "P": true, "DIV": true,
       "UL": true,"BLOCKQUOTE":true};

    function isContentBlock(node,style){
      var styleinfo;
      if (node.nodeType===1) {
	if (node.sbookui) return false;
	else if (sbook_block_tags[node.tagName]) return true;
	else if (styleinfo=((style)||getStyle(node))) {
	  if (styleinfo.position!=='static') return false;
	  else if ((styleinfo.display==='block')||
		   (styleinfo.display==='list-item')||
		   (styleinfo.display==='table'))
	    return true;
	  else return false;}
	else if (fdjtDOM.getDisplay(node)==="inline") return false;
	else return true;}
      else return false;}
	
    /* Debugging support */

    function _paginationInfo(elt,style,startpage,endpage,nextpage){
      var info=getGeometry(elt,Codex.content);
      return elt.id+"/t"+(elt.toclevel||0)+
	((forceBreakBefore(elt,style))?"/ph":"")+
	((avoidBreakInside(elt,style))?"/pb":"")+
	((avoidBreakBefore(elt,style))?"/ah":"")+
	((avoidBreakAfter(elt,style))?"/af":"")+
	((fdjtDOM.hasText(elt,style))?"/ht":"")+
	((endpage!==nextpage)?"/af/ba":"")+
	"/sp="+startpage+"/ep="+endpage+"/np="+nextpage+
	" ["+
	info.width+"x"+info.height+"@"+
	info.top+","+info.left+
	"]";}

    /* Movement by pages */

    function getCSSLeft(node,wrapper){
      var scan=node;
      var indent=parsePX(getStyle(scan).marginLeft)||0;
      while ((scan=scan.parentNode)&&(scan!==wrapper)) {
	var style=getStyle(scan);
	indent=indent+parsePX(style.paddingLeft,0)+
	  parsePX(style.borderLeft)+
	  parsePX(style.marginLeft);}
      if (scan===wrapper) {
	var style=getStyle(scan);
	indent=indent+parsePX(style.paddingLeft,0)+
	  parsePX(style.borderLeft,0);}
      return indent;}

    function GoToPage(num,caller,nosave){
      var off;
      if (talldom) off=(num*(flip_width));
      else {
	var top=Codex.pagetops[num];
	var geom=fdjtDOM.getGeometry(top,Codex.content);
	var pageleft=geom.left-getCSSLeft(top,Codex.content);
	off=pageleft;}
      if (Codex.Trace.nav)
	fdjtLog("GoToPage%s %o",((caller)?"/"+caller:""),pageno);
      Codex.pages.style.setProperty
	(fdjtDOM.transform,
	 "translate("+(-off)+"px,0px)",
	 "important");
      var ptop=Codex.pagetops[num];
      while (ptop) {
	if ((ptop.id)&&(Codex.docinfo[ptop.id])) break;
	else ptop=ptop.parentNode;}
      if (ptop) {
	var info=Codex.docinfo[ptop.id];
	updatePageDisplay(num,info.starts_at);}
      Codex.curpage=num;
      if (false) /* (!(nosave)) to fix */
	Codex.setState
	  ({page: pageno,location: info.loc,
	      target:((Codex.target)&&(Codex.target.id))});}
    Codex.GoToPage=GoToPage;
	
    function getPage(elt){
      if (typeof elt === 'string') elt=fdjtID(elt);
      if (!(elt)) return 0;
      var vwidth=fdjtDOM.viewWidth();
      var content_dim=fdjtDOM.getGeometry(Codex.content,Codex.pages);
      var geom=fdjtDOM.getGeometry(elt,Codex.content);
      var boxheight=Codex.page.offsetHeight;
      return ((content_dim.width>vwidth)?
	      (Math.floor(geom.left/vwidth)):
	      (Math.floor(geom.top/Codex.page_height)))
	return elt.offsetTop/boxheight;}
    Codex.getPage=getPage;
	
    function getPageAt(loc){
      var elt=Codex.resolveLocation(loc);
      return getPage(elt);}
    Codex.getPageAt=getPageAt;
	
    function displaySync(){
      if (Codex.pagecount)
	Codex.GoToPage(Codex.curpage,"displaySync");}
    Codex.displaySync=displaySync;

    /* External refs */
    Paginate.forceBreakBefore=forceBreakBefore;
    Paginate.avoidBreakInside=avoidBreakInside;
    Paginate.forceBreakAfter=forceBreakAfter;
    Paginate.avoidBreakAfter=avoidBreakAfter;
    Paginate.avoidBreakBefore=avoidBreakBefore;
    Paginate.isContentBlock=isContentBlock;
    Paginate.scanContent=scanContent;
    Paginate.debug=debug_pagination;
	
    /* Updates */
	
    /* Top level functions */
	
    function repaginate(){
      var newinfo={};
      dropClass(document.body,"codexscrollview");
      addClass(document.body,"codexpageview");
      addClass(Codex.page,"codexpaginating");
      clearPagination();
      Paginate(function(){
	  newinfo.offheight=document.body.offsetHeight;
	  newinfo.offwidth=document.body.offsetWidth;
	  newinfo.winwidth=(document.documentElement.clientWidth);
	  newinfo.winheight=(fdjtDOM.viewHeight());
	  sbook_paginated=newinfo;
	  Codex.paginated=newinfo;
	  dropClass(Codex.page,"codexpaginating");
	  var gotopage=Codex.getPageAt(Codex.location);
	  Codex.GoToPage(gotopage||0,"repaginate",true);
	  if (Codex.pagewait) {
	    var fn=Codex.pagewait;
	    Codex.pagewait=false;
	    fn();}});}
	
    var repaginating=false;
    Codex.repaginate=function(){
      if (repaginating) return;
      repaginating=setTimeout(function(){
	  repaginate();
	  repaginating=false;},
	100);};
	
    Paginate.onresize=function(evt){
      Codex.repaginate();};

    Codex.addConfig
      ("pageview",
       function(name,val){
	if (val) {
	  if (!(Codex.docinfo)) {
	    // If there isn't any docinfo (during startup, for
	    // instance), don't bother actually paginating.
	    Codex.paginate=true;}
	  else if (!(Codex.paginate)) {
	    Codex.paginate=true;
	    if (Codex.postconfig)
	      Codex.postconfig.push(repaginate);
	    else repaginate();}}
	else {
	  clearPagination();
	  Codex.paginate=false;
	  dropClass(document.body,"codexpageview");
	  addClass(document.body,"codexscrollview");}});

    function updateLayout(name,val){
      fdjtDOM.swapClass
	(Codex.page,new RegExp("codex"+name+"\w*"),"codex"+name+val);
      if (Codex.paginated) {
	if (Codex.postconfig) {
	  Codex.postconfig.push(function(){
	      CodexMode(true);repaginate();});}
	else {
	  CodexMode(true);repaginate();}}}
    Codex.addConfig("bodysize",updateLayout);
    Codex.addConfig("bodystyle",updateLayout);
	
    // fdjtDOM.trace_adjust=true;

    return Paginate;})();

fdjt_versions.decl("codex",codex_pagination_version);
fdjt_versions.decl("codex/pagination",codex_pagination_version);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  End: ***
*/
/**
 * 
 * Find more about the scrolling function at
 * http://cubiq.org/iscroll
 *
 * Copyright (c) 2010 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 3.6 - Last updated: 2010.08.24
 * 
 */

(function(){
function iScroll (el, options) {
	var that = this, i;
	that.element = typeof el == 'object' ? el : document.getElementById(el);
	that.wrapper = that.element.parentNode;

	that.element.style.webkitTransitionProperty = '-webkit-transform';
	that.element.style.webkitTransitionTimingFunction = 'cubic-bezier(0,0,0.25,1)';
	that.element.style.webkitTransitionDuration = '0';
	that.element.style.webkitTransform = translateOpen + '0,0' + translateClose;

	// Default options
	that.options = {
		bounce: has3d,
		momentum: has3d,
		checkDOMChanges: true,
		topOnDOMChanges: false,
		hScrollbar: has3d,
		vScrollbar: has3d,
		fadeScrollbar: isIphone || isIpad || !isTouch,
		shrinkScrollbar: isIphone || isIpad || !isTouch,
		desktopCompatibility: false,
		overflow: 'hidden',
		snap: false
	};
	
	// User defined options
	if (typeof options == 'object') {
		for (i in options) {
			that.options[i] = options[i];
		}
	}

	if (that.options.desktopCompatibility) {
		that.options.overflow = 'hidden';
	}
	
	that.wrapper.style.overflow = that.options.overflow;
	
	that.refresh();

	window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', that, false);

	if (isTouch || that.options.desktopCompatibility) {
		that.element.addEventListener(START_EVENT, that, false);
		that.element.addEventListener(MOVE_EVENT, that, false);
		that.element.addEventListener(END_EVENT, that, false);
	}
	
	if (that.options.checkDOMChanges) {
		that.element.addEventListener('DOMSubtreeModified', that, false);
	}
}

iScroll.prototype = {
	x: 0,
	y: 0,
	enabled: true,

	handleEvent: function (e) {
		var that = this;

		switch (e.type) {
			case START_EVENT:
				that.touchStart(e);
				break;
			case MOVE_EVENT:
				that.touchMove(e);
				break;
			case END_EVENT:
				that.touchEnd(e);
				break;
			case 'webkitTransitionEnd':
				that.transitionEnd();
				break;
			case 'orientationchange':
			case 'resize':
				that.refresh();
				break;
			case 'DOMSubtreeModified':
				that.onDOMModified(e);
				break;
		}
	},
	
	onDOMModified: function (e) {
		var that = this;

		// (Hopefully) execute onDOMModified only once
		if (e.target.parentNode != that.element) {
			return;
		}

		setTimeout(function () { that.refresh(); }, 0);

		if (that.options.topOnDOMChanges && (that.x!=0 || that.y!=0)) {
			that.scrollTo(0,0,'0');
		}
	},

	refresh: function () {
		var that = this,
			resetX = this.x, resetY = this.y,
			snap;
		
		that.scrollWidth = that.wrapper.clientWidth;
		that.scrollHeight = that.wrapper.clientHeight;
		that.scrollerWidth = that.element.offsetWidth;
		that.scrollerHeight = that.element.offsetHeight;
		that.maxScrollX = that.scrollWidth - that.scrollerWidth;
		that.maxScrollY = that.scrollHeight - that.scrollerHeight;
		that.directionX = 0;
		that.directionY = 0;

		if (that.scrollX) {
			if (that.maxScrollX >= 0) {
				resetX = 0;
			} else if (that.x < that.maxScrollX) {
				resetX = that.maxScrollX;
			}
		}
		if (that.scrollY) {
			if (that.maxScrollY >= 0) {
				resetY = 0;
			} else if (that.y < that.maxScrollY) {
				resetY = that.maxScrollY;
			}
		}
		// Snap
		if (that.options.snap) {
			that.maxPageX = -Math.floor(that.maxScrollX/that.scrollWidth);
			that.maxPageY = -Math.floor(that.maxScrollY/that.scrollHeight);

			snap = that.snap(resetX, resetY);
			resetX = snap.x;
			resetY = snap.y;
		}

		if (resetX!=that.x || resetY!=that.y) {
			that.setTransitionTime('0');
			that.setPosition(resetX, resetY, true);
		}
		
		that.scrollX = that.scrollerWidth > that.scrollWidth;
		that.scrollY = !that.scrollX || that.scrollerHeight > that.scrollHeight;

		// Update horizontal scrollbar
		if (that.options.hScrollbar && that.scrollX) {
			that.scrollBarX = that.scrollBarX || new scrollbar('horizontal', that.wrapper, that.options.fadeScrollbar, that.options.shrinkScrollbar);
			that.scrollBarX.init(that.scrollWidth, that.scrollerWidth);
		} else if (that.scrollBarX) {
			that.scrollBarX = that.scrollBarX.remove();
		}

		// Update vertical scrollbar
		if (that.options.vScrollbar && that.scrollY && that.scrollerHeight > that.scrollHeight) {
			that.scrollBarY = that.scrollBarY || new scrollbar('vertical', that.wrapper, that.options.fadeScrollbar, that.options.shrinkScrollbar);
			that.scrollBarY.init(that.scrollHeight, that.scrollerHeight);
		} else if (that.scrollBarY) {
			that.scrollBarY = that.scrollBarY.remove();
		}
	},

	setPosition: function (x, y, hideScrollBars) {
		var that = this;
		
		that.x = x;
		that.y = y;

		that.element.style.webkitTransform = translateOpen + that.x + 'px,' + that.y + 'px' + translateClose;

		// Move the scrollbars
		if (!hideScrollBars) {
			if (that.scrollBarX) {
				that.scrollBarX.setPosition(that.x);
			}
			if (that.scrollBarY) {
				that.scrollBarY.setPosition(that.y);
			}
		}
	},
	
	setTransitionTime: function(time) {
		var that = this;
		
		time = time || '0';
		that.element.style.webkitTransitionDuration = time;
		
		if (that.scrollBarX) {
			that.scrollBarX.bar.style.webkitTransitionDuration = time;
			that.scrollBarX.wrapper.style.webkitTransitionDuration = has3d && that.options.fadeScrollbar ? '300ms' : '0';
		}
		if (that.scrollBarY) {
			that.scrollBarY.bar.style.webkitTransitionDuration = time;
			that.scrollBarY.wrapper.style.webkitTransitionDuration = has3d && that.options.fadeScrollbar ? '300ms' : '0';
		}
	},
		
	touchStart: function(e) {
		var that = this,
			matrix;

		e.preventDefault();
		e.stopPropagation();
		
		if (!that.enabled) {
			return;
		}

		that.scrolling = true;		// This is probably not needed, but may be useful if iScroll is used in conjuction with other frameworks

		that.scrolled = false;
		that.moved = false;
	        that.motion=0;
		that.dist = 0;

		that.setTransitionTime('0');

		// Check if the scroller is really where it should be
		if (that.options.momentum || that.options.snap) {
			matrix = new WebKitCSSMatrix(window.getComputedStyle(that.element).webkitTransform);
			if (matrix.e != that.x || matrix.f != that.y) {
				document.removeEventListener('webkitTransitionEnd', that, false);
				that.setPosition(matrix.e, matrix.f);
				that.moved = true;
			}
		}

		that.touchStartX = isTouch ? e.changedTouches[0].pageX : e.pageX;
		that.scrollStartX = that.x;

		that.touchStartY = isTouch ? e.changedTouches[0].pageY : e.pageY;
		that.scrollStartY = that.y;

		that.scrollStartTime = e.timeStamp;

		that.directionX = 0;
		that.directionY = 0;
	},
	
	touchMove: function(e) {
		var that = this,
			pageX = isTouch ? e.changedTouches[0].pageX : e.pageX,
			pageY = isTouch ? e.changedTouches[0].pageY : e.pageY,
			leftDelta = that.scrollX ? pageX - that.touchStartX : 0,
			topDelta = that.scrollY ? pageY - that.touchStartY : 0,
			newX = that.x + leftDelta,
			newY = that.y + topDelta;

		if (!that.scrolling) {
			return;
		}

		//e.preventDefault();
		e.stopPropagation();	// Stopping propagation just saves some cpu cycles (I presume)

		that.touchStartX = pageX;
		that.touchStartY = pageY;
	        that.motion=+((leftDelta<0)?(-leftDelta):(leftDelta));
	        that.motion=+((topDelta<0)?(-topDelta):(topDelta));

		// Slow down if outside of the boundaries
		if (newX >= 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? Math.round(that.x + leftDelta / 3) : (newX >= 0 || that.maxScrollX>=0) ? 0 : that.maxScrollX;
		}
		if (newY >= 0 || newY < that.maxScrollY) { 
			newY = that.options.bounce ? Math.round(that.y + topDelta / 3) : (newY >= 0 || that.maxScrollY>=0) ? 0 : that.maxScrollY;
		}

		if (that.dist > 5) {			// 5 pixels threshold is needed on Android, but also on iPhone looks more natural
			that.setPosition(newX, newY);
			that.moved = true;
			that.directionX = leftDelta > 0 ? -1 : 1;
			that.directionY = topDelta > 0 ? -1 : 1;
		} else {
			that.dist+= Math.abs(leftDelta) + Math.abs(topDelta);
		}
	},
	
	touchEnd: function(e) {
		var that = this,
			time = e.timeStamp - that.scrollStartTime,
			point = isTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX, momentumY,
			newDuration = 0,
			newPositionX = that.x, newPositionY = that.y,
			snap;

		if (!that.scrolling) {
			return;
		}
		that.scrolling = false;

		if (!that.moved) {
			that.resetPosition();

			if (isTouch) {
				// Find the last touched element
				target = point.target;
				while (target.nodeType != 1) {
					target = target.parentNode;
				}

				// Create the fake event
				target.style.pointerEvents = 'auto';
				ev = document.createEvent('MouseEvents');
				ev.initMouseEvent('click', true, true, e.view, 1,
					point.screenX, point.screenY, point.clientX, point.clientY,
					e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
					0, null);
				ev._fake = true;
				target.dispatchEvent(ev);
			}

			return;
		}

		if (!that.options.snap && time > 250) {			// Prevent slingshot effect
			that.resetPosition();
			return;
		}

		if (that.options.momentum) {
			momentumX = that.scrollX === true
				? that.momentum(that.x - that.scrollStartX,
								time,
								that.options.bounce ? -that.x + that.scrollWidth/5 : -that.x,
								that.options.bounce ? that.x + that.scrollerWidth - that.scrollWidth + that.scrollWidth/5 : that.x + that.scrollerWidth - that.scrollWidth)
				: { dist: 0, time: 0 };

			momentumY = that.scrollY === true
				? that.momentum(that.y - that.scrollStartY,
								time,
								that.options.bounce ? -that.y + that.scrollHeight/5 : -that.y,
								that.options.bounce ? (that.maxScrollY < 0 ? that.y + that.scrollerHeight - that.scrollHeight : 0) + that.scrollHeight/5 : that.y + that.scrollerHeight - that.scrollHeight)
				: { dist: 0, time: 0 };

			newDuration = Math.max(Math.max(momentumX.time, momentumY.time), 1);		// The minimum animation length must be 1ms
			newPositionX = that.x + momentumX.dist;
			newPositionY = that.y + momentumY.dist;
		}

		if (that.options.snap) {
			snap = that.snap(newPositionX, newPositionY);
			newPositionX = snap.x;
			newPositionY = snap.y;
			newDuration = Math.max(snap.time, newDuration);
		}

		that.scrollTo(newPositionX, newPositionY, newDuration + 'ms');
	},

	transitionEnd: function () {
		var that = this;
		document.removeEventListener('webkitTransitionEnd', that, false);
		that.resetPosition();
	},

	resetPosition: function () {
		var that = this,
			resetX = that.x,
		 	resetY = that.y;

		if (that.x >= 0) {
			resetX = 0;
		} else if (that.x < that.maxScrollX) {
			resetX = that.maxScrollX;
		}

		if (that.y >= 0 || that.maxScrollY > 0) {
			resetY = 0;
		} else if (that.y < that.maxScrollY) {
			resetY = that.maxScrollY;
		}
		
		if (resetX != that.x || resetY != that.y) {
			that.scrollTo(resetX, resetY);
		} else {
			if (that.moved) {
				that.onScrollEnd();		// Execute custom code on scroll end
			        that.scrolled=that.moved;
				that.moved = false;
			}

			// Hide the scrollbars
			if (that.scrollBarX) {
				that.scrollBarX.hide();
			}
			if (that.scrollBarY) {
				that.scrollBarY.hide();
			}
		}
	},
	
	snap: function (x, y) {
		var that = this, time;

		if (that.directionX > 0) {
			x = Math.floor(x/that.scrollWidth);
		} else if (that.directionX < 0) {
			x = Math.ceil(x/that.scrollWidth);
		} else {
			x = Math.round(x/that.scrollWidth);
		}
		that.pageX = -x;
		x = x * that.scrollWidth;
		if (x > 0) {
			x = that.pageX = 0;
		} else if (x < that.maxScrollX) {
			that.pageX = that.maxPageX;
			x = that.maxScrollX;
		}

		if (that.directionY > 0) {
			y = Math.floor(y/that.scrollHeight);
		} else if (that.directionY < 0) {
			y = Math.ceil(y/that.scrollHeight);
		} else {
			y = Math.round(y/that.scrollHeight);
		}
		that.pageY = -y;
		y = y * that.scrollHeight;
		if (y > 0) {
			y = that.pageY = 0;
		} else if (y < that.maxScrollY) {
			that.pageY = that.maxPageY;
			y = that.maxScrollY;
		}

		// Snap with constant speed (proportional duration)
		time = Math.round(Math.max(
				Math.abs(that.x - x) / that.scrollWidth * 500,
				Math.abs(that.y - y) / that.scrollHeight * 500
			));
			
		return { x: x, y: y, time: time };
	},

	scrollTo: function (destX, destY, runtime) {
		var that = this;

		if (that.x == destX && that.y == destY) {
			that.resetPosition();
			return;
		}

		that.moved = true;
		that.setTransitionTime(runtime || '350ms');
		that.setPosition(destX, destY);

		if (runtime==='0' || runtime=='0s' || runtime=='0ms') {
			that.resetPosition();
		} else {
			document.addEventListener('webkitTransitionEnd', that, false);	// At the end of the transition check if we are still inside of the boundaries
		}
	},
	
	scrollToPage: function (pageX, pageY, runtime) {
		var that = this, snap;

		if (!that.options.snap) {
			that.pageX = -Math.round(that.x / that.scrollWidth);
			that.pageY = -Math.round(that.y / that.scrollHeight);
		}

		if (pageX == 'next') {
			pageX = ++that.pageX;
		} else if (pageX == 'prev') {
			pageX = --that.pageX;
		}

		if (pageY == 'next') {
			pageY = ++that.pageY;
		} else if (pageY == 'prev') {
			pageY = --that.pageY;
		}

		pageX = -pageX*that.scrollWidth;
		pageY = -pageY*that.scrollHeight;

		snap = that.snap(pageX, pageY);
		pageX = snap.x;
		pageY = snap.y;

		that.scrollTo(pageX, pageY, runtime || '500ms');
	},

	scrollToElement: function (el, runtime) {
		el = typeof el == 'object' ? el : this.element.querySelector(el);

		if (!el) {
			return;
		}

		var that = this,
			x = that.scrollX ? -el.offsetLeft : 0,
			y = that.scrollY ? -el.offsetTop : 0;

		if (x >= 0) {
			x = 0;
		} else if (x < that.maxScrollX) {
			x = that.maxScrollX;
		}

		if (y >= 0) {
			y = 0;
		} else if (y < that.maxScrollY) {
			y = that.maxScrollY;
		}

		that.scrollTo(x, y, runtime);
	},

	momentum: function (dist, time, maxDistUpper, maxDistLower) {
		var friction = 2.5,
			deceleration = 1.2,
			speed = Math.abs(dist) / time * 1000,
			newDist = speed * speed / friction / 1000,
			newTime = 0;

		// Proportinally reduce speed if we are outside of the boundaries 
		if (dist > 0 && newDist > maxDistUpper) {
			speed = speed * maxDistUpper / newDist / friction;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			speed = speed * maxDistLower / newDist / friction;
			newDist = maxDistLower;
		}
		
		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: Math.round(newDist), time: Math.round(newTime) };
	},
	
	onScrollEnd: function () {},
	
	destroy: function (full) {
		var that = this;

		window.removeEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', that, false);		
		that.element.removeEventListener(START_EVENT, that, false);
		that.element.removeEventListener(MOVE_EVENT, that, false);
		that.element.removeEventListener(END_EVENT, that, false);
		document.removeEventListener('webkitTransitionEnd', that, false);

		if (that.options.checkDOMChanges) {
			that.element.removeEventListener('DOMSubtreeModified', that, false);
		}

		if (that.scrollBarX) {
			that.scrollBarX = that.scrollBarX.remove();
		}

		if (that.scrollBarY) {
			that.scrollBarY = that.scrollBarY.remove();
		}
		
		if (full) {
			that.wrapper.parentNode.removeChild(that.wrapper);
		}
		
		return null;
	}
};

function scrollbar (dir, wrapper, fade, shrink) {
	var that = this, style;
	
	that.dir = dir;
	that.fade = fade;
	that.shrink = shrink;
	that.uid = ++uid;

	// Create main scrollbar
	that.bar = document.createElement('div');

	style = 'position:absolute;top:0;left:0;-webkit-transition-timing-function:cubic-bezier(0,0,0.25,1);pointer-events:none;-webkit-transition-duration:0;-webkit-transition-delay:0;-webkit-transition-property:-webkit-transform;z-index:10;background:rgba(0,0,0,0.5);' +
		'-webkit-transform:' + translateOpen + '0,0' + translateClose + ';' +
		(dir == 'horizontal' ? '-webkit-border-radius:3px 2px;min-width:6px;min-height:5px' : '-webkit-border-radius:2px 3px;min-width:5px;min-height:6px');

	that.bar.setAttribute('style', style);

	// Create scrollbar wrapper
	that.wrapper = document.createElement('div');
	style = '-webkit-mask:-webkit-canvas(scrollbar' + that.uid + that.dir + ');position:absolute;z-index:10;pointer-events:none;overflow:hidden;opacity:0;-webkit-transition-duration:' + (fade ? '300ms' : '0') + ';-webkit-transition-delay:0;-webkit-transition-property:opacity;' +
		(that.dir == 'horizontal' ? 'bottom:2px;left:2px;right:7px;height:5px' : 'top:2px;right:2px;bottom:7px;width:5px;');
	that.wrapper.setAttribute('style', style);

	// Add scrollbar to the DOM
	that.wrapper.appendChild(that.bar);
	wrapper.appendChild(that.wrapper);
}

scrollbar.prototype = {
	init: function (scroll, size) {
		var that = this,
			ctx;

		// Create scrollbar mask
		if (that.dir == 'horizontal') {
			if (that.maxSize != that.wrapper.offsetWidth) {
				that.maxSize = that.wrapper.offsetWidth;
				ctx = document.getCSSCanvasContext("2d", "scrollbar" + that.uid + that.dir, that.maxSize, 5);
				ctx.fillStyle = "rgb(0,0,0)";
				ctx.beginPath();
				ctx.arc(2.5, 2.5, 2.5, Math.PI/2, -Math.PI/2, false);
				ctx.lineTo(that.maxSize-2.5, 0);
				ctx.arc(that.maxSize-2.5, 2.5, 2.5, -Math.PI/2, Math.PI/2, false);
				ctx.closePath();
				ctx.fill();
			}
		} else {
			if (that.maxSize != that.wrapper.offsetHeight) {
				that.maxSize = that.wrapper.offsetHeight;
				ctx = document.getCSSCanvasContext("2d", "scrollbar" + that.uid + that.dir, 5, that.maxSize);
				ctx.fillStyle = "rgb(0,0,0)";
				ctx.beginPath();
				ctx.arc(2.5, 2.5, 2.5, Math.PI, 0, false);
				ctx.lineTo(5, that.maxSize-2.5);
				ctx.arc(2.5, that.maxSize-2.5, 2.5, 0, Math.PI, false);
				ctx.closePath();
				ctx.fill();
			}
		}

		that.size = Math.max(Math.round(that.maxSize * that.maxSize / size), 6);
		that.maxScroll = that.maxSize - that.size;
		that.toWrapperProp = that.maxScroll / (scroll - size);
		that.bar.style[that.dir == 'horizontal' ? 'width' : 'height'] = that.size + 'px';
	},
	
	setPosition: function (pos) {
		var that = this;
		
		if (that.wrapper.style.opacity != '1') {
			that.show();
		}

		pos = Math.round(that.toWrapperProp * pos);

		if (pos < 0) {
			pos = that.shrink ? pos + pos*3 : 0;
			if (that.size + pos < 7) {
				pos = -that.size + 6;
			}
		} else if (pos > that.maxScroll) {
			pos = that.shrink ? pos + (pos-that.maxScroll)*3 : that.maxScroll;
			if (that.size + that.maxScroll - pos < 7) {
				pos = that.size + that.maxScroll - 6;
			}
		}

		pos = that.dir == 'horizontal'
			? translateOpen + pos + 'px,0' + translateClose
			: translateOpen + '0,' + pos + 'px' + translateClose;

		that.bar.style.webkitTransform = pos;
	},

	show: function () {
		if (has3d) {
			this.wrapper.style.webkitTransitionDelay = '0';
		}
		this.wrapper.style.opacity = '1';
	},

	hide: function () {
		if (has3d) {
			this.wrapper.style.webkitTransitionDelay = '350ms';
		}
		this.wrapper.style.opacity = '0';
	},
	
	remove: function () {
		this.wrapper.parentNode.removeChild(this.wrapper);
		return null;
	}
};

// Is translate3d compatible?
var has3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
	// Device sniffing
	isIphone = (/iphone/gi).test(navigator.appVersion),
	isIpad = (/ipad/gi).test(navigator.appVersion),
	isAndroid = (/android/gi).test(navigator.appVersion),
	isTouch = isIphone || isIpad || isAndroid,
	// Event sniffing
	START_EVENT = isTouch ? 'touchstart' : 'mousedown',
	MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
	END_EVENT = isTouch ? 'touchend' : 'mouseup',
	// Translate3d helper
	translateOpen = 'translate' + (has3d ? '3d(' : '('),
	translateClose = has3d ? ',0)' : ')',
	// Unique ID
	uid = 0;

// Expose iScroll to the world
window.iScroll = iScroll;
})();if ((typeof sbook_suppressed === "undefined")||(sbook_suppressed))
    window.onload=sbookStartup;


var sbook_searchbox="<div class='toolbox'> \
  <div class='input'> \
    <input id=\"CODEXSEARCHINPUT\" \
	   type=\"TEXT\" class=\"autoprompt searchinput\" \
	   name=\"QTEXT\" value=\"\" isempty=\"yes\" autocomplete=\"off\" \
	   onfocus=\"Codex.UI.handlers.search_focus(event);\" \
	   onblur=\"Codex.UI.handlers.search_blur(event);\" \
	   onkeyup=\"Codex.UI.handlers.search_keyup(event);\" \
	   completeopts=\"anywhere cloud\" enterchars=\";\" maxcomplete=\"45\" \
	   completions=\"CODEXSEARCHCLOUD\" \
	   results=\"CODEXSEARCHRESULTS\"/> \
  </div> \
  <div class=\"tags\"> \
    <img class=\"clearsearch\" alt=\"X\" title=\"clear search\" \
	 src=\"http://static.beingmeta.com/graphics/redx16x16.png\" \
	 onclick=\"Codex.UI.handlers.clearSearch(event); fdjtUI.cancel(event); return false;\"/> \
    <span id=\"CODEXSEARCHTAGS\" class=\"qtags\"></span> \
  </div> \
  <div class=\"resultinfo\"> \
    <div class=\"noresults\">No results</div> \
    <div class=\"noquery\">Add tags to refine query</div> \
    <span class=\"resultcount\" onclick=\"Codex.showSearchResults();\"></span> \
    <span class=\"sep vbar\">|</span> \
    <span class=\"refinecount\" onclick=\"CodexMode('searching');\"></span> \
  </div> \
</div> \
<div class='scrollbox'> \
  <div id=\"CODEXSEARCHCLOUD\" class=\"completions searchcloud\"> \
    <img class=\"label\" alt=\"tags\" \
	 src=\"http://static.beingmeta.com/graphics/codex/TagIcon32x32.png\" \
	 onclick=\"fdjtDOM.toggleClass(fdjtID('CODEXSEARCHCLOUD'),'showempty');\"/> \
    <span class=\"count\">no query refinements</span> \
    <div id=\"CODEXSEARCHSOURCES\"></div> \
    <div id=\"CODEXSEARCHTAGS\"></div> \
    <div id=\"CODEXSEARCHCLOUDSOURCES\"></div> \
  </div> \
  <div id=\"CODEXSEARCHRESULTS\" class=\"codexslice\"></div> \
</div> \
<!-- \
     /* Emacs local variables \
     ;;;  Local variables: *** \
     ;;;  compile-command: \"cd ..; make\" *** \
     ;;;  End: *** \
     */ \
    --> \
 \
";

var sbook_addgloss="<form action=\"https://gloss.sbooks.net/v4/glosspoint\" \
      ajaxaction=\"https://gloss.sbooks.net/v4/addgloss\" \
      target=\"addgloss\"> \
  <div class=\"hidden\"> \
    <input type=\"HIDDEN\" name=\"FRAG\"/> \
    <input type=\"HIDDEN\" name=\"REFURI\"/> \
    <input type=\"HIDDEN\" name=\"DOCURI\"/> \
    <input type=\"HIDDEN\" name=\"SYNC\"/> \
    <input type=\"HIDDEN\" name=\"USER\"/> \
    <input type=\"HIDDEN\" name=\"UUID\"/> \
    <input type=\"HIDDEN\" name=\"TAGLINE\"/> \
    <input type=\"HIDDEN\" name=\"LOCATION\"/> \
    <input type=\"HIDDEN\" name=\"LOCLEN\"/> \
    <input type=\"HIDDEN\" name=\"DOCTITLE\"/> \
    <input type=\"HIDDEN\" name=\"THREAD\"/> \
    <input type=\"HIDDEN\" name=\"RE\"/> \
  </div> \
  <table> \
    <tr> \
      <td> \
	<div class=\"inputhelp\"> \
	  <div class=\"bracketbutton\" \
		onmousedown=\"Codex.UI.bracket_click(event);\" \
		ontouchstart=\"Codex.UI.bracket_click(event);\" \
		title=\"open/close bracketed tag or link\"> \
	    <strong>[</strong>...<strong>]</strong></div> \
	  use brackets to \
	  <strong>[</strong>tag<strong>]</strong>s or \
	  <strong>[!</strong>http://example.com/ <em>link</em><strong>]</strong>. \
	  Enter to save, shift-Enter for a line break. \
	</div> \
	<textarea name=\"NOTE\" \
		  placeholder=\"add text, [tag]s or [!http://example.com/ links]\" \
		  onfocus=\"fdjtDOM.aC(fdjtDOM.$P(this,'form'),'focused');\" \
		  onblur=\"fdjtDOM.dC(fdjtDOM.$P(this,'form'),'focused');\" \
		  wrap=\"virtual\"></textarea> \
	<div class=\"glossetc\"> \
	  <span class=\"checkspan private\" \
		onclick=\"fdjtUI.CheckSpan.onclick(event);\" \
		title=\"don't share this gloss with my friends generally\"> \
	    <input type=\"CHECKBOX\" name=\"PRIVATE\" value=\"yes\"/> \
	    <span class=\"checked\" \
		  title=\"don't share this note with my personal circle (friends)\"> \
	      private</span> \
	    <span class=\"unchecked\" \
		  title=\"share this note with my personal circle (friends)\"> \
	      shared</span> \
	  </span> \
	  <span class=\"checkspan\" title=\"post to your social news feeds\">     \
	    <input type=\"CHECKBOX\" name=\"POST\" value=\"yes\" DISABLED/>push</span> \
	  <span class=\"outlets\" onclick=\"fdjtUI.CheckSpan.onclick(evt);\"></span> \
	  <span class=\"links\" onclick=\"fdjtUI.CheckSpan.onclick(evt);\"></span> \
	  <span class=\"tags\" onclick=\"fdjtUI.CheckSpan.onclick(evt);\"></span> \
      </td> \
    <td class=\"button\"> \
      <img src=\"http://static.beingmeta.com/graphics/codex/sbgAddButton50x50.png\" \
	   class=\"button\" onclick=\"Codex.UI.submitEvent(event);\" \
	   title=\"add extended text\" data-mode=\"detail\" alt=\"add\"/> \
      <img src=\"http://static.beingmeta.com/graphics/codex/sbgSaveButton50x50.png\" \
	   class=\"button\" onclick=\"Codex.UI.submitEvent(event);\" \
	   title=\"add extended text\" data-mode=\"detail\" alt=\"save\"/> \
    </td></tr> \
  </table> \
</form> \
<!-- \
    /* Emacs local variables \
    ;;;  Local variables: *** \
    ;;;  compile-command: \"cd ..; make\" *** \
    ;;;  End: *** \
    */ \
  --> \
";

var sbook_hudtext="<div id=\"CODEXHELP\" class=\"hudpanel\"> \
</div> \
<div id=\"CODEXHEAD\"> \
  <img src=\"http://static.beingmeta.com/graphics/codex/CompassIcon50x50.png\" \
       alt=\"toc\" title=\"click to navigate the book as a whole\" \
       class=\"hudbutton hudmodebutton topleft\" id=\"CODEXTOCBUTTON\" \
       hudmode=\"toc\"/> \
  <img src=\"http://static.beingmeta.com/graphics/codex/TagSearch50x50.png\" \
       alt=\"search\" title=\"click to search tags within the book\" \
       class=\"hudbutton hudmodebutton topright\" id=\"CODEXSEARCHBUTTON\" \
       hudmode=\"search\"/> \
  <div class=\"helphud topcenter\"> \
    <span class=\"fortouch\">tap</span><span class=\"notouch\">click</span> \
    here to see the book tools \
  </div> \
  <div class=\"helphud topleft\" data-hudmode=\"toc\"> \
    <span class=\"nobreak\"><span class=\"arrow\">&#x2190;</span>browse</span><br/> \
    <span class=\"nobreak\">contents</span></div> \
  <div class=\"helphud topright\" data-hudmode=\"search\"> \
    <span class=\"nobreak\"><span class=\"arrow\">&#x2192;</span>search</span><br/> \
    for&nbsp;tags</div> \
  <div id=\"CODEXHUDBUTTONS\"> \
    <div class=\"sbookplate\"> \
      <a href=\"https://auth.sbooks.net/admin/logout\" class=\"logout\" \
	 title=\"click to logout of the sBooks server\"> \
	logout</a> \
      <a href=\"javascript:CodexMode('login');\" name=\"IDLINK\" \
	 id=\"SBOOKUSERNAME\"> \
	(click to log in)</a> \
    </div> <!-- .flyleafplate --> \
    <div class=\"tabbar icons\" id=\"CODEXTABS\"> \
      <!-- \
	  <a name=\"IDLINK\" href=\"javascript:CodexMode('login');\"  \
	     id=\"IDBUTTON\" class=\"userpic\" \
	     title=\"click to login\"> \
	    <img alt=\"login\" id=\"SBOOKUSERPIC\"/></a> \
	  <a id=\"HELPBUTTON\" href=\"javascript:CodexMode('help');\" \
	     title=\"click for UI help\"> \
	    <img src=\"http://static.beingmeta.com/graphics/codex/HelpIcon32x32.png\" \
		 alt=\"Help\"/></a> \
	  --> \
      <img src=\"http://static.beingmeta.com/graphics/codex/AboutTab50h.png\" \
	   alt=\"About\" class=\"tab\" contentid=\"APPABOUT\" \
	   onclick=\"CodexMode.toggle('about',true); return fdjtUI.cancel(event);\" \
	   title=\"information and links about this book\"/> \
      <img src=\"http://static.beingmeta.com/graphics/codex/TOCTab50h.png\" \
	   alt=\"ToC\" class=\"tab\" contentid=\"FLYTOC\" \
	   onclick=\"CodexMode.toggle('flytoc',true); return fdjtUI.cancel(event);\" \
	   title=\"Table of Contents (static)\"> \
      <img src=\"http://static.beingmeta.com/graphics/codex/SettingsTab50h.png\" \
	   alt=\"Device\" class=\"tab\" contentid=\"CODEXSETTINGS\" \
	   onclick=\"CodexMode.toggle('device',true); return fdjtUI.cancel(event);\" \
	   title=\"alter appearance and interaction\"/> \
      <img src=\"http://static.beingmeta.com/graphics/codex/SocialTab50h.png\" \
	   alt=\"sBooks\" class=\"tab\" contentid=\"SBOOKSAPP\" \
	   onclick=\"CodexMode.toggle('sbookapp',true); return fdjtUI.cancel(event);\" \
	   title=\"manage how your sBook is enhanced with added layers\"/> \
      <img src=\"http://static.beingmeta.com/graphics/codex/LoginTab50h.png\" \
	   alt=\"Login\" class=\"tab\" contentid=\"SBOOKAPPLOGIN\" \
	   onclick=\"CodexMode.toggle('login',true); return fdjtUI.cancel(event);\" \
	   title=\"login to sBooks\" /> \
      <img src=\"http://static.beingmeta.com/graphics/codex/ConsoleTab50h.png\" \
	   alt=\"Console\" class=\"tab\" contentid=\"CODEXCONSOLE\" \
	   onclick=\"CodexMode.toggle('console',true); return fdjtUI.cancel(event);\" \
	   title=\"show console\" /> \
      <img src=\"http://static.beingmeta.com/graphics/codex/HelpTab50h.png\" \
	   alt=\"Help\" class=\"tab\" contentid=\"CODEXHELP\" \
	   onclick=\"CodexMode.toggle('help',true); return fdjtUI.cancel(event);\" \
	   title=\"help about using sBooks\"/> \
    </div> <!-- .tabbar --> \
  </div> <!-- id=\"CODEXHUDBUTTONS\" --> \
  <div id=\"CODEXGOTOLOC\" class=\"hudpanel codexgoto\"> \
    Jump to location <input type=\"text\" name=\"GOTOLOC\" value=\"\" \
			    id=\"CODEXLOCINPUT\" \
			    onkeypress=\"Codex.UI.goto_keypress(event);\"/> \
  </div> \
  <div id=\"CODEXGOTOPAGE\" class=\"hudpanel codexgoto\"> \
    Jump to page <input type=\"text\" name=\"GOTOPAGE\" value=\"\" \
			id=\"CODEXPAGEINPUT\" \
			onkeypress=\"Codex.UI.goto_keypress(event);\"/> \
  </div> \
  <div id=\"CODEXTOC\" class=\"hudpanel\"></div> \
  <img src=\"http://static.beingmeta.com/graphics/codex/ScanLeft32.png\" \
       id=\"CODEXSCANLEFT\" class=\"codexscanbutton\" \
       alt=\"prev\" onclick=\"Codex.scanBackward(event);\"/> \
  <img src=\"http://static.beingmeta.com/graphics/codex/ScanRightStop32.png\" \
       id=\"CODEXSCANEND\" class=\"codexscanbutton\" \
       alt=\"end\"/> \
  <img src=\"http://static.beingmeta.com/graphics/codex/ScanRight32.png\" \
       id=\"CODEXSCANRIGHT\" class=\"codexscanbutton\" \
       alt=\"next\" onclick=\"Codex.scanForward(event);\"/> \
  <img src=\"http://static.beingmeta.com/graphics/codex/ScanLeftStop32.png\" \
       id=\"CODEXSCANSTART\" class=\"codexscanbutton\" \
       alt=\"beginning\"/> \
  <div id=\"CODEXSCANNER\" class=\"hudpanel\"> \
    <div id=\"CODEXSCAN\"></div> \
  </div> \
  <div id=\"CODEXSEARCH\" class=\"searchbox hudpanel notags\"> \
    <!-- This content comes from sbooksearch.html --> \
  </div> \
  <div id=\"CODEXBROWSEGLOSSES\" class=\"hudpanel\"> \
    <!-- This contains renderings of all the glosses, with \
	 a list of sources on top --> \
    <div id=\"SBOOKSOURCES\" class=\"sbooksources\" \
	 onclick=\"Codex.UI.handlers.sources_onclick(event);\"> \
      <img src=\"http://static.beingmeta.com/graphics/codex/sbookspeople50x50.png\" \
	   class=\"button everyone selected\" \
	   alt=\"show all\" title=\"click to see all glosses\" \
	   onclick=\"Codex.UI.handlers.everyone_onclick(event);\"/> \
    </div> \
    <div class=\"scrollbox\"> \
      <div id=\"CODEXALLGLOSSES\" class=\"codexslice\"> \
	<!-- This is filled in on demand --> \
      </div> \
    </div> \
  </div> \
  <div id=\"CODEXADDGLOSS\" class=\"codexaddgloss hudpanel\"> \
    <div id=\"CODEXGLOSSFORMS\"> \
      <!-- This content comes from addgloss.html --> \
    </div> \
    <div id=\"CODEXGLOSSCLOUD\" class=\"completions\"> \
      <img class=\"label\" alt=\"tags\" \
	   src=\"http://static.beingmeta.com/graphics/codex/TagIcon32x32.png\" \
	   onclick=\"fdjtDOM.toggleClass(fdjtID('SBOOKGLOSSCLOUD'),'showempty');\"/> \
      <div class='doc'> \
	<strong>Add a tag</strong> \
	by <strong class='fortouch'>tapping</strong><strong class='notouch'>clicking</strong> \
	a displayed <em>cue</em> or <em>completion</em>.   Start typing to <em>see completions</em>; \
	<tt><strong><em>Shift</em>-enter</strong></tt> to pick the \
	first visible completion. \
      </div> \
      <div id=\"CODEXGLOSSOUTLETS\"></div> \
      <div id=\"CODEXGLOSSTAGS\"></div> \
      <div id=\"CODEXGLOSSCLOUDSOURCES\"></div> \
    </div> \
  </div> \
  <div id=\"CODEXGLOSSES\" class=\"hudpanel\"> \
    <!-- This is swapped in on demand --> \
  </div> \
</div> <!-- CODEXHEAD --> \
<div class=\"helphud leftmiddle\"> \
  back page \
</div> \
<div class=\"helphud rightmiddle\"> \
  next page \
</div> \
<div id=\"CODEXFLYLEAF\" class=\"hudpanel\"> \
  <!-- This content comes from flyleaftext.html --> \
</div> \
<div id=\"CODEXFOOT\"> \
  <img src=\"http://static.beingmeta.com/graphics/codex/drophud50x50.png\" \
       alt=\"drophud\" title=\"hide the book tools\" \
       id=\"CODEXDROPHUD\" \
       onclick=\"CodexMode(false); fdjtUI.cancel(event); return false;\"/> \
  <div id=\"CODEXBUTTON\" onclick=\"CodexMode.toggle('last');\" class=\"help\"> \
    <img src=\"http://static.beingmeta.com/graphics/codex/AboutIcon50x50.png\" \
	 alt=\"about\" title=\"information and links about this book\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/CompassIcon50x50.png\" \
	 alt=\"toc\" title=\"information and links about this book\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/ScannerIcon50x50.png\" \
	 alt=\"scanning\" \
	 title=\"scan this book by structure, glosses, or search results\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/SearchIcon50x50.png\" \
	 alt=\"search\" title=\"information and links about this book\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/remarkballoon50x50.png\" \
	 alt=\"addgloss\" title=\"information and links about this book\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/sbookspeople50x50.png\" \
	 alt=\"allglosses\" title=\"information and links about this book\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/HelpIcon50x50.png\" \
	 alt=\"help\" title=\"help about using sBooks\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/SocialIcon50x50.png\" \
	 alt=\"sbookapp\" \
	 title=\"manage how your sBook is enhanced with added layers\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/LoginIcon50x50.png\" \
	 alt=\"login\" title=\"login\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/SettingsIcon50x50.png\" \
	 alt=\"device\" title=\"alter appearance and interaction\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/ConsoleIcon50x50.png\" \
	 alt=\"console\" title=\"see the application console\" \
	 class=\"hudbutton botleft\"/> \
    <img src=\"http://static.beingmeta.com/graphics/codex/FlyTOCIcon50x50.png\" \
	 alt=\"flytoc\" title=\"Table of Contents (static)\" \
	 class=\"hudbutton botleft\"/> \
  </div> \
  <div class=\"helphud botleft\" data-hudmode=\"flyleaf\"> \
    <span class=\"nobreak\"><span class=\"arrow\">&#x2190;</span>hide</span><br/> \
    tools</div> \
  <div class=\"helphud botcenter\"> \
    <span class=\"fortouch\">tap</span><span class=\"notouch\">click</span> \
    here to hide tools or<br/>jump within the document \
  </div> \
  <div id=\"SBOOKFOOTINFO\"> \
    <div id=\"SBOOKTARGETINFO\"></div> \
  </div> \
  <div class=\"helphud botright\" data-hudmode=\"allglosses\"> \
    <span class=\"nobreak\">show<span class=\"arrow\">&#x2192;</span></span><br/> \
    overlays</div> \
  <img src=\"http://static.beingmeta.com/graphics/codex/sbookspeople50x50.png\" \
       alt=\"glosses\" title=\"Click to browse glosses overlaid on this book\" \
       class=\"hudbutton hudmodebutton botright\" id=\"CODEXALLGLOSSESBUTTON\" \
       hudmode=\"allglosses\"/> \
</div> \
 \
<!-- \
    /* Emacs local variables \
    ;;;  Local variables: *** \
    ;;;  compile-command: \"cd ..; make\" *** \
    ;;;  End: *** \
    */ \
  --> \
 \
";

var sbook_flyleaftext="<div class='tabcontent flyleaftab' id='SBOOKAPPLOGIN'> \
</div> \
<div id=\"CODEXCONSOLE\" class=\"tabcontent flyleaftab sbookconsole\"> \
  <h1>Codex Console</h1> \
  <div class='message' id='CODEXCONSOLEMESSAGE'></div> \
  <div id='SBOOKMESSAGELOG' class='sbookmessagelog'> \
  </div> \
</div> \
<div class='tabcontent flyleaftab' id='CODEXSETTINGS'> \
</div> \
  <!-- Automatically filled from settings.html --> \
<div class='tabcontent flyleaftab' id='FLYTOC'> \
</div> \
<div class='tabcontent flyleaftab' id=\"CODEXHELP\"> \
  <!-- Automatically filled from helptext.html --> \
</div> \
 \
<div class='tabcontent flyleaftab sbookabout' id='APPABOUT'> \
  <div id='APPABOUTCONTENT'> \
    <h1>About This Book</h1> \
    <div class='title'>An sBook</div> \
    <div class='byline'></div> \
    <div class='cover'></div> \
    <div class='publisher'></div> \
    <div class='copyright'></div> \
    <div class='description'></div> \
    <div class='digitized'></div> \
    <div class='sbookified'></div> \
    <div class='about'></div> \
  </div> \
</div> \
 \
<div class='tabcontent flyleaftab' id='SBOOKSAPP'> \
  <iframe id=\"MANAGEAPP\" frameborder=\"0\" scrolling=\"auto\"/> \
</div> \
<!-- \
    /* Emacs local variables \
    ;;;  Local variables: *** \
    ;;;  compile-command: \"cd ..; make\" *** \
    ;;;  End: *** \
    */ \
  --> \
 \
";

var sbook_loginform="<div id=\"CODEXFLYLOGIN\"> \
  <form action=\"https://auth.sbooks.net/admin/auth\" \
	onsubmit=\"Codex.UI.checkLogin(event);\"> \
    <input TYPE=\"HIDDEN\" NAME=\"RETURN_TO\" ID=\"SBOOK_RETURN_TO\"/> \
    <table class=\"login fdjtform\" cellspacing=\"1\" id=\"SBOOKLOGINFORM\"> \
      <tbody class=\"collapsible\" id=\"SBOOKNATIVELOGIN\"> \
	<tr class=\"blockstart\"><th/><td/></tr> \
	<tr><th><input TYPE=\"SUBMIT\" NAME=\"ACTION\" VALUE=\"Login\"> \
	    <input TYPE=\"SUBMIT\" NAME=\"ACTION\" VALUE=\"Register\"></th> \
	  <td><input type=\"TEXT\" name=\"USERID\" value=\"\" \
		     placeholder=\"Enter a username (e.g. email)\"/></td></tr> \
	<tr><th>password</th> \
	  <td><input type=\"PASSWORD\" name=\"PASSWD\" value=\"\" \
		     placeholder=\"your registered password\"/></td></tr> \
	<tr class=\"collapsible\"> \
	  <th>confirm</th> \
	  <td><input type=\"PASSWORD\" name=\"XPASSWD\" value=\"\" \
		     placeholder=\"your registered password\"/></td></tr> \
	<tr class=\"collapsible\"> \
	  <th>display</th> \
	  <td><input type=\"TEXT\" name=\"NAME\" value=\"\" \
		     placeholder=\"what name to display with your comments\"/> \
	</td></tr> \
	<tr class=\"collapsible\"> \
	  <th>picture</th> \
	  <td><input type=\"FILE\" name=\"PIC\" value=\"\" \
		     placeholder=\"what name to display with your comments\"/> \
	    (optional)</td></tr> \
	<tr onclick=\"fdjtUI.CheckSpan.onclick(event); \
		     setTimeout(Codex.UI.updateLogin,200);\" \
	    class=\"checkspan\"> \
	  <th><input TYPE=\"CHECKBOX\" NAME=\"REGISTER\" VALUE=\"YES\" \
		     id=\"SBOOKREGISTER\"/></th> \
	  <td>create a new account&nbsp;&nbsp; \
	    <img src=\"http://static.beingmeta.com/graphics/FreeIcon28x21.png\" \
		 alt=\"free\"/></td></tr> \
      </tbody> \
      <tbody> \
	<tr class=\"blockbreak\"><th/><td/></tr> \
	<tr> \
	  <th>Connect<br/>using</th> \
	  <td class=\"oneclick\"> \
            <input type=\"IMAGE\" NAME=\"FACEBOOK\" VALUE=\"yes\" \
		   src= \
		   \"http://static.beingmeta.com/graphics/logos/facebook32x32.png\" \
         	   alt=\"Facebook\" class=\"noautoscale\"/> \
	    <input type=\"IMAGE\" NAME=\"ENDPOINT\" \
		   VALUE=\"https://open.login.yahooapis.com/openid/op/auth\" \
		   src=\"http://static.beingmeta.com/graphics/logos/yyahoo.png\" \
		   alt=\"Yahoo!\" title=\"login using Yahoo!\"/> \
	    <input TYPE=\"IMAGE\" NAME=\"ENDPOINT\" \
		   VALUE=\"https://www.google.com/accounts/o8/id\" \
		   src=\"http://static.beingmeta.com/graphics/logos/ggoogle.png\" \
		   alt=\"Google\" title=\"login using Google\"/> \
	  </td> \
	</tr> \
      </tbody> \
      <tbody> \
	<tr class=\"blockbreak\"><th/><td/></tr> \
	<tr> \
	  <th class=\"username\"> \
	    &nbsp;login as<br/><span style=\"font-size: 200%;\">@</span></th> \
	  <td class=\"userlogin\"> \
	    <input type=\"TEXT\" name=\"USERNAME\" value=\"\" \
		   placeholder=\"username on external site\"/> \
	    <br/> \
	    <div class=\"doc\" id=\"USERNAMEDOC\" style=\"display: none;\"> \
	      Some sites provide OpenID login based on your user name. \
	      Enter your username and click the button for the appropriate \
	      site.  You'll go to that site, log in, and return to this book. \
	    </div> \
	    <button type=\"SUBMIT\" name=\"PROVIDER\" value=\"aol.com\"> \
	      <img src=\"http://static.beingmeta.com/graphics/logos/aol.png\" \
		   alt=\"aol\"/> \
	    </button> \
	    <button type=\"SUBMIT\" name=\"PROVIDER\" value=\"myid.net\"> \
	      <img src=\"http://static.beingmeta.com/graphics/logos/myidnet.png\" \
		   alt=\"myid\"/> \
	    </button> \
	    <button type=\"SUBMIT\" name=\"PROVIDER\" value=\"flickr.com\"> \
	      <img src=\"http://static.beingmeta.com/graphics/logos/flickr.png\" \
		   alt=\"flickr\"/> \
	    </button> \
	    <button type=\"SUBMIT\" name=\"PROVIDER\" value=\"myopenid.com\"> \
	      <img src=\"http://static.beingmeta.com/graphics/logos/myopenid.png\" alt=\"myopenid\"/> \
	    </button> \
	    <button type=\"SUBMIT\" name=\"PROVIDER\" value=\"wordpress.com\"> \
	      <img src=\"http://static.beingmeta.com/graphics/logos/wordpress.png\" \
		   alt=\"wordpress\"/> \
	    </button> \
	    <button type=\"SUBMIT\" name=\"PROVIDER\" \
		    value=\"pip.verisignlabs.com\"> \
	      <img src=\"http://static.beingmeta.com/graphics/logos/verisign.png\" \
		   alt=\"vidoop\"/> \
	    </button> \
	  </td> \
	  <td class=\"icon\"> \
	    <img src=\"http://static.beingmeta.com/graphics/codex/HelpIcon16x16.png\" alt=\"?\" \
		 class=\"helpicon\" \
		 title=\"Some sites provide OpenID login based on your user name.  Enter your username and click the button for the appropriate site.  You&#39;ll go to that site, log in, and return here.\"/></td> \
	</tr> \
	<tr class=\"spacer\"><th/><td/></tr> \
      </tbody> \
      <tr class=\"blockbreak\"><th/><td/></tr> \
      <tr> \
	<th> \
	  <img src=\"http://static.beingmeta.com/graphics/logos/openid-logo-small.png\" \
	       alt=\"OpenID\" style=\" height: 32px;\"/></th> \
	<td><input type=\"TEXT\" name=\"OPENID\" value=\"\" \
		   placeholder=\"Enter your OpenID (a url)\"/><br/> \
	  <input type=\"SUBMIT\" name=\"ACTION\" value=\"Use OpenID\"/> \
	  <a href=\"http://openid.net/get-an-openid/\">Get an OpenID</a> \
	</td> \
	<td class=\"icon\"> \
	  <img src=\"http://static.beingmeta.com/graphics/codex/HelpIcon16x16.png\" \
	       alt=\"?\" \
	       class=\"helpicon\" \
	       title=\"OpenID enables you to use a variety of services, \
	       usually free, to identify yourself and provide some \
	       limited personal information.\"/></td> \
      </tr> \
    </table> \
  </form> \
</div> \
<div class=\"logindoc\"> \
  <p>In order to save and share your glosses as well as viewing the \
    glosses of friends and colleagues, we need to identify you. \
    Rather than introducing another password to remember or \
    registration process to slog through, we \
    use <a href=\"http://www.openid.net/\">OpenID</a> and related \
    technologies to let log into sBooks through other sites that you \
    already use.  You can login below using any of a variety of sites \
    or methods.</p> \
</div> \
<!-- \
    /* Emacs local variables \
    ;;;  Local variables: *** \
    ;;;  compile-command: \"cd ..; make\" *** \
    ;;;  End: *** \
    */ \
  --> \
 \
";

var sbook_helptext="<div class=\"helptopbanner\"> \
  <span class=\"hidespan\"> \
    <span id=\"HIDEHELPBUTTON\"> \
      <img class=\"helpcloser\" alt=\"X\"  \
	   src=\"http://static.beingmeta.com/graphics/redx24x24.png\"/> \
      Hide</span> \
    <span class=\"checkspan\" id=\"HIDESPLASHCHECKSPAN\"> \
      <input TYPE=\"checkbox\" NAME=\"CODEXHIDESPLASH\" VALUE=\"yes\"/> \
      when ready</span> \
  </span> \
  <div id=\"CODEXSTARTUPMSG\">Please wait while we process your book</div> \
</div> \
<h2>Welcome to Codex, an sBooks reader</h2> \
<div class=\"codexhelp\"> \
  <p><strong><span style=\"color: blue;\">s</span>Books</strong> are \
    digital books enriched by layers of structure, semantics, and \
    annotations from your friends, colleagues, and chosen \
    communities.</p> \
 \
  <p id=\"CODEXHELPLOGIN\"> \
    <strong style=\"color: blue; cursor: pointer; text-decoration: underline;\" \
	    onclick=\"CodexMode('login')\">Login</strong> \
    to use the annotation and social features of sBooks.  For free \
    content and open communities, this service is <strong>free of \
      charge</strong>.</p> \
   \
  <p><strong>Flip</strong> through pages by tapping the sides of the \
    display, swiping right or left, or using the space, backspace, or \
    page up/down buttons your keyboard.</p> \
   \
  <p><strong>Jump</strong> through the book by clicking in the \
    progress display at the bottom of the page, or click on the page \
    number or location to jump to a particular location.</p> \
   \
  <p><strong>Annotate</strong> passages by selecting text or clicking \
    on a paragraph and then clicking on \
    the <img src=\"http://static.beingmeta.com/graphics/codex/justremarkballoon16x16.png\" alt=\"balloon\"> \
    icon which appears next to it.</p> \
 \
  <p><img style=\"float: right;\" \
	  src=\"http://static.beingmeta.com/graphics/codex/CompassIcon24x24.png\"/> \
    <strong>Navigate</strong> the book's structure by clicking on the \
    navigation icon in the upper left.  A display at the top of the \
    page will show you the arrangement and sizes of the book's \
    elements.</p> \
 \
  <p><img style=\"float: right;\" \
	  src=\"http://static.beingmeta.com/graphics/codex/TagSearch24x24.png\"/> \
    <strong>Search</strong> using the search icon in the upper right \
    to explore the book based on tags assigned to sections or passages \
    by your community, the author/publisher, and helpful robots.</p> \
 \
  <p><img style=\"float: right;\" \
	  src=\"http://static.beingmeta.com/graphics/codex/sbookspeople24x24.png\"/> \
    <strong>Reveal</strong> the glosses (notes, tags, links, etc) \
    added to the book by clicking on \
    the <img src=\"http://static.beingmeta.com/graphics/Asterisk16x16.png\"/> \
    icons to the right or see all the glosses by clicking on the \
    overlays icon in the lower right.</p> \
 \
  <p><img style=\"float: right;\" \
	  src=\"http://static.beingmeta.com/graphics/codex/ScanRight24.png\"/> \
    <strong>Scan</strong> through the book by clicking double arrow \
    icons, swiping with two fingers, or using the arrow keys. \
    <em>Scanning</em> can advance based on section structure, search \
    results, or annotations (glosses).</p> \
</div> \
<!-- \
   /* Emacs local variables \
   ;;;  Local variables: *** \
   ;;;  compile-command: \"cd ..; make\" *** \
   ;;;  End: *** \
   */ \
  --> \
";

var sbook_console="<div class='message' id='CODEXCONSOLEMESSAGE'></div> \
<div id='SBOOKMESSAGELOG' class='sbookmessagelog'> \
</div> \
 \
 \
<!-- \
/* Emacs local variables \
;;;  Local variables: *** \
;;;  compile-command: \"cd ..; make\" *** \
;;;  End: *** \
*/ \
--> \
 \
";

var sbook_settingstext="";

