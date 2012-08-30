/* -*- Mode: Javascript; character-encoding: utf-8; -*- */

/* Copyright (C) 2009-2012 beingmeta, inc.
   This file implements utility functions for sBooks login forms.

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   All rights reserved.

*/

function updateLogin(){
    if (fdjtID("SBOOKREGISTER").checked) {
	fdjtDOM.addClass(fdjtID("SBOOKNATIVELOGIN"),"registering");
	fdjtDOM.addClass(fdjtID("SBOOKNATIVELOGIN"),"expanded");}
    else {
	fdjtDOM.dropClass(fdjtID("SBOOKNATIVELOGIN"),"registering");
	fdjtDOM.dropClass(fdjtID("SBOOKNATIVELOGIN"),"expanded");}}
function loginStartup(){
    var message=fdjtState.getQuery("MESSAGE");
    if (message) {
	var elt=fdjtID("LOGINMESSAGE"); if (elt) elt.innerHTML=message;}
    if (fdjtState.getQuery("STARTUP")==="register") {
	fdjtUI.CheckSpan.set("REGISTERCHECKSPAN",true);
	fdjtDOM.addClass(fdjtID("SBOOKNATIVELOGIN"),"registering");
	fdjtDOM.addClass(fdjtID("SBOOKNATIVELOGIN"),"expanded");}
    else fdjtID("SBOOKREGISTER").checked=false;}
function checkLogin(evt){
    if (fdjtID("SBOOKREGISTER").checked) {
	var tbody=fdjtID("SBOOKNATIVELOGIN");
	var passin=fdjtDOM.getInput(tbody,"PASSWD");
	var xpassin=fdjtDOM.getInput(tbody,"XPASSWD");
	if (passin.value!==xpassin.value) {
	    alert("Passwords don't match!");
	    return fdjtUI.cancel(evt);}}}
if ((fdjtID)&&(fdjtID("REGISTERCHECKSPAN"))) loginStartup();
else fdjtDOM.addListener(window,"load",loginStartup);
