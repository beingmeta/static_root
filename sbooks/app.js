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
    var include_self=fdjt.ID("INCLUDEME").checked;
    var invites=fdjtDOM.getInputs(fdjt.ID("INVITATIONS"),"INVITE");
    var discount=((include_self)?(1):(0));
    var i=0; var lim=invites.length; var n_invited=0;
    while (i<lim) if (invites[i++].checked) n_invited++;
    var priceinput=fdjt.ID("PRICEINPUT");
    priceinput.value=(n_invited-discount)+".00";
    fdjt.ID("PRICE").innerHTML=(n_invited-discount)+".00";
    fdjt.ID("DISCOUNT").innerHTML=(discount)+".00";
    fdjt.ID("TOTALPRICE").innerHTML=(n_invited)+".00";}

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
    fdjtDOM(fdjt.ID("INVITATIONS")," ",
	    fdjt.DOM("span.checkspan",checkbox,email));}}


