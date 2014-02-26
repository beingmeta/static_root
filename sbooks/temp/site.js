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

