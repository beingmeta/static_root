/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

/* Copyright (C) 2011-2012 beingmeta, inc.
   This implements the interaction logic used by the sBooks flyleaf.  */

function changeAccess(evt)
{
    evt=evt||event;
    var target=fdjt.UI.T(evt);
    var tbody=fdjt.DOM.getParent(target,"TBODY");
    var form=fdjt.DOM.getParent(target,"FORM");
    setTimeout(function(){
        var access=fdjt.DOM.getInputValues(form,"ACCESS");
        if (access[0]!==":OPEN") {
            fdjt.DOM.addClass(tbody,"ispaid");
            fdjt.ID("SETPRICE").focus();
            return;}
        else fdjt.DOM.dropClass(tbody,"ispaid");},
               100);
}

var precString=fdjt.String.precString;

function changePrice(evt)
{
    var price_input=fdjt.ID("SETPRICE");
    var setprice=((price_input)&&(parseFloat(price_input.value)));
    if ((typeof setprice === 'number')&&
        (setprice>0)&&(setprice<100)) {
        var giftprice=Math.max(setprice*0.2,1.00)+setprice-0.01;
        var buyprice=Math.max(setprice*0.4,2.00)+setprice-0.01;
        var giftelt=fdjt.ID("GIFTPRICE");
        var buyelt=fdjt.ID("BUYPRICE");
        if (giftelt) giftelt.innerHTML=precString(giftprice,2);
        if (buyelt) buyelt.innerHTML=precString(buyprice,2);}
    return;
}

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
