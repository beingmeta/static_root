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
  var target=fdjt.UI.T(evt);
  var tabid=fdjt.DOM.findAttrib(target,'tabid');
  if (!(tabid)) return;
  var tbody=fdjt.DOM.getParent(target,'tbody');
  var curtab=tbody.getAttribute('tab');
  if ((curtab)&&(curtab===tabid)) tbody.removeAttribute('tab');
  else tbody.setAttribute('tab',tabid);
  tbody.className=tbody.className;
}

function favoritesToggle(evt,refuri)
{
    evt=evt||event;
    var target=fdjt.UI.T(evt);
    if (!(fdjt.DOM.hasClass(target,"starred")))
        target=fdjt.DOM.getParent(target,".starred");
    if (!(target)) return;
    var book=fdjt.DOM.getParent(target,".book");
    if (!(book)) return;
    var refuri=book.getAttribute('data-refuri');
    var favored=fdjt.DOM.hasClass(target,'favorite');
    var update=evt.shiftKey||((evt.touches)&&(evt.touches.length>1));
    fdjt.Ajax.jsonCall(function(newval){
        if (newval==true) fdjt.DOM.addClass(target,'favorite');
        else if (!(newval))
            fdjt.DOM.dropClass(target,'favorite');
        else fdjt.Log.warn("Odd result from favorites API call");},
                       "https://auth.sbooks.net/admin/favorites",
                       ((update)?("add"):(favored)?("drop"):("add")),
                       refuri);
}

function passwordToggle(evt)
{
    var target=fdjt.UI.T(evt=(evt||event));
    var loginbox=fdjt.DOM.getParent(target,".loginbox");
    fdjt.DOM.toggleClass(loginbox,"showpass");
}

function textHideToggle(evt,id)
{
    var target=fdjt.UI.T(evt=evt||event);
    if (!(id)) id=target.getAttribute('FIELD');
    if (!(id)) return;
    var elt=fdjt.ID(id);
    if ((!(elt))||(!(elt.type))) return;
    if (!((elt.type==="text")||(elt.type==="password")))
        return;
    if (target.checked) elt.type="password";
    else elt.type="text";
}

function changeParent(evt,spec,classname)
{
    evt=evt||event;
    var target=fdjt.UI.T(evt);
    if (!(target)) return;
    var parent=fdjt.DOM.getParent(target,spec);
    if (!(parent)) return;
    if (target.checked)
        fdjt.DOM.addClass(parent,classname);
    else fdjt.DOM.addClass(parent,classname);
}

function submitOnEnter(evt,value,name){
    evt=evt||event;
    var target=fdjtUI.T(evt);
    var kc=evt.keyCode;
    if (kc===13) {
        var elt=fdjt.DOM("INPUT"); {
            elt.type="HIDDEN"; elt.name=name||"ACTION";
            elt.value=value||target.value;
            fdjt.DOM.insertAfter(target,elt);}
        target.form.submit();
        fdjt.UI.cancel(evt);}}

function updateForm(form){
  var checks=fdjt.DOM.getInputs(form,"ACCESS");
  var isopen=false; var i=0; var lim=checks.length;
  while (i<lim)
    if (checks[i].value===':OPEN') {
      isopen=checks[i].checked; break;}
    else i++;
  if (isopen) fdjt.DOM.addClass(form,"isopen");
  else fdjt.DOM.dropClass(form,"isopen");}
function formChanged(evt){
  evt=evt||event;
  var form=fdjt.DOM.getParent(target,"form");
  setTimeout(function(){updateForm(form);},100);}

function updatePrice(){
    var include_self=fdjt.ID("INCLUDEME").checked;
    var invites=fdjt.DOM.getInputs(fdjt.ID("INVITATIONS"),"INVITE");
    var discount=((include_self)?(1):(0));
    var i=0; var lim=invites.length; var n_invited=0;
    while (i<lim) if (invites[i++].checked) n_invited++;
    var priceinput=fdjt.ID("PRICEINPUT");
    priceinput.value=(n_invited-discount)+".00";
    fdjt.ID("PRICE").innerHTML=(n_invited-discount)+".00";
    fdjt.ID("DISCOUNT").innerHTML=(discount)+".00";
    fdjt.ID("TOTALPRICE").innerHTML=(n_invited)+".00";}

function invite_keypress(evt){
  var target=fdjt.UI.T(evt);
  var ch=evt.charCode||evt.keyCode;
  if (ch!==13) return;
  fdjt.UI.cancel(evt);
  var string=target.value; target.value="";
  var emails=string.split(",");
  var i=0; var lim=emails.length;
  while (i<lim) {
    var email=emails[i++];
    var checkbox=fdjt.DOM.Checkbox("INVITE",email);
    checkbox.checked=true;
    fdjt.DOM(fdjt.ID("INVITATIONS")," ",
            fdjt.DOM("span.checkspan",checkbox,email));}}

function showMessage(){
    var message=fdjt.State.getCookie("SBOOKSPOPUP");
    if (message) fdjt.UI.alertFor(10,message);
    fdjt.State.clearCookie("SBOOKSPOPUP","/","sbooks.net");
    fdjt.State.clearCookie("SBOOKSMESSAGE","/","sbooks.net");}

function watchTask(taskid,callback){
    var fdjtDOM=fdjt.DOM, fdjtAjax=fdjt.Ajax;
    var checking=false, done=false, timer=false;
    var status_link="https://admin.sbooks.net/task/"+taskid;
    function waiting(){
	if (checking) return;
	else if (done) {
	    if (timer) clearInterval(timer);
	    timer=false;
	    return;}
	else {
	    checking=true;
	    fdjtAjax.jsonCall(checkstatus,status_link);}}
    function checkstatus(result){
	var uuid=result.uuid, kind=result.kind;
	if (kind[0]===":") kind=kind.slice(1);
	if ((uuid)&&(uuid.search("#U")===0)) uuid=uuid.slice(2);
	if ((result.completed)&&((kind==="UPDATE")||(kind==="IMPORT"))) {
	    var button=fdjt.ID("SBOOKPUBLISHBUTTON");
	    if (button) button.disabled=false;}
        if ((result.completed)||(result.failed)) {
            done=true; callback(result);}
	else checking=false;}
    timer=setInterval(waiting,10000);
    return timer;}

fdjt.DOM.addListener(window,"load",showMessage);
fdjt.DOM.addListener(window,"load",fdjt.DOM.addCXClasses);

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
