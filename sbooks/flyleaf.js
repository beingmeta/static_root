function changePricing(evt)
{
    var target=fdjtUI.T(evt);
    var input=fdjtDOM.getParent(target,'input');
    var tbody=fdjtDOM.getParent(target,'tbody');
    if (tbody) fdjtDOM.setClass(tbody,'ispaid',input.checked);
    return;
}

function changePrice(evt)
{
    var price_input=fdjtID("BASEPRICE");
    var baseprice=((price_input)&&(parseFloat(price_input.value)));
    if ((typeof baseprice === 'number')&&
	(baseprice>0)&&(baseprice<100)) {
	var giftdelta=Math.floor(Math.max(baseprice*0.15,1.00))-0.01;
	var pricedelta=Math.floor(Math.max(baseprice*0.30,2.00))-0.01;
	var giftprice=fdjtID("GIFTPRICE");
	var purchaseprice=fdjtID("PURCHASEPRICE");
	if (giftprice)
	    giftprice.innerHTML=fdjtString(baseprice+giftdelta);
	if (purchaseprice)
	    purchaseprice.innerHTML=fdjtString(baseprice+pricedelta);}
    return;
}