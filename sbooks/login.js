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
    var form=fdjt.ID("SBOOKLOGINFORM");
    if (fdjt.ID("SBOOKSETPASS").checked) {
        var passin=fdjt.DOM.getInput(form,"PASS1");
        var xpassin=fdjt.DOM.getInput(form,"PASS2");
        if (passin.value!==xpassin.value) {
            alert("Passwords don't match!");
            fdjt.UI.cancel(evt);}}
    if (fdjt.DOM.hasClass(form,"register")) {
        var termsok=fdjt.ID("SBOOKTERMSOK");
        if (!(termsok.checked)) {
            alert("You need to agree to the terms and conditions!");
            fdjt.UI.cancel(evt);}}}

function sendLoginCode(evt) {
    evt=evt||event;
    var target=fdjt.UI.T(evt);
    var form=fdjt.DOM.getParent(target,'form');
    var emails=fdjt.DOM.getInputValues(form,'USERNAME');
    fdjt.Ajax(function(req){
        if (req.responseText) alert(req.responseText);},
             "https://auth.sbooks.net/admin/sendlogin",
             {email: emails[0]});}

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
