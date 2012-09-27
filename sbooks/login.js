/* -*- Mode: Javascript; character-encoding: utf-8; -*- */

/* Copyright (C) 2009-2012 beingmeta, inc.
   This file implements utility functions for sBooks login forms.

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   All rights reserved.

*/

function checkLogin(evt){
    evt=evt||event;
    var form=fdjtID("SBOOKLOGINFORM");
    if (fdjtID("SBOOKSETPASS").checked) {
	var passin=fdjtDOM.getInput(form,"PASS1");
	var xpassin=fdjtDOM.getInput(form,"PASS2");
	if (passin.value!==xpassin.value) {
	    alert("Passwords don't match!");
	    fdjtUI.cancel(evt);}}
    if (fdjtDOM.hasClass(form,"register")) {
	var termsok=fdjtID("SBOOKTERMSOK");
	if (!(termsok.checked)) {
	    alert("You need to agree to the terms and conditions!");
	    fdjtUI.cancel(evt);}}}

function sendLoginCode(evt) {
    evt=evt||event;
    var target=fdjtUI.T(evt);
    var form=fdjtDOM.getParent(target,'form');
    var emails=fdjtDOM.getInputValues(form,'USERNAME');
    fdjtAjax(function(req){
	if (req.responseText) alert(req.responseText);},
	     "https://auth.sbooks.net/admin/sendlogin",
	     {email: emails[0]});}
