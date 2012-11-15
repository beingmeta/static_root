/* -*- Mode: Javascript; character-encoding: utf-8; -*- */

/* Copyright (C) 2009-2012 beingmeta, inc.
   This file implements interaction logic for parts of the
    sBooks site.

   For more information on sbooks, visit www.sbooks.net
   For more information on knodules, visit www.knodules.net
   For more information about beingmeta, visit www.beingmeta.com

   This library uses the FDJT (www.fdjt.org) toolkit.

   All rights reserved.

*/

function bookTabToggle(evt)
{
  evt=evt||event;
  var target=fdjtUI.T(evt);
  var tabid=fdjtDOM.findAttrib(target,'tabid');
  if (!(tabid)) return;
  var tbody=fdjtDOM.getParent(target,'tbody');
  var curtab=tbody.getAttribute('tab');
  if ((curtab)&&(curtab===tabid)) tbody.removeAttribute('tab');
  else tbody.setAttribute('tab',tabid);
  tbody.className=tbody.className;
}

function favoritesToggle(evt,refuri)
{
  evt=evt||event;
  var target=fdjtUI.T(evt);
  if (!(fdjtDOM.hasClass(target,"starred")))
    target=fdjtDOM.getParent(target,".starred");
  if (!(target)) return;
  var book=fdjtDOM.getParent(target,"tbody.book");
  if (!(book)) return;
  var refuri=book.getAttribute('data-uri');
  var favored=fdjtDOM.hasClass(target,'favorite');
  fdjtAjax.jsonCall(function(newval){
      if (newval==true) fdjtDOM.addClass(target,'favorite');
      else if (!(newval))
        fdjtDOM.dropClass(target,'favorite');
      else fdjtLog.warn("Odd result from favorites API call");},
    "https://auth.sbooks.net/admin/favorites",
    ((favored)?("drop"):("add")),refuri);
}

function passwordToggle(evt)
{
    var target=fdjtUI.T(evt=(evt||event));
    var loginbox=fdjtDOM.getParent(target,".loginbox");
    fdjtDOM.toggleClass(loginbox,"showpass");
}

function textHideToggle(evt,id)
{
    var target=fdjtUI.T(evt=evt||event);
    if (!(id)) id=target.getAttribute('FIELD');
    if (!(id)) return;
    var elt=fdjtID(id);
    if ((!(elt))||(!(elt.type))) return;
    if (!((elt.type==="text")||(elt.type==="password")))
        return;
    if (target.checked) elt.type="password";
    else elt.type="text";
}

function updateForm(form){
  var checks=fdjtDOM.getInputs(form,"ACCESS");
  var isopen=false; var i=0; var lim=checks.length;
  while (i<lim)
    if (checks[i].value===':OPEN') {
      isopen=checks[i].checked; break;}
    else i++;
  if (isopen) fdjtDOM.addClass(form,"isopen");
  else fdjtDOM.dropClass(form,"isopen");}
function formChanged(evt){
  evt=evt||event;
  var form=fdjtDOM.getParent(target,"form");
  setTimeout(function(){updateForm(form);},100);}

function updatePrice(){
    var include_self=fdjtID("INCLUDEME").checked;
    var invites=fdjtDOM.getInputs(fdjtID("INVITATIONS"),"INVITE");
    var discount=((include_self)?(1):(0));
    var i=0; var lim=invites.length; var n_invited=0;
    while (i<lim) if (invites[i++].checked) n_invited++;
    var priceinput=fdjtID("PRICEINPUT");
    priceinput.value=(n_invited-discount)+".00";
    fdjtID("PRICE").innerHTML=(n_invited-discount)+".00";
    fdjtID("DISCOUNT").innerHTML=(discount)+".00";
    fdjtID("TOTALPRICE").innerHTML=(n_invited)+".00";}

function invite_keypress(evt){
  var target=fdjtUI.T(evt);
  var ch=evt.charCode||evt.keyCode;
  if (ch!==13) return;
  fdjtUI.cancel(evt);
  var string=target.value; target.value="";
  var emails=string.split(",");
  var i=0; var lim=emails.length;
  while (i<lim) {
    var email=emails[i++];
    var checkbox=fdjtDOM.Checkbox("INVITE",email);
    checkbox.checked=true;
    fdjtDOM(fdjtID("INVITATIONS")," ",
            fdjtDOM("span.checkspan",checkbox,email));}}

function showMessage(){
    var message=fdjtState.getCookie("SBOOKSMESSAGE");
    if (message) {
        fdjtUI.alertFor(20,message);
        fdjtState.clearCookie("SBOOKSMESSAGE","sbooks.net","/");}}

fdjtDOM.addListener(window,"load",showMessage);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
