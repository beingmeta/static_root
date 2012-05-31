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
    var target=fdjtUI.T(evt);
    var tabid=fdjtDOM.findAttrib(target,'tabid');
    if (!(tabid)) return;
    var tbody=fdjtDOM.getParent(target,'tbody');
    var curtab=tbody.getAttribute('tab');
    if ((curtab)&&(curtab===tabid)) tbody.removeAttribute('tab');
    else tbody.setAttribute('tab',tabid);
    tbody.className=tbody.className;
}

