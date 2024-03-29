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
    var form=fdjt.UI.T(evt);
    if (!(form)) form=fdjt.ID("SBOOKSLOGINFORM");
    if (fdjt.ID("SBOOKSSETPASS").checked) {
        var passin=fdjt.DOM.getInput(form,"PASS1");
        var xpassin=fdjt.DOM.getInput(form,"PASS2");
        if (passin.value!==xpassin.value) {
            alert("Passwords don't match!");
            fdjt.UI.cancel(evt);}}
    if ((fdjt.DOM.hasClass(form,"register"))||
        (fdjt.DOM.hasClass(form,"onetime"))) {
        var logincode=fdjt.ID("SBOOKSLOGINCODE");
        if ((logincode)&&(fdjt.String.isEmpty(logincode.value))) {
            if (fdjt.DOM.hasClass(form,"register"))
                alert("You need to enter your registration code!");
            else alert("You need to enter your login code!");
            fdjt.UI.cancel(evt);}}
    if (fdjt.DOM.hasClass(form,"password")) {
        var password=fdjt.ID("SBOOKSPASSWORD");
        if ((password)&&(fdjt.String.isEmpty(password.value))) {
            alert("You need to enter your (non-empty) password!");
            fdjt.UI.cancel(evt);}}
    if (fdjt.DOM.hasClass(form,"register")) {
        var termsok=fdjt.ID("SBOOKSTERMSOK");
        if (!(termsok.checked)) {
            alert("You need to agree to the terms and conditions!");
            fdjt.UI.cancel(evt);}}}

function showPasswords(flag)
{
    if (typeof flag === "string") {
        var checkbox=fdjt.ID(flag);
        if (checkbox) flag=checkbox.checked;
        else flag=false;}
    var inputs=fdjt.DOM.$("INPUT.passwordfield");
    var i=0, lim=inputs.length;
    while (i<lim) {
        if (flag) inputs[i++].type="TEXT";
        else inputs[i++].type="PASSWORD";}
}

function sendLoginCode(evt) {
    evt=evt||event;
    var target=fdjt.UI.T(evt);
    var form=fdjt.DOM.getParent(target,'form');
    var emails=fdjt.DOM.getInputValues(form,'LOGIN');
    fdjt.Ajax(function(req){
        if (req.responseText) alert(req.responseText);},
             "https://auth.sbooks.net/admin/sendlogin",
             {email: emails[0]});}

function eraseKeepData(){
    var cookie=fdjt.State.getCookie("CODEX:CONFIG"), config=false;
    if (cookie) {
        try {
            if (cookie[0]==="%")
                cookie=decodeURIComponent(cookie);
            config=JSON.parse(cookie);}
        catch (ex) {return;}}
    // Once the option of keeping data is set, we require that it be
    // reset through a settings dialog/screen.  The idea is that we
    // don't want to erase cached data just because somebody forgot
    // the checkbox when re-logging in.
    if ((config)&&(config.keepdata))
        fdjt.DOM.remove(fdjt.DOM.$(".codexkeepdata"));}
fdjt.addInit(eraseKeepData);

function updateResetLink() {
    var resetlink=fdjt.ID("SBOOKLOSTPASSWORD");
    var username=fdjt.ID("SBOOKUSERNAME");
    if ((resetlink)&&(username)&&(username.value)&&
        (!(fdjt.String.isEmpty(username.value)))) {
        resetlink.href=resetlink.href+"?EMAIL="+
            encodeURIComponent(username.value);}}

fdjt.addInit(updateResetLink,"updateresetlink");
        
function loggedInOnLoad(evt){
    var userinfo=fdjt.DOM.getMeta('SBOOK.userinfo');
    if ((userinfo)&&(window.parent)&&(window.parent.postMessage))
        window.parent.postMessage('setuser='+userinfo,'*');}

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
