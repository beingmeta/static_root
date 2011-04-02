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

