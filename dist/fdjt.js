/* -*- Mode: Javascript; -*- */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file was created from several component files and is
   part of the FDJT web toolkit (www.fdjt.org)

   Portions of this code are available under the following license:
   * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
   * Released under MIT license, http://cubiq.org/license

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   The copyright notice of the individual files are all prefixed by
   a copyright notice of the form "Copyright (C) ...".

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

var fdjt=((typeof fdjt === "undefined")?({}):(fdjt));
var fdjt_versions=((typeof fdjt_versions === "undefined")?([]):
		   ((fdjt_versions)||[]));
(function(){
    "use strict";
    fdjt_versions.decl=function(name,num){
        if ((!(fdjt_versions[name]))||(fdjt_versions[name]<num))
            fdjt_versions[name]=num;};

    // Some augmentations
    if (!(Array.prototype.indexOf))
        Array.prototype.indexOf=function(elt,i){
            if (!(i)) i=0; var len=this.length;
            while (i<len) if (this[i]===elt) return i; else i++;
            return -1;};
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = function(o){
            if (o !== Object(o))
                throw new TypeError('Object.keys called on non-object');
            var ret=[], p;
            for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
            return ret;};}

    if (!String.prototype.trim) {
        String.prototype.trim = (function () {
            var trimLeft  = /^\s+/, trimRight = /\s+$/;
            
            return function () {
                return this.replace(trimLeft, "").replace(trimRight, "");};});}
})();
(function() {
    "use strict";
    /* For jshint */
    /* global global: false, window: false, 
              module: false, setTimeout: false */
    var root;

    if (typeof window === 'object' && window) {
        root = window;
    } else {
        root = global;
    }

    // Use polyfill for setImmediate for performance gains
    var asap = ((root.Promise)&&(root.Promise.immediateFn)) ||
        root.setImmediate ||
        function(fn) { setTimeout(fn, 1); };

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
        return function() {
            fn.apply(thisArg, arguments);
        };
    }

    var isArray = Array.isArray || function(value) {
        return Object.prototype.toString.call(value) ===
            "[object Array]"; };

    function PromiseFillIn(fn) {
        if (typeof this !== 'object')
            throw new TypeError('Use "new" to make Promises');
        if (typeof fn !== 'function')
            throw new TypeError('not a function');
        this._state = null;
        this._value = null;
        this._deferreds = [];

        doResolve(fn, bind(resolve, this), bind(reject, this));
    }

    function handle(deferred) {
	// jshint validthis: true
        var me = this;
        if (this._state === null) {
            this._deferreds.push(deferred);
            return;
        }
        asap(function() {
            var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                (me._state ? deferred.resolve : deferred.reject)(me._value);
                return;
            }
            var ret;
            try {
                ret = cb(me._value);
            }
            catch (e) {
                deferred.reject(e);
                return;
            }
            deferred.resolve(ret);
        });
    }

    function resolve(newValue) {
	// jshint validthis: true
        try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
            if (newValue === this)
                throw new TypeError(
                    'A promise cannot be resolved with itself.');
            if (newValue &&
                (typeof newValue === 'object' ||
                 typeof newValue === 'function')) {
                var then = newValue.then;
                if (typeof then === 'function') {
                    doResolve(bind(then, newValue),
                              bind(resolve, this),
                              bind(reject, this));
                    return;
                }
            }
            this._state = true;
            this._value = newValue;
            finale.call(this);
        } catch (e) { reject.call(this, e); }
    }

    function reject(newValue) {
	// jshint validthis: true
        this._state = false;
        this._value = newValue;
        finale.call(this);
    }

    function finale() {
	// jshint validthis: true
        for (var i = 0, len = this._deferreds.length;
             i < len;
             i++) {
            handle.call(this, this._deferreds[i]);
        }
        this._deferreds = null;
    }
    
    function Handler(onFulfilled, onRejected, resolve, reject){
        this.onFulfilled =
            typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected =
            typeof onRejected === 'function' ? onRejected : null;
        this.resolve = resolve;
        this.reject = reject;
    }

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, onFulfilled, onRejected) {
        var done = false;
        try {
            fn(function (value) {
                if (done) return;
                done = true;
                onFulfilled(value);
            }, function (reason) {
                if (done) return;
                done = true;
                onRejected(reason);
            });
        } catch (ex) {
            if (done) return;
            done = true;
            onRejected(ex);
        }
    }

    PromiseFillIn.prototype['catch'] = function (onRejected) {
        return this.then(null, onRejected);
    };

    PromiseFillIn.prototype.then =
        function(onFulfilled, onRejected) {
            var me = this;
            return new PromiseFillIn(function(resolve, reject) {
                handle.call(
                    me,new Handler(onFulfilled, onRejected,
                                   resolve, reject));
            });
        };
    
    PromiseFillIn.all = function () {
        var args = Array.prototype.slice.call(
            arguments.length === 1 && isArray(arguments[0]) ?
                arguments[0] : arguments);

        return new PromiseFillIn(function (resolve, reject) {
            if (args.length === 0) return resolve([]);
            var remaining = args.length;
            function res(i, val) {
                try {
                    if (val &&
                        (typeof val === 'object' ||
                         typeof val === 'function')) {
                        var then = val.then;
                        if (typeof then === 'function') {
                            then.call(val, function (val) {
                                res(i, val); }, reject);
                            return;
                        }
                    }
                    args[i] = val;
                    if (--remaining === 0) {
                        resolve(args);
                    }
                } catch (ex) {
                    reject(ex);
                }
            }
            for (var i = 0; i < args.length; i++) {
                res(i, args[i]);
            }
        });
    };

    PromiseFillIn.resolve = function (value) {
        if (value && typeof value === 'object' &&
            value.constructor === PromiseFillIn) {
            return value;
        }

        return new PromiseFillIn(function (resolve) {
            resolve(value);
        });
    };

    PromiseFillIn.reject = function (value) {
        return new PromiseFillIn(function (resolve, reject) {
            reject(value);
        });
    };

    PromiseFillIn.race = function (values) {
        return new PromiseFillIn(function (resolve, reject) {
            for(var i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject);
            }
        });
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PromiseFillIn;
    } else if (!root.Promise) {
        root.Promise = PromiseFillIn;
    }
})();
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/async.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
    of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

    Use, modification, and redistribution of this program is permitted
    under either the GNU General Public License (GPL) Version 2 (or
    any later version) or under the GNU Lesser General Public License
    (version 3 or later).

    These licenses may be found at www.gnu.org, particularly:
      http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
      http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

/* Time functions */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

fdjt.Async=fdjt.ASync=fdjt.async=
    (function (){
        "use strict";
        /* global
           setTimeout: false, clearTimeout: false,
           Promise: false */

        function fdjtAsync(fn,args){
            function async_call(resolve,reject){
                function doit(){
                    var value;
                    try {
                        if (args) value=fn.call(null,args);
                        else value=fn();
                        resolve(value);}
                    catch (ex) {reject(ex);}}
                setTimeout(doit,1);}
            return new Promise(async_call);}

        function getnow() {return (new Date()).getTime();}

        function timeslice(fcns,slice,space,stop,done,fail){
            var timer=false;
            if (typeof slice !== 'number') slice=100;
            if (typeof space !== 'number') space=100;
            var i=0; var lim=fcns.length;
            var slicefn=function(){
                var timelim=getnow()+slice;
                var nextspace=false;
                while (i<lim) {
                    var fcn=fcns[i++];
                    if (!(fcn)) continue;
                    else if (typeof fcn === 'number') {
                        nextspace=fcn; break;}
                    else {
                        try {fcn();} catch (ex) {fail(ex);}}
                    if (getnow()>timelim) break;}
                if ((i<lim)&&((!(stop))||(!(stop()))))
                    timer=setTimeout(slicefn,nextspace||space);
                else {
                    clearTimeout(timer); 
                    timer=false;
                    done(false);}};
            return slicefn();}
        fdjtAsync.timeslice=function(fcns,opts){
            if (!(opts)) opts={};
            var slice=opts.slice||100, space=opts.space||100;
            var stop=opts.stop||false;
            function timeslicing(success,failure){
                timeslice(fcns,slice,space,stop,success,failure);}
            return new Promise(timeslicing);};

        function slowmap(fn,vec,watch,done,failed,slice,space,onerr,watch_slice){
            var i=0; var lim=vec.length; var chunks=0;
            var used=0; var zerostart=getnow();
            var timer=false;
            if (!(slice)) slice=100;
            if (!(space)) space=slice;
            if (!(watch_slice)) watch_slice=0;
            var stepfn=function(){
                try {
                    var started=getnow(); var now=started;
                    var stopat=started+slice;
                    if (watch)
                        watch(((i===0)?'start':'resume'),i,lim,chunks,used,
                              zerostart);
                    while ((i<lim)&&((now=getnow())<stopat)) {
                        var elt=vec[i];
                        if ((watch)&&(((watch_slice)&&((i%watch_slice)===0))||
                                      (i+1===lim)))
                            watch('element',i,lim,elt,used,now-zerostart);
                        try {fn(elt);}
                        catch (ex) {
                            var exdata={elt: elt,i: i,lim: lim,vec: vec};
                            if ((onerr)&&(onerr(ex,elt,exdata))) continue;
                            if (failed) return failed(ex);
                            else throw ex;}
                        if ((watch)&&(((watch_slice)&&((i%watch_slice)===0))||
                                      (i+1===lim)))
                            watch('after',i,lim,elt,used+(getnow()-started),
                                  zerostart,getnow()-now);
                        i++;}
                    chunks=chunks+1;
                    if (i<lim) {
                        used=used+(now-started);
                        if (watch) watch('suspend',i,lim,chunks,used,
                                         zerostart);
                        timer=setTimeout(stepfn,space);}
                    else {
                        now=getnow(); used=used+(now-started);
                        clearTimeout(timer); timer=false;
                        if (watch)
                            watch('finishing',i,lim,chunks,used,zerostart);
                        var donetime=((done)&&(getnow()-now));
                        now=getnow(); used=used+(now-started);
                        if (watch)
                            watch('done',i,lim,chunks,used,zerostart,donetime);
                        if ((done)&&(done.call)) 
                            done(vec,now-zerostart,used);}}
                catch (ex) {if (failed) failed(ex);}};
            timer=setTimeout(stepfn,space);}
        fdjtAsync.slowmap=function(fcn,vec,opts){
            if (!(opts)) opts={};
            var slice=opts.slice, space=opts.space, onerr=opts.onerr;
            var watchfn=opts.watchfn, watch_slice=opts.watch;
            var sync=((opts.hasOwnProperty("sync"))?(opts.sync):
                      ((opts.hasOwnProperty("async"))?(!(opts.async)):
                       (false)));
            var donefn=opts.done;
            function slowmapping(resolve,reject){
                if (sync) {
                    var i=0, lim=vec.length; while (i<lim) {
                        var elt=vec[i++];
                        try { fcn(vec[elt]); }
                        catch (ex) {
                            var exdata={elt: elt,i: i,lim: lim,vec: vec};
                            if ((onerr)&&(onerr(ex,elt,exdata))) continue;
                            if (reject) return reject(ex);
                            else throw ex;}}
                    if (resolve) resolve(vec);}
                else slowmap(fcn,vec,watchfn,
                             ((donefn)?(function(){
                                 donefn(); if (resolve) resolve(vec);}):
                              (resolve)),
                             reject,
                             slice,space,onerr,watch_slice);}
            if (watch_slice<1) watch_slice=vec.length*watch_slice;
            return new Promise(slowmapping);};

        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
        fdjtAsync.debounce=debounce;

        function poll(fn, callback, errback, timeout, interval) {
            var endTime = Number(new Date()) + (timeout || 2000);
            interval = interval || 100;

            (function p() {
                // If the condition is met, we're done! 
                if(fn()) {
                    callback();
                }
                // If the condition isn't met but the timeout hasn't elapsed, go again
                else if (Number(new Date()) < endTime) {
                    setTimeout(p, interval);
                }
                // Didn't match and too much time, reject!
                else {
                    errback(new Error('timed out for ' + fn + ': ' + arguments));
                }
            })();
        }
        fdjtAsync.poll=poll;

        function once(fn, context) { 
            var result;

            return function() { 
                if(fn) {
                    result = fn.apply(context || this, arguments);
                    fn = null;
                }

                return result;
            };
        }
        fdjtAsync.once=once;

        return fdjtAsync;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/string.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

fdjt.charnames={"AElig": "Æ",
		"Aacgr": "Ά",
		"Aacute": "Á",
		"Abreve": "Ă",
		"Acirc": "Â",
		"Acy": "А",
		"Agr": "Α",
		"Agrave": "À",
		"Alpha": "Α",
		"Amacr": "Ā",
		"Aogon": "Ą",
		"Aring": "Å",
		"Atilde": "Ã",
		"Auml": "Ä",
		"Barwed": "⌆",
		"Bcy": "Б",
		"Beta": "Β",
		"Bgr": "Β",
		"CHcy": "Ч",
		"Cacute": "Ć",
		"Cap": "⋒",
		"Ccaron": "Č",
		"Ccedil": "Ç",
		"Ccirc": "Ĉ",
		"Cdot": "Ċ",
		"Chi": "Χ",
		"Cup": "⋓",
		"DJcy": "Ђ",
		"DScy": "Ѕ",
		"DZcy": "Џ",
		"Dagger": "‡",
		"Dcaron": "Ď",
		"Dcy": "Д",
		"Delta": "Δ",
		"Dgr": "Δ",
		"Dot": "¨",
		"DotDot": "⃜",
		"Dstrok": "Đ",
		"EEacgr": "Ή",
		"EEgr": "Η",
		"ENG": "Ŋ",
		"ETH": "Ð",
		"Eacgr": "Έ",
		"Eacute": "É",
		"Ecaron": "Ě",
		"Ecirc": "Ê",
		"Ecy": "Э",
		"Edot": "Ė",
		"Egr": "Ε",
		"Egrave": "È",
		"Emacr": "Ē",
		"Eogon": "Ę",
		"Epsilon": "Ε",
		"Eta": "Η",
		"Euml": "Ë",
		"Fcy": "Ф",
		"GJcy": "Ѓ",
		"Gamma": "Γ",
		"Gbreve": "Ğ",
		"Gcedil": "Ģ",
		"Gcirc": "Ĝ",
		"Gcy": "Г",
		"Gdot": "Ġ",
		"Gg": "⋙",
		"Ggr": "Γ",
		"Gt": "≫",
		"HARDcy": "Ъ",
		"Hcirc": "Ĥ",
		"Hstrok": "Ħ",
		"IEcy": "Е",
		"IJlig": "Ĳ",
		"IOcy": "Ё",
		"Iacgr": "Ί",
		"Iacute": "Í",
		"Icirc": "Î",
		"Icy": "И",
		"Idigr": "Ϊ",
		"Idot": "İ",
		"Igr": "Ι",
		"Igrave": "Ì",
		"Imacr": "Ī",
		"Iogon": "Į",
		"Iota": "Ι",
		"Itilde": "Ĩ",
		"Iukcy": "І",
		"Iuml": "Ï",
		"Jcirc": "Ĵ",
		"Jcy": "Й",
		"Jsercy": "Ј",
		"Jukcy": "Є",
		"KHcy": "Х",
		"KHgr": "Χ",
		"KJcy": "Ќ",
		"Kappa": "Κ",
		"Kcedil": "Ķ",
		"Kcy": "К",
		"Kgr": "Κ",
		"LJcy": "Љ",
		"Lacute": "Ĺ",
		"Lambda": "Λ",
		"Larr": "↞",
		"Lcaron": "Ľ",
		"Lcedil": "Ļ",
		"Lcy": "Л",
		"Lgr": "Λ",
		"Ll": "⋘",
		"Lmidot": "Ŀ",
		"Lstrok": "Ł",
		"Lt": "≪",
		"Mcy": "М",
		"Mgr": "Μ",
		"Mu": "Μ",
		"NJcy": "Њ",
		"Nacute": "Ń",
		"Ncaron": "Ň",
		"Ncedil": "Ņ",
		"Ncy": "Н",
		"Ngr": "Ν",
		"Ntilde": "Ñ",
		"Nu": "Ν",
		"OElig": "Œ",
		"OHacgr": "Ώ",
		"OHgr": "Ω",
		"Oacgr": "Ό",
		"Oacute": "Ó",
		"Ocirc": "Ô",
		"Ocy": "О",
		"Odblac": "Ő",
		"Ogr": "Ο",
		"Ograve": "Ò",
		"Omacr": "Ō",
		"Omega": "Ω",
		"Omicron": "Ο",
		"Oslash": "Ø",
		"Otilde": "Õ",
		"Ouml": "Ö",
		"PHgr": "Φ",
		"PSgr": "Ψ",
		"Pcy": "П",
		"Pgr": "Π",
		"Phi": "Φ",
		"Pi": "Π",
		"Prime": "″",
		"Psi": "Ψ",
		"Racute": "Ŕ",
		"Rarr": "↠",
		"Rcaron": "Ř",
		"Rcedil": "Ŗ",
		"Rcy": "Р",
		"Rgr": "Ρ",
		"Rho": "Ρ",
		"SHCHcy": "Щ",
		"SHcy": "Ш",
		"SOFTcy": "Ь",
		"Sacute": "Ś",
		"Scaron": "Š",
		"Scedil": "Ş",
		"Scirc": "Ŝ",
		"Scy": "С",
		"Sgr": "Σ",
		"Sigma": "Σ",
		"Sub": "⋐",
		"Sup": "⋑",
		"THORN": "Þ",
		"THgr": "Θ",
		"TSHcy": "Ћ",
		"TScy": "Ц",
		"Tau": "Τ",
		"Tcaron": "Ť",
		"Tcedil": "Ţ",
		"Tcy": "Т",
		"Tgr": "Τ",
		"Theta": "Θ",
		"Tstrok": "Ŧ",
		"Uacgr": "Ύ",
		"Uacute": "Ú",
		"Ubrcy": "Ў",
		"Ubreve": "Ŭ",
		"Ucirc": "Û",
		"Ucy": "У",
		"Udblac": "Ű",
		"Ugr": "Υ",
		"Ugrave": "Ù",
		"Umacr": "Ū",
		"Uogon": "Ų",
		"Upsi": "Υ",
		"Upsilon": "Υ",
		"Uring": "Ů",
		"Utilde": "Ũ",
		"Uuml": "Ü",
		"Vcy": "В",
		"Vdash": "⊩",
		"Verbar": "‖",
		"Vvdash": "⊪",
		"Wcirc": "Ŵ",
		"Xgr": "Ξ",
		"Xi": "Ξ",
		"YAcy": "Я",
		"YIcy": "Ї",
		"YUcy": "Ю",
		"Yacute": "Ý",
		"Ycirc": "Ŷ",
		"Ycy": "Ы",
		"Yuml": "Ÿ",
		"ZHcy": "Ж",
		"Zacute": "Ź",
		"Zcaron": "Ž",
		"Zcy": "З",
		"Zdot": "Ż",
		"Zeta": "Ζ",
		"Zgr": "Ζ",
		"aacgr": "ά",
		"aacute": "á",
		"abreve": "ă",
		"acirc": "â",
		"acute": "´",
		"acy": "а",
		"aelig": "æ",
		"agr": "α",
		"agrave": "à",
		"alefsym": "ℵ",
		"aleph": "ℵ",
		"alpha": "α",
		"amacr": "ā",
		"amalg": "∐",
		"amp": "&",
		"and": "∧",
		"ang": "∠",
		"ang90": "∟",
		"angmsd": "∡",
		"angsph": "∢",
		"angst": "Å",
		"aogon": "ą",
		"ap": "≈",
		"ape": "≊",
		"apos": "'",
		"aposmod": "ʼ",
		"aring": "å",
		"ast": "*",
		"asymp": "≈",
		"atilde": "ã",
		"auml": "ä",
		"b.Delta": "Δ",
		"b.Gamma": "Γ",
		"b.Lambda": "Λ",
		"b.Omega": "Ω",
		"b.Phi": "Φ",
		"b.Pi": "Π",
		"b.Psi": "Ψ",
		"b.Sigma": "Σ",
		"b.Theta": "Θ",
		"b.Upsi": "Υ",
		"b.Xi": "Ξ",
		"b.alpha": "α",
		"b.beta": "β",
		"b.chi": "χ",
		"b.delta": "δ",
		"b.epsi": "ε",
		"b.epsis": "ε",
		"b.epsiv": "ε",
		"b.eta": "η",
		"b.gamma": "γ",
		"b.gammad": "Ϝ",
		"b.iota": "ι",
		"b.kappa": "κ",
		"b.kappav": "ϰ",
		"b.lambda": "λ",
		"b.mu": "μ",
		"b.nu": "ν",
		"b.omega": "ώ",
		"b.phis": "φ",
		"b.phiv": "ϕ",
		"b.pi": "π",
		"b.piv": "ϖ",
		"b.psi": "ψ",
		"b.rho": "ρ",
		"b.rhov": "ϱ",
		"b.sigma": "σ",
		"b.sigmav": "ς",
		"b.tau": "τ",
		"b.thetas": "θ",
		"b.thetav": "ϑ",
		"b.upsi": "υ",
		"b.xi": "ξ",
		"b.zeta": "ζ",
		"barwed": "⊼",
		"bcong": "≌",
		"bcy": "б",
		"bdquo": "„",
		"becaus": "∵",
		"bepsi": "∍",
		"bernou": "ℬ",
		"beta": "β",
		"beth": "ℶ",
		"bgr": "β",
		"blackstar": "✦",
		"blank": "␣",
		"blk12": "▒",
		"blk14": "░",
		"blk34": "▓",
		"block": "█",
		"bottom": "⊥",
		"bowtie": "⋈",
		"boxDL": "╗",
		"boxDR": "╔",
		"boxDl": "╖",
		"boxDr": "╓",
		"boxH": "═",
		"boxHD": "╦",
		"boxHU": "╩",
		"boxHd": "╤",
		"boxHu": "╧",
		"boxUL": "╝",
		"boxUR": "╚",
		"boxUl": "╜",
		"boxUr": "╙",
		"boxV": "║",
		"boxVH": "╬",
		"boxVL": "╣",
		"boxVR": "╠",
		"boxVh": "╫",
		"boxVl": "╢",
		"boxVr": "╟",
		"boxdL": "╕",
		"boxdR": "╒",
		"boxdl": "┐",
		"boxdr": "┌",
		"boxh": "─",
		"boxhD": "╥",
		"boxhU": "╨",
		"boxhd": "┬",
		"boxhu": "┴",
		"boxuL": "╛",
		"boxuR": "╘",
		"boxul": "┘",
		"boxur": "└",
		"boxv": "│",
		"boxvH": "╪",
		"boxvL": "╡",
		"boxvR": "╞",
		"boxvh": "┼",
		"boxvl": "┤",
		"boxvr": "├",
		"bprime": "‵",
		"breve": "˘",
		"brvbar": "¦",
		"bsim": "∽",
		"bsime": "⋍",
		"bsol": "\\",
		"bull": "•",
		"bump": "≎",
		"bumpe": "≏",
		"cacute": "ć",
		"cap": "∩",
		"caret": "⁁",
		"caron": "ˇ",
		"ccaron": "č",
		"ccedil": "ç",
		"ccirc": "ĉ",
		"cdot": "ċ",
		"cedil": "¸",
		"cent": "¢",
		"chcy": "ч",
		"check": "✓",
		"chi": "χ",
		"cir": "○",
		"circ": "ˆ",
		"cire": "≗",
		"clubs": "♣",
		"colon": ":",
		"colone": "≔",
		"comma": ",",
		"commat": "@",
		"comp": "∁",
		"compfn": "∘",
		"cong": "≅",
		"conint": "∮",
		"coprod": "∐",
		"copy": "©",
		"copysr": "℗",
		"crarr": "↵",
		"cross": "✗",
		"cuepr": "⋞",
		"cuesc": "⋟",
		"cularr": "↶",
		"cup": "∪",
		"cupre": "≼",
		"curarr": "↷",
		"curren": "¤",
		"cuvee": "⋎",
		"cuwed": "⋏",
		"dArr": "⇓",
		"dagger": "†",
		"daleth": "ℸ",
		"darr": "↓",
		"darr2": "⇊",
		"dash": "‐",
		"dashv": "⊣",
		"dblac": "˝",
		"dcaron": "ď",
		"dcy": "д",
		"deg": "°",
		"delta": "δ",
		"dgr": "δ",
		"dharl": "⇃",
		"dharr": "⇂",
		"diam": "⋄",
		"diams": "♦",
		"die": "¨",
		"divide": "÷",
		"divonx": "⋇",
		"djcy": "ђ",
		"dlarr": "↙",
		"dlcorn": "⌞",
		"dlcrop": "⌍",
		"dollar": "$",
		"dot": "˙",
		"drarr": "↘",
		"drcorn": "⌟",
		"drcrop": "⌌",
		"dscy": "ѕ",
		"dstrok": "đ",
		"dtri": "▿",
		"dtrif": "▾",
		"dzcy": "џ",
		"eDot": "≑",
		"eacgr": "έ",
		"eacute": "é",
		"ecaron": "ě",
		"ecir": "≖",
		"ecirc": "ê",
		"ecolon": "≕",
		"ecy": "э",
		"edot": "ė",
		"eeacgr": "ή",
		"eegr": "η",
		"efDot": "≒",
		"egr": "ε",
		"egrave": "è",
		"egs": "⋝",
		"ell": "ℓ",
		"els": "⋜",
		"emacr": "ē",
		"empty": "∅",
		"emsp": " ",
		"emsp13": " ",
		"emsp14": " ",
		"eng": "ŋ",
		"ensp": " ",
		"eogon": "ę",
		"epsi": "ε",
		"epsilon": "ε",
		"epsis": "∊",
		"epsiv": "ο",
		"equals": "=",
		"equiv": "≡",
		"erDot": "≓",
		"esdot": "≐",
		"eta": "η",
		"eth": "ð",
		"euml": "ë",
		"euro": "€",
		"excl": "!",
		"exist": "∃",
		"fcy": "ф",
		"female": "♀",
		"ffilig": "ﬃ",
		"fflig": "ﬀ",
		"ffllig": "ﬄ",
		"filig": "ﬁ",
		"flat": "♭",
		"fllig": "ﬂ",
		"fnof": "ƒ",
		"forall": "∀",
		"fork": "⋔",
		"frac12": "½",
		"frac13": "⅓",
		"frac14": "¼",
		"frac15": "⅕",
		"frac16": "⅙",
		"frac18": "⅛",
		"frac23": "⅔",
		"frac25": "⅖",
		"frac34": "¾",
		"frac35": "⅗",
		"frac38": "⅜",
		"frac45": "⅘",
		"frac56": "⅚",
		"frac58": "⅝",
		"frac78": "⅞",
		"frasl": "⁄",
		"frown": "⌢",
		"gE": "≧",
		"gEl": "⪌",
		"gacute": "ǵ",
		"gamma": "γ",
		"gammad": "Ϝ",
		"gap": "⪆",
		"gbreve": "ğ",
		"gcedil": "ģ",
		"gcirc": "ĝ",
		"gcy": "г",
		"gdot": "ġ",
		"ge": "≥",
		"gel": "⋛",
		"ges": "≥",
		"ggr": "γ",
		"gimel": "ℷ",
		"gjcy": "ѓ",
		"gl": "≷",
		"gnE": "≩",
		"gnap": "⪊",
		"gne": "≩",
		"gnsim": "⋧",
		"grave": "`",
		"gsdot": "⋗",
		"gsim": "≳",
		"gt": ">",
		"gvnE": "≩",
		"hArr": "⇔",
		"hairsp": " ",
		"half": "½",
		"hamilt": "ℋ",
		"hardcy": "ъ",
		"harr": "↔",
		"harrw": "↭",
		"hcirc": "ĥ",
		"hearts": "♥",
		"hellip": "…",
		"horbar": "―",
		"hstrok": "ħ",
		"hybull": "⁃",
		"hyphen": "-",
		"iacgr": "ί",
		"iacute": "í",
		"icirc": "î",
		"icy": "и",
		"idiagr": "ΐ",
		"idigr": "ϊ",
		"iecy": "е",
		"iexcl": "¡",
		"iff": "⇔",
		"igr": "ι",
		"igrave": "ì",
		"ijlig": "ĳ",
		"imacr": "ī",
		"image": "ℑ",
		"incare": "℅",
		"infin": "∞",
		"inodot": "ı",
		"int": "∫",
		"intcal": "⊺",
		"iocy": "ё",
		"iogon": "į",
		"iota": "ι",
		"iquest": "¿",
		"isin": "∈",
		"itilde": "ĩ",
		"iukcy": "і",
		"iuml": "ï",
		"jcirc": "ĵ",
		"jcy": "й",
		"jsercy": "ј",
		"jukcy": "є",
		"kappa": "κ",
		"kappav": "ϰ",
		"kcedil": "ķ",
		"kcy": "к",
		"kgr": "κ",
		"kgreen": "ĸ",
		"khcy": "х",
		"khgr": "χ",
		"kjcy": "ќ",
		"lAarr": "⇚",
		"lArr": "⇐",
		"lE": "≦",
		"lEg": "⪋",
		"lacute": "ĺ",
		"lagran": "ℒ",
		"lambda": "λ",
		"lang": "〈",
		"lap": "⪅",
		"laquo": "«",
		"larr": "←",
		"larr2": "⇇",
		"larrhk": "↩",
		"larrlp": "↫",
		"larrtl": "↢",
		"lcaron": "ľ",
		"lcedil": "ļ",
		"lceil": "⌈",
		"lcub": "{",
		"lcy": "л",
		"ldot": "⋖",
		"ldquo": "“",
		"ldquor": "„",
		"le": "≤",
		"leg": "⋚",
		"les": "≤",
		"lfloor": "⌊",
		"lg": "≶",
		"lgr": "λ",
		"lhard": "↽",
		"lharu": "↼",
		"lhblk": "▄",
		"ljcy": "љ",
		"lmidot": "ŀ",
		"lnE": "≨",
		"lnap": "⪉",
		"lne": "≨",
		"lnsim": "⋦",
		"lowast": "∗",
		"lowbar": "_",
		"loz": "◊",
		"lozf": "✦",
		"lpar": "(",
		"lrarr2": "⇆",
		"lrhar2": "⇋",
		"lrm": "‎",
		"lsaquo": "‹",
		"lsh": "↰",
		"lsim": "≲",
		"lsqb": "[",
		"lsquo": "‘",
		"lsquor": "‚",
		"lstrok": "ł",
		"lt": "<",
		"lthree": "⋋",
		"ltimes": "⋉",
		"ltri": "◃",
		"ltrie": "⊴",
		"ltrif": "◂",
		"lvnE": "≨",
		"macr": "¯",
		"male": "♂",
		"malt": "✠",
		"map": "↦",
		"marker": "▮",
		"mcy": "м",
		"mdash": "—",
		"mgr": "μ",
		"micro": "µ",
		"mid": "∣",
		"middot": "·",
		"minus": "−",
		"minusb": "⊟",
		"mldr": "…",
		"mnplus": "∓",
		"models": "⊧",
		"mu": "μ",
		"mumap": "⊸",
		"nVDash": "⊯",
		"nVdash": "⊮",
		"nabla": "∇",
		"nacute": "ń",
		"nap": "≉",
		"napos": "ŉ",
		"natur": "♮",
		"nbsp": " ",
		"ncaron": "ň",
		"ncedil": "ņ",
		"ncong": "≇",
		"ncy": "н",
		"ndash": "–",
		"ne": "≠",
		"nearr": "↗",
		"nequiv": "≢",
		"nexist": "∄",
		"nge": "≱",
		"nges": "≱",
		"ngr": "ν",
		"ngt": "≯",
		"nhArr": "⇎",
		"nharr": "↮",
		"ni": "∋",
		"njcy": "њ",
		"nlArr": "⇍",
		"nlarr": "↚",
		"nldr": "‥",
		"nle": "≰",
		"nles": "≰",
		"nlt": "≮",
		"nltri": "⋪",
		"nltrie": "⋬",
		"nmid": "∤",
		"not": "¬",
		"notin": "∉",
		"npar": "∦",
		"npr": "⊀",
		"npre": "⋠",
		"nrArr": "⇏",
		"nrarr": "↛",
		"nrtri": "⋫",
		"nrtrie": "⋭",
		"nsc": "⊁",
		"nsce": "⋡",
		"nsim": "≁",
		"nsime": "≄",
		"nsmid": "∤",
		"nspar": "∦",
		"nsub": "⊄",
		"nsubE": "⊈",
		"nsube": "⊈",
		"nsup": "⊅",
		"nsupE": "⊉",
		"nsupe": "⊉",
		"ntilde": "ñ",
		"nu": "ν",
		"num": "#",
		"numero": "№",
		"numsp": " ",
		"nvDash": "⊭",
		"nvdash": "⊬",
		"oS": "Ⓢ",
		"oacgr": "ό",
		"oacute": "ó",
		"oast": "⊛",
		"ocir": "⊚",
		"ocirc": "ô",
		"ocy": "о",
		"odash": "⊝",
		"odblac": "ő",
		"odot": "⊙",
		"oelig": "œ",
		"ogon": "˛",
		"ogr": "ο",
		"ograve": "ò",
		"ohacgr": "ώ",
		"ohgr": "ω",
		"ohm": "Ω",
		"olarr": "↺",
		"oline": "‾",
		"omacr": "ō",
		"omega": "ω",
		"omicron": "ο",
		"ominus": "⊖",
		"oplus": "⊕",
		"or": "∨",
		"orarr": "↻",
		"order": "ℴ",
		"ordf": "ª",
		"ordm": "º",
		"oslash": "ø",
		"osol": "⊘",
		"otilde": "õ",
		"otimes": "⊗",
		"ouml": "ö",
		"par": "∥",
		"para": "¶",
		"part": "∂",
		"pcy": "п",
		"percnt": "%",
		"period": ".",
		"permil": "‰",
		"perp": "⊥",
		"pgr": "π",
		"phgr": "φ",
		"phi": "φ",
		"phis": "φ",
		"phiv": "ϕ",
		"phmmat": "ℳ",
		"phone": "☎",
		"pi": "π",
		"piv": "ϖ",
		"planck": "ℏ",
		"plus": "+",
		"plusb": "⊞",
		"plusdo": "∔",
		"plusmn": "±",
		"pound": "£",
		"pr": "≺",
		"prap": "⪷",
		"pre": "≼",
		"prime": "′",
		"prnE": "⪵",
		"prnap": "⪹",
		"prnsim": "⋨",
		"prod": "∏",
		"prop": "∝",
		"prsim": "≾",
		"psgr": "ψ",
		"psi": "ψ",
		"puncsp": " ",
		"quest": "?",
		"quot": "\"",
		"rAarr": "⇛",
		"rArr": "⇒",
		"racute": "ŕ",
		"radic": "√",
		"rang": "〉",
		"raquo": "»",
		"rarr": "→",
		"rarr2": "⇉",
		"rarrhk": "↪",
		"rarrlp": "↬",
		"rarrtl": "↣",
		"rarrw": "↝",
		"rcaron": "ř",
		"rcedil": "ŗ",
		"rceil": "⌉",
		"rcub": "}",
		"rcy": "р",
		"rdquo": "”",
		"rdquor": "“",
		"real": "ℜ",
		"rect": "▭",
		"reg": "®",
		"rfloor": "⌋",
		"rgr": "ρ",
		"rhard": "⇁",
		"rharu": "⇀",
		"rho": "ρ",
		"rhov": "ϱ",
		"ring": "˚",
		"rlarr2": "⇄",
		"rlhar2": "⇌",
		"rlm": "‏",
		"rpar": ")",
		"rpargt": "⦔",
		"rsaquo": "›",
		"rsh": "↱",
		"rsqb": "]",
		"rsquo": "’",
		"rsquor": "‘",
		"rthree": "⋌",
		"rtimes": "⋊",
		"rtri": "▹",
		"rtrie": "⊵",
		"rtrif": "▸",
		"rx": "℞",
		"sacute": "ś",
		"samalg": "∐",
		"sbquo": "‚",
		"sbsol": "\\",
		"sc": "≻",
		"scap": "⪸",
		"scaron": "š",
		"sccue": "≽",
		"sce": "≽",
		"scedil": "ş",
		"scirc": "ŝ",
		"scnE": "⪶",
		"scnap": "⪺",
		"scnsim": "⋩",
		"scsim": "≿",
		"scy": "с",
		"sdot": "⋅",
		"sdotb": "⊡",
		"sect": "§",
		"semi": ";",
		"setmn": "∖",
		"sext": "✶",
		"sfgr": "ς",
		"sfrown": "⌢",
		"sgr": "σ",
		"sharp": "♯",
		"shchcy": "щ",
		"shcy": "ш",
		"shy": "­",
		"sigma": "σ",
		"sigmaf": "ς",
		"sigmav": "ς",
		"sim": "∼",
		"sime": "≃",
		"smid": "∣",
		"smile": "⌣",
		"softcy": "ь",
		"sol": "/",
		"spades": "♠",
		"spar": "∥",
		"sqcap": "⊓",
		"sqcup": "⊔",
		"sqsub": "⊏",
		"sqsube": "⊑",
		"sqsup": "⊐",
		"sqsupe": "⊒",
		"squ": "□",
		"square": "□",
		"squf": "▪",
		"ssetmn": "∖",
		"ssmile": "⌣",
		"sstarf": "⋆",
		"star": "☆",
		"starf": "★",
		"sub": "⊂",
		"subE": "⊆",
		"sube": "⊆",
		"subnE": "⊊",
		"subne": "⊊",
		"sum": "∑",
		"sung": "♪",
		"sup": "⊃",
		"sup1": "¹",
		"sup2": "²",
		"sup3": "³",
		"supE": "⊇",
		"supe": "⊇",
		"supnE": "⊋",
		"supne": "⊋",
		"szlig": "ß",
		"target": "⌖",
		"tau": "τ",
		"tcaron": "ť",
		"tcedil": "ţ",
		"tcy": "т",
		"tdot": "⃛",
		"telrec": "⌕",
		"tgr": "τ",
		"there4": "∴",
		"theta": "θ",
		"thetas": "θ",
		"thetasym": "ϑ",
		"thetav": "ϑ",
		"thgr": "θ",
		"thinsp": " ",
		"thkap": "≈",
		"thksim": "∼",
		"thorn": "þ",
		"tilde": "˜",
		"times": "×",
		"timesb": "⊠",
		"top": "⊤",
		"tprime": "‴",
		"trade": "™",
		"trie": "≜",
		"tscy": "ц",
		"tshcy": "ћ",
		"tstrok": "ŧ",
		"twixt": "≬",
		"uArr": "⇑",
		"uacgr": "ύ",
		"uacute": "ú",
		"uarr": "↑",
		"uarr2": "⇈",
		"ubrcy": "ў",
		"ubreve": "ŭ",
		"ucirc": "û",
		"ucy": "у",
		"udblac": "ű",
		"udiagr": "ΰ",
		"udigr": "ϋ",
		"ugr": "υ",
		"ugrave": "ù",
		"uharl": "↿",
		"uharr": "↾",
		"uhblk": "▀",
		"ulcorn": "⌜",
		"ulcrop": "⌏",
		"umacr": "ū",
		"uml": "¨",
		"uogon": "ų",
		"uplus": "⊎",
		"upsi": "υ",
		"upsih": "ϒ",
		"upsilon": "υ",
		"urcorn": "⌝",
		"urcrop": "⌎",
		"uring": "ů",
		"utilde": "ũ",
		"utri": "▵",
		"utrif": "▴",
		"uuml": "ü",
		"vArr": "⇕",
		"vDash": "⊨",
		"varr": "↕",
		"vcy": "в",
		"vdash": "⊢",
		"veebar": "⊻",
		"vellip": "⋮",
		"verbar": "|",
		"vltri": "⊲",
		"vprime": "′",
		"vprop": "∝",
		"vrtri": "⊳",
		"vsubnE": "⊊",
		"vsubne": "⊊",
		"vsupnE": "⊋",
		"vsupne": "⊋",
		"wcirc": "ŵ",
		"wedgeq": "≙",
		"weierp": "℘",
		"whitestar": "✧",
		"wreath": "≀",
		"xcirc": "○",
		"xdtri": "▽",
		"xgr": "ξ",
		"xhArr": "↔",
		"xharr": "↔",
		"xi": "ξ",
		"xlArr": "⇐",
		"xrArr": "⇒",
		"xutri": "△",
		"yacute": "ý",
		"yacy": "я",
		"ycirc": "ŷ",
		"ycy": "ы",
		"yen": "¥",
		"yicy": "ї",
		"yucy": "ю",
		"yuml": "ÿ",
		"zacute": "ź",
		"zcaron": "ž",
		"zcy": "з",
		"zdot": "ż",
		"zeta": "ζ",
		"zgr": "ζ",
		"zhcy": "ж",
		"zwj": "‍",
		"zwnj": "‌"};


/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/string.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

fdjt.String=
    (function(){
        "use strict";
        function fdjtString(string){
            if ((typeof string !== 'string')&&
                (!(string instanceof String)))
                return stringify(string);
            var output="", arg;
            var cmd=string.indexOf('%'); var i=1;
            while (cmd>=0) {
                if (cmd>0) output=output+string.slice(0,cmd);
                if (string[cmd+1]==='%') output=output+'%';
                else if (string[cmd+1]==='o') {
                    arg=arguments[i++];
                    if (typeof arg === 'string')
                        output=output+"'"+arg+"'";
                    else if (typeof arg === 'number')
                        output=output+arg;
                    else if (Array.isArray(arg)) {
                        var j=0, len=arg.length;
                        output=output+"[";
                        while (j<len) {
                            output=output+((j>0)?(","):(""))+
                                stringify(arg[j++]);}
                        output=output+"]";}
                    else output=output+stringify(arg);}
                else if (string[cmd+1]==='j') {
                    arg=arguments[i++];
                    if (Array.isArray(arg)) {
                        var k=0, lim=arg.length;
                        output=output+"[";
                        while (k<lim) {
                            output=output+((k>0)?(","):(""))+JSON.stringify(arg[k++]);}}
                    else if (typeof arg === "object") {
                        var objstr=false;
                        try {objstr=JSON.stringify(arg);}
                        catch (ex1) {
                            var norm={}; for (var p in arg) {
                                if (arg.hasOwnProperty(p)) {
                                    var pv=arg[p], nv;
                                    if (Array.isArray(pv)) {
                                        nv=[]; var ei=0, elim=pv.length;
                                        while (ei<elim) {
                                            var e=pv[ei++], sv;
                                            try {sv=fdjtString(e);}
                                            catch (ex2) {sv=e.toString();}
                                            nv.push(sv);}}
                                    else {
                                        try {nv=fdjtString(pv);}
                                        catch (ex) {nv=pv.toString();}}
                                    norm[p]=nv;}}
                            objstr=JSON.stringify(norm);}
                        output=output+objstr;}
                    else output=output+JSON.stringify(arg);}
                else if ((string[cmd+1]==='x')&&
                         (typeof arguments[i] === 'number')&&
                         (arguments[i]>=0)&&
                         ((arguments[i]%1)>=0)) {
                    arg=arguments[i++];
                    output=output+arg.toString(16);}
                else if (arguments[i])
                    output=output+arguments[i++];
                else if (typeof arguments[i] === 'undefined') {
                    output=output+'?undef?'; i++;}
                else output=output+arguments[i++];
                string=string.slice(cmd+2);
                cmd=string.indexOf('%');}
            output=output+string;
            return output;}

        var notspace=/[^ \n\r\t\f\x0b\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u202f\u205f\u3000\uf3ff]/g;

        fdjtString.nbsp="\u00A0";
        fdjtString.middot="\u00B7";
        fdjtString.emdash="\u2013";
        fdjtString.endash="\u2014";
        fdjtString.lsq="\u2018";
        fdjtString.rsq="\u2019";
        fdjtString.ldq="\u201C";
        fdjtString.rdq="\u201D";

        function stringify(arg){
            if (typeof arg === 'undefined') return '?undef?';
            else if (!(arg)) return arg;
            else if (typeof arg === 'number') return ""+arg;
            else if (arg.tagName) {
                var output="["+arg.tagName;
                if (arg.className)
                    output=output+"."+arg.className.replace(/\s+/g,'.');
                if (arg.id) output=output+"#"+arg.id;
                if (arg.name) output=output+"[name="+arg.name+"]";
                var txt=((arg.innerText)?(arg.innerText.trim()):
                         (stripMarkup(arg.innerHTML).trim()));
                if ((!(txt))||(txt.length===0)) {}
                else if (txt.length<32)
                    output=output+'\''+txt.replace(/\n/g,'\\n')+'\'';
                else output=output+'\''+txt.slice(0,16).replace(/\n/g,'\\n')+'\'...';
                return output+"]";}
            else if (arg.nodeType) {
                if (arg.nodeType===3)
                    return '["'+arg.nodeValue+'"]';
                else return '<'+arg.nodeType+'>';}
            else if (arg.oid) return arg.oid;
            else if (arg._fdjtid) return '#@'+arg._fdjtid;
            else if ((arg.type)&&((arg.target)||(arg.srcElement))) {
                var target=arg.target||arg.srcElement;
                return "["+arg.type+"@"+stringify(target)+
                    ((((arg.target)||(arg.srcElement)).nodeType)?
                     (getDOMEventInfo(arg)):(""))+"]";}
            else return ""+arg;}

        function getDOMEventInfo(arg){
            var info="(m="+
                ((arg.shiftKey===true)?"s":"")+
                ((arg.ctrlKey===true)?"c":"")+
                ((arg.metaKey===true)?"m":"")+
                ((arg.altKey===true)?"a":"")+
                ((typeof arg.button !== "undefined")?
                 (",b="+(arg.button)):(""))+
                ((typeof arg.which !== "undefined")?
                 (",w="+(arg.which)):(""));
            var ox=arg.clientX, oy=arg.clientY;
            if ((typeof ox === "number")||(typeof oy === "number"))
                info=info+",cx="+ox+",cy="+oy;
            if (arg.touches)
                info=info+",touches="+arg.touches.length;
            if (arg.keyCode) info=info+",kc="+arg.keyCode;
            if (arg.charCode) info=info+",cc="+arg.charCode;
            return info+")";}

        var spacechars=" \n\r\t\f\x0b\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u202f\u205f\u3000\uf3ff";

        fdjtString.truncate=function(string,lim){
            if (!(lim)) lim=42;
            if (string.length<lim) return string;
            else return string.slice(0,lim);};

        var floor=Math.floor;

        function ellipsize(string,lim,fudge){
            var before, after;
            var chopped, broke;
            if (typeof fudge !== 'number') fudge=0.1;
            if (!(lim)) return string;
            else if (typeof lim === "number") {}
            else if (lim.constructor === Array) {
                before=lim[0]||0; after=lim[1]||0; lim=after+before;}
            else return string;
            if (!(lim)) return string;
            else if (string.length<(lim+floor(fudge*lim)))
                return string;
            else if ((before)&&(after)) {
                var len=string.length;
                var start, end; // of the elided text
                if (/\s/.test(string[before])===0) 
                    start=before;
                else {
                    chopped=string.slice(0,before);
                    broke=chopped.search(/\s+\w+$/);
                    if (broke>0) start=broke; else start=before;}
                if (/\s/.test(string[len-after])===0) end=len-after;
                else {
                    chopped=string.slice(len-after);
                    broke=chopped.search(/\s+/);
                    if (broke>0) end=(len-after)+broke;
                    else end=after;}
                return [string.slice(0,start),string.slice(end)];}
            else {
                var edge=string[lim];
                if (/\s/.test(edge)===0) 
                    return string.slice(0,lim);
                else {
                    chopped=string.slice(0,lim);
                    broke=chopped.search(/\s+\w+$/);
                    if (broke>0) return chopped.slice(0,broke);
                    else return chopped;}}}
        fdjtString.ellipsize=ellipsize;
                
        function isEmpty(string){
            if (typeof string === "string")  {
                var pt;
                if (string.length===0) return true;
                else pt=string.search(notspace);
                if (pt<0) return true;
                else if (string[pt]!=='&') return false;
                else {
                    string=string.replace(/&nbsp;/g,"\u00a0");
                    pt=string.search(notspace);
                    return (pt<0);}}
            else return false;}
        fdjtString.isEmpty=isEmpty;

        fdjtString.findSplit=function(string,split,escape){
            var start=0;
            var next;
            while ((next=string.indexOf(split,start))>=0) 
                if ((escape) && (next>0) && (string[next-1]===escape))
                    start=next+1;
            else return next;
            return -1;};

        fdjtString.split=function(string,split,escape,mapfn){
            if ((mapfn) || (escape)) {
                var results=[];
                var start=0; var next;
                while ((next=string.indexOf(split,start))>=0) 
                    if ((escape) && (next>0) && (string[next-1]===escape))
                        start=next+1;
                else if ((mapfn) && (next>start)) {
                    results.push(mapfn(string.slice(start,next))); start=next+1;}
                else if (next>start) {
                    results.push(string.slice(start,next)); start=next+1;}
                else start=next+1;
                if (string.length>start)
                    if (mapfn) results.push(mapfn(string.slice(start)));
                else results.push(string.slice(start));
                return results;}
            else return string.split(split);};

        fdjtString.semiSplit=function(string,escape,mapfn){
            if ((mapfn) || (escape)) {
                var results=[];
                var start=0; var next;
                while ((next=string.indexOf(';',start))>=0) 
                    if ((escape) && (next>0) && (string[next-1]===escape))
                        start=next+1;
                else if ((mapfn) && (next>start)) {
                    results.push(mapfn(string.slice(start,next))); start=next+1;}
                else if (next>start) {
                    results.push(string.slice(start,next)); start=next+1;}
                else start=next+1;
                if (string.length>start)
                    if (mapfn) results.push(mapfn(string.slice(start)));
                else results.push(string.slice(start));
                return results;}
            else return string.split(';');};

        fdjtString.lineSplit=function(string,escape,mapfn){
            if ((mapfn) || (escape)) {
                var results=[];
                var start=0; var next;
                while ((next=string.indexOf('\n',start))>=0) 
                    if ((escape) && (next>0) && (string[next-1]===escape))
                        start=next+1;
                else if ((mapfn) && (next>start)) {
                    results.push(mapfn(string.slice(start,next))); start=next+1;}
                else if (next>start) {
                    results.push(string.slice(start,next)); start=next+1;}
                else start=next+1;
                if (string.length>start)
                    if (mapfn) results.push(mapfn(string.slice(start)));
                else results.push(string.slice(start));
                return results;}
            else return string.split('\n');};

        function trim(string){
            var start=0; var len=string.length; 
            if (len<=0) return string;
            while ((start<len)&&
                   (spacechars.indexOf(string.charAt(start))>-1))
                start++;
            if (start===len) return "";
            var end=len-1;
            while ((end>start)&&(spacechars.indexOf(string.charAt(end))>-1))
                end--;
            if ((start>0)||(end<len)) return string.slice(start,end+1);
            else return string;}
        fdjtString.trim=trim;

        function stdspace(string){
            string=string.replace(/\s+/g," ");
            var start=0; var len=string.length; 
            if (len<=0) return string;
            while ((start<len)&&
                   (spacechars.indexOf(string.charAt(start))>-1))
                start++;
            if (start===len) return "";
            var end=len-1;
            while ((end>start)&&(spacechars.indexOf(string.charAt(end))>-1))
                end--;
            if ((start>0)||(end<len)) return string.slice(start,end+1);
            else return string;}
        fdjtString.stdspace=stdspace;

        function stdcap(string){
            var somecaps=
                string.search(/(^|\s)[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/g)>=0;
            if (!(somecaps))
                return string.replace(/\s+/g," ").replace(/(^ | $)/g,"");
            var words=string.split(/\s+/g);
            var i=0, lim=words.length; while (i<lim) {
                var word=words[i];
                var weird=word.slice(1).search(/[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/)>=0;
                if (!(weird)) 
                    words[i]=word[0].toUpperCase()+word.slice(1);
                i++;}
            return words.join(" ");}
        fdjtString.stdcap=stdcap;

        function flatten(string){
            return string.replace(/\s+/g," ");}
        fdjtString.flatten=flatten;

        function oneline(string){
            string=trim(string);
            var flat=string.replace(/\s*[\f\n\r]+\s+/gm," //\u00B7 ").
                replace(/\s*[\f\n\r]+\s*/gm," // ");
            var tight=flat.replace(/\s\s+/g,"");
            return tight;}
        fdjtString.oneline=oneline;

        function stripMarkup(string){
            return string.replace(/<[^>]*>/g,"");}
        fdjtString.stripMarkup=stripMarkup;

        function unEscape(string){
            if (string.indexOf('\\')>=0)
                return string.replace(/\\(.)/g,"$1");
            else return string;}
        fdjtString.unEscape=unEscape;

        function normstring(string){
            return string.replace(/\W*\s\W*/g," ").toLowerCase();}
        fdjtString.normString=normstring;

        var entities={};
        fdjtString.entities=entities;
        function dCharCode(whole,paren){
            return String.fromCharCode(parseInt(paren,10));}
        function xCharCode(whole,paren){
            return String.fromCharCode(parseInt(paren,16));}
        function nCharCode(whole,paren){
            return fdjt.charnames[paren]||"&"+paren+";";}
        function expandEntity(whole,paren){
            if (entities.hasOwnProperty(paren))
                return entities[paren];
            else return "&"+paren+";";}
        function decodeEntities(string) {
            return string.replace(/&#(\d+);/g,dCharCode).
                replace(/&#x([0123456789ABCDEFabcdef]+);/g,xCharCode).
                replace(/&([abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.]+)/g,
                        nCharCode).
                replace(/&([A-Za-z][A-Za-z0-9-_.]+;)/g,
                        expandEntity);}
        fdjtString.decodeEntities=decodeEntities;
        function expandEntities(string) {
            return string.replace(/&([A-Za-z][A-Za-z0-9-_.]+);/g,
                                  expandEntity);}
        fdjtString.expandEntities=expandEntities;

        var numpat=/^\d+(\.\d+)$/;
        function getMatch(string,rx,i,literal){
            var match=rx.exec(string);
            if (typeof i === "undefined") i=0;
            if ((match)&&(match.length>i)) {
                if (literal) return match[i];
                else if (numpat.test(match[i]))
                    return parseFloat(match[i]);
                else return match[i];}
            else return false;}
        fdjtString.getMatch=getMatch;

        function segment(string,brk,start,keepspace) {
            if (start) string=string.slice(start);
            var brk_source=((typeof brk === "string")?(brk):(brk.source));
            var brk_flags=((typeof brk === "string")?(""):
                           ((brk.ignoreCase)?("i"):("")));
            var brkpat=new RegExp("("+brk_source+")",brk_flags);
            var results=[], segs=string.split(brkpat);
            var i=0, lim=segs.length, merged=false; while (i<lim) {
                var seg=segs[i++], sep=segs[i++];
                if ((!(seg))||(seg.search(/\S/)<0)) continue;
                if ((seg.length)&&(seg.slice(-1)==="\\")&&
                    ((seg.length<2)||(seg.slice(-2,-1)!=="\\"))) {
                    var unescaped=seg.slice(0,-1)+sep;
                    if (merged) merged=merged+unescaped;
                    else merged=unescaped;}
                else if (merged) {
                    if (keepspace)
                        results.push(merged+seg);
                    else results.push(stdspace(merged+seg));
                    merged=false;}
                else if (keepspace)
                    results.push(seg);
                else results.push(stdspace(seg));}
            return results;}
        fdjtString.segment=segment;
        
        function padNum(num,digits,prec){
            var ndigits=
                ((num<10)?(1):(num<100)?(2):(num<1000)?(3):(num<10000)?(4):
                 (num<100000)?(5):(num<1000000)?(6):(num<1000000)?(7):
                 (num<100000000)?(8):(num<1000000000)?(9):(num<10000000000)?(10):(11));
            if ((!(prec))&&(digits<0)) {prec=-digits; digits=0;}
            var nzeroes=digits-ndigits; var numstring=num.toString();
            var point=numstring.indexOf('.');
            var prefix=""; var suffix=""; var j;
            if (prec) {
                if ((point>=0)&&((point+prec)<numstring.length))
                    numstring=numstring.slice(0,point+prec+1);
                else if ((point<0)||(numstring.length<(point+prec+1))) {
                    j=0; var pad=(point+prec+1)-numstring.length;
                    if (point<0) suffix=suffix+".";
                    while (j<pad) {suffix=suffix+"0"; j++;}}}
            switch (nzeroes) {
            case 0: prefix=""; break;
            case 1: prefix="0"; break;
            case 2: prefix="00"; break;
            case 3: prefix="000"; break;
            case 4: prefix="0000"; break;
            case 5: prefix="00000"; break;
            case 6: prefix="000000"; break;
            case 7: prefix="0000000"; break;
            case 8: prefix="00000000"; break;
            case 9: prefix="000000000"; break;
            case 10: prefix="0000000000"; break;
            default: {
                j=0; while (j<nzeroes) {prefix=prefix+"0"; j++;}}}
            return prefix+numstring+suffix;}
        fdjtString.padNum=padNum;

        function precString(num,prec){
            var numstring=num.toString();
            var suffix="";
            if ((typeof prec === 'number')&&
                (prec>=0)&&(prec<100)) {
                var point=numstring.indexOf('.');
                if ((point>=0)&&((point+prec)<numstring.length))
                    numstring=numstring.slice(0,point+prec+1);
                else if ((point<0)||(numstring.length<(point+prec+1))) {
                    var j=0; var pad=(point+prec+1)-numstring.length;
                    if (point<0) suffix=".";
                    while (j<=pad) {suffix=suffix+"0"; j++;}}}
            return numstring+suffix;}
        fdjtString.precString=precString;

        /* Getting initials */

        function getInitials(string,n){
            var words=string.split(/\W/); var initials="";
            var i=0; var lim=((n)&&(n<words.length))?(n):(words.length);
            while (i<lim) {
                var word=words[i++];
                if (word.length)
                    initials=initials+word.slice(0,1);}
            return initials;}
        fdjtString.getInitials=getInitials;

        /* More string functions */

        function hasPrefix(string,prefix){
            return ((string.indexOf(prefix))===0);}
        fdjtString.hasPrefix=hasPrefix;

        function hasSuffix(string,suffix){
            return ((string.lastIndexOf(suffix))===(string.length-suffix.length));}
        fdjtString.hasSuffix=hasSuffix;

        function commonPrefix(string1,string2,brk,foldcase){
            var i=0; var last=-1;
            while ((i<string1.length) && (i<string2.length)) {
                if ((string1[i]===string2[i])||
                    ((foldcase)&&
                     (string1[i].toLowerCase()===string2[i].toLowerCase()))) {
                    if (brk) {
                        if (brk===string1[i]) {last=i-1; i++;}
                        else i++;}
                    else last=i++;}
                else break;}
            if (last>=0) return string1.slice(0,last+1);
            else return false;}
        fdjtString.commonPrefix=commonPrefix;

        function commonSuffix(string1,string2,brk,foldcase){
            var i=string1.length, j=string2.length; var last=0;
            while ((i>=0) && (j>=0)) {
                if ((string1[i]===string2[j])||
                    ((foldcase)&&
                     (string1[i].toLowerCase()===string2[i].toLowerCase()))) {
                    if (brk) {
                        if (brk===string1[i]) {last=i+1; i--; j--;}
                        else {i--; j--;}}
                    else {last=i; i--; j--;}}
                else break;}
            if (last>0) return string1.slice(last);
            else return false;}
        fdjtString.commonSuffix=commonSuffix;

        function stripSuffix(string){
            var start=string.search(/\.\w+$/);
            if (start>0) return string.slice(0,start);
            else return string;}
        fdjtString.stripSuffix=stripSuffix;

        function arrayContains(array,element){
            if (array.indexOf)
                return (array.indexOf(element)>=0);
            else {
                var i=0; var len=array.length;
                while (i<len)
                    if (array[i]===element) return true;
                else i++;
                return false;}}

        function add_prefix(ptree,string,i) {
            var strings=ptree.strings;
            if (i===string.length) 
                if ((strings.indexOf) ?
                    (strings.indexOf(string)>=0) :
                    (arrayContains(strings,string)))
                    return false;
            else {
                strings.push(string);
                return true;}
            else if (ptree.splits) {
                var splitchar=string[i];
                var split=ptree[splitchar];
                if (!(split)) {
                    // Create a new split
                    split={};
                    split.strings=[];
                    // We don't really use this, but it might be handy for debugging
                    split.splitchar=splitchar;
                    ptree[splitchar]=split;
                    ptree.splits.push(split);}
                if (add_prefix(split,string,i+1)) {
                    strings.push(string);
                    return true;}
                else return false;}
            else if (ptree.strings.length<5)
                if ((strings.indexOf) ?
                    (strings.indexOf(string)>=0) :
                    (arrayContains(strings,string)))
                    return false;
            else {
                strings.push(string);
                return true;}
            else {
                // Subdivide
                ptree.splits=[];
                var pstrings=ptree.strings;
                var j=0; while (j<pstrings.length)
                    add_prefix(ptree,pstrings[j++],i);
                return add_prefix(ptree,string,i);}}
        function prefixAdd(ptree,string,i) {
            if ((typeof i !== "number")||(i<0)) i=0;
            return add_prefix(ptree,string,i);}
        fdjtString.prefixAdd=prefixAdd;

        function find_prefix(ptree,prefix,i,plen){
            if (!(plen)) plen=prefix.length;
            if (i===plen)
                return ptree.strings;
            else if (ptree.strings.length<=5) {
                var strings=ptree.strings;
                var results=[];
                var j=0; while (j<strings.length) {
                    var string=strings[j++];
                    if (hasPrefix(string,prefix)) results.push(string);}
                if (results.length) return results;
                else return false;}
            else {
                var split=ptree[prefix[i]];
                if (split) return find_prefix(split,prefix,i+1,plen);
                else return false;}}
        function prefixFind(ptree,prefix,i,plen){
            if ((typeof i !== "number")||(i<0)) i=0;
            if (!(plen)) plen=prefix.length;
            return find_prefix(ptree,prefix,i,plen);}
        fdjtString.prefixFind=prefixFind;

        function paraHash(node){
            var text=((typeof node.innerText === "string")?
                      (node.innerText):(stripMarkup(node.innerHTML)));
            var words=text.split(/\W*\S+\W*/g);
            var len=words.length;
            return "_H"+
                ((len>0)?(words[0][0]):".")+
                ((len>1)?(words[1][0]):".")+
                ((len>2)?(words[2][0]):".")+
                ((len>3)?(words[3][0]):".")+
                ((len>0)?(words[len-1][0]):".")+
                ((len>1)?(words[len-2][0]):".")+
                ((len>2)?(words[len-3][0]):".")+
                ((len>3)?(words[len-4][0]):".");}
        fdjtString.paraHash=paraHash;

        function escapeRegExp(str) {
            return (str+"").replace(
                    /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");}
        fdjtString.escapeRegExp=escapeRegExp;
        fdjtString.escapeRX=escapeRegExp;

        fdjtString.templates={};

        function fillIn(text,data){
            /* Filling in templates */
            var dom=false;
            if (typeof data === "string") {
                var tmp=data; data=text; text=tmp;}
            if ((!(text))&&(data)&&(data.template)) text=data.template;
            else if ((!(data))&&(text.template)) {
                data=text; text=data.template;}
            // Maybe a warning?
            if (typeof text === "string") {}
            else if (text.nodeType===3) {
                dom=text; text=dom.nodeValue;}
            else if (text.nodeType===1) {
                dom=text; text=dom.innerHTML;}
            else {
                fdjt.Log.warn("Bad argument %o to Template",text);
                return;}
            var substs=text.match(/\{\{\w+(\|([^\}])*)?\}\}/gm), done={};
            if ((substs)&&(substs.length)) {
                var i=0, n=substs.length; while (i<n) {
                    var match=substs[i++];
                    var prop=match.slice(2,-2);
                    var bar=prop.search(/\|/);
                    var propname=((bar>=0)?(prop.slice(0,bar)):(prop));
                    if ((done[prop])||(done[propname])) continue;
                    else if (data.hasOwnProperty(propname)) {
                        var val=data[propname];
                        done[propname]=prop;
                        if (val) {
                            var pat=new RegExp(
                                "\\{\\{"+propname+"(\\|[^\\}]*)?\\}\\}","gm");
                            var stringval=val.toString();
                            text=text.replace(pat,stringval);}}
                    else if (bar>0) {
                        var replace=prop.slice(bar+1);
                        text=text.replace("{{"+prop+"}}",replace);
                        done[prop]=prop;}
                    else fdjt.Log.warn(
                        "No data for %s in %j to substitute for %s",
                        propname,data,"{{"+prop+"}}");}}
            if (dom) {
                if (dom.nodeType===3) dom.nodeValue=text;
                else dom.innerHTML=text;
                return dom;}
            else return text;}
        fdjtString.fillIn=fillIn;
        
        return fdjtString;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/time.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
    of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

    Use, modification, and redistribution of this program is permitted
    under either the GNU General Public License (GPL) Version 2 (or
    any later version) or under the GNU Lesser General Public License
    (version 3 or later).

    These licenses may be found at www.gnu.org, particularly:
      http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
      http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

/* Time functions */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

fdjt.Time=
    (function (){
        "use strict";

        function _(x){ return x; }

        function fdjtTime() {
            return (new Date()).getTime();}

        var loaded=fdjtTime.loaded=(new Date()).getTime();
        fdjtTime.tick=function(){
            return Math.floor((new Date()).getTime()/1000);};

        fdjtTime.dateString=function(tstamp){
            if (typeof tstamp === 'number') {
                if (tstamp<131592918600)
                    tstamp=new Date(tstamp*1000);
                else tstamp=new Date(tstamp);}
            return tstamp.toDateString();};
        fdjtTime.timeString=function(tstamp){
            if (typeof tstamp === 'number') {
                if (tstamp<131592918600)
                    tstamp=new Date(tstamp*1000);
                else tstamp=new Date(tstamp);}
            return tstamp.toString();};

        function shortString(tstamp){
            var now=new Date();
            if (typeof tstamp === 'number') {
                if (tstamp<131592918600)
                    tstamp=new Date(tstamp*1000);
                else tstamp=new Date(tstamp);}
            var diff=(now.getTime()-tstamp.getTime())/1000;
            if (diff>(12*3600))
                return tstamp.toDateString();
            else {
                var hours=tstamp.getHours();
                var minutes=tstamp.getMinutes();
                return tstamp.toDateString()+" ("+
                    ((hours<10)?"0":"")+hours+":"+
                    ((minutes===0)?"00":(((minutes<10)?"0":"")+minutes))+
                    ")";}}
        fdjtTime.shortString=shortString;
        fdjtTime.tick2shortstring=function(tick){
            return shortString(new Date(tick*1000));};

        var first_date=false;
        function compactString(tstamp,curdate){
            if (typeof tstamp === 'number') {
                if (tstamp<131592918600)
                    tstamp=new Date(tstamp*1000);
                else tstamp=new Date(tstamp);}
            var date_string=tstamp.toLocaleDateString();
            if (typeof curdate==="undefined") {
                if (first_date) curdate=first_date;
                else first_date=new Date().toLocaleDateString();}
            var show_date=(date_string!==curdate);
            var hours=tstamp.getHours(), minutes=tstamp.getMinutes();
            var seconds=tstamp.getSeconds();
            return ((show_date)?(date_string):(""))+
                ((show_date)?(" - "):(""))+
                ((hours<10)?"0":"")+hours+":"+
                ((minutes===0)?"00":(((minutes<10)?"0":"")+minutes))+":"+
                ((seconds===0)?"00":(((seconds<10)?"0":"")+seconds));}
        fdjtTime.compactString=compactString;
        
        fdjtTime.tick2string=function(tick){
            return (new Date(tick*1000)).toString();};
        fdjtTime.tick2date=function(tick){
            return (new Date(tick*1000)).toDateString();};
        fdjtTime.tick2locale=function(tick){
            return (new Date(tick*1000)).toLocaleString();};
        fdjtTime.tick2time=function(tick){
            return (new Date(tick*1000)).toTimeString();};

        var fmt=fdjt.String;

        fdjtTime.secs2string=function(interval){
            var weeks, days, hours, minutes, seconds;
            if (interval<1)
                return fmt("%f seconds",interval);
            else if (interval===1)
                return fmt("%f second",interval);
            else if (interval<10)
                return fmt("%f seconds",interval);
            else if (interval<60)
                return fmt("~%d seconds",Math.round(interval/60));
            else if (interval<120) {
                minutes=Math.floor(interval/60);
                seconds=Math.round(interval-(minutes*60));
                if (seconds===1)
                    return _("one minute, one second");
                else return fmt("one minute, %d seconds",seconds);}
            else if (interval<3600) {
                minutes=Math.floor(interval/60);
                return fmt("~%d minutes",minutes);}
            else if (interval<(2*3600)) {
                hours=Math.floor(interval/3600);
                minutes=Math.round((interval-(hours*3600))/60);
                if (minutes===1)
                    return _("one hour and one minutes");
                else return fmt("one hour, %d minutes",minutes);}
            else if (interval<(24*3600)) {
                hours=Math.floor(interval/3600);
                return fmt("~%d hours",hours);}
            else if (interval<(2*24*3600)) {
                hours=Math.floor((interval-24*3600)/3600);
                if (hours===1)
                    return _("one day and one hour");
                else return fmt("one day, %d hours",hours);}
            else if (interval<(7*24*3600)) {
                days=Math.floor(interval/(24*3600));
                return fmt("%d days",days);}
            else if (interval<(14*24*3600)) {
                days=Math.floor((interval-(7*24*3600))/(24*3600));
                if (days===1)
                    return "one week and one day";
                else return fmt("one week and %d days",days);}
            else {
                weeks=Math.floor(interval/(7*24*3600));
                days=Math.round((interval-(days*7*24*3600))/(7*24*3600));
                return fmt("%d weeks, %d days",weeks,days);}};

        fdjtTime.secs2short=function(interval){
            // This is designed for short intervals
            if (interval<0.001)
                return Math.round(interval*1000000)+"us";
            else if (interval<0.1)
                return Math.round(interval*1000)+"ms";
            else if (interval<120)
                return (Math.round(interval*100)/100)+"s";
            else {
                var min=Math.floor(interval/60);
                var secs=interval-min*60;
                return min+"m, "+(Math.round(secs*100)/100)+"s";}};

        fdjtTime.runTimes=function(pname,start){
            var point=start; var report="";
            var i=2; while (i<arguments.length) {
                var phase=arguments[i++]; var time=arguments[i++];
                report=report+"; "+phase+": "+
                    ((time.getTime()-point.getTime())/1000)+"s";
                point=time;}
            return pname+" "+
                ((point.getTime()-start.getTime())/1000)+"s"+
                report;};

        fdjtTime.diffTime=function(time1,time2){
            if (!(time2)) time2=new Date();
            var diff=time1.getTime()-time2.getTime();
            if (diff>0) return diff/1000; else return -(diff/1000);};

        fdjtTime.ET=function(arg){
            if (!(arg)) arg=new Date();
            return (arg.getTime()-loaded)/1000;};

        var tzpat=/(EST|EDT|PDT|PST|CST|CDT|ECT|GMT|Z|([+-]\d\d?(:\d+)?))$/i;

        fdjtTime.parse=function(string){
            var value=false;
            try {
                if (Date.parse)
                    value=new Date(Date.parse(string));
                else value=new Date(string);
            } catch (ex) {
                fdjt.Log("Error parsing time '%s': %o",string,ex);}
            if ((value instanceof Date)&&(!(isNaN(value.getYear()))))
                return value;
            else {
                var strip=string.search(tzpat);
                if (strip>0) return fdjtTime.parse(string.slice(0,strip));
                fdjt.Log("Couldn't parse time '%s'",string);
                return string;}};
        
        fdjtTime.timeslice=fdjt.Async.timeslice;
        fdjtTime.slowmap=fdjt.Async.slowmap;

        return fdjtTime;})();

fdjt.ET=fdjt.Time.ET;

/* Emacs local variables
;;;  Local variables: ***
;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
;;;  indent-tabs-mode: nil ***
;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/string.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true */
// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

fdjt.Template=(function(){
    "use strict";
    var templates={};

    function Template(text,data,xdata){ /* Filling in templates */
        var dom=false;
        if (typeof data === "string") {
            var tmp=data; data=text; text=tmp;}
        if ((!(text))&&(data)&&(data.template)) text=data.template;
        // Maybe a warning?
        if (typeof text === "string") {}
        else if (text.nodeType===3) {
            dom=text; text=dom.nodeValue;}
        else if (text.nodeType===1) {
            dom=text; text=dom.innerHTML;}
        else {
            fdjt.Log.warn("Bad argument %o to Template",text);
            return;}
        if (Template.localTemplates.hasOwnProperty(text))
            text=Template.localTemplates[text];
        else if (templates.hasOwnProperty(text))
            text=templates[text];
        else {}
        var substs=text.match(/\{\{\w+\}\}/gm), done={};
        if (substs) {
            var i=0, n=substs.length; while (i<n) {
                var match=substs[i++];
                var prop=match.slice(2,-2);
                var pat=new RegExp("\\{\\{"+prop+"\\}\\}","gm");
                if (done[prop]) continue;
                if (!((data.hasOwnProperty(prop))||
                      ((xdata)&&(xdata.hasOwnProperty(prop))))) {
                    fdjt.Log.warn("No data for %s in %s to use in %s",
                                  prop,data,text);
                    done[prop]=prop;
                    continue;}
                var val=data[prop]||((xdata)&&(xdata[prop]))||"";
                done[prop]=prop;
                text=text.replace(pat,val.toString());}}
        if (dom) {
            if (dom.nodeType===3) dom.nodeValue=text;
            else dom.innerHTML=text;
            return dom;}
        else return text;}

    var template=Template;

    fdjt.Templates=templates;
    Template.localTemplates={};

    function toDOM(text,data,dom_arg){
        var output=template(text,data);
        var dom=((!(dom_arg))?(document.createElement("div")):
                 (dom_arg.nodeType)?(dom_arg):
                 (typeof dom_arg === "string")?
                 (document.createElement(dom_arg)):
                 (document.createElement("div")));
        dom.innerHTML=output;
        if ((dom_arg)&&(dom_arg.nodeType)) return dom;
        else if (!(dom.childNodes)) return false;
        else if (dom.childNodes.length===1)
            return dom.childNodes[0];
        else {
            var frag=document.createDocumentFragment, nodes=[];
            var children=dom.childNodes;
            var i=0, lim=children.length;
            while (i<lim) nodes.push(children[i++]);
            i=0; while (i<lim) frag.appendChild(nodes[i++]);
            return frag;}}

    Template.toDOM=toDOM;

    return Template;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

/* ######################### fdjt/hash.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   It implements a method for breaking narrative HTML content
   across multiple pages, attempting to honor page break constraints,
   etc.

   Check out the 'mini manual' at the bottom of the file or read the
   code itself.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or any
   later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

   Use and redistribution (especially embedding in other CC licensed
   content) is also permitted under the terms of the Creative Commons
   "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

/*
 * A JavaScript implementation of various hashing algorithms, merged
 *   into a single object.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

if (!(fdjt.Hash))
    fdjt.Hash=(function(){
        "use strict";
        /*
         * Configurable variables. You may need to tweak these to be compatible with
         * the server-side, but the defaults work in most cases.
         */
        /* hex output format. 0 - lowercase; 1 - uppercase        */
        var hexcase_default = 0;
        /* base-64 pad character. "=" for strict RFC compliance   */
        var b64pad_default  = "";
        var enc=false;

        function gethexcase(){ return hexcase_default;}
        function sethexcase(v){ hexcase_default=v;}
        function getpadchar(){ return b64pad_default;}
        function setpadchar(v){ b64pad_default=v;}

        function getenc(){ return ;}
        function setenc(v) {
            if (typeof v === 'string')
                enc=fdjt.Hash[v]||false;
            else enc=v;}

        /*
         * Convert a raw string to an array of big-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        function rstr2binb(input)
        {
            var output = new Array(input.length >> 2); var i;
            for(i = 0; i < output.length; i++)
                output[i] = 0;
            for(i = 0; i < input.length * 8; i += 8)
                output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
            return output;
        }

        /*
         * Convert an array of big-endian words to a string
         */
        function binb2rstr(input)
        {
            var output = "";
            for(var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
            return output;
        }

        /*
         * Convert a raw string to a hex string
         */
        function rstr2hex(input,hexcase)
        {
            if (typeof hexcase === "undefined") hexcase=hexcase_default;
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for(var i = 0; i < input.length; i++)
            {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F)+
                    hex_tab.charAt( x        & 0x0F);
            }
            return output;
        }

        /*
         * Convert a raw string to a base-64 string
         */
        function rstr2b64(input,b64pad)
        {
            if (!(b64pad)) b64pad=b64pad_default;
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for(var i = 0; i < len; i += 3)
            {
                var triplet = (input.charCodeAt(i) << 16)
                    | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                    | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
                for(var j = 0; j < 4; j++)
                {
                    if(i * 8 + j * 6 > input.length * 8) output += b64pad;
                    else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
                }
            }
            return output;
        }

        /*
         * Convert a raw string to an arbitrary string encoding
         */
        function rstr2any(input, encoding)
        {
            if (!(encoding)) {
                if (enc) return enc(input);
                else return rstr2hex(input);}
            var divisor = encoding.length;
            var i, j, q, x, quotient;

            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = new Array(Math.ceil(input.length / 2));
            for(i = 0; i < dividend.length; i++)
            {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }

            /*
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. All remainders are stored for later
             * use.
             */
            var full_length = Math.ceil(input.length * 8 /
                                        (Math.log(encoding.length) / Math.log(2)));
            var remainders = new Array(full_length);
            for(j = 0; j < full_length; j++)
            {
                quotient = [];
                x = 0;
                for(i = 0; i < dividend.length; i++)
                {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if(quotient.length > 0 || q > 0)
                        quotient[quotient.length] = q;
                }
                remainders[j] = x;
                dividend = quotient;
            }

            /* Convert the remainders to the output string */
            var output = "";
            for(i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);

            return output;
        }

        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        function str2rstr_utf8(input)
        {
            var output = "";
            var i = -1;
            var x, y;

            while(++i < input.length)
            {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
                {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }

                /* Encode output as utf-8 */
                if(x <= 0x7F)
                    output += String.fromCharCode(x);
                else if(x <= 0x7FF)
                    output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                                  0x80 | ( x         & 0x3F));
                else if(x <= 0xFFFF)
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                                  0x80 | ((x >>> 6 ) & 0x3F),
                                                  0x80 | ( x         & 0x3F));
                else if(x <= 0x1FFFFF)
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                                  0x80 | ((x >>> 12) & 0x3F),
                                                  0x80 | ((x >>> 6 ) & 0x3F),
                                                  0x80 | ( x         & 0x3F));
            }
            return output;
        }

        /*
         * Encode a string as utf-16
         */
        function str2rstr_utf16le(input)
        {
            var output = "";
            for(var i = 0; i < input.length; i++)
                output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                               (input.charCodeAt(i) >>> 8) & 0xFF);
            return output;
        }

        function str2rstr_utf16be(input)
        {
            var output = "";
            for(var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                              input.charCodeAt(i)        & 0xFF);
            return output;
        }

        /*
         * Convert a raw string to an array of little-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        function rstr2binl(input)
        {
            var output = new Array(input.length >> 2); var i;
            for(i = 0; i < output.length; i++)
                output[i] = 0;
            for(i = 0; i < input.length * 8; i += 8)
                output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
            return output;
        }

        /*
         * Convert an array of little-endian words to a string
         */
        function binl2rstr(input)
        {
            var output = "";
            for(var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
            return output;
        }

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        function safe_add(x, y)
        {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        function bit_rol(num, cnt)
        {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        /*
         * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
         * Digest Algorithm, as defined in RFC 1321.
         * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
         * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
         * Distributed under the BSD License
         * See http://pajhome.org.uk/crypt/md5 for more info.
         */

        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
        function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
        function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
        function hex_hmac_md5(k, d)
        { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
        function b64_hmac_md5(k, d)
        { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
        function any_hmac_md5(k, d, e)
        { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

        /*
         * Perform a simple self-test to see if the VM is working
         */
        function md5_vm_test()
        {
            return hex_md5("abc").toLowerCase() === "900150983cd24fb0d6963f7d28e17f72";
        }

        /*
         * Calculate the MD5 of a raw string
         */
        function rstr_md5(s)
        {
            return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
        }

        /*
         * Calculate the HMAC-MD5, of a key and some data (raw strings)
         */
        function rstr_hmac_md5(key, data)
        {
            var bkey = rstr2binl(key);
            if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

            var ipad = new Array(16), opad = new Array(16);
            for(var i = 0; i < 16; i++)
            {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
            return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
        }

        /* Calculate the MD5 of an array of little-endian words, and a bit length.
         */
        function binl_md5(x, len)
        {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a =  1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d =  271733878;

            for(var i = 0; i < x.length; i += 16)
            {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
                d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
                b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
                d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
                c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
                d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
                d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

                a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
                d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
                c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
                b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
                d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
                c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
                d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
                c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
                a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
                d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
                c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
                b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

                a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
                d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
                b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
                d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
                c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
                d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
                a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
                d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
                b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

                a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
                d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
                c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
                d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
                d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
                a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
                d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
                b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
            }
            return new Array(a, b, c, d);
        }

        /*
         * These functions implement the four basic operations the algorithm uses.
         */
        function md5_cmn(q, a, b, x, s, t)
        {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
        }
        function md5_ff(a, b, c, d, x, s, t)
        {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        function md5_gg(a, b, c, d, x, s, t)
        {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        function md5_hh(a, b, c, d, x, s, t)
        {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function md5_ii(a, b, c, d, x, s, t)
        {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        /*
         * A JavaScript implementation of the RIPEMD-160 Algorithm
         * Version 2.2 Copyright Jeremy Lin, Paul Johnston 2000 - 2009.
         * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
         * Distributed under the BSD License
         * See http://pajhome.org.uk/crypt/md5 for details.
         * Also http://www.ocf.berkeley.edu/~jjlin/jsotp/
         */

        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        function hex_rmd160(s)    { return rstr2hex(rstr_rmd160(str2rstr_utf8(s))); }
        function b64_rmd160(s)    { return rstr2b64(rstr_rmd160(str2rstr_utf8(s))); }
        function any_rmd160(s, e) { return rstr2any(rstr_rmd160(str2rstr_utf8(s)), e); }
        function hex_hmac_rmd160(k, d)
        { return rstr2hex(rstr_hmac_rmd160(str2rstr_utf8(k), str2rstr_utf8(d))); }
        function b64_hmac_rmd160(k, d)
        { return rstr2b64(rstr_hmac_rmd160(str2rstr_utf8(k), str2rstr_utf8(d))); }
        function any_hmac_rmd160(k, d, e)
        { return rstr2any(rstr_hmac_rmd160(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

        /*
         * Perform a simple self-test to see if the VM is working
         */
        function rmd160_vm_test()
        {
            return hex_rmd160("abc").toLowerCase() === "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc";
        }

        /*
         * Calculate the rmd160 of a raw string
         */
        function rstr_rmd160(s)
        {
            return binl2rstr(binl_rmd160(rstr2binl(s), s.length * 8));
        }

        /*
         * Calculate the HMAC-rmd160 of a key and some data (raw strings)
         */
        function rstr_hmac_rmd160(key, data)
        {
            var bkey = rstr2binl(key);
            if(bkey.length > 16) bkey = binl_rmd160(bkey, key.length * 8);

            var ipad = new Array(16), opad = new Array(16);
            for(var i = 0; i < 16; i++)
            {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = binl_rmd160(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
            return binl2rstr(binl_rmd160(opad.concat(hash), 512 + 160));
        }


        /*
         * Calculate the RIPE-MD160 of an array of little-endian words, and a bit length.
         */
        function binl_rmd160(x, len)
        {
            /* append padding */
            x[len >> 5] |= 0x80 << (len % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var h0 = 0x67452301;
            var h1 = 0xefcdab89;
            var h2 = 0x98badcfe;
            var h3 = 0x10325476;
            var h4 = 0xc3d2e1f0;

            for (var i = 0; i < x.length; i += 16) {
                var T;
                var A1 = h0, B1 = h1, C1 = h2, D1 = h3, E1 = h4;
                var A2 = h0, B2 = h1, C2 = h2, D2 = h3, E2 = h4;
                for (var j = 0; j <= 79; ++j) {
                    T = safe_add(A1, rmd160_f(j, B1, C1, D1));
                    T = safe_add(T, x[i + rmd160_r1[j]]);
                    T = safe_add(T, rmd160_K1(j));
                    T = safe_add(bit_rol(T, rmd160_s1[j]), E1);
                    A1 = E1; E1 = D1; D1 = bit_rol(C1, 10); C1 = B1; B1 = T;
                    T = safe_add(A2, rmd160_f(79-j, B2, C2, D2));
                    T = safe_add(T, x[i + rmd160_r2[j]]);
                    T = safe_add(T, rmd160_K2(j));
                    T = safe_add(bit_rol(T, rmd160_s2[j]), E2);
                    A2 = E2; E2 = D2; D2 = bit_rol(C2, 10); C2 = B2; B2 = T;
                }
                T = safe_add(h1, safe_add(C1, D2));
                h1 = safe_add(h2, safe_add(D1, E2));
                h2 = safe_add(h3, safe_add(E1, A2));
                h3 = safe_add(h4, safe_add(A1, B2));
                h4 = safe_add(h0, safe_add(B1, C2));
                h0 = T;
            }
            return [h0, h1, h2, h3, h4];
        }

        function rmd160_f(j, x, y, z)
        {
            return ( 0 <= j && j <= 15) ? (x ^ y ^ z) :
                (16 <= j && j <= 31) ? (x & y) | (~x & z) :
                (32 <= j && j <= 47) ? (x | ~y) ^ z :
                (48 <= j && j <= 63) ? (x & z) | (y & ~z) :
                (64 <= j && j <= 79) ? x ^ (y | ~z) :
                "rmd160_f: j out of range";
        }
        function rmd160_K1(j)
        {
            return ( 0 <= j && j <= 15) ? 0x00000000 :
                (16 <= j && j <= 31) ? 0x5a827999 :
                (32 <= j && j <= 47) ? 0x6ed9eba1 :
                (48 <= j && j <= 63) ? 0x8f1bbcdc :
                (64 <= j && j <= 79) ? 0xa953fd4e :
                "rmd160_K1: j out of range";
        }
        function rmd160_K2(j)
        {
            return ( 0 <= j && j <= 15) ? 0x50a28be6 :
                (16 <= j && j <= 31) ? 0x5c4dd124 :
                (32 <= j && j <= 47) ? 0x6d703ef3 :
                (48 <= j && j <= 63) ? 0x7a6d76e9 :
                (64 <= j && j <= 79) ? 0x00000000 :
                "rmd160_K2: j out of range";
        }
        var rmd160_r1 = [
            0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
            7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
            3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
            1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
            4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13
        ];
        var rmd160_r2 = [
            5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
            6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
            15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
            8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
            12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11
        ];
        var rmd160_s1 = [
            11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
            7,  6,  8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
            11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
            11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
            9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6
        ];
        var rmd160_s2 = [
            8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
            9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
            9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
            15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
            8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11
        ];

        /*
         * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
         * in FIPS 180-1
         * Version 2.2 Copyright Paul Johnston 2000 - 2009.
         * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
         * Distributed under the BSD License
         * See http://pajhome.org.uk/crypt/md5 for details.
         */

        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
        function b64_sha1(s)    { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
        function any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
        function hex_hmac_sha1(k, d)
        { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
        function b64_hmac_sha1(k, d)
        { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
        function any_hmac_sha1(k, d, e)
        { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

        /*
         * Perform a simple self-test to see if the VM is working
         */
        function sha1_vm_test()
        {
            return hex_sha1("abc").toLowerCase() === "a9993e364706816aba3e25717850c26c9cd0d89d";
        }

        /*
         * Calculate the SHA1 of a raw string
         */
        function rstr_sha1(s)
        {
            return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
        }

        /*
         * Calculate the HMAC-SHA1 of a key and some data (raw strings)
         */
        function rstr_hmac_sha1(key, data)
        {
            var bkey = rstr2binb(key);
            if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

            var ipad = new Array(16), opad = new Array(16);
            for(var i = 0; i < 16; i++)
            {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
            return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
        }

        /*
         * Calculate the SHA-1 of an array of big-endian words, and a bit length
         */
        function binb_sha1(x, len)
        {
            /* append padding */
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;

            var w = new Array(80);
            var a =  1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d =  271733878;
            var e = -1009589776;

            for(var i = 0; i < x.length; i += 16)
            {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                var olde = e;

                for(var j = 0; j < 80; j++)
                {
                    if(j < 16) w[j] = x[i + j];
                    else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                    var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                                     safe_add(safe_add(e, w[j]), sha1_kt(j)));
                    e = d;
                    d = c;
                    c = bit_rol(b, 30);
                    b = a;
                    a = t;
                }

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
                e = safe_add(e, olde);
            }
            return new Array(a, b, c, d, e);

        }

        /*
         * Perform the appropriate triplet combination function for the current
         * iteration
         */
        function sha1_ft(t, b, c, d)
        {
            if(t < 20) return (b & c) | ((~b) & d);
            if(t < 40) return b ^ c ^ d;
            if(t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        }

        /*
         * Determine the appropriate additive constant for the current iteration
         */
        function sha1_kt(t)
        {
            return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
                (t < 60) ? -1894007588 : -899497514;
        }

        /*
         * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
         * in FIPS 180-2
         * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
         * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
         * Distributed under the BSD License
         * See http://pajhome.org.uk/crypt/md5 for details.
         * Also http://anmar.eu.org/projects/jssha2/
         */

        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        function hex_sha256(s)    { return rstr2hex(rstr_sha256(str2rstr_utf8(s))); }
        function b64_sha256(s)    { return rstr2b64(rstr_sha256(str2rstr_utf8(s))); }
        function any_sha256(s, e) { return rstr2any(rstr_sha256(str2rstr_utf8(s)), e); }
        function hex_hmac_sha256(k, d)
        { return rstr2hex(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d))); }
        function b64_hmac_sha256(k, d)
        { return rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d))); }
        function any_hmac_sha256(k, d, e)
        { return rstr2any(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

        /*
         * Perform a simple self-test to see if the VM is working
         */
        function sha256_vm_test()
        {
            return hex_sha256("abc").toLowerCase() ===
                "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
        }

        /*
         * Calculate the sha256 of a raw string
         */
        function rstr_sha256(s)
        {
            return binb2rstr(binb_sha256(rstr2binb(s), s.length * 8));
        }

        /*
         * Calculate the HMAC-sha256 of a key and some data (raw strings)
         */
        function rstr_hmac_sha256(key, data)
        {
            var bkey = rstr2binb(key);
            if(bkey.length > 16) bkey = binb_sha256(bkey, key.length * 8);

            var ipad = new Array(16), opad = new Array(16);
            for(var i = 0; i < 16; i++)
            {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = binb_sha256(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
            return binb2rstr(binb_sha256(opad.concat(hash), 512 + 256));
        }

        /*
         * Main sha256 function, with its support functions
         */
        function sha256_S (X, n) {return ( X >>> n ) | (X << (32 - n));}
        function sha256_R (X, n) {return ( X >>> n );}
        function sha256_Ch(x, y, z) {return ((x & y) ^ ((~x) & z));}
        function sha256_Maj(x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));}
        function sha256_Sigma0256(x) {return (sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22));}
        function sha256_Sigma1256(x) {return (sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25));}
        function sha256_Gamma0256(x) {return (sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3));}
        function sha256_Gamma1256(x) {return (sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10));}
        function sha256_Sigma0512(x) {return (sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39));}
        function sha256_Sigma1512(x) {return (sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41));}
        function sha256_Gamma0512(x) {return (sha256_S(x, 1)  ^ sha256_S(x, 8) ^ sha256_R(x, 7));}
        function sha256_Gamma1512(x) {return (sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6));}

        var sha256_K = new Array
        (
            1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993,
                -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
            1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
            264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
                -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
            113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
            1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885,
                -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
            430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
            1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872,
                -1866530822, -1538233109, -1090935817, -965641998
        );

        function binb_sha256(m, l)
        {
            var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534,
                                 1359893119, -1694144372, 528734635, 1541459225);
            var W = new Array(64);
            var a, b, c, d, e, f, g, h;
            var i, j, T1, T2;

            /* append padding */
            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;

            for(i = 0; i < m.length; i += 16)
            {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];

                for(j = 0; j < 64; j++)
                {
                    if (j < 16) W[j] = m[j + i];
                    else W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]),
                                                  sha256_Gamma0256(W[j - 15])), W[j - 16]);

                    T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)),
                                           sha256_K[j]), W[j]);
                    T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
                    h = g;
                    g = f;
                    f = e;
                    e = safe_add(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = safe_add(T1, T2);
                }

                HASH[0] = safe_add(a, HASH[0]);
                HASH[1] = safe_add(b, HASH[1]);
                HASH[2] = safe_add(c, HASH[2]);
                HASH[3] = safe_add(d, HASH[3]);
                HASH[4] = safe_add(e, HASH[4]);
                HASH[5] = safe_add(f, HASH[5]);
                HASH[6] = safe_add(g, HASH[6]);
                HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }

        /*
         * A JavaScript implementation of the Secure Hash Algorithm, SHA-512, as defined
         * in FIPS 180-2
         * Version 2.2 Copyright Anonymous Contributor, Paul Johnston 2000 - 2009.
         * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
         * Distributed under the BSD License
         * See http://pajhome.org.uk/crypt/md5 for details.
         */

        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        function hex_sha512(s)    { return rstr2hex(rstr_sha512(str2rstr_utf8(s))); }
        function b64_sha512(s)    { return rstr2b64(rstr_sha512(str2rstr_utf8(s))); }
        function any_sha512(s, e) { return rstr2any(rstr_sha512(str2rstr_utf8(s)), e);}
        function hex_hmac_sha512(k, d)
        { return rstr2hex(rstr_hmac_sha512(str2rstr_utf8(k), str2rstr_utf8(d))); }
        function b64_hmac_sha512(k, d)
        { return rstr2b64(rstr_hmac_sha512(str2rstr_utf8(k), str2rstr_utf8(d))); }
        function any_hmac_sha512(k, d, e)
        { return rstr2any(rstr_hmac_sha512(str2rstr_utf8(k), str2rstr_utf8(d)), e);}

        /*
         * Perform a simple self-test to see if the VM is working
         */
        function sha512_vm_test()
        {
            return hex_sha512("abc").toLowerCase() ===
                "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a" +
                "2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f";
        }

        /*
         * Calculate the SHA-512 of a raw string
         */
        function rstr_sha512(s)
        {
            return binb2rstr(binb_sha512(rstr2binb(s), s.length * 8));
        }

        /*
         * Calculate the HMAC-SHA-512 of a key and some data (raw strings)
         */
        function rstr_hmac_sha512(key, data)
        {
            var bkey = rstr2binb(key);
            if(bkey.length > 32) bkey = binb_sha512(bkey, key.length * 8);

            var ipad = new Array(32), opad = new Array(32);
            for(var i = 0; i < 32; i++)
            {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = binb_sha512(ipad.concat(rstr2binb(data)), 1024 + data.length * 8);
            return binb2rstr(binb_sha512(opad.concat(hash), 1024 + 512));
        }

        /*
         * Calculate the SHA-512 of an array of big-endian dwords, and a bit length
         */
        var sha512_k;
        function binb_sha512(x, len)
        {
            if(sha512_k === undefined)
            {
                //SHA512 constants
                sha512_k = new Array(
                    new Int64(0x428a2f98, -685199838), new Int64(0x71374491, 0x23ef65cd),
                    new Int64(-1245643825, -330482897), new Int64(-373957723, -2121671748),
                    new Int64(0x3956c25b, -213338824), new Int64(0x59f111f1, -1241133031),
                    new Int64(-1841331548, -1357295717), new Int64(-1424204075, -630357736),
                    new Int64(-670586216, -1560083902), new Int64(0x12835b01, 0x45706fbe),
                    new Int64(0x243185be, 0x4ee4b28c), new Int64(0x550c7dc3, -704662302),
                    new Int64(0x72be5d74, -226784913), new Int64(-2132889090, 0x3b1696b1),
                    new Int64(-1680079193, 0x25c71235), new Int64(-1046744716, -815192428),
                    new Int64(-459576895, -1628353838), new Int64(-272742522, 0x384f25e3),
                    new Int64(0xfc19dc6, -1953704523), new Int64(0x240ca1cc, 0x77ac9c65),
                    new Int64(0x2de92c6f, 0x592b0275), new Int64(0x4a7484aa, 0x6ea6e483),
                    new Int64(0x5cb0a9dc, -1119749164), new Int64(0x76f988da, -2096016459),
                    new Int64(-1740746414, -295247957), new Int64(-1473132947, 0x2db43210),
                    new Int64(-1341970488, -1728372417), new Int64(-1084653625, -1091629340),
                    new Int64(-958395405, 0x3da88fc2), new Int64(-710438585, -1828018395),
                    new Int64(0x6ca6351, -536640913), new Int64(0x14292967, 0xa0e6e70),
                    new Int64(0x27b70a85, 0x46d22ffc), new Int64(0x2e1b2138, 0x5c26c926),
                    new Int64(0x4d2c6dfc, 0x5ac42aed), new Int64(0x53380d13, -1651133473),
                    new Int64(0x650a7354, -1951439906), new Int64(0x766a0abb, 0x3c77b2a8),
                    new Int64(-2117940946, 0x47edaee6), new Int64(-1838011259, 0x1482353b),
                    new Int64(-1564481375, 0x4cf10364), new Int64(-1474664885, -1136513023),
                    new Int64(-1035236496, -789014639), new Int64(-949202525, 0x654be30),
                    new Int64(-778901479, -688958952), new Int64(-694614492, 0x5565a910),
                    new Int64(-200395387, 0x5771202a), new Int64(0x106aa070, 0x32bbd1b8),
                    new Int64(0x19a4c116, -1194143544), new Int64(0x1e376c08, 0x5141ab53),
                    new Int64(0x2748774c, -544281703), new Int64(0x34b0bcb5, -509917016),
                    new Int64(0x391c0cb3, -976659869), new Int64(0x4ed8aa4a, -482243893),
                    new Int64(0x5b9cca4f, 0x7763e373), new Int64(0x682e6ff3, -692930397),
                    new Int64(0x748f82ee, 0x5defb2fc), new Int64(0x78a5636f, 0x43172f60),
                    new Int64(-2067236844, -1578062990), new Int64(-1933114872, 0x1a6439ec),
                    new Int64(-1866530822, 0x23631e28), new Int64(-1538233109, -561857047),
                    new Int64(-1090935817, -1295615723), new Int64(-965641998, -479046869),
                    new Int64(-903397682, -366583396), new Int64(-779700025, 0x21c0c207),
                    new Int64(-354779690, -840897762), new Int64(-176337025, -294727304),
                    new Int64(0x6f067aa, 0x72176fba), new Int64(0xa637dc5, -1563912026),
                    new Int64(0x113f9804, -1090974290), new Int64(0x1b710b35, 0x131c471b),
                    new Int64(0x28db77f5, 0x23047d84), new Int64(0x32caab7b, 0x40c72493),
                    new Int64(0x3c9ebe0a, 0x15c9bebc), new Int64(0x431d67c4, -1676669620),
                    new Int64(0x4cc5d4be, -885112138), new Int64(0x597f299c, -60457430),
                    new Int64(0x5fcb6fab, 0x3ad6faec), new Int64(0x6c44198c, 0x4a475817));
            }

            //Initial hash values
            var H = new Array(
                new Int64(0x6a09e667, -205731576),
                new Int64(-1150833019, -2067093701),
                new Int64(0x3c6ef372, -23791573),
                new Int64(-1521486534, 0x5f1d36f1),
                new Int64(0x510e527f, -1377402159),
                new Int64(-1694144372, 0x2b3e6c1f),
                new Int64(0x1f83d9ab, -79577749),
                new Int64(0x5be0cd19, 0x137e2179));

            var T1 = new Int64(0, 0),
            T2 = new Int64(0, 0),
            a = new Int64(0,0),
            b = new Int64(0,0),
            c = new Int64(0,0),
            d = new Int64(0,0),
            e = new Int64(0,0),
            f = new Int64(0,0),
            g = new Int64(0,0),
            h = new Int64(0,0),
            //Temporary variables not specified by the document
            s0 = new Int64(0, 0),
            s1 = new Int64(0, 0),
            Ch = new Int64(0, 0),
            Maj = new Int64(0, 0),
            r1 = new Int64(0, 0),
            r2 = new Int64(0, 0),
            r3 = new Int64(0, 0);
            var j, i;
            var W = new Array(80);
            for(i=0; i<80; i++)
                W[i] = new Int64(0, 0);

            // append padding to the source string. The format is described in the FIPS.
            x[len >> 5] |= 0x80 << (24 - (len & 0x1f));
            x[((len + 128 >> 10)<< 5) + 31] = len;

            for(i = 0; i<x.length; i+=32) //32 dwords is the block size
            {
                int64copy(a, H[0]);
                int64copy(b, H[1]);
                int64copy(c, H[2]);
                int64copy(d, H[3]);
                int64copy(e, H[4]);
                int64copy(f, H[5]);
                int64copy(g, H[6]);
                int64copy(h, H[7]);

                for(j=0; j<16; j++)
                {
                    W[j].h = x[i + 2*j];
                    W[j].l = x[i + 2*j + 1];
                }

                for(j=16; j<80; j++)
                {
                    //sigma1
                    int64rrot(r1, W[j-2], 19);
                    int64revrrot(r2, W[j-2], 29);
                    int64shr(r3, W[j-2], 6);
                    s1.l = r1.l ^ r2.l ^ r3.l;
                    s1.h = r1.h ^ r2.h ^ r3.h;
                    //sigma0
                    int64rrot(r1, W[j-15], 1);
                    int64rrot(r2, W[j-15], 8);
                    int64shr(r3, W[j-15], 7);
                    s0.l = r1.l ^ r2.l ^ r3.l;
                    s0.h = r1.h ^ r2.h ^ r3.h;

                    int64add4(W[j], s1, W[j-7], s0, W[j-16]);
                }

                for(j = 0; j < 80; j++)
                {
                    //Ch
                    Ch.l = (e.l & f.l) ^ (~e.l & g.l);
                    Ch.h = (e.h & f.h) ^ (~e.h & g.h);

                    //Sigma1
                    int64rrot(r1, e, 14);
                    int64rrot(r2, e, 18);
                    int64revrrot(r3, e, 9);
                    s1.l = r1.l ^ r2.l ^ r3.l;
                    s1.h = r1.h ^ r2.h ^ r3.h;

                    //Sigma0
                    int64rrot(r1, a, 28);
                    int64revrrot(r2, a, 2);
                    int64revrrot(r3, a, 7);
                    s0.l = r1.l ^ r2.l ^ r3.l;
                    s0.h = r1.h ^ r2.h ^ r3.h;

                    //Maj
                    Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
                    Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);

                    int64add5(T1, h, s1, Ch, sha512_k[j], W[j]);
                    int64add(T2, s0, Maj);

                    int64copy(h, g);
                    int64copy(g, f);
                    int64copy(f, e);
                    int64add(e, d, T1);
                    int64copy(d, c);
                    int64copy(c, b);
                    int64copy(b, a);
                    int64add(a, T1, T2);
                }
                int64add(H[0], H[0], a);
                int64add(H[1], H[1], b);
                int64add(H[2], H[2], c);
                int64add(H[3], H[3], d);
                int64add(H[4], H[4], e);
                int64add(H[5], H[5], f);
                int64add(H[6], H[6], g);
                int64add(H[7], H[7], h);
            }

            //represent the hash as an array of 32-bit dwords
            var hash = new Array(16);
            for(i=0; i<8; i++)
            {
                hash[2*i] = H[i].h;
                hash[2*i + 1] = H[i].l;
            }
            return hash;
        }

        //A constructor for 64-bit numbers
        function Int64(h, l)
        {
            this.h = h;
            this.l = l;
            //this.toString = int64toString;
        }

        //Copies src into dst, assuming both are 64-bit numbers
        function int64copy(dst, src)
        {
            dst.h = src.h;
            dst.l = src.l;
        }

        //Right-rotates a 64-bit number by shift
        //Won't handle cases of shift>=32
        //The function revrrot() is for that
        function int64rrot(dst, x, shift)
        {
            dst.l = (x.l >>> shift) | (x.h << (32-shift));
            dst.h = (x.h >>> shift) | (x.l << (32-shift));
        }

        //Reverses the dwords of the source and then rotates right by shift.
        //This is equivalent to rotation by 32+shift
        function int64revrrot(dst, x, shift)
        {
            dst.l = (x.h >>> shift) | (x.l << (32-shift));
            dst.h = (x.l >>> shift) | (x.h << (32-shift));
        }

        //Bitwise-shifts right a 64-bit number by shift
        //Won't handle shift>=32, but it's never needed in SHA512
        function int64shr(dst, x, shift)
        {
            dst.l = (x.l >>> shift) | (x.h << (32-shift));
            dst.h = (x.h >>> shift);
        }

        //Adds two 64-bit numbers
        //Like the original implementation, does not rely on 32-bit operations
        function int64add(dst, x, y)
        {
            var w0 = (x.l & 0xffff) + (y.l & 0xffff);
            var w1 = (x.l >>> 16) + (y.l >>> 16) + (w0 >>> 16);
            var w2 = (x.h & 0xffff) + (y.h & 0xffff) + (w1 >>> 16);
            var w3 = (x.h >>> 16) + (y.h >>> 16) + (w2 >>> 16);
            dst.l = (w0 & 0xffff) | (w1 << 16);
            dst.h = (w2 & 0xffff) | (w3 << 16);
        }

        //Same, except with 4 addends. Works faster than adding them one by one.
        function int64add4(dst, a, b, c, d)
        {
            var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff);
            var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (w0 >>> 16);
            var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (w1 >>> 16);
            var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (w2 >>> 16);
            dst.l = (w0 & 0xffff) | (w1 << 16);
            dst.h = (w2 & 0xffff) | (w3 << 16);
        }

        //Same, except with 5 addends
        function int64add5(dst, a, b, c, d, e)
        {
            var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff) + (e.l & 0xffff);
            var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (e.l >>> 16) + (w0 >>> 16);
            var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (e.h & 0xffff) + (w1 >>> 16);
            var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (e.h >>> 16) + (w2 >>> 16);
            dst.l = (w0 & 0xffff) | (w1 << 16);
            dst.h = (w2 & 0xffff) | (w3 << 16);
        }

        return {
            "_get_hexcase_": gethexcase, "_set_hexcase_": sethexcase,
            "_get_padchar_": getpadchar, "_set_padchar_": setpadchar,
            "_get_outenc_": getenc, "_set_outenc_": setenc,
            "hex": rstr2hex, b64: "rst2b64", base64: "rst2b64",
            "array": rstr2binl, "binl": rstr2binl,
            hex_md5: hex_md5,
            b64_md5: b64_md5,
            md5: any_md5,
            hex_hmac_md5: hex_hmac_md5,
            b64_hmac_md5: b64_hmac_md5,
            hmac_md5: any_hmac_md5,
            hex_rmd160: hex_rmd160,
            b64_rmd160: b64_rmd160,
            rmd160: any_rmd160,
            hex_hmac_rmd160: hex_hmac_rmd160,
            b64_hmac_rmd160: b64_hmac_rmd160,
            hmac_rmd160: any_hmac_rmd160,
            hex_sha1: hex_sha1,
            b64_sha1: b64_sha1,
            sha1: any_sha1,
            hex_hmac_sha1: hex_hmac_sha1,
            b64_hmac_sha1: b64_hmac_sha1,
            hmac_sha1: any_hmac_sha1,
            hex_sha256: hex_sha256,
            b64_sha256: b64_sha256,
            sha256: any_sha256,
            hex_hmac_sha256: hex_hmac_sha256,
            b64_hmac_sha256: b64_hmac_sha256,
            hmac_sha256: any_hmac_sha256,
            hex_sha512: hex_sha512,
            b64_sha512: b64_sha512,
            sha512: any_sha512,
            hex_hmac_sha512: hex_hmac_sha512,
            b64_hmac_sha512: b64_hmac_sha512,
            hmac_sha512: any_hmac_sha512};

    })();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/log.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

fdjt.Log=(function(){
    "use strict";
    var fdjtString=fdjt.String;

    var backlog=[];

    var use_console_log;
    var compactString=fdjt.Time.compactString, ET=fdjt.ET;

    function fdjtLog(string){
        var output=false; var now=ET(), date=new Date();
        var i, lim;
        if (((fdjtLog.doformat)||(string.search("%j")))&&
            (typeof fdjtString !== 'undefined'))
            output=fdjtString.apply(null,arguments);
        if (fdjtLog.console_fn) {
            if (output) fdjtLog.console_fn.call(fdjtLog.console,output);
            else fdjtLog.console_fn.apply(fdjtLog.console,arguments);}
        if (fdjtLog.logurl) {
            var msg="["+now+"s "+compactString(date,false)+"] "+
                fdjtString.apply(null,arguments);
            if (window.console)
                window.console.log("remote logging %s",msg);
            remote_log(msg);}
        if (fdjtLog.console) {
            var domconsole=fdjtLog.console;
            var timespan=fdjt.DOM("span.time",now);
            var abstime=fdjt.DOM("span.abstime",compactString(date));
            var entry=fdjt.DOM("div.fdjtlog");
            if (output) entry.innerHTML=output;
            else entry.innerHTML=fdjtString.apply(null,arguments);
            fdjt.DOM.prepend(entry,timespan);
            fdjt.DOM.prepend(entry,abstime);
            if (typeof domconsole === 'string') {
                var found=document.getElementById(domconsole);
                if (found) {
                    domconsole=fdjtLog.console=found;}
                else domconsole=false;}
            if ((domconsole)&&(!(domconsole.nodeType))) domconsole=false;
            if ((domconsole)&&(fdjtLog.livelog)) {
                update_log(domconsole);
                domconsole.appendChild(entry);
                domconsole.appendChild(document.createTextNode("\n"));}
            else if ((!(domconsole))||(domconsole.offsetHeight===0))
                backlog.push(entry);
            else {
                update_log(domconsole);
                domconsole.appendChild(entry);
                domconsole.appendChild(document.createTextNode("\n"));}}
        if ((fdjtLog.useconsole)||
            ((!(fdjtLog.console))&&(!(fdjtLog.console_fn)))) {
            if (typeof use_console_log === 'undefined')
                init_use_console_log();
            if (use_console_log) {
                if (!(window.console.log.call)) 
                    // In IE, window.console.log is an object, not a function,
                    //  but a straight call still works.
                    window.console.log(
                        "["+now+"s] "+fdjtString.apply(null,arguments));
                else if (output)
                    window.console.log.call(
                        window.console,"["+now+"s] "+output);
                else {
                    var newargs=new Array(arguments.length+1);
                    newargs[0]="[%fs] "+string;
                    newargs[1]=now;
                    i=1; lim=arguments.length;
                    while (i<lim) {newargs[i+1]=arguments[i]; i++;}
                    window.console.log.apply(window.console,newargs);}}}}
    fdjtLog.console=null;

    function update_log(domconsole){
        if ((backlog)&&(backlog.length)) {
            var frag=document.createDocumentFragment();
            var log=backlog; backlog=false;
            var i=0, lim=log.length; while (i<lim) {
                frag.appendChild(log[i++]);
                frag.appendChild(document.createTextNode("\n"));}
            domconsole.appendChild(frag);
            backlog=[];}}
    fdjtLog.update=function(){
        if (fdjtLog.console) update_log(fdjtLog.console);};

    function remote_log(msg){
        var req=new XMLHttpRequest();
        req.open('POST',fdjtLog.logurl,(!(fdjtLog.logsync)));
        req.setRequestHeader("Content-type","text; charset=utf-8");
        req.send(msg);
        return req;}

    fdjtLog.warn=function(){
        if ((!(fdjtLog.console_fn))&&
            (!(window.console)&&(window.console.log)&&
             (window.console.log.count))) {
            var output=fdjtString.apply(null,arguments);
            window.alert(output);}
        else fdjtLog.apply(null,arguments);};

    fdjtLog.uhoh=function(){
        if (fdjtLog.debugging) fdjtLog.warn.call(this,arguments);};

    fdjtLog.bkpt=function(){
        var output=false;
        if ((fdjtLog.doformat)&&(typeof fdjtString !== 'undefined'))
            output=fdjtString.apply(null,arguments);
        if (fdjtLog.console_fn)
            if (output) fdjtLog.console_fn(fdjtLog.console,output);
        else fdjtLog.console_fn.apply(fdjtLog.console,arguments);
        else if ((window.console) && (window.console.log) &&
                 (window.console.count))
            if (output)
                window.console.log.call(window.console,output);
        else window.console.log.apply(window.console,arguments);
    };

    fdjtLog.useconsole=true;

    function init_use_console_log() {
        if ((window.console)&&(window.console.log)) {
            if (window.console.count) use_console_log=true;
            else {
                use_console_log=true;
                try {window.console.log("Testing console");}
                catch (ex) { use_console_log=false;}}}
        else use_console_log=false;}


    // This is for temporary trace statements; we use a different name
    //  so that they're easy to find.
    fdjt.Trace=fdjt.Log;
    
    return fdjtLog;})(window,document);


/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/init.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/

//var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

(function(){
    "use strict";
    var fdjtLog=fdjt.Log;
    var inits_run=false;
    var inits=[], run=[];
    var init_names={};

    function addInit(fcn,name,runagain){
        if (!(checkInit(fcn,name))) return;
        var replace=((name)&&(init_names[name]));
        var i=0, lim=inits.length;
        while (i<lim) {
            if ((replace)&&(inits[i]===replace)) {
                if (inits_run) {
                    fdjtLog.warn(
                        "Replacing init %s which has already run",name);
                    if (runagain) {
                        fdjtLog.warn("Running the new version");
                        inits[i]=fcn; init_names[name]=fcn; fcn();
                        return;}}
                else {
                    inits[i]=fcn; init_names[name]=fcn;
                    return;}}
            else if (inits[i]===fcn) return;
            else i++;}
        if (name) init_names[name]=fcn;
        inits.push(fcn);
        if (inits_run) {
            fcn(); run.push(true);}
        else run.push(false);}
    fdjt.addInit=addInit;
    
    function checkInit(fcn,name){
        if ((!(fcn))||(!(fcn.call))) {
            fdjtLog.warn("Bad argument to addInit(): %s",
                        name||"anonymous",fcn);
            return false;}
        else return true;}
    
    fdjt.Init=function fdjtInit(){
        var names=[];
        if (inits_run) return false;
        for (var name in init_names)
            if (init_names.hasOwnProperty(name)) names.push(name);
        if (names.length===0)
            fdjtLog("Running %d DOM inits",inits.length);
        else if (names.length===inits.length)
            fdjtLog("Running %d DOM inits (%s)",
                    inits.length,names.join());
        else fdjtLog("Running %d DOM inits (including %s)",
                     inits.length,names.join());
        var i=0; var lim=inits.length;
        while (i<lim) {
            if (run[i]) i++; 
            else {
                run[i]=true; 
                inits[i]();
                i++;}}
        inits_run=true;};

    var numpat=/^\d+(\.\d+)$/;
    function getMatch(string,rx,i,literal){
        var match=rx.exec(string);
        if (typeof i === "undefined") i=0;
        if ((match)&&(match.length>i)) {
            if (literal) return match[i];
            else if (numpat.test(match[i]))
                return parseFloat(match[i]);
            else return match[i];}
        else return false;}
    
    var spacechars="\n\r\t\f\x0b\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u202f\u205f\u3000\uf3ff";

    function stdspace(string){
        string=string.replace(/\s+/g," ");
        var start=0; var len=string.length; 
        if (len<=0) return string;
        while ((start<len)&&
               (spacechars.indexOf(string.charAt(start))>-1))
            start++;
        if (start===len) return "";
        var end=len-1;
        while ((end>start)&&(spacechars.indexOf(string.charAt(end))>-1))
            end--;
        if ((start>0)||(end<len)) return string.slice(start,end+1);
        else return string;}
    
    var device=(fdjt.device)||(fdjt.device={});
        /* Setting up media info */
    function identifyDevice(){
        if ((fdjt.device)&&(fdjt.device.started)) return;
        var navigator=window.navigator;
        var appversion=navigator.userAgent;
        
        var isAndroid = getMatch(appversion,/\bAndroid +(\d+\.\d+)\b/g,1);
        var isWebKit = getMatch(appversion,/\bAppleWebKit\/(\d+\.\d+)\b/g,1);
        var isGecko = getMatch(appversion,/\bGecko\/(\d+)\b/gi,1,true);
        var isChrome = getMatch(appversion,/\bChrome\/(\d+\.\d+)\b/g,1);
        var isFirefox = getMatch(appversion,/\bFirefox\/(\d+\.\d+)\b/gi,1);
        var isSafari = getMatch(appversion,/\bSafari\/(\d+\.\d+)\b/gi,1);
        var isOSX = getMatch(appversion,/\bMac OS X \/(\d+\_\d+)\b/gi,1,true);
        var isMobileSafari = (isSafari)&&(getMatch(appversion,/\bMobile\/(\w+)\b/gi,1,true));
        var isMobileWebKit = (isWebKit)&&(getMatch(appversion,/\bMobile\/(\w+)\b/gi,1,true));
        var isMobile = (getMatch(appversion,/\bMobile\/(\w+)\b/gi,1,true));
        var hasVersion = getMatch(appversion,/\bVersion\/(\d+\.\d+)\b/gi,1);
        
        var isUbuntu = (/ubuntu/gi).test(appversion);
        var isRedHat = (/redhat/gi).test(appversion);
        var isLinux = (/linux/gi).test(appversion);
        var isMacintosh = (/Macintosh/gi).test(appversion);
        
        var isTouchPad = (/Touchpad/gi).test(appversion);
        var iPhone = (/iphone/gi).test(appversion);
        var iPad = (/ipad/gi).test(appversion);
        var isTouch = iPhone || iPad || isAndroid || isTouchPad;
        var isIOS=((iPhone)||(iPad))&&
            ((getMatch(appversion,/\bVersion\/(\d+\.\d+)\b/gi,1))||(true));
        
        var opt_string=stdspace(
            ((isAndroid)?(" Android/"+isAndroid):(""))+
                ((isWebKit)?(" WebKit/"+isWebKit):(""))+
                ((isGecko)?(" Gecko/"+isGecko):(""))+
                ((isChrome)?(" Chrome/"+isChrome):(""))+
                ((isFirefox)?(" Firefox/"+isFirefox):(""))+
                ((isSafari)?(" Safari/"+isSafari):(""))+
                ((isMobileSafari)?(" MobileSafari/"+isMobileSafari):(""))+
                ((isMobileWebKit)?(" MobileWebKit/"+isMobileWebKit):(""))+
                ((isIOS)?(" IOS/"+isIOS):(""))+
                ((isOSX)?(" OSX/"+isOSX):(""))+
                ((navigator.platform)?(" "+navigator.platform):(""))+
                ((iPhone)?(" iPhone"):(""))+
                ((iPad)?(" iPad"):(""))+
                ((isTouchPad)?(" TouchPad"):(""))+
                ((isTouch)?(" touch"):(" mouse")));
        if (navigator.vendor) device.vendor=navigator.vendor;
        if (navigator.platform) device.platform=navigator.platform;
        if (navigator.oscpu) device.oscpu=navigator.oscpu;
        if (navigator.cookieEnabled) device.cookies=navigator.cookies;
        if (navigator.doNotTrack) device.notrack=navigator.doNotTrack;
        if (navigator.standalone) device.standalone=navigator.standalone;
        device.string=opt_string;
        if (isAndroid) device.android=isAndroid;
        if (isIOS) {
            device.ios=isIOS;
            if (iPhone) device.iphone=isIOS;
            if (iPad) device.ipad=isIOS;}
        if (isChrome) device.chrome=isChrome;
        if (iPad) device.iPad=true;
        if (iPhone) device.iPhone=true;
        if (isIOS) device.ios=true;
        if (isOSX) device.osx=true;
        if (isWebKit) device.webkit=isWebKit;
        if (isSafari) device.safari=isSafari;
        if (isMobileSafari) device.mobilesafari=isMobileSafari;
        if (isMobileWebKit) device.mobilewebkit=isMobileWebKit;
        if (isMobile) device.mobile=isMobile;
        if (hasVersion) device.version=hasVersion;
        if (isMacintosh) device.isMacintosh=true;
        if (isUbuntu) device.ubuntu=true;
        if (isRedHat) device.redhat=true;
        if (isLinux) device.linux=true;
        if (isTouch) device.touch=true;
        else device.mouse=true;
        fdjtLog("Device: %j",device);}
    
    (function(){
        /* global window: false */
        if ((typeof window !=="undefined")&&(window.navigator)&&
            (window.navigator.appVersion))
            identifyDevice();})();
})();


/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/state.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true, sub: true */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

fdjt.State=
    (function(){
        "use strict";
        var fdjtLog=fdjt.Log;
        var fdjtString=fdjt.String;

        function fdjtState(name,val,persist){
            if (arguments.length===1)
                return ((window.sessionStorage)&&(getSession(name)))||
                ((window.sessionStorage)&&(getLocal(name)))||
                getCookie(name);
            else if (persist)
                if (window.localStorage)
                    if (val) setLocal(name,val);
            else dropLocal(name);
            else {
                var domain=fdjtState.domain||location.hostname;
                var path=fdjtState.path||"/";
                var duration=fdjtState.duration||(3600*24*365*7);
                if (val) setCookie(name,val,duration,path,domain);
                else clearCookie(name,path,domain);}
            else if (val)
                if (window.sessionStorage) setSession(name,val);
            else setCookie(name,val);
            else if (window.sessionStorage) dropSession(name);
            else clearCookie(name);}
        fdjtState.domain=false;
        fdjtState.path=false;
        fdjtState.duration=false;

        /* Old-school cookies */

        function getCookie(name,parse){
            try {
                var cookies=document.cookie;
                var namepat=new RegExp("(^|(; ))"+name+"=","g");
                var pos=cookies.search(namepat);
                var valuestring;
                if (pos>=0) {
                    var start=cookies.indexOf('=',pos)+1;
                    var end=cookies.indexOf(';',start);
                    if (end>0) valuestring=cookies.slice(start,end);
                    else valuestring=cookies.slice(start);}
                else return false;
                if (parse)
                    return JSON.parse(decodeURIComponent(valuestring));
                else return decodeURIComponent(valuestring);}
            catch (ex) {
                return false;}}
        fdjtState.getCookie=getCookie;

        function setCookie(name,value,expires,path,domain){
            try {
                if (value) {
                    var valuestring=
                        ((typeof value === 'string') ? (value) :
                         (value.toJSON) ? (value.toJSON()) :
                         (value.toString) ? (value.toString()) : (value));
                    var cookietext=name+"="+encodeURIComponent(valuestring);
                    if (expires)
                        if (typeof(expires)==='string')
                            cookietext=cookietext+'; '+expires;
                    else if (expires.toGMTString)
                        cookietext=cookietext+"; expires="+expires.toGMTString();
                    else if (typeof(expires)==='number')
                        if (expires>0) {
                            var now=new Date();
                            now.setTime(now.getTime()+expires);
                            cookietext=cookietext+"; expires="+now.toGMTString;}
                    else cookietext=cookietext+"; expires=Sun 1 Jan 2000 00:00:00 UTC";
                    else {}
                    if (path) cookietext=cookietext+"; path="+path;
                    // This certainly doesn't work generally and might not work ever
                    if (domain) cookietext=cookietext+"; domain="+domain;
                    // fdjtTrace("Setting cookie %o cookietext=%o",name,cookietext);
                    document.cookie=cookietext;}
                else clearCookie(name,path,domain);}
            catch (ex) {
                fdjtLog.warn("Error setting cookie %s",name);}}
        fdjtState.setCookie=setCookie;
        
        function clearCookie(name,path,domain){
            try {
                var cookietext=encodeURIComponent(name)+
                    "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                if (path) cookietext=cookietext=cookietext+"; path="+path;
                if (domain) cookietext=cookietext=cookietext+"; domain="+domain;
                document.cookie=cookietext;}
            catch (ex) {
                fdjtLog.warn("Error clearing cookie %s: %s",
                             name,ex);}
            if (getCookie(name)) {
                var altcookietext=encodeURIComponent(name)+
                    "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie=altcookietext;}}
        fdjtState.clearCookie=clearCookie;

        /* Session storage */

        function setSession(name,val,unparse){
            if (unparse) val=JSON.stringify(val);
            if (window.sessionStorage)
                window.sessionStorage[name]=val;
            else setCookie(name,val);}
        fdjtState.setSession=setSession;

        function getSession(name,parse){
            var val=((window.sessionStorage)?
                     (window.sessionStorage[name]):
                     (getCookie(name)));
            if (val)
                if (parse) return JSON.parse(val); else return val;
            else return false;}
        fdjtState.getSession=getSession;

        function existsSession(name){
            if (!(name)) throw { error: "bad name",name: name};
            else if (window.sessionStorage) {
                if (name instanceof RegExp) {
                    var storage=window.sessionStorage;
                    var i=0; var lim=storage.length;
                    while (i<lim) {
                        var key=storage.key(i++);
                        if (key.search(name)>=0) return true;}
                    return false;}
                else {
                    var val=window.sessionStorage[name];
                    if (typeof val === "undefined") return false;
                    else return true;}}
            else return false;}
        fdjtState.existsSession=existsSession;

        function dropSession(name){
            if (window.sessionStorage)
                return window.sessionStorage.removeItem(name);
            else clearCookie(name);}
        fdjtState.dropSession=dropSession;

        function clearSession(){
            if (window.sessionStorage) {
                var storage=window.localStorage;
                var i=0; var lim=storage.length;
                var keys=[];
                while (i<lim) keys.push(storage.key(i++));
                i=0; while (i<lim) storage.removeItem(keys[i++]);}}
        fdjtState.clearSession=clearSession;
        
        function listSession(name){
            var keys=[];
            if (typeof name === "string")
                name=new RegExp("^"+fdjtString.escapeRX(name),"g");
            if (window.sessionStorage) {
                var storage=window.sessionStorage;
                var i=0, lim=storage.length, key=false;
                if (!(name)) {
                    while (i<lim) keys.push(storage.key(i++));}
                else if (name instanceof RegExp) while (i<lim) {
                    key=storage.key(i++);
                    if (key.search(name)>=0) keys.push(key);}
                else {}}
            return keys;}
        fdjtState.listSession=listSession;

        /* Local storage (persists between sessions) */

        function setLocal(name,val,unparse){
            if (!(name)) throw { error: "bad name",name: name};
            if (typeof val === "undefined")
                throw { error: "undefined value", name: name};
            if (!(val)) {dropLocal(name); return;}
            if (unparse) val=JSON.stringify(val);
            if (window.localStorage) {
                if (name instanceof RegExp) {
                    var keys=[];
                    var storage=window.localStorage;
                    var i=0; var lim=storage.length;
                    while (i<lim) {
                        var key=storage.key(i++);
                        if (key.search(name)>=0) keys.push(key);}
                    i=0; lim=keys.length; while (i<lim) {
                        storage[keys[i++]]=val;}}
                else window.localStorage[name]=val;}}
        fdjtState.setLocal=setLocal;

        function getLocal(name,parse){
            if (!(name)) throw { error: "bad name",name: name};
            else if (window.localStorage) {
                if (name instanceof RegExp) {
                    var storage=window.localStorage;
                    var i=0; var lim=storage.length;
                    while (i<lim) {
                        var key=storage.key(i++);
                        if (key.search(name)>=0) {
                            return ((parse)?(JSON.parse(storage[key])):
                                    (storage[key]));}}
                    return false;}
                else {
                    var val=window.localStorage[name];
                    if (val)
                        if (parse) return JSON.parse(val); else return val;
                    else return false;}}
            else return false;}
        fdjtState.getLocal=getLocal;

        function pushLocal(name,val){
            if (!(name)) throw { error: "bad name",name: name};
            var fetched=window.localStorage[name], array=false;
            if (fetched) {
                array=JSON.parse(fetched);
                if (!(Array.isArray(array))) array=[array];
                if (array.indexOf(val)<0) array.push(val);
                else return false;}
            else array=[val];
            window.localStorage[name]=JSON.stringify(array);
            return true;}
        fdjtState.pushLocal=pushLocal;

        function removeLocal(name,val){
            if (!(name)) throw { error: "bad name",name: name};
            var fetched=window.localStorage[name];
            if (fetched) {
                var array=JSON.parse(fetched), loc;
                if (array===val) {
                    dropLocal(name); return;}
                else if (!(Array.isArray(array))) return;
                else loc=array.indexOf(val);
                if (loc<0) return; else array.splice(loc,1);
                window.localStorage[name]=JSON.stringify(array);}
            return true;}
        fdjtState.removeLocal=removeLocal;

        function existsLocal(name){
            if (!(name)) throw { error: "bad name",name: name};
            else if (window.localStorage) {
                if (name instanceof RegExp) {
                    var storage=window.localStorage;
                    var i=0; var lim=storage.length;
                    while (i<lim) {
                        var key=storage.key(i++);
                        if (key.search(name)>=0) return true;}
                    return false;}
                else {
                    var val=window.localStorage[name];
                    if (typeof val === "undefined") return false;
                    else return true;}}
            else return false;}
        fdjtState.existsLocal=existsLocal;

        function findLocal(name,val,parse){
            if (window.localStorage) {
                var result={};
                var storage=window.localStorage;
                var i=0; var lim=storage.length;
                while (i<lim) {
                    var key=storage.key(i++);
                    if ((!(name))||(key.search(name)>=0)) {
                        var v=storage[key];
                        if ((!(val))||(v.search(val)>=0)) {
                            if (parse) {
                                try {v=JSON.parse(v);} catch (ex) {}}
                            result[key]=v;}}}
                return result;}
            else return false;}
        fdjtState.findLocal=findLocal;

        function dropLocal(name){
            if (window.localStorage) {
                if (name instanceof RegExp) {
                    var drop=[];
                    var storage=window.localStorage;
                    var i=0; var lim=storage.length;
                    while (i<lim) {
                        var key=storage.key(i++);
                        if (key.search(name)>=0) drop.push(key);}
                    i=0; lim=drop.length; while (i<lim) {
                        storage.removeItem(drop[i++]);}}
                else return window.localStorage.removeItem(name);}
            else return false;}
        fdjtState.dropLocal=dropLocal;
        
        function listLocal(name){
            var keys=[];
            if (typeof name === "string")
                name=new RegExp("^"+fdjtString.escapeRX(name),"g");
            if (window.localStorage) {
                var storage=window.localStorage;
                var i=0, lim=storage.length, key=false;
                if (!(name)) {
                    while (i<lim) keys.push(storage.key(i++));}
                else if (name instanceof RegExp) while (i<lim) {
                    key=storage.key(i++);
                    if (key.search(name)>=0) keys.push(key);}
                else {}}
            return keys;}
        fdjtState.listLocal=listLocal;

        function clearLocal(){
            if (window.localStorage) {
                var storage=window.localStorage;
                var i=0; var lim=storage.length;
                var keys=[];
                while (i<lim) keys.push(storage.key(i++));
                i=0; while (i<lim) storage.removeItem(keys[i++]);}}
        fdjtState.clearLocal=clearLocal;

        /* Gets arguments from the query string */
        function getParam(from,name,multiple,matchcase,verbatim,start){
            var results=[];
            var ename=encodeURIComponent(name);
            var namepat=new RegExp("(&|^)"+ename+"(=|&|$)",
                                   ((matchcase)?"g":"gi"));
            start=from.search(namepat);
            while (start>=0) {
                // Skip over separator if non-initial
                var valstart=start+ename.length;
                var valstring=from.slice(valstart+1);
                var end=valstring.search(/(&|$)/g);
                if (from[valstart]==="=") {
                    if (end<=0) {
                        results.push("");
                        if (!(multiple)) break;}
                    else {
                        results.push(valstring.slice(0,end));
                        end=end+valstart+1;
                        if (!(multiple)) break;}}
                else if (multiple) 
                    results.push(from.slice(start,end));
                else if (verbatim) 
                    return from.slice(start,end);
                else return querydecode(from.slice(start,end));
                if (end>0) {
                    from=from.slice(end);
                    start=from.search(namepat);}}
            if (!(verbatim)) {
                var i=0; var lim=results.length;
                while (i<lim) {results[i]=querydecode(results[i]); i++;}}
            if (multiple) return results;
            else if (results.length)
                return results[0];
            else return false;}
        fdjtState.getParam=getParam;

        function getQuery(name,multiple,matchcase,verbatim){
            if (!(location.search))
                if (multiple) return [];
            else return false;
            var from=location.search;
            if (from[0]==="?") from=from.slice(1);
            return getParam(from,name,multiple,matchcase,verbatim);}
        fdjtState.getQuery=getQuery;
        
        function getHash(name,multiple,matchcase,verbatim){
            if (!(location.hash))
                if (multiple) return [];
            else return false;
            var from=location.hash;
            if (from[0]==="#") from=from.slice(1);
            return getParam(location.hash,name,multiple,matchcase,verbatim);}
        fdjtState.getHash=getHash;

        function querydecode(string){
            if (decodeURIComponent)
                return decodeURIComponent(string);
            else return string.replace
            (/%3A/gi,":").replace
            (/%2F/gi,"/").replace
            (/%3F/gi,"?").replace
            (/%3D/gi,"=").replace
            (/%20/gi," ").replace
            (/%40/gi,"@").replace
            (/%23/gi,"#");}

        function test_opt(pos,neg){
            var pospat=((pos)&&(new RegExp("\\b"+pos+"\\b")));
            var negpat=((neg)&&negative_opt_pat(neg));
            var i=2; while (i<arguments.length) {
                var arg=arguments[i++];
                if (!(arg)) continue;
                else if (typeof arg === 'string')
                    if ((pospat)&&(arg.search(pospat)>=0)) return true;
                else if ((negpat)&&(arg.search(negpat)>=0)) return false;
                else continue;
                else if (arg.length) {
                    var j=0; var len=arg.length;
                    while (j<len)
                        if ((pos)&&(arg[j]===pos)) return true;
                    else if ((neg)&&(arg[j]===neg)) return false;
                    else j++;
                    return false;}
                else continue;}
            return false;}
        fdjtState.testOption=test_opt;

        function negative_opt_pat(neg){
            if (!(neg)) return neg;
            else if (typeof neg === 'string')
                return (new RegExp("\\b"+neg+"\\b","gi"));
            else if (neg.length) {
                var rule="\\b(";
                var i=0; while (i<neg.length) {
                    var name=neg[i];
                    if (i>0) rule=rule+"|";
                    rule=rule+"("+name+")";
                    i++;}
                rule=rule+")\\b";
                return new RegExp(rule,"gi");}
            else return false;}

        fdjtState.argVec=function(argobj,start){
            var i=start||0;
            var result=new Array(argobj.length-i);
            while (i<argobj.length) {
                result[i-start]=argobj[i]; i++;}
            return result;};

        var zeros="000000000000000000000000000000000000000000000000000000000000000";
        function zeropad(string,len){
            if (string.length===len) return string;
            else if (string.length>len) return string.slice(0,len);
            else return zeros.slice(0,len-string.length)+string;}
        
        // This is a random nodeid used to generate UUIDs
        //  We use it because we can't access the MAC address
        var nodeid=
            zeropad(((Math.floor(Math.random()*65536)).toString(16)+
                     (Math.floor(Math.random()*65536)).toString(16)+
                     (Math.floor(Math.random()*65536)).toString(16)+
                     (Math.floor(Math.random()*65536)|0x01)).toString(16),
                    12);
        
        var clockid=Math.floor(Math.random()*16384); var msid=1;
        var last_time=new Date().getTime();
        
        fdjtState.getNodeID=function(){return nodeid;};
        fdjtState.setNodeID=function(arg){
            if (typeof arg==='number')
                nodeid=zeropad(arg.toString(16),12);
            else if (typeof arg === 'string')
                if (arg.search(/[^0123456789abcdefABCDEF]/)<0)
                    nodeid=zeropad(arg,12);
            else throw {error: 'invalid node id',value: arg};
            else throw {error: 'invalid node id',value: arg};};

        function getUUID(node){
            var now=new Date().getTime();
            if (now<last_time) {now=now*10000; clockid++;}
            else if (now===last_time)   now=now*10000+(msid++);
            else {now=now*10000; msid=1;}
            now=now+122192928000000000;
            if (!(node)) node=nodeid;
            var timestamp=now.toString(16); var tlen=timestamp.length;
            if (tlen<15) timestamp=zeros.slice(0,15-tlen)+timestamp;
            return timestamp.slice(7)+"-"+timestamp.slice(3,7)+
                "-1"+timestamp.slice(0,3)+
                "-"+(32768+(clockid%16384)).toString(16)+
                "-"+((node)?
                     ((typeof node === 'number')?
                      (zeropad(node.toString(16),12)):
                      (zeropad(node,12))):
                     (nodeid));}
        fdjtState.getUUID=getUUID;
        
        // Getting version information
        function versionInfo(){
            var s=navigator.userAgent; var result={};
            var start;
            while ((start=s.search(/\w+\/\d/g))>=0) {
                var slash=s.indexOf('/',start);
                var afterslash=s.slice(slash+1);
                var num_end=afterslash.search(/\W/);
                var numstring=afterslash.slice(0,num_end);
                try {
                    result[s.slice(start,slash)]=parseInt(numstring,10);}
                catch (ex) {
                    result[s.slice(start,slash)]=numstring;}
                s=afterslash.slice(num_end);}
            if (result['Chrome']) result.browser='Chrome';
            else if (result['Opera']) result.browser='Opera';
            else if (result['Safari']) result.browser='Safari';
            else if ((result['Safari'])&&(result['Mobile']))
                result.browser='MobileSafari';
            else if (result['Firefox']) result.browser='Firefox';
            else if ((result['Explorer'])||(result['IE'])||
                     (result['InternetExplorer'])||(result['MSIE']))
                result.browser='IE';
            else if (result['Mozilla']) result.browser='Mozilla';
            else result.browser='Browser';
            result.platform=navigator.platform||"Turing";
            return result;}
        fdjtState.versionInfo=versionInfo;

        function getStyleTag() {
            // This is a trick for making a tag value visible to Javascript from CSS
            // From: http://tech.particulate.me/javascript/2013/10/10/how-to-conveniently-check-for-responsive-breakpoints-in-javascript/
            var tag = window.getComputedStyle(document.body,':after').getPropertyValue('content');
            tag = tag.replace(/"/g,'');   // Firefox bugfix
            return tag;}
        // To use it, define:
        //    body:after { content: 'styletag'; }
        // in your CSS.  This is typically done inside the @media rules which define
        // adaptive design breakpoints
        fdjtState.getStyleTag=getStyleTag;

        function getURL(keepquery,keephash){
            var url=window.location.href;
            var hashpos=url.indexOf('#'), qpos=url.indexOf('?');
            var hash=((keephash)&&(hashpos>=0)&&(url.slice(hashpos+1)));
            var query=((keepquery)&&(qpos>=0)&&
                       ((hashpos>=0)?(url.slice(qpos+1,hashpos)):
                        (url.slice(qpos+1))));
            url=((qpos>=0)?(url.slice(0,qpos)):
                 (hashpos>=0)?(url.slice(0,hashpos)):
                 (url));
            return url+((query)?("?"+query):(""))+((hash)?("#"+hash):(""));}
        fdjtState.getURL=getURL;

        return fdjtState;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/dom.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));
var _fdjt_init;

fdjt.DOM=
    (function(){
        "use strict";
        var usenative=true;
        var fdjtString=fdjt.String;
        var fdjtLog=fdjt.Log;

        var css_selector_regex=/((^|[.#])[^.#\[\s]+)|(\[[^ \]=]+=[^\]]+\])|(\[[^ \]=]+\])/ig;

        function fdjtDOM(spec){
            var node;
            if (spec.nodeType) node=spec;
            else if ((typeof spec==='string')&&(spec[0]==='<'))  {
                var container=document.createDocumentFragment();
                // We could do template expansion here
                container.innerHTML=spec;
                var children=container.childNodes;
                if (children.length===1) return children[0];
                else return container;}
            else if ((typeof spec==='string')&&(spec[0]==='#')&&
                     (node=document.getElementById(spec.slice(1)))) {}
            else if (typeof spec==='string') {
                var elts=spec.match(css_selector_regex);
                if (!(elts)) {
                    fdjtLog.warn("bad CSS spec");
                    return false;}
                var classname=false;
                node=document.createElement(elts[0]);
                var i=1; var len=elts.length;
                while (i<len) {
                    var sel=elts[i++];
                    if (sel[0]==='#') node.id=sel.slice(1);
                    else if (sel[0]==='.')
                        if (classname) classname=classname+" "+sel.slice(1);
                    else classname=sel.slice(1);
                    else if (sel[0]==='[') {
                        var eqpos=sel.indexOf('=');
                        if (eqpos<0) {
                            node.setAttribute(
                                sel.slice(1,sel.length-1),
                                sel.slice(1,sel.length-1));}
                        else {
                            var val=sel.slice(eqpos+1,sel.length-1);
                            if (((val[0]==="'")&&(val[val.length-1]==="'"))||
                                ((val[0]==='"')&&(val[val.length-1]==='"')))
                                val=val.slice(1,val.length-1);
                            node.setAttribute(sel.slice(1,eqpos),val);}}
                    else {}}
                if (classname) node.className=classname;}
            else {
                node=document.createElement(spec.tagName||"span");
                for (var attrib in spec) {
                    if (attrib==="tagName") continue;
                    else node.setAttribute(attrib,spec[attrib]);}}
            domappend(node,arguments,1);
            return node;}

        fdjtDOM.useNative=function(flag) {
            if (typeof flag === 'undefined') return usenative;
            else usenative=flag;};
        
        fdjtDOM.clone=function(node){
            return node.cloneNode(true);};

        function getIE(){
            if (navigator.appName === 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent;
                var re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
                var rv;
                if (re.exec(ua) !== null)
                    rv = parseFloat( re.$1 );
                else rv=1;
                // Fails for non-whole numbers
                if (rv<=0) rv=1;
                return rv;}
            else return 0;}

        fdjtDOM.ie=getIE();
        fdjtDOM.iem=Math.floor(fdjtDOM.ie);

        function fdjtID(id) {
            return ((id)&&
                    ((document.getElementById(id))||
                     ((id[0]==='#')&&
                      (document.getElementById(id.slice(1))))));}
        fdjt.ID=fdjtID;

        function domappend(node,content,i) {
            if (content.nodeType) node.appendChild(content);
            else if (typeof content === 'string') 
                node.appendChild(document.createTextNode(content));
            else if (content.toDOM)
                return domappend(node,content.toDOM());
            else if (content.toHTML)
                return domappend(node,content.toHTML());
            else if ((content.length)&&((!(i))||(i<content.length))) {
                var frag=(((window.DocumentFragment)&&
                           (node instanceof window.DocumentFragment))?
                          (node):(document.createDocumentFragment()));
                // We copy node lists because they're prone to change
                // underneath us as we're moving DOM nodes around.
                var elts=((window.NodeList)&&(content instanceof window.NodeList))?
                    (TOA(content)):(content);
                var len=elts.length; 
                if (typeof i === 'undefined') i=0;
                while (i<len) {
                    var elt=elts[i++];
                    if (!(elt)) {}
                    else if (typeof elt === 'string')
                        frag.appendChild(document.createTextNode(elt));
                    else if (elt.nodeType) frag.appendChild(elt);
                    else if (elt.length)
                        domappend(frag,elt,0);
                    else if (elt.toDOM)
                        domappend(frag,elt.toDOM());
                    else if (elt.toHTML)
                        domappend(frag,elt.toHTML());
                    else if (elt.toString)
                        frag.appendChild(document.createTextNode(
                            elt.toString()));
                    else frag.appendChild(document.createTextNode(""+elt));}
                if (node!==frag) node.appendChild(frag);}
            else if (content.length) {}
            else node.appendChild(document.createTextNode(""+content));
            return node;}
        function dominsert(before,content,i) {
            var node=before.parentNode;
            if ((content.nodeType)&&(content===before))
                return;
            else if (content.nodeType)
                node.insertBefore(content,before);
            else if (typeof content === 'string') 
                node.insertBefore(document.createTextNode(content),before);
            else if (content.toDOM)
                return dominsert(before,content.toDOM());
            else if (content.toHTML)
                return dominsert(before,node,content.toHTML());
            else if (content.length-i>1) {
                var frag=(((window.documentFragment)&&(node instanceof window.DocumentFragment))?
                          (node):(document.createDocumentFragment()));
                domappend(frag,content,i);
                node.insertBefore(frag,before);
                return before;}
            else if (content.length) {
                var c=content[i];
                if (c===before) return;
                else node.insertBefore(c,before);}
            else node.insertBefore(document.createTextNode(""+content),before);
            return node;}
        fdjtDOM.appendArray=domappend;
        
        function toArray(arg) {
            return Array.prototype.slice.call(arg);}
        fdjtDOM.toArray=toArray;
        function extendArray(result,arg) {
            var i=0; var lim=arg.length;
            while (i<lim) {result.push(arg[i]); i++;}
            return result;}
        function TOA(arg,start) {
            if ((arg.constructor === Array)||
                (arg instanceof Array)) {
                if (start) return arg.slice(start);
                else return arg;}
            else if (start)
                return Array.prototype.slice.call(arg,start||0);
            else return Array.prototype.slice.call(arg,start||0);}
        fdjtDOM.Array=TOA;
        fdjtDOM.slice=TOA;

        /* Wrapping children */
        function wrapChildren(node,spec){
            if (!(spec)) spec="div.fdjtwrapper";
            var wrapper=getFirstChild(node,spec);
            if ((wrapper)&&(wrapper.nodeType)&&
                (wrapper.parentNode===node))
                return wrapper;
            else wrapper=fdjtDOM(spec,toArray(node.childNodes));
            node.appendChild(wrapper);
            return wrapper;}
        fdjtDOM.wrapChildren=wrapChildren;
        function unwrapChildren(nodes,cxt){
            if (typeof nodes === "string") 
                nodes=((cxt)?(fdjt.DOM.getChildren(cxt,nodes)):
                       (fdjt.DOM.$(nodes)));
            else if (nodes.nodeType)
                nodes=[nodes];
            else {}
            var i=0, lim=nodes.length; while (i<lim) {
                var node=nodes[i++];
                var frag=document.createDocumentFragment();
                domappend(frag,toArray(node.childNodes));
                node.parentNode.replaceChild(frag,node);}}
        fdjtDOM.unwrapChildren=unwrapChildren;

        /* Utility patterns and functions */

        function parsePX(arg,dflt){
            if (typeof dflt === 'undefined') dflt=0;
            if (arg===0) return 0;
            else if (!(arg)) return dflt;
            else if (arg==="none") return dflt;
            else if (arg==="auto") return dflt;
            else if (typeof arg === 'number') return arg;
            else if (typeof arg === 'string') {
                var len=arg.length; var num=false;
                if ((len>2)&&(arg[len-1]==='x')&&(arg[len-2]==='p'))
                    num=parseInt(arg.slice(0,-2),10);
                else num=parseInt(arg,10);
                if (num===0) return 0;
                else if (isNaN(num)) return dflt;
                else if (typeof num === 'number') return num;
                else return dflt;}
            else return false;}
        fdjtDOM.parsePX=parsePX;

        function getLineHeight(node,style){
            if (!(style)) style=getStyle(node);
            var lh=style.lineHeight, fs=style.fontSize;
            if (lh==="normal") return parsePX(fs);
            else if (lh.search(/px$/)>0) return parsePX(lh);
            else if (lh.search(/%$/)>0) 
                return (parseFloat(lh.slice(0,-1))/100)*(parsePX(fs));
            else return parsePX(fs);}
        fdjtDOM.getLineHeight=getLineHeight;

        var whitespace_pat=/(\s)+/;
        var trimspace_pat=/^(\s)+|(\s)+$/;
        var classpats={};
        function classPat(name){
            var rx=new RegExp("\\b"+name+"\\b","g");
            classpats[name]=rx;
            return rx;}

        function string_trim(string){
            var start=string.search(/\S/); var end=string.search(/\s+$/g);
            if ((start===0) && (end<0)) return string;
            else return string.slice(start,end);}

        function nodeString(node){
            if (node.nodeType===3) 
                return "<'"+node.value+"'>";
            else if (node.nodeType===1) {
                var output="<"+node.tagName;
                if (node.id) output=output+"#"+node.id;
                if (node.tagName==='input') {
                    output=output+"[type="+node.type+"]";
                    output=output+"[name="+node.name+"]";}
                else if (node.tagName==='textarea')
                    output=output+"[name="+node.name+"]";
                else if (node.tagName==='img') {
                    if (node.alt) output=output+"[alt="+node.alt+"]";
                    else if (node.src) output=output+"[src="+node.src+"]";}
                else {}
                if (typeof node.className === "string")
                    output=output+"."+node.className.replace(/\s+/g,'.');
                return output+">";}
            else return node.toString();}
        fdjtDOM.nodeString=nodeString;
        
        /* Another way of making DOM elements which uses templates */

        function make(spec,content,data,init){
            var dom=fdjtDOM(spec);
            if (!(init)) init=data;
            if (data) content=fdjt.Template(content,data);
            if ((init.id)&&(!(dom.id))) dom.id=init.id;
            if ((init.title)&&(!(dom.title))) dom.title=init.title;
            if ((init.name)&&(!(dom.name))) dom.name=init.name;
            if ((init.href)&&(!(dom.href))) dom.href=init.href;
            if ((init.value)&&(!(dom.value))) dom.value=init.value;
            if ((init.src)&&(!(dom.src))) dom.src=init.src;
            if ((init.alt)&&(!(dom.alt))) dom.alt=init.alt;
            addListeners(dom,init);
            return dom;}
        fdjtDOM.make=make;

        /* Getting "values" of elements */
        function getElementValues(elt,spec,parse,multiple){
            var candidates=[];
            if (spec.search(/(\.|#|\[|,)/g)>=0) 
                candidates=getChildren(elt,spec);
            else if (elt.getElementsByClassName)
                candidates=elt.getElementsByClassName(spec);
            else candidates=getChildren();
            if (candidates.length===0) {
                if (multiple) return [];
                else return false;}
            else if (multiple) {
                var values=[];
                var i=0, lim=multiple.length;
                while (i<lim) {
                    var txt=candidates[i++].innerText;
                    if (parse) values.push(JSON.parse(txt));
                    else values.push(txt);}
                return values;}
            else if (parse)
                return JSON.parse(candidates[0].innerText);
            else return candidates[0].innerText;}
        fdjtDOM.getElementValues=getElementValues;
        function getElementValue(elt,spec,parse){
            return getElementValues(elt,spec,parse,false);}
        fdjtDOM.getElementValue=getElementValue;

        /* Simple class/attrib manipulation functions */

        function hasClass(elt,classname,attrib){
            if (!(elt)) return;
            else if (typeof elt === 'string') {
                if (!(elt=document.getElementById(elt)))
                    return;}
            var classinfo=((attrib) ? (elt.getAttribute(attrib)||"") :
                           (elt.className));
            if ((typeof classinfo !== "string")||(classinfo==="")) return false;
            else if (classname===true) return true;
            else if (classinfo===classname) return true;
            else if (typeof classname === 'string')
                if (classinfo.indexOf(' ')<0) return false;
            else classname=classpats[classname]||classPat(classname);
            else {}
            if (classinfo.search(classname)>=0) return true;
            else return false;}
        fdjtDOM.hasClass=hasClass;

        function addClass(elt,classname,attrib){
            if (!(elt)) return;
            else if (!(classname))
                return;
            else if (typeof elt === 'string') {
                if (!(elt=document.getElementById(elt)))
                    return;}
            else if ((window.NodeList)&&(elt instanceof window.NodeList))
                return addClass(TOA(elt),classname,attrib);
            else if ((elt.length)&&(!(elt.nodeType))) { // (assume array)
                var elts=TOA(elt);
                var i=0; var lim=elts.length;
                while (i<lim) addClass(elts[i++],classname,attrib||false);
                return;}
            else if ((!(attrib))&&(elt.classList)&&
                     (typeof classname ==="string")) {
                elt.classList.add(classname);
                return;}
            var classinfo=
                (((attrib) ? (elt.getAttribute(attrib)||"") :(elt.className))||null);
            if ((classinfo)&&(typeof classinfo !== "string")) {
                fdjtLog.warn("Non string classname for %o",elt);
                return false;}
            else if (!(classinfo)) {
                elt.className=classname; return true;}
            var class_regex=classpats[classname]||classPat(classname);
            var newinfo=classinfo;
            if (classinfo===classname) return false;
            else if (classinfo.search(class_regex)>=0) return false;
            else newinfo=classname+" "+classinfo;
            if (attrib) {
                elt.setAttribute(attrib,newinfo);
                // This sometimes trigger a CSS update that doesn't happen otherwise
                elt.className=elt.className;}
            else elt.className=newinfo;
            return true;}
        fdjtDOM.addClass=addClass;
        fdjtDOM.aC=addClass;

        fdjtDOM.classAdder=function(elt,classname){
            return function() {
                if (elt) addClass(elt,classname);};};

        function dropClass(elt,classname,attrib,keep){
            if (!(elt)) return;
            else if (typeof elt === 'string') {
                if (!(elt=document.getElementById(elt)))
                    return;}
            else if ((window.NodeList)&&(elt instanceof window.NodeList))
                return dropClass(TOA(elt),classname,attrib);
            else if ((elt.length)&&(!(elt.nodeType))) {
                var elts=TOA(elt);
                var i=0; var lim=elts.length;
                while (i<lim) dropClass(elts[i++],classname,attrib||false);
                return;}
            else if ((!(attrib))&&(elt.classList)&&
                     (typeof classname ==="string")) {
                elt.classList.remove(classname);
                return;}
            var classinfo=
                (((attrib) ? (elt.getAttribute(attrib)||"") :(elt.className))||null);
            if ((typeof classinfo !== "string")||(classinfo===""))
                return false;
            var class_regex=
                ((typeof classname === 'string')?
                 (classpats[classname]||classPat(classname)):
                 classname);
            var newinfo=classinfo;
            if (classinfo===classname) 
                newinfo="";
            else if (classinfo.search(class_regex)>=0) 
                newinfo=classinfo.replace(class_regex,"");
            else return false;
            if (newinfo)
                newinfo=newinfo.
                replace(whitespace_pat," ").
                replace(trimspace_pat,"");
            if (attrib) {
                if (newinfo) {
                    elt.setAttribute(attrib,newinfo);
                    elt.className=elt.className;}
                else if (!(keep)) {
                    elt.removeAttribute(attrib);
                    elt.className=elt.className;}
                else {}}
            else if (newinfo)
                elt.className=newinfo;
            else if (!(keep))
                elt.className="";
            else elt.className="";
            return true;}
        fdjtDOM.dropClass=dropClass;
        fdjtDOM.dC=dropClass;

        fdjtDOM.classDropper=function(elt,classname){
            return function() {
                if (elt) dropClass(elt,classname);};};

        function swapClass(elt,drop,add,attrib) {
            dropClass(elt,drop,attrib); addClass(elt,add,attrib);}
        fdjtDOM.swapClass=swapClass;

        function setClass(elt,classname,add){
            if (typeof elt === 'string') elt=document.getElementById(elt);
            if (add) addClass(elt,classname);
            else dropClass(elt,classname);}
        fdjtDOM.setClass=setClass;

        function toggleClass(elt,classname,attrib,keep){
            if (typeof elt === 'string') elt=document.getElementById(elt);
            else if ((window.NodeList)&&(elt instanceof window.NodeList))
                return toggleClass(TOA(elt),classname,attrib);
            else if ((elt.length)&&(!(elt.nodeType))) {
                var elts=TOA(elt);
                var i=0; var lim=elts.length;
                while (i<lim) toggleClass(elts[i++],classname,attrib||false);
                return;}
            else if ((!(attrib))&&(elt.classList)&&
                     (typeof classname ==="string")) {
                elt.classList.toggle(classname);
                return;}
            var classinfo=
                (((attrib) ? (elt.getAttribute(attrib)||"") :
                  (elt.className))||null);
            if ((typeof classinfo !== "string")||(classinfo==="")) {
                if (attrib) elt.setAttribute(attrib,classname);
                else elt.className=classname;
                return true;}
            var class_regex=
                ((typeof classname === 'string')?
                 (classpats[classname]||classPat(classname)):
                 classname);
            var newinfo=classinfo;
            if (classinfo===classname) 
                newinfo="";
            else if (classinfo.search(class_regex)>=0) 
                newinfo=classinfo.replace(class_regex,"");
            else {
                if (attrib)
                    elt.setAttribute(attrib,classinfo+' '+classname);
                else elt.className=classinfo+' '+classname;
                return true;}
            if (newinfo)
                newinfo=newinfo.replace(whitespace_pat," ").replace(
                    trimspace_pat,"");
            if (attrib) {
                if (newinfo) {
                    elt.setAttribute(attrib,newinfo);
                    elt.className=elt.className;}
                else if (!(keep)) {
                    elt.removeAttribute(attrib);
                    elt.className=elt.className;}
                else {}}
            else elt.className=newinfo;
            return false;}
        fdjtDOM.toggleClass=toggleClass;
        fdjtDOM.tC=toggleClass;
        
        function toggleParent(node,spec,classname,attrib,keep){
            var parent=getParent(node,spec);
            if (parent) toggleClass(parent,classname,attrib,keep);}
        fdjtDOM.toggleParent=toggleParent;
        fdjtDOM.tP=toggleParent;

        function isTextInput(target){
            return (((target.tagName==='INPUT')&&
                     (target.type.search(/text|url|email|search|password/i)===0))||
                    (target.tagName==='TEXTAREA'));}
        fdjtDOM.isTextInput=isTextInput;
        
        /* Simple CSS selectors */

        var selectors={};

        function Selector(spec,tagcs) {
            var i, lim;
            if (!(spec)) return this; // just cons with type
            else if (selectors[spec]) return selectors[spec]; // check cache
            else if (!(this instanceof Selector))
                // handle case of the forgotten 'new'
                return Selector.call(new Selector(),spec);
            if ((Array.isArray(spec))||
                ((typeof spec === "string")&&(spec.indexOf(',')>0))) {
                // create compound selectors
                var compound=[], specs=[];
                if (typeof spec === "string")
                    specs=spec.split(',');
                else {
                    var j=0, jlim=spec.length; while (j<jlim) {
                        if (typeof spec[j] !== "string") j++;
                        else if (spec[j].indexOf(',')>=0)
                            specs=specs.concat(spec[j++].split(','));
                        else specs.push(spec[j++]);}}
                i=0; lim=specs.length;
                while (i<lim) {
                    var sub=string_trim(specs[i++]);
                    var sel=new Selector(sub);
                    if (sel) compound.push(sel);}
                this.compound=compound;
                selectors[spec]=this;
                if (typeof spec === "string") this.spec=spec;
                else this.spec=specs.join(",");
                return this;}
            // Otherwise, parse and set up this
            var elts=spec.match(css_selector_regex);
            var classes=[]; var classnames=[]; var attribs=false;
            if (!(elts))
                fdjtLog.warn("Couldn't parse spec %s",spec);
            if (elts) {
                i=0; lim=elts.length;
                if (!((elts[0][0]==='.')||(elts[0][0]==='#')||
                      (elts[0][0]==='['))) {
                    this.tag=((tagcs)?(elts[0]):(elts[0].toUpperCase()));
                    i=1;}
                while (i<lim)
                    if (elts[i][0]==='#') this.id=elts[i++].slice(1);
                else if (elts[i][0]==='.') {
                    classnames.push(elts[i].slice(1));
                    classes.push(classPat(elts[i++].slice(1)));}
                else if (elts[i][0]==='[') {
                    var aelts=elts[i++]; var eltsend=aelts.length-1;
                    if (!(attribs)) attribs={};
                    var eqpos=aelts.indexOf('=');
                    if (eqpos<0)
                        attribs[aelts.slice(1,eltsend)]=true;
                    else if (aelts[eqpos+1]==='~') 
                        attribs[aelts.slice(1,eqpos)]=
                        classPat(aelts.slice(eqpos+2,eltsend));
                    else attribs[aelts.slice(1,eqpos)]=
                        aelts.slice(eqpos+1,eltsend);}
                else fdjtLog.uhoh("weird elts %o",elts[i++]);}
            if (classes.length) {
                this.classes=classes; this.classnames=classnames;}
            if (attribs) this.attribs=attribs;
            this.rank=[0,((this.id)?(1):(0)),
                       classnames.length+attribs.length,1];
            selectors[spec]=this;
            this.spec=spec;
            return this;}
        Selector.prototype.match=function(elt){
            if (elt.matches) 
                return elt.matches(this.spec);
            else if (elt.matchesSelector)
                return elt.matchesSelector(this.spec);
            var i, lim;
            if (this.compound) {
                var compound=this.compound; i=0; lim=compound.length;
                while (i<lim) if (compound[i++].match(elt)) return true;
                return false;} 
            if ((this.tag)&&(this.tag!==elt.tagName)) return false;
            else if ((this.id)&&(this.id!==elt.id)) return false;
            if (this.classes)
                if (typeof elt.className === "string") {
                    var classname=elt.className; var classes=this.classes;
                    i=0; lim=classes.length;
                    while (i<lim)
                        if (classname.search(classes[i++])<0)
                            return false;}
            else return false;
            if (this.attribs) {
                var attribs=this.attribs;
                for (var name in attribs)
                    if (attribs.hasOwnProperty(name)) {
                        var val=elt.getAttribute(name);
                        if (!(val)) return false;
                        var need=this[name];
                        if (need===true) {}
                        else if (typeof need === 'string') {
                            if (need!==val) return false;}
                        else if (val.search(need)<0) return false;}}
            return true;};
        Selector.prototype.find=function(elt,results){
            var probe, i, lim;
            if (!(results)) results=[];
            if (this.compound) {
                var compound=this.compound;
                i=0; lim=compound.length;
                while (i<lim) compound[i++].find(elt,results);
                return results;}
            if (this.id) {
                probe=document.getElementById(this.id);
                if (!(probe)) return results;
                else if (this.match(probe)) {
                    results.push(probe); return results;}
                else return results;}
            var candidates=[];
            var classnames=this.classnames; var attribs=this.attribs;
            if (this.classes) 
                if (elt.getElementsByClassName)
                    candidates=elt.getElementsByClassName(classnames[0]);
            else gatherByClass(elt,this.classes[0],candidates);
            else if ((this.tag)&&(elt.getElementsByTagName))
                candidates=elt.getElementsByTagName(this.tag);
            else if (this.attribs) {
                attribs=this.attribs;
                for (var name in attribs)
                    if (attribs.hasOwnProperty(name)) {
                        gatherByAttrib(elt,name,attribs[name],candidates);
                        break;}}
            else if (this.tag) {
                gatherByTag(elt,this.tag,candidates);}
            else {}
            if (candidates.length===0) return candidates;
            if (((this.tag)&&(!(this.classes))&&(!(this.attribs)))||
                ((!(this.tag))&&(this.classes)&&(this.classes.length===1)&&
                 (!(this.attribs))))
                // When there's only one test, don't bother filtering
                if (results.length) return extendArray(results,candidates);
            else if (candidates instanceof Array)
                return candidates;
            else return toArray(candidates);
            i=0; lim=candidates.length;
            while (i<lim) {
                var candidate=candidates[i++];
                if (this.match(candidate)) results.push(candidate);}
            return results;};
        fdjtDOM.Selector=Selector;
        fdjtDOM.sel=function(spec){
            if (!(spec)) return false;
            else if (spec instanceof Selector) return spec;
            else if (spec instanceof Array) {
                if (spec.length)
                    return new Selector(spec.join(","));
                else return false;}
            else if (typeof spec === 'string')
                return new Selector(spec);
            else {
                fdjtLog.warn("Non selector spec: %o",spec);
                return false;}};

        function gatherByClass(node,pat,results){
            if (node.nodeType===1) {
                var classname=node.className;
                if ((typeof classname === "string")&&(classname.search(pat)>=0))
                    results.push(node);
                var children=node.childNodes;
                if (children) {
                    var i=0; var lim=children.length;
                    while (i<lim) gatherByClass(children[i++],pat,results);}}}
        function gatherByTag(node,tag,results){
            if (node.nodeType===1) {
                if ((typeof tag === "string")?
                    (node.tagName.toLowerString()===tag):
                    ((tag instanceof RegExp)&&(tag.match(node.tagName))))
                    results.push(node);
                var children=node.childNodes;
                if (children) {
                    var i=0; var lim=children.length;
                    while (i<lim) gatherByTag(children[i++],tag,results);}}}
        function gatherByAttrib(node,attrib,val,results){
            if (node.nodeType===1) {
                if ((node.getAttribute(attrib))&&
                    ((typeof val === 'string')?
                     (node.getAttribute(attrib)===val):
                     (node.getAttribute(attrib).search(val)>=0)))
                    results.push(node);
                var children=node.childNodes;
                if (children) {
                    var i=0; var lim=children.length;
                    while (i<lim) gatherByAttrib(children[i++],attrib,val,results);}}}
        
        function gather_children(node,pat,attrib,results){
            if (!(attrib)) gatherByClass(node,pat,results);
            else if (attrib==='class') gatherByClass(node,pat,results);
            else if (attrib==='tagName') gatherByTag(node,pat,results);
            else gatherByAttrib(node,attrib,pat,results);}

        /* Real simple DOM search */

        function getParent(elt,parent){
            if (typeof elt === 'string') {
                if (elt[0]==='#')
                    elt=document.getElementById(elt.slice(1));
                else elt=document.getElementById(elt);}
            if (!(elt)) return false;
            else if (!(parent)) return false;
            else if (parent.nodeType) {
                while (elt) {
                    if (elt===parent) return parent;
                    else elt=elt.parentNode;}
                return false;}
            else if (typeof parent === 'function') {
                while (elt) {
                    if (parent(elt)) return elt;
                    else elt=elt.parentNode;}
                return false;}
            else if (parent instanceof Selector) {
                while (elt) {
                    if (elt.nodeType!==1) elt=elt.parentNode;
                    else if (parent.match(elt)) return elt;
                    else elt=elt.parentNode;}
                return false;}
            else if (parent instanceof RegExp) {
                while (elt) {
                    if (elt.nodeType!==1) elt=elt.parentNode;
                    else if ((elt.className)&&(parent.test(elt.className)))
                        return elt;
                    else elt=elt.parentNode;}
                return false;}
            else if (typeof parent === 'string')
                return getParent(elt,new Selector(parent));
            else throw { error: 'invalid parent spec'};}
        fdjtDOM.getParent=getParent;
        fdjtDOM.hasParent=getParent;
        fdjtDOM.$P=getParent;
        fdjtDOM.inherits=function(node,spec) {
            var sel=new Selector(spec);
            return ((sel.match(node))?(node):(getParent(node,sel)));};

        function getChildNodes(node){
            if (node.nodeType!==1) return [];
            else if (!(node.childNodes)) return [];
            else return toArray(node.childNodes);}
        fdjtDOM.getChildNodes=getChildNodes;

        function getChildren(node,classname,attrib,results){
            if (typeof node === "string") node=fdjtID(node);
            if (!(node)) return [];
            if (!(results)) results=[]; 
            if (!(attrib)) {
                if (typeof classname === 'function')
                    filter_children(node,classname,results);
                else if (classname instanceof RegExp)
                    regexp_filter_children(node,classname,results);
                else if (classname instanceof Selector)
                    return classname.find(node,results);
                else if (typeof classname === 'string') {
                    if ((usenative) && (node.querySelectorAll))
                        return node.querySelectorAll(classname);
                    else return getChildren(
                        node,new Selector(classname),false,results);}
                else if (classname.length) {
                    var i=0, lim=classname.length;
                    while (i<lim)
                        getChildren(node,classname[i++],attrib,results);}
                else {}}
            else if (typeof attrib !== 'string')
                throw { error: 'bad selector arg', selector: classname};
            else gather_children(node,classname,attrib||false,results);
            return results;}
        fdjtDOM.getChildren=getChildren;
        fdjt.$=fdjtDOM.$=function(spec,root){
            return toArray(getChildren(root||document,spec));};
        function getFirstChild(elt,spec){
            var children=getChildren(elt,spec);
            if (children.length) return children[0]; else return false;}
        fdjt.$1=fdjtDOM.$1=fdjtDOM.getChild=fdjtDOM.getFirstChild=getFirstChild;

        function filter_children(node,filter,results){
            if (node.nodeType===1) {
                if (filter(node)) results.push(node);
                var children=node.childNodes;
                if (children) {
                    var i=0; var lim=children.length;
                    while (i<lim) filter_children(children[i++],filter,results);}}}

        function regexp_filter_children(node,rx,results){
            if (node.nodeType===1) {
                var classname=node.className;
                if ((typeof classname === "string")&&(classname.search(rx)>=0))
                    results.push(node);
                var children=node.childNodes;
                if (children) {
                    var i=0; var lim=children.length;
                    while (i<lim)
                        regexp_filter_children(children[i++],rx,results);}}}

        fdjtDOM.getAttrib=function(elt,attrib,ns){
            var probe;
            if ((ns)&&(elt.getAttributeByNS))
                probe=elt.getAttributeNS(attrib,ns);
            if (probe) return probe;
            else return elt.getAttribute(attrib)||
                elt.getAttribute("data-"+attrib);};

        fdjtDOM.findAttrib=function(scan,attrib,ns){
            var dattrib="data-"+attrib;
            while (scan) {
                if ((ns)&&(scan.getAttributeNS)&&
                    (scan.getAttributeNS(attrib,ns)))
                    return scan.getAttributeNS(attrib,ns);
                else if (scan.getAttribute) {
                    if (scan.getAttribute(attrib))
                        return scan.getAttribute(attrib);
                    else if (scan.getAttribute(dattrib))
                        return scan.getAttribute(dattrib);
                    else scan=scan.parentNode;}
                else scan=scan.parentNode;}
            return false;};
        
        /* First and last elements */
        function getFirstElement(node){
            if (node.firstElementChild) return node.firstElementChild;
            else if ((node.children)&&(node.children.length))
                return node.children[0];
            else return false;}
        fdjtDOM.getFirstElement=getFirstElement;
        function getLastElement(node){
            if (node.lastElementChild) return node.lastElementChild;
            else if ((node.children)&&(node.children.length))
                return node.children[node.children.length-1];
            else return false;}
        fdjtDOM.getLastElement=getLastElement;
        
        /* Manipulating the DOM */

        fdjtDOM.replace=function(existing,replacement,leaveids){
            var cur=existing;
            if (typeof existing === 'string')
                if (existing[0]==='#')
                    cur=document.getElementById(existing.slice(1));
            else cur=document.getElementById(existing);
            if (cur) {
                cur.parentNode.replaceChild(replacement,cur);
                if (!(leaveids)) {
                    if ((cur.id)&&(!(replacement.id)))
                        replacement.id=cur.id;}}
            else fdjtLog.uhoh("Can't find %o to replace it with %o",
                              existing,replacement);};
        function remove_node(node){
            if (node instanceof Array) {
                var i=0; var lim=node.length;
                while (i<lim) remove_node(node[i++]);
                return;}
            var cur=node;
            if (typeof node === 'string') {
                if (node[0]==='#') cur=document.getElementById(node.slice(1));
                else cur=document.getElementById(node);}
            if ((cur)&&(cur.parentNode))
                cur.parentNode.removeChild(cur);
            else if (cur)
                fdjtLog.uhoh("Looks like %o has already been removed (no parent)",cur);
            else fdjtLog.uhoh("Can't find %o to remove it",node);}
        fdjtDOM.remove=remove_node;
        
        function removeChildren(node){
            var children=node.childNodes, n=children.length-1;
            while (n>=0) node.removeChild(children[n--]);}
        fdjtDOM.removeChildren=removeChildren;

        fdjtDOM.append=function (node) {
            if (typeof node === 'string') node=document.getElementById(node);
            domappend(node,arguments,1);};
        fdjtDOM.prepend=function (node) {
            if (typeof node === 'string') node=document.getElementById(node);
            if (node.firstChild)
                dominsert(node.firstChild,arguments,1);
            else domappend(node,arguments,1);};

        fdjtDOM.insertBefore=function (before) {
            if (typeof before === 'string')
                before=document.getElementById(before);
            dominsert(before,arguments,1);};
        fdjtDOM.insertAfter=function (after) {
            if (typeof after === 'string')
                after=document.getElementById(after);
            if (after.nextSibling)
                dominsert(after.nextSibling,arguments,1);
            else domappend(after.parentNode,arguments,1);};
        
        /* DOM construction shortcuts */

        function tag_spec(spec,tag){
            if (!(spec)) return tag;
            else if (typeof spec === 'string') {
                var wordstart=spec.search(/\w/g);
                var puncstart=spec.search(/\W/g);
                if (puncstart<0) return tag+"."+spec;
                else if (wordstart!==0) return tag+spec;
                return spec;}
            else if (spec.tagName) return spec;
            else {
                spec.tagName=tag;
                return spec;}}

        fdjtDOM.Input=function(spec,name,value,title){
            if (spec.search(/\w/)!==0) spec='INPUT'+spec;
            var node=fdjtDOM(spec);
            node.name=name;
            if (value) node.value=value;
            if (title) node.title=title;
            return node;};
        fdjtDOM.Checkbox=function(name,value,checked){
            var node=fdjtDOM("INPUT");
            node.type="checkbox";
            node.name=name;
            if (value) node.value=value;
            if (checked) node.checked=true;
            else node.checked=false;
            return node;};
        fdjtDOM.Anchor=function(href,spec){
            spec=tag_spec(spec,"A");
            var node=fdjtDOM(spec); node.href=href;
            domappend(node,arguments,2);
            return node;};
        fdjtDOM.Image=function(src,spec,alt,title){
            spec=tag_spec(spec,"IMG");
            var node=fdjtDOM(spec); node.src=src;
            if (alt) node.alt=alt;
            if (title) node.title=title;
            domappend(node,arguments,4);
            return node;};

        function getInputs(root,name,type){
            var results=[];
            if (typeof root === 'string') {
                var root_elt=document.getElementById(root);
                if (!(root_elt)) fdjtLog.warn("Couldn't resolve %s to an object",root);
                root=root_elt;}
            if (!(root)) return results;
            var inputs=root.getElementsByTagName('input');
            var i=0; var lim=inputs.length;
            while (i<lim) {
                if (((!(name))||(inputs[i].name===name))&&
                    ((!(type))||(inputs[i].type===type)))
                    results.push(inputs[i++]); 
                else i++;}
            if ((!type)||(type==='textarea')||(type==='text')) {
                inputs=root.getElementsByTagName('textarea');
                i=0; lim=inputs.length;
                while (i<lim) {
                    if (((!(name))||(inputs[i].name===name))&&
                        ((!(type))||(inputs[i].type===type)))
                        results.push(inputs[i++]); 
                    else i++;}}
            if ((!type)||(type==='button')||(type==='submit')) {
                inputs=root.getElementsByTagName('button');
                i=0; lim=inputs.length;
                while (i<lim) {
                    if (((!(name))||(inputs[i].name===name))&&
                        ((!(type))||(inputs[i].type===type)))
                        results.push(inputs[i++]); 
                    else i++;}}
            if ((!type)||(type==='select')) {
                inputs=root.getElementsByTagName('select');
                i=0; lim=inputs.length;
                while (i<lim) {
                    if ((!(name))||(inputs[i].name===name))
                        results.push(inputs[i++]); 
                    else i++;}}
            return results;}

        fdjtDOM.getInputs=getInputs;
        fdjtDOM.getInput=function(root,name,type){
            var results=getInputs(root,name||false,type||false);
            if ((results)&&(results.length===1))
                return results[0];
            else if ((results)&&(results.length)) {
                fdjtLog.warn(
                    "Ambiguous input reference name=%o type=%o under %o",
                    name,type,root);
                return results[0];}
            else return false;};
        
        function getInputValues(root,name){
            var results=[];
            var inputs=root.getElementsByTagName('input');
            var i=0; var lim=inputs.length;
            while (i<lim) {
                var input=inputs[i++];
                if (input.name!==name) continue;
                if ((input.type==='checkbox')||(input.type==='radio')) {
                    if (!(input.checked)) continue;}
                results.push(input.value);}
            return results;}
        fdjtDOM.getInputValues=getInputValues;
        function getInputValue(root,name,n){
            var r=0;
            var inputs=root.getElementsByTagName('input');
            var i=0; var lim=inputs.length;
            while (i<lim) {
                var input=inputs[i++];
                if (input.disabled) continue;
                else if (input.name!==name) continue;
                else if ((input.type==='checkbox')||(input.type==='radio')) {
                    if (!(input.checked)) continue;}
                if (!(n)) return input.value;
                else if (r===n) return input.value;
                else r++;}
            return false;}
        fdjtDOM.getInputValue=getInputValue;

        function getInputsFor(root,name,value){
            if (typeof root === 'string')
                root=document.getElementById(root);
            if (!(root)) return [];
            var results=[];
            var inputs=root.getElementsByTagName('input');
            var i=0; var lim=inputs.length;
            while (i<lim) {
                var input=inputs[i++];
                if (input.name!==name) continue;
                else if (input.value!==value) continue;
                else results.push(input);}
            return results;}
        fdjtDOM.getInputsFor=getInputsFor;
        fdjtDOM.getInputFor=function(root,name,value){
            var results=getInputsFor(root,name||false,value||false);
            if ((results)&&(results.length===1))
                return results[0];
            else if ((results)&&(results.length)) {
                fdjtLog.warn(
                    "Ambiguous input reference name=%o name=%o under %o",
                    name,name,root);
                return results[0];}
            else return false;};


        function setInputs(selector,value){
            if (!(value)) return;
            var inputs=fdjtDOM.$(selector);
            var i=0, lim=inputs.length; while (i<lim) {
                inputs[i++].value=value;}}
        fdjtDOM.setInputs=setInputs;

        /* Getting style information generally */

        function getStyle(elt,prop){
            if (typeof elt === 'string') elt=document.getElementById(elt);
            if (!(elt)) return elt;
            if (elt.nodeType!==1) throw "Not an element";
            try {
                var style=
                    ((window.getComputedStyle)&&
                     (window.getComputedStyle(elt,null)))||
                    (elt.currentStyle);
                if (!(style)) return false;
                else if (prop) return style[prop];
                else return style;}
            catch (ex) {
                fdjtLog("Unexpected style error %o",ex);
                return false;}}
        fdjtDOM.getStyle=getStyle;

        function styleString(elt){
            var style=elt.style; var result;
            if (!(style)) return false;
            var i=0; var lim=style.length;
            if (lim===0) return false;
            while (i<lim) {
                var p=style[i];
                var v=style[p];
                if (i===0) result=p+": "+v;
                else result=result+"; "+p+": "+v;
                i++;}
            return result;}
        fdjtDOM.styleString=styleString;

        /* Getting display style */

        var display_styles={
            "DIV": "block","P": "block","BLOCKQUOTE":"block",
            "H1": "block","H2": "block","H3": "block","H4": "block",
            "H5": "block","H6": "block","H7": "block","H8": "block",
            "UL": "block","LI": "list-item",
            "DL": "block","DT": "list-item","DD": "list-item",
            "SPAN": "inline","EM": "inline","STRONG": "inline",
            "TT": "inline","DEFN": "inline","A": "inline",
            "TD": "table-cell","TR": "table-row",
            "TABLE": "table", "PRE": "preformatted"};

        function getDisplayStyle(elt){
            if ((!(elt))||(!(elt.nodeType))||(elt.nodeType!==1))
                return false;
            return (((window.getComputedStyle)&&
                     (window.getComputedStyle(elt,null))&&
                     (window.getComputedStyle(elt,null).display))||
                    (display_styles[elt.tagName])||
                    "inline");}
        fdjtDOM.getDisplay=getDisplayStyle;

        /* Generating text from the DOM */

        function flatten(string){return string.replace(/\s+/," ");}

        function textify(arg,flat,depth,domarkup){
            if (typeof depth !== 'number') depth=0;
            if (arg.nodeType) {
                if (arg.nodeType===3) {
                    if (flat) return flatten(arg.nodeValue);
                    else return arg.nodeValue;}
                else if (arg.nodeType===1) {
                    var children=arg.childNodes;
                    var style=getStyle(arg);
                    var display_type=style.display;
                    var position_type=style.position;
                    var whitespace=style.whiteSpace;
                    var classname=arg.className;
                    var string=""; var suffix="";
                    if (whitespace!=="normal") flat=false;
                    if (display_type==='none') return "";
                    else if (!((position_type==="static")||
                               (position_type==="")))
                        return "";
                    else if ((typeof classname === "string")&&
                             ((classname==='fdjtskiptext')||
                              (classname.search(/\bfdjtskiptext\b/)>=0)))
                        return "";
                    else if ((!(children))||(children.length===0)) {
                        if (!(domarkup)) return "";
                        else if (arg.alt) return "["+arg.alt+"]";
                        else return "[?]";}
                    // Figure out what suffix and prefix to use for this element
                    else if (!(display_type)) {}
                    else if (display_type==="inline") {}
                    else if (flat) suffix=" ";
                    else if ((display_type==="block") ||
                             (display_type==="table") ||
                             (display_type==="preformatted")) {
                        string="\n"; suffix="\n";}
                    else if (display_type==="table-row") suffix="\n";
                    else if (display_type==="table-cell") string="\t";
                    else {}
                    var i=0; while (i<children.length) {
                        var child=children[i++];
                        if (!(child.nodeType)) continue;
                        if (child.nodeType===3) {
                            if (flat) string=string+flatten(child.nodeValue);
                            else string=string+child.nodeValue;}
                        else if (child.nodeType===1) {
                            var stringval=textify(child,flat,true,domarkup);
                            if (stringval) string=string+stringval;}
                        else continue;}
                    return string+suffix;}
                else {}}
            else if (arg.toString)
                return arg.toString();
            else return arg.toString();}
        fdjtDOM.textify=textify;

        /* Geometry functions */

        function getGeometry(elt,root,extra,withstack){
            if (!(withstack)) withstack=false;
            if (typeof elt === 'string')
                elt=document.getElementById(elt);
            var top = elt.offsetTop;
            var left = elt.offsetLeft;
            var width=elt.offsetWidth;
            var height=elt.offsetHeight;
            var rootp=((root)&&(root.offsetParent));
            var style=((extra)&&(getStyle(elt)));
            if (withstack) withstack=[]; else withstack=false;
            
            if (elt===root) 
                return {left: 0,top: 0,width:width,height: height,
                        bottom: height,right: width};
            elt=elt.offsetParent;
            while (elt) {
                if ((root)&&((elt===root)||(elt===rootp))) break;
                if (withstack) withstack.push(elt);
                top += elt.offsetTop;
                left += elt.offsetLeft;
                elt=elt.offsetParent;}
            
            if (style) {
                var t_margin=parsePX(style.marginTop);
                var r_margin=parsePX(style.marginRight);
                var b_margin=parsePX(style.marginBottom);
                var l_margin=parsePX(style.marginLeft);
                var t_padding=parsePX(style.paddingTop);
                var r_padding=parsePX(style.paddingRight);
                var b_padding=parsePX(style.paddingBottom);
                var l_padding=parsePX(style.paddingLeft);
                var t_border=parsePX(style.borderTopWidth);
                var r_border=parsePX(style.borderRightWidth);
                var b_border=parsePX(style.borderBottomWidth);
                var l_border=parsePX(style.borderLeftWidth);
                var outer_width=width+l_margin+r_margin;
                var outer_height=height+t_margin+b_margin;
                var inner_width=width-(l_border+l_padding+r_border+r_padding);
                var inner_height=height-(t_border+t_padding+b_border+b_padding);
                var lh=style.lineHeight, fs=style.fontSize, lhpx=false;
                if (lh==="normal") lhpx=parsePX(fs);
                else if (lh.search(/px$/)>0) lhpx=parsePX(lh);
                else if (lh.search(/%$/)>0) 
                    lhpx=(parseFloat(lh.slice(0,-1))/100)*(parsePX(fs));
                else lhpx=parsePX(fs);
                return {left: left, top: top, width: width,height: height,
                        right:left+width,bottom:top+height,
                        top_margin: t_margin, bottom_margin: b_margin,
                        left_margin: l_margin, right_margin: r_margin,
                        top_border: t_border, bottom_border: b_border,
                        left_border: l_border, right_border: r_border,
                        top_padding: t_padding, bottom_padding: b_padding,
                        left_padding: l_padding, right_padding: r_padding,
                        outer_height: outer_height,outer_width: outer_width,
                        inner_height: inner_height,inner_width: inner_width,
                        line_height: lhpx,stack:withstack};}
            else return {left: left, top: top, width: width,height: height,
                         right:left+width,bottom:top+height,
                         stack:withstack};}
        fdjtDOM.getGeometry=getGeometry;

        function geomString(geom){
            return +((typeof geom.width === 'number')?(geom.width):"?")+
                "x"+((typeof geom.height === 'number')?(geom.height):"?")+
                "@l:"+((typeof geom.left === 'number')?(geom.left):"?")+
                ",t:"+((typeof geom.top === 'number')?(geom.top):"?")+
                "/r:"+((typeof geom.right === 'number')?(geom.right):"?")+
                ",b:"+((typeof geom.bottom === 'number')?(geom.bottom):"?");}
        fdjtDOM.geomString=geomString;

        function isVisible(elt,partial){
            if (!(partial)) partial=false;
            if ((elt.offsetParent)&&(elt.offsetParent!==document.body)) {
                var container=elt.offsetParent;
                var offtop=elt.offsetTop, offbot=offtop+elt.offsetHeight;
                var offleft=elt.offsetLeft;
                var offright=offleft+elt.offsetWidth;
                var l=container.scrollLeft, r=l+container.clientWidth;
                var t=container.scrollTop, b=t+container.clientHeight;
                if (partial)
                    return ((((offleft>=l)&&(offleft<=r))||
                             ((offright>=l)&&(offright<=r))||
                             ((offleft<l)&&(offright>r)))&&
                            (((offtop>=t)&&(offtop<=b))||
                             ((offbot>=t)&&(offbot<=b))||
                             ((offtop<=t)&&(offbot>=b))));
                else return ((((offleft>=l)&&(offleft<=r))&&
                              ((offright>=l)&&(offright<=r)))&&
                             (((offtop>=t)&&(offtop<=b))&&
                              ((offbot>=t)&&(offbot<=b))));}
            var top = elt.offsetTop;
            var left = elt.offsetLeft;
            var width = elt.offsetWidth;
            var height = elt.offsetHeight;
            var winx=(window.pageXOffset||document.documentElement.scrollLeft||0);
            var winy=(window.pageYOffset||document.documentElement.scrollTop||0);
            var winxedge=winx+(document.documentElement.clientWidth);
            var winyedge=winy+(document.documentElement.clientHeight);
            
            while(elt.offsetParent) {
                if (elt===window) break;
                elt = elt.offsetParent;
                top += elt.offsetTop;
                left += elt.offsetLeft;}

            if ((elt)&&(!((elt===window)||(elt===document.body)))) {
                // fdjtLog("%o l=%o t=%o",elt,elt.scrollLeft,elt.scrollTop);
                if ((elt.scrollTop)||(elt.scrollLeft)) {
                    fdjtLog("Adjusting for inner DIV");
                    winx=elt.scrollLeft; winy=elt.scrollTop;
                    winxedge=winx+elt.scrollWidth;
                    winyedge=winy+elt.scrollHeight;}}

            /*
              fdjtLog("fdjtIsVisible%s %o top=%o left=%o height=%o width=%o",
              ((partial)?("(partial)"):""),start,
              top,left,height,width);
              fdjtLog("fdjtIsVisible %o winx=%o winy=%o winxedge=%o winyedge=%o",
              elt,winx,winy,winxedge,winyedge);
            */
            
            if (partial)
                // There are three cases we check for:
                return (
                    // top of element in window
                    ((top > winy) && (top < winyedge) &&
                     (left > winx) && (left < winxedge)) ||
                        // bottom of element in window
                        ((top+height > winy) && (top+height < winyedge) &&
                         (left+width > winx) && (left+width < winxedge)) ||
                        // top above/left of window, bottom below/right of window
                        (((top < winy) || (left < winx)) &&
                         ((top+height > winyedge) && (left+width > winxedge))));
            else return ((top > winy) && (left > winx) &&
                         (top + height) <= (winyedge) &&
                         (left + width) <= (winxedge));}
        fdjtDOM.isVisible=isVisible;

        function isAtTop(elt,delta){
            if (!(delta)) delta=50;
            var top = elt.offsetTop;
            var left = elt.offsetLeft;
            var winy=(window.pageYOffset||document.documentElement.scrollTop||0);
            var winyedge=winy+(document.documentElement.clientHeight);
            
            while(elt.offsetParent) {
                elt = elt.offsetParent;
                top += elt.offsetTop;
                left += elt.offsetLeft;}

            return ((top>winy) && (top<winyedge) && (top<winy+delta));}
        fdjtDOM.isAtTop=isAtTop;

        function textwidth(node){
            if (node.nodeType===3) return node.nodeValue.length;
            else if (node.nodeType!==1) return 0;
            else {
                var style=getStyle(node);
                var display=style.display, position=style.position;
                if (display==="none") return 0;
                else if (!((position==="")||(position==="static")))
                    return 0;
                else if (typeof node.className!=="string") return 0;
                else if ((node.className==="fdjtskiptext")||
                         ((typeof node.className === "string")&&
                          (node.className.search(/\bfdjtskiptext/)>=0)))
                    return 0;
                else if (node.childNodes) {
                    var children=node.childNodes;
                    var i=0; var lim=children.length; var width=0;
                    while (i<lim) {
                        var child=children[i++];
                        if (child.nodeType===3)
                            width=width+child.nodeValue.length;
                        else if (child.nodeType===1)
                            width=width+textwidth(child);
                        else {}}
                    return width;}
                else if (node.alt) return node.alt.length+2;
                else return 3;}}
        fdjtDOM.textWidth=textwidth;

        function countBreaks(arg){
            if (typeof arg === 'string') {
                return arg.match(/\W*\s+\W*/g).length;}
            else if (!(arg.nodeType)) return 0;
            else if (arg.nodeType===1) {}
            else if (arg.nodeType===3)
                return arg.nodeValue.match(/\W*\s+\W*/g).length;
            else return 0;}
        fdjtDOM.countBreaks=countBreaks;
        
        var nontext_content=/(img|object|svg|hr)/i;

        function hasContent(node,recur,test,limit){
            if (node===limit) return false;
            else if (node.nodeType===3)
                return (child.nodeValue.search(/\w/g)>=0);
            else if (node.nodeType!==1) return false;
            else if ((test)&&(test.match)&&(test.match(node)))
                return true;
            else if (node.tagName.search(nontext_content)===0)
                return true;
            else if ((typeof node.className === "string")&&
                     (node.className.search(/\bfdjtskiptext\b/g)>=0))
                return false;
            else if ((node.childNodes)&&(node.childNodes.length)) {
                var children=node.childNodes;
                var i=0; while (i<children.length) {
                    var child=children[i++];
                    if (child===limit) return false;
                    else if (child.nodeType===3) {
                        if (child.nodeValue.search(/\w/g)>=0) return true;
                        else continue;}
                    else if (child.nodeType!==1) continue;
                    else if (recur) {
                        if (hasContent(child,recur,test,limit)) return true;
                        else continue;}
                    else continue;}
                return false;}
            else return false;}
        fdjtDOM.hasContent=hasContent;

        function hasText(node){
            if (node.childNodes) {
                var children=node.childNodes;
                var i=0; while (i<children.length) {
                    var child=children[i++];
                    if (child.nodeType===3)
                        if (child.nodeValue.search(/\w/g)>=0) return true;
                    else {}}
                return false;}
            else return false;}
        fdjtDOM.hasText=hasText;

        /* A 'refresh method' does a className eigenop to force IE redisplay */

        fdjtDOM.refresh=function(elt){
            elt.className=elt.className;};
        fdjtDOM.setAttrib=function(elt,attrib,val){
            if ((typeof elt === 'string')&&(fdjtID(elt)))
                elt=fdjtID(elt);
            elt.setAttribute(attrib,val);
            elt.className=elt.className;};
        fdjtDOM.dropAttrib=function(elt,attrib){
            if ((typeof elt === 'string')&&(fdjtID(elt)))
                elt=fdjtID(elt);
            elt.removeAttribute(attrib);
            elt.className=elt.className;};

        /* Determining if something has overflowed */
        fdjtDOM.overflowing=function(node){
            return (node.scrollHeight>node.clientHeight);};
        fdjtDOM.voverflow=function(node){
            return (node.scrollHeight/node.clientHeight);};
        fdjtDOM.hoverflow=function(node){
            return (node.scrollWidth/node.clientWidth);};

        /* Sizing to fit */

        var default_trace_adjust=false;

        function getInsideBounds(container){
            var left=false; var top=false;
            var right=false; var bottom=false;
            var children=container.childNodes;
            var i=0; var lim=children.length;
            while (i<lim) {
                var child=children[i++];
                if (typeof child.offsetLeft !== 'number') continue;
                var style=getStyle(child);
                if (style.position!=='static') continue;
                var child_left=child.offsetLeft-parsePX(style.marginLeft);
                var child_top=child.offsetTop-parsePX(style.marginTop);
                var child_right=child.offsetLeft+child.offsetWidth+parsePX(style.marginRight);
                var child_bottom=child.offsetTop+child.offsetHeight+parsePX(style.marginBottom);
                if (left===false) {
                    left=child_left; right=child_right;
                    top=child_top; bottom=child_bottom;}
                else {
                    if (child_left<left) left=child_left;
                    if (child_top<top) top=child_top;
                    if (child_right>right) right=child_right;
                    if (child_bottom>bottom) bottom=child_bottom;}}
            return {left: left,right: right,top: top, bottom: bottom,
                    width: right-left,height:bottom-top};}
        fdjtDOM.getInsideBounds=getInsideBounds;
        function applyScale(container,scale){
            var images=fdjtDOM.getChildren(container,"IMG");
            var ilim=images.length;
            if (scale) {
                container.scale=scale;
                container.style.fontSize=scale+'%';
                var rounded=10*Math.round(scale/10);
                fdjtDOM.addClass(container,"fdjtscaled");
                fdjtDOM.swapClass(
                    container,/\bfdjtscale\d+\b/,"fdjtscale"+rounded);}
            else if (!(container.scale)) return;
            else {
                delete container.scale;
                container.style.fontSize="";
                fdjtDOM.dropClass(container,"fdjtscaled");
                fdjtDOM.dropClass(container,/\bfdjtscale\d+\b/);}
            var iscan=0; while (iscan<ilim) {
                var image=images[iscan++];
                if ((fdjtDOM.hasClass(image,"nofdjtscale"))||
                    (fdjtDOM.hasClass(image,"noautoscale")))
                    continue;
                // Reset dimensions to get real info
                image.style.maxWidth=image.style.width=
                    image.style.maxHeight=image.style.height='';
                if (scale) {
                    var width=image.offsetWidth;
                    var height=image.offsetHeight;
                    image.style.maxWidth=image.style.width=
                        Math.round(width*(scale/100))+'px';
                    image.style.maxHeight=image.style.height=
                        Math.round(height*(scale/100))+'px';}}}
        
        function adjustInside(elt,container,step,min,pad){
            var trace_adjust=(elt.traceadjust)||
                (container.traceadjust)||fdjtDOM.trace_adjust||
                ((typeof elt.className === "string")&&
                 (elt.className.search(/\btraceadjust\b/)>=0))||
                ((typeof container.className === "string")&&
                 (container.className.search(/\btraceadjust\b/)>=0))||
                default_trace_adjust;
            if (!(step)) step=5;
            if (!(min)) min=50;
            if (!(pad)) pad=1;
            var scale=100;
            function adjust(){
                var outside=getGeometry(container);
                var inside=getGeometry(elt,container);
                var style=getStyle(container);
                var maxwidth=
                    outside.width-
                    (parsePX(style.paddingLeft,0)+
                     parsePX(style.borderLeft,0)+
                     parsePX(style.paddingRight,0)+
                     parsePX(style.borderRight,0));
                var maxheight=
                    outside.height-
                    (parsePX(style.paddingTop,0)+
                     parsePX(style.borderTop,0)+
                     parsePX(style.paddingBottom,0)+
                     parsePX(style.borderBottom,0));
                if (trace_adjust)
                    fdjtLog("adjustInside scale=%o step=%o min=%o pad=%o [l%o,t%o,r%o,b%o] << %ox%o < %ox%o",
                            scale,step,min,pad,
                            inside.left,inside.top,inside.right,inside.bottom,
                            maxwidth*pad,maxheight*pad,
                            maxwidth,maxheight);
                if ((inside.top>=0)&&(inside.bottom<=(pad*maxheight))&&
                    (inside.left>=0)&&(inside.right<=(pad*maxwidth)))
                    return;
                else if (scale<=min) return;
                else {
                    scale=scale-step;
                    applyScale(elt,scale,trace_adjust);
                    setTimeout(adjust,10);}}
            setTimeout(adjust,10);}
        function adjustToFit(container,threshold,padding){
            var trace_adjust=(container.traceadjust)||
                fdjtDOM.trace_adjust||
                ((typeof container.className === "string")&&
                 (container.className.search(/\btraceadjust\b/)>=0))||
                default_trace_adjust;
            var style=getStyle(container);
            var geom=getGeometry(container);
            var maxheight=((style.maxHeight)&&(parsePX(style.maxHeight)))||
                (geom.height);
            var maxwidth=((style.maxWidth)&&(parsePX(style.maxWidth)))||
                (geom.width);
            var goodenough=threshold||0.1;
            var scale=(container.scale)||100.0;
            var bounds=getInsideBounds(container);
            var hpadding=
                (fdjtDOM.parsePX(style.paddingLeft)||0)+
                (fdjtDOM.parsePX(style.paddingRight)||0)+
                (fdjtDOM.parsePX(style.borderLeftWidth)||0)+
                (fdjtDOM.parsePX(style.borderRightWidth)||0)+
                padding;
            var vpadding=
                (fdjtDOM.parsePX(style.paddingTop)||0)+
                (fdjtDOM.parsePX(style.paddingBottom)||0)+
                (fdjtDOM.parsePX(style.borderTopWidth)||0)+
                (fdjtDOM.parsePX(style.borderBottomWidth)||0)+
                padding;
            maxwidth=maxwidth-hpadding; maxheight=maxheight-vpadding; 
            var itfits=
                ((bounds.height/maxheight)<=1)&&((bounds.width/maxwidth)<=1);
            if (trace_adjust) 
                fdjtLog("Adjust (%o) %s cur=%o%s, best=%o~%o, limit=%ox%o=%o, box=%ox%o=%o, style=%s",
                        goodenough,fdjtDOM.nodeString(container),
                        scale,((itfits)?" (fits)":""),
                        container.bestscale||-1,container.bestfit||-1,
                        maxwidth,maxheight,maxwidth*maxheight,
                        bounds.width,bounds.height,bounds.width*bounds.height,
                        styleString(container));
            if (itfits) {
                /* Figure out how well it fits */
                var fit=Math.max((1-(bounds.width/maxwidth)),
                                 (1-(bounds.height/maxheight)));
                var bestfit=container.bestfit||1.5;
                if (!(trace_adjust)) {}
                else if (container.bestscale) 
                    fdjtLog("%s %o~%o vs. %o~%o",
                            ((fit<goodenough)?"Good enough!":
                             ((fit<bestfit)?"Better!":"Worse!")),
                            scale,fit,container.bestscale,container.bestfit);
                else fdjtLog("First fit %o~%o",scale,fit);
                if (fit<bestfit) {
                    container.bestscale=scale; container.bestfit=fit;}
                // If it's good enough, just return
                if (fit<goodenough) {
                    container.goodscale=scale; return;}}
            // Figure out the next scale factor to try
            var rh=maxheight/bounds.height; var rw=maxwidth/bounds.width;
            var newscale=
                ((itfits)?
                 (scale*Math.sqrt
                  ((maxwidth*maxheight)/(bounds.width*bounds.height))):
                 (rh<rw)?(scale*rh):(scale*rw));
            if (trace_adjust)
                fdjtLog("[%fs] Trying newscale=%o, rw=%o rh=%o",
                        fdjt.ET(),newscale,rw,rh);
            applyScale(container,newscale,trace_adjust);}
        fdjtDOM.applyScale=applyScale;
        fdjtDOM.adjustToFit=adjustToFit;
        fdjtDOM.adjustInside=adjustInside;
        fdjtDOM.insideBounds=getInsideBounds;
        fdjtDOM.finishScale=function(container){
            var traced=(container.traceadjust)||
                fdjtDOM.trace_adjust||default_trace_adjust;
            if (!(container.bestscale)) {
                applyScale(container,false,traced);
                fdjtLog("No good scaling for %o style=%s",
                        fdjtDOM.nodeString(container),
                        fdjtDOM.styleString(container));
                return;}
            else if (container.scale===container.bestscale) {}
            else applyScale(container,container.bestscale,traced);
            if (traced)
                fdjtLog("Final scale %o~%o for %o style=%s",
                        container.bestscale,container.bestfit,
                        fdjtDOM.nodeString(container),
                        fdjtDOM.styleString(container));
            delete container.bestscale;
            delete container.bestfit;
            delete container.goodscale;};
        
        /* Getting various kinds of metadata */

        function getHTML(){
            var children=document.childNodes;
            var i=0; var lim=children.length;
            while (i<lim)
                if (children[i].tagName==='HTML') return children[i];
            else i++;
            return false;}
        fdjtDOM.getHTML=getHTML;

        function getHEAD(){
            var children=document.childNodes;
            var i=0; var lim=children.length;
            while (i<lim)
                if (children[i].tagName==='HTML') {
                    var grandchildren=children[i].childNodes;
                    i=0; lim=grandchildren.length;
                    while (i<lim)
                        if (grandchildren[i].tagName==='HEAD')
                            return grandchildren[i];
                    else i++;
                    return false;}
            else i++;
            return false;}
        fdjtDOM.getHEAD=getHEAD;

        var schema2tag={}, tag2schema={};
        function getMetaSchemas(){
            var links=
                ((document.getElementsByTagName)&&
                 (document.getElementsByTagName('link')))||
                ((document.head.getElementsByTagName)&&
                 (document.head.getElementsByTagName('link')))||
                (getChildren(document,'link'));
            var i=0, lim=links.length;
            while (i<lim) {
                var link=links[i++];
                if (!(link.rel)) continue;
                else if (!(link.href)) continue;
                else if (link.rel.search("schema.")===0) {
                    var tag=link.rel.slice(7);
                    var href=link.href;
                    // We let there be multiple references
                    if (tag2schema[tag])
                        fdjtLog.warn("Conflicting schemas for %s",tag);
                    else {
                        if (schema2tag[href])
                            schema2tag[href].push(tag);
                        else schema2tag[href]=[tag];
                        tag2schema[tag]=href;}}
                else continue;}}
        var app_schemas={};
        fdjtDOM.addAppSchema=function(name,spec){
            app_schemas[name]=spec;};
        
        var escapeRX=fdjtString.escapeRX;

        function getNameRX(name,foldcase){
            var prefix, schema, prefixes=[];
            if ((typeof name ==='string')&&
                (typeof foldcase==='undefined')) {
                if (name[0]==='^') {
                    foldcase=false; name=name.slice(1);}
                else if (name[0]==='~') {
                    foldcase=true; name=name.slice(1);}
                else {}}
            if (typeof foldcase === 'undefined') foldcase=true;
            if (typeof name !== 'string') return name;
            else if (name[0]==='{') {
                schema=false;
                var schema_end=name.indexOf('}');
                if (schema_end>2) schema=name.slice(1,schema_end);
                prefixes=((schema)&&(schema2tag[schema]))||[];
                return new RegExp("\\b("+escapeRX(schema)+"|"+
                                  prefixes.join("|")+")[.]"+
                                  name.slice(schema_end+1)+"\\b",
                                  ((foldcase)?("i"):("")));}
            else if (name[0]==='=') {
                // This overrides any schema expansion
                return new RegExp("\\b"+escapeRX(name=name.slice(1))+"\\b",
                                  ((foldcase)?("i"):("")));}
            else if ((name[0]==='*')&&(name[1]==='.')) {
                // This overrides any schema expansion
                return new RegExp("\\b([^.]\\.)?"+name.slice(2)+"\\b",
                                  ((foldcase)?("i"):("")));}
            else if (name.indexOf('.')>0) {
                var dot=name.indexOf('.');
                prefix=name.slice(0,dot);
                schema=app_schemas[prefix];
                if (!(schema))
                    return new RegExp("\\b"+escapeRX(name)+"\\b",
                                      ((foldcase)?("i"):("")));
                else if ((schema)&&(schema2tag[schema]))
                    prefixes=schema2tag[schema];
                else prefixes=[prefix];
                return new RegExp("\\b("+escapeRX(schema)+"|"+
                                  prefixes.join("|")+")\\."+
                                  name.slice(dot+1)+"\\b",
                                  ((foldcase)?("i"):("")));}
            else return new RegExp("\\b"+name+"\\b",((foldcase)?("i"):("")));}
            

        function getMeta(name,multiple,foldcase,dom){
            var results=[];
            var elts=((document.getElementsByTagName)?
                      (document.getElementsByTagName("META")):
                      (getChildren(document,"META")));
            var rx=getNameRX(name,foldcase);
            var i=0; while (i<elts.length) {
                var elt=elts[i++];
                if (!(elt)) continue;
                else if (!(elt.name)) continue;
                else if (elt.name.search(rx)>=0) {
                    if (multiple) {
                        if (dom) results.push(elt);
                        else results.push(elt.content);}
                    else if (dom) return elt;
                    else return elt.content;}
                else {}}
            if (multiple) return results;
            else return false;}
        fdjtDOM.getMeta=getMeta;
        fdjtDOM.getMetaElts=function(name){
            var matchcase;
            return getMeta(name,true,matchcase,true);};

        // This gets a LINK href field
        function getLink(name,multiple,foldcase,dom,attrib){
            var results=[];
            var elts=((document.getElementsByTagName)?
                      (document.getElementsByTagName("LINK")):
                      ((document.body)&&(document.body.getElementsByTagName))?
                      (document.body.getElementsByTagName("LINK")):
                      (getChildren(document,"LINK")));
            var rx=getNameRX(name,foldcase);
            var i=0; while (i<elts.length) {
                var elt=elts[i++];
                if (!(elt)) continue;
                else if (!(elt.rel)) continue;
                else if (elt.rel.search(rx)>=0) {
                    if (multiple) {
                        if (dom) results.push(elt);
                        else if (attrib)
                            results.push(elt.getAttribute("href"));
                        else results.push(elt.href);}
                    else if (dom) return elt;
                    else if (attrib)
                        return elt.getAttribute("href");
                    else return elt.href;}
                else {}}
            if (multiple) return results;
            else return false;}
        fdjtDOM.getLink=getLink;
        fdjtDOM.getLinks=function(name){return getLink(name,true);};
        fdjtDOM.getLinkElts=function(name){
            var matchcase;
            return getLink(name,true,matchcase,true);};

        /* Going forward */

        /* If there's a children property (childNodes which are elements),
           we assume that all the element-specific fields exist. */
        var havechildren=((document)&&
                          (document.body)&&
                          (document.body.childNodes)&&
                          (document.body.children));

        // NEXT goes to the next sibling or the parent's next sibling
        function next_node(node){
            while (node) {
                if (node.nextSibling)
                    return node.nextSibling;
                else node=node.parentNode;}
            return false;}
        function next_element(node){
            if (node.nextElementSibling)
                return node.nextElementSibling;
            else {
                var scan=node;
                while ((scan=scan.nextSibling)) {
                    if (!(scan)) return null;
                    else if (scan.nodeType===1) break;
                    else {}}
                return scan;}}
        function scan_next(node,test,justelts){
            if (!(test))
                if (justelts) {
                    if (havechildren) return node.nextElementSibling;
                    else return next_element(node);}
            else return next_node(node);
            var scan=((justelts)?
                      ((havechildren)?
                       (node.nextElementSibling):(next_element(node))):
                      ((node.nextSibling)||(next_node(node))));
            while (scan)
                if (test(scan)) return scan;
            else if (justelts)
                scan=((scan.nextElementSibling)||(next_element(scan)));
            else scan=((scan.nextSibling)||(next_node(scan)));
            return false;}

        // FORWARD goes to the first deepest child
        function forward_node(node){
            if ((node.childNodes)&&((node.childNodes.length)>0))
                return node.childNodes[0];
            else while (node) {
                if (node.nextSibling)
                    return node.nextSibling;
                else node=node.parentNode;}
            return false;}
        function forward_element(node,n){
            var scan, i, lim;
            if (n) {
                i=0; scan=node;
                while (i<n) {scan=forward_element(scan); i++;}
                return scan;}
            if (havechildren) {
                if ((node.children)&&(node.children.length>0)) {
                    return node.children[0];}
                if ((scan=node.nextElementSibling)) return scan;
                while ((node=node.parentNode))
                    if ((scan=node.nextElementSibling)) return scan;
                return false;}
            else {
                if (node.childNodes) {
                    var children=node.childNodes; i=0; lim=children.length;
                    while (i<lim)
                        if (((scan=children[i++]))&&((scan.nodeType===1))) return scan;}
                while ((scan=node.nextSibling)) if (scan.nodeType===1) return scan;
                while ((node=node.parentNode))
                    if ((scan=next_element(node))) return scan;
                return false;}}
        function scan_forward(node,test,justelts){
            if (!(test)) {
                if (justelts) return forward_element(node);
                else return forward_node(node);}
            var scan=((justelts)?(forward_element(node)):(forward_node(node)));
            while (scan) {
                if (test(scan)) return scan;
                else if (justelts) scan=next_element(scan);
                else scan=next_node(scan);}
            return false;}

        fdjtDOM.nextElt=next_element;
        fdjtDOM.forwardElt=forward_element;
        fdjtDOM.forward=scan_forward;
        fdjtDOM.next=scan_next;

        /* Skimming backwards */

        // PREV goes the parent if there's no previous sibling
        function prev_node(node){
            while (node) {
                if (node.previousSibling)
                    return node.previousSibling;
                else node=node.parentNode;}
            return false;}
        function previous_element(node){
            if (havechildren)
                return node.previousElementSibling;
            else {
                var scan=node;
                while ((scan=scan.previousSibling))
                    if (!(scan)) return null;
                else if (scan.nodeType===1) break;
                else {}
                if (scan) return scan;
                else return scan.parentNode;}}
        function scan_previous(node,test,justelts){
            if (!(test))
                if (justelts) {
                    if (havechildren) return node.previousElementSibling;
                    else return previous_element(node);}
            else return prev_node(node);
            var scan=((justelts)?
                      ((havechildren)?(node.previousElementSibling):
                       (previous_element(node))):
                      (prev_node(node)));
            while (scan)
                if (test(scan)) return scan;
            else if (justelts)
                scan=((havechildren)?(scan.previousElementSibling):(previous_element(scan)));
            else scan=prev_node(scan);
            return false;}

        // BACKWARD goes to the final (deepest last) child
        //  of the previous sibling
        function backward_node(node){
            if (node.previousSibling) {
                var scan=node.previousSibling;
                // If it's not an element, just return it
                if (scan.nodeType!==1) return scan;
                // Otherwise, return the last and deepest child
                while (scan) {
                    var children=scan.childNodes;
                    if (!(children)) return scan;
                    else if (children.length===0) return scan;
                    else scan=children[children.length-1];}
                return scan;}
            else return node.parentNode;}

        function backward_element(node){
            if (havechildren)
                return ((node.previousElementSibling)?
                        (get_final_child((node.previousElementSibling))):
                        (node.parentNode));
            else if ((node.previousElementSibling)||(node.previousSibling)) {
                var start=(node.previousElementSibling)||(node.previousSibling);
                if (start.nodeType===1) 
                    return get_final_child(start);
                else return start;}
            else return node.parentNode;}
        // We use a helper function because 
        function get_final_child(node){
            if (node.nodeType===1) {
                if (node.childNodes) {
                    var children=node.childNodes;
                    if (!(children.length)) return node;
                    var scan=children.length-1;
                    while (scan>=0) {
                        var child=get_final_child(children[scan--]);
                        if (child) return child;}
                    return node;}
                else return node;}
            else return false;}
        
        function scan_backward(node,test,justelts){
            if (!(test)) {
                if (justelts) return backward_element(node);
                else return backward_node(node);}
            var scan=((justelts)?
                      (backward_element(node)):
                      (backward_node(node)));
            while (scan) {
                if (test(scan)) return scan;
                else if (justelts) scan=next_element(scan);
                else scan=next_node(scan);}
            return false;}
        
        fdjtDOM.prevElt=previous_element;
        fdjtDOM.backwardElt=backward_element;
        fdjtDOM.backward=scan_backward;
        fdjtDOM.prev=scan_previous;

        /* Viewport/window functions */

        fdjtDOM.viewTop=function viewTop(win){
            if (typeof win==="string") {
                if (!(win=document.getElementById(win))) return;}
            if ((!(win))||(win===window)||
                ((window.Window)&&(win instanceof window.Window))) {
                win=win||window;
                return (win.pageYOffset||win.scrollY||
                        win.document.documentElement.scrollTop||0);}
            else return win.scrollTop;};
        
        fdjtDOM.viewLeft=function viewLeft(win){
            if (typeof win==="string") {
                if (!(win=document.getElementById(win))) return;}
            if ((!(win))||(win===window)||
                ((window.Window)&&(win instanceof window.Window))) {
                win=win||window;
                return (win.pageXOffset||win.scrollX||
                        win.document.documentElement.scrollLeft||0);}
            else return win.scrollLeft;};

        function viewHeight(win){
            if (typeof win==="string") {
                if (!(win=document.getElementById(win))) return;}
            if (!(win)) win=window;
            if (win.hasOwnProperty('innerHeight')) return win.innerHeight;
            else if ((win.document)&&(window.document.documentElement)&&
                     (window.document.documentElement.clientHeight))
                return window.document.documentElement.clientHeight;
            else return win.offsetHeight;}
        fdjtDOM.viewHeight=viewHeight;
        function viewWidth(win){
            if (typeof win==="string") {
                if (!(win=document.getElementById(win))) return;}
            if (!(win)) win=window;
            if (win.hasOwnProperty('innerWidth')) return win.innerWidth;
            else if ((win.document)&&(window.document.documentElement)&&
                     (window.document.documentElement.clientWidth))
                return window.document.documentElement.clientWidth;
            else return win.offsetWidth;}
        fdjtDOM.viewWidth=viewWidth;

        function getOrientation(win){
            if (typeof win==="string") {
                if (!(win=document.getElementById(win))) return;}
            if (!(win)) win=window;
            if (win.hasOwnProperty('orientation')) {
                if ((win.orientation===90)||(win.orientation===-90))
                    return 'landscape';
                else return 'portrait';}
            else {
                var w=viewWidth(win), h=viewHeight(win);
                if (w>h) return 'landscape';
                else return 'portrait';}}
        fdjtDOM.getOrientation=getOrientation;

        /* Generating element IDs */

        var id_count=0; var unique=Math.floor(Math.random()*100000);
        function getNodeID(elt){
            var id=elt.id; var nelt;
            if (id) return id;
            else {
                id="TMPID_"+unique+"_"+(id_count++);
                while ((!(nelt=document.getElementById(id)))||
                       (nelt===elt)) {
                    id="TMPID_"+unique+"_"+(id_count++);
                    if ((!(nelt=document.getElementById(id)))||
                        (nelt===elt))
                        unique=Math.floor(Math.random()*100000);
                    id="TMPID_"+unique+"_"+(id_count++);}
                elt.id=id;
                return id;}}
        fdjtDOM.getNodeID=getNodeID;
        
        /* Removing IDs */

        function stripIDs(node,nametoo,moveto){
            if (!(nametoo)) nametoo=false;
            if (!(moveto)) moveto=false;
            if (node.id) {
                if (moveto) node.setAttribute(moveto,node.id);
                node.id="";
                node.removeAttribute("id");}
            if ((nametoo)&&(node.name)) node.name=null;
            if ((node.childNodes)&&(node.childNodes.length)) {
                var children=node.childNodes, i=0, lim=children.length;
                while (i<lim) {
                    var child=children[i++];
                    if (child.nodeType===1)
                        stripIDs(child,nametoo,moveto);}}}
        fdjtDOM.stripIDs=stripIDs;

        /* Stylesheet manipulation */

        // Adapted from 
        // http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript

        // Return requested style object
        function getCSSRule(ruleName, deleteFlag) {
            ruleName=ruleName.toLowerCase();
            // If browser can play with stylesheets
            if (document.styleSheets) {
                // For each stylesheet
                for (var i=0; i<document.styleSheets.length; i++) {
                    var styleSheet=document.styleSheets[i];
                    var cssRules=styleSheet.cssRules||styleSheet.rules;
                    var n_rules=((cssRules)&&(cssRules.length));
                    var ii=0; while (ii<n_rules) {
                        if (cssRules[ii])  {
                            var cssRule=cssRules[ii];
                            if (cssRule.selectorText.toLowerCase()===ruleName) {
                                if (deleteFlag==='delete') {
                                    if (styleSheet.cssRules) {
                                        styleSheet.deleteRule(ii);}
                                    // Delete rule IE style.
                                    return true;}
                                // found and not deleting.
                                else {return cssRule;}
                                // end found cssRule
                            }}   
                        ii++;}
                    /* end for stylesheets */ }
                return false;}
            return false;}
        fdjtDOM.getCSSRule=getCSSRule;

        function dropCSSRule(ruleName) {// Delete a CSS rule   
            return getCSSRule(ruleName,'delete');}
        fdjtDOM.dropCSSRule=dropCSSRule;

        function addCSSRule(selector,style,sheet) {// Create a new css rule
            if (!(sheet)) {
                var styles=fdjtID("FDJTSTYLES");
                if (!(styles)) {
                    var head=document.getElementsByTagName("HEAD");
                    if (head.length===0) return; else head=head[0];
                    styles=fdjtDOM("style#FDJTSTYLES");
                    head.appendChild(styles);}
                sheet=styles.sheet;}
            if (!(sheet)) return false;
            else if ((sheet.insertRule)||(sheet.addRule)) {
                var rules=sheet.cssRules||sheet.rules;
                var at=rules.length;
                if (sheet.insertRule)
                    sheet.insertRule(selector+' {'+style+'}',at);
                else sheet.addRule(selector,style,at);
                return rules[at];}
            else return false;}
        fdjtDOM.addCSSRule=addCSSRule;

        /* Listeners (should be in UI?) */

        function addListener(node,evtype,handler){
            if (!(node)) node=document;
            if (typeof node === 'string') {
                var elt=fdjtID(node);
                if (!(node)) {
                    fdjtLog.warn("Can't find #%s",node);
                    return;}
                node=elt;}
            else if (((Array.isArray)&&(Array.isArray(node)))||
                     ((window.NodeList)&&(node instanceof window.NodeList))) {
                var i=0; var lim=node.length;
                while (i<lim) addListener(node[i++],evtype,handler);
                return;}
            else if ((node!==window)&&(!(node.nodeType))) {
                fdjtLog.warn("Bad target(s) arg to addListener(%s) %o",evtype,node);
                return;}
            // OK, actually do it
            if (evtype==='title') { 
                // Not really a listener, but helpful
                if (typeof handler === 'string') 
                    if (node.title)
                        node.title='('+handler+') '+node.title;
                else node.title=handler;}
            else if (evtype[0]==='=')
                node[evtype.slice(1)]=handler;
            else if (node.addEventListener)  {
                // fdjtLog("Adding listener %o for %o to %o",handler,evtype,node);
                return node.addEventListener(evtype,handler,false);}
            else if (node.attachEvent)
                return node.attachEvent('on'+evtype,handler);
            else fdjtLog.warn('This node never listens: %o',node);}
        fdjtDOM.addListener=addListener;

        function defListeners(handlers,defs){
            if ((handlers)&&(defs))
                for (var domspec in defs) {
                    if (defs.hasOwnProperty(domspec)) {
                        var evtable=defs[domspec];
                        var addto=handlers[domspec];
                        if ((!(addto))||
                            (!(handlers.hasOwnProperty(domspec))))
                            handlers[domspec]=addto={};
                        for (var evtype in evtable) {
                            if (evtable.hasOwnProperty(evtype))
                                addto[evtype]=evtable[evtype];}}}}
        fdjtDOM.defListeners=defListeners;

        var events_pat=/^([^:]+)$/;
        var spec_events_pat=/^([^: ]+):([^: ]+)$/;

        function addListeners(node,handlers){
            if (handlers) {
                for (var evtype in handlers) {
                    if (handlers.hasOwnProperty(evtype)) {
                        var match=false, val=handlers[evtype];
                        if (!(val.call)) {}
                        else if (events_pat.exec(evtype))
                            addListener(node,evtype,handlers[evtype]);
                        else if ((match=spec_events_pat.exec(evtype))) {
                            var ev=match[2];
                            var handler=handlers[evtype];
                            var elts=node.querySelectorAll(match[1]);
                            addListener(elts,ev,handler);}}}}}
        fdjtDOM.addListeners=addListeners;
        
        function removeListener(node,evtype,handler){
            if (!(node)) node=document;
            if (typeof node === 'string') {
                var elt=fdjtID(node);
                if (!(node)) {
                    fdjtLog("Can't find #%s",node);
                    return;}
                node=elt;}
            else if (((Array.isArray)&&(Array.isArray(node)))||
                     ((window.NodeList)&&(node instanceof window.NodeList))) {
                var i=0; var lim=node.length;
                while (i<lim) removeListener(node[i++],evtype,handler);
                return;}
            else if ((node!==window)&&(!(node.nodeType))) {
                fdjtLog.warn("Bad target(s) arg to removeListener(%s) %o",evtype,node);
                return;}
            // OK, actually do it
            if (node.removeEventListener)  {
                return node.removeEventListener(evtype,handler,false);}
            else if (node.detachEvent)
                return node.detachEvent('on'+evtype,handler);
            else fdjtLog.warn('This node never listens: %o',node);}
        fdjtDOM.removeListener=removeListener;

        fdjtDOM.T=function(evt) {
            evt=evt||window.event; return (evt.target)||(evt.srcElement);};

        fdjtDOM.cancel=function(evt){
            evt=evt||window.event;
            if (evt.preventDefault) evt.preventDefault();
            else evt.returnValue=false;
            evt.cancelBubble=true;};

        function triggerClick(elt){
            if (document.createEvent) { // in chrome
                var e = document.createEvent('MouseEvents');
                e.initEvent( 'click', true, true );
                elt.dispatchEvent(e);
                return;}
            else {
                fdjtLog.warn("Couldn't trigger click");
                return;}}
        fdjtDOM.triggerClick=triggerClick;

        /* Scaling to fit using CSS transforms */

        function scale_node(node,fudge,origin,shrink){
            if (!(origin)) origin=node.getAttribute("data-origin");
            if (!(shrink)) shrink=node.getAttribute("data-shrink");
            if (!(fudge)) fudge=node.getAttribute("data-fudge");

            // Clear any existing adjustments
            var first=node.firstChild, wrapper=
                ((first.className==="fdjtadjusted")?(first):
                 (getFirstChild(node,"fdjtadjusted")));
            if (wrapper) wrapper.setAttribute("style","");

            var geom=getGeometry(node,false,true), inside=getInsideBounds(node);
            var avail_width=((fudge)?(fudge*geom.inner_width):
                             (geom.inner_width));
            var avail_height=((fudge)?(fudge*geom.inner_height):
                              (geom.inner_height));

            if ((inside.height<=avail_height)&&(inside.width<=avail_width)) {
                // Everything is inside
                if (!(shrink)) return;
                // If you fit closely in any dimension, don't try scaling
                if (((inside.height<avail_height)&&
                     (inside.height>=(avail_height*0.9)))||
                    ((inside.width<geom.inner_width)&&
                     (inside.width>=(avail_height*0.9))))
                    return;}
            if (!(wrapper)) {
                var nodes=[], children=node.childNodes;
                var i=0, lim=children.length;
                while (i<lim) nodes.push(children[i++]);
                wrapper=fdjtDOM("div.fdjtadjusted");
                i=0; lim=nodes.length; while (i<lim)
                    wrapper.appendChild(nodes[i++]);
                node.appendChild(wrapper);}
            var w_scale=avail_width/inside.width;
            var h_scale=avail_height/inside.height;
            var scale=((w_scale<h_scale)?(w_scale):(h_scale));
            wrapper.style[fdjtDOM.transform]="scale("+scale+","+scale+")";
            wrapper.style[fdjtDOM.transformOrigin]=origin||"50% 0%";}

        function scaleAll(){
            var all=fdjtDOM.$(".fdjtadjustfit");
            var i=0, lim=all.length; while (i<lim)
                scale_node(all[i++]);}
        
        function scaleToFit(node,fudge,origin){
            fdjtDOM.addClass(node,"fdjtadjustfit");
            if ((fudge)&&(typeof fudge !== "number")) fudge=0.9;
            if (fudge) node.setAttribute("data-fudge",fudge);
            if (origin) node.setAttribute("data-origin",origin);
            scale_node(node,fudge,origin);
            return node;}
        fdjtDOM.scaleToFit=scaleToFit;
        fdjtDOM.scaleToFit.scaleNode=fdjtDOM.scaleToFit.adjust=scale_node;
        
        function scale_revert(node,wrapper){
            if (!(wrapper)) {
                if (hasClass(node,"fdjtadjusted")) {
                    wrapper=node; node=wrapper.parentNode;}
                else wrapper=
                    ((node.firstChild.className==="fdjtadjusted")?
                     (node.firstChild):(getFirstChild(node,"fdjtadjusted")));}
            if ((node)&&(wrapper)) {
                var nodes=[], children=wrapper.childNodes;
                var i=0, lim=children.length;
                while (i<lim) nodes.push(children[i++]);
                var frag=document.createDocumentFragment();
                i=0; lim=nodes.length; while (i<lim) {
                    frag.appendChild(nodes[i++]);}
                node.replaceChild(frag,wrapper);
                return node;}
            else return false;}
        fdjtDOM.scaleToFit.revert=scale_revert;

        function revertAll(){
            var all=fdjtDOM.$(".fdjtadjusted");
            var i=0, lim=all.length; while (i<lim) {
                var wrapper=all[i++];
                scale_revert(wrapper.parentNode,wrapper);}}
        fdjtDOM.scaleToFit.revertAll=revertAll;

        fdjt.addInit(scaleAll);
        fdjtDOM.addListener(window,"resize",scaleAll);

        /* Check for SVG */
        var nosvg;

        function checkSVG(){
            var root=document.documentElement||document.body;
            if (typeof nosvg === "undefined") {
                if ((document.implementation)&&
                    (document.implementation.hasFeature))
                    nosvg=(!(document.implementation.hasFeature(
                        "http://www.w3.org/TR/SVG11/feature#Image",
                        "1.1")));
                else if (navigator.appName==="Microsoft Internet Explorer")
                    // SVG (or at least SVGZ) images don't seem to
                    // obey CSS scaling in IE.
                    nosvg=true;
                else if (navigator.mimeTypes["image/svg+xml"])
                    nosvg=false;
                else nosvg=true;}
            if (nosvg) {
                addClass(root,"_NOSVG");
                dropClass(root,"_USESVG");}
            else {
                dropClass(root,"_NOSVG");
                addClass(root,"_USESVG");}
            return (!(nosvg));}
        
        function checkChildren(){
            havechildren=((document)&&
                          (document.body)&&
                          (document.body.childNodes)&&
                          (document.body.children));}

        function useBMP(){
            var hasSuffix=fdjtString.hasSuffix;
            var images=fdjt.$("IMG");
            var i=0, lim=images.length;
            while (i<lim) {
                var image=images[i++]; var src=image.src;
                if (!(src)) continue;
                if ((hasSuffix(src,".svg"))||(hasSuffix(src,".svgz"))) {
                    var bmp=image.getAttribute('bmp');
                    if (bmp) {
                        image.setAttribute('svg',image.src);
                        image.src=bmp;}}}}
        function useSVG(){
            var hasSuffix=fdjtString.hasSuffix;
            var images=fdjt.$("IMG");
            var i=0, lim=images.length;
            while (i<lim) {
                var image=images[i++]; var src=image.src;
                if (!(src)) continue;
                if ((!((hasSuffix(src,".svg"))||(hasSuffix(src,".svgz"))))&&
                    (image.getAttribute('svg'))) {
                    var svg=image.getAttribute('svg');
                    image.setAttribute('bmp',image.src);
                    image.src=svg;}}}
        fdjtDOM.useSVG=useSVG;
        fdjtDOM.useBMP=useBMP;

        function prefSVG(){
            if (!(nosvg)) useSVG();}
        fdjtDOM.prefSVG=prefSVG;
        fdjtDOM.checkSVG=checkSVG;

        fdjtDOM.init=fdjt.Init;
        fdjtDOM.addInit=fdjt.addInit;
        fdjt.addInit(checkChildren,"checkChildren");
        fdjt.addInit(checkSVG,"checkSVG");

        if (navigator.userAgent.search("WebKit")>=0) {
            if (!(fdjtDOM.transition)) fdjtDOM.transition='-webkit-transition';
            if (!(fdjtDOM.transitionProperty))
                fdjtDOM.transitionProperty='-webkit-transition-property';
            if (!(fdjtDOM.transitionDuration))
                fdjtDOM.transitionDuration='-webkit-transition-duration';
            if (!(fdjtDOM.transitionDelay))
                fdjtDOM.transitionDelay='-webkit-transition-delay';
            if (!(fdjtDOM.transitionTiming))
                fdjtDOM.transitionTiming='-webkit-transition-timing-function';
            if (!(fdjtDOM.transform)) fdjtDOM.transform='-webkit-transform';
            if (!(fdjtDOM.transformOrigin))
                fdjtDOM.transformOrigin='-webkit-transform-origin';
            if (!(fdjtDOM.columnWidth)) fdjtDOM.columnWidth='-webkit-column-width';
            if (!(fdjtDOM.columnGap)) fdjtDOM.columnGap='-webkit-column-gap';}
        else if (navigator.userAgent.search("Mozilla")>=0) {
            if (!(fdjtDOM.transition)) fdjtDOM.transition='-moz-transition';
            if (!(fdjtDOM.transitionProperty))
                fdjtDOM.transitionProperty='-moz-transition-property';
            if (!(fdjtDOM.transitionDuration))
                fdjtDOM.transitionDuration='-moz-transition-duration';
            if (!(fdjtDOM.transitionDelay))
                fdjtDOM.transitionDelay='-moz-transition-delay';
            if (!(fdjtDOM.transitionTiming))
                fdjtDOM.transitionTiming='-moz-transition-timing-function';
            if (!(fdjtDOM.transform)) fdjtDOM.transform='-moz-transform';
            if (!(fdjtDOM.transformOrigin))
                fdjtDOM.transformOrigin='-moz-transform-origin';
            if (!(fdjtDOM.columnWidth)) fdjtDOM.columnWidth='MozColumnWidth';
            if (!(fdjtDOM.columnGap)) fdjtDOM.columnGap='MozColumnGap';}
        else {
            if (!(fdjtDOM.transition)) fdjtDOM.transition='transition';
            if (!(fdjtDOM.transitionProperty))
                fdjtDOM.transitionProperty='transition-property';
            if (!(fdjtDOM.transitionDuration))
                fdjtDOM.transitionDuration='transition-duration';
            if (!(fdjtDOM.transitionDelay))
                fdjtDOM.transitionDelay='transition-delay';
            if (!(fdjtDOM.transitionTiming))
                fdjtDOM.transitionTiming='transition-timing-function';
            if (!(fdjtDOM.transform)) fdjtDOM.transform='transform';
            if (!(fdjtDOM.transformOrigin))
                fdjtDOM.transformOrigin='-moz-transform-origin';}
        
        if (typeof document.hidden !== "undefined") {
            fdjtDOM.isHidden="hidden";
            fdjtDOM.vischange="visibilitychange";}
        else if (typeof document.webkitHidden !== "undefined") {
            fdjtDOM.isHidden="webkitHidden";
            fdjtDOM.vischange="webkitvisibilitychange";}
        else if (typeof document.mozHidden !== "undefined") {
            fdjtDOM.isHidden="mozHidden";
            fdjtDOM.vischange="mozvisibilitychange";}
        else if (typeof document.msHidden !== "undefined") {
            fdjtDOM.isHidden="msHidden";
            fdjtDOM.vischange="msvisibilitychange";}
        else {
            fdjtDOM.isHidden=false; fdjtDOM.vischange=false;}

        /* Selection-y functions */

        fdjtDOM.getSelectedRange=function(sel){
            if (sel) {}
            else if (window.getSelection)
                sel=window.getSelection();
            else if (document.selection)
                sel=document.selection.createRange();
            else return false;
            if (!(sel)) return false;
            if (sel.getRangeAt) {
                if (sel.rangeCount)
                    return sel.getRangeAt(0);
                else return false;}
            else if (document.createRange) {
                var range=document.createRange();
                range.setStart(sel.anchorNode,sel.anchorOffset);
                range.setEnd(sel.focusNode,sel.focusOffset);
                return range;}
            else return false;};

        fdjtDOM.rangeIsEmpty=function(range){
            if (range) {
                if ((range.startContainer===range.endContainer)&&
                    (range.startOffset===range.endOffset))
                    return true;
                else return false;}
            else return true;};

        fdjtDOM.clearSelection=function(sel){
            if (!(sel))
                sel=document.selection||window.getSelection();
            if (sel.removeAllRanges) {
                sel.removeAllRanges();}
            else if (sel.empty) {
                sel.empty();}
            else {}};

        function node2text(node,accum){
            var i, lim;
            if (!(accum)) accum="";
            if ((!(node.nodeType))&&(node.length)) {
                i=0; lim=node.length;
                while (i<lim) accum=node2text(node[i++],accum);
                return accum;}
            else if (node.nodeType===3) {
                var stringval=node.nodeValue;
                if (stringval)
                    accum=accum+stringval;
                return accum;}
            else if (node.nodeType===1) {
                var style=getStyle(node);
                var children=node.childNodes;
                if ((typeof node.className === "string")&&
                    (node.className.search(/\bfdjtskiptext\b/)>=0))
                    return accum;
                else if ((style.display==='none')||
                    (style.visibility==='hidden')||
                    (!((style.position==='static')||
                       (style.position===''))))
                    return accum;
                else {}
                i=0; lim=children.length;
                while (i<lim) {
                    var child=children[i++];
                    if (child.nodeType===3) {
                        var s=child.nodeValue;
                        if (s) accum=accum+s;}
                    else accum=node2text(child,accum);}
                return accum;}
            else return accum;}
        fdjtDOM.node2text=node2text;
        
        function get_text_pos(node,pos,cur,starting){
            var i, lim;
            if (cur>pos) return false;
            else if ((!(node.nodeType))&&(node.length)) {
                i=0; lim=node.length;
                while (i<lim) {
                    cur=get_text_pos(node[i++],pos,cur,starting);
                    if (typeof cur !== "number") return cur;}
                return cur;}
            else if (node.nodeType===3) {
                var stringval=node.nodeValue;
                if (pos<(cur+stringval.length))
                    return { node: node, off: pos-cur};
                else if (pos===(cur+stringval.length))
                    return { node: node, off: pos-cur,atend: true};
                else return cur+stringval.length;}
            else if (node.nodeType===1) {
                var style=getStyle(node);
                var children=node.childNodes;
                if ((typeof node.className === "string")&&
                    (node.className.search(/\bfdjtskiptext\b/)>=0))
                    return cur;
                else if ((style.display==='none')||
                    (style.visibility==='hidden')||
                    (!((style.position==='static')||
                       (style.position===''))))
                    return cur;
                else {}
                i=0; lim=children.length;
                while (i<lim) {
                    cur=get_text_pos(children[i++],pos,cur,starting);
                    if (typeof cur !== 'number') {
                        if ((starting)&&(cur.atend)) {
                            cur=pos; while (i<lim) {
                                var next=get_text_pos(
                                    children[i++],cur,pos,starting);
                                if ((next)&&(typeof next!=="number"))
                                    return next;}
                            return cur;}
                        else return cur;}}
                return cur;}
            else return cur;}

        function textPos(node,pos,sofar){
            var result=get_text_pos(node,pos,sofar||0);
            if (typeof result !== 'number') return result;
            else return {node: node,off: pos};}
        fdjtDOM.textPos=textPos;

        fdjtDOM.refineRange=function(range){
            if ((range.startContainer.nodeType===3)&&
                (range.endContainer.nodeType===3))
                return range;
            var start_info=textPos(range.startContainer,range.startOffset);
            var end_info=textPos(range.endContainer,range.endOffset);
            var newrange=document.createRange();
            newrange.setStart(start_info.node,start_info.off);
            newrange.setEnd(end_info.node,end_info.off);
            return newrange;};
        
        function get_text_off(scan,upto,sofar){
            if (!(sofar)) sofar=0;
            if (scan===upto) return [sofar];
            else if (scan.nodeType===3)
                return sofar+scan.nodeValue.length;
            else if (scan.nodeType===1) {
                var children=scan.childNodes;
                var i=0, lim=children.length;
                while (i<lim) {
                    var child=children[i++];
                    sofar=get_text_off(child,upto,sofar);
                    if (typeof sofar !== 'number') return sofar;}
                return sofar;}
            else return sofar;}
        function textOff(node,pos){
            var off=get_text_off(node,pos,0);
            if (off) return off[0]; else return false;}
        fdjtDOM.textOff=textOff;
        
        function getIDParent(scan) {
            while (scan) {
                if (scan.id) break;
                else scan=scan.parentNode;}
            return scan;}

        fdjtDOM.getRangeInfo=function(range,within){
            var start=range.startContainer;
            if (!(within)) within=getIDParent(start);
            var start_edge=textOff(within,start,0);
            var end=range.endContainer;
            var ends_in=((start===end)?(within):
                         (getParent(end,within))?(within):
                         (getIDParent(end)));
            var end_edge=((start===end)?(start_edge):
                          textOff(ends_in,end,0));
            return {start: start_edge+range.startOffset,
                    starts_in: within.id,ends_in: ends_in.id,
                    end: end_edge+range.endOffset};};

        function getRegexString(needle,shyphens,before,after){
            if (shyphens) {
                needle=needle.replace("­","");
                return ((before||"")+
                        (needle.replace(/\S/g,"$&­?").
                         replace(/([()\[\]\.\?\+\*])­\?/gm,"[$1]").
                         replace("­? "," ").replace(/\s+/g,"(\\s+)"))+
                        (after||""));}
            else return (((before)||(""))+
                         (needle.replace(/[()\[\]\.\?\+\*]/gm,"[$&]").replace(
                                 /\s+/g,"(\\s+)"))+
                         ((after)||("")));}
        fdjtDOM.getRegexString=getRegexString;

        function textRegExp(needle,foldcase,shyphens,before,after){
            if (typeof shyphens==="undefined") shyphens=true;
            return new RegExp(getRegexString(needle,shyphens,before,after),
                              ((foldcase)?("igm"):("gm")));}
        fdjtDOM.textRegExp=textRegExp;
        function wordRegExp(needle,foldcase,shyphens){
            if (typeof shyphens==="undefined") shyphens=true;
            return new RegExp(getRegexString(needle,shyphens,"\\b","\\b"),
                              ((foldcase)?("igm"):("gm")));}
        fdjtDOM.wordRegExp=wordRegExp;

        function findString(node,needle,off,count){
            if (typeof off === 'undefined') off=0;
            if (typeof count === 'undefined') count=1;
            needle=needle.replace(/­/mg,"");
            var match=false;
            var fulltext=node2text(node);
            var sub=((off===0)?(fulltext):(fulltext.slice(off)));
            var scan=sub.replace(/­/mg,"");
            var pat=((typeof needle === 'string')?
                     (textRegExp(needle,false,false)):
                     (needle));
            while ((match=pat.exec(scan))) {
                if (count===1) {
                    var loc=match.index;
                    if (scan!==sub) {
                        // If the text contains soft hyphens, we need
                        // to adjust *loc* (which is an offset into
                        // the string without those hyphens into an
                        // offset in the actual string in the DOM.
                        var i=0; while (i<loc) {
                            if (sub[i]==="­") loc++;
                            i++;}}
                    var absloc=loc+off;
                    var start=get_text_pos(node,absloc,0,true);
                    var end=get_text_pos(node,absloc+(match[0].length),0);
                    if ((!start)||(!end)) return false;
                    var range=document.createRange();
                    if (start.atend) {
                        var txt=firstText(start.node.nextSibling);
                        if (txt) range.setStart(txt,0);
                        else range.setStart(start.node,start.off);}
                    else range.setStart(start.node,start.off);
                    range.setEnd(end.node,end.off);
                    return range;}
                else {count--;
                      off=match.index+match[0].length;
                      scan=scan.slice(off);}}
            return false;}
        fdjtDOM.findString=findString;

        function findMatches(node,needle,off,count){
            if (typeof off === 'undefined') off=0;
            if (typeof count === 'undefined') count=-1;
            var match=false; var results=[];
            var fulltext=node2text(node);
            var scan=((off===0)?(fulltext):(fulltext.slice(off)));
            var pat=((typeof needle === 'string')?(textRegExp(needle)):
                     (needle));
            while ((count!==0)&&(match=pat.exec(scan))) {
                var loc=match.index+off;
                // var absloc=loc+off;
                var start=get_text_pos(node,loc,0);
                var end=get_text_pos(node,loc+match[0].length,0);
                if ((!start)||(!end)) return false;
                var range=document.createRange();
                if (typeof start === "number") range.setStart(node,start);
                else if (start.atend) {
                    var txt=firstText(start.node.nextSibling);
                    if (txt) range.setStart(txt,0);
                    else range.setStart(start.node,start.off);}
                else range.setStart(start.node,start.off);
                if (typeof end === "number") range.setEnd(node,end);
                else range.setEnd(end.node,end.off);
                results.push(range);
                // off=match.index+match[0].length; scan=scan.slice(off);
                count--;} 
            return results;}
        fdjtDOM.findMatches=findMatches;

        function firstText(node){
            if (!(node)) return false;
            else if (node.nodeType===3) return node;
            else if (node.nodeType===1)
                return firstText(node.firstChild);
            else return false;}

        /* Paragraph hashes */

        // fdjtDOM.getParaHash=function(node){return paraHash(textify(node,true,false,false));};

        /* Getting transition event names */

        var transition_events=[
            'transitionend','webkitTransitionEnd',
            'mozTransitionEnd','oTransitionEnd',
            'msTransitionEnd'];

        function checkTransitionEvents(){
            var div = document.createElement('div');
            if (!(div.removeEventListener)) return;
            var handler = function(e) {
                fdjtDOM.transitionEnd = e.type;
                var i=0, lim=transition_events.length;
                while (i<lim) {
                    if ((div)&&(div.removeEventListener))
                        div.removeEventListener(
                            transition_events[i++],handler);
                    else i++;}};
            div.setAttribute("style","position:absolute;top:0px;transition:top 1ms ease;-webkit-transition:top 1ms ease;-moz-transition:top 1ms ease;-o-transition:top 1ms ease;-ms-transition:top 1ms ease;");
            var i=0, lim=transition_events.length;
            while (i<lim) div.addEventListener(
                transition_events[i++], handler, false);
            document.documentElement.appendChild(div);
            setTimeout(function() {
                div.style.top = '100px';
                setTimeout(function() {
                    div.parentNode.removeChild(div);
                    div = handler = null;},
                           2000);},
                       0);}
        fdjt.addInit(checkTransitionEvents,"checkTransitionEvents");

        /* Custom input types (number, date, email, url, etc) */

        var custom_input_types=
            ["email","number","range","tel","url",
             "datetime","datetime-local","date","time","week","month"];

        function setupCustomInputs(dom){
            if (!(dom)) dom=document.body;
            var input_elt=document.createElement("input");
            var i=0, ntypes=custom_input_types.length;
            while (i<ntypes) {
                var typename=custom_input_types[i++];
                try {input_elt.type=typename;} catch (err) {}
                if (input_elt.type===typename) {
                    var inputs=getChildren(
                        document.body,".fdjt"+typename+"input");
                    var j=0, lim=inputs.length;
                    while (j<lim) {
                        var input=inputs[j++];
                        if (input.tagName!=="INPUT") continue;
                        input.type=typename;}}}}
        fdjtDOM.setupCustomInputs=setupCustomInputs;
        fdjt.addInit(setupCustomInputs,"CustomInputs");
        fdjtDOM.text_types=
            /\b(text|email|number|range|tel|url|datetime|datetime-local|date|time|week|month)\b/i;

        /* Checking media types */
        function checkMedia(){
            var media="media";
            if (window.matchMedia) {
                var mm=window.matchMedia("handheld");
                if (mm.match) media=media+" handheld";
                mm=window.matchMedia("(max-width:500px)");
                if (mm.match) media=media+" narrow";
                mm=window.matchMedia("(min-width:1000px)");
                if (mm.match) media=media+" wide";
                mm=window.matchMedia("(-webkit-min-device-pixel-ratio:1.5),(-min-resolution:15dp)");
                if (mm.match) media=media+" hires";}
            fdjt.media=media;}
        fdjt.addInit(checkMedia,"matchMedia");

        function getMediaState(){
            return window.getComputedStyle(
                document.body,':before').content;}
        fdjt.getMediaState=getMediaState;

        /* Inserting text in an text field or textarea */
        function insertText(target,text,off){
            var pos=target.selectionStart;
            var current=target.value;
            if ((current)&&(typeof pos === "number")&&(pos>=0))
                target.value=current.slice(0,pos)+text+current.slice(pos);
            else target.value=text;
            if (typeof off === "number")
                target.selectionEnd=target.selectionStart=pos+off;}
        fdjtDOM.insertText=insertText;

        /* Meta schemas */

        fdjt.addInit(getMetaSchemas,"MetaSchemas");

        /* Run inits on load */
        if ((!(fdjt.noinit))||
            ((typeof _fdjt_init === 'undefined')||(!(_fdjt_init))))
            fdjtDOM.addListener(window,"load",fdjtDOM.init);
        
        /* Playing audio */

        function playAudio(id){
            var elt=document.getElementById(id);
            if ((elt)&&(elt.play)) {
                if (!(elt.paused)) {
                    elt.pause(); elt.currentTime=0.0;}
                elt.play();}}
        fdjtDOM.playAudio=playAudio;

        /* Tweaking images */

        function tweakImage(elt,tw,th) {
            var style=elt.style;
            style.maxHeight=style.minHeight="inherit";
            style.maxWidth=style.minWidth="inherit";
            // Get width and height again, with the constraints off
            //  This means that pagescaling trumps CSS constraints,
            //  but we'll accept that for now
            var w=elt.offsetWidth, h=elt.offsetHeight, sw=tw/w, sh=th/h;
            if (sw<sh) {
                style.width=Math.round(w*sw)+"px";
                style.height="auto";}
            else {
                style.height=Math.round(h*sh)+"px";
                style.width="auto";}}
        fdjtDOM.tweakImage=tweakImage;

        /* Blob/URL functions */

        function makeBlob(string,type){
            if ((typeof string === "string")&&
                (string.search("data:")===0)) {
                if (!(type)) {
                    var typeinfo=/data:([^;]+);/.exec(string);
                    if (typeinfo) type=(typeinfo[1]);}
                var elts=string.split(',');
                var byteString = atob(elts[1]);
                if (elts[0].indexOf('base64') >= 0)
                    byteString = atob(elts[1]);
                else
                    byteString = window.unescape(elts[1]);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);}
                return new Blob([ab], { type: type||'application' });}
            else return false;}
        fdjtString.makeBlob=makeBlob;

        function data2URL(datauri){
            if ((URL)&&(URL.createObjectURL)) 
                return URL.createObjectURL(makeBlob(datauri));
            else return datauri;}
        fdjtDOM.data2URL=data2URL;

        /* Tweaking fonts */

        function adjustWrapperFont(wrapper,delta,done,size,min,max,w,h,fudge,dolog){
            var rect=wrapper.getBoundingClientRect();
            var ow=rect.width, oh=rect.height, nw, nh, newsize;
            var wstyle=wrapper.style;
            if (typeof fudge!== "number") fudge=1;

            // These are cases where one dimension is on the edge but
            // the other dimension is inside the edge
            if ((ow<=w)&&(oh<=h)&&(oh>=(h-fudge))) return size;
            // We actually skip this case because increasing the font size
            //  might not increase the width if it forces a new line break
            // else if ((sh<=h)&&(sw<=w)&&(sw>=(w-fudge))) return size;

            // Figure out if we need to grow or shrink 
            if ((ow>w)||(oh>h)) delta=-delta;

            if (delta>0) wstyle.maxWidth=Math.floor(w)+"px";

            if (!(size)) {size=100; wstyle.fontSize=size+"%";}
            if (!(min)) min=20;
            if (!(max)) max=150;
            newsize=size+delta;
            wstyle.fontSize=newsize+"%";
            rect=wrapper.getBoundingClientRect(); nw=rect.width; nh=rect.height;
            while ((size>=min)&&(size<=max)&&
                   ((delta>0)?((nw<w)&&(nh<h)):((nw>w)||(nh>h)))) {
                size=newsize; newsize=newsize+delta;
                wstyle.fontSize=newsize+"%";
                if (dolog)
                    fdjtLog(
                        "Adjust %o to %dx%d %o: size=%d=%d+(%d), %dx%d => %dx%d",
                        wrapper.parentNode,w,h,wrapper,newsize,size,delta,
                        ow,oh,nw,nh);
                rect=wrapper.getBoundingClientRect();
                nw=rect.width; nh=rect.height;}
            wstyle.maxWidth='';
            if (delta>0) {
                wstyle.fontSize=size+"%";
                return size;}
            else return newsize;}
                
        function adjustFontSize(node,min_font,max_font,fudge){
            var h=node.offsetHeight, w=node.offsetWidth;
            var dolog=hasClass(node,"_fdjtlog");
            var node_display='';
            if ((h===0)||(w===0)) {
                // Do a little to make the element visible if it's not.
                node_display=node.style.display;
                node.style.display='initial';
                h=node.offsetHeight; w=node.offsetWidth;
                if ((h===0)||(w===0)) {
                    node.style.display=node_display;
                    return;}}
            else {}
            if ((h===0)||(w===0)) {
                node.style.display=node_display;
                return;}
            var wrapper=wrapChildren(node,"div.fdjtfontwrapper");
            var wstyle=wrapper.style, size=100;
            wstyle.boxSizing='border-box';
            wstyle.padding=wstyle.margin="0px";
            wstyle.fontSize=size+"%";
            wstyle.transitionProperty='none';
            wstyle.transitionDuration='0s';
            wstyle[fdjtDOM.transitionProperty]='none';
            wstyle[fdjtDOM.transitionDuration]='0s';
            wstyle.visibility='visible';
            wstyle.overflow='visible';
            if ((h===0)||(w===0)) {
                node.removeChild(wrapper);
                fdjtDOM.append(node,toArray(wrapper.childNodes));
                node.style.display=node_display;
                return;}
            var min=((min_font)||(node.getAttribute("data-minfont"))||(20));
            var max=((max_font)||(node.getAttribute("data-maxfont"))||(200));
            if (typeof fudge!=="number") fudge=node.getAttribute("data-fudge");
            if (typeof min === "string") min=parseFloat(min,10);
            if (typeof max === "string") max=parseFloat(max,10);
            if (typeof fudge === "string") fudge=parseInt(fudge,10);
            if (typeof fudge !== "number") fudge=2;
            wstyle.width=wstyle.height="100%";
            w=wrapper.offsetWidth; h=wrapper.offsetHeight;
            wstyle.width=wstyle.height="";
            size=adjustWrapperFont(
                wrapper,10,false,size,min,max,w,h,fudge,dolog);
            size=adjustWrapperFont(
                wrapper,5,false,size,min,max,w,h,fudge,dolog);
            size=adjustWrapperFont(
                wrapper,1,false,size,min,max,w,h,fudge,dolog);
            node.style.display=node_display;
            if (size===100) {
                if (dolog)
                    fdjtLog("No need to resize %o towards %dx%d",node,w,h);
                node.removeChild(wrapper);
                fdjtDOM.append(node,toArray(wrapper.childNodes));}
            else {
                wstyle.overflow=''; wstyle.width=''; wstyle.height='';
                if (dolog)
                    fdjtLog("Adjusted (%s) %o towards %dx%d, wrapper @ %d,%d",
                            wstyle.fontSize,node,w,h,
                            wrapper.scrollWidth,wrapper.scrollHeight);
                // We reset all of these
                wstyle.transitionProperty='';
                wstyle.transitionDuration='';
                wstyle[fdjtDOM.transitionProperty]='';
                wstyle[fdjtDOM.transitionDuration]='';
                var cwstyle=getStyle(wrapper);
                if (cwstyle[fdjtDOM.transitionProperty]) { 
                    wstyle.fontSize=''; wstyle.visibility='';
                    wstyle.fontSize=size+"%";}
                else wstyle.visibility='';}
            return size;}
        fdjtDOM.adjustFontSize=fdjtDOM.tweakFontSize=adjustFontSize;
        
        function resetFontSize(node){
            var wrapper=getFirstChild(node,".fdjtfontwrapper");
            if (wrapper) wrapper.style.fontSize="100%";}
        fdjtDOM.resetFontSize=resetFontSize;

        fdjtDOM.autofont=".fdjtadjustfont,.adjustfont";
        function adjustFonts(arg,top){
            var all=[];
            if (!(arg)) all=fdjtDOM.$(fdjtDOM.autofont);
            else if (typeof arg === "string") {
                if (document.getElementByID(arg)) 
                    all=[document.getElementByID(arg)];
                else {
                    fdjtDOM.autofont=fdjtDOM.autofont+","+arg;
                    all=fdjtDOM.$(arg);}}
            else if (arg.nodeType===1) {
                var sel=new Selector(fdjtDOM.autofont);
                if (sel.match(arg))
                    all=[arg];
                else all=fdjtDOM.getChildren(arg,fdjtDOM.autofont);}
            else all=fdjtDOM.$(fdjtDOM.autofont);
            var i=0, lim=all.length;
            if (lim) while (i<lim) adjustFontSize(all[i++]);
            else if (top) adjustFontSize(top);}
        fdjtDOM.tweakFont=fdjtDOM.tweakFonts=
            fdjtDOM.adjustFont=fdjtDOM.adjustFonts=adjustFonts;
        
        function adjustPositionedChildren(node){
            if ((!(node))||(node.nodeType!==1)) return;
            var style=getStyle(node);
            if ((node.childNodes)&&(node.childNodes.length)) {
                var children=node.childNodes; var i=0, lim=children.length;
                while (i<lim) {
                    var child=children[i++];
                    if (child.nodeType===1)
                        adjustPositionedChildren(child);}}
            if (((style.display==='block')||(style.display==='inline-block'))&&
                ((style.position==='absolute')||(style.position==='fixed')))
                adjustFontSize(node);}
        function adjustLayoutFonts(node){
            var marked=fdjtDOM.getChildren(node,fdjtDOM.autofont);
            var i=0, lim=marked.length;
            if (lim===0) adjustPositionedChildren(node);
            else while (i<lim) adjustFontSize(marked[i++]);}
        fdjtDOM.adjustLayoutFonts=adjustLayoutFonts;

        function autoAdjustFonts(){
            if (fdjtDOM.noautofontadjust) return;
            adjustFonts();
            fdjtDOM.addListener(window,"resize",adjustFonts);}

        fdjt.addInit(autoAdjustFonts,"adjustFonts");
        
        function addUXClasses(){
            var device=fdjt.device;
            var prefix=fdjt.cxprefix||"_";
            var html=document.documentElement;
            if (device.ios) addClass(html,prefix+"IOS");
            if (device.touch) addClass(html,prefix+"TOUCH");
            if (device.mouse) addClass(html,prefix+"MOUSE");
            if (device.android) addClass(html,prefix+"Android");}
        fdjtDOM.addUXClasses=addUXClasses;
        fdjtDOM.addUSClasses=addUXClasses;
        fdjtDOM.addCXClasses=addUXClasses;
        fdjt.addInit(addUXClasses,"AddUXClasses");

        function windowFocus(evt){
            evt=evt||window.event; addClass(document.body,"_FOCUS");}
        function windowBlur(evt){
            evt=evt||window.event; dropClass(document.body,"_FOCUS");}
        function trackPageFocus(){
            windowFocus(); // Could be iffy...
            addListener(window,"focus",windowFocus);
            addListener(window,"blur",windowBlur);}
        fdjt.addInit(trackPageFocus);

        fdjtDOM.trace_adjust=false;

        return fdjtDOM;
    })();

/* requestAnimationFrame polyfill */
(function() {
    "use strict";
    var lastTime = 0;
    var rAF=window.requestAnimationFrame;
    var cAF=window.cancelAnimationFrame;
    var vendors = ['webkit', 'moz','ms','o'];

    function fakeAnimationFrame(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(
            function() { callback(currTime + timeToCall); },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;}
    function cancelFakeAnimationFrame(id){clearTimeout(id);}

    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        rAF=rAF||window[vendors[x]+'RequestAnimationFrame'];
        cAF=cAF||window[vendors[x]+'CancelAnimationFrame']||
            window[vendors[x]+'CancelRequestAnimationFrame'];}

    if (!(rAF)) {
        rAF=fakeAnimationFrame;
        cAF=cancelFakeAnimationFrame;}

    fdjt.DOM.rAF=fdjt.DOM.requestAnimationFrame=rAF;
    fdjt.DOM.cAF=fdjt.DOM.cancelAnimationFrame=cAF;
}());

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/*
    http://www.JSON.org/json2.js
    2009-06-29

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/
/* jslint evil: true */
/* jshint unused: false */
/* global window: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if ((typeof window !== "undefined")&&(!(window.JSON))) window.JSON={};

(function () {

     "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

if (!(fdjt.JSON)) fdjt.JSON=JSON;

/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/refdb.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.
   
   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.
   
   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).
   
   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html
   
*/

/* global setTimeout, clearTimeout, Promise, window, idbModules */

fdjt.RefDB=(function(){
    "use strict";
    var fdjtState=fdjt.State;
    var fdjtTime=fdjt.Time;
    var fdjtAsync=fdjt.Async;
    var fdjtDOM=fdjt.DOM;
    var JSON=fdjt.JSON;
    var fdjtLog=fdjt.Log;
    var warn=fdjtLog.warn;

    var indexedDB=window.indexedDB||idbModules.indexedDB;
    
    var refdbs={}, all_refdbs=[], changed_dbs=[], aliases={};

    function RefDB(name,init){
        var db=this;
        if (refdbs[name]) {
            db=refdbs[name];
            if ((init)&&(db.init)) {
                if (db.xinits) db.xinits.push(init);
                else db.xinits=[init];}
            else if (init) db.init=init;
            else init={};}
        else if ((init)&&(init.aliases)&&(checkAliases(init.aliases))) {
            db=checkAliases(init.aliases);
            if (db.aliases.indexOf(db.name)>=0) db.name=name;
            if ((init)&&(db.init)) {
                if (db.xinits) db.xinits.push(init);
                else db.xinits=[init];}
            else if (init) db.init=init;
            else init={};}
        else {
            if (!(init)) init={};
            db.name=name; refdbs[name]=db; all_refdbs.push(db);
            db.aliases=[];
            db.complete=false; // Whether all valid refs are loaded
            db.refs={}; // Mapping _ids to refs (unique within the DB)
            db.altrefs={}; // Alternate unique IDs
            // An array of all references to this DB
            db.allrefs=[];
            // All loaded refs. This is used when declaring an onLoad
            //  method after some references have already been loaded
            db.loaded=[];
            // An array of changed references, together with the
            //  timestamp of the earliest change
            db.changes=[]; db.changed=false; 
            // Where to persist the data from this database
            db.storage=init.storage||false;
            // Whether _id fields for this database are globally unique
            db.absrefs=init.absrefs||false;
            // Whether _id fields for this database are OIDs (e.g. @xxx/xxx)
            db.oidrefs=init.oidrefs||false;
            // Handlers for loading refs from memory or network
            db.onload=[]; db.onloadnames={};
            // Rules to run when adding or dropping fields of references
            //  This doesn't happen on import, though.
            db.onadd={}; db.ondrop={}; 
            // This maps from field names to tables which map from
            //  keys to reference ids.
            db.indices={};}
        if (init.hasOwnProperty("absrefs")) db.absrefs=init.absrefs;
        if (init.aliases) {
            var aliases=init.aliases;
            var i=0, lim=aliases.length; while (i<lim) {
                var alias=aliases[i++];
                if (aliases[alias]) {
                    if (aliases[alias]!==db)
                        warn("Alias %s for %o already associated with %o",
                             alias,db,aliases[alias]);}
                else {
                    aliases[alias]=db;
                    db.aliases.push(alias);}}}
        if (init.onload) {
            var onload=init.onload;
            for (var methname in onload) {
                if (onload.hasOwnProperty(methname)) 
                    db.onLoad(onload[methname],methname);}}
        if (init.indices) {
            var index_specs=init.indices;
            var j=0, jlim=index_specs.length; while (j<jlim) {
                var ix=index_specs[j++];
                if (typeof ix !== "string") 
                    warn("Complex indices not yet handled!");
                else {
                    var index=this.indices[ix]=new ObjectMap();
                    index.fordb=db;}}}
        
        return db;}

    var REFINDEX=RefDB.REFINDEX=2;
    var REFLOAD=RefDB.REFLOAD=4;
    var REFSTRINGS=RefDB.REFSTRINGS=8;
    var default_flags=((REFINDEX)|(REFSTRINGS));

    function checkAliases(aliases){
        var i=0, lim=aliases.length;
        while (i<lim) {
            var alias=aliases[i++];
            var db=refdbs[alias];
            if (db) return db;}
        return false;}

    RefDB.open=function RefDBOpen(name,DBClass){
        if (!(DBClass)) DBClass=RefDB;
        return ((refdbs.hasOwnProperty(name))&&(refdbs[name]))||
            ((aliases.hasOwnProperty(name))&&(aliases[name]))||
            (new DBClass(name));};
    function refDBProbe(name){
        return ((refdbs.hasOwnProperty(name))&&(refdbs[name]))||
            ((aliases.hasOwnProperty(name))&&(aliases[name]))||
            false;}
    RefDB.probe=refDBProbe;
    RefDB.prototype.addAlias=function DBaddAlias(alias){
        if (aliases[alias]) {
            if (aliases[alias]!==this) 
                warn("Alias %s for %o already associated with %o",
                     alias,this,aliases[alias]);}
        else {
            aliases[alias]=this;
            this.aliases.push(alias);}};

    RefDB.prototype.toString=function (){
        return "RefDB("+this.name+")";};

    RefDB.prototype.ref=function DBref(id){
        if (typeof id !== "string") {
            if (id instanceof Ref) return id;
            else throw new Error("Not a reference");}
        else if ((id[0]===":")&&(id[1]==="@")) id=id.slice(1);
        var refs=this.refs;
        return ((refs.hasOwnProperty(id))&&(refs[id]))||
            ((this.refclass)&&(new (this.refclass)(id,this)))||
            (new Ref(id,this));};
    RefDB.prototype.probe=function DBprobe(id){
        if (typeof id !== "string") {
            if (id instanceof Ref) return id;
            else return false;}
        else if ((id[0]===":")&&(id[1]==="@")) id=id.slice(1);
        var refs=this.refs;
        return ((refs.hasOwnProperty(id))&&(refs[id]));};
    RefDB.prototype.drop=function DBdrop(refset){
        var count=0;
        var refs=this.refs; var altrefs=this.altrefs;
        if (!(id instanceof Array)) refset=[refset];
        var i=0, nrefs=refset.length; while (i<nrefs) {
            var ref=refset[i++]; var id;
            if (ref instanceof Ref) id=ref._id;
            else {id=ref; ref=this.probe(id);}
            if (!(ref)) continue; else count++;
            var aliases=ref.aliases;
            var pos=this.allrefs.indexOf(ref);
            if (pos>=0) this.allrefs.splice(pos,1);
            pos=this.changes.indexOf(ref);
            if (pos>=0) this.changes.splice(pos,1);
            pos=this.loaded.indexOf(ref);
            if (pos>=0) this.loaded.splice(pos,1);
            delete refs[id];
            if (this.storage instanceof Storage) {
                var storage=this.storage;
                var key="allids("+this.name+")";
                var allidsval=storage[key];
                var allids=((allidsval)&&(JSON.parse(allidsval)));
                var idpos=allids.indexOf(id);
                if (idpos>=0) {
                    allids.splice(idpos,1);
                    storage.setItem(key,JSON.stringify(allids));
                    storage.removeItem(id);}}
            if (aliases) {
                var j=0, jlim=aliases.length;
                while (j<jlim) {delete altrefs[aliases[j++]];}}}
        return count;};
    RefDB.prototype.clearOffline=function refDBclear(callback){
        if (!(this.storage)) return false;
        else if ((Storage)&&(this.storage instanceof Storage)) {
            var storage=this.storage;
            var key="allids("+this.name+")";
            var allids=this.storage[key];
            if (allids) allids=JSON.parse(allids);
            if (allids) {
                var i=0, lim=allids.length;
                while (i<lim) delete storage[allids[i++]];}
            delete storage[key];
            if (callback) setTimeout(callback,5);}
        else if (this.storage instanceof indexedDB) {
            // Not yet implemented
            return;}
        else return false;};

    RefDB.prototype.onLoad=function(method,name,noupdate){
        if ((name)&&(this.onloadnames[name])) {
            var cur=this.onloadnames[name];
            if (cur===method) return;
            var pos=this.onload.indexOf(cur);
            if (cur<0) {
                warn("Couldn't replace named onload method %s for <RefDB %s>",
                     name,this.name);
                return;}
            else {
                this.onload[pos]=method;}}
        else this.onload.push(method);
        if (name) this.onloadnames[name]=method;
        if (!(noupdate)) {
            var loaded=[].concat(this.loaded);
            fdjtAsync.slowmap(method,loaded);}};

    RefDB.prototype.onAdd=function(name,method){
        this.onadd[name]=method;};

    RefDB.prototype.onDrop=function(name,method){
        this.ondrop[name]=method;};
    
    var refpat=/^(((:|)@(([0-9a-fA-F]+\/[0-9a-fA-F]+)|(\/\w+\/.*)|(@\d+\/.*)))|((U|#U|:#U|)[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})|((U|#U|:#U|)[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}t[0-9a-zA-Z]+)|([^@]+@.+))$/;
    
    var getLocal=fdjtState.getLocal;

    function resolveRef(arg,db,DBType,force){
        if (typeof DBType !== "function") DBType=RefDB;
        if (!(arg)) return arg;
        else if (arg instanceof Ref) return arg;
        else if ((typeof arg === "object")&&(arg.id))
            return object2ref(arg,db);
        else if ((db)&&(db.refs.hasOwnProperty(arg)))
            return db.refs[arg];
        // The case above catches direct references inline; the
        // case below does a function call (probe) and catches
        // aliases
        else if ((db)&&(db.probe(arg))) return db.probe(arg);
        else if ((typeof arg === "string")&&(refpat.exec(arg))) {
            var at=arg.indexOf('@');
            if ((at===1)&&(arg[0]===':')) {arg=arg.slice(1); at=0;}
            if (at>0) {
                // this is the term@domain form
                var usedb=false, dbname=arg.slice(at+1), origin;
                if ((usedb=refDBProbe(dbname))) {}
                else if (refpat.exec(dbname)) {
                    origin=resolveRef(dbname);
                    if (origin) force=true;
                    else dbname=arg.slice(at+1);}
                else dbname=arg.slice(at+1);
                if ((db)&&(db.name===dbname)) usedb=db;
                else usedb=refDBProbe(dbname);
                arg=arg.slice(0,at);
                if (usedb) db=usedb;
                else if (force) {
                    warn("Creating forced RefDB domain %s for reference %s",dbname,arg);
                    db=RefDB.open(dbname,DBType);}
                else db=refDBProbe(dbname);
                if ((db)&&(origin)) {
                    db.origin=origin;
                    if (origin.name) db.fullname=origin.name;}
                arg=arg.slice(0,at);}
            else if (at<0) {
                var uuid;
                if (arg.search(":#U")===0) uuid=arg.slice(3);
                else if (arg.search("#U")===0) uuid=arg.slice(2);
                else if (arg.search("U")===0) uuid=arg.slice(1);
                else uuid=arg;
                var type=uuid.indexOf('t'), tail=arg.length-2;
                if (type>0) type="UUID"+uuid.slice(type); else type=false;
                if (tail>0) tail="-UUIDTYPE="+uuid.slice(tail);
                else tail=false;
                var known_db=((type)&&(refdbs[type]||aliases[type]))||
                    ((tail)&&(refdbs[tail]||aliases[tail]));
                if (known_db) db=known_db;
                else if ((force)&&(type)&&(DBType)) {
                    warn("Creating forced RefDB domain %s for reference %s",type,arg);
                    db=new DBType(type);
                    if (type) db.addAlias(type);}
                else {}}
            else if (arg[1]==='@') {
                // This is for local references
                var idstart=arg.indexOf('/');
                var atid=arg.slice(0,idstart);
                var atdb=aliases[atid];
                if (atdb) db=atdb;
                else {
                    var domain=getLocal(arg.slice(0,idstart),true);
                    if (domain) {
                        db=new RefDB(domain,{aliases: [atid]});}
                    else {
                        warn("Can't find domain for atid %s when resolving %s",atid,arg);
                        db=false;}}}
            else {
                var atprefix, slash;
                // Find the slash before the ID
                if (arg[1]==='/') {
                    slash=arg.slice(2).indexOf('/');
                    if (slash>0) slash=slash+2;}
                else slash=arg.indexOf('/');
                atprefix=arg.slice(at,slash+1);
                db=refdbs[atprefix]||aliases[atprefix]||
                    ((DBType)&&(new DBType(atprefix)));}}
        else {}
        if (!(db)) return false;
        if (db.refs.hasOwnProperty(arg)) return (db.refs[arg]);
        else if (force) return db.ref(arg);
        else return false;}
    RefDB.resolve=resolveRef;
    RefDB.ref=resolveRef;

    function Ref(id,db,instance){
        // Just called for the prototype
        if (arguments.length===0) return this;
        var at=id.indexOf('@');
        if ((at>1)&&(id[at-1]!=='\\')) {
            var domain=id.slice(at+1);
            if ((domain!==db.name)&&
                (db.aliases.indexOf(domain)<0))
                warn("Reference to %s being handled by %s",id,db);
            id=id.slice(0,at);}
        if (db.refs.hasOwnProperty(id)) return db.refs[id];
        else if (instance) {
            instance._id=id; instance._db=db;
            if (!(db.absrefs)) instance._domain=db.name;
            db.refs[id]=instance;
            db.allrefs.push(instance);
            return instance;}
        else if ((db.refclass)&&(!(this instanceof db.refclass)))
            return new (db.refclass)(id,db);
        else {
            this._id=id; this._db=db;
            if (!(db.absrefs)) this._domain=db.name;
            db.refs[id]=this;
            db.allrefs.push(this);
            return this;}}
    fdjt.Ref=RefDB.Ref=Ref;

    Ref.prototype.toString=function(){
        if (this._qid) return this._qid;
        else if (this._domain)
            return this._id+"@"+this._domain;
        else if (this._db.absrefs) return this._id;
        else return this._id+"@"+this._db.name;};
    Ref.prototype.getQID=function getQID(){
        var qid;
        if (this._qid) return this._qid;
        else if (this._domain) 
            qid=this._qid=(this._id+"@"+this._domain);
        else if (this._db.absrefs) 
            qid=this._qid=this._id;
        else {
            qid=this._qid=(this._id+"@"+this._db.name);}
        return qid;};

    Ref.prototype.addAlias=function addRefAlias(term){
        var refs=this._db.refs;
        if (refs.hasOwnProperty(term)) {
            if (refs[term]===this) return false;
            else throw {error: "Ref alias conflict"};}
        else if (this._db.altrefs.hasOwnProperty(term)) {
            if (this._db.altrefs[term]===this) return false;
            else throw {error: "Ref alias conflict"};}
        else {
            this._db.altrefs[term]=this;
            return true;}};

    function object2ref(value,db,dbtype) {
        var ref, dbref=false; 
        if (value._domain)
            dbref=RefDB.probe(value._domain)||(new RefDB(value._domain));
        if (dbref) ref=dbref.ref(value._id);
        else ref=RefDB.resolve(value._id,db,(dbtype||RefDB),true);
        return ref;}

    Ref.prototype.Import=function refImport(data,rules,flags){
        var db=this._db; var live=this._live;
        var indices=db.indices; var onload=db.onload;
        var onadd=((live)&&(db.onadd)), ondrop=((live)&&(db.ondrop));
        var aliases=data.aliases;
        if (typeof flags === "undefined") flags=default_flags;
        if (typeof rules === "undefined")
            rules=this.import_rules||db.import_rules;
        var indexing=(((flags)&(REFINDEX))!==0);
        var loading=(((flags)&(REFLOAD))!==0);
        var refstrings=(((flags)&(REFSTRINGS))!==0);
        if (aliases) {
            var ai=0, alim=aliases.length; while (ai<alim) {
                var alias=aliases[ai++];
                var cur=((db.refs.hasOwnProperty(alias))&&
                         (db.refs[alias]))||
                    ((db.altrefs.hasOwnProperty(alias))&&
                     (db.altrefs[alias]));
                if ((cur)&&(cur!==this))
                    warn("Ambiguous ref %s in %s refers to both %o and %o",
                         alias,db,cur.name,this.name);
                else aliases[alias]=this;}}
        var now=fdjtTime();
        if ((loading)&&(!(this._live))) this._live=now;
        for (var key in data) {
            if ((key==="aliases")||(key==="_id")) {}
            else if (data.hasOwnProperty(key)) {
                var value=data[key]; var rule=((rules)&&(rules[key]));
                if (typeof value !== "undefined") {
                    if (rule) value=(rule)(this,key,value,data,indexing);
                    value=importValue(value,db,refstrings);}
                var oldval=((live)&&(this[key]));
                this[key]=value;
                if (oldval) {
                    var drops=difference(oldval,value||[]);
                    var adds=((value)?(difference(value,oldval)):([]));
                    if ((indexing)&&(indices[key])) { 
                        if (adds.length)
                            this.indexRef(key,adds,indices[key],db);
                        if (drops.length)
                            this.dropIndexRef(key,drops,indices[key],db);}
                    if ((adds.length)&&(onadd[key])) {
                        var addfn=onadd[key];
                        var addi=0, addlen=adds.length;
                        while (addi<addlen) {
                            addfn(adds[addi++]);}}
                    if ((drops.length)&&(ondrop[key])) {
                        var dropfn=ondrop[key];
                        var dropi=0, droplen=drops.length;
                        while (dropi<droplen) {
                            dropfn(drops[dropi++]);}}}
                else if ((value)&&(indexing)&&(indices[key])) 
                    this.indexRef(key,value,indices[key],db);}}
        // These are run-once inits loaded on initial import
        if (loading) {
            // Run the db-specific inits for each reference
            if (onload) {
                var i=0, lim=onload.length; while (i<lim) {
                    var loadfn=onload[i++];
                    loadfn(this,now);}}
            // Run per-instance delayed inits
            if (this._onload) {
                var onloads=this._onload, inits=onloads.fns;
                var j=0, jlim=inits.length; while (j<jlim) {
                    inits[j++](this,now);}
                delete this._onload;}}
        // Record a change if we're not loading and not already changed.
        if ((!(loading))&&(!(this._changed))) {
            this._changed=now;
            db.changes.push(this);
            if (!(db.changed)) {
                db.changed=now; db.changes.push(db);}}};
    function importValue(value,db,refstrings){
        if ((typeof value === "undefined")||
            (typeof value === "number")||
            (value=== null))
            return value;
        else if (value instanceof Ref) return value;
        else if (value instanceof Array) {
            var i=0, lim=value.length; var copied=false;
            while (i<lim) {
                var v=value[i++], nv=v;
                if (v===null) nv=undefined;
                else if (v instanceof Ref) nv=v;
                else if ((typeof v === "object")&&(v._id)) {
                    var ref=object2ref(v,db);
                    if (ref) {
                        for (var slot in v) {
                            if ((v.hasOwnProperty(slot))&&
                                (slot!=="_id")&&(slot!=="_db"))
                                ref[slot]=importValue(v[slot],db,refstrings);}
                        nv=ref;}}
                else if ((refstrings)&&(typeof v === "string")&&
                         (refpat.exec(v))) {
                    nv=resolveRef(v,db)||v;}
                if (typeof nv === "undefined") {
                    if (!(copied)) copied=value.slice(0,i-1);}
                else if (copied) copied.push(nv);
                else if (nv!==v) {
                    copied=value.slice(0,i-1);
                    copied.push(nv);}
                else {}}
            if (copied) return copied; else return value;}
        else if ((typeof value === "object")&&(value._id)) {
            var refv=object2ref(value,db);
            for (var vslot in value) {
                if ((value.hasOwnProperty(vslot))&&
                    (vslot!=="_id")&&(vslot!=="_db"))
                    refv[vslot]=importValue(value[vslot],db,refstrings);}
            return refv;}
        else if ((refstrings)&&(typeof value === "string")&&
                 (refpat.exec(value)))
            return resolveRef(value,db)||value;
        else return value;}
    Ref.prototype.importValue=function(value,refstrings){
        return importValue(this._db,value,refstrings);};
    RefDB.prototype.importValue=function(val,refstrings){
        return importValue(val,this,refstrings);};
    function defImport(item,refs,db,rules,flags){
        var ref=resolveRef(item._id,item._domain||db,
                           db.constructor,true);
        if (!(ref)) warn("Couldn't resolve database for %o",item._id);
        else {
            refs.push(ref);
            ref.Import(item,rules||false,flags);}}

    RefDB.prototype.Import=function refDBImport(data,rules,flags,callback){
        var refs=[]; var db=this;
        if (!(data instanceof Array)) {
            defImport(data,refs,db,rules,flags);
            if (callback) {
                if (callback.call) 
                    setTimeout(function(){callback(refs[0]);});
                return refs[0];}
            else return refs[0];}
        if ((!(callback))||(data.length<=7)) {
            var i=0, lim=data.length; while (i<lim) {
                defImport(data[i++],refs,db,rules,flags);}
            if ((callback)&&(callback.call)) 
                setTimeout(function(){callback(refs);},10);
            return refs;}
        else if (!(callback.call))
            fdjtAsync.slowmap(function(item){
                defImport(item,refs,db,rules,flags);},data);
        else fdjtAsync.slowmap(function(item){
            defImport(item,refs,db,rules,flags);},
                               data,
                               {done: function(){callback(refs);}});};

    Ref.prototype.onLoad=function(fn,name){
        if (this._live) fn(this);
        else if (this._onload) {
            if (this._onload[name]) return;
            if (name) this._onload[name]=fn;
            this._onload.fns.push(fn);}
        else {
            this._onload={fns:[fn]};
            if (name) this._onload[name]=fn;}};
    
    Ref.Export=Ref.prototype.Export=function refExport(xforms){
        var db=this._id;
        var exported={_id: this._id};
        if (!(xforms)) xforms=this.export_rules||db.export_rules;
        if (!(db.absrefs)) this._domain=db.name;
        for (var key in this) {
            if (key[0]==="_") continue;
            else if (this.hasOwnProperty(key)) {
                var value=this[key];
                var xform=((xforms)&&(xforms[key]));
                if (xform) value=xform(value,key,exported);
                if (typeof value === "undefined") {}
                else if ((typeof value === "number")||
                         (typeof value === "string"))
                    exported[key]=value;
                else if (value instanceof Ref) {
                    if (value._db.absrefs)
                        exported[key]={_id: value._id};
                    else exported[key]={
                        _id: value._id,
                        _domain: value._domain||value._db.name};}
                else exported[key]=exportValue(value,this._db);}}
        return exported;};

    function exportValue(value,db){
        if (value instanceof Ref) {
            if (value._db===db) return {_id: value._id};
            else if (value._db.absrefs) return {_id: value._id};
            else return {
                _id: value._id,
                _domain: value._domain||value._db.name};}
        else if (value instanceof Array) {
            var i=0, lim=value.length; var exports=false;
            while (i<lim) {
                var elt=value[i++];
                var exported=exportValue(elt,db);
                if (elt!==exported) {
                    if (exports) exports.push(exported);
                    else {
                        exports=value.slice(0,i-1);
                        exports.push(exported);}}
                else if (exports) exports.push(elt);
                else {}}
            return exports||value;}
        else if (typeof value === "object") {
            var copied=false, fields=[];
            for (var field in value) {
                if (value.hasOwnProperty(field)) {
                    var fieldval=value[field];
                    var exportval=exportValue(fieldval,db);
                    if (fieldval!==exportval) {
                        if (!(copied)) {
                            copied={};
                            if (fields.length) {
                                var j=0, jlim=fields.length;
                                while (j<jlim) {
                                    var f=fields[j++];
                                    copied[f]=value[f];}}}
                        copied[field]=exportval;}
                    else if (copied) copied[field]=fieldval;
                    else fields.push(field);}}
            return copied||value;}
        else return value;}
    Ref.exportValue=exportValue;
    RefDB.prototype.exportValue=function(val){
        return exportValue(val,this);};
    
    RefDB.prototype.load=function loadRefs(refs,callback,args){
        function docallback(){
            if (callback) {
                if (args) callback.apply(null,args);
                else callback();}}
        function load_ref(arg,loaded,storage){
            var ref=arg, content;
            if (typeof ref === "string")
                ref=db.ref(ref,false,true);
            if (!(ref)) {
                warn("Couldn't resolve ref to %s",arg);
                return;}
            else if (ref._live) return;
            loaded.push(ref);
            if (absrefs) content=storage[ref._id];
            else if (atid)
                content=storage[atid+"("+ref._id+")"];
            else {
                if (db.atid) atid=db.atid;
                else atid=db.atid=getatid(storage,db);
                content=storage[atid+"("+ref._id+")"];}
            if (!(content))
                warn("No item stored for %s",ref._id);
            else ref.Import(
                JSON.parse(content),false,REFLOAD|REFINDEX);}
        if (!(this.storage)) return;
        else if (this.storage instanceof Storage) {
            if (!(refs)) refs=[].concat(this.allrefs);
            else if (refs===true) {
                var all=this.storage["allids("+this.name+")"];
                if (all) refs=JSON.parse(all).concat(this.allrefs);
                else refs=[].concat(this.allrefs);}
            else if (refs instanceof Ref) refs=[refs];
            else if (typeof refs === "string") refs=[refs];
            else if (typeof refs.length === "undefined") refs=[refs];
            else {}
            var storage=this.storage; var loaded=this.loaded;
            var db=this, absrefs=this.absrefs, refmap=this.refs;
            var atid=false; var needrefs=[];
            var i=0, lim=refs.length; while (i<lim) {
                var refid=refs[i++], ref=refid;
                if (typeof refid === "string") ref=refmap[refid];
                if (!((ref instanceof Ref)&&(ref._live)))
                    needrefs.push(refid);}
            if (needrefs.length) {
                var opts=((!(callback))?(false):
                          (args)?{done: docallback}:{done: callback});
                return fdjtAsync.slowmap(
                    function(arg){load_ref(arg,loaded,storage);},
                    needrefs,opts);}
            else {
                docallback();
                return new Promise(function(resolve){
                    resolve(refs);});}}
        else if (this.storage instanceof indexedDB) {
            // Not yet implemented
            return;}
        else {}};
    RefDB.prototype.load=function loadRefs(refs){
        if (this.storage instanceof Storage) 
            return this.loadFromStorage(refs);
        else return false;};
    RefDB.prototype.loadFromStorage=function loadFromStorage(refs){
        var db=this, storage=this.storage, loaded=this.loaded;
        var atid=(db.atid)||(db.atid=getatid(storage,db));
        var needrefs=[], refmap=db.refs, absrefs=db.absrefs;
        function storage_loader(arg,loaded){
            var ref=arg, content;
            if (typeof ref === "string") ref=db.ref(ref,false,true);
            if (!(ref)) {warn("Couldn't resolve ref to %s",arg); return;}
            else if (ref._live) return;
            else {}
            if (absrefs) content=storage[ref._id];
            else if (atid) content=storage[atid+"("+ref._id+")"];
            else content=storage[atid+"("+ref._id+")"];
            if (content) {
                loaded.push(ref);
                ref.Import(JSON.parse(content),false,REFLOAD|REFINDEX);}}
        if (!(refs)) refs=[].concat(db.allrefs);
        else if (refs===true) {
            var all=storage["allids("+db.name+")"]||"[]";
            refs=JSON.parse(all).concat(db.allrefs);}
        else if (!(Array.isArray(refs))) refs=[refs];
        else {}
        var i=0, lim=refs.length; while (i<lim) {
            var refid=refs[i++], ref=refid;
            if (typeof refid === "string") ref=refmap[refid];
            if (!((ref instanceof Ref)&&(ref._live)))
                needrefs.push(refid);}
        if (needrefs.length)
            return fdjtAsync.slowmap(
                function(arg){storage_loader(arg,loaded,storage);},
                needrefs);
        else return new Promise(function(resolve){
            var resolved=[]; var i=0, lim=refs.length;
            while (i<lim) {
                var refid=refs[i++];
                if (typeof ref==="string")
                    ref=refmap[refid]; else ref=refid;
                resolved.push(ref);}
            return resolve(resolved);});};

    RefDB.prototype.loadref=function loadRef(ref){
        if (typeof ref === "string") ref=this.ref(ref);
        return ref.load();};
    Ref.prototype.load=function loadRef() {
        var ref=this, db=this._db;
        function loadref(resolve){
            if (ref._live) return resolve(ref);
            else db.load(ref).then(function(){resolve(ref);});}
        return new Promise(loadref);};

    // This does a resolve and load for various refs
    RefDB.load=function RefDBload(spec,dbtype,callback,args){
        if (typeof spec === "string") {
            var ref=RefDB.resolve(spec,false,(dbtype||RefDB),true);
            if (ref) return ref.load(callback,args);
            else throw {error: "Couldn't resolve "+spec};}
        else if (spec instanceof Ref)
            return spec.load(callback,args);
        else if (spec instanceof Array) {
            var loads={}, dbs=[]; var i=0, lim=spec.length;
            while (i<lim) {
                var s=spec[i++]; var r=false;
                if (typeof s === "string")
                    r=RefDB.resolve(s,false,dbtype||RefDB,true);
                else if (s instanceof Ref) r=s;
                if (!(r)||(r._live)) continue;
                var db=r._db, name=db.name;
                if (loads[name]) loads[name].push(r);
                else {
                    loads[name]=[r];
                    dbs.push(db);}}
            i=0; lim=dbs.length; while (i<lim) {
                var loadfrom=dbs[i++];
                loadfrom.load(loads[loadfrom.name],args);}
            return loads;}
        else return false;};
    
    RefDB.prototype.saveToStorage=function(refs,updatechanges){
        var db=this, storage=this.storage;
        var atid=this.atid; var ids=[];
        function savingLocally(resolve){
            var i=0, lim=refs.length; while (i<lim) {
                var ref=refs[i++];
                if (typeof ref === "string") ref=db.ref(ref);
                if (!(ref._live)) continue;
                if ((ref._saved)&&(!(ref._changed))) continue;
                var exported=ref.Export();
                exported._saved=fdjtTime.tick();
                if (db.absrefs) {
                    ids.push(ref._id);
                    storage.setItem(ref._id,JSON.stringify(exported));}
                else {
                    if (atid) {}
                    else if (ref.atid) atid=ref.atid;
                    else atid=ref.atid=getatid(storage,ref);
                    var id=atid+"("+ref._id+")"; ids.push(id);
                    storage.setItem(id,JSON.stringify(exported));}
                ref._changed=false;}
            if (updatechanges) {
                var changes=db.changes, new_changes=[];
                var j=0, n_changed=changes.length;
                while (j<n_changed) {
                    var c=changes[j++];
                    if (c._changed) new_changes.push(c);}
                db.changes=new_changes;
                if (new_changes.length===0) {
                    db.changed=false;
                    var pos=changed_dbs.indexOf(db);
                    if (pos>=0) changed_dbs.splice(pos,1);}}
            var allids=storage["allids("+db.name+")"];
            if (allids) allids=JSON.parse(allids); else allids=[];
            var n=allids.length;
            allids=merge(allids,ids);
            if (allids.length!==n) 
                storage.setItem("allids("+db.name+")",
                                JSON.stringify(allids));
            if (resolve) fdjt.ASync(resolve);}
        return new Promise(savingLocally);};
    
    RefDB.prototype.save=function saveRefs(refs,updatechanges){
        var db=this, storage=this.storage;
        if (refs===true) refs=this.allrefs;
        else if (!(refs)) refs=this.changes;
        else {}
        function saving(resolve){
            if (db.storage instanceof Storage)
                db.saveToStorage(refs,updatechanges).then(function(){
                    db.changed=false;
                    db.changes=[];
                    var pos=changed_dbs.indexOf(db);
                    if (pos>=0) changed_dbs.splice(pos,1);
                    if (resolve) resolve();});
            else if (db.storage instanceof indexedDB) {}
            else return resolve();}
        if (!(storage)) return false;
        else return new Promise(saving);};
    Ref.prototype.save=function(){
        var ref=this, db=this._db;
        function saveref(resolve){
            if (!(ref._changed)) return resolve(ref);
            else return db.save([ref]).then(function(){
                resolve(ref);});}
        return new Promise(saveref);};

    function getatid(storage,db){
        if (db.atid) return db.atid;
        var atid=storage["atid("+db.name+")"];
        if (atid) {
            db.atid=atid;
            return atid;}
        else {
            var count=storage["atid.count"];
            if (!(count)) {
                atid=count=1; storage["atid.count"]="2";}
            else {
                count=parseInt(count,10);
                atid=db.atid="@@"+count;
                storage["atid("+db.name+")"]=atid;
                storage["atid.count"]=count+1;}
            return atid;}}
    
    function getKeyString(val,db){
        if (val instanceof Ref) {
            if (val._db===db) return "@"+val._id;
            else if (val._domain) return "@"+val._id+"@"+val._domain;
            else return "@"+val._id;}
        else if (typeof val === "number") 
            return "#"+val;
        else if (typeof val === "string")
            return "\""+val;
        else if (val.toJSON)
            return "{"+val.toJSON();
        else return "&"+val.toString();}
    RefDB.getKeyString=getKeyString;
    
    Ref.prototype.indexRef=function indexRef(key,val,index,db){
        var keystrings=[]; var rdb=this._db;
        var refstring=
            (((!(db))||(rdb===db)||(rdb.absrefs))?(this._id):
             ((this._qid)||((this.getQID)&&(this.getQID()))));
        if (!(db)) db=rdb;
        var indices=db.indices;
        if (!(index))
            index=((indices.hasOwnProperty(key))&&(indices[key]));
        if (!(index)) {
            warn("No index on %s for %o in %o",key,this,db);
            return false;}
        if (val instanceof Ref) {
            if (rdb===val._db) keystrings=["@"+val._id];
            else keystrings=["@"+(val._qid||val.getQID())];}
        else if (val instanceof Array) {
            db=this._db;
            var i=0, lim=val.length; while (i<lim) {
                var elt=val[i++];
                if (elt instanceof Ref)
                    keystrings.push("@"+(elt._qid||elt.getQID()));
                else if (typeof elt === "number") 
                    keystrings=["#"+elt];
                else if (typeof elt === "string")
                    keystrings=["\""+elt];
                else if (elt._qid)
                    keystrings.push("@"+(elt._qid||elt.getQID()));
                else if (elt.getQID)
                    keystrings.push("@"+(elt.getQID()));
                else {}}}
        else if (typeof val === "number") 
            keystrings=["#"+val];
        else if (typeof val === "string")
            keystrings=["\""+val];
        else keystrings=["?"+val.toString()];
        if (keystrings.length) {
            var j=0, jlim=keystrings.length; while (j<jlim) {
                var keystring=keystrings[j++];
                var refs=index[keystring];
                if (refs) refs.push(refstring);
                else index[keystring]=[refstring];}
            return keystrings.length;}
        else return false;};
    Ref.prototype.dropIndexRef=function dropIndexRef(key,val,index,db){
        if (!(db)) db=this._db;
        if (!(index)) index=db.indices[key];
        if (!(index)) return false;
        var keystrings=[];
        if (val instanceof Ref) {
            if (this._db===val._db) keystrings=["@"+val._id];
            else keystrings=["@"+(val._qid||val.getQID())];}
        else if (val instanceof Array) {
            var i=0, lim=val.length; while (i<lim) {
                var elt=val[i++];
                if (elt instanceof Ref) 
                    keystrings.push("@"+(elt._qid||elt.getQID()));
                else if (typeof elt === "number") 
                    keystrings=["#"+val];
                else if (typeof elt === "string")
                    keystrings=["\""+val];
                else if (elt._qid)
                    keystrings.push("@"+(elt._qid||elt.getQID()));
                else if (elt.getQID)
                    keystrings.push("@"+(elt.getQID()));
                else {}}}
        else if (typeof val === "number") 
            keystrings=["#"+val];
        else if (typeof val === "string")
            keystrings=["\""+val];
        else {}
        if (keystrings.length) {
            var deleted=0;
            var j=0, jlim=keystrings.length; while (j<jlim) {
                var keystring=keystrings[j++]; var refs=index[keystring];
                if (!(refs)) continue;
                var pos=refs.indexOf(this._id);
                if (pos<0) continue;
                else refs.splice(pos,1);
                if (refs.length===0) delete index[keystring];
                deleted++;}
            return deleted;}
        else return false;};

    RefDB.prototype.find=function findIDs(key,value){
        var index=this.indices[key];
        if (index) {
            var items=index.getItem(value,this);
            if (items) return setify(items);
            else return [];}
        else return [];};
    RefDB.prototype.findRefs=function findRefs(key,value){
        var index=this.indices[key];
        if (index) {
            var items=index.getItem(value,this), results=[];
            if (items) {
                var i=0, lim=items.length;
                while (i<lim) {
                    var item=items[i++];
                    if (!(item)) {}
                    else if (typeof item === "string") {
                        var ref=this.probe(item);
                        if (ref) results.push(ref);}
                    else results.push(item);}}
            return fdjtSet(results);}
        else return [];};
    RefDB.prototype.count=function countRefs(key,value){
        var index=this.indices[key];
        if (index) {
            var vals=index.getItem(value,this);
            return ((vals)?(vals.length||0):(0));}
        else return 0;};
    RefDB.prototype.addIndex=function addIndex(key,Constructor){
        if (!(Constructor)) Constructor=ObjectMap;
        if (!(this.indices.hasOwnProperty(key))) {
            var index=this.indices[key]=new Constructor();
            index.fordb=this;
            return index;}
        else return this.indices[key];};
    
    // Array utility functions
    function arr_contains(arr,val,start){
        return (arr.indexOf(val,start||0)>=0);}
    function arr_position(arr,val,start){
        return arr.indexOf(val,start||0);}

    var id_counter=1;

    /* Fast sets */
    function set_sortfn(a,b) {
        if (a===b) return 0;
        else if (typeof a === typeof b) {
            if (typeof a === "number")
                return a-b;
            else if (typeof a === "string") {
                if (a<b) return -1;
                else return 1;}
            else if (a._qid) {
                if (b._qid) {
                    if (a._qid<b._qid) return -1;
                    else return 1;}
                else return -1;}
            else if (b._qid) return 1;
            else if ((a._fdjtid)&&(b._fdjtid)) {
                if ((a._fdjtid)<(b._fdjtid)) return -1;
                else return 1;}
            else return 0;}
        else if (typeof a < typeof b) return -1;
        else return 1;}
    RefDB.compare=set_sortfn;

    function intersection(set1,set2){
        if (typeof set1 === 'string') set1=[set1];
        if (typeof set2 === 'string') set2=[set2];
        if ((!(set1))||(set1.length===0)) return [];
        if ((!(set2))||(set2.length===0)) return [];
        if (set1._sortlen!==set1.length) set1=fdjtSet(set1);
        if (set2._sortlen!==set2.length) set2=fdjtSet(set2);
        var results=[];
        var i=0; var j=0; var len1=set1.length; var len2=set2.length;
        var allstrings=set1._allstrings&&set2._allstrings;
        var new_allstrings=true;
        while ((i<len1) && (j<len2))
            if (set1[i]===set2[j]) {
                if ((new_allstrings)&&(typeof set1[i] !== 'string'))
                    new_allstrings=false;
                results.push(set1[i]);
                i++; j++;}
        else if ((allstrings)?
                 (set1[i]<set2[j]):
                 (set_sortfn(set1[i],set2[j])<0)) i++;
        else j++;
        results._allstrings=new_allstrings;
        results._sortlen=results.length;
        return results;}
    RefDB.intersection=intersection;

    function difference(set1,set2){
        if (typeof set1 === 'string') set1=[set1];
        if (typeof set2 === 'string') set2=[set2];
        if ((!(set1))||(set1.length===0)) return [];
        if ((!(set2))||(set2.length===0)) return set1;
        if (set1._sortlen!==set1.length) set1=fdjtSet(set1);
        if (set2._sortlen!==set2.length) set2=fdjtSet(set2);
        var results=[];
        var i=0; var j=0; var len1=set1.length; var len2=set2.length;
        var allstrings=set1._allstrings&&set2._allstrings;
        var new_allstrings=true;
        while ((i<len1) && (j<len2)) {
            if (set1[i]===set2[j]) {
                i++; j++;}
            else if ((allstrings)?
                     (set1[i]<set2[j]):
                     (set_sortfn(set1[i],set2[j])<0)) {
                if ((new_allstrings)&&(typeof set1[i] !== 'string'))
                    new_allstrings=false;
                results.push(set1[i]);
                i++;}
            else j++;}
        if ((!(new_allstrings))||(set1._allstrings)) 
            results=results.concat(set1.slice(i));
        else while (i<len1) {
            var elt=set1[i++];
            if ((new_allstrings)&&(typeof elt !== "string"))
                new_allstrings=false;
            results.push(elt);}
        results._allstrings=new_allstrings;
        results._sortlen=results.length;
        return results;}
    RefDB.difference=difference;
    
    function union(set1,set2){
        if (typeof set1 === 'string') set1=[set1];
        if (typeof set2 === 'string') set2=[set2];
        if ((!(set1))||(set1.length===0)) return set2;
        if ((!(set2))||(set2.length===0)) return set1;
        if (set1._sortlen!==set1.length) set1=fdjtSet(set1);
        if (set2._sortlen!==set2.length) set2=fdjtSet(set2);
        var results=[];
        var i=0; var j=0; var len1=set1.length; var len2=set2.length;
        var allstrings=set1._allstrings&&set2._allstrings;
        while ((i<len1) && (j<len2))
            if (set1[i]===set2[j]) {
                results.push(set1[i]); i++; j++;}
        else if ((allstrings)?
                 (set1[i]<set2[j]):
                 (set_sortfn(set1[i],set2[j])<0))
            results.push(set1[i++]);
        else results.push(set2[j++]);
        while (i<len1) results.push(set1[i++]);
        while (j<len2) results.push(set2[j++]);
        results._allstrings=allstrings;
        results._sortlen=results.length;
        return results;}
    RefDB.union=union;

    function merge(set1,set2){
        var merged=[]; merged._sortlen=0;
        if (!(set1 instanceof Array)) set1=[set1];
        if (!(set2 instanceof Array)) set2=[set2];
        if ((!(set1))||(set1.length===0)) {
            if ((!(set2))||(set2.length===0)) return merged;
            merged=merged.concat(set2);
            if (set2._sortlen) {
                merged._sortlen=set2._sortlen;
                merged._allstrings=set2._allstrings;
                return merged;}
            else return setify(merged);}
        else if ((!(set2))||(set2.length===0))
            return merge(set2,set1);
        if (set1._sortlen!==set1.length) set1=setify(set1);
        if (set2._sortlen!==set2.length) set2=setify(set2);
        var i=0; var j=0; var len1=set1.length; var len2=set2.length;
        var allstrings=set1._allstrings&&set2._allstrings;
        while ((i<len1) && (j<len2))
            if (set1[i]===set2[j]) {
                merged.push(set1[i]); i++; j++;}
        else if ((allstrings)?
                 (set1[i]<set2[j]):
                 (set_sortfn(set1[i],set2[j])<0))
            merged.push(set1[i++]);
        else merged.push(set2[j++]);
        while (i<len1) merged.push(set1[i++]);
        while (j<len2) merged.push(set2[j++]);
        merged._allstrings=allstrings;
        merged._sortlen=merged.length;
        return merged;}
    RefDB.merge=merge;

    function overlaps(set1,set2){
        if (typeof set1 === 'string') set1=[set1];
        if (typeof set2 === 'string') set2=[set2];
        if ((!(set1))||(set1.length===0)) return false;
        if ((!(set2))||(set2.length===0)) return false;
        if (set1._sortlen!==set1.length) set1=fdjtSet(set1);
        if (set2._sortlen!==set2.length) set2=fdjtSet(set2);
        var i=0; var j=0; var len1=set1.length; var len2=set2.length;
        var allstrings=set1._allstrings&&set2._allstrings;
        while ((i<len1) && (j<len2))
            if (set1[i]===set2[j]) return true;
        else if ((allstrings)?
                 (set1[i]<set2[j]):
                 (set_sortfn(set1[i],set2[j])<0)) i++;
        else j++;
        return false;}
    RefDB.overlaps=overlaps;

    /* Sets */
    /* sets are really arrays that are sorted to simplify
       set operations.  the ._sortlen property tells how
       much of the array is sorted */
    function fdjtSet(arg){
        var result=[]; result._sortlen=0;
        if (arguments.length===0) return result;
        else if (arguments.length===1) {
            if (!(arg)) return result;
            else if (arg instanceof Array) {
                if ((!(arg.length))||(arg._sortlen===arg.length))
                    return arg;
                else if (typeof arg._sortlen === "number")
                    return setify(arg);
                else return setify([].concat(arg));}
            else {
                result=[arg]; 
                if (typeof arg === 'string') result._allstrings=true;
                result._sortlen=1;
                return result;}}
        else {
            result=[];
            for (arg in arguments)
                if (!(arg)) {}
            else if (arg instanceof Array)
                result=result.concat(arg);
            else result.push(arg);
            return setify(result);}}
    RefDB.Set=fdjtSet;
    fdjt.Set=fdjtSet;
    RefDB.toSet=fdjtSet;

    function setify(array) {
        var len;
        if (array._sortlen===(len=array.length)) return array;
        // else if ((array._sortlen)&&(array._sortlen>1))
        else if (len===0) {
            array._sortlen=0;
            return array;}
        else if (len===1) {
            var elt1=array[0];
            array._sortlen=1;
            array._allstrings=(typeof elt1 === 'string');
            if (typeof elt === "object") {
                if ((elt1._qid)||(elt1._fdjtid)) {}
                else if (elt1.getQID) elt1._qid=elt1.getQID();
                else elt1._fdjtid=++id_counter;}
            return array;}
        else {
            var allstrings=true;
            var i=0, lim=array.length;
            while (i<lim) {
                var elt=array[i++];
                if ((allstrings)&&(typeof elt !== 'string')) {
                    allstrings=false;
                    if (typeof elt === "object") {
                        if ((elt._qid)||(elt._fdjtid)) {}
                        else if (elt.getQID) elt._qid=elt.getQID();
                        else elt._fdjtid=++id_counter;}}}
            array._allstrings=allstrings;
            if (lim===1) return array;
            if (allstrings) array.sort();
            else array.sort(set_sortfn);
            // Now remove duplicates
            var read=1; var write=1; var readlim=array.length;
            var cur=array[0];
            while (read<readlim) {
                if (array[read]!==cur) {
                    array[write++]=cur=array[read++];}
                else read++;}
            array._sortlen=array.length=write;
            return array;}}
    
    function set_add(set,val) {
        if (val instanceof Array) {
            var changed=false;
            for (var elt in val) 
                if (set_add(set,elt)) changed=true;
            return changed;}
        else if (set.indexOf) {
            var pos=set.indexOf(val);
            if (pos>=0) return false;
            else set.push(val);
            return true;}
        else {
            var i=0; var lim=set.length;
            while (i<lim)
                if (set[i]===val) return false; else i++;
            if (typeof val !== 'string') set._allstrings=false;
            set.push(val);
            return true;}}
    
    function set_drop(set,val) {
        if (val instanceof Array) {
            var changed=false;
            for (var elt in val)
                if (set_drop(set,elt)) changed=true;
            return changed;}
        else if (set.indexOf) {
            var pos=set.indexOf(val);
            if (pos<0) return false;
            else set.splice(pos,1);
            return true;}
        else {
            var i=0; var lim=set.length;
            while (i<lim)
                if (set[i]===val) {
                    set.splice(i,1);
                    return true;}
            else i++;
            return false;}}
    
    /* Refs */

    Ref.prototype.get=function refGet(prop){
        if (this.hasOwnProperty(prop)) return this[prop];
        else if (this._live) return false;
        else return undefined;};
    Ref.prototype.getSet=function refGetSet(prop){
        if (this.hasOwnProperty(prop)) {
            var val=this[prop];
            if (val instanceof Array) {
                if (val._sortlen===val.length) return val;
                else return setify(val);}
            else return setify([val]);}
        else if (this._live) return [];
        else return undefined;};
    Ref.prototype.getArray=function refGetArray(prop){
        if (this.hasOwnProperty(prop)) {
            var val=this[prop];
            if (val instanceof Array) return val;
            else return [val];}
        else if (this._live) return [];
        else return undefined;};
    Ref.prototype.getValue=function refGet(prop){
        var ref=this; function getting(resolve,reject){
            if (ref.hasOwnProperty(prop))
                return resolve(ref[prop]);
            else if (ref._live) return resolve(undefined);
            else if (ref._db.storage)
                return ref.load().then(function(r){
                    return resolve(r[prop]);})
                .catch(reject);
            else return resolve(undefined);}
        return new Promise(getting);};
    function setCall(fn,val){
        if (Array.isArray(val)) {
            if ((val._sortlen)&&(val._sortlen===val.length))
                return fn(val);
            else return fn(setify(val));}
        else return fn([val]);}
    Ref.prototype.getValues=function refGet(prop){
        var ref=this;
        function getting(resolve,reject){
            ref.getValue(prop).then(function(val){
                return setCall(resolve,val);})
                .catch(reject);}
        return new Promise(getting);};

    Ref.prototype.add=function refAdd(prop,val,index){
        var ref=this, db=this._db;
        function handle_add(resolved){
            if ((val instanceof Array)&&
                (typeof val._sortlen === "number")) {
                var i=0, lim=val.length; while (i<lim) {
                    ref.add(prop,val[i++],index);}}
            else if (prop==="aliases") {
                if ((db.refs[val]===ref)||
                    (db.altrefs[val]===ref))
                    return ((resolved)&&(resolved(false)));
                else {
                    db.altrefs[val]=ref;
                    if (ref.aliases) ref.aliases.push(val);
                    else ref.aliases=[val];
                    return (resolved)&&(resolved(true));}}
            else if (ref.hasOwnProperty(prop)) {
                var cur=ref[prop];
                if (cur===val)
                    return (resolved)&&(resolved(false));
                else if (cur instanceof Array) {
                    if (!(set_add(cur,val)))
                        return (resolved)&&(resolved(false));
                    else {}}
                else ref[prop]=fdjtSet([cur,val]);}
            else if ((val instanceof Array)&&
                     (typeof val._sortlen !== "number"))
                ref[prop]=fdjtSet([val]);
            else ref[prop]=val;
            // If we've gotten through to here, we've made a change,
            //  so we update the change structures, run any add methods
            //  and index if appropriate
            if (!(ref._changed)) {
                var now=fdjtTime();
                if (!(db.changed)) changed_dbs.push(db);
                db.changed=now;
                ref._changed=now;
                db.changes.push(ref);}
            if (db.onadd.hasOwnProperty(prop))
                (db.onadd[prop])(ref,prop,val);
            if ((index)&&(db.indices[prop]))
                ref.indexRef(prop,ref[prop],db.indices[prop]);
            if (resolved) resolved(true);}
        function add_onload(){handle_add(false);}
        if (typeof index === "undefined") {
            if (db.indices.hasOwnProperty(prop)) index=true;
            else index=false;}
        else if ((index)&&(!(db.indices.hasOwnProperty(prop)))) {
            // fdjtLog("Creating index on %s for %o",prop,db);
            db.addIndex(prop);}
        else {}
        if ((val instanceof Array)&&(val._sortlen===0))
            return new Promise(function(resolve){return resolve(false);});
        else if ((!(this._live))&&(this._db.storage)) {
            if (this._onload) this._onload.push(add_onload);
            else this._onload=[add_onload];
            return this.load();}
        else return new Promise(handle_add);};
    Ref.prototype.drop=function refDrop(prop,val,dropindex){
        var ref=this, db=this._db;
        function handle_drop(resolved){
            if (ref.hasOwnProperty(prop)) {
                var cur=ref[prop];
                if (cur===val) delete ref[prop];
                else if (cur instanceof Array) {
                    if (!(set_drop(cur,val)))
                        return (resolved)&&(resolved(false));
                    if (cur.length===0) delete ref[prop];}
                else return (resolved)&&(resolved(false));}
            else return (resolved)&&(resolved(false));
            if (db.ondrop.hasOwnProperty(prop)) 
                (db.ondrop[prop])(ref,prop,val);
            if (!(ref._changed)) {
                var now=fdjtTime();
                if (db.changed) {db.changed=now; changed_dbs.push(db);}
                ref._changed=now;
                db.changes.push(ref);}
            if ((dropindex)&&(db.indices[prop])) 
                ref.indexRefDrop(prop,db.indices[prop]);
            return (resolved)&&(resolved(true));}
        function drop_onload(){handle_drop(false);}
        if (typeof dropindex === "undefined") dropindex=true;
        if (prop==='_id')
            return new Promise(function(resolved){resolved(false);});
        else if ((!(this._live))&&(this._db.storage)) {
            if (this._onload) this._onload.push(drop_onload);
            else this._onload=[drop_onload];
            return this.load();}
        else return new Promise(handle_drop);};
    Ref.prototype.test=function(prop,val){
        if (this.hasOwnProperty(prop)) {
            if (typeof val === 'undefined') return true;
            var cur=this[prop];
            if (cur===val) return true;
            else if (cur instanceof Array) {
                if (arr_contains(cur,val)) return true;
                else if (this._live) return false;
                else return undefined;}
            else if (this._live) return false;
            else return undefined;}
        else if (this._live) return false;
        else return undefined;};
    Ref.prototype.store=function(prop,val){
        var toadd=[], todrop=[];
        if (this.hasOwnProperty(prop)) {
            var cur=this[prop];
            if (cur===val) return false;
            else {
                toadd=difference(val,cur);
                todrop=difference(cur,val);}}
        else if (val instanceof Array)
            toadd=val;
        else toadd=[val];
        var i=0, lim=todrop.length;
        while (i<lim) this.drop(prop,todrop[i++]);
        i=0; lim=toadd.length; while (i<lim) this.add(prop,toadd[i++]);
        return true;};

    Ref.prototype.toHTML=function(){
        var dom=false;
        return ((this._db.forHTML)&&(this._db.forHTML(this)))||
            ((this._db.forDOM)&&(dom=this._db.forDOM(this))&&
             (dom.outerHTML))||
            this._id||this.oid||this.uuid;};
    Ref.prototype.toDOM=function(){
        return ((this._db.forDOM)&&(this._db.forDOM(this)))||
            ((this._db.forHTML)&&(fdjtDOM(this._db.forHTML(this))))||
            (fdjtDOM("span.fdjtref",this._id||this.oid||this.uuid));};

    /* Maps */

    function ObjectMap() {return this;}
    ObjectMap.prototype.get=function ObjectMapGet(key) {
        var keystring=getKeyString(key,this.fordb);
        if (this.hasOwnProperty(keystring))
            return this[keystring];
        else if (typeof key === "string")
            // This is helpful for debugging
            return this[key]||this["@"+key];
        else return undefined;};
    ObjectMap.prototype.getItem=ObjectMap.prototype.get;
    ObjectMap.prototype.set=function(key,val) {
        var keystring=getKeyString(key,this.fordb);
        if (val instanceof Array)
            this[keystring]=[val];
        else this[keystring]=val;};
    ObjectMap.prototype.setItem=ObjectMap.prototype.set;
    ObjectMap.prototype.increment=function(key,delta) {
        var keystring=getKeyString(key,this.fordb);
        var cur=this[keystring], next;
        if (cur) this[keystring]=next=cur+delta;
        else this[keystring]=next=delta;
        return next;};
    ObjectMap.prototype.add=function(key,val) {
        var keystring=getKeyString(key,this.fordb);
        if (this.hasOwnProperty(keystring)) {
            var cur=this[keystring];
            if (cur===val) return false;
            else if (cur instanceof Array) {
                if (arr_contains(cur,val)) return false;
                else {cur.push(val); return true;}}
            else if (val instanceof Array) {
                this[keystring]=setify([cur,val]);
                return true;}
            else {
                this[keystring]=setify([cur,val]);
                return true;}}
        else if (val instanceof Array) 
            this[keystring]=setify([val]);
        else this[keystring]=val;};
    ObjectMap.prototype.drop=function(key,val) {
        var keystring=getKeyString(key,this.fordb);
        if (this.hasOwnProperty(keystring)) {
            var cur=this[keystring];
            if (cur===val) {
                delete this[keystring];
                return true;}
            else if (cur instanceof Array) {
                var pos=cur.indexOf(val);
                if (pos<0) return false;
                cur.splice(pos,1); if (cur._sortlen) cur._sortlen--;
                if (cur.length===1) {
                    if (!(cur[0] instanceof Array))
                        this[keystring]=cur[0];}
                return true;}
            else return false;}
        else return false;};
    fdjt.Map=ObjectMap;
    RefDB.ObjectMap=ObjectMap;
    RefDB.fdjtMap=ObjectMap;

    function StringMap() {return this;}
    StringMap.prototype.get=function StringMapGet(keystring) {
        if (typeof keystring !== "string") return undefined;
        if (this.hasOwnProperty(keystring))
            return this[keystring];
        else return undefined;};
    StringMap.prototype.getItem=StringMap.prototype.get;
    StringMap.prototype.set=function(keystring,val) {
        if (typeof keystring !== "string") return;
        if (val instanceof Array)
            this[keystring]=[val];
        else this[keystring]=val;};
    StringMap.prototype.setItem=StringMap.prototype.set;
    StringMap.prototype.increment=function(keystring,delta) {
        if (typeof keystring !== "string") return;
        var cur=this[keystring], next;
        if (cur) this[keystring]=next=cur+delta;
        else this[keystring]=next=delta;
        return next;};
    StringMap.prototype.add=function(keystring,val) {
        if (typeof keystring !== "string") return;
        if (this.hasOwnProperty(keystring)) {
            var cur=this[keystring];
            if (cur===val) return false;
            else if (cur instanceof Array) {
                if (arr_contains(cur,val)) return false;
                else {cur.push(val); return true;}}
            else if (val instanceof Array) {
                this[keystring]=setify([cur,val]);
                return true;}
            else {
                this[keystring]=setify([cur,val]);
                return true;}}
        else if (val instanceof Array) 
            this[keystring]=setify([val]);
        else this[keystring]=val;};
    StringMap.prototype.drop=function(keystring,val) {
        if (typeof keystring !== "string") return;
        if (this.hasOwnProperty(keystring)) {
            var cur=this[keystring];
            if (cur===val) {
                delete this[keystring];
                return true;}
            else if (cur instanceof Array) {
                var pos=cur.indexOf(val);
                if (pos<0) return false;
                cur.splice(pos,1); if (cur._sortlen) cur._sortlen--;
                if (cur.length===1) {
                    if (!(cur[0] instanceof Array))
                        this[keystring]=cur[0];}
                return true;}
            else return false;}
        else return false;};
    fdjt.StringMap=StringMap;
    RefDB.StringMap=StringMap;

    function RefMap(db) {this._db=db; return this;}
    RefMap.prototype.get=function(key){
        if (typeof key === "string") {
            if (this.hasOwnProperty(key)) return this[key];
            else return undefined;}
        else if (key instanceof Ref) {
            var id=((this.uniqueids)&&key._id)||key._qid||key.getQID();
            return this[id];}
        else return undefined;};
    RefMap.prototype.set=function(key,val){
        if (typeof key === "string") this[key]=val;
        else if (key instanceof Ref) {
            var id=key._qid||((this.uniqueid)&&key._id)||key.getQID();
            this[id]=val;}
        else return false;};
    RefMap.prototype.increment=function(key,delta){
        if (typeof key === "string") {
            if (this.hasOwnProperty(key))
                this[key]=this[key]+delta;
            else this[key]=delta;}
        else if (key instanceof Ref) {
            var id=key._qid||((this.uniqueids)&&key._id)||key.getQID();
            this[id]=(this[id]||0)+delta;}
        else return false;};
    fdjt.RefMap=RefDB.RefMap=RefMap;
    
    /* Miscellaneous array and table functions */

    RefDB.add=function(obj,field,val,nodup){
        if (arguments.length===2)
            return set_add(obj,field);
        else if (obj instanceof Ref)
            return obj.add.apply(obj,arguments);
        else if (nodup) 
            if (obj.hasOwnProperty(field)) {
                var vals=obj[field];
                if (!(arr_contains(vals,val))) obj[field].push(val);
                else {}}
        else obj[field]=new Array(val);
        else if (obj.hasOwnProperty(field))
            obj[field].push(val);
        else obj[field]=new Array(val);
        if ((obj._all) && (!(arr_contains(obj._all,field))))
            obj._all.push(field);};

    RefDB.drop=function(obj,field,val){
        if (arguments.length===2)
            return set_drop(obj,field);
        else if (obj instanceof Ref)
            return obj.drop.apply(obj,arguments);
        else if (!(val))
            /* Drop all vals */
            obj[field]=[];
        else if (obj.hasOwnProperty(field)) {
            var vals=obj[field];
            var pos=arr_position(vals,val);
            if (pos<0) return;
            else vals.splice(pos,1);}
        else {}};

    RefDB.test=function(obj,field,val){
        if (arguments.length===2)
            return arr_contains(obj,field);
        else if (obj instanceof Ref)
            return obj.test.apply(obj,arguments);
        else if (typeof val === "undefined")
            return (((obj.hasOwnProperty) ?
                     (obj.hasOwnProperty(field)) : (obj[field])) &&
                    ((obj[field].length)>0));
        else if (obj.hasOwnProperty(field)) { 
            if (arr_position(obj[field],val)<0)
                return false;
            else return true;}
        else return false;};

    RefDB.insert=function(array,value){
        if (arr_position(array,value)<0) array.push(value);};

    RefDB.remove=function(array,value,count){
        var pos=arr_position(array,value);
        if (pos<0) return array;
        array.splice(pos,1);
        if (count) {
            count--;
            while ((count>0) &&
                   ((pos=arr_position(array,value,pos))>=0)) {
                array.splice(pos,1); count--;}}
        return array;};

    RefDB.indexOf=function(array,elt,pos){
        if (pos) return array.indexOf(elt,pos);
        else return array.indexOf(elt);};

    RefDB.contains=arr_contains;
    RefDB.position=arr_position;

    function countKeys(obj){
        var count=0; for (var key in obj) {
            if (obj.hasOwnProperty(key)) count++;}
        return count;}
    RefDB.countKeys=countKeys;
    function localKeys(obj){
        var keys=[]; for (var key in obj) {
            if (obj.hasOwnProperty(key)) keys.push(key);}
        return keys;}
    RefDB.localKeys=localKeys;

    function Query(dbs,clauses,weights){
        if (arguments.length===0) return this;
        if (dbs) this.dbs=dbs;
        if (clauses) {
            if (clauses instanceof Array)
                this.clauses=clauses;
            else this.clauses=[clauses];}
        if (weights) this.weights=weights;
        // Figure out if references can be unique IDs
        var i=0, n_dbs=dbs.length;
        if (n_dbs>1) while (i<n_dbs) {
            if (!(dbs[i].absrefs)) return this;
            else i++;}
        this.uniqueids=true;
        return this;}
    RefDB.Query=Query;
    Query.prototype.uniqueids=false;
    
    function sortbyweight(f1,f2){return f2.weight-f1.weight;}

    Query.prototype.execute=function executeQuery(){
        if (this.scores) return this;
        var dbs=this.dbs;
        var clauses=this.clauses;
        if (!((dbs)&&(dbs.length))) {
            var empty_result=this.results=fdjtSet();
            warn("No dbs for query %o!",this);
            return empty_result;}
        else if (!((clauses)&&(clauses.length))) {
            var full_result=fdjtSet();
            var i=0, lim=dbs.length;
            while (i<lim) full_result=
                merge(full_result,setify(dbs[i++].allrefs));
            this.results=full_result;
            return full_result;}
        var query_weights=this._weights||this.weights;
        var uniqueids=((dbs.length===1)||(this.uniqueids));
        var scores=new RefMap();
        var counts=new RefMap();
        var matches=fdjtSet();
        var match_seen={};
        // This makes these go faster because they don't bother
        // disambiguting _id fields.
        counts.uniqueids=scores.uniqueids=uniqueids;
        var i_clause=0, n_clauses=clauses.length;
        while (i_clause<n_clauses) {
            var clause=clauses[i_clause++];
            var fields=clause.fields;
            var values=clause.values;
            var clause_weights=clause.weights;
            var findings=[];
            if (!(fields instanceof Array)) fields=[fields];
            if (!(values instanceof Array)) values=[values];
            var i_field=0; var n_fields=fields.length;
            while (i_field<n_fields) {
                var field=fields[i_field++];
                var weight=((clause_weights)&&(clause_weights[field]))||
                    ((query_weights)&&(query_weights[field]))||
                    (this.default_weight)||1;
                var i_value=0, n_values=values.length;
                while (i_value<n_values) {
                    var value=values[i_value++];
                    var i_db=0, n_dbs=dbs.length;
                    while (i_db<n_dbs) {
                        var db=dbs[i_db++];
                        var hits=db.find(field,value);
                        if ((hits)&&(hits.length)) {
                            findings.push({
                                field: field, hits: setify(hits),
                                weight: weight, value: value,
                                db: db});}}}}
            // Sort so the highest scoring findings go first
            findings.sort(sortbyweight);
            var finding_i=0, n_findings=findings.length; var seen={};
            while (finding_i<n_findings) {
                var finding=findings[finding_i++];
                var hit_ids=finding.hits, fdb=finding.db, abs=fdb.absrefs;
                var i_hit=0, n_hits=hit_ids.length, hit_id, ref;
                if ((uniqueids)||(abs)) while (i_hit<n_hits) {
                    hit_id=hit_ids[i_hit++];
                    if (seen[hit_id]) continue;
                    else seen[hit_id]=hit_id;
                    if (!(match_seen[hit_id])) {
                        matches.push(fdb.ref(hit_id));
                        match_seen[hit_id]=hit_id;}
                    counts[hit_id]=(counts[hit_id]||0)+1;
                    scores[hit_id]=(scores[hit_id]||0)+finding.weight;}
                else {
                    hit_id=hit_ids[i_hit++]; ref=fdb.ref(hit_id);
                    var fullid=ref._qid||((abs)&&(ref._id))||ref.getQID();
                    if (seen[fullid]) continue;
                    else seen[fullid]=fullid;
                    if (!(match_seen[fullid])) {
                        matches.push(ref);
                        match_seen[fullid]=fullid;}
                    counts[fullid]=(counts[fullid]||0)+1;
                    scores[fullid]=(scores[fullid]||0)+finding.weight;}}}
        if (n_clauses>1) {
            var results=this.results=[];
            var new_scores=new RefMap(), new_counts=new RefMap();
            var i_matches=0, n_matches=matches.length;
            while (i_matches<n_matches) {
                var match=matches[i_matches++];
                var count=counts.get(match);
                // If there are just two clauses, score their
                // intersection; If there are more than two
                // clauses (count>=2), score the union of their
                // pairwise intersections.
                if (count>=2) { /* ((n_clauses===2)||(count>=2)) */
                    var score=scores.get(match);
                    new_scores.set(match,score);
                    new_counts.set(match,count);
                    results.push(match);}}
            results._allstrings=false;
            results._sortlen=results.length;
            this.results=results;
            this.scores=new_scores;
            this.counts=new_counts;}
        else {
            this.results=setify(matches);
            this.scores=scores;
            this.counts=counts;}
        
        return this;};

    /* Indexed DB utilities */
    
    function useIndexedDB(dbname,version,init,opts){
        if ((version)&&(!opts)&&
            (typeof version !== "number")&&(version.version)) {
            opts=version; version=opts.version;}
        else if (!(opts)) opts={};
        if (!(init)) init=opts.init||false;
        if (!(version)) version=1;
        var trace=opts.trace;
        var vname=dbname+":"+version;
        function usingIndexedDB(resolve,reject){
            if ((typeof indexedDB === "undefined")||
                (!(indexedDB.open))) {
                fdjtLog.warn(
                    "No indexedDB implementation for opening %:",vname);
                if (reject)
                    reject(new Error("No indexedDB implementation"));
                else throw new Error("No indexedDB implementation");}
            var req=indexedDB.open(dbname,version), fail=false;
            var init_timeout=setTimeout(function(){
                fail=true;
                fdjtLog.warn("Init timeout for indexedDB %s",vname);
                reject(new Error("Init timeout"));},
                                        opts.timeout||15000);
            req.onerror=function(event){
                fail=true;
                warn("Error initializing indexedDB layout cache: %o",
                     event.errorCode);
                if (init_timeout) clearTimeout(init_timeout);
                if (reject) return reject(event);
                else return event;};
            req.onsuccess=function(evt) {
                if (fail) {
                    fdjtLog("Discarding indexedDB %s after failure!",
                            vname);
                    return;}
                var db=evt.target.result;
                if (init_timeout) clearTimeout(init_timeout);
                if (trace)
                    fdjtLog("Got existing IndexedDB %s %o",
                            vname,db);
                if (resolve)
                    return resolve(db);
                else return db;};
            req.onupgradeneeded=function(evt) {
                var db=evt.target.result;
                if (!(init)) return resolve(db);
                else {
                    req.onsuccess=function(){
                        if (resolve) return resolve(db);
                        else return db;};
                    req.onerror=function(evt){
                        fdjtLog("Error upgrading %s %o",vname,evt);
                        if (reject) reject(evt);
                        else throw new Error(
                            "Error upgrading %s",vname);};
                    if (init.call) {
                        try {init(db);
                             if (resolve) return resolve(db);
                             else return db;}
                        catch (ex) {
                            fdjtLog("Error upgrading %s:%d: %o",
                                    dbname,version,ex);
                            if (reject) reject(ex);}}
                    else if (reject) reject(
                        new Error("Bad indexDB init: %o",init));
                    else throw new Error("Bad indexDB init: %o",init);}
                return db;};
            return req;}
        return new Promise(usingIndexedDB);}
    RefDB.useIndexedDB=useIndexedDB;

    return RefDB;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/ajax.js ###################### */

/* Copyright (C) 2007-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides an abstraction layer for Ajax calls

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

    Use, modification, and redistribution of this program is permitted
    under either the GNU General Public License (GPL) Version 2 (or
    any later version) or under the GNU Lesser General Public License
    (version 3 or later).

    These licenses may be found at www.gnu.org, particularly:
      http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
      http://www.gnu.org/licenses/lgpl-3.0-standalone.html
*/
/* jshint browser: true  */
/* globals Promise */

// var fdjt=((window.fdjt)||{});

fdjt.Ajax=
    (function(){
        "use strict";
        var fdjtDOM=fdjt.DOM, fdjtLog=fdjt.Log;
        var $ID=fdjt.ID;

        function compose_uri(base_uri,args){
            var uri=base_uri; var need_amp=false;
            if (base_uri[-1]==='&') need_amp=false;
            else if (base_uri.indexOf('?')>=0) need_amp=true;
            else uri=base_uri+"?";
            if (typeof args === 'string')
                uri=uri+((need_amp) ? ("&") : (""))+args;
            else if (args.length) {
                var i=0; while (i<args.length) {
                    if (!(args[i])) {i=i+2; continue;}
                    uri=uri+((need_amp) ? ("&") : (""))+
                        encodeURIComponent(args[i])+
                        "="+encodeURIComponent(args[i+1]);
                    need_amp=true;
                    i=i+2;}}
            else {
                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        uri=uri+((need_amp) ? ("&") : (""))+
                            encodeURIComponent(key)+
                            "="+encodeURIComponent(args[key]);
                        need_amp=true;}}}
            return uri;}

        var trace_ajax=false;
        
        function statusOK(req,test){
            var status=req.status;
            if (!(test))
                return ((status>=200)&&(status<300))||(status===304);
            else if (test.call)
                return test(req);
            else if (Array.isArray(test)) 
                return test.indexOf(status)>=0;
            else return ((status>=200)&&(status<300))||(status===304);}

        function fdjtAjax(success_callback,base_uri,args,other_callback,
                          headers,opts){
            var timeout=((typeof opts==="number")?(opts):
                         ((opts)&&(opts.timeout)));
            if (typeof opts === "number") opts={};
            else if (!(opts)) opts={};
            var req=new XMLHttpRequest(), success=opts.success;
            var uri=((args)?(compose_uri(base_uri,args)):(base_uri));
            req.onreadystatechange=function () {
                if (req.readyState === 4) {
                    if (statusOK(req,success)) {
                        success_callback(req);}
                    else if (other_callback) other_callback(req);}
                else {}};
            if (timeout) {
                req.timeout=timeout;
                if (other_callback) {
                    req.ontimeout=function(evt){
                        evt=evt||window.event;
                        other_callback(req);};}}
            req.open("GET",uri);
            if (opts.hasOwnProperty("credentials"))
                req.withCredentials=opts.credentials;
            else req.withCredentials=true;
            if (headers) {
                for (var key in headers)
                    if (headers.hasOwnProperty(key))
                        req.setRequestHeader(key,headers[key]);}
            req.send(null);
            return req;}

        fdjtAjax.textCall=function(callback,base_uri){
            return fdjtAjax(function(req) {callback(req.responseText);},
                            base_uri,fdjtDOM.Array(arguments,2));};

        fdjtAjax.jsonCall=function(callback,base_uri){
            return fdjtAjax(function(req) {
                callback(JSON.parse(req.responseText));},
              base_uri,fdjtDOM.Array(arguments,2));};

        fdjtAjax.xmlCall=function(callback,base_uri){
            return fdjtAjax(function(req) {callback(req.responseXML);},
                            base_uri,fdjtDOM.Array(arguments,2));};
        
        fdjtAjax.fetch=function(baseuri,args,headers,opts){
            function fetching(resolved,rejected){
                fdjtAjax(function(req) {resolved(req);},
                         baseuri,args,
                         function(req) {rejected(req);},
                         headers,opts);}
            return new Promise(fetching);};
        fdjtAjax.fetchText=function(baseuri,args,headers,opts){
            function fetching(resolved,rejected){
                fdjtAjax(function(req) {resolved(req.responseText);},
                         baseuri,args,
                         function(req) {rejected(req);},
                         headers,opts);}
            return new Promise(fetching);};
        fdjtAjax.fetchJSON=function(baseuri,args,headers,opts){
            function fetching(resolved,rejected){
                fdjtAjax(function(req) {resolved(JSON.parse(req.responseText));},
                         baseuri,args,
                         function(req) {rejected(req);},
                         headers,opts);}
            return new Promise(fetching);};
        fdjtAjax.fetchXML=function(baseuri,args,headers,opts){
            function fetching(resolved,rejected){
                fdjtAjax(function(req) {resolved(JSON.parse(req.responseXML));},
                         baseuri,args,
                         function(req) {rejected(req);},
                         headers,opts);}
            return new Promise(fetching);};

        function jsonpCall(uri,id,cleanup){
            if ((id)&&($ID(id))) return false;
            var script_elt=fdjt.DOM("SCRIPT");
            if (id) script_elt.id=id;
            if (cleanup) script_elt.oncleanup=cleanup;
            script_elt.language='javascript';
            script_elt.src=uri;
            document.body.appendChild(script_elt);}
        fdjtAjax.jsonpCall=jsonpCall;

        function jsonpFinish(id){
            var script_elt=$ID(id);
            if (!(script_elt)) return;
            if (script_elt.oncleanup) script_elt.oncleanup();
            fdjtDOM.remove(script_elt);}
        fdjtAjax.jsonpFinish=jsonpFinish;

        function add_query_param(parameters,name,value){
            return ((parameters)?(parameters+"&"):(""))+
                name+"="+encodeURIComponent(value);}

        function formParams(form) {
            fdjt.UI.AutoPrompt.cleanup(form);
            var parameters=false;
            var inputs=fdjtDOM.getChildren(form,"INPUT");
            var i=0; while (i<inputs.length) {
                var input=inputs[i++];
                if ((!(input.disabled))&&
                    (((/(radio)|(checkbox)/i).exec(input.type))?
                     (input.checked):(true)))
                    parameters=add_query_param(
                        parameters,input.name,input.value);}
            var textareas=fdjtDOM.getChildren(form,"TEXTAREA");
            i=0; while (i<textareas.length) {
                var textarea=textareas[i++];
                if (!(textarea.disabled)) {
                    parameters=add_query_param(
                        parameters,textarea.name,textarea.value);}}
            var selectboxes=fdjtDOM.getChildren(form,"SELECT");
            i=0; while (i<selectboxes.length) {
                var selectbox=selectboxes[i++]; var name=selectbox.name;
                var options=fdjtDOM.getChildren(selectbox,"OPTION");
                var j=0; while (j<options.length) {
                    var option=options[j++];
                    if (option.selected)
                        parameters=add_query_param(
                            parameters,name,option.value);}}
            return parameters;}
        fdjtAjax.formParams=formParams;

        function add_field(result,name,value,downcase) {
            if (downcase) name=name.toLowerCase();
            if (result.hasOwnProperty(name)) {
                var cur=result[name];
                if (cur.push) cur.push(value);
                else result[name]=[cur,value];}
            else result[name]=value;}

        function formJSON(form,downcase) {
            fdjt.UI.AutoPrompt.cleanup(form);
            var result={};
            var inputs=fdjtDOM.getChildren(form,"INPUT");
            var i=0; while (i<inputs.length) {
                var input=inputs[i++];
                if ((!(input.disabled)) &&
                    (((input.type==="radio") || (input.type==="checkbox")) ?
                     (input.checked) : (true)))
                    add_field(result,input.name,input.value,downcase||false);}
            var textareas=fdjtDOM.getChildren(form,"TEXTAREA");
            i=0; while (i<textareas.length) {
                var textarea=textareas[i++];
                if (!(textarea.disabled)) 
                    add_field(result,textarea.name,textarea.value,downcase||false);}
            var selectboxes=fdjtDOM.getChildren(form,"SELECT");
            i=0; while (i<selectboxes.length) {
                var selectbox=selectboxes[i++]; var name=selectbox.name;
                var options=fdjtDOM.getChildren(selectbox,"OPTION");
                var j=0; while (j<options.length) {
                    var option=options[j++];
                    if (option.selected)
                        add_field(result,name,option.value,downcase||false);}}
            return result;}
        fdjtAjax.formJSON=formJSON;

        function ajaxSubmit(form,callback,opts){
            var ajax_uri=form.getAttribute("ajaxaction")||form.action;
            if (!(ajax_uri)) return false;
            // Whether to do AJAX synchronously or not.
            var syncp=form.getAttribute("synchronous");
            if (trace_ajax)
                fdjtLog("Direct %s AJAX submit to %s for %o with callback %o",
                        ((syncp)?("synchronous"):("asynchronous")),
                        ajax_uri,form,callback);
            // Firefox doesn't run the callback on synchronous calls
            var success=false; var callback_run=false;
            var req=new XMLHttpRequest();
            var params=formParams(form);
            fdjtDOM.addClass(form,"submitting");
            if (syncp) {
                if (form.method==="GET")
                    req.open('GET',ajax_uri+"?"+params,false);
                else if (form.method==="PUT")
                    req.open('PUT',ajax_uri,false);
                else req.open('POST',ajax_uri,false);}
            else {
                if (form.method==="GET")
                    req.open('GET',ajax_uri+"?"+params);
                else if (form.method==="PUT")
                    req.open('PUT',ajax_uri);
                else req.open('POST',ajax_uri);}
            req.onreadystatechange=function () {
                if (trace_ajax)
                    fdjtLog("Ajax (%d,%d) %o for %o, callback=%o",
                            req.readyState,
                            ((req.readyState===4)&&(req.status)),
                            req,ajax_uri,callback);
                if ((req.readyState === 4) && (req.status>=200) &&
                    (req.status<300)) {
                    if ((callback)&&(trace_ajax))
                        fdjtLog("Got callback (%d,%d) %o for %o, calling %o",
                                req.readyState,req.status,req,ajax_uri,callback);
                    fdjtDOM.dropClass(form,"submitting");
                    success=true; 
                    if (callback) callback(req,form);
                    callback_run=true;}
                else if (req.readyState === 4) {
                    fdjtLog("Failed callback (%d,%d) %o for %o, not calling %o",
                            req.readyState,((req.readyState===4)&&(req.status)),
                            req,ajax_uri,callback);
                    fdjtDOM.dropClass(form,"submitting");
                    if (callback) callback(req,form);
                    callback_run=true;}
                else {}};
            if ((opts)&&(opts.accept)) req.setRequestHeader("Accept",opts.accepts);
            if ((opts)&&(opts.hasOwnProperty('creds')))
                req.withCredentials=opts.creds;
            else req.withCredentials=true;
            try {
                if (form.method==="GET") req.send();
                else {
                    req.setRequestHeader(
                        "Content-type", "application/x-www-form-urlencoded");
                    req.send(params);}
                success=true;}
            catch (ex) {}
            if ((syncp) && (!(callback_run))) {
                if (trace_ajax)
                    fdjtLog("Running callback (rs=%d,status=%d) %o for %o, calling %o",
                            req.readyState,((req.readyState===4)&&(req.status)),
                            req,ajax_uri,callback);
                if ((req.readyState === 4) && (req.status>=200) &&
                    (req.status<300)) {
                    fdjtDOM.dropClass(form,"submitting");
                    success=true;
                    if (callback) callback(req,form);}}
            return success;}
        fdjtAjax.formSubmit=ajaxSubmit;

        function jsonpSubmit(form){
            var jsonp_uri=form.getAttribute("jsonpuri");
            if (!(jsonp_uri)) return false;
            var jsonid=((form.id)?("JSONP"+form.id):("FORMJSONP"));
            var params=formParams(form);
            fdjtDOM.addClass(form,"submitting");
            try {
                jsonpCall(jsonp_uri+"?"+params,jsonid,
                          function(){fdjt.DOM.dropClass(form,"submitting");});}
            catch (ex) {
                jsonpFinish(jsonid);
                fdjtLog.warn("Attempted JSONP call signalled %o",ex);
                return false;}
            return true;}

        function form_submit(evt,callback){
            evt=evt||window.event||null;
            var form=((evt.nodeType)?(evt):(fdjt.UI.T(evt)));
            fdjt.UI.AutoPrompt.cleanup(form);
            if (fdjtDOM.hasClass(form,"submitting")) {
                fdjtDOM.dropClass(form,"submitting");
                form.fdjtsubmit=false;
                return false;}
            // if (form.fdjtlaunchfailed) return;
            form.fdjtsubmit=true;
            fdjtDOM.addClass(form,"submitting");
            if (ajaxSubmit(form,callback)) {
                // fdjtLog("Ajax commit worked");
                fdjt.UI.cancel(evt);
                return true;}
            else if (jsonpSubmit(form)) {
                // fdjtLog("Json commit worked");
                fdjt.UI.cancel(evt);
                return true;}
            else return false;}

        function copy_args(args,i){
            var lim=args.length; if (!(i)) i=0;
            var copy=new Array(lim-i);
            while (i<lim) {copy[i]=args[i]; i++;}
            return copy;}

        /* Synchronous calls */
        function sync_get(callback,base_uri,args){
            var req=new XMLHttpRequest();
            var uri=compose_uri(base_uri,args);
            req.open("GET",uri,false);
            req.send(null);
            if (callback) return callback(req);
            else return req;}
        fdjtAjax.get=function(base_uri){
            return sync_get(false,base_uri,copy_args(arguments,1));};
        fdjtAjax.getText=function(base_uri) {
            return sync_get(function (req) { return req.responseText; },
                            base_uri,copy_args(arguments,1));};
        fdjtAjax.getJSON=function(base_uri) {
            return sync_get(function (req) {
                return JSON.parse(req.responseText); },
                            base_uri,fdjtDOM.Array(arguments,1));};
        fdjtAjax.getXML=function(base_uri) {
            return sync_get(function (req) {return req.responseXML; },
                            base_uri,fdjtDOM.Array(arguments,1));};
        
        fdjtAjax.onsubmit=form_submit;

        return fdjtAjax;})();

/* Emacs local variables
;;;  Local variables: ***
;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
;;;  indent-tabs-mode: nil ***
;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

/* ######################### fdjt/wsn.js ###################### */

/* Copyright (C) 2011-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   It implements a method for breaking narrative HTML content
   across multiple pages, attempting to honor page break constraints,
   etc.

   Check out the 'mini manual' at the bottom of the file or read the
   code itself.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or any
   later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

   Use and redistribution (especially embedding in other CC licensed
   content) is also permitted under the terms of the Creative Commons
   "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

var WSN=(function(){
    "use strict";
    var fdjtHash=fdjt.Hash;
    var fdjtString=fdjt.String;

    /*
    function get_punct_regex(){
        try { return (/(\pM)/g);}
        catch (ex1) {
            try { return (/(\pP)/g); }
            catch (ex2) {return (/[.,?!-_@&%$#\\\/\^()]/);}}}
    */
    
    var punct_regex=/(\pM)/g;
    var decodeEntities=fdjtString.decodeEntities;
    
    function WSN(arg,sortfn,wordfn,keepdup){
        if (arg==="") return arg;
        else if ((!(arg))&&(this instanceof WSN)) {
            // Assume we're being used as a constructor.
            if (sortfn) this.sortfn=sortfn;
            if (wordfn) this.wordfn=wordfn;
            if (keepdup) this.keepdup=keepdup;
            return this;}
        else if (!(arg)) return arg;
        if (typeof sortfn === 'undefined') sortfn=WSN.sortfn||false;
        if (typeof wordfn === 'undefined') wordfn=WSN.wordfn||false;
        if (typeof keepdup === 'undefined') keepdup=WSN.keepdup||false;
        if (typeof arg === 'string') {
            var norm=
                decodeEntities(arg).toLowerCase().replace(punct_regex,"");
            // Trim spaces
            if (norm.trim) norm=norm.trim();
            else {
                if (norm.search(/\S/)>0)
                    norm=norm.slice(norm.search(/\S/));
                if (norm.search(/\s+$/)>0)
                    norm=norm.slice(0,norm.search(/\s+$/));}
            if (norm==="") return "";
            var words=norm.split(/\W*\s+\W*/g), word;
            var xwords=[], xword;
            var nwords=words.length;
            var i, lim;
            if (nwords===0) return "";
            else words[0]=words[0].replace(/^\W+/,"");
            if (nwords>1)
                words[nwords-1]=words[nwords-1].replace(/\W+$/,"");
            if (wordfn) {
                if (typeof wordfn === 'number') {
                    i=0; lim=words.length;
                    while (i<lim) {
                        xword=words[i++];
                        if (word.length>wordfn) xwords.push(xword);}
                    if (xwords.length) words=xwords;}
                else if (wordfn.call) {
                    i=0; lim=words.length;
                    while (i<lim) {
                        xword=wordfn(words[i++]);
                        if (xword) xwords.push(xword);
                        i++;}
                    if (xwords.length) words=xwords;}
                else  {
                    i=0; lim=words.length;
                    while (i<lim) {
                        word=words[i++];
                        xword=wordfn[word];
                        if (xword==="") {}
                        else if ((!(xword))||(typeof xword !== 'string'))
                            xwords.push(word);
                        else xwords.push(xword);}
                    if (xwords.length) words=xwords;}}
            var sorter=sortfn;
            // By default, use lensort
            // But if you're passed nativesort, just
            //  pass false to sort()
            if (sortfn===true) sorter=lensort;
            else if (sortfn===nativesort) sorter=false;
            else {}
            if ((sortfn)&&(keepdup))
                return words.sort(sorter).join(" ");
            else if (sortfn)
                return dedupfn(words.sort(sorter)).join(" ");
            else return words.join(" ");}
        else if (!(arg.nodeType))
            throw new Error("bad arg to WSN");
        else if (arg.nodeType===3)
            return WSN(arg.nodeValue);
        else if (arg.nodeType===1)
            return WSN(textify(arg));
        else throw new Error("bad arg to WSN");}
    
    function dedupfn(arr){
        var i=0; var lim=arr.length; var last=false;
        if (lim<2) return arr;
        else while (i<lim) {
            if ((last)&&(arr[i]===last)) return dodedup(arr);
            else last=arr[i++];}
        return arr;}
    function dodedup(arr){
        var last=arr[0]; var result=[last];
        var i=1; var lim=arr.length;
        while (i<lim) 
            if (arr[i]===last) i++;
        else result.push(last=arr[i++]);
        return result;}
    
    function lensort(x,y){
        var xl=x.length, yl=y.length;
        if (xl===yl) {
            if (x>y) return -1;
            else if (x<y) return 1;
            else return 0;}
        else if (xl>yl) return -1;
        else return 1;}
    WSN.lensort=lensort;
    function nativesort(x,y){
        if (x>y) return -1;
        else if (x<y) return 1;
        else return 0;}
    WSN.nativesort=nativesort;

    function textify(arg,text){
        /* global window: false */
        if (!(arg.nodeType)) return text||"";
        else if (arg.nodeType===3)
            if (text) return text+arg.nodeValue; else return arg.nodeValue;
        else if (arg.nodeType===1) {
            var children=arg.childNodes;
            var style=((window.getComputedStyle)?
                       (window.getComputedStyle(arg)):
                       {position: 'static',display: 'block'});
            if (style.position!=='static') return text||"";
            if (style.display!=='inline')
                text="\n"+(text||"");
            else if (!(text)) text="";
            var i=0; var lim=children.length;
            while (i<lim) {
                var child=children[i++];
                if (child.nodeType===3) text=text+child.nodeValue;
                else if (child.nodeType===1) text=textify(child,text);
                else {}}
            return text;}
        else if (text) return text;
        else return "";}
    WSN.prototype.textify=WSN.textify=textify;

    function fuddle(arg,sortfn){return WSN(arg,sortfn||lensort);}
    WSN.fuddle=fuddle;

    function md5ID(){
        var wsn=WSN.apply(null,arguments);
        if (!(wsn)) return wsn;
        else if (WSN.md5) return WSN.md5(wsn);
        else if ((fdjtHash)&&(fdjtHash.hex_md5))
            return fdjtHash.hex_md5(wsn);
        else throw new Error("No MD5 implementation");}
    WSN.md5ID=md5ID;
    
    function sha1ID(){
        var wsn=WSN.apply(null,arguments);
                if (!(wsn)) return wsn;
        else if (WSN.sha1) return WSN.md5(wsn);
        else if ((fdjtHash)&&(fdjtHash.hex_sha1))
            return fdjtHash.hex_sha1(wsn);
        else throw new Error("No SHA1 implementation");}
    WSN.sha1ID=sha1ID;

    function hash(arg,hashfn,sortfn,wordfn,keepdups){
        if (typeof hashfn === 'undefined') hashfn=WSN.hashfn||false;
        if (typeof sortfn === 'undefined') sortfn=WSN.sortfn||false;
        if (typeof wordfn === 'undefined') wordfn=WSN.wordfn||false;
        if (typeof keepdups === 'undefined') keepdups=WSN.keepdup||false;
        var wsn=WSN(arg,sortfn,wordfn,keepdups);
        if (!(wsn)) return wsn;
        else return ((hashfn)?(hashfn(wsn)):(wsn));}
    WSN.hash=hash;
    WSN.prototype.Hash=function(arg){
        return hash(arg,this.hashfn||WSN.hashfn||false,
                    this.sortfn||WSN.sortfn||false,
                    this.wordfn||WSN.wordfn||false,
                    this.keepdup||WSN.keepdup||false);};

    function maphash(nodes,hashfn,sortfn,wordfn,keepdups){
        if (typeof hashfn === 'undefined') hashfn=WSN.hashfn||false;
        if (typeof sortfn === 'undefined') sortfn=WSN.sortfn||false;
        if (typeof wordfn === 'undefined') wordfn=WSN.wordfn||false;
        if (typeof keepdups === 'undefined') keepdups=WSN.keepdup||false;
        var map={};
        var i=0; var lim=nodes.length;
        while (i<lim) {
            var node=nodes[i++];
            var wsn=WSN(node,sortfn,wordfn,keepdups);
            var id=((hashfn)?(hashfn(wsn)):(wsn));
            map[id]=node;}
        return map;}
    WSN.maphash=maphash;
    WSN.prototype.maphash=function(arg){
        return maphash(arg,this.hashfn||WSN.hashfn||false,
                       this.sortfn||WSN.sortfn||false,
                       this.wordfn||WSN.wordfn||false,
                       this.keepdup||WSN.keepdup||false);};
    
    function mapMD5(nodes,sortfn,wordfn,keepdups){
        var hashfn=WSN.md5||((fdjtHash)&&(fdjtHash.hex_md5));
        return maphash(nodes,hashfn,sortfn,wordfn,keepdups);}
    function mapSHA1(nodes,sortfn,wordfn,keepdups){
        var hashfn=WSN.sha1||((fdjtHash)&&(fdjtHash.hex_sha1));
        return maphash(nodes,hashfn,sortfn,wordfn,keepdups);}
    WSN.mapMD5=mapMD5;
    WSN.mapSHA1=mapSHA1;

    WSN.md5=((fdjtHash)&&(fdjtHash.hex_md5));
    WSN.sha1=((fdjtHash)&&(fdjtHash.hex_sha1));

    return WSN;})();

fdjt.WSN=WSN;

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/textindex.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));

fdjt.TextIndex=(function(){
    "use strict";
    var fdjtString=fdjt.String;
    var fdjtDOM=fdjt.DOM;
    var stdspace=fdjtString.stdspace;
    var textify=fdjtDOM.textify;
    
    var default_stopwords_init=[
        "a","i","--","am","an","as","at","be","by","d'",
        "de","di","do","ex","he","if","in","is","it",
        "me","my","no","o'","of","on","or","so","t'",
        "to","up","us","we","ya","ye","any","are","but","can",
        "cum","des","did","ere","fer","few","for","had",
        "has","her","him","his","hoo","how","i'd","i'm",
        "its","lot","may","nor","not","off","our",
        "qua","s/p","she","ten","the",
        "via","was","who","why","yet","you","'tis",
        "amid","atop","been","both","does","doth",
        "down","d’","each","even","from","haec","hast",
        "hath","have","he'd","he's","here","hers","i'll",
        "i're","i've","into","it'd","it's","last","less",
        "like","many","mine","miss","more","most","must",
        "near","nigh","none","o'er","once","only",
        "onto","ours","over","o’","past","port","reg.",
        "sans","says","some","such","thae","than","that",
        "thee","them","then","they","thir","this","thou",
        "thro","thru","thus","till","unto","upon","upto",
        "we'd","were","what","when","whom","will","wilt",
        "with","your","yous","zero","abaft","aboon",
        "about","above","adown","afore","after","ain't","along",
        "among","anear","anent","aught","baith","being","below",
        "can't","circa","could","didst","doest","doeth","don't",
        "every","fewer","fifty","forty","gonna",
        "he'll","he're","he've","her'n","his'n","isn't","it'll",
        "maybe","might","neath","never","noone","one's","other",
        "our'n","round","shall","shalt","she'd","she's","since",
        "their","there","these","those","thro'","today",
        "under","until","we'll","we're","we've","where","which",
        "while","who'd","who's","whose","whoso","won't","would",
        "you'd","yours","youse","aboard","across",
        "allyou","amidst","anyone","aren't","around","before",
        "behind","beside","beyond","cannot","contra","couple",
        "didn't","during","either","eleven","except",
        "google","hadn't","hasn't","having","inside","itself",
        "myriad","myself","no-one","nobody","o’er",
        "quibus","she'll","she're","she've","should","sundry",
        "that'd","that's","theirs","they'd","thirty","this'd",
        "thwart","tother","toward","twelve","twenty","unless",
        "unlike","versus","wasn't","what's","whence","whilst",
        "withal","within","you'll","you're","you've","your'n",
        "against","ain’t","amongst","another","anybody",
        "astride","athwart","because","beneath","besides","between",
        "betwixt","can’t","despite","doesn't","don’t",
        "haven't","herself","himself","hisself",
        "however","hundred","isn’t","neither","nothing",
        "oneself","ourself","outside","outwith","pending","perhaps",
        "several","someone","that'll","there's",
        "they'll","they're","they've","this'll","through","thro’",
        "thyself","towards","weren't","whereby","wherein","whereof",
        "whereon","whereto","whether","whoever","without","won’t",
        "you-all","aren’t","didn’t","hadn’t","hasn’t","wasn’t",
        "doesn’t","haven’t","weren’t"];
    var default_stopwords={}; 
    var is=0, islim=default_stopwords_init.length;
    while (is<islim) {
        var stop_word=default_stopwords_init[is++];
        default_stopwords[stop_word]=stop_word;}

    function TextIndex(opts){
        if (!(opts)) opts={};
        var stopfns=opts.stopfns||false, stopwords={};
        var rootfns=opts.rootfns||false, rootmap={};
        var termindex={}, idterms={}, allterms=[], allids=[];
        var i, lim;
        
        function _indexer(string,id){
            var stdtext=stdspace(string).replace(/­/g,"");
            var words=stdtext.split(/\b/g), termlist=[];
            var i=0, lim=words.length;
            while (i<lim) {
                var term=words[i++], iscap=/[A-Z][^A-Z]/.exec(term);
                if (term.length<2) continue;
                else if (term.search(/\w/)<0) continue;
                else if (stopwords.hasOwnProperty(term)) continue;
                else if ((iscap)&&(stopwords.hasOwnProperty(term.toLowerCase())))
                    continue;
                else if (stopfns) {
                    var fn=0, fns=stopfns.length;
                    while (fn<fns) {
                        if ((stopfns[fn++])(term)) continue;}}
                else {
                    termlist.push(term);
                    if (rootmap.hasOwnProperty(term)) {
                        var roots=rootmap[term];
                        if (typeof roots === "string")
                            termlist.push(roots);
                        else termlist=termlist.concat(roots);}
                    if (rootfns) {
                        var rootfn=0, nrootfns=rootfns.length;
                        while (rootfn<nrootfns) {
                            var r=rootfns[rootfn++](term);
                            if (typeof r === "string")
                                termlist.push(r);
                            else termlist=termlist.concat(r);}}}}
            var ti=0, tlim=termlist.length;
            if (idterms.hasOwnProperty(id)) {
                idterms[id]=idterms[id].concat(termlist);}
            else {
                idterms[id]=termlist;
                allids.push(id);}
            while (ti<tlim) {
                var t=termlist[ti++];
                if (termindex.hasOwnProperty(t))
                    termindex[t].push(id);
                else {
                    allterms.push(t);
                    termindex[t]=[id];}}}

        function stopWord(s){
            if (stopwords.hasOwnProperty(s)) return true;
            if (stopfns) {
                var i=0, lim=stopfns.length;
                while (i<lim) {
                    if ((stopfns[i++])(s)) return true;}
                return false;}
            else return false;}
        
        function getRoots(s){
            var roots=rootmap[s]||[];
            var i=0, lim=rootfns.length; while (i<lim) {
                var r=rootfns[i++](s);
                if (!(r)) {}
                else if (typeof r === "string")
                    roots.push(r);
                else roots=roots.concat(r);}
            return roots;}
        
        function mergeTerms(){
            var i=0, lim=allterms.length;
            while (i<lim) {
                var term=allterms[i++];
                if (term.search(/[A-Z][a-z]/)===0) {
                    var lterm=term.toLowerCase();
                    if (termindex.hasOwnProperty(lterm))
                        termindex[lterm]=(
                            termindex[lterm].concat(termindex[term]));}}}
        
        function finishIndex(index){
            var newterms=[], newindex={};
            var i=0, lim=allterms.length, moved=[];
            var capwords=index.capwords;
            while (i<lim) {
                var term=allterms[i++];
                if (term.search(/[A-Z][a-z]/)===0) {
                    var lterm=term.toLowerCase();
                    if (!(termindex.hasOwnProperty(lterm))) {
                        newindex[term]=termindex[term];
                        newterms.push(term);}
                    else if (capwords.hasOwnProperty(term)) {
                        newindex[term]=termindex[term];
                        newterms.push(term);}
                    else moved.push(term);}
                else {
                    newindex[term]=termindex[term];
                    newterms.push(term);}}
            i=0; lim=moved.length; while (i<lim) {
                var move=moved[i++], l=move.toLowerCase();
                newindex[l]=newindex[l].concat(termindex[move]);}
            index.termindex=termindex=newindex;
            index.allterms=allterms=newterms;}
        
        if (!(this instanceof TextIndex))
            return new TextIndex(opts);
        else {
            this._indexer=_indexer;

            if (opts.stopwords) {
                var istops=opts.stopwords;
                i=0; lim=istops.length; while (i<lim) {
                    var stop=istops[i++];
                    stopwords[stop]=stop;}}
            
            if (opts.stdstops) {
                var is=0, islim=default_stopwords_init.length;
                while (is<islim) {
                    var stop_word=default_stopwords_init[is++];
                    stopwords[stop_word]=stop_word;}}

            this.capwords=opts.capwords||{};
            this.termindex=termindex;
            this.idterms=idterms;
            this.allterms=allterms;
            this.allids=allids;
            this.opts=opts;
            this.stopWord=stopWord;
            this.getRoots=getRoots;
            this.mergeTerms=mergeTerms;
            this.finishIndex=function(){finishIndex(this);};

            return this;}}

    TextIndex.default_stops=default_stopwords;
            
    TextIndex.prototype.indexText=function(arg,id){
        var indexer=this._indexer;
        if (typeof arg === "string") {
            if (id) indexer(arg,id);}
        else if (arg.nodeType) {
            if (!(id)) id=arg.id;
            if (id) indexer(textify(arg),id);}
        else if (arg.length) {
            var i=0, lim=arg.length; while (i<lim) {
                var node=arg[i++]; 
                if ((node.nodeType===1)&&(node.id))
                    indexer(textify(node),node.id);}}
        else {}};

    TextIndex.prototype.prefixTree=function(){
        if (this.prefixtree) return this.prefixtree;
        else {
            var ptree=this.prefixtree={strings: []};
            var prefixAdd=fdjtString.prefixAdd;
            var allterms=this.allterms;
            var i=0, lim=allterms.length;
            while (i<lim) {
                var term=allterms[i++];
                prefixAdd(ptree,term,0);}
            return ptree;}};

    return TextIndex;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/ui.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));
if (!(fdjt.UI)) fdjt.UI={};
if (!(fdjt.UI.CoHi)) fdjt.UI.CoHi={classname: "cohi"};
if (!(fdjt.UI.AutoPrompt)) fdjt.UI.AutoPrompt={};
if (!(fdjt.UI.InputHelp)) fdjt.UI.InputHelp={};
if (!(fdjt.UI.Ellipsis)) fdjt.UI.Ellipsis={};
if (!(fdjt.UI.Expansion)) fdjt.UI.Expansion={};
if (!(fdjt.UI.Collapsible)) fdjt.UI.Collapsible={};
if (!(fdjt.UI.Tabs)) fdjt.UI.Tabs={};
if (!(fdjt.UI.MultiText)) fdjt.UI.MultiText={};
if (!(fdjt.UI.Reticle)) fdjt.UI.Reticle={};
if (!(fdjt.UI.FocusBox)) fdjt.UI.FocusBox={};

/* Co-highlighting */

/* When the mouse moves over a named element, the 'cohi' class is added to
   all elements with the same name. */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;

    var highlights={};
    function highlight(namearg,classname_arg){
        var classname=((classname_arg) || (fdjtUI.CoHi.classname));
        var newname=(namearg.name)||(namearg);
        var cur=highlights[classname];
        var i, n;
        if (cur===newname) return;
        if (cur) {
            var drop=document.getElementsByName(cur);
            i=0; n=drop.length;
            while (i<n) fdjtDOM.dropClass(drop[i++],classname);}
        highlights[classname]=newname||false;
        if (newname) {
            var elts=document.getElementsByName(newname);
            n=elts.length; i=0;
            while (i<n) fdjtDOM.addClass(elts[i++],classname);}}
    fdjtUI.CoHi.highlight=highlight;
    
    fdjtUI.CoHi.onmouseover=function cohi_onmouseover(evt,classname_arg){
        var target=fdjtDOM.T(evt);
        while (target) {
            if (target.nodeType===3) target=target.parentNode;
            else if (target.nodeType!==1) {target=false; break;}
            if ((target.tagName==='INPUT') || (target.tagName==='TEXTAREA') ||
                ((target.tagName==='A') && (target.href)))
                return;
            else if ((target.name)||(target.getAttribute("name")))
                break;  
            else target=target.parentNode;}
        if (!(target)) return;
        highlight(target.name||target.getAttribute("name"),classname_arg);};
    fdjtUI.CoHi.onmouseout=function cohi_onmouseout(evt,classname_arg){
        highlight(false,((classname_arg) || (fdjtUI.CoHi.classname)));};
})();


/* Text highlighting */

fdjt.UI.Highlight=(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;

    var highlight_class="fdjthighlight";
    var hasClass=fdjtDOM.hasClass;
    var hasParent=fdjtDOM.getParent;
    var getStyle=fdjtDOM.getStyle;

    function textnode(s){
        return document.createTextNode(s);}

    function gatherHighlights(node,classpat,into){
        if (node.nodeType!==1) return;
        if (node.childNodes) {
            var children=node.childNodes;
            var i=0, lim=children.length;
            while (i<lim) gatherHighlights(children[i++],classpat,into);}
        if ((node.className)&&(node.className.search)&&
            (node.className.search(classpat)>=0)) {
            into.push(node);}}

    function unwrap_hnode(hnode){
        var ch=hnode.childNodes;
        if (ch) {
            var frag=document.createDocumentFragment();
            var tomove=[], j=0, n=((ch)&&(ch.length));
            while (j<n) tomove.push(ch[j++]);
            j=0; n=tomove.length;
            while (j<n) frag.appendChild(tomove[j++]);
            fdjtDOM.replace(hnode,frag);}
        else fdjtDOM.remove(hnode);}
    
    function clear_highlights(node,hclass){
        var h=[];
        if ((node===hclass)||(hasClass(node,hclass))) h=[node];
        else gatherHighlights(node,new RegExp("\\b"+hclass+"\\b","g"),h);
        var i=0 , lim=h.length;
        while (i<lim) unwrap_hnode(h[i++]);}

    function highlight_node(node,hclass,htitle,hattribs){
        if (!(hclass)) hclass=highlight_class;
        var hispan=false;
        if (node.nodeType===3) {
            var text=node.nodeValue;
            if (text.search(/\S/g)>=0)
                hispan=fdjtDOM("span."+hclass);
            else {
                var parent=node.parentNode, style=getStyle(parent);
                var next=node.nextSibling, prev=node.prevSibling;
                var nstyle=next&&(next.nodeType===1)&&getStyle(next);
                var pstyle=prev&&(prev.nodeType===1)&&getStyle(prev);
                var ndisplay=nstyle&&nstyle.display;
                var pdisplay=pstyle&&pstyle.display;
                if (style.whiteSpace!=='normal')
                    hispan=fdjtDOM("span."+hclass);
                else if (!((next)||(prev)))
                    hispan=fdjtDOM("span."+hclass);
                else if ((!((ndisplay==='inline')||(ndisplay==='table-cell')))&&
                         (!((pdisplay==='inline')||(pdisplay==='table-cell'))))
                    hispan=false;
                else hispan=fdjtDOM("span."+hclass);}}
        else if ((node.nodeType!==1)||(hasClass(node,hclass)))
            return node;
        else if (hasClass(node,"fdjtskiptext")) {}
        else {
            var nodestyle=getStyle(node);
            var display=nodestyle.display;
            var position=nodestyle.position;
            if ((position!=="static")&&(position!=="")) {}
            else if (display==="block")
                hispan=(fdjtDOM("div."+hclass));
            else if (display==="inline")
                hispan=fdjtDOM("span."+hclass);
            else {}}
        if (!(hispan)) return node;
        if (htitle) hispan.title=htitle;
        if (hattribs) {
            for (var attrib in hattribs) {
                if (hattribs.hasOwnProperty(attrib))
                    hispan.setAttribute(attrib,hattribs[attrib]);}}
        fdjtDOM.replace(node,hispan);
        hispan.appendChild(node);
        return hispan;}
    function highlight_text(text,hclass,htitle,hattribs){
        var tnode=fdjtDOM("span."+(hclass||highlight_class),text);
        if (htitle) tnode.title=htitle;
        if (hattribs) {
            for (var attrib in hattribs) {
                if (hattribs.hasOwnProperty(attrib))
                    tnode.setAttribute(attrib,hattribs[attrib]);}}
        return tnode;}
    function highlight_node_range(node,start,end,hclass,htitle,hattribs){
        var stringval=node.nodeValue;
        var parent=node.parentNode;
        if ((end===false)||(typeof end === 'undefined'))
            end=stringval.length;
        if (start===end) return;
        var beginning=((start>0)&&(textnode(stringval.slice(0,start))));
        var middle=highlight_text(
            stringval.slice(start,end),hclass,htitle,hattribs);
        var ending=((end<stringval.length)&&
                    (textnode(stringval.slice(end))));
        if ((beginning)&&(ending)) {
            parent.replaceChild(ending,node);
            parent.insertBefore(middle,ending);
            parent.insertBefore(beginning,middle);}
        else if (beginning) {
            parent.replaceChild(middle,node);
            parent.insertBefore(beginning,middle);}
        else if (ending) {
            parent.replaceChild(ending,node);
            parent.insertBefore(middle,ending);}
        else parent.replaceChild(middle,node);
        return middle;}
    function highlight_range(range,hclass,htitle,hattribs){
        range=fdjtDOM.refineRange(range);
        var starts_in=range.startContainer;
        var ends_in=range.endContainer;
        if (starts_in===ends_in)
            return [highlight_node_range(
                starts_in,range.startOffset,range.endOffset,
                hclass,htitle,hattribs)];
        else {
            var highlights=[];
            var scan=starts_in;
            while ((scan)&&(!(scan.nextSibling)))
                scan=scan.parentNode;
            scan=scan.nextSibling;
            while (scan) {
                if (scan===ends_in) break;
                else if (hasParent(ends_in,scan))
                    scan=scan.firstChild;
                else {
                    var next=scan;
                    while ((next)&&(!(next.nextSibling)))
                        next=next.parentNode;
                    next=next.nextSibling;
                    highlights.push(
                        highlight_node(scan,hclass,htitle,hattribs));
                    scan=next;}}
            // Do the ends
            highlights.push(
                highlight_node_range(
                    starts_in,range.startOffset,false,hclass,htitle,hattribs));
            highlights.push(
                highlight_node_range(
                    ends_in,0,range.endOffset,hclass,htitle,hattribs));
            return highlights;}}

    highlight_range.clear=clear_highlights;
    highlight_range.remove=unwrap_hnode;
    highlight_range.highlight=highlight_range;
    return highlight_range;})();



/* CheckSpans:
   Text regions which include a checkbox where clicking toggles the checkbox. */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;
    var fdjtID=fdjt.ID;

    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;
    var getParent=fdjtDOM.getParent;
    var getChildren=fdjtDOM.getChildren;

    function CheckSpan(spec,varname,val,checked){
        var input=fdjtDOM.Input('input[type=checkbox]',varname,val);
        var span=fdjtDOM(spec||"span.checkspan",input);
        if (checked) {
            input.checked=true;
            fdjtDOM.addClass(span,"ischecked");}
        else input.checked=false;
        if (arguments.length>4) 
            fdjtDOM.appendArray(span,arguments,4);
        return span;}
    fdjtUI.CheckSpan=CheckSpan;

    function checkable(elt){
        return (elt.nodeType===1)&&
            (elt.tagName==='INPUT')&&
            ((elt.type==='checkbox')||(elt.type==='radio'));}
    function getcheckable(elt){
        if (checkable(elt)) return elt;
        var cb=getParent(elt,checkable);
        if (cb) return cb;
        cb=getChildren(elt,'input');
        if (cb.length) {
            var i=0; var lim=cb.length;
            while (i<lim)
                if (checkable(cb[i])) return cb[i]; else i++;
            return false;}
        else return false;}

    function checkspan_set(target,checked) {
        var i, lim;
        if (typeof target === 'string') target=fdjtID(target);
        else if (target.length) {
            i=0; lim=target.length;
            while (i<lim) checkspan_set(target[i++],checked);
            return;}
        if ((!(target))||(!(target.nodeType))) return;
        var checkspan=((hasClass(target,"checkspan"))?(target):
                       (getParent(target,".checkspan")));
        if (!(checkspan)) return false;
        var checkbox=((checkable(target))&&(target))||
            (getcheckable(target))||
            (getcheckable(checkspan));
        if (!(checkbox)) return false;
        if (hasClass(checkspan,"isdisabled")) {
            if (checkbox.disabled) return false;
            else dropClass(checkspan,"isdisabled");}
        else if (checkbox.disabled) {
            addClass(checkspan,"isdisabled");
            return false;}
        var ischecked=hasClass(checkspan,"ischecked");
        var changed=false; var unchecked=[];
        if (typeof checked === 'undefined') checked=ischecked;
        if (checkbox.checked!==checked) {
            checkbox.checked=checked; changed=true;}
        // If the checkspan is inconsistent, the checkbox was probably
        // just changed
        else if (ischecked!==checkbox.checked) changed=true;
        else {}
        // We change this anyway, just in case there's been a glitch
        if (checked) addClass(checkspan,"ischecked");
        else dropClass(checkspan,"ischecked");
        if ((changed)&&(checkbox.type==='radio')) {
            var form=checkbox.form;
            if (!(form)) form=getParent(checkbox,".fdjtinputs");
            if (!(form)) form=checkspan.parentNode;
            var name=checkbox.name;
            var tosync=getChildren(form,'input');
            i=0; lim=tosync.length;
            while (i<lim) {
                var input=tosync[i++];
                if (input===checkbox) continue;
                else if ((input.type==='radio')&&
                         (input.name===name)) {
                    var cspan=getParent(input,".checkspan");
                    if (cspan===checkspan) continue;
                    else if (hasClass(cspan,"ischecked"))
                        if (!(input.checked)) unchecked.push(input);}
                else {}}}
        var evt;
        if (changed) {
            evt=document.createEvent("HTMLEvents");
            evt.initEvent("change",false,true);
            checkbox.dispatchEvent(evt);}
        if (unchecked.length) {
            i=0; lim=unchecked.length;
            while (i<lim) {
                var uncheck=unchecked[i++];
                var altspan=getParent(uncheck,".checkspan");
                dropClass(altspan,"ischecked");
                evt=document.createEvent("HTMLEvents");
                evt.initEvent("change",false,true);
                uncheck.dispatchEvent(evt);}}}
    fdjtUI.CheckSpan.set=checkspan_set;

    function checkspan_onclick(evt) {
        evt=evt||window.event;
        var target=evt.target||evt.srcTarget;
        if ((target.tagName==='TEXTAREA')||
            (target.tagName==='SELECT')||
            (target.tagName==='OPTION')||
            ((target.tagName==='INPUT')&&
             (!((target.type==='checkbox')||
                (target.type==='radio')))))
            return;
        var anchor=((target.tagName==='A')?(target):
                    (getParent(target,'A')));
        if ((anchor)&&(anchor.href)) return;
        var checkspan=getParent(target,".checkspan");
        if (!(checkspan)) return;
        var checked=hasClass(checkspan,"ischecked");
        checkspan_set(target,(!(checked)));
        return false;}
    fdjtUI.CheckSpan.onclick=checkspan_onclick;    

    function changed(evt) {
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        if ((target.type==='radio')||(target.type==='checkbox')) {
            var checkspan=getParent(target,'.checkspan');
            if (checkspan)
                ((target.checked)?(addClass):(dropClass))(
                    checkspan,"ischecked");}
        if (target.type==='radio') {
            var form=target.form;
            var others=document.getElementsByName(target.name);
            var i=0, lim=others.length;
            while (i<lim) {
                var other=others[i++];
                if (other===target) continue;
                else if (other.form!==form) continue;
                else if (other.type !== 'radio') continue;
                var ocs=fdjtDOM.getParent(other,'.checkspan');
                dropClass(ocs,"ischecked");}}}
    fdjtUI.CheckSpan.changed=changed;

    function initCheckspans(){
        var checkspans=fdjt.$(".checkspan");
        var i=0, lim=checkspans.length;
        while (i<lim) {
            var checkspan=checkspans[i++];
            var inputs=fdjtDOM.getInputs(checkspan);
            var j=0, jlim=inputs.length;
            while (j<jlim) {
                var input=inputs[j++];
                if ((input.type==='radio')||(input.type==='checkspan')) {
                    if (input.checked) addClass(checkspan,"ischecked");
                    if (input.disabled) addClass(checkspan,"isdisabled");
                    break;}}}}
    fdjtUI.CheckSpan.initCheckspans=initCheckspans;

    fdjt.addInit(initCheckspans,"CheckSpans",false);

})();


/* Progress boxes */

fdjt.UI.ProgressBar=(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    function ProgressBar(arg){
        if (typeof arg==='undefined')
            arg=fdjtDOM("div.fdjtprogress",
                        fdjtDOM("div.indicator"),fdjtDOM("div.message"));
        else if (typeof arg==='string')
            arg=fdjtDOM("div.fdjtprogress",
                        fdjtDOM("HR"),fdjtDOM("div.message",arg));
        this.dom=arg;
        return this;}

    function setProgress(pb,progress,total){
        if (typeof pb==='string')
            pb=document.getElementById(pb);
        if (typeof total==='number')
            progress=100*(progress/total);
        if (!(pb)) return;
        var dom=((pb.dom)||(pb));
        if (!(dom.nodeType)) return;
        var rule=fdjtDOM.getChildren(dom,"div.indicator")[0];
        rule.style.width=progress+"%";}
    function setMessage(pb){
        if (typeof pb==='string')
            pb=document.getElementById(pb);
        if (!(pb)) return;
        var dom=((pb.dom)||(pb));
        if (!(dom.nodeType)) return;
        var oldmsg=fdjtDOM.getChildren(dom,".message")[0];
        var newmsg=fdjtDOM("div.message");
        fdjtDOM.appendArray(newmsg,fdjtDOM.Array(arguments,1));
        dom.replaceChild(newmsg,oldmsg);}
    
    ProgressBar.setProgress=setProgress;
    ProgressBar.setMessage=setMessage;
    ProgressBar.prototype.setProgress=function(progress,total){
        setProgress(this.dom,progress,total);};
    ProgressBar.prototype.setMessage=function(){
        var dom=this.dom;
        var oldmsg=fdjtDOM.getChildren(dom,".message")[0];
        var newmsg=fdjtDOM("div.message");
        fdjtDOM.appendArray(newmsg,fdjtDOM.Array(arguments));
        dom.replaceChild(newmsg,oldmsg);};

    return ProgressBar;})();


/* Automatic help display on focus */

(function(){
    "use strict";

    var fdjtString=fdjt.String;
    var fdjtDOM=fdjt.DOM;
    var fdjtID=fdjt.ID;

    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;

    function show_help_onfocus(evt){
        var target=fdjtDOM.T(evt);
        while (target)
            if ((target.nodeType===1) &&
                ((target.tagName === 'INPUT') ||
                 (target.tagName === 'TEXTAREA')) &&
                (target.getAttribute('helptext'))) {
                var helptext=fdjtID(target.getAttribute('helptext'));
                if (helptext) fdjtDOM.addClass(helptext,"showhelp");
                return;}
        else target=target.parentNode;}
    function autoprompt_onfocus(evt){
        evt=evt||window.event||null;
        var elt=fdjtDOM.T(evt);
        if ((elt) && (hasClass(elt,'isempty'))) {
            elt.value=''; dropClass(elt,'isempty');}
        show_help_onfocus(evt);}

    function hide_help_onblur(evt){
        var target=fdjtDOM.T(evt);
        while (target)
            if ((target.nodeType===1) &&
                ((target.tagName === 'INPUT') || (target.tagName === 'TEXTAREA')) &&
                (target.getAttribute('HELPTEXT'))) {
                var helptext=fdjtID(target.getAttribute('HELPTEXT'));
                if (helptext) dropClass(helptext,"showhelp");
                return;}
        else target=target.parentNode;}
    function autoprompt_onblur(evt){
        var elt=fdjtDOM.T(evt);
        if (elt.value==='') {
            addClass(elt,'isempty');
            var prompt=(elt.prompt)||(elt.getAttribute('prompt'))||(elt.title);
            if (prompt) elt.value=prompt;}
        else dropClass(elt,'isempty');
        hide_help_onblur(evt);}
    
    // Removes autoprompt text from empty fields
    function autoprompt_cleanup(form) {
        var elements=fdjtDOM.getChildren(form,".isempty");
        if (elements) {
            var i=0; var lim=elements.length;
            while (i<lim) elements[i++].value="";}}
    function autoprompt_onsubmit(evt) {
        var form=fdjtDOM.T(evt);
        autoprompt_cleanup(form);}

    var isEmpty=fdjtString.isEmpty;
    // Adds autoprompt handlers to autoprompt classes
    function autoprompt_setup(arg,nohandlers) {
        var forms=
            ((arg.tagName==="FORM")?[arg]:
             (fdjtDOM.getChildren(arg||document.body,"FORM")));
        var i=0; var lim=forms.length;
        while (i<lim) {
            var form=forms[i++];
            var inputs=fdjtDOM.getChildren
            (form,"INPUT.autoprompt,TEXTAREA.autoprompt");
            if (inputs.length) {
                var j=0; var jlim=inputs.length;
                while (j<jlim) {
                    var input=inputs[j++];
                    input.blur();
                    if (isEmpty(input.value)) {
                        addClass(input,"isempty");
                        var prompt=(input.prompt)||
                            (input.getAttribute('prompt'))||(input.title);
                        if (prompt) input.value=prompt;}
                    if (!(nohandlers)) {
                        fdjtDOM.addListener(input,"focus",autoprompt_onfocus);
                        fdjtDOM.addListener(input,"blur",autoprompt_onblur);}}
                if (!(nohandlers))
                    fdjtDOM.addListener(form,"submit",autoprompt_onsubmit);}}}
    
    fdjt.UI.AutoPrompt.setup=autoprompt_setup;
    fdjt.UI.AutoPrompt.onfocus=autoprompt_onfocus;
    fdjt.UI.AutoPrompt.onblur=autoprompt_onblur;
    fdjt.UI.AutoPrompt.onsubmit=autoprompt_onsubmit;
    fdjt.UI.AutoPrompt.cleanup=autoprompt_cleanup;
    fdjt.UI.InputHelp.onfocus=show_help_onfocus;
    fdjt.UI.InputHelp.onblur=hide_help_onblur;})();

/* Automatic classes for focused children */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM, fdjtUI=fdjt.UI;
    var addListener=fdjtDOM.addListener;
    function fdjt_focusin(evt){
        var scan=fdjtUI.T(evt), add=[]; 
        if ((scan.tagName==='TEXTAREA')||
            ((scan.tagName==='INPUT')&&
             (/text|email/i.exec(scan.type)))) {
            while (scan) {
                var classname=scan.className;
                if ((classname)&&(typeof classname === "string")&&
                    (classname.search(/\bfdjtfoci\b/)>=0)&&
                    (classname.search(/\bfdjtfocus\b/)<0))
                    add.push(scan);
                scan=scan.parentNode;}
            if (add.length) 
                setTimeout(function(){
                    var i=0; while (i<add.length) {
                        var elt=add[i++], classname=elt.className;
                        elt.className=classname+" fdjtfocus";}},
                           300);}}
    fdjtUI.focusin=fdjt_focusin;
    addListener(window,"focusin",fdjt_focusin);
    function fdjt_focusout(evt){
        var scan=fdjtUI.T(evt), drop=[];
        if ((scan.tagName==='TEXTAREA')||
            ((scan.tagName==='INPUT')&&
             (/text|email/i.exec(scan.type)))) {
            while (scan) {
                var classname=scan.className;
                if ((classname)&&(typeof classname === "string")&&
                    (classname.search(/\bfdjtfocus\b/)>=0))
                    drop.push(scan);
                scan=scan.parentNode;}
            if (drop.length) 
                setTimeout(function(){
                    var i=0; while (i<drop.length) {
                        var elt=drop[i++], classname=elt.className;
                        elt.className=classname.replace(/ fdjtfocus\b/,"");}},
                           300);}}
    fdjtUI.focusout=fdjt_focusout;
    addListener(window,"focusout",fdjt_focusout);
})();

/* Text input boxes which create checkspans on enter. */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;
    var fdjtString=fdjt.String;
    var isEmpty=fdjtString.isEmpty;
    var hasClass=fdjtDOM.hasClass;

    function multitext_keypress(evt,sepchars,sepexp,fn){
        // sepchars are characters which function just like 'Return'
        // sepexp is a regular expression which is used to split an
        //   input string into multiple values
        evt=(evt)||(event);
        var chcode=evt.charCode, ch=String.fromCharCode(chcode);
        var target=fdjtUI.T(evt);
        if  (sepchars instanceof RegExp) {
            sepexp=sepchars; sepchars=false;}
        else if ((sepchars)&&(sepchars.call)) {
            fn=sepchars; sepchars=false;}
        else {}
        if ((!sepchars)&&(target.getAttribute("data-sepchars")))
            sepchars=target.getAttribute("data-sepchars");
        if ((chcode===13)&&(isEmpty(target.value))&&
            (hasClass(target,"fdjtentersubmit"))) {
            fdjt.UI.cancel(evt);
            target.form.submit();
            return;}
        if ((chcode===13)||
            ((sepchars)&&((sepchars.indexOf(ch))>=0))) {
            if ((!(sepexp))&&(target.getAttribute("data-separator")))
                sepexp=new RegExp(target.getAttribute("data-separator"),"g");
            var checkspec=
                target.getAttribute("data-checkspec")||"div.checkspan";
            var values=((sepexp)?(target.value.split(sepexp)):[target.value]);
            var i=0, lim=values.length; while (i<lim) {
                var value=values[i++];
                if (fn)
                    fdjtDOM(target.parentNode,"\n",fn(target.name,value));
                else {
                    var checkbox=
                        fdjtDOM.Input("[type='checkbox']",target.name,value);
                    var checkelt=fdjtDOM(checkspec,checkbox,value);
                    checkbox.checked=true;
                    fdjtDOM.addClass(checkelt,"ischecked");
                    fdjtDOM(target.parentNode,"\n",checkelt);}}
            fdjtUI.cancel(evt);
            target.value='';}}
    fdjtUI.MultiText.keypress=multitext_keypress;})();


/* Tabs */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtLog=fdjt.Log;
    var fdjtState=fdjt.State;
    var fdjtUI=fdjt.UI;
    var fdjtID=fdjt.ID;

    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;
    
    function tab_onclick(evt,shownclass){
        var elt=fdjtUI.T(evt);
        if (!(shownclass)) {
            shownclass=
                fdjtDOM.findAttrib(elt,"shownclass","http://fdjt.org/")||
                "fdjtshown";}
        if (elt) {
            var content_id=false;
            while (elt.parentNode) {
                if ((content_id=fdjtDOM.getAttrib(elt,"contentid"))) break;
                else elt=elt.parentNode;}
            if (!(content_id)) return;
            var content=document.getElementById(content_id);
            var parent=fdjtDOM.getParent(elt,".tabs")||elt.parentNode;
            var sibs=fdjtDOM.getChildren(parent,".tab")||parent.childNodes;
            if (content===null) {
                fdjtLog("No content for "+content_id);
                return;}
            var i=0; while (i<sibs.length) {
                var node=sibs[i++]; var cid;
                if ((node.nodeType===1) &&
                    (cid=fdjtDOM.getAttrib(node,"contentid"))) {
                    if (!(cid)) continue;
                    var cdoc=document.getElementById(cid);
                    if (node===elt) {}
                    else if (hasClass(node,shownclass)) {
                        dropClass(node,shownclass);
                        if (cdoc) dropClass(cdoc,shownclass);}}}
            if (hasClass(elt,shownclass)) {
                dropClass(elt,shownclass);
                dropClass(content,shownclass);}
            else {
                addClass(elt,shownclass);
                addClass(content,shownclass);}
            var tabstate=fdjtDOM.findAttrib(elt,'tabstate');
            if (!(tabstate)) {}
            else if (tabstate==='#') {
                var scrollstate={};
                fdjtUI.scrollSave(scrollstate);
                document.location.hash=tabstate+content_id;
                fdjtUI.scrollRestore(scrollstate);}
            else fdjtState.setCookie(tabstate,content_id);
            // This lets forms pass tab information along
            return false;}}
    fdjtUI.Tabs.click=tab_onclick;
    
    function select_tab(tabbar,contentid,shownclass){
        if (!(shownclass)) {
            shownclass=
                fdjtDOM.findAttrib(tabbar,"shownclass","http://fdjt.org/")||
                "fdjtshown";}
        var tabseen=false;
        var tabs=fdjtDOM.getChildren(tabbar,".tab");
        var i=0; while (i<tabs.length) {
            var tab=tabs[i++];
            if ((tab.getAttribute("contentid"))===contentid) {
                addClass(tab,shownclass); tabseen=true;}
            else if (hasClass(tab,shownclass)) {
                dropClass(tab,shownclass);
                var cid=fdjtDOM.getAttrib(tab,"contentid");
                var content=(cid)&&fdjtID(cid);
                if (!(content))
                    fdjtLog.warn("No reference for tab content %o",cid);
                else dropClass(content,shownclass);}
            else dropClass(tab,shownclass);}
        if (fdjtID(contentid)) {
            if (tabseen) addClass(contentid,shownclass);
            else fdjtLog.warn("a tab for %s was not found in %o",
                              contentid,tabbar);}
        else fdjtLog.warn("No reference for tab content %o",contentid);}
    fdjtUI.Tabs.selectTab=select_tab;
    
    function setupTabs(elt){
        if (!(elt)) elt=fdjtDOM.$(".tabs[tabstate]");
        else if (typeof elt === 'string') elt=fdjtID(elt);
        if ((!(elt))||(!(elt.getAttribute("tabstate")))) return;
        var tabstate=elt.getAttribute("tabstate");
        var content_id=false;
        if (tabstate==='#') {
            content_id=document.location.hash;
            if (content_id[0]==='#') content_id=content_id.slice(1);
            var content=((content_id)&&(fdjtID(content_id)));
            if (!(content)) return;
            var ss={}; fdjtUI.scrollSave(ss);
            window.scrollTo(0,0);
            if (!(fdjtDOM.isVisible(content)))
                fdjtUI.scrollRestore(ss);}
        else content_id=fdjtState.getQuery(tabstate)||
            fdjtState.getCookie(tabstate);
        if (!(content_id)) return;
        if (content_id[0]==='#') content_id=content_id.slice(1);
        if (content_id) select_tab(elt,content_id);}
    fdjtUI.Tabs.setup=setupTabs;
    
    function selected_tab(tabbar){
        var tabs=fdjtDOM.getChildren(tabbar,".tab");
        var i=0; while (i<tabs.length) {
            var tab=tabs[i++];
            if (hasClass(tab,"shown"))
                return tab.getAttribute("contentid");}
        return false;}
    fdjtUI.Tabs.getSelected=selected_tab;}());



/* Collapse/Expand */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;

   fdjtUI.Expansion.toggle=function(evt,spec,exspec){
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        var wrapper=fdjtDOM.getParent(target,spec||".fdjtexpands");
        if (wrapper) fdjtDOM.toggleClass(wrapper,exspec||"fdjtexpanded");};
    fdjtUI.Expansion.onclick=fdjtUI.Expansion.toggle;

    fdjtUI.Collapsible.click=function(evt){
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        if (fdjtUI.isDefaultClickable(target)) return;
        var wrapper=fdjtDOM.getParent(target,".collapsible");
        if (wrapper) {
            fdjtUI.cancel(evt);
            fdjtDOM.toggleClass(wrapper,"expanded");}};

    fdjtUI.Collapsible.focus=function(evt){
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        var wrapper=fdjtDOM.getParent(target,".collapsible");
        if (wrapper) {
            fdjtDOM.toggleClass(wrapper,"expanded");}};
    
    fdjtUI.toggleParent=function toggleParent(evt,spec,classname){
        var target=fdjtUI.T(evt);
        var parent=fdjtDOM.getParent(target,spec);
        if (parent) fdjtDOM.toggleClass(parent,classname);};})();


/* Temporary Scrolling */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;

    var saved_scroll=false;
    var use_native_scroll=false;
    var preview_elt=false;

    function scroll_discard(ss){
        if (ss) {
            ss.scrollX=false; ss.scrollY=false;}
        else saved_scroll=false;}

    function scroll_save(ss){
        if (ss) {
            ss.scrollX=window.scrollX; ss.scrollY=window.scrollY;}
        else {
            if (!(saved_scroll)) saved_scroll={};
            saved_scroll.scrollX=window.scrollX;
            saved_scroll.scrollY=window.scrollY;}}

    function scroll_into_view(elt,topedge){
        if ((topedge!==0) && (!topedge) && (fdjtDOM.isVisible(elt)))
            return;
        else if ((use_native_scroll) && (elt.scrollIntoView)) {
            elt.scrollIntoView(topedge);
            if ((topedge!==0) && (!topedge) && (fdjtDOM.isVisible(elt,true)))
                return;}
        else {
            var top = elt.offsetTop;
            var left = elt.offsetLeft;
            var height = elt.offsetHeight;
            
            while(elt.offsetParent) {
                elt = elt.offsetParent;
                top += elt.offsetTop;
                left += elt.offsetLeft;}
            
            var vh=fdjtDOM.viewHeight();
            var x=0; var y;
            var y_target=top+(height/3);
            if ((2*(height/3))<((vh/2)-50))
                y=y_target-vh/2;
            else if ((height)<(vh-100))
                y=top-(50+(height/2));
            else y=top-50;

            window.scrollTo(x,y);}}

    fdjtUI.scrollTo=function(target,id,context,discard,topedge){
        scroll_discard(discard);
        if (id) document.location.hash=id;
        if (context) {
            setTimeout(function() {
                scroll_into_view(context,topedge);
                if (!(fdjtDOM.isVisible(target))) {
                    scroll_into_view(target,topedge);}},
                       100);}
        else setTimeout(function() {scroll_into_view(target,topedge);},100);};

    function scroll_preview(target,context,delta){
        /* Stop the current preview */
        if (!(target)) {
            stop_preview(); return;}
        /* Already previewing */
        if (target===preview_elt) return;
        if (!(saved_scroll)) scroll_save();
        if (typeof target === 'number')
            window.scrollTo(((typeof context === 'number')&&(context))||0,target);
        else scroll_into_view(target,delta);
        preview_elt=target;}

    function scroll_restore(ss){
        if (preview_elt) {
            preview_elt=false;}
        if ((ss) && (typeof ss.scrollX === "number")) {
            // fdjtLog("Restoring scroll to %d,%d",ss.scrollX,ss.scrollY);    
            window.scrollTo(ss.scrollX,ss.scrollY);
            return true;}
        else if ((saved_scroll) &&
                 ((typeof saved_scroll.scrollY === "number") ||
                  (typeof saved_scroll.scrollX === "number"))) {
            // fdjtLog("Restoring scroll to %o",_fdjt_saved_scroll);
            window.scrollTo(saved_scroll.scrollX,saved_scroll.scrollY);
            saved_scroll=false;
            return true;}
        else return false;}

    function stop_preview(){
        fdjtDOM.dropClass(document.body,"preview");
        if ((preview_elt) && (preview_elt.className))
            fdjtDOM.dropClass(preview_elt,"previewing");
        preview_elt=false;}

    fdjtUI.scrollSave=scroll_save;
    fdjtUI.scrollRestore=scroll_restore;
    fdjtUI.scrollIntoView=scroll_into_view;
    fdjtUI.scrollPreview=scroll_preview;
    fdjtUI.scrollRestore=scroll_restore;}());


/* Smart (DOM-aware) scrolling */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;

    var getGeometry=fdjtDOM.getGeometry;
    var getStyle=fdjtDOM.getStyle;

    function smartScroll(win,off,content){
        if (typeof content==='undefined') content=win;
        if (off<=0) {win.scrollTop=0; return;}
        else {
            var block=findBreak(content,off,content);
            if (!(block)) {win.scrollTop=off; return;}
            var geom=getGeometry(block,content||win);
            if ((geom-top-off)<(win.offsetTop/4))
                win.scrollTop=geom.top;
            else win.scrollTop=off;}}
    function findBreak(node,off,container){
        var style=getStyle(node);
        var display=style.display;
        if ((display==='block')||(display==='table-row')||
            (display==='list-item')||(display==='preformatted')) {
            var geom=getGeometry(node,container);
            if (geom.top>off) return node;
            else if (geom.bottom>off) {
                if (style.pageBreakInside==='avoid')
                    return node;
                var children=node.childNodes;
                var i=0, lim=children.length;
                while (i<lim)  {
                    var child=children[i++];
                    var bk=((child.nodeType===1)&&
                            (findBreak(child,off,container)));
                    if (bk) return bk;}
                return node;}
            else return false;}
        else return false;}

    fdjt.UI.smartScroll=smartScroll;})();


/* Delays */

(function(){
    "use strict";

    fdjt.UI.Delay=function(interval,name,fcn){
        setTimeout(fcn,interval);};
    fdjt.UI.Delayed=function(fcn,interval){
        if (!(interval)) interval=25;
        setTimeout(fcn,interval);};})();

/* Triggering submit events */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;

    function dosubmit(evt){
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        var form=fdjtDOM.getParent(target,"FORM");
        var submit_event = document.createEvent("HTMLEvents");
        submit_event.initEvent('submit',false,true);
        form.dispatchEvent(submit_event);
        form.submit();}
    fdjtUI.dosubmit=dosubmit;

    function forceSubmit(form){
        var submit_event = document.createEvent("HTMLEvents");
        submit_event.initEvent('submit',false,true);
        form.dispatchEvent(submit_event);}
    fdjtUI.forceSubmit=forceSubmit;

    function submitOnEnter(evt){
        evt=evt||window.event;
        var kc=evt.keyCode||evt.charCode;
        if (kc===13) {
            var target=fdjtUI.T(evt);
            var form=fdjtDOM.getParent(target,'FORM');
            fdjtUI.cancel(evt);
            form.submit();}}
    fdjtUI.submitOnEnter=submitOnEnter;

    function checkFileInputs(evt){
        evt=evt||window.event;
        var form=fdjtUI.T(evt);
        var file_inputs=fdjtDOM.getInputs(form,false,"file");
        var i=0, lim=file_inputs.length; while (i<lim) {
            var input=file_inputs[i++];
            if ((!(input.value))||(input.value==="")) {
                fdjtUI.cancel(evt);
                (fdjt.UI.alert||window.alert)("You need to specify a file!");}}}
    fdjtUI.checkFileInputs=checkFileInputs;

}());

/* Looking for vertical box overflow */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;

    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;
    var getGeometry=fdjtDOM.getGeometry;
    var getInsideBounds=fdjtDOM.getInsideBounds;
    function checkOverflow(node){
        var geom=getGeometry(node);
        var inside=getInsideBounds(node);
        if (inside.bottom>geom.bottom) addClass(node,"overflow");
        else dropClass(node,"overflow");}
    fdjtUI.Overflow=checkOverflow;}());


/* Reticle based functions */

(function() {
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;

    var vreticle=false;
    var hreticle=false;
    function setXY(x,y){
        if  (vreticle) (vreticle).style.left=x+'px';
        if  (hreticle) (hreticle).style.top=y+'px';}
    function setupReticle(){
        if (!(vreticle)) {
            vreticle=fdjtDOM("div.reticle.vertical#VRETICLE"," ");
            fdjtDOM.prepend(document.body,vreticle);}
        if (!(hreticle)) {
            hreticle=fdjtDOM("div.reticle.horizontal#HRETICLE"," ");
            fdjtDOM.prepend(document.body,hreticle);}
        fdjtDOM.addListener(document,"mousemove",mousemove);
        fdjtDOM.addListener(document,"click",doflash);
        fdjtUI.Reticle.live=true;}
    
    function doflash(){flash();}

    function mousemove(evt,x,y){
        setXY(x||evt.clientX,y||evt.clientY);}
    
    var highlighted=false;
    
    function highlight(flag){
        if (typeof flag === 'undefined') flag=(!(highlighted));
        if (flag) {
            if (vreticle) fdjtDOM.addClass(vreticle,"highlight");
            if (hreticle) fdjtDOM.addClass(hreticle,"highlight");
            highlighted=true;}
        else {
            if (vreticle) fdjtDOM.dropClass(vreticle,"highlight");
            if (hreticle) fdjtDOM.dropClass(hreticle,"highlight");
            highlighted=false;}}
    
    function flash(howlong){
        if (typeof howlong === 'undefined') howlong=1500;
        if (highlighted) return;
        else {
            highlight(true);
            setTimeout(function(){highlight(false);},howlong);}}

    fdjtUI.Reticle.setup=setupReticle;
    fdjtUI.Reticle.highlight=highlight;
    fdjtUI.Reticle.flash=flash;
    fdjtUI.Reticle.onmousemove=mousemove;
    fdjtUI.Reticle.setXY=setXY;
    fdjtUI.Reticle.live=false;})();


/* File uploader affirmation handling */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;

    fdjtUI.uploadSpecified=function(evt){
        evt=evt||window.event;
        var parent=fdjtDOM.getParent(fdjtUI.T(evt),'.fileuploader');
        if (parent) fdjtDOM.addClass(parent,'inuse');};})();


/* Image swapping */

(function(){
    "use strict";
    var fdjtUI=fdjt.UI;
    var fdjtID=fdjt.ID;
    /* global setInterval: false */

    function ImageSwap(img,interval){
        if (typeof img==='string') img=fdjtID(img);
        if (!(img)) return false;
        if (!(interval))
            interval=((img.getAttribute('data-interval'))?
                      (parseInt((img.getAttribute('data-interval')),10)):
                      (ImageSwap.interval));
        if (!(img.getAttribute("data-images"))) {
            img.setAttribute("data-images",img.src);}
        if (!(img.defaultsrc)) img.defaultsrc=img.src;
        var images=(img.getAttribute('data-images')).split('|');
        if (images.length===0) return false;
        var counter=0;
        return setInterval(function(){
            if (img.src===images[counter]) counter++;
            else img.src=images[counter++];
            if (counter>=images.length) counter=0;},
                           interval);}
            
    ImageSwap.reset=function(img){
        if (img.defaultsrc) img.src=img.defaultsrc;};
    ImageSwap.interval=1000;

    fdjtUI.ImageSwap=ImageSwap;})();


/* Miscellaneous event-related functions */

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;
    var fdjtID=fdjt.ID;

    var hasClass=fdjtDOM.hasClass;
    
    fdjtUI.T=function(evt) {
        evt=evt||window.event; return (evt.target)||(evt.srcElement);};

    fdjtUI.noDefault=function(evt){
        evt=evt||window.event;
        if (evt.preventDefault) evt.preventDefault();
        else evt.returnValue=false;
        return false;};

    fdjtUI.noBubble=function(evt){
        evt=evt||window.event;
        evt.cancelBubble=true;};

    fdjtUI.cancel=function(evt){
        evt=evt||window.event;
        if (evt.preventDefault) evt.preventDefault();
        else evt.returnValue=false;
        evt.cancelBubble=true;
        return false;};

    fdjtUI.isClickable=function(target){
        if ((window.Event)&&(target instanceof window.Event))
            target=fdjtUI.T(target);
        while (target) {
            if (((target.tagName==='A')&&(target.href))||
                (target.tagName==="INPUT") ||
                (target.tagName==="BUTTON") ||
                (target.tagName==="TEXTAREA") ||
                (target.tagName==="SELECT") ||
                (target.tagName==="OPTION") ||
                (hasClass(target,"checkspan"))||
                (hasClass(target,"clickable"))||
                (hasClass(target,"isclickable")))
                return true;
            else if (target.onclick)
              return true;
            else target=target.parentNode;}
        return false;};

    fdjtUI.isDefaultClickable=function(target){
        if ((window.Event)&&(target instanceof window.Event))
            target=fdjtUI.T(target);
        while (target) {
            if (((target.tagName==='A')&&(target.href))||
                (target.tagName==="INPUT") ||
                (target.tagName==="TEXTAREA") ||
                (target.tagName==="SELECT") ||
                (target.tagName==="OPTION") ||
                (hasClass(target,"isclickable")))
                return true;
            else target=target.parentNode;}
        return false;};

    function submitEvent(arg){
        var form=((arg.nodeType)?(arg):(fdjtUI.T(arg)));
        while (form) {
            if (form.tagName==='FORM') break;
            else form=form.parentNode;}
        if (!(form)) return;
        var submit_evt = document.createEvent("HTMLEvents");
        submit_evt.initEvent("submit", true, true);
        form.dispatchEvent(submit_evt);
        return;}
    fdjtUI.submitEvent=submitEvent;

    function focusEvent(arg){
        var elt=((arg.nodeType)?(arg):(fdjtUI.T(arg)));
        var focus_evt = document.createEvent("HTMLEvents");
        focus_evt.initEvent("focus", true, true);
        elt.dispatchEvent(focus_evt);
        return;}
    fdjtUI.focusEvent=focusEvent;

    function disableForm(form){
        if (typeof form === 'string') form=fdjtID(form);
        if (!(form)) return;
        var elements=fdjtDOM.getChildren(
            form,"button,input,optgroup,option,select,textarea");
        var i=0; var lim=elements.length;
        while (i<lim) elements[i++].disabled=true;}
    fdjtUI.disableForm=disableForm;
    
}());

/* Ellipsis */

(function(){
    "use strict";
    var fdjtString=fdjt.String;
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;
    var fdjtID=fdjt.ID;


    var ellipsize=fdjtString.ellipsize;
    var getParent=fdjtDOM.getParent;
    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;

    function Ellipsis(spec,string,lim,thresh,handler){
        var content=ellipsize(string,lim,thresh||0.2);
        var split=(typeof content !== "string");
        var len=string.length;
        if (!(handler)) handler=toggle;
        if ((typeof content === "string")&&(content.length===len)) {
            // No elision, just return the string
            if (spec) return fdjtDOM(spec,string);
            else return document.createTextNode(string);}
        var before=((split)?(content[0]):(content));
        var after=((split)?(content[1]):(""));
        var clen=before.length+after.length;
        var pct=Math.round((100*(clen))/len);
        if (spec) addClass(elt,"ellipsis");
        var remaining=((split)?
                       (string.slice(before.length,len-after.length)):
                       (string.slice(before.length)));
        var elided=fdjtDOM("span.elided",remaining);
        var elision=fdjtDOM(
            "span.elision",fdjtString(" …←%d%% more→…",100-pct));
        var delision=fdjtDOM(
            "span.delision",fdjtString(" →…hide %d%%…← ",100-pct));
        elision.title="show elided text";
        delision.title="hide elided text";
        elision.onclick=handler; delision.onclick=handler;
        var elt=fdjtDOM(spec||"span.ellipsis",
                        before," ",elision,delision,elided," ",after);
        if (spec) addClass(elt,"ellipsis");
        elt.title=fdjtString.stdspace(string);
        return elt;}
    fdjtUI.Ellipsis=Ellipsis;

    function expand(node){
        if (typeof node === 'string') node=fdjtID(node);
        var ellipsis=getParent(node,".ellipsis");
        addClass(ellipsis,"expanded");
        dropClass(ellipsis,"compact");}
    Ellipsis.expand=expand;

    function contract(node){
        if (typeof node === 'string') node=fdjtID(node);
        var ellipsis=getParent(node,".ellipsis");
        addClass(ellipsis,"compact");
        dropClass(ellipsis,"expanded");}
    Ellipsis.contract=contract;
    
    function toggle(arg){
        var evt=false;
        if (!(arg)) {
            evt=window.event||false;
            if (evt) arg=fdjtUI.T(evt);
            else return;}
        else if (typeof arg === 'string') arg=fdjtID(arg);
        else if (arg.nodeType) {}
        else {
            evt=arg;
            arg=fdjtUI.T(arg);}
        var ellipsis=getParent(arg,".ellipsis");
        if (!(ellipsis)) return;
        if (evt) fdjtUI.cancel(evt);
        if (hasClass(ellipsis,"expanded")) {
            addClass(ellipsis,"compact");
            dropClass(ellipsis,"expanded");}
        else {
            addClass(ellipsis,"expanded");
            dropClass(ellipsis,"compact");}}
    Ellipsis.toggle=toggle;
    
})();

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;

    function selectSubmit(evt){
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        if (target.value==="") return;
        else {
            var form=fdjtDOM.getParent(target,"FORM");
            if (form) form.submit();}}
    function setupSelectSubmit(){
        var setup=fdjtDOM.$(".fdjtselectsubmit");
        var i=0, lim=setup.length;
        while (i<lim)
            fdjtDOM.addListener(setup[i++],"change",selectSubmit);}
    fdjt.addInit(setupSelectSubmit,"selectsubmit");})();

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;
    var getParent=fdjtDOM.getParent;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;
    
    function updatePasswordVisibility(evt,input,visible){
        evt=evt||window.event;
        if (typeof input === "string")
            input=document.getElementById(input);
        if (!(input)) return;
        var target=fdjtUI.T(evt);
        if (visible) {
            if (target.checked) input.type="PASSWORD";
            else input.type="TEXT";}
        else {
            if (target.checked) input.type="TEXT";
            else input.type="PASSWORD";}}

    fdjtUI.updatePasswordVisibility=updatePasswordVisibility;

    function uploadSelected(evt){
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        var tbody=fdjtDOM.getParent(target,".upload");
        if (tbody) fdjtDOM.addClass(tbody,"uploading");}
    fdjtUI.uploadSelected=uploadSelected;

    function focusBox_onfocus(evt){
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        var box=getParent(target,'.focusbox');
        if (box) addClass(box,"focused");}
    fdjtUI.FocusBox.focus=focusBox_onfocus;
    function focusBox_onblur(evt){
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        var box=getParent(target,'.focusbox');
        if (box)
            setTimeout(function(){dropClass(box,"focused");},
                       200);}
    fdjtUI.FocusBox.blur=focusBox_onblur;

})();

(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;
    var hasClass=fdjtDOM.hasClass;
    
    function fixTimeElement(elt){
        var tstring=elt.getAttribute('datetime')||
            elt.getAttribute('data-datetime')||
            elt.getAttribute('data-time');
        var parsed=((tstring)&&(new Date(tstring)));
        var good=((parsed)&&(((parsed.getYear())||"nogood")!=="nogood"));
        if (!(tstring)) {
            tstring=elt.innerText;
            parsed=new Date(tstring);
            good=((parsed)&&(((parsed.getYear())||"nogood")!=="nogood"));
            if (good) {
                if (elt.tagName==='TIME')
                    elt.setAttribute('datetime',tstring);
                else elt.setAttribute('data-datetime',tstring);}}
        if (!(good)) return;
        if (!(elt.title)) elt.title=parsed.toGMTString();
        if (hasClass(elt,"fdjtkeeptext")) {}
        else if (hasClass(elt,"fdjtisotime")) {
            if (parsed.toISOString) elt.innerHTML=parsed.toISOString();}
        else if (hasClass(elt,"fdjtutctime")) {
            if (parsed.toUTCString) elt.innerHTML=parsed.toUTCString();}
        else if (hasClass(elt,"fdjtdate")) {
            if (parsed.toDateString) elt.innerHTML=parsed.toDateString();}
        else if (hasClass(elt,"fdjtdateortime")) {
            if ((parsed.toDateString)&&(parsed.toTimeString)) {
                if ((parsed.toDateString())===((new Date()).toDateString))
                    elt.innerHTML=parsed.toTimeString();
                else elt.innerHTML=parsed.toDateString();}}
        else if (hasClass(elt,"fdjtlocaletime")) {
            if (parsed.toLocaleString) elt.innerHTML=parsed.toLocaleString();}
        else if (hasClass(elt,"fdjtlocaledate")) {
            if (parsed.toLocaleDate) elt.innerHTML=parsed.toLocaleDate();}
        else if (hasClass(elt,"fdjtlocaledateortime")) {
            if ((parsed.toLocaleDateString)&&(parsed.toTimeString)) {
                if ((parsed.toDateString())===((new Date()).toDateString))
                    elt.innerHTML=parsed.toLocaleTimeString();
                else elt.innerHTML=parsed.toLocaleDateString();}
            if (parsed.toLocaleDate) elt.innerHTML=parsed.toLocaleDate();}
        else if (hasClass(elt,"fdjthumantime")) {
            if ((parsed.toDateString)&&(parsed.toLocaleTimeString)) 
                elt.innerHTML=parsed.toDateString()+" ("+parsed.toLocaleTimeString()+")";
            else if (parsed.toLocaleString)
                elt.innerHTML=parsed.toLocaleString();
            else elt.innerHTML=parsed.toString();}
        else {
            if ((parsed.toDateString)&&(parsed.toLocaleTimeString)) 
                elt.innerHTML=parsed.toDateString()+" ("+parsed.toLocaleTimeString()+")";
            else if (parsed.toLocaleString)
                elt.innerHTML=parsed.toLocaleString();
            else elt.innerHTML=parsed.toString();}}

    function initTimeElements(node){
        var elts=((node)?
                  ((fdjt.keeptime)?
                   (fdjtDOM.getChildren(node,".fdjtime")):
                   (fdjtDOM.getChildren(node,"time,.fdjtime"))):
                  ((fdjt.keeptime)?
                   (fdjtDOM.$(".fdjtime")):
                   (fdjtDOM.$("time,.fdjtime"))));
        var i=0, lim=elts.length;
        while (i<lim) fixTimeElement(elts[i++]);}
    fdjt.initTimeElements=initTimeElements;

    fdjt.autoInitTimeElements=function(){
        fdjtDOM.addListener(document.body,"DOMNodeInserted",
                            function(evt){
                                evt=evt||window.event;
                                initTimeElements(fdjtUI.T(evt));});};
    fdjt.addInit(initTimeElements,"TimeElements",false);})();

(function(){
    "use strict";
    var vibrate=navigator.vibrate||navigator.webkitVibrate||
        navigator.mozVibrate||navigator.msVibrate;
    fdjt.UI.vibrate=function(args){
        if (!(vibrate)) return false;
        vibrate(args);
        return true;};})();

fdjt.disenableInputs=fdjt.UI.disenableInputs=
    (function(){
        "use strict";
        var fdjtDOM=fdjt.DOM;
        var getStyle=fdjtDOM.getStyle;
        var hasClass=fdjtDOM.hasClass;
        var $=fdjtDOM.$;
        
        function disenableInputs(under){
            var inputs=$("input,select,button,textarea",under);
            var i=0, lim=inputs.length;
            while (i<lim) {
                var input=inputs[i++];
                if (hasClass(input,"fdjtignore")) continue;
                var scan=input, disable=false;
                while ((scan)&&(scan!==under)) {
                    var style=getStyle(scan);
                    if (style.display==='none') {
                        disable=true; break;}
                    scan=scan.parentNode;}
                input.disabled=disable;}}
        return disenableInputs;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; Character-encoding: utf-8; -*- */

/* ######################### fdjt/showpage.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   It provides for simple and fast paginated display

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or any
   later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

   Use and redistribution (especially embedding in other CC licensed
   content) is also permitted under the terms of the Creative Commons
   "Attribution-NonCommercial" license:

   http://creativecommons.org/licenses/by-nc/3.0/ 

   Other uses may be allowed based on prior agreement with
   beingmeta, inc.  Inquiries can be addressed to:

   licensing@beingmeta.com

   Enjoy!

*/
/* jshint browser: true */

fdjt.showPage=fdjt.UI.showPage=(function(){
  "use strict";
  var fdjtDOM=fdjt.DOM;
  var fdjtLog=fdjt.Log;
  var fdjtString=fdjt.String;
  var getStyle=fdjtDOM.getStyle;
  var getChild=fdjtDOM.getChild;
  var getChildren=fdjtDOM.getChildren;
  var dropClass=fdjtDOM.dropClass;
  var addClass=fdjtDOM.addClass;
  var hasClass=fdjtDOM.hasClass;
  var addListener=fdjtDOM.addListener;
  var toArray=fdjtDOM.toArray;
  
  var adjustFonts=fdjtDOM.adjustFonts;

  function getContainer(arg){
    var container;
    if (typeof arg === "string")
      container=document.getElementById(arg);
    else if (arg.nodeType)
      container=arg;
    else if (fdjt.UI.T(arg))
      container=fdjt.UI.T(arg);
    else container=false;
    if (!(container)) fdjtLog.warn("Bad showPage container arg %s",arg);
    else container=fdjtDOM.getParent(container,".fdjtpage")||container;
    return container;}
    
  function istootall(container){
    return container.scrollHeight>container.offsetHeight;}
  function isOversize(elt,w,h){
    if (typeof w === "undefined") w=true;
    if (typeof h === "undefined") h=true;
    return ((h)&&(elt.scrollHeight>elt.offsetHeight))||
      ((w)&&(elt.scrollWidth>elt.offsetWidth));}
  
  function showPage(container,start,dir){
    if (!(container=getContainer(container))) return;
    var shown=toArray(getChildren(container,".fdjtshow"));
    var curstart=getChild(container,".fdjtstartofpage");
    var curend=getChild(container,".fdjtendofpage");
    var info=getChild(container,".fdjtpageinfo");
    var children=getNodes(container), lim=children.length, startpos;
    var caboose=(dir<0)?("fdjtstartofpage"):("fdjtendofpage");
    var tap_event_name=
      ((fdjt.device.touch)?("touchstart"):("click"));
    if (children.length===0) return;
    if (typeof dir !== "number") dir=1; else if (dir<0) dir=-1; else dir=1;
    if (!(start)) {
      startpos=0; start=children[0];}
    else if ((typeof start === "number")&&(start>0)&&(start<1)) {
      startpos=Math.round(start*children.length);
      start=children[startpos];}
    else if (typeof start === "number") {
      startpos=start-1; start=children[startpos];}
    else if (start.nodeType) {
      start=getPageElt(container,start);
      startpos=children.indexOf(start);}
    if ((!(start))||(startpos<0)||(startpos>=lim)||
        ((startpos===0)&&(dir<0)))
      return;
    addClass(container,"fdjtpage"); addClass(container,"formatting");
    if (!(info)) info=getProgressIndicator(container,startpos,lim);
    // Clear old page
    if (shown.length) {
      dropClass(shown,"fdjtshow");
      dropClass(shown,"fdjtoversize");}
    if (curstart) dropClass(curstart,"fdjtstartofpage");
    if (curend) dropClass(curend,"fdjtendofpage");
    addClass(start,"fdjtshow");
    addClass(start,((dir<0)?("fdjtendofpage"):("fdjtstartofpage")));
    checkOversize(start);
    if (((dir<0)&&(hasClass(start,/fdjtpagebreak(auto)?/)))||
        (istootall(container))) {
      dropClass(container,"formatting");
      return startpos;}
    var endpos=showchildren(container,children,startpos,dir);
    var end=children[endpos];
    if ((dir>0)&&(hasClass(end,"fdjtpagehead"))) {
      while ((endpos>startpos)&&(hasClass(end,"fdjtpagehead"))) {
        dropClass(end,"fdjtshow"); dropClass(end,caboose);
        endpos--; end=children[endpos];
        addClass(end,caboose);}}
    if ((dir>0)&&(hasClass(end,"fdjtpagekeep"))) {
      while ((endpos<startpos)&&(hasClass(end,"fdjtpagekeep"))) {
        dropClass(end,"fdjtshow"); dropClass(end,caboose);
        endpos++; end=children[endpos];
        addClass(end,caboose);}}
    var at_start=false, at_end=false;
    if (startpos===0) {
      addClass(container,"fdjtfirstpage");
      at_start=true;}
    else dropClass(container,"fdjtfirstpage");
    if (endpos>=(lim-1)) {
      addClass(container,"fdjtlastpage");
      at_end=true;}
    else dropClass(container,"fdjtlastpage");
    var minpos=((startpos<=endpos)?(startpos):(endpos));
    var maxpos=((startpos>endpos)?(startpos):(endpos));
    info.innerHTML="<span class='pct'>"+Math.floor((minpos/lim)*100)+"%"+
      "</span>"+"<span class='count'> ("+lim+")</span>";
    info.title=fdjtString("Items %d through %d of %d",minpos,maxpos,lim);
    var forward_button=fdjtDOM("span.button.forward"," 》");
    var backward_button=fdjtDOM("span.button.backward","《 ");
    fdjtDOM.prepend(info,backward_button);
    if (at_start) backward_button.innerHTML="· ";
    else addListener(backward_button,tap_event_name,backwardButton);
    if (at_end) forward_button.innerHTML="· ";
    else addListener(forward_button,tap_event_name,forwardButton);
    fdjtDOM.prepend(info,backward_button);
    fdjtDOM.append(info,forward_button);
    addClass(container,"fdjtpagechange"); setTimeout(
      function(){dropClass(container,"fdjtpagechange");},1000);
    dropClass(container,"formatting");
    return endpos;}

  function forwardButton(evt){
    fdjt.UI.cancel(evt);
    forwardPage(evt);}
  function backwardButton(evt){
    fdjt.UI.cancel(evt);
    backwardPage(evt);}

  function getProgressIndicator(container,startpos,lim){
    // This could include an input element for typing in a %
    var info=fdjtDOM("div.fdjtpageinfo",(startpos+1),"/",lim);
    container.appendChild(info);
    return info;}

  function getPageElt(container,node){
    var scan=node, parent=scan.parentNode;
    while ((parent)&&(parent!==container)) {
      scan=parent; parent=scan.parentNode;}
    if (parent===container) return scan;
    else return false;}

  function getNodes(container){
    var children=[], nodes=container.childNodes;
    addClass(container,"getvisible");
    var i=0, lim=nodes.length, prev=false;
    while (i<lim) {
      var node=nodes[i++];
      if (node.nodeType===1) {
        var style=getStyle(node);
        if (style.display==='none') continue;
        else if ((style.position)&&(style.position!=='static'))
          continue;
        if (style.pageBreakBefore==="force")
          addClass(node,"fdjtpagebreakauto");
        else dropClass(node,"fdjtpagebreakauto");
        // We don't currently make these stylable
        if ((prev)&&(hasClass(prev,"fdjtpagekeep"))) 
          addClass(node,"fdjtpagekeep");
        if ((prev)&&(hasClass(node,"fdjtpagekeep")))
          addClass(prev,"fdjtpagehead");
        children.push(node);}}
    dropClass(container,"getvisible");
    return children;}

  function showchildren(container,children,i,dir){
    var lim=children.length, scan=children[i+dir], last=children[i]; 
    var caboose=(dir<0)?("fdjtstartofpage"):("fdjtendofpage");
    i=i+dir; addClass(last,caboose); while ((i>=0)&&(i<lim)) {
      if ((dir>0)&&(hasClass(scan,/fdjtpagebreak(auto)?/)))
        return i-dir;
      dropClass(last,caboose);
      addClass(scan,"fdjtshow");
      addClass(scan,caboose);
      checkOversize(scan);
      if (istootall(container)) {
        addClass(last,caboose);
        dropClass(scan,"fdjtshow");
        scan.style.display='';
        dropClass(scan,caboose);
        return i-dir;}
      if ((dir<0)&&(hasClass(scan,/fdjtpagebreak(auto)?/))) return i;
      i=i+dir; last=scan; scan=children[i];}
    return i-dir;}

  function checkOversize(scan){
    var saved=scan.style.overflow||'';
    scan.style.overflow='auto';
    if (isOversize(scan)) {
      addClass(scan,"fdjtoversize");
      if (isOversize(scan)) {
        adjustFonts(scan);}}
    scan.style.overflow=saved;}
  showPage.isOversize=isOversize;

  function forwardPage(container){
    if (!(container=getContainer(container))) return;
    dropClass(container,"fdjtpagechange");
    var foot=getChild(container,".fdjtendofpage");
    if (!(foot)) return showPage(container);
    if (hasClass(container,"fdjtlastpage")) return false;
    else if (foot.nextSibling) 
      return showPage(container,foot.nextSibling);
    else return false;}
  showPage.forward=forwardPage;

  function fastForwardPage(container){
    if (!(container=getContainer(container))) return;
    var foot=getChild(container,".fdjtendofpage");
    if (!(foot)) return showPage(container);
    if (hasClass(container,"fdjtlastpage")) return false;
    else if (foot.nextSibling) {
      var children=getNodes(container);
      var off=children.indexOf(foot), len=children.length;
      var next_off=Math.floor(off+(len-off)/2);
      return showPage(container,children[next_off],1);}
    else return false;}
  showPage.fastForward=fastForwardPage;

  function backwardPage(container){
    if (!(container=getContainer(container))) return;
    dropClass(container,"fdjtpagechange");
    var head=getChild(container,".fdjtstartofpage");
    if (!(head)) return showPage(container);
    if (hasClass(container,"fdjtfirstpage")) return false;
    else if (head.previousSibling) {
      return showPage(container,head.previousSibling,-1);}
    else return false;}
  showPage.backward=backwardPage;

  function fastBackwardPage(container){
    if (!(container=getContainer(container))) return;
    var head=getChild(container,".fdjtstartofpage");
    if (!(head)) return showPage(container);
    if (hasClass(container,"fdjtfirstpage")) return false;
    else if (head.previousSibling) {
      var children=getNodes(container);
      var off=children.indexOf(head);
      var next_off=Math.floor(off/2);
      return showPage(container,children[next_off],-1);}
    else return false;}
  showPage.fastBackward=fastBackwardPage;

  function updatePage(container){
    if (!(container=getContainer(container))) return;
    var head=getChild(container,".fdjtstartofpage");
    if (!(head.hidden)) showPage(container,head);
    else {
      var scan=head;
      while (scan) {
        if (scan.nodeType!==1) scan=scan.nextSibling;
        else if (!(scan.hidden)) return showPage(container,scan);
        else scan=scan.nextSibling;}
      showPage(container);}}
  showPage.update=updatePage;

  function checkPage(container){
    if (!(container=getContainer(container))) return;
    if (!(hasClass(container,"fdjtpage"))) {
      if (container.offsetHeight) showPage(container);}
    else if ((container.offsetHeight)&&(!(hasClass(container,"needsresize")))) {
      dropClass(container,"needsresize");
      updatePage(container);}
    else return;}
  showPage.check=checkPage;

  function showNode(container,node){
    if (!(container=getContainer(container))) return;
    if (!(hasClass(container,"fdjtpage"))) {
      if (container.offsetHeight) showPage(container);
      else return false;}
    var parent=node.parentNode;
    while ((parent)&&(parent!==container)) {
      node=parent; parent=node.parentNode;}
    if (!(parent)) return;
    else if (hasClass(node,"fdjtshown")) return false;
    else return showPage(container,node);}
  showPage.showNode=showNode;

  return showPage;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "cd ..; make" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  js-indent-level: 2 ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ################# fdjt/dialog.js ###################### */

/* Copyright (C) 2012-2015 beingmeta, inc.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true */

/* Non-blocking alerts and messages */

fdjt.Dialog=(function(){
    
    "use strict";
    var fdjtDOM=fdjt.DOM;
    var fdjtLog=fdjt.Log;
    var fdjtUI=fdjt.UI;
    var fdjtID=fdjt.ID;
    var Template=fdjt.Template;
    var template=fdjt.Template;
    var Templates=fdjt.Templates;

    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var addListener=fdjtDOM.addListener;
    var removeListener=fdjtDOM.removeListener;

    var countdown_serial=1; var countdown_tickers={};

    var redx_png="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyEAYAAAE5qGRkAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAEXpJREFUeNrdXGl4VEW6fqv3bCT0SQjhVADpCggMuywiUTbZAoRNFlkER8SZwUdnrtuMy+idcUZFwHEYERdAkR1kcxRkXwVBWYSw5DSE5DQQyOmsnd677o9Ah5vcvt2ns3Cf+/7Jw6n63u99vzpL1anTALeh5NH2rNPGKQgBe6f0NhmW+D8HDygLxRKmG3JQUShljHPlEjWzjmszgwGt6Xi2Mfb5YLuTprM2xU2rGS20NWudNSPYIV+0sfYrtwX/XUgtLK304VCKoNhpf7ZoohIMUGgy6+QvqdlPEwy4JE5kIwwzwCHhg7VmuOCHt3IjABOcmkQlIJayQZ+uqc7wmliZodO/FMxQSpuyLg570EJb0cnaTj4bbK+k/ZjlozHVBCW0NUt33heyqhm0M5s1fR2iBbmT+s4BQZBlSSIkqKBGe8iGmqhJhJqBoQhUZ1DtIXrU1K6coxms5dq+Ecd/Tw+xdxNoqBoETzXSE4/xE1m7gpHN4YRh4uFgYDEdwB5buS9IvE7cw9bGvRwk7IHJ+LSsIBgfByCmeGmtItdSuI9qWVr2RHRCGuI2rw1ryQ0/tKUJQgv5unQxqaJmsyZUHPk1/4ov3fFJxLUvBkX++t2hmquv0s30T2ypccGdUvAfyYvkWWdisKcfgLdiU/D0aY9byJi88K5SX4f4VK+7Lspx7LGP+9QqXa3TygsvnI7rQnO5ULLFtwhnyN6eWlj6tKf5IbhhXLHkzvFaV47SXcxkC0yeiEsVAsp+ms7EL14JOrE/Rxey38VM4m9gPnZUBm9cIa/dUMQ1K2FCIZKWyiTqm0Qo4hqI+m4U8b1FraJwqCkkauuRljLsINZ1jBrfQYONQYOdRQ19HWjg5meQMC5JLXHYfn744Sv1Visppc0YHWeLtvZBnmtUYOnloYUpbUW3ZWPMu7UeuaU0kbH14R9M9QTlFn2Z2ROSaumwiXb2q+WtavYnxUnp/dhU4/aAlefhmGtopIlIKlqhybonzT75sPTzpGV1FW5/QpTZo3F/5gtIH1ypeDPiQC8CSF72QHBo7DqabKkcfoQXwkQ6f/ugaiU6JCF9tSwkymelvY+nhxX+Cn3QsjbuU/4iCsirFU+pzueFBw57QGgu35SuC9qQ55id0Cw2O+sEL8Jp7P2mh+pEJ1CB/JVDhKFyieSZtlOZKPZik2Pfw2JyDSccL6rm8yMOvOSk0Ey+KFmbdq/ZHPnz+JxYxjQj3WhOOqDNNoNqIWqhgw6a0m5CopwnXUo6Fa57xEZqGZMos+RnT0JTuMjAzWui5QlCCx08ZR8ISXKelJ/4e7XhGrUBwQr8k8fh4R11ntIFkQc3+Mb2UeuJtKN9NBUsM01JfBliyCFncRS53Lf/GiMSxtAB2s+mmIvl76WLs8OOeOhH6As03rLKmIY/Iom84bqmWrYHDjgrDglpcrFkS8hUXDSWJTxWCQfMSF0Xo5aOiEhD/CfHzC75uHRqTp9a7UHhs8T5ll+M/fE+WUjGuvaqFk7ghc+RKZjlQikv/lC47koubcs0kz+DGZVos/rXqtM1hxEtF6ebvbJV2vNbmSgBmsj0oy6iGAlotbVtxEw+EAQqVwupcoF0Oe5x1cZrGjsmVlicU4aDkftJp1XfRhzohgvashu1Ti27nvZjxrFX+Q3kIf3rlnc1VYBXrhcEuUSyxk2sq/Cwxs6JlZaC6WY0J23JgC+VYIMWfpCyDUKSfF3KTXwsPNFZamDp32YrT9IKy1/19Xd3UmuomGayfvu2FS1JT2Vm7dnIA/OpkTXZtq/mZM3+gVjIsoz3N5oBP23DHtxTPWksoiJjvMw+TJzHSnQna/avfnlxlqaz9ltLEIcUNBv5SM2OfDrpgYuuc8okOs1y1nClwQyU0p5M3J2KEnhwa0D1bZ6AAEjgq8g/0NPbXHlafN+yQHfXKwU97cS6bJ3Fb6AYjlFLI8wXINuQiymGs+aZcoz0F2+XOhsopqlswC6GAPQoGJQbNoAAILjFd6EQTt1TGp6HEngHd1aZV8NHIQOrPZ2VvmI3yzDd36I2cI22Yxm7ScQG7oAD4EjRrATh53vs1AiiXCDlxP4eWujgrjyjWsk2cotYvS/a19KW7Gl9XqRh9kTagXXe2QxGOMAHBlTnLebf8w/7fG7eInusCT86g9eIkCTnSQVxXWBADAKVR1WRcuj4YHDs9TS3d6GnLJ8b0kKOgI1msAe2/5tfRhkqBxeq1U/m4iHM6btMYLYO1hHHguuY0FOUCtqSdXBmwY0APKZvVJji4KjkbszjX+r1yaL8uPUhn0G5KLrZwO1bkUwsyB86SrWBf0CD9L7Pmv9Tzpf2/rCoVns4AqWStmAZrmw4oQE3blaZ3wcXbuLajn/BhGZoMfQ51QY6Ygw/+WCh+Ya8yJpwtHnIfpESKvk0hbV0jkccjDCYNqgVpBpOCLje7zWByqclx+G3wxpWy69cpxaW7uwEA9wwmtTfHMIJSuX56Jc53+yzaaTlh16IOC7ahEohbc/SXDHQoRxxxso6O4jDRBQ+vEowyQuk8oNTVRegrvmVIprOMnglCDg41K8z2oFC0/8Jc5F8VLq0/8todUS91FUCopdptr4RrYE74BchI7DvoyIvPWiZpmJSWLMgqg2U0kQmbvbBhwTEZGujTVzbEQiAHNIaE3gr/QxzhbzQutv3U70bURTahrHNBIAHyFb/JI5cEQFwiozFy6jQlZv3y3OlG/6Hw4eFM1BERZaxSQYBAR8jqhamBaD1OuEH4NerOQU5gIKAggS+Vdsvpa18wdohkB+qc8hrRLlCzUzY9ETUBq7xDXzXoHZCkixLFw2x0MAPv6dIBQMBkK4RUEFG+88Xj0nvn0E0IU+1WkaUG5SxzhtGogli0XTMctUGfuGn+f5HM4VOtj7W1nsu3TksNJWvS1eMKVVvED3DVLLGBj7nVm7xe+zvpP+c8bP2vf/JdZWBC5Qx8/plSIEL5gkzVRvI5+f5yiGPCt1sCdbeO3eF664U03TW2pOKADh0+hsR56lSvAk+tMcx3fNCM3mnJPjzieKnqazH+hMogR6lE9S/rNbwFWj56LtCU9sAac+uVyINu73ppLGX0RYsw7sVPmjAdVmqchP8wPPJ25q+GosGpdDBNWqPagMBaKAb2k2tgaCGqsoGzE3ka1KufhT80MHvtasi4XhQ0y3QM3DroV537wKKjDlzARDAxEIKuI8fR96wcnOZLU3y7WiiugChNFWNkN5eRluyDM9M+BAA14f+suIAjDznkSbCWNlqNRwor15YCbJNkmIyoIUGenft23I+v4KYEdn1bSBYoKqMXnMTOV/KNayAHxx+b611ELkfduj6f3fHQFhixU5bsDbuJfZYGmspHN67voWHw+0RMiiltAVr55ulHBZzLe5H/qPOxEqWuM2SHdNDuUqTWNI3e2ttUp6nSSxlw0dKX3ED0xm2Nrbxxoa9Ge3FlsavV/xUZJ32dr/r/RtljDsVq1jKWi3Pt38tGtjjulcj5Q05Qyly0YEsNmYRuYpfkLJuPpJhhH7k5YgVO8DRct1xbIAdy6b3FP4gO6VWnjqvGu4VFCudxwYmDEQLfIHA5g6oRAnkgf8MG8jBAdih5QVgy+JwCB3Jiae/EUbZzucW+SbU7F69OX2A7mErTJd5L8zF4nUmOFCGm6PSwiaMDAFcRTKwrgOZgz8iZvp483F5kvSLJ+rXeg0NZR59yzIufi1mYjfZu2UWNLgMYaCjzsRV70evIwAnYpaW4gG+ma+Y01nIs2Vau/i8RHHRrsy8djUcKIJ54uRG8svRBCa0WjeevM1nkwtT3zC/aXs51+br1kj5a0Fx089Yq9jRcOFN+Lbq4AMQM2hjoyQnKEM5NCj/sEv19KRYPMpaDfsRnIyA9utnwBELTUzEy8w6guMS9Ehccw2P8I04M+M5wWPrLnm9DVYQew79OEMb14vH4RPedcsVxOMmSgfdbCS/VV/Eeoqfwg3+C982bLbQ3ZZs7fJjn9CfoTShyZb8EWO4DIH0WT8NXjgQGzu+EaQSEHgQgzS0X92bvISH8NbMMvMieaHUzRP5M6wGlNz0zmxI3HtoyhOR9/UKEFxBYEi9v1sMCSMI4ounws838/dGXBUSbT2sQ44erm0+Qtg70ydY5xG7+CHshmPDFngBkJgPG8EKAYEbF3CTn1k5E1MwDG/N6irky1us73hDroCUt0UTK49ri6kkBVkbX0ACOK4Nnd0IequQAB90JSnkBbREnxHLzB/KP0rLfwi7/xD1rMeeQnuzzKyZ/CpsKNx4DU4AAeOOBjdaNWtx4iA0KF+5lN8ibnhn/otYeQ9+Td8V07GdtNv8M9IgQj/kQoPruQM/YuErPUpa4LfQDEs1++TnpctH26ilqbdpqFJITYxkWeFDIlpt2AAT9NCZXmq0gjQ2tDBAX/odLuBB/smIdUIfeaU188jyutI22LpA+VosYv1GX0Rv0ha2tYNgQiy0poK6M98jGEDAS0rhB/ipUR2EJLnAmnBI/VdfYdBoCzXlNBUtzux3kAo9saypgB4+xJr+0lj5VYPDiECpFev5OXQceVX4jc0kbTs0qKHT3rOVs3KFTrV4sx9BDI6R7uuSoIcLTsPme6UHOmjgLH+eNMdD/HTWEbNTXm1NPni8sWVEvW9YV5Cdgfn85PZxiIcV5p2NN/sJBRuKkbJxBucYzHceabz1SM26NFYi+0DxRcsrpoP8W/IBWbw2Bw6kImX00/fKeBjcwAU0hWbpFvIGfIHtc54z75bPX27jc9ed+n9Hwz3UC2gM6206BAMEONachA6AK3tuQxuqd1RtlJ+GCW1Q+tkm8lfM40t+87n5HbmXdZxPru909Tft9dBVLMY4Gm78DYlrUuFBCeLHRP6b1/rDndtNswZhJ+AAzpEWcCD1s0Vwk3gMfuaAmRfI0lv+nLrTRwllmbiJ7TMMxxAyBS+sc8OEZJRk746WTzXccMHjeB05PAf2UT+RoaQb7hd685sAilcxAAREr/qroihRiTIkwPvpV9oZOI7Jz7yUdFCOl94NlKolivzTkzzahWUas6HHTUirJsAELeLGTWskw4AfZSivmA4X/4pvGLNWaGkbbc3c7Q3V3W4Uyy0lE228kGSQ7isWwA8dNIb3G0ntJSShIyxL3OQK6U6Sf/eqmRX8PXelf1u4wNDflL5H/826GOdhIl5F4leDkYAiXJvQtZEMAQEE4K44jjOo4CfHPS0MksusyTtPRUtnN9OHWedJhTwHeXB8+Tr0CIAYlkTLpwIEBLuQgPvAPj5GWuEosuaeM1+XPdJc/+rane8IXiXmsIcMa3gv0gu2lQKaIgm6CYMbQXAVNHDB6yhGCT+M1mPThfts7aT9O+u+IVQDd74TKU6lTZlhSn9+CXFo88Vr8APw6Qc0uM+qin+LJkhB18Wz8Hd8QqbMfV94Xe6ZOz4wgyiXaDv2q5VzIMAB1+OL/1tYQ8IFDfzOM0jhhxGbPVAw2NKlczuVuhOrw+0BIvYfRCvTTy5DRzIArb/qX/W5iPZEI8mwIYAHoFswuHqDKoca2JgxfdEMAnLWcBBoETAeqbeUfnD4KkXSjBeAjGtnhk0jXdmh/od0DYzgFURodxY/tTkvgR3isoXwwwe/vv5+RuZBJVA2DN/wlfCNrBRm24ZLeQcPhn6GVNLxzDx2KVz4CUmrOoDDB40p8s9onAhA63BgNd/OD0yYLbxo62xN3b464vj/I7g9QCa7m2otFdNdKEUa6fL5M9ABIPrFkRPBDWepA6eQyn8YPV8YLJ+1tjzw55rdIt+gEmhbNmHsJZ4LJ06vvlL1gxDjkGAHLfTwOkcilm/FzfHjBYOtk+T87sl7XdD6xu0BMtpt4hXLkWlOGElfMmXZYGighV5XPe2vhBeB8q44z3NgH7VBGGITpJL9GQ0mTLlFm7DYcX+yC/QPlpzhYf8LhP+v4IEe3Xt0h95uoZls2rRnlSPiQcupR6Iu/H8B7AjpZA9bJIMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTQtMTItMzFUMTI6NDQ6NTYtMDU6MDBEL5TZAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTEyLTMxVDEyOjQ0OjU2LTA1OjAwNXIsZQAAADh0RVh0c3ZnOmJhc2UtdXJpAGZpbGU6Ly8vc3JjL2dyYXBoaWNzL3RhcmdldHMvZmRqdC9yZWR4LnN2Z3qXB16JAAAAAElFTkSuQmCC";

    function Dialog(spec){
        if (!(spec)) spec={};
        else if (typeof spec === "string") spec={spec: spec};
        var box=fdjtDOM((spec.spec)||("div.fdjtdialog"));
        if (spec.classes) {
            box.className=(box.className||"")+
                ((box.className)?(" "):(""))+
                spec.classes;}
        if (spec.style) box.setAttribute("style",spec.style);
        if (!((spec.modal)||(spec.keep)||
              (hasClass(box,"fdjtmodal"))||
              (hasClass(box,"fdjtkeep")))) {
            var countdown=fdjtDOM("div.countdown","Closing…");
            countdown.id="FDJTCOUNTDOWN"+(countdown_serial++);
            box.appendChild(countdown);}
        if (!((spec.modal)||(spec.noclose)||(hasClass(box,"fdjtmodal")))) {
            var close_button=fdjtDOM.Image(redx_png,"closebutton","Close");
            addListener(close_button,"click",close_dialog_handler);
            addListener(close_button,"touchend",close_dialog_handler);
            addListener(close_button,"touchstart",fdjtUI.cancel);
            close_button.title="click to close";
            box.appendChild(close_button);}
        if (spec.title) {
            if (spec.title.nodeType) elts.push(spec.title);
            else {
                var title_text=template(spec.title,spec,spec.data);
                box.title=title_text;
                box.appendChild(fdjtDOM("div.title",title_text));}}
        var elts=[]; var i=1, lim=arguments.length, wrap=true, content;
        while (i<lim) {
            var e=arguments[i++];
            if (e.nodeType) {wrap=false; break;}
            else if ((typeof e === "string")&&(e.indexOf('<')>=0)) {
                wrap=false; break;}}
        if (wrap) {
            content=fdjtDOM("P");
            box.appendChild(content);}
        else content=box;
        i=1; while (i<lim) {
            var arg=arguments[i++];
            if (!(arg)) {}
            else if (arg.nodeType) content.appendChild(arg);
            else if (typeof arg === "string") {
                arg=Templates[arg]||arg;
                var ishtml=(arg.indexOf('<')>=0);
                var istemplate=(arg.search("{{")>=0);
                if ((ishtml)&&(istemplate))
                    content.appendChild(Template.toDOM(arg,spec));
                else if (ishtml)
                    fdjtDOM.append(content,arg);
                else if (istemplate)
                    content.appendChild(document.createTextNode(template(arg,spec)));
                else content.appendChild(document.createTextNode(arg));}
            else content.appendChild(document.createTextNode(arg.toString));}
        if ((spec.id)&&(!(box.id))) box.id=spec.id;
        fdjtDOM.addListeners(box,spec);
        return box;}
    var makeDialog=Dialog;

    function remove_dialog(evt){
        evt=evt||window.event;
        var target=((evt)?((evt.nodeType)?(evt):(fdjtUI.T(evt))):
                    ((fdjtID("FDJTALERT"))||(fdjtID("FDJTDIALOG"))));
        var box=fdjtDOM.getParent(target,".fdjtdialog");
        if (box) {
            var countdown=fdjtDOM.getChild(box,".countdown");
            if ((countdown)&&(countdown.id)) {
                var ticker=countdown_tickers[countdown.id];
                if (ticker) clearInterval(ticker);
                delete countdown_tickers[countdown.id];}
            clear_countdown(box);
            fdjtDOM.remove(box);}}
    
    function close_dialog(evt,fast){
        evt=evt||window.event;
        var target=((evt)?((evt.nodeType)?(evt):(fdjtUI.T(evt))):
                    ((fdjtID("FDJTALERT"))||(fdjtID("FDJTDIALOG"))));
        if ((evt)&&(!(evt.nodeType))) fdjtUI.cancel(evt);
        var box=fdjtDOM.getParent(target,".fdjtdialog");
        if (box) {
            clear_countdown(box);
            if (fast) fdjtDOM.remove(box);
            else {
                if ((fdjtDOM.transitionEnd)&&
                    (!(fdjtDOM.hasClass(box,"closing")))) {
                    fdjtDOM.addListener(box,fdjtDOM.transitionEnd,function(){
                        fdjtDOM.remove(box);});
                    fdjtDOM.addClass(box,"closing");}
                else fdjtDOM.remove(box);}}}
    Dialog.close=close_dialog;
    
    function clear_countdown(box){
        var countdown=fdjtDOM.getChild(box,".countdown");
        if (countdown) {
            var ticker=countdown_tickers[countdown.id];
            delete countdown_tickers[countdown.id];
            if (ticker) clearInterval(ticker);
            fdjtDOM.remove(countdown);}}

    function close_dialog_handler(evt){
        evt=evt||window.event;
        fdjtUI.cancel(evt);
        close_dialog(evt);}

    function stop_countdown_onclick(evt){
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        var box=fdjtDOM.getParent(target,".fdjtdialog");
        clear_countdown(box);
        box.style[fdjtDOM.transitionDelay]="";
        box.style[fdjtDOM.transitionDuration]="";
        fdjtDOM.dropClass(box,"countdown");
        fdjtDOM.dropClass(box,"closing");
        fdjtUI.cancel(evt);}

    function alertBox(){
        var args=fdjtDOM.toArray(arguments);
        var box=Dialog.apply(null,[{}].concat(args));
        addClass(box,"fdjtalert");}
    Dialog.alertBox=alertBox;
    fdjtUI.alertBox=alertBox;

    function alertfn(){
        var curbox=fdjtID("FDJTALERT");
        if (curbox) {
            curbox.id="";
            fdjtDOM.dropClass(curbox,"closing");
            remove_dialog(curbox);}
        var args=fdjtDOM.toArray(arguments);
        var box=Dialog.apply(null,[{}].concat(args));
        box.id="FDJTALERT"; fdjtDOM.prepend(document.body,box);
        return box;}
    Dialog.alert=alertfn;
    fdjtUI.alert=alertfn;
    fdjt.alert=alertfn;

    function setCountdown(box,timeout,whendone){
        var countdown=fdjtDOM.getChild(box,".countdown");
        countdown.innerHTML="…"+timeout+"…";
        var n=timeout;
        box.style[fdjtDOM.transitionDelay]=(n/2)+"s";
        box.style[fdjtDOM.transitionDuration]=(n/2)+"s";
        var ticker=setInterval(function(){
            if (n<=0) {
                clearInterval(ticker); ticker=false;
                delete countdown_tickers[countdown.id];
                if (whendone) whendone();
                fdjtDOM.remove(box);}
            else countdown.innerHTML="…"+(n--)+"…";},
                               1000);
        countdown_tickers[countdown.id]=ticker;
        countdown.onclick=stop_countdown_onclick;
        addListener(countdown,"touchend",stop_countdown_onclick);
        addListener(countdown,"touchstart",fdjtUI.cancel);
        setTimeout(function(){fdjtDOM.addClass(box,"closing");},10);
        return box;}
    Dialog.setCountdown=setCountdown;
    fdjtUI.setCountdown=setCountdown;

    function alertFor(timeout){
        var curbox=fdjtID("FDJTALERT");
        if (curbox) {
            curbox.id="";
            fdjtDOM.dropClass(curbox,"closing");
            remove_dialog(curbox);}
        var args=[{timeout: timeout}].concat(fdjtDOM.slice(arguments,1));
        var box=Dialog.apply(null,args);
        box.id="FDJTALERT"; fdjtDOM.prepend(document.body,box);
        setCountdown(box,timeout);
        return box;}
    Dialog.alertFor=alertFor;
    fdjtUI.alertFor=alertFor;

    function message(spec){
        var curbox=fdjtID("FDJTMESSAGE");
        if (curbox) {
            curbox.id="";
            fdjtDOM.dropClass(curbox,"closing");
            remove_dialog(curbox);}
        var args=fdjtDOM.toArray(arguments);
        var box=Dialog.apply(null,args);
        if (spec.timeout) setCountdown(box,spec.timeout);
        box.id="FDJTMESSAGE"; fdjtDOM.prepend(document.body,box);
        return box;}
    Dialog.message=message;
    fdjt.message=message;

    function makeChoice(spec,close_choice,i){
        var dom=spec.dom||
            ((spec.label)&&(fdjtDOM("button",spec.label)))||
            fdjtDOM("button","Choice "+i);
        dom.onmousedown=fdjtUI.cancel;
        dom.onmouseup=fdjtUI.cancel;
        dom.tabIndex=i;
        if (spec.title) dom.title=spec.title;
        if (spec.classname) addClass(dom,spec.classname);
        dom.onclick=function(evt){
            evt=evt||window.event;
            var target=fdjtUI.T(evt);
            var choices=fdjtDOM.getParent(target,".choices");
            var cursel=fdjtDOM.getChild(choices,".selected");
            if (cursel===dom) {}
            else {
                if (cursel) {
                    fdjtDOM.dropClass(cursel,"selected");
                    cursel.blur();}
                fdjtDOM.addClass(dom,"selected");
                dom.focus();}
            if (spec.handler) spec.handler();
            fdjtUI.cancel(evt);
            close_choice();};
        addListener(dom,"touchstart",fdjtUI.cancel);
        addListener(dom,"touchend",dom.onclick);
        return dom;}

    function choose(spec){
        var box=false; var selection=-1, buttons=[], choices;
        var close_button=false, onchoose=false;
        function close_choice(){
            var i=0, lim=buttons.length;
            while (i<lim) {
                var button=buttons[i++];
                if (button.onclick)
                    removeListener(button,"touchend",button.onclick);
                removeListener(button,"touchstart",fdjtUI.cancel);
                button.onclick=null;
                button.onmousedown=null;
                button.onmouseup=null;}
            if (close_button) {
                removeListener(close_button,"touchend",close_button.onclick);
                removeListener(close_button,"touchstart",fdjtUI.cancel);
                close_button.onclick=null;}
            if (box) box.onclick=null;
            if (box) box.onkeydown=null;
            if (box) {
                var timeout=setTimeout(function(){
                    if (spec.onclose) spec.onclose(box);
                    remove_dialog(box);
                    clearTimeout(timeout);
                    timeout=false;},
                                       500);}}
        if (typeof spec === "function") 
            choices=[{label: "Cancel"},
                     {label: "OK",handler: spec,isdefault: true}];
        else if (spec.constructor === Array) choices=spec;
        else if (spec.choices) choices=spec.choices;
        else if ((spec.label)&&(spec.handler)) 
            choices=[{label: "Cancel"},spec];
        else if (spec.handler) 
            choices=[{label: "Cancel"},
                     {label: "OK",
                      handler: spec.handler,
                      isdefault: spec.isdefault}];
        else if (choices.length) choices=spec;
        else {
            fdjtLog.warn("Bad spec %o to fdjtUI.choose");
            return;}
        if (spec.onchoose) onchoose=spec.onchoose;
        var i=0, lim=choices.length;
        while (i<lim) {
            var choice=choices[i];
            var button=makeChoice(choice,close_choice,i);
            buttons.push(button);
            if ((selection<0)&&(choice.isdefault)) {
                button.setAttribute("autofocus","autofocus");
                fdjtDOM.addClass(button,"selected");
                selection=i;}
            i++;}
        if ((selection<0)&&(!(spec.nodefault))) {
            fdjtDOM.addClass(buttons[i],"selected");
            selection=0;}
        box=makeDialog(
            spec,fdjtDOM("div.message",fdjtDOM.slice(arguments,1)),
            fdjtDOM("div.choices",buttons));
        close_button=fdjtDOM.getChild(box,".closebutton");
        if (spec.cancel) {
            removeListener(close_button,"touchend",close_button.onclick);
            close_button.onclick=close_choice;
            addListener(close_button,"touchend",close_button.onclick);}
        else fdjtDOM.remove(close_button);
        
        var cancel=(spec.cancel)||false;
        
        // For accessibility, handle tab/enter
        box.onkeydown=function(evt){
            evt=evt||window.event;
            var kc=evt.keyCode;
            if (kc===9) {
                if (evt.shiftKey) selection--; else selection++;
                if (selection<0) selection=buttons.length-1;
                else if (selection>=buttons.length) selection=0;
                if (selection>=0) buttons[selection].focus();
                fdjtUI.cancel(evt);}
            else if (kc===13) {
                if ((selection>=0)&&(choices[selection])&&
                    (choices[selection].handler)) {
                    (choices[selection].handler)();}
                if ((onchoose)&&(selection>=0)&&(choices[selection]))
                    onchoose(choices[selection],box);
                close_choice();
                fdjtUI.cancel(evt);}
            else if ((cancel)&&(kc===27)) {
                close_choice();
                fdjtUI.cancel(evt);}};
        fdjtDOM.addClass(box,"fdjtconfirm"); box.id="FDJTDIALOG";
        fdjtDOM.prepend(document.body,box);
        if (spec.timeout)
            setCountdown(box,spec.timeout,function(){
                if (spec.noauto) {
                    close_choice();
                    return;}
                if ((selection>=0)&&(choices[selection])&&
                    (choices[selection].handler)) {
                    (choices[selection].handler)();}
                if ((onchoose)&&(selection>=0)&&(choices[selection]))
                    onchoose(choices[selection],box);});
        if (selection>=0) buttons[selection].focus();
        return box;}
    Dialog.Choice=choose;
    Dialog.choose=choose;
    fdjtUI.choose=choose;
    fdjt.Choice=choose;

    fdjt.UI.Dialog=Dialog;
    return Dialog;})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/

/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/completions.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));
if (!(fdjt.UI)) fdjt.UI={};

(function(){
    "use strict";
    var fdjtString=fdjt.String;
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;
    var RefDB=fdjt.RefDB, fdjtID=fdjt.ID;

    var rAF=fdjtDOM.requestAnimationFrame;
    var async=fdjt.async;

    var serial=0;

    /* Constants */
    // Always set to distinguish no options from false
    var FDJT_COMPLETE_OPTIONS=1;
    // Whether the completion element is a cloud (made of spans)
    var FDJT_COMPLETE_CLOUD=2;
    // Whether to require that completion match an initial segment
    var FDJT_COMPLETE_ANYWORD=4;
    // Whether to match case in keys to completions
    var FDJT_COMPLETE_MATCHCASE=8;
    // Whether to an enter character always picks a completion
    var FDJT_COMPLETE_EAGER=16;
    // Default options
    var default_options=
        ((FDJT_COMPLETE_OPTIONS)|
         (FDJT_COMPLETE_CLOUD)|
         (FDJT_COMPLETE_ANYWORD));
    // Milliseconds to wait for auto complete
    var complete_delay=100;

    var hasClass=fdjtDOM.hasClass;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;
    var getChildren=fdjtDOM.getChildren;
    var getParent=fdjtDOM.getParent;
    var getStyle=fdjtDOM.getStyle;
    var position=RefDB.position;

    var isEmpty=fdjtString.isEmpty;
    var hasPrefix=fdjtString.hasPrefix;
    var prefixAdd=fdjtString.prefixAdd;
    var prefixFind=fdjtString.prefixFind;
    var commonPrefix=fdjtString.commonPrefix;

    fdjtUI.FDJT_COMPLETE_OPTIONS=FDJT_COMPLETE_OPTIONS;
    fdjtUI.FDJT_COMPLETE_CLOUD=FDJT_COMPLETE_CLOUD;
    fdjtUI.FDJT_COMPLETE_ANYWORD=FDJT_COMPLETE_ANYWORD;
    fdjtUI.FDJT_COMPLETE_MATCHCASE=FDJT_COMPLETE_MATCHCASE;
    fdjtUI.FDJT_COMPLETE_EAGER=FDJT_COMPLETE_EAGER;

    var ValueMap=fdjt.Map||RefDB.Map;

    function Completions(dom,input,options) {
        this.dom=dom||false; this.input=input||false;
        this.options=options||default_options;
        this.nodes=[]; this.values=[]; this.serial=++serial;
        this.cues=[]; this.displayed=[]; this.known={};
        this.prefixtree={strings: []}; this.bykey={};
        this.byvalue=new ValueMap();
        this.selected=false; this.selclass=false;
        if (!((options)&(FDJT_COMPLETE_MATCHCASE))) this.stringmap={};
        this.initialized=false;
        return this;}

    // A completion is a DOM node with a 'key' string for matching
    //  and a 'value' for using.  A completion can include *variations*
    //  (with CSS class variation) which have different key values.
    
    // The key is either stored as a DOM property, attribute, 
    function getKey(node){
        return node.key||(node.getAttribute("data-key"))||(node.getAttribute("key"))||
            ((hasClass(node,"variation"))&&(fdjtDOM.textify(node)))||
            ((hasClass(node,"completion"))&&(completionText(node,"")));}
    Completions.getKey=getKey;
    // This gets the text of a completion node, excluding variations
    // and any fdjtdecoration(s).
    function completionText(node,sofar){
        if (node.nodeType===3) return sofar+node.nodeValue;
        else if (hasClass(node,"variation")) return sofar;
        else if (hasClass(node,"fdjtskiptext")) return sofar;
        else if ((node.nodeType===1)&&(node.childNodes)) {
            var children=node.childNodes;
            var i=0; var lim=children.length;
            while (i<lim) {
                var child=children[i++];
                if (child.nodeType===3) sofar=sofar+child.nodeValue;
                else if (child.nodeType===1)
                    sofar=completionText(child,sofar);
                else {}}
            return sofar;}
        else return sofar;}

    /* You can add a node to a completions lookup table.  We update
     * bykey and the prefix table. */
    function addNodeKey(node,keystring,ptree,bykey,anywhere){
        var keys=((anywhere)?(keystring.split(/\W/g)):[]).concat(keystring);
        var i=0; var lim=keys.length;
        while (i<lim) {
            var key=keys[i++];
            prefixAdd(ptree,key,0);
            if ((bykey[key])&&(bykey.hasOwnProperty(key)))
                bykey[key].push(node);
            else bykey[key]=new Array(node);
            bykey._count++;}}

    /* Get nodes for a completion */
    function getNodes(string,ptree,bykey,matchcase){
        var result=[]; var direct=[]; var variations=[];
        var keystring=stdspace(string);
        if (isEmpty(keystring)) return [];
        if (!(matchcase)) keystring=string.toLowerCase();
        var strings=prefixFind(ptree,keystring,0);
        var prefix=false;
        var exact=[]; var exactheads=[]; var keys=[];
        var i=0; var lim=strings.length;
        while (i<lim) {
            var s=strings[i++];
            var isexact=(s===keystring);
            if (prefix) prefix=commonPrefix(prefix,s,false,(!(matchcase)));
            else prefix=s;
            var completions=bykey[s];
            if (completions) {
                var j=0; var jlim=completions.length;
                while (j<jlim) {
                    var c=completions[j++];
                    if (hasClass(c,"hidden")) {}
                    // Skip redundant completions
                    else if (result.indexOf(c)>=0) {}
                    else if (hasClass(c,"completion")) {
                        if (isexact) {exactheads.push(c); exact.push(c);}
                        result.push(c); keys.push(s); direct.push(c);}
                    else {
                        var head=getParent(c,".completion");
                        if ((head)&&(hasClass(head,"hidden"))) {}
                        else if (head) {
                            if (isexact) exact.push(head);
                            result.push(head); keys.push(s);
                            variations.push(c);}}}}}
        if (exact.length) result.exact=exact;
        if (exactheads.length) result.exactheads=exactheads;
        result.prefix=prefix;
        result.strings=strings;
        result.matches=direct.concat(variations);
        return result;}

    function addCompletion(c,completion,key,value) {
        if (typeof key === "undefined")
            key=completion.key||getKey(completion);
        if (!(value))
            value=(completion.value)||(completion.getAttribute('value'))||key;
        if (!(completion._seen)) {
            c.nodes.push(completion);
            completion._seen=true;
            if (value) {
                c.values.push(value);
                c.byvalue.add(value,completion);}}
        else return;
        c.curstring=c.maxstring=false;
        if (key) addCompletionKeys(c,completion,key);}

    function addCompletionKeys(c,completion,key) {
        if (!(key)) key=completion.key||getKey(completion);
        var opts=c.options;
        var container=c.dom;
        var ptree=c.prefixtree;
        var bykey=c.bykey;
        var smap=c.stringmap;
        var stdkey=stdspace(key), lower;
        var matchcase=((opts)&(FDJT_COMPLETE_MATCHCASE));
        var anyword=((opts)&(FDJT_COMPLETE_ANYWORD));
        if (!(matchcase)) {
            lower=stdkey.toLowerCase();
            smap[lower]=stdkey;
            stdkey=lower;}
        if (!(getParent(completion,container)))
            fdjtDOM.append(container,completion," ");
        addNodeKey(completion,stdkey,ptree,bykey,anyword);
        if (hasClass(completion,"cue")) c.cues.push(completion);
        var variations=getChildren(completion,".variation");
        var i=0; var lim=variations.length;
        while (i<lim) {
            var variation=variations[i++];
            var vkey=stdspace(variation.key||getKey(variation));
            if (!(matchcase)) {
                lower=vkey.toLowerCase();
                smap[lower]=vkey;
                vkey=lower;}
            addNodeKey(variation,vkey,ptree,bykey,anyword);}}

    function initCompletions(c){
        var completions=getChildren(c.dom,".completion");
        var i=0; var lim=completions.length;
        while (i<lim) addCompletion(c,completions[i++]);
        c.initialized=true;}

    Completions.prototype.addCompletion=function(completion,key,value) {
        if (!(this.initialized)) initCompletions(this);
        addCompletion(this,completion,key,value);
        if (this.visible) this.visible=false;};
    Completions.prototype.addKeys=function(completion,key) {
        if (!(this.initialized)) {
            initCompletions(this);
            addCompletion(this,completion,key);}
        else addCompletionKeys(this,completion,key);
        if (this.visible) this.visible=false;};

    function updateDisplay(c,todisplay){
        var displayed=c.displayed;
        var i, lim;
        if (displayed) {
            i=0; lim=displayed.length;
            while (i<lim) dropClass(displayed[i++],"displayed");
            c.displayed=displayed=[];}
        else c.displayed=displayed=[];
        if (todisplay) {
            i=0; lim=todisplay.length;
            while (i<lim) {
                var node=todisplay[i++];
                if (hasClass(node,"completion")) {
                    addClass(node,"displayed");
                    displayed.push(node);}
                else {
                    var head=getParent(node,".completion");
                    if ((head)&&(!(hasClass(head,"displayed")))) {
                        displayed.push(node); displayed.push(head);
                        addClass(head,"displayed");
                        addClass(node,"displayed");}}}}
        // Clear the visible ordered elements cache
        c.visible=false;
        // Move the selection if neccessary
        if ((c.selection)&&(!(hasClass(c.selection,"displayed"))))
            if (!(c.selectNext()))
                if (!(c.selectPrevious()))
                    c.clearSelection();
        if (c.updated) c.updated.call(c);}
    
    Completions.prototype.getCompletions=function(string) {
        if ((string===this.curstring)||(string===this.maxstring)||
            ((this.curstring)&&(this.maxstring)&&
             (hasPrefix(string,this.curstring))&&
             (hasPrefix(this.maxstring,string))))
            return this.result;
        else {
            var result, that=this;
            if (!(this.initialized)) initCompletions(this);
            if (isEmpty(string)) {
                result=[]; result.prefix=""; result.matches=[];
                if (this.dom) addClass(this.dom,"noinput");}
            else {
                result=getNodes(string,this.prefixtree,this.bykey,
                                ((this.options)&(FDJT_COMPLETE_MATCHCASE)));
                if (this.dom) dropClass(this.dom,"noinput");
                rAF(function(){updateDisplay(that,result.matches);});}
            if ((this.stringmap)&&(this.strings)) {
                var stringmap=this.stringmap;
                var strings=this.strings;
                var i=0; var lim=strings.length;
                while (i<lim) {
                    var s=strings[i]; var m=stringmap[s];
                    if (m) strings[i++]=m;
                    else i++;}}
            this.curstring=string;
            this.maxstring=result.prefix||string;
            this.result=result;
            return result;}};

    Completions.prototype.getValue=function(completion) {
        if (completion.value) return completion.value;
        else if (completion.getAttribute("data-value"))
            return completion.getAttribute("data-value");
        else if (completion.getAttribute("value"))
            return completion.getAttribute("value");
        var pos=position(this.nodes,completion);
        if (pos<0) return false;
        else return this.values[pos];};
    Completions.prototype.getKey=function(completion) {
        if (completion.key) return completion.key;
        else if (completion.getAttribute("data-key"))
            return completion.getAttribute("data-key");
        else if (completion.getAttribute("key"))
            return completion.getAttribute("key");
        else return getKey(completion);};

    Completions.prototype.complete=function(string,callback){
        var that=this;
        if (!(this.initialized)) initCompletions(this);
        // fdjtLog("Completing on %o",string);
        if ((!(string))&&(string!==""))
            string=((this.getText)?(this.getText(this.input)):
                    (hasClass(this.input,"isempty"))?(""):
                    (this.input.value));
        if (isEmpty(string)) {
            rAF(function(){
                if (that.displayed) updateDisplay(that,false);
                addClass(that.dom,"noinput");
                dropClass(that.dom,"nomatches");
                if (callback) async(function(){callback([]);});});
            return [];}
        var result=this.getCompletions(string);
        if ((!(result))||(result.length===0)) {
            rAF(function(){
                updateDisplay(that,false);
                dropClass(that.dom,"noinput");
                addClass(that.dom,"nomatches");
                if (callback) async(function(){callback(result);});});
            return [];}
        else {
            rAF(function(){
                updateDisplay(that,result.matches);
                dropClass(that.dom,"noinput");
                dropClass(that.dom,"nomatches");
                if (callback) async(function(){callback(result);});});
            return result;}};

    Completions.prototype.getByValue=function(values,spec){
        if (!(this.initialized)) initCompletions(this);
        var result=[];
        var byvalue=this.byvalue;
        if (spec) spec=new fdjtDOM.Selector(spec);
        if (!(values instanceof Array)) values=[values];
        var i=0; var lim=values.length;
        while (i<lim) {
            var value=values[i++];
            var completions=byvalue.get(value);
            if (completions) {
                if (!(completions instanceof Array))
                    completions=[completions];
                if (spec) {
                    var j=0; var jlim=completions.length;
                    while (j<jlim) {
                        if (spec.match(completions[j]))
                            result.push(completions[j++]);
                        else j++;}}
                else result=result.concat(completions);}}
        return result;};
    Completions.prototype.getByKey=function(keys,spec){
        if (!(this.initialized)) initCompletions(this);
        var result=[];
        var bykey=this.bykey;
        if (spec) spec=new fdjtDOM.Selector(spec);
        if (!(keys instanceof Array)) keys=[keys];
        var i=0; var lim=keys.length;
        while (i<lim) {
            var key=keys[i++];
            var completions=bykey.get(key);
            if (completions) {
                if (!(completions instanceof Array))
                    completions=[completions];
                if (spec) {
                    var j=0; var jlim=completions.length;
                    while (j<jlim) {
                        if (spec.match(completions[j]))
                            result.push(completions[j++]);
                        else j++;}}
                else result=result.concat(completions);}}
        return result;};

    Completions.prototype.setCues=function(values,cueclass){
        if (!(this.initialized)) initCompletions(this);
        if (!(cueclass)) cueclass="cue";
        var cues=[];
        var byvalue=this.byvalue;
        var i=0; var lim=values.length;
        while (i<lim) {
            var value=values[i++];
            var completions=byvalue.get(value);
            if (completions) {
                if (!(completions instanceof Array))
                    completions=[completions];
                var j=0; var jlim=completions.length;
                while (j<jlim) {
                    var c=completions[j++];
                    if (hasClass(c,cueclass)) continue;
                    addClass(c,cueclass);
                    cues.push(c);}}}
        return cues;};

    Completions.prototype.setClass=function(values,classname){
        if (!(this.initialized)) initCompletions(this);
        var drop=fdjtDOM.getChildren(this.dom,".completion."+classname);
        if ((drop)&&(drop.length))
            dropClass(fdjtDOM.Array(drop),"hidden");
        var changed=[];
        var byvalue=this.byvalue;
        var i=0; var lim=values.length;
        while (i<lim) {
            var value=values[i++];
            var completions=byvalue.get(value);
            if (completions) {
                if (!(completions instanceof Array))
                    completions=[completions];
                var j=0; var jlim=completions.length;
                while (j<jlim) {
                    var c=completions[j++];
                    if (hasClass(c,classname)) continue;
                    addClass(c,classname);
                    changed.push(c);}}}
        return changed;};
    Completions.prototype.extendClass=function(values,classname){
        if (!(this.initialized)) initCompletions(this);
        var changed=[];
        var byvalue=this.byvalue;
        var i=0; var lim=values.length;
        while (i<lim) {
            var value=values[i++];
            var completions=byvalue.get(value);
            if (completions) {
                if (!(completions instanceof Array))
                    completions=[completions];
                var j=0; var jlim=completions.length;
                while (j<jlim) {
                    var c=completions[j++];
                    if (hasClass(c,classname)) continue;
                    addClass(c,classname);
                    changed.push(c);}}}
        return changed;};
    
    Completions.prototype.dropClass=function(classname){
        var drop=fdjtDOM.getChildren(this.dom,".completion."+classname);
        if ((drop)&&(drop.length))
            dropClass(fdjtDOM.Array(drop),classname);};

    Completions.prototype.docomplete=function(input,callback){
        if (!(this.initialized)) initCompletions(this);
        if (!(input)) input=this.input;
        var delay=this.complete_delay||complete_delay;
        var that=this;
        if (this.timer) {
            clearTimeout(that.timer);
            that.timer=false;}
        this.timer=setTimeout(
            function(){
                if (!(input)) input=that.input;
                var completions=that.complete(input.value);
                if (callback) callback(completions);},
            delay);};

    function stdspace(string){
        return string.replace(/\s+/," ").replace(/(^\s)|(\s$)/,"");}

    fdjtUI.Completions=Completions;

    /* Selection from list/cloud */

    var Selector=fdjtDOM.Selector;

    function gatherVisible(root){
        var scan=root.firstChild; var displayed=[];
        while (scan!==root) {
            if (scan.nodeType===1) {
                var iscompletion=hasClass(scan,"completion");
                if ((iscompletion)&&(getStyle(scan).display!=="none")) 
                    displayed.push(scan);
                if ((scan.firstChild)&&(!(iscompletion))) {
                    scan=scan.firstChild; continue;}}
            while ((scan!==root)&&(!(scan.nextSibling)))
                scan=scan.parentNode;
            if (scan!==root) scan=scan.nextSibling;}
        return displayed;}

    // This gets visible nodes in their order of appearance, for which
    // we can't use .nodes or .displayed
    Completions.prototype.getVisible=function getVisible(){
        if (this.visible) return this.visible;
        else {
            var visible=this.visible=gatherVisible(this.dom);
            return visible;}};

    Completions.prototype.select=function select(completion){
        var pref=false; var displayed=this.getVisible();
        if (completion instanceof Selector) {
            pref=completion; 
            completion=false;}
        if ((!(completion))&&(pref)) {
            var nodes=displayed;
            var i=0; var lim=nodes.length; while (i<lim) {
                var node=nodes[i++];
                if (hasClass(node,pref)) {completion=node; break;}
                else continue;}}
        if ((!(completion))&&(displayed.length))
            completion=displayed[0];
        if (this.selection) dropClass(this.selection,"selected");
        addClass(completion,"selected");
        this.selection=completion;
        return completion;};
    
    Completions.prototype.selectNext=function(selection){
        if (!(selection)) {
            if (this.selection) selection=this.selection;
            else selection=false;}
        var nodes=this.getVisible(), dflt=false, found=false;
        var i=0, lim=nodes.length; while (i<lim) {
            var node=nodes[i++];
            if (!(dflt)) dflt=node;
            if (!(selection)) {
                selection=node; break;}
            else if (node===selection) {
                selection=false; found=true;}
            else continue;}
        if (this.selection) dropClass(this.selection,"selected");
        if (!(found)) selection=dflt;
        addClass(selection,"selected");
        this.selection=selection;
        return selection;};

    Completions.prototype.selectPrevious=function(selection){
        if (!(selection)) {
            if (this.selection) selection=this.selection;
            else selection=false;}
        var nodes=this.getVisible(), dflt=false, found=false;
        var i=nodes.length-1; while (i>=0) {
            var node=nodes[i--];
            if (!(dflt)) dflt=node;
            if (!(selection)) {
                selection=node; break;}
            else if (node===selection) {
                selection=false; found=true;}
            else continue;}
        if (this.selection) dropClass(this.selection,"selected");
        if (!(found)) selection=dflt;
        if (selection) addClass(selection,"selected");
        this.selection=selection;
        return selection;};

    Completions.prototype.clearSelection=function(selection){
        if ((selection)&&(this.selection)&&(selection!==this.selection))
            return false;
        if (!(this.selection)) return;
        dropClass(this.selection,"selected");
        this.selection=false;
        return true;};

    /* Options, handlers, etc */

    var cached_completions={};

    function onkey(evt){
        evt=evt||window.event;
        var target=fdjtUI.T(evt);
        var name=target.name;
        var completions=cached_completions[name];
        var compid=fdjtDOM.getAttrib(target,"completions");
        var dom=((compid)&&(fdjtID(compid)));
        if (!(dom)) return;
        if (!((completions)&&(completions.dom===dom))) {
            completions=new Completions(dom,target,default_options);
            cached_completions[name]=completions;}
        if (!(completions)) return;
        completions.docomplete(target);}
    fdjtUI.Completions.onkey=onkey;
    
    function update(evt){
        evt=evt||window.event;
        if (typeof evt==='string') evt=fdjtID(evt);
        if (!(evt)) return;
        var target=((evt.nodeType)?(evt):(fdjtUI.T(evt)));
        var name=target.name;
        var completions=cached_completions[name];
        var compid=fdjtDOM.getAttrib(target,"completions");
        var dom=((compid)&&(fdjtID(compid)));
        if (!(dom)) return;
        if (!((completions)&&(completions.dom===dom))) {
            completions=new Completions(dom,target,default_options);
            cached_completions[name]=completions;}
        if (!(completions)) return;
        completions.docomplete(target);}
    fdjtUI.Completions.update=update;

}());

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/taphold.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.

   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));
    if (!(fdjt.UI)) fdjt.UI={};

fdjt.TapHold=fdjt.UI.TapHold=(function(){
    "use strict";
    var fdjtLog=fdjt.Log;
    var fdjtDOM=fdjt.DOM;
    var fdjtUI=fdjt.UI;
    var fdjtET=fdjt.ET;

    var traceall=0;
    var window_setup=false;
    var default_opts={};
    
    var getChildren=fdjtDOM.getChildren;
    var addClass=fdjtDOM.addClass;
    var dropClass=fdjtDOM.dropClass;
    var hasClass=fdjtDOM.hasClass;
    var getParent=fdjtDOM.getParent;
    var hasParent=fdjtDOM.hasParent;
    var reticle=fdjtUI.Reticle;

    var noBubble=fdjtUI.noBubble;
    var noDefault=fdjtUI.noDefault;
    // var cancel=fdjtUI.cancel;
    var eTarget=fdjtUI.T;

    var cleared=0;
    var serial_count=1;

    var keynums={
        shift: 16, alt: 18, control: 17, meta: 224,
        os: 91, altgr: 225, fn: -1,
        numlock: 144, capslock: 20, scrolllock: 145};
    var keynames={};
    for (var akeyname in keynums)
        if (keynums.hasOwnProperty(akeyname)) {
            var akeynum=keynums[akeyname];
            if ((typeof akeynum === 'number')&&(akeynum>0))
                keynames[akeynum]=akeyname;}
    
    var sqrt=Math.sqrt;
    function xyd(x0,y0,x1,y1){
        if ((typeof x0==="number")&&(typeof y0==="number")&&
            (typeof x1==="number")&&(typeof y1==="number"))
            return sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1));
        else return false;}

    function getClientX(evt,x,y){
        if (typeof evt.clientX === "number") return evt.clientX;
        var touches=((evt.changedTouches)&&(evt.changedTouches.length)&&
                     (evt.changedTouches))||
            ((evt.touches)&&(evt.touches.length)&&(evt.touches));
        var winxoff=window.pageXOffset, winyoff=window.pageYOffset;
        if ((touches)&&(touches.length)) {
            if ((touches.length===1)||
                (typeof x !== "number")||
                (typeof y !== "number"))
                return (touches[0].pageX-winxoff);
            else {
                var i=1, lim=touches.length, tch=touches[0];
                var d=xyd(Math.abs(tch.pageX-winxoff),
                          Math.abs(tch.pageY-winyoff),
                          x,y);
                var d_min=d, touch=tch;
                while (i<lim) {
                    tch=touches[i++];
                    d=xyd(Math.abs(tch.pageX-winxoff),
                          Math.abs(tch.pageY-winyoff),
                          x,y);
                    if (d<d_min) {touch=tch; d_min=d;}}
                return touch.pageX-winxoff;}}
        else return false;}
    function getClientY(evt,x,y){
        if (typeof evt.clientY === "number") return evt.clientY;
        var touches=((evt.changedTouches)&&(evt.changedTouches.length)&&
                     (evt.changedTouches))||
            ((evt.touches)&&(evt.touches.length)&&(evt.touches));
        var winxoff=window.pageXOffset, winyoff=window.pageYOffset;
        if ((touches)&&(touches.length)) {
            if ((touches.length===1)||
                (typeof x !== "number")||
                (typeof y !== "number"))
                return (touches[0].pageY-winyoff);
            else {
                var i=1, lim=touches.length, tch=touches[0];
                var d=(Math.abs(Math.abs(tch.pageX-winxoff)-x)+
                       (Math.abs(Math.abs(tch.pageY-winyoff)-y)));
                var d_min=d, touch=tch;
                while (i<lim) {
                    tch=touches[i++];
                    d=(Math.abs(Math.abs(tch.pageX-winxoff)-x)+
                       (Math.abs(Math.abs(tch.pageY-winyoff)-y)));
                    if (d<d_min) {touch=tch; d_min=d;}}
                return touch.pageY-winyoff;}}
        else return false;}
    
    function synthesizeEvent(target,etype,th,orig,tx,ty,tn,also){
        var thid=th.id||(typeof th), trace=th.traced, handlers=th.handlers;
        var orig_target=(orig)&&(eTarget(orig));
        if (!(target)) target=orig_target;
        var evt = document.createEvent("UIEvent");
        var event_arg=
            (((orig)&&(orig.touches)&&(orig.touches.length))||
             ((orig)&&(orig.button))||
             0);
        evt.initUIEvent(etype, true, true,window,event_arg);
        evt.clientX=tx; evt.clientY=ty; evt.ntouches=tn||1;
        if (also) {
            for (var prop in also) {
                if (also.hasOwnProperty(prop)) {
                    evt[prop]=also[prop];}}}
        if ((trace)||(traceall)) {
            if ((also)&&(typeof also.startX === "number"))
                fdjtLog("TapHold/%s(%s) on %o @%d,%d/%d,%d from %o given %j",
                        etype,thid,target,tx,ty,also.startX,also.startY,
                        orig||"scratch",also);
            else if (also)
                fdjtLog("TapHold/%s(%s) on %o @%d,%d from %o given %j",
                        etype,thid,target,tx,ty,orig||"scratch",also);
            else fdjtLog("TapHold/%s(%s) on %o @%d,%d from %j",
                         etype,thid,target,tx,ty,orig||"scratch");}
        if ((!target)||(!(hasParent(target,document.body))))
            target=document.elementFromPoint(tx,ty);
        if (orig_target!==target)
            evt.relatedTarget=orig_target;
        if ((handlers)&&(handlers.hasOwnProperty(etype))) {
            evt.target=target;
            handlers[etype](evt,target);}
        else target.dispatchEvent(evt);}
    
    /* This gets the target based on geometry. */
    function getRealTarget(holder,touchable,x,y){
        var children=getChildren(holder,touchable);
        var i=0, lim=children.length;
        while (i<lim) {
            var child=children[i++];
            var left=child.offsetLeft, top=child.offsetTop;
            var right=child.offsetRight, bot=child.offsetBottom;
            if (typeof left !== "number") continue;
            else if ((((right-left)<=1)?
                      ((x>=left)&&(y<=right)):
                      ((x>=left)&&(y<right)))&&
                     (((bot-top)<=1)?
                      ((y>=top)&&(y<=bot)):
                      ((x>=top)&&(y<bot)))) {
                // fdjtLog("Got %o at %d,%d ltrb=%d,%d,%d,%d",child,x,y,left,top,right,bot);
                return child;}}
        return false;}

    var mouse_down=false;
    function global_mouseup(evt){
        evt=evt||window.event;
        if (traceall) fdjtLog("TapHold/global/mouseup %o",evt);
        if (evt.button===1) mouse_down=false;}
    function global_mousedown(evt){
        evt=evt||window.event;
        if (traceall) fdjtLog("TapHold/global/mousedown %o",evt);
        if (evt.button===1) mouse_down=true;}
    function global_mouseout(evt){
        evt=evt||window.event;
        var target=eTarget(evt), rel=evt.relatedTarget||evt.toElement;
        if (traceall>2)
            fdjtLog("TapHold/global/mouseout %o %o==>%o",
                    evt,target,rel);
        if (target===document.documentElement)
            mouse_down=false;}

    function traceValue(classname){
        var parsed=/\bfdjtlog(\d*)/.exec(classname);
        if ((parsed)&&(parsed.length)) {
            var level=
                ((typeof parsed[1] === "string")&&
                 (parseInt(parsed[1],10)));
            if ((level)&&(!(isNaN(level))))
                return level;
            else return 1;}
        else return 0;}

    function TapHold(elt,opts){
        if (!(elt)) {
            fdjtLog.warn("TapHold with no argument!");
            return;}
        
        if (!(this instanceof TapHold))
            return new TapHold(elt,opts);
        
        var th=this;
        var holdclass="tapholding";
        var touchclass="tapholdtarget";
        // Touched is set when the gesture is started, pressed is set
        // when it becomes a hold (with pressed_at as the time)
        var touched=false, pressed=false, pressed_at=false;
        // The timer which turns a touch into a hold
        var th_timer=false, tt_timer=false;
        // The current touch target, and a history of touch targets,
        // to handle slips.
        var th_target=false, th_targets=[];
        var tap_target=false, th_target_t=false, th_last=false;
        // Whether we're in a touch environment.
        var fortouch=false;
        // Whether motion causes a 'hold' to slip among targets,
        // triggering 'slip' events and new 'hold' events.
        var noslip=false;
        // Whether created events bubble;
        var bubble=false;
        // Whether to override (cancel) the default handlers on the
        // container
        var override=false;
        // Don't capture events with more than this number of touches
        var maxtouches=1;

        // If this is true, second touches in the container during a
        //  live touch are turned into touchtoo events; otherwise,
        //  they abort the current press/touch and start a new tap or
        //  hold
        var touchtoo=false;
        
        // How long it takes a touch to become a press
        var holdmsecs=false;
        // How long (and whether) to recognize double taps
        var taptapmsecs=false;
        // Abort a press when the touch moves move than this many pixels
        var movethresh=false;
        // How long to wait before aborting a press after the touch wanders
        //  away from the touch container
        var wanderthresh=false;
        // Minimum distance before recognizing a swipe
        var min_swipe=30;
        
        var scrolling=false, scroll_x=0, scroll_y=0;
        // These indicate where/when the current gesture started, is
        // currently, and the last point at which the touch target
        // changed.
        var start_x=false, start_y=false, start_t=false;
        var touch_x=false, touch_y=false, touch_t=0, touch_n=false;
        var target_x=false, target_y=false, target_t=false;
        // This is when (and whether) a swipe event has been generated
        //  for the current gesture.
        var swipe_t=false;
        // This controls the maximum velocity (in pixels/second) for touches
        //  to change targets
        var minmove=2;
        // This is how far the touch 'hotspot' is from the actual x, y
        // (This may not be entirely consistent with touchstart
        // targets, which is a potential problem.).
        var hot_xoff=0, hot_yoff=0;
        // The level of tracing to use for this TapHold handler
        var trace=0;
        
        var serial=serial_count++;
        var thid=(((opts)&&(opts.id))?(opts.id+":"+serial):
                  (elt.id)?("#"+elt.id+":"+serial):
                  (""+serial));
        th.id=thid;

        function start_holding(){addClass(elt,holdclass);}
        function stop_holding(){dropClass(elt,holdclass);}
        function check_holding(){
            if (!(th_target)) dropClass(elt,holdclass);}

        var touchable=elt.getAttribute("data-touchable");
        if ((opts)&&(opts.hasOwnProperty("touchable"))) {
            // Opts override attributes
            if (typeof opts.touchable === "string")
                touchable=fdjtDOM.Selector(opts.touchable);
            else touchable=opts.touchable;}
        else if (touchable) touchable=fdjtDOM.Selector(touchable);
        else touchable=function(e){return hasParent(e,elt);};

        var isClickable=fdjtUI.isClickable, untouchable;
        if ((opts)&&(opts.hasOwnProperty("untouchable"))) {
            // Opts override attributes
            if (typeof opts.untouchable === "string") {
                var notouch=fdjtDOM.Selector(opts.untouchable);
                untouchable=function(e){
                    if (e.nodeType) return notouch.match(e);
                    else return notouch.match(eTarget(e));};}
            else untouchable=opts.untouchable;}
        else untouchable=function(e){return isClickable(e);};
        
        if ((opts)&&(opts.noslip)) noslip=opts.noslip;
        if ((opts)&&(opts.touch_xoff)) hot_xoff=opts.touch_xoff;
        if ((opts)&&(opts.touch_yoff)) hot_yoff=opts.touch_yoff;

        if ((opts)&&(opts.hasOwnProperty("trace"))) {
            var opt_val=opts.trace;
            if (typeof opt_val==="number") trace=opt_val;
            else if (opt_val) trace=2;
            else trace=0;}
        else if (hasClass(elt,/\bfdjtlog\d*/g))
            trace=traceValue(elt.className);
        else trace=0;
        
        var wander_timer=false;

        function cleartouch(all){
            if (th_timer) {clearTimeout(th_timer); th_timer=false;}
            if ((all)&&(tt_timer)) {
                clearTimeout(tt_timer); tt_timer=false;}
            if ((th_target)&&(touchclass))
                dropClass(th_target,touchclass);
            th_target=th_target_t=false; th_targets=[];
            swipe_t=start_x=start_y=start_t=
                touch_x=touch_y=touch_t=touch_n=
                target_x=target_y=target_t=false;
            touched=pressed=pressed_at=false;}

        function synthEvent(target,etype,th,orig,tx,ty,also){
            return synthesizeEvent(target,etype,th,orig,tx,ty,touch_n,also);}

        function setTarget(t){
            if (((trace>2)||(traceall>2))||
                ((t!==th_target)&&((trace)||(traceall))))
                fdjtLog("TapHold/setTarget(%s) %o cur=%o",thid,t,th_target);
            if ((th_target)&&(th_target!==t)&&(touchclass))
                dropClass(th_target,"tapholdtarget");
            if ((t)&&(touchclass)) addClass(t,"tapholdtarget");
            if ((t)&&(th_target)&&(t!==th_target)) {
                target_x=touch_x; target_y=touch_y; target_t=touch_t;}
            th_last=th_target;
            th_target=t; th_target_t=fdjtET();}

        function tapped(target,evt,x,y){
            if (typeof x === "undefined") x=touch_x;
            if (typeof y === "undefined") y=touch_y;
            return synthEvent(target,"tap",th,evt,x,y,false);}
        function held(target,evt,x,y){
            if (typeof x === "undefined") x=touch_x;
            if (typeof y === "undefined") y=touch_y;
            if (holdclass) setTimeout(start_holding,20);
            return synthEvent(target,"hold",th,evt,x,y,false);}
        function released(target,evt,x,y){
            var target_time=
                ((th_target_t)&&(th_last)&&(fdjtET()-th_target_t));
            if (typeof x === "undefined") x=touch_x;
            if (typeof y === "undefined") y=touch_y;
            if (holdclass)
                setTimeout(check_holding,50);
            if ((target_time)&&(target_time<200)) {
                if (trace)
                    fdjtLog("TapHold(%s) %d=i<200ms, target=%o not %o",
                            thid,target_time,th_last,target);
                target=th_last;}
            return synthEvent(target,"release",th,evt,x,y,
                              {startX: start_x,startY: start_y});}
        function slipped(target,evt,also){
            if (also) {
                also.startX=start_x; also.startY=start_y;}
            else also={startX: start_x,startY: start_y};
            if (evt) {
                var rel=evt.relatedTarget||eTarget(evt);
                if (rel!==target) also.relatedTarget=rel;}
            if (holdclass)
                setTimeout(check_holding,50);
            return synthEvent(target,"slip",th,evt,touch_x,touch_y,also);}
        function taptapped(target,evt){
            return synthEvent(target,"taptap",th,evt,
                              touch_x,touch_y,false,trace);}
        function swiped(target,evt,sx,sy,cx,cy){
            var dx=cx-sx, dy=cy-sy; swipe_t=fdjtET();
            return synthEvent(target,"swipe",th,evt,cx,cy,
                              {startX: sx,startY: sy,endX: cx,endY: cy,
                               deltaX: dx,deltaY: dy});}
        
        function startpress(evt,to){
            if (!(to)) to=holdmsecs||TapHold.interval||100;
            evt=evt||window.event;
            if ((trace>1)||(traceall>1))
                fdjtLog("TapHold/startpress(%s) %o tht=%o timer=%o tt=%o touched=%o pressed=%o@%o timeout=%oms",
                        thid,evt,th_target,th_timer,tap_target,touched,
                        pressed,pressed_at,to);
            if ((tap_target)&&(th_timer)) {
                clearTimeout(th_timer); th_timer=false;}
            if ((tap_target)&&(tt_timer)) {
                clearTimeout(tt_timer); tt_timer=false;
                taptapped(tap_target,evt);
                cleartouch(true);
                return;}
            if ((touched)||(pressed)||(th_timer)) return;
            else if (!(th_target)) {
                swipe_t=false; return;}
            else {touched=th_target; pressed=false; swipe_t=false;}
            if (reticle.live) reticle.highlight(true);
            pressed_at=fdjtET(); 
            if (th_timer) clearTimeout(th_timer);
            th_timer=setTimeout((function(){
                if ((trace>1)||(traceall>1))
                    fdjtLog("TapHold/startpress/timeout(%s) (%dms) %o",
                            thid,to,evt);
                if (th_targets.length>0) {
                    var targets=th_targets;
                    var i=0, lim=targets.length;
                    while (i<lim) {
                        var elt=targets[i++];
                        if ((i===lim)&&(elt===th_target)) break;
                        held(elt);
                        if (noslip) {}
                        else if (i<lim)
                            slipped(elt,evt,{relatedTarget: targets[i]});
                        else slipped(elt,evt);}}
                pressed=th_target; th_targets=[];
                if (th_target) pressed_at=fdjtET(); else pressed_at=false;
                held(th_target,evt);
                if (th_timer) clearTimeout(th_timer);
                th_timer=false;
                touched=false;}),
                                to);}
        function endpress(evt){
            if ((trace>1)||(traceall>1))
                fdjtLog("TapHold/endpress(%s) %o t=%o p=%o tch=%o tm=%o ttt=%o/%o, start=%d,%d,%d/%d",
                        thid,evt,th_target,pressed,touched,th_timer,
                        tap_target,taptapmsecs,
                        start_x,start_y,start_t,fdjtET());
            if ((!(pressed))&&(!(touched))&&(!(th_timer))) {
                cleartouch(true);
                return;}
            var x=touch_x, y=touch_y;
            if (th_timer) {
                clearTimeout(th_timer); th_timer=false;
                if (reticle.live) 
                    setTimeout(function(){reticle.highlight(false);},1500);
                if ((th_target===touched)||
                    ((fdjtET()-start_t)<(holdmsecs/1000))) {
                    tap_target=th_target;
                    if ((taptapmsecs)&&(taptapmsecs>0)) {
                        tt_timer=setTimeout(function(){
                            tt_timer=false; tapped(tap_target,evt,x,y);},
                                            taptapmsecs);}
                    else tapped(th_target,evt,x,y);}
                else if (noslip) {}
                else slipped(th_target,evt);}
            else if (pressed) {
                var geom=fdjtDOM.getGeometry(elt);
                if ((x>=geom.left)&&(x<=geom.right)&&
                    (y>=geom.top)&&(y<=geom.bottom))
                    released(pressed,evt,x,y);
                else if (noslip)
                    released(pressed,evt,x,y);
                else slipped(th_target,evt,{touch_x: x,touch_y: y});}
            else {}
            if (reticle.live) reticle.highlight(false);
            cleartouch();
            setTarget(false);
            if (holdclass)
                setTimeout(stop_holding,20);
            th_targets=[];}
        function abortpress(evt,why){
            if ((trace)||(traceall))
                fdjtLog("TapHold/abort%s(%s) %o: th=%o t=%o p=%o",
                        ((why)?("("+why+")"):("")),thid,
                        evt,th_target,touched,pressed);
            if (th_timer) {
                clearTimeout(th_timer); th_timer=false;}
            else if (noslip) {}
            else if (pressed) {slipped(pressed,evt);}
            if (reticle.live) reticle.highlight(false);
            pressed_at=touched=pressed=tap_target=false;
            if (holdclass) setTimeout(stop_holding,20);
            th_targets=[];
            setTarget(false);}

        function taphold_mouseout(evt){
            evt=evt||window.event;
            var to=evt.toElement||evt.relatedTarget;
            if (wander_timer) return;
            if (!(th_target)) return;
            if ((pressed)&&(!(hasParent(to,elt)))) {
                wander_timer=setTimeout(wandered,wanderthresh,evt,to);}}
        function wandered(evt,to){
            if (!(noslip))
                slipped(pressed,evt,{relatedTarget: to});
            abortpress(evt,"taphold_mouseout");}

        function taphold_mouseover(evt){
            evt=evt||window.event;
            if (wander_timer) {
                clearTimeout(wander_timer);
                wander_timer=false;}}

        function taphold_move(evt){
            evt=evt||window.event;
            var target, n_touches=((evt.touches)&&(evt.touches.length))||1;
            if ((!(bubble))) noBubble(evt);
            if (override) noDefault(evt);
            if ((scrolling)&&(evt.touches)&&(evt.touches.length<=maxtouches)) {
                if (scroll_x>=0) 
                    scrolling.scrollLeft=
                    scroll_x-(evt.touches[0].pageX-window.pageXOffset);
                if (scroll_y>=0)
                    scrolling.scrollTop=
                    scroll_y-(evt.touches[0].pageY-window.pageYOffset);}
            if ((pressed)&&(cleared>start_t)) {
                abortpress(evt,"move/cleared");
                return;}
            if (((touched)||(pressed))&&(!(mouse_down))) {
                abortpress(evt,"move/up");
                return;}
            
            // if (target!==th_target) fdjtLog("New target %o",target);
            var x=evt.clientX||getClientX(evt,touch_x,touch_y);
            var y=evt.clientY||getClientY(evt,touch_x,touch_y);
            var distance=((pressed)?
                          (xyd(x,y,target_x,target_y)):
                          (xyd(x,y,start_x,start_y)));
            if ((evt.touches)||(hot_xoff)||(hot_yoff)) {
                x=x+hot_xoff; y=y+hot_yoff;
                target=document.elementFromPoint(x,y);}
            else target=eTarget(evt);
            var delta=(Math.abs(x-touch_x))+(Math.abs(y-touch_y));
            var dt=fdjtET()-touch_t;
            if ((trace>2)||(traceall>2))
                fdjtLog("TapHold/move(%s) s=%d,%d tt=%d,%d t=%d,%d c=%d,%d d=%d thresh=%o, dt=%o md=%o, pressed=%o, touched=%o, event=%o target=%o",
                        thid,start_x,start_y,
                        target_x,target_y,touch_x,touch_y,x,y,
                        distance,movethresh,dt,mouse_down,
                        pressed,touched,evt,target);
            if (!(target)) {
                touch_x=x; touch_y=y; touch_t=fdjtET();
                if (!(touch_n)) touch_n=n_touches; else
                    if (n_touches>touch_n) touch_n=n_touches;
                return;}
            var holder=getParent(target,".tapholder");
            // fdjtLog("taphold_move %o %d,%d %o %o",evt,x,y,target,holder);
            if (holder!==elt) {
                if ((trace>2)||(traceall>2)) {
                    trace_ignore_move(evt,thid,elt,holder,th_target,target,
                                      start_x,start_y,target_x,target_y,
                                      touch_x,touch_y);}
                if (th_target) {
                    if ((trace)||(traceall))
                        fdjtLog("setWanderTimeout(%s): h=%o!=elt=%o",
                                thid,holder,elt);
                    wander_timer=setTimeout(function(){
                        abortpress(evt,"taphold_wander_timeout");},
                                            wanderthresh);
                    if (pressed) {
                        if (!(noslip))
                            slipped(pressed,evt,{relatedTarget: target});
                        setTarget(false);}}
                return;}
            else if (wander_timer) {
                clearTimeout(wander_timer); wander_timer=false;
                if ((trace>2)||(traceall>2))
                    fdjtLog("Wander return(%s) %o pressed=%o, target=%o",
                            thid,evt,pressed,th_target);
                if ((pressed)&&(!(th_target))) {
                    setTarget(pressed);
                    held(pressed,evt);}}
            else {}

            // If touched is false, the tap/hold was aborted somehow
            if ((!((touched)||(pressed)))) {
                // Just tracking, to detect swipes
                if ((!(swipe_t))&&(min_swipe>0)&&(xyd(start_x,start_y,x,y)>min_swipe))
                    swiped(target,evt,start_x,start_y,x,y);
                touch_x=x; touch_y=y; touch_t=fdjtET();
                if (!(touch_n)) touch_n=n_touches; else
                    if (n_touches>touch_n) touch_n=n_touches;
                return;}
            
            if ((movethresh)&&(th_timer)&&
                (distance>movethresh)) {
                if ((trace>1)||(traceall>1))
                    fdjtLog("TapHold/move/cancel(%s) s=%d,%d tt=%d,%d t=%d,%d c=%d,%d d=%d thresh=%o, dt=%o md=%o, event=%o",
                            thid,start_x,start_y,
                            target_x,target_y,touch_x,touch_y,x,y,
                            distance,movethresh,dt,mouse_down,evt);
                abortpress(evt,"movefar");
                if (th_timer) clearTimeout(th_timer);
                pressed_at=touched=th_timer=pressed=false; th_targets=[];
                if ((!(swipe_t))&&(min_swipe>0)&&(xyd(start_x,start_y,x,y)>min_swipe))
                    swiped(target,evt,start_x,start_y,x,y);
                setTarget(false);
                touch_x=x; touch_y=y; touch_t=fdjtET();
                if (!(touch_n)) touch_n=n_touches; else
                    if (n_touches>touch_n) touch_n=n_touches;
                return;}
            else if ((delta<(minmove*10))&&(dt>0)&&((delta/dt)<minmove)) {
                if ((trace>2)||(traceall>2))
                    fdjtLog("TapHold/move/ignore(%s) s=%d,%d t=%d,%d c=%d,%d dt=%o total=%d/%o, local=%d/%o/%o, thresh=%o md=%o",
                            thid,start_x,start_y,touch_x,touch_y,x,y,
                            dt,distance,movethresh,
                            delta,delta/dt,minmove,
                            mouse_down);
                touch_x=x; touch_y=y; touch_t=fdjtET();
                if (!(touch_n)) touch_n=n_touches; else
                    if (n_touches>touch_n) touch_n=n_touches;
                return;}
            else {
                if ((trace>2)||(traceall>2))
                    fdjtLog("TapHold/move(%s) s=%d,%d t=%d,%d c=%d,%d dt=%o total=%d/%o, local=%d/%o/%o, md=%o",
                            thid,start_x,start_y,touch_x,touch_y,x,y,
                            dt,distance,movethresh,delta,minmove,delta/dt,
                            mouse_down);
                touch_x=x; touch_y=y; touch_t=fdjtET();
                if (!(touch_n)) touch_n=n_touches; else
                    if (n_touches>touch_n) touch_n=n_touches;
                target=getParent(target,touchable);}
            if ((evt.touches)&&(evt.touches.length)&&
                (evt.touches.length>maxtouches))
                return;
            else {
                if (reticle.live) reticle.onmousemove(evt,touch_x,touch_y);}
            if (!(target)) target=getRealTarget(elt,touchable,touch_x,touch_y);
            if (!(target)) return;
            if ((hasParent(target,".tapholder"))&&(!(noslip)))
                setTarget(target);
            if ((evt.touches)&&(touched)&&(!(pressed))&&
                (th_targets[th_targets.length-1]!==th_target))
                th_targets.push(th_target);
            if (!(mouse_down)) {
                if (!(noslip))
                    slipped(pressed,evt,{relatedTarget: target});
                pressed_at=pressed=false;}
            else if ((pressed)&&(th_target!==pressed)&&
                     (!((hasParent(th_target,pressed))||
                        (hasParent(pressed,th_target))))&&
                     (noslip)) {      
                if ((trace>1)||(traceall>1))
                    fdjtLog("TapHold/move(%s) endpress pressed=%o tt=%o %o",
                            thid,pressed,th_target,evt);
                endpress(evt);}
            else if ((pressed)&&(th_target!==pressed)) {
                if (!(noslip))
                    slipped(pressed,evt,{relatedTarget: target});
                pressed=th_target;
                if (pressed) pressed_at=fdjtET(); else pressed_at=false;
                held(pressed);}
            else {}}
        function trace_ignore_move(evt,thid,elt,holder,th_target,target,
                                   start_x,start_y,target_x,target_y,
                                   touch_x,touch_y) {
            fdjtLog(
                "TapHold/move%s/farout(%s) %o %o -> %o s=%d,%d tt=%d,%d t=%d,%d",
                ((mouse_down)?("/md"):("")),thid,
                evt,th_target,target,start_x,start_y,
                target_x,target_y,touch_x,touch_y);
            fdjtLog("TapHold/move/farout(%s) target in %o, elt is %o",
                    thid,holder,elt);}

        function taphold_down(evt,holdmsecs){
            evt=evt||window.event;
            if ((evt.ctrlKey)||
                (evt.altKey)||(evt.metaKey)||
                (evt.button)||
                ((evt.which)&&(evt.which>1)))
                return;
            var n_touches=((evt.touches)&&(evt.touches.length))||1;
            mouse_down=true; cleared=0;
            touch_x=(evt.clientX||getClientX(evt)||touch_x)+hot_xoff;
            touch_y=(evt.clientY||getClientY(evt)||touch_y)+hot_yoff;
            start_x=target_x=touch_x; start_y=target_y=touch_y;
            target_t=touch_t=fdjtET();
            var target=(((hot_xoff)||(hot_yoff))?
                        (document.elementFromPoint(touch_x,touch_y)):
                        (eTarget(evt)));
            if (!(touch_n)) touch_n=n_touches; else
                if (n_touches>touch_n) touch_n=n_touches;
            if ((!(bubble))) noBubble(evt);
            if (override) noDefault(evt);
            var new_event=false;
            var holder=getParent(target,".tapholder");
            if ((trace>1)||(traceall>1))
                fdjtLog("TapHold/down(%s) %o tht=%o target=%o holder=%o elt=%o",
                        thid,evt,th_target,target,holder,elt);
            if (holder!==elt) {
                if ((trace>1)||(traceall>1))
                    fdjtLog("TapHold/ignore(%s) %o tht=%o t=%o h=%o elt=%o",
                            thid,evt,th_target,target,holder,elt);
                return;}

            if (target) target=getParent(target,touchable);
            if ((scrolling)&&(evt.touches)&&(evt.touches.length<=maxtouches)) {
                if (scroll_x>=0)
                    scroll_x=scrolling.scrollLeft+(
                        evt.touches[0].pageX-window.pageXOffset);
                if (scroll_y>=0)
                    scroll_y=scrolling.scrollLeft+(
                        evt.touches[0].pageY-window.pageYOffset);}
            if (evt.touches) {
                target=document.elementFromPoint(touch_x,touch_y);}
            if ((trace>1)||(traceall>1))
                fdjtLog(
                    "TapHold/down2(%s) %o tht=%o trg=%o s=%o,%o,%o t=%o,%o m=%o tch=%o prs=%o ttt=%o",
                    thid,evt,th_target,target,
                    start_x,start_y,start_t,touch_x,touch_y,mouse_down,
                    touched,pressed,taptapmsecs||false);
            
            if ((evt.touches)&&(th_target)) {
                // Handle additional touches while holding/pressing
                var cur_holder=getParent(elt,".tapholder");
                var touch=evt.changedTouches[0];
                if ((trace>1)||(traceall>1))
                    fdjtLog("TapHold(%s) second touch on %o (in %o) after %o (in %o)",
                            thid,target,holder,th_target,cur_holder,
                            (cur_holder===holder));
                if ((touchtoo)&&(cur_holder===holder)) {
                    if ((trace>1)||(traceall>1))
                        fdjtLog("TapHold(%s) touchtoo with touchtoo on %o after %o: %o",
                                thid,target,th_target,evt);
                    if (touchtoo.call) {
                        touchtoo.call(th,evt);
                        return;}
                    new_event=document.createEvent('UIEvent');
                    new_event.initUIEvent(
                        "touchtoo",true,true,window,0);
                    new_event.screenX=touch.screenX;
                    new_event.screenY=touch.screenY;
                    new_event.clientX=touch.clientX;
                    new_event.clientY=touch.clientY;
                    new_event.ctrlKey=evt.ctrlKey;
                    new_event.altKey=evt.altKey;
                    new_event.shiftKey=evt.shiftKey;
                    new_event.metaKey=evt.metaKey;
                    new_event.touches=document.createTouchList(touch);
                    new_event.targetTouches=document.createTouchList(touch);
                    new_event.changedTouches=document.createTouchList(touch);
                    target.dispatchEvent(new_event);
                    return;}
                else if ((cur_holder)&&(holder)&&
                         (cur_holder!==holder)) {
                    if ((trace>1)||(traceall>1))
                        fdjtLog("TapHold(%s) Clearing on %o, moving %o to %o",
                                thid,th_target,evt,target);
                    new_event=document.createEvent('TouchEvent');
                    new_event.initTouchEvent(
                        evt.type,true,true,window,null,
                        touch.screenX,touch.screenY,
                        touch.clientX,touch.clientY,
                        evt.ctrlKey,evt.altKey,evt.shiftKey,evt.metaKey,
                        document.createTouchList(touch),
                        document.createTouchList(touch),
                        document.createTouchList(touch));}
                else {}}
            if (new_event) {
                abortpress(evt,"down/touch2");
                target.dispatchEvent(new_event);
                return;}
            else {setTarget(target); th_targets=[];}
            start_t=fdjtET();
            if ((trace>1)||(traceall>1))
                fdjtLog("TapHold/down3(%s) %o t=%o x=%o y=%o t=%o touched=%o",
                        thid,evt,th_target,start_x,start_y,start_t,touched);
            if ((untouchable)&&(untouchable(evt))) return;
            if (!(touched)) startpress(evt,holdmsecs);}

        function taphold_up(evt){
            evt=evt||window.event;
            mouse_down=false;
            if (cleared>start_t) {
                abortpress(evt,"up");
                return;}
            var target=eTarget(evt);
            if ((!(bubble))) noBubble(evt);
            if (override) noDefault(evt);
            var holder=getParent(target,".tapholder");
            if (holder!==elt) {
                if ((trace>1)||(traceall>1))
                    fdjtLog("TapHold/up/ignore(%s) %o tht=%o target=%o holder=%o elt=%o",
                            thid,evt,th_target,target,holder,elt);
                return;}
            if (target) target=getParent(target,touchable);
            touch_x=(evt.clientX||getClientX(evt)||touch_x)+hot_xoff;
            touch_y=(evt.clientY||getClientY(evt)||touch_y)+hot_yoff;
            touch_t=fdjtET();
            if ((!(target))||(hot_xoff)||(hot_yoff))
                target=getRealTarget(elt,touchable,touch_x,touch_y);
            if ((trace>1)||(traceall>1))
                fdjtLog("TapHold/up(%s) %o tht=%o d=%o s=%o,%o,%o t=%o,%o m=%o touched=%o pressed=%o ttt=%o swipe_t=%o",
                        thid,evt,th_target,
                        xyd(start_x,start_y,touch_x,touch_y),
                        start_x,start_y,start_t,touch_x,touch_y,mouse_down,
                        touched,pressed,taptapmsecs,swipe_t);
            if ((evt.changedTouches)&&(evt.changedTouches.length)&&
                (evt.changedTouches.length>maxtouches))
                return;
            var swipe_len=(swipe_t)?(0):xyd(start_x,start_y,touch_x,touch_y);
            if ((touched)||(pressed)) {
                if ((untouchable)&&(untouchable(evt))) return;
                endpress(evt);}
            else if ((min_swipe>0)&&(swipe_len>min_swipe)&&
                     (((!touched)||(touched!==elt))&&
                      ((!pressed)||(pressed!==elt))))
                swiped(target,evt,start_x,start_y,touch_x,touch_y);
            else if ((touched)||(pressed)) {
                if (!((untouchable)&&(untouchable(evt)))) endpress(evt);}
            else {}
            cleartouch();}

        function taphold_cancel(evt){
            if ((trace)||(traceall))
                fdjtLog("TapHold/cancel(%s) %o: th=%o t=%o p=%o",
                        thid,evt,th_target,touched,pressed);
            if (th_timer) {
                clearTimeout(th_timer); th_timer=false;}
            else if (pressed) {released(pressed,evt);}
            if (reticle.live) reticle.highlight(false);
            pressed_at=touched=pressed=tap_target=false;
            if (holdclass) setTimeout(stop_holding,20);
            th_targets=[];
            setTarget(false);}

        if (!(opts)) opts={};
        else if (!(opts.hasOwnProperty)) opts={touch: true};
        else {}

        fortouch=((opts.hasOwnProperty('fortouch'))?(opts.fortouch):
                  (default_opts.hasOwnProperty('fortouch'))?
                  (default_opts.fortouch):(false));
        holdmsecs=((opts.hasOwnProperty('holdmsecs'))?(opts.holdmsecs):
                    (default_opts.hasOwnProperty('holdmsecs'))?
                    (default_opts.holdmsecs):(150));
        movethresh=((opts.hasOwnProperty('movethresh'))?(opts.movethresh):
                    (default_opts.hasOwnProperty('movethresh'))?
                    (default_opts.movethresh):(20));
        taptapmsecs=((opts.hasOwnProperty('taptapmsecs'))&&
                      (opts.taptapmsecs));
        wanderthresh=((opts.hasOwnProperty('wanderthresh'))?(opts.wanderthresh):
                      (default_opts.hasOwnProperty('wanderthresh'))?
                      (default_opts.wanderthresh):(2000));
        override=((opts.hasOwnProperty('override'))?(opts.override):
                  (default_opts.hasOwnProperty('override'))?
                  (default_opts.override):(false));
        touchtoo=((opts.hasOwnProperty('touchtoo'))?(opts.touchtoo):
                  (default_opts.hasOwnProperty('touchtoo'))?
                  (default_opts.touchtoo):(false));
        min_swipe=((opts.hasOwnProperty('minswipe'))?(opts.minswipe):
                   (default_opts.hasOwnProperty('minswipe'))?
                   (default_opts.minswipe):(30));
        bubble=((opts.hasOwnProperty('bubble'))?(opts.bubble):
                (default_opts.hasOwnProperty('bubble'))?
                (default_opts.bubble):(false));
        maxtouches=((opts.hasOwnProperty('maxtouches'))?(opts.maxtouches):
                    (default_opts.hasOwnProperty('maxtouches'))?
                    (default_opts.maxtouches):(1));
        if ((taptapmsecs)&&(typeof taptapmsecs !== "number"))
            taptapmsecs=default_opts.taptapmsecs||200;
        scrolling=((opts.hasOwnProperty('scrolling'))?(opts.touch):(false));
        if (scrolling) {
            if (!(scrolling.nodeType)) scrolling=elt;
            if ((opts.hasOwProperty('scrollx'))?(opts.scrollx):(false))
                scroll_x=0; else scroll_x=-1;
            if ((opts.hasOwProperty('scrolly'))?(opts.scrolly):(true))
                scroll_y=0; else scroll_y=-1;}

        if (opts.hasOwnProperty('holdclass')) holdclass=opts.holdclass;
        else if (default_opts.hasOwnProperty('holdclass'))
            holdclass=default_opts.holdclass;
        else {}

        if (opts.hasOwnProperty('touchclass')) touchclass=opts.touchclass;
        else if (default_opts.hasOwnProperty('touchclass'))
            touchclass=default_opts.touchclass;
        else {}

        if (opts.hasOwnProperty('minmove')) minmove=opts.minmove;
        else if (default_opts.hasOwnProperty('minmove'))
            minmove=default_opts.minmove;
        else if (fortouch) minmove=2;
        else minmove=0;

        if (opts.hasOwnProperty('handlers'))
            this.handlers=opts.handlers;
        
        addClass(elt,"tapholder");
        
        if (!(fortouch)) fdjtDOM.addListener(elt,"mousemove",taphold_move);
        fdjtDOM.addListener(elt,"touchmove",taphold_move);
        if (!(fortouch)) fdjtDOM.addListener(elt,"mousedown",taphold_down);
        if (!(fortouch)) fdjtDOM.addListener(elt,"mouseout",taphold_mouseout);
        if (!(fortouch)) fdjtDOM.addListener(elt,"mouseover",taphold_mouseover);
        fdjtDOM.addListener(elt,"touchstart",taphold_down);
        if (!(fortouch)) fdjtDOM.addListener(elt,"mouseup",taphold_up);
        // fdjtDOM.addListener(elt,"click",taphold_click);
        fdjtDOM.addListener(elt,"touchend",taphold_up);
        fdjtDOM.addListener(elt,"touchcancel",taphold_cancel);        
        if (!(window_setup)) {
            if (!(default_opts.fortouch)) {
                fdjtDOM.addListener(window,"mousedown",global_mousedown);
                fdjtDOM.addListener(window,"mouseup",global_mouseup);
                fdjtDOM.addListener(window,"mouseout",global_mouseout);}
            // fdjtDOM.addListener(document,"keydown",taphold_keydown);
            // fdjtDOM.addListener(document,"keyup",taphold_keyup);
            window_setup=window;}

        this.elt=elt;
        this.serial=serial;
        this.opts={bubble: bubble,
                   override: override,
                   movethresh: movethresh,
                   holdmsecs: holdmsecs,
                   taptapmsecs: taptapmsecs};
        this.istouched=function(){return (touched);};
        this.ispressed=function(){return (pressed);};
        this.clear=function(){
            if ((trace)||(traceall))
                fdjtLog("TapHold/clear(%s) th=%o t=%o p=%o",
                        thid,th_target,touched,pressed);
            if ((pressed)&&(!(noslip))) slipped(pressed);
            pressed_at=touched=pressed=tap_target=false;
            cleartouch(true);
            setTarget(false);
            th_targets=[];};
        this.fakePress=function fakePress(evt,holdmsecs){
            start_x=target_x=touch_x=evt.clientX||getClientX(evt);
            start_y=target_y=touch_y=evt.clientY||getClientY(evt);
            touch_t=start_t=fdjtET();
            var target=document.elementFromPoint(start_x,start_y);
            if (!(target))
                fdjtLog("TapHold(%s): No target from %o,%o",
                        thid,start_x,start_y);
            setTarget(target); th_targets=[target];
            if ((trace)||(traceall))
                fdjtLog("TapHold/fakePress(%s) t=%o x=%o y=%o t=%o",
                        thid,th_target,start_x,start_y,start_t);
            startpress(evt,holdmsecs);};
        this.abort=abortpress;

        this.getState=function(){
            return {thid: thid,elt: elt,
                    pressed: pressed,touched: touched,
                    th_target: th_target,th_last: th_last,
                    start_x: start_x,start_y: start_y,start_t: start_t,
                    touch_x: touch_x,touch_y: touch_y,touch_t: touch_t,
                    target_x: target_x,target_y: target_y,th_target_t: th_target_t,
                    trace: trace};};

        this.trace=function(flag){
            var cur=trace;
            if (typeof flag === "undefined")
                trace=1;
            else if (typeof flag==="number")
                trace=flag;
            else if (flag)
                trace=2;
            else trace=0;
            return cur;};

        this.debug=function(){
            // jshint debug:true
            debugger;};
        
        if ((trace)||(traceall))
            fdjtLog("New TapHold(%s) for %o: %o opts %j, trace=%o/%o",
                    thid,elt,th,opts||false,trace,traceall);
        
        return this;}

    TapHold.clear=function(){
        if (traceall) fdjtLog("TapHold.clear()");
        cleared=fdjtET();};

    function traceTapHold(flag){
        if (typeof flag === "undefined")
            return traceall;
        else {
            var cur=traceall;
            if (typeof flag==="number")
                traceall=flag;
            else if (flag)
                traceall=default_opts.traceall||2;
            else {}
            return cur;}}
    TapHold.trace=traceTapHold;

    TapHold.default_opts=default_opts;

    return TapHold;})();


/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/selecting.js ###################### */

/* Copyright (C) 2009-2015 beingmeta, inc.

   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file provides extended Javascript utility functions
   of various kinds.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));
    if (!(fdjt.UI)) fdjt.UI={};

fdjt.TextSelect=fdjt.UI.Selecting=fdjt.UI.TextSelect=
    (function(){
        "use strict";
        var fdjtDOM=fdjt.DOM;
        var fdjtLog=fdjt.Log;
        var fdjtUI=fdjt.UI;
        var hasParent=fdjtDOM.hasParent;
        var stripIDs=fdjtDOM.stripIDs;        
        var getStyle=fdjtDOM.getStyle;
        var textify=fdjtDOM.textify;
        var hasClass=fdjtDOM.hasClass;
        var swapClass=fdjtDOM.swapClass;
        var dropClass=fdjtDOM.dropClass;

        var rAF=fdjtDOM.requestAnimationFrame;

        function position(elt,arr){
            if (arr.indexOf) return arr.indexOf(elt);
            else {
                var i=0, lim=arr.length;
                while (i<lim) {
                    if (arr[i]===elt) return i;
                    else i++;}
                return -1;}}

        var selectors={}; // Maps DOM ids to instances
        var alltapholds={}; // Maps DOM ids to taphold objects
        var serialnum=0;  // Tracks instances
        var traceall=0;

        function TextSelect(nodes,opts){
            if (!(this instanceof TextSelect))
                return new TextSelect(nodes,opts);
            else this.serial=++serialnum;
            if (typeof nodes==='string') {
                var elt=document.getElementById(nodes);
                if (!(elt)) return false;
                else this.nodes=nodes=[elt];}
            else if (nodes.nodeType) this.nodes=nodes=[nodes];
            else if (!(nodes.length)) return false;
            else this.nodes=nodes;
            var sel=this, trace=0;
            var orig=this.orig=[], wrapped=this.wrapped=[];
            var words=this.words=[], wrappers=this.wrappers=[];
            var tapholds=this.tapholds=[];
            if ((opts)&&(opts.hasOwnProperty("trace"))) {
                var trace_val=opts.trace;
                if (typeof trace_val === "number") trace=trace_val;
                else if (trace_val) trace=1;
                else trace=0;}
            this.traced=trace;
            if (opts.onstart) sel.onstart=opts.onstart;
            if (opts.onstop) sel.onstop=opts.onstop;
            var prefix=this.prefix="fdjtSel0"+this.serial;
            if ((typeof opts.loupe !== 'undefined')||
                (typeof TextSelect.loupe !== 'undefined'))
                this.loupe=opts.loupe||TextSelect.loupe;
            else {
                this.loupe=fdjtDOM("span.fdjtselectloupe");}
            this.adjust=false; /* This will be 'start' or 'end' */
            selectors[prefix]=sel;
            var stripid=prefix.length+1;
            var k=0, n=nodes.length;
            while (k<n) {
                var node=nodes[k++];
                var style=getStyle(node);
                var wrapper=
                    ((style.display==='inline')?
                     (fdjtDOM("span.fdjtselecting")):
                     (fdjtDOM("div.fdjtselecting")));
                // Initialize the wrapper
                wrapper.id=prefix+"w"+k;
                wrapper.title=((opts)&&(opts.title))||
                    "Tap or hold/drag to move the ends of the text range";
                selectors[wrapper.id]=sel;
                wrappers.push(wrapper);
                var th=addHandlers(wrapper,sel,opts);
                alltapholds[wrapper.id]=th;
                tapholds.push(th);
                if ((trace)||(traceall))
                    fdjtLog("Created TapHold handler (#%d) for wrapper %s around %o",
                            th.serial,wrapper.id,node);
                // Replace the node with the wrapper and then update
                // the node (replacing words with spans) while it's
                // outside of the DOM for performance.
                node.parentNode.replaceChild(wrapper,node);
                orig.push(node); wrapped.push(wrapper);
                // Actually wrap the words in spans
                wrapText(node,orig,wrapped,words,prefix);
                // And put the node back into the DOM
                wrapper.appendChild(node);}
            // These track the state of the current selection
            //  for this instance
            this.start=false; this.end=false;
            this.min=-1; this.max=-1; this.n_words=0;
            this.onchange=((opts)&&(opts.onchange))||false;
            // This gets the word offset for a particular target
            this.wordnum=function wordnum(target){
                var id=false;
                while ((target)&&(target.nodeType!==1))
                    target=target.parentNode;
                if ((target)&&((id=target.id))&&
                    (target.tagName==="SPAN")&&
                    (id.search(prefix)===0))
                    return parseInt(id.slice(stripid),10);
                else return false;};
            
            this.startEvent=function startEvent(evt,holdmsecs){
                var target=fdjtUI.T(evt);
                if (traceall)
                    fdjtLog("startEvent %o, target=%o, wrappers=%o",
                            evt,target,wrappers);
                var j=0, n_wrappers=wrappers.length; while (j<n_wrappers) {
                    var wrapper=wrappers[j++];
                    if ((hasParent(wrapper,target))||
                        (hasParent(target,wrapper))) {
                        var taphold=alltapholds[wrapper.id];
                        if ((trace)||(traceall))
                            fdjtLog("Using TapHold handler @%d for wrapper %s (#%d)",
                                    j-1,wrapper.id,taphold.serial);
                        taphold.fakePress(evt,holdmsecs);
                        return;}}};

            return this;}

        

        TextSelect.prototype.toString=function(){
            var wrappers=this.wrappers; 
            var output="TextSelect(["+
                (this.min)+((this.adjust==="start")?("*"):(""))+","+
                (this.max)+((this.adjust==="end")?("*"):(""))+"],";
            
            var i=0, lim=wrappers.length;
            while (i<lim) {
                var id=wrappers[i].id;
                if (id) output=output+((i>0)?(","):(""))+
                    "'"+wrappers[i].id+"'";
                i++;}
            output=output+")";
            return output;};

        function wrapText(node,orig,wrapped,words,prefix){
            var i, lim;
            if (node.nodeType===3) {
                var text=node.nodeValue, span;
                /*
                // Skip wrapping non-inline whitespace
                if (((text.length===0)||(text.search(/\S/g)<0))) {
                var parent=node.parentNode, pstyle=getStyle(parent);
                var prev=node.prevSibling, next=node.nextSibling;
                if (((prev)||(next))&& // ((pstyle.whiteSpace||wsprop)==='normal')
                (pstyle.display!=='inline')&&(pstyle.display!=='table-cell')) {
                var pdisplay=((prev)&&(getStyle(prev).display));
                var ndisplay=((next)&&(getStyle(next).display));
                if ((pdisplay!=='inline')&&(ndisplay!=='inline'))
                return node;}}
                */
                var sliced=mergeSoftHyphens(text.split(/\b/)), wordspans=[];
                i=0; lim=sliced.length;
                while (i<lim) {
                    var word=sliced[i++];
                    if (word.length===0) continue;
                    else if ((word.search(/\S/)>=0)&&
                             (word.search(/\s/)>=0)) {
                        var scan=word;
                        while (scan.length) {
                            var space=scan.search(/\s/);
                            var notspace=scan.search(/\S/);
                            var split=((space<=0)?(notspace):
                                       (notspace<=0)?(space):
                                       (space<notspace)?(space):
                                       (notspace));
                            if (split<=0) split=scan.length;
                            if (split>0) {
                                var txt=scan.slice(0,split);
                                span=fdjtDOM("span.fdjtword",txt);
                                span.id=prefix+"_"+(words.length);
                                words.push(span);
                                wordspans.push(span);}
                            scan=scan.slice(split);}}
                    else {
                        span=fdjtDOM("span.fdjtword",word);
                        span.id=prefix+"_"+(words.length);
                        words.push(span);
                        wordspans.push(span);}}
                return fdjtDOM("span.fdjtselectwrap",wordspans);}
            else if (node.nodeType!==1) return node;
            else {
                var classname=node.className;
                if ((classname)&&(typeof classname === "string")&&
                    ((classname==='fdjtselectwrap')||
                     (node.className==="fdjtskiptext")||
                     (node.className.search(/\bfdjtskiptext\b/)>=0)))
                    return node;
                var style=getStyle(node);
                if ((style.position!=='')&&
                    (style.position!=='static'))
                    return node;
                var children=node.childNodes;
                if (!(children)) return node;
                else if (children.length===0) return node;
                else if (node.className==='fdjtselectwrap') return node;
                else {
                    i=0; lim=children.length;
                    while (i<lim) {
                        var child=children[i++];
                        var wrap=wrapText(child,orig,wrapped,words,prefix);
                        if (child!==wrap) {
                            orig.push(child);
                            wrapped.push(wrap);
                            node.replaceChild(wrap,child);}}
                    return node;}}}

        function mergeSoftHyphens(vec){
            var i=0, lim=vec.length; var out=[], word=false;
            while (i<lim) {
                var wd=vec[i++];
                if (wd==='­') {
                    if (word) {
                        var nxt=vec[i];
                        if (nxt) {word=word+wd+nxt; i++;}
                        else word=word+wd;}
                    else word=wd;}
                else {
                    if (word) out.push(word);
                    word=wd;}}
            if (word) out.push(word);
            return out;}

        /* Selecting ranges */

        function selectWords(words,start,end){
            var i=start; while (i<=end)
                words[i++].className="fdjtselected";}
        function deselectWords(words,start,end){
            var i=start; while (i<=end)
                words[i++].className="fdjtword";}

        function startSelection(sel){
            if (sel.active) return;
            else sel.active=true;
            if (sel.onstart) sel.onstart();}
        function stopSelection(sel){
            if (!(sel.active)) return;
            else sel.active=false;
            if (sel.onstop) sel.onstop();}

        TextSelect.prototype.setRange=function(start,end){
            var trace=this.trace;
            if ((trace)||(traceall))
                fdjtLog("TextSelect.setRange %o %o for %o",start,end,this);
            if (!(start)) {
                if ((this.start)&&(this.end)) {
                    deselectWords(this.words,this.min,this.max);}
                this.start=this.end=false;
                this.min=this.max=-1;
                this.n_words=0;
                if (this.onchange) this.onchange();
                return;}
            var words=this.words;
            var min=this.wordnum(start), max=this.wordnum(end);
            if (max<min) {
                var tmp=start; start=end; end=tmp;
                tmp=min; min=max; max=tmp;}
            if (!(this.start)) {
                // First selection
                selectWords(words,min,max);
                words[max].className='fdjtselectend';
                words[min].className='fdjtselectstart';}
            else if ((this.start===start)&&(this.end===end)) return;
            else {
                // Minimize the effort for a change in selection
                var cur_min=this.wordnum(this.start);
                var cur_max=this.wordnum(this.end);
                if ((min>cur_max)||(max<cur_min)) {
                    deselectWords(words,cur_min,cur_max);
                    selectWords(words,min,max);}
                else {
                    // Overlapping, just do the difference
                    if (min<cur_min) selectWords(words,min,cur_min);
                    else if (min>cur_min) deselectWords(words,cur_min,min);
                    else {}
                    if (max>cur_max) selectWords(words,cur_max,max);
                    else if (max<cur_max) deselectWords(words,max,cur_max);
                    else {}}
                words[max].className="fdjtselectend";
                words[min].className="fdjtselectstart";}
            this.min=min; this.max=max;
            this.start=start; this.end=end;
            this.n_words=(max-min)+1;
            if (this.onchange) this.onchange();};

        /* Handler support */
        
        function overWord(word,tapped,sel){
            var id=false;
            while ((word)&&(word.nodeType!==1)) word=word.parentNode;
            if (hasParent(word,".fdjtselectloupe"))
                return;
            if (!(sel.active)) startSelection(sel);
            if ((!(sel))&&(word)&&((id=word.id))&&
                (word.tagName==='SPAN')&&
                (id.search("fdjtSel")===0)) {
                var split=id.indexOf("_");
                if (split) sel=selectors[id.slice(0,split)];}
            if (!(sel)) {
                var container=word; while (container) {
                    if ((container.className)&&(container.id)&&
                        (typeof container.className === "string")&&
                        (container.className.search(/\bfdjtselecting\b/)>=0))
                        break;
                    else container=container.parentNode;}
                if (!(container)) return false;
                else sel=selectors[container.id];}
            if (!(sel)) return false;
            if ((traceall)||(sel.traced))
                fdjtLog("overWord %o, sel=%o, tapped=%o, adjust=%o, anchor=%o",
                        word,sel,tapped,sel.adjust,sel.anchor);
            if (tapped) useWord(word,sel,true);
            else if (sel.word) useWord(word,sel);
            else if ((hasClass(word,"fdjtselectstart"))||
                     (hasClass(word,"fdjtselectend"))) {
                if (sel.timeout) {
                    clearTimeout(sel.timeout); sel.timeout=false;}
                sel.pending=false; sel.word=word; useWord(word,sel);}
            else if (sel.pending===word) return true;
            else if (!(word.offsetParent)) return false;
            else {
                if (sel.timeout) clearTimeout(sel.timeout);
                updateLoupe(word,sel,false);
                sel.word=false; sel.pending=word;
                sel.timeout=setTimeout(function(){
                    if (sel.pending!==word) return;
                    if (sel.timeout) clearTimeout(sel.timeout);
                    sel.word=word; sel.pending=false;
                    useWord(word,sel);},
                                       100);}
            return true;}

        function useWord(word,sel,tapped){
            var start=sel.start, end=sel.end;
            if (!(word.offsetParent)) return;
            if (!(sel.start)) {
                var initial=initSelect(word);
                start=initial.start; end=initial.end;}
            else if (sel.anchor) {
                start=sel.anchor; end=word;}
            else if (sel.start===sel.end) {
                // Just one word is selected, so use the touched word
                // as the 'end' and let setRange sort out the correct
                // order
                start=sel.start; end=word;}
            else {
                var off=sel.wordnum(word);
                // Check that you're consistent with the end you're moving
                if ((sel.adjust==='start')&&(off>sel.max)) return;
                if ((sel.adjust==='end')&&(off<sel.min)) return;
                // Figure out whether you're moving the beginning or end
                if (sel.adjust==='start') start=word;
                else if (sel.adjust==='end') end=word;
                else if (start===word) sel.setAdjust('start');
                else if (end===word) sel.setAdjust('end');
                else if (off<=sel.min) {
                    start=word; sel.setAdjust('start');}
                else if (off>=sel.max) {
                    end=word; sel.setAdjust('end');}
                else if ((off-sel.min)<6) {
                    start=word; sel.setAdjust('start');}
                else if ((sel.max-off)<6) {
                    end=word; sel.setAdjust('end');}
                else if (tapped) return;
                else if ((off-sel.min)>((sel.max-sel.min)/2)) {
                    end=word; sel.setAdjust('end');}
                else {
                    start=word; sel.setAdjust('start');}}
            rAF(function(){
                sel.setRange(start,end);
                if (sel.loupe) updateLoupe(word,sel,tapped);});}

        function nodeSearch(node,pat){
            if (node.nodeType===3) {
                return (node.nodeValue.search(pat)>=0);}
            else if (node.nodeType===1) {
                var children=node.childNodes;
                var i=0, lim=((children)?(children.length):(0));
                while (i<lim) {
                    var child=children[i++];
                    if (child.nodeType===3) {
                        if (child.nodeValue.search(pat)>=0) 
                            return child;}
                    else if (child.nodeType===1) {
                        if (nodeSearch(child,pat)) return child;}
                    else {}}
                return false;}
            else return false;}

        function initSelect(word){
            var begin=word, end=word, scan, last;
            if (!(nodeSearch(word,/"\(\[\{/))) {
                last=begin; scan=begin.previousSibling;
                while (scan) {
                    if ((scan.nodeType!==1)||
                        (!(hasClass(scan,"fdjtword")))) {
                        scan=scan.previousSibling; continue;}
                    if (nodeSearch(scan,/["\(\[\{]/)) {
                        begin=scan; break;}
                    else if (nodeSearch(scan,/[.;!?]/)) {
                        begin=last; break;}
                    else {last=scan; scan=scan.previousSibling;}}
                if (!(scan)) begin=last;}
            if (nodeSearch(word,/[.;!?]/)) end=word;
            else {
                last=end; scan=end.nextSibling;
                while (scan) {
                    if ((scan.nodeType!==1)||
                        (!(hasClass(scan,"fdjtword")))) {
                        scan=scan.nextSibling; continue;}
                    if (nodeSearch(scan,/[".;!?]/)) {
                        end=scan; break;}
                    else {
                        last=scan; scan=scan.nextSibling;}}
                if (!(scan)) end=last;}
            return {start: begin,end: end};}
        
        function updateLoupe(word,sel,tapped){
            var parent=word.parentNode, loupe=sel.loupe;
            if (!(loupe)) return;
            var inline_loupe=hasParent(loupe,".fdjtselecting");
            if (sel.loupe_timeout) {
                clearTimeout(sel.loupe_timeout);
                sel.loupe_timeout=false;}
            if (!(word.offsetParent)) return;
            var block=word.parentNode; while (block) {
                if (getStyle(block).display!=='inline') break;
                else block=block.parentNode;}
            if ((traceall)||(sel.traced))
                fdjtLog("updateLoupe(%d) over %o for %o%s",
                        sel.serial,word,sel,
                        ((tapped)?(" (tapped)"):("")));
            var context=gatherContext(word,5,5,block);
            var geom=fdjtDOM.getGeometry(word,word.offsetParent);
            var cwidth=word.offsetParent.offsetWidth;
            loupe.innerHTML=""; fdjtDOM.append(loupe,context.words);
            if (inline_loupe) {
                loupe.style.display="none";
                parent.insertBefore(loupe,word);
                if (geom.left<(cwidth/2)) {
                    loupe.style.float="left";
                    loupe.style.left=(geom.left-(1.5*context.wordstart))+"px";
                    loupe.style.right="";}
                else {
                    loupe.style.float="right";
                    loupe.style.right=(cwidth-geom.right)-
                        (1.5*(context.width-context.wordend))+"px";
                    loupe.style.left="";}}
            loupe.style.display="";
            if (tapped) setTimeout(function(){
                if (sel.active) stopSelection(sel);
                sel.loupe.display='none';},
                                   1000);}
        var getGeometry=fdjtDOM.getGeometry;

        function gatherContext(node,back,forward,parent){
            var id=node.id, parsed=(id)&&/(fdjtSel\d+_)(\d+)/.exec(id);
            if ((!(parsed))||(parsed.length!==3)) return;
            var prefix=parsed[1], count=parseInt(parsed[2],10);
            var start=count-back, end=count+forward; if (start<0) start=0;
            var context=[], width=0, wordstart, wordend;
            var start_geom=getGeometry(node);
            var i=start; while (i<end) {
                var elt=document.getElementById(prefix+i);
                if ((!(elt))||((parent)&&(!(hasParent(elt,parent))))) {
                    i++; continue;}
                else if (elt.nodeType===1) {
                    var geom=getGeometry(elt);
                    if ((geom.bottom<start_geom.top)||
                        (geom.top>=start_geom.bottom)) {
                        i++; continue;}
                    var clone=elt.cloneNode(true); stripIDs(clone);
                    if (i<count) width=width+elt.offsetWidth;
                    else if (i===count) {
                        wordstart=width;
                        width=wordend=width+elt.offsetWidth;}
                    else width=width+elt.offsetWidth;
                    if (elt===node) fdjtDOM.addClass(clone,"fdjtselected");
                    context.push(clone);}
                else context.push(elt.cloneNode(true));
                i++;}
            return {words: context, width: width,
                    wordstart: wordstart, wordend: wordend};}

        function getSelector(word){
            var id=false;
            if ((word)&&((id=word.id))&&
                (word.tagName==='SPAN')&&
                (id.search("fdjtSel")===0)) {
                var split=id.indexOf("_");
                if (split)
                    return selectors[id.slice(0,split)]||false;
                else return false;}
            else return false;}
        TextSelect.getSelector=getSelector;

        // Getting the selection text
        // This tries to be consistent with textify functions in fdjtDOM
        TextSelect.prototype.setString=function(string){
            var wrappers=this.wrappers;
            var whole=((wrappers.length===1)&&(wrappers[0]));
            if (!(whole)) {
                whole=fdjtDOM("div"); 
                var i=0, lim=wrappers.length;
                while (i<lim) {
                    var wrapper=wrappers[i++];
                    whole.appendChild(wrapper.cloneNode(true));}}
            var found=fdjtDOM.findMatches(whole,string,0,1);
            if ((!(found))||(found.length===0)) return;
            else found=found[0];
            var start=found.startContainer, end=found.endContainer;
            while ((start)&&(start.nodeType!==1)) start=start.parentNode;
            while ((end)&&(end.nodeType!==1)) end=end.parentNode;
            if ((start)&&(end)&&(start.id)&&(end.id)&&
                (start.id.search(this.prefix)===0)&&
                (end.id.search(this.prefix)===0)) {
                start=document.getElementById(start.id);
                end=document.getElementById(end.id);}
            else return;
            if ((start)&&(end)) this.setRange(start,end);};

        TextSelect.prototype.getString=function(start,end,rawtext){
            if (!(start)) start=this.start; if (!(end)) end=this.end;
            var wrappers=this.wrappers; 
            var combine=[]; var prefix=this.prefix; var wpos=-1;
            var scan=start; while (scan) {
                if (rawtext) {}
                else if (scan.nodeType===1) {
                    var style=getStyle(scan);
                    if ((style.position==='static')&&
                        (style.display!=='inline')&&
                        (style.display!=='none'))
                        combine.push("\n");}
                if ((scan.nodeType===1)&&(scan.tagName==='SPAN')&&
                    (scan.id)&&(scan.id.search(prefix)===0)) {
                    var txt=scan.innerText||textify(scan);
                    combine.push(txt.replace("­",""));
                    if (scan===end) break;}
                if ((scan.firstChild)&&
                    (scan.className!=="fdjtselectloupe")&&
                    (scan.firstChild.nodeType!==3))
                    scan=scan.firstChild;
                else if (scan.nextSibling) scan=scan.nextSibling;
                else {
                    while (scan) {
                        if ((wpos=position(scan,wrappers))>=0) break;
                        else if (scan.nextSibling) {
                            scan=scan.nextSibling; break;}
                        else scan=scan.parentNode;}
                    if (wpos>=0) {
                        if ((wpos+1)<wrappers.length)
                            scan=wrappers[wpos+1];}}
                if (!(scan)) break;}
            return combine.join("");};

        TextSelect.prototype.getOffset=function(under){
            if (!(this.start)) return false;
            var first_word=this.words[0]; 
            if (under) {
                var words=this.words; var i=0, lim=words.length;
                if (!((hasParent(this.start,under))&&
                      (hasParent(this.end,under))))
                    return false;
                while ((i<lim)&&(!(hasParent(first_word,under))))
                    first_word=words[i++];}
            var selected=this.getString(false,false,true);
            var preselected=this.getString(first_word,this.end,true);
            return preselected.length-selected.length;};
        
        TextSelect.prototype.getInfo=function(under){
            var trace=this.traced;
            if (!(this.start)) return false;
            var selected=this.getString();
            var first_word=this.words[0]; 
            if (under) {
                var words=this.words; var i=0, lim=words.length;
                if (!((hasParent(this.start,under))&&
                      (hasParent(this.end,under))))
                    return false;
                while ((i<lim)&&(!(hasParent(first_word,under))))
                    first_word=words[i++];}
            var rawselect=this.getString(false,false,true);
            var preselected=this.getString(first_word,this.end,true);
            if ((trace)||(traceall)) 
                fdjtLog("GetInfo %o: start=%o, end=%o, off=%o, string=%o",
                        this,this.start,this.end,
                        preselected.length-rawselect.length,
                        selected);
            return { start: this.start, end: this.end,
                     off: preselected.length-rawselect.length,
                     string: selected};};
        
        TextSelect.prototype.setAdjust=function(val){
            var trace=this.traced;
            if ((traceall)||(trace))
                fdjtLog("TextSelect.setAdjust %o for %o",val,this);
            if (val) {
                this.adjust=val;
                swapClass(this.nodes,/\b(fdjtadjuststart|fdjtadjustend)\b/,
                          "fdjtadjust"+val);}
            else {
                this.adjust=false;
                dropClass(this.nodes,/\b(fdjtadjuststart|fdjtadjustend)\b/);}};


        // Life span functions

        TextSelect.prototype.clear=function(){
            var wrappers=this.wrappers;
            var orig=this.orig, wrapped=this.wrapped;
            if (!(orig)) return; // already cleared
            var i=orig.length-1;
            while (i>=0) {
                var o=orig[i], w=wrapped[i]; i--;
                w.parentNode.replaceChild(o,w);}
            var j=0, lim=wrappers.length;
            while (j<lim) {
                var wrapper=wrappers[j++];
                delete alltapholds[wrapper.id];
                delete selectors[wrapper.id];}
            if (this.onclear) {
                var onclear=this.onclear; this.onclear=false;
                if (!(Array.isArray(onclear))) onclear=[onclear];
                i=0; lim=onclear.length; while (i<lim) {
                    onclear[i++]();}}
            delete selectors[this.prefix];
            delete this.wrapped; delete this.orig;
            delete this.wrappers; delete this.nodes;
            delete this.words; delete this.wrappers;
            delete this.start; delete this.end;};
        
        // Handlers

        function hold_handler(evt){
            evt=evt||window.event;
            var target=fdjtUI.T(evt);
            while ((target)&&(target.nodeType!==1))
                target=target.parentNode;
            while (target) {
                if ((target)&&(target.id)&&(target.tagName==='SPAN')&&
                    (target.id.search("fdjtSel")===0)) {
                    var sel=getSelector(target);
                    if ((sel)&&(!(sel.anchor))&&(!(sel.start)))
                        sel.anchor=target;
                    if ((traceall)||((sel)&&(sel.traced)))
                        fdjtLog("TextSelect/hold %o t=%o sel=%o",
                                evt,target,sel);
                    overWord(target,false,sel);
                    fdjtUI.cancel(evt);
                    break;}
                else if (target.nodeType===1) target=target.parentNode;
                else break;}}
        TextSelect.hold_handler=hold_handler;
        TextSelect.handler=hold_handler;
        function tap_handler(evt){
            evt=evt||window.event;
            var target=fdjtUI.T(evt);
            while ((target)&&(target.nodeType!==1))
                target=target.parentNode;
            while (target) {
                if ((target)&&(target.id)&&(target.tagName==='SPAN')&&
                    (target.id.search("fdjtSel")===0)) {
                    var sel=getSelector(target);
                    if ((traceall)||((sel)&&(sel.traced)))
                        fdjtLog("TextSelect/tap %o t=%o sel=%o",evt,target,sel);
                    // Tapping on a single word selection clears it
                    if (sel.n_words===1) sel.setRange(false);
                    else if ((target.className==="fdjtselectstart")||
                             (target.className==="fdjtselectend")) {
                        // Tapping on a start or end selects just that word
                        fdjtUI.cancel(evt);
                        sel.setRange(target,target);}
                    // Otherwise, call overWord, which makes the word the
                    //  beginning or end of the selection
                    else if (overWord(target,true,sel)) {
                        if (target.className==="fdjtselectstart")
                            sel.adjust="start";
                        else if (target.className==="fdjtselectend")
                            sel.adjust="end";
                        else sel.adjust=false;
                        fdjtUI.cancel(evt);}
                    else if (sel) sel.adjust=false;
                    break;}
                else if (target.nodeType===1) target=target.parentNode;
                else break;}}
        TextSelect.tap_handler=tap_handler;
        function release_handler(evt,sel){
            evt=evt||window.event;
            var target=fdjtUI.T(evt);
            if ((traceall)||((sel)&&(sel.traced)))
                fdjtLog("TextSelect/release %o t=%o sel=%o",evt,target,sel);
            if (sel) {
                sel.anchor=false; sel.word=false; sel.pending=false;
                if (sel.timeout) {
                    clearTimeout(sel.timeout); sel.timeout=false;}
                sel.setAdjust(false);
                if (sel.loupe) sel.loupe.style.display='none';
                if (sel.active) stopSelection(sel);}}
        function slip_handler(evt,sel){
            evt=evt||window.event;
            var target=fdjtUI.T(evt);
            if ((traceall)||((sel)&&(sel.traced)))
                fdjtLog("TextSelect/slip %o t=%o sel=%o",evt,target,sel);
            if (sel) {
                if (sel.loupe) sel.loupe_timeout=
                    setTimeout(function(){
                        sel.loupe_timeout=false;
                        if (sel.active) stopSelection(sel);
                        sel.loupe.style.display='none';},
                               2000);}}
        TextSelect.release_handler=release_handler;
        function get_release_handler(sel,also){
            return function(evt){
                release_handler(evt,sel);
                if (also) also(evt,sel);};}
        function get_slip_handler(sel,also){
            return function(evt){
                slip_handler(evt,sel);
                if (also) also(evt,sel);};}
        
        function addHandlers(container,sel,opts){
            // We always override the default action when selecting
            if (!(opts)) opts={};
            opts.override=true;
            opts.touchable=
                ".fdjtword,.fdjtselected,.fdjtselectstart,.fdjtselectend";
            var taphold=new fdjtUI.TapHold(container,opts);
            fdjtDOM.addListener(container,"tap",
                                ((opts)&&(opts.ontap))||
                                tap_handler);
            fdjtDOM.addListener(container,"hold",
                                ((opts)&&(opts.onhold))||
                                hold_handler);
            fdjtDOM.addListener(
                container,"release",
                get_release_handler(sel,opts.onrelease||false));
            fdjtDOM.addListener(
                container,"slip",
                get_slip_handler(sel,opts.onslip||false));
            return taphold;}

        TextSelect.trace=function(flag,thtoo){
            if (typeof flag === "undefined") return traceall;
            else if (typeof flag === "number")
                traceall=flag;
            else if (flag) traceall=1;
            else traceall=0;
            if (thtoo) fdjt.TapHold.trace(thtoo);};
        
        // Return the constructor
        return TextSelect;})();


/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/* -*- Mode: Javascript; -*- */

/* Copyright (C) 2009-2015 beingmeta, inc.
   This file was created from several component files and is
   part of the FDJT web toolkit (www.fdjt.org)

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

   The copyright notice of the individual files are all prefixed by
   a copyright notice of the form "Copyright (C) ...".

   Use, modification, and redistribution of this program is permitted
   under either the GNU General Public License (GPL) Version 2 (or
   any later version) or under the GNU Lesser General Public License
   (version 3 or later).

   These licenses may be found at www.gnu.org, particularly:
   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
   http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* globals window, global */

(function(){
    "use strict";
    fdjt.useGlobals=fdjt.dbg=function(cxt){
        var names=["fdjtDOM","fdjtUI","fdjtTime","fdjtString","fdjtState",
                   "fdjtLog","fdjtHash","fdjtAjax","fdjtAsync","fdjtInit",
                   "fdjtDialog","fdjtTemplate","fdjtID","fdjtRef",
                   "fdjtTapHold","fdjtSelecting","fdjtTextIndex","fdjtRefDB",
                   "TextIndex","RefDB","CodexLayout","pageShow"];
        if (!(cxt)) cxt=window;
        if (!(cxt)) {
            fdjt.Log("Nowhere to put globals");
            return;}
        var i=0, n=names.length; while (i<n) {
            var name=names[i++];
            var fname=((name.search("fdjt")===0)?(name.slice(4)):(name));
            if ((fdjt[fname])&&(!(cxt[name]))) {
                fdjt.Log("%s = fdjt.%s",name,fname);
                cxt[name]=fdjt[fname];}}
        return n;};
    /*
    window.addEventListener("load",function(){
        var root=(typeof global !== "undefined")?(global):
            (typeof window !== "undefined")?(window):
            (false);
        fdjt.useGlobals(root);});
    */
})();

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
/*! syze v1.1.1 MIT/GPL2 @rezitech */
(function (win, docEl) {
     /* jshint browser: true, evil: true */
     "use strict";
     // syze variables
     var
     _sizes = [],
     _names = {},
     _from = 'browser',
     _debounceRate = 50,
     _callback;
     // add window event
     function addWinEvent(type, fn) {
         if (win.addEventListener) addEventListener(type, fn, false); else win.attachEvent('on' + type, fn);
     }
     // debouncer
     function debounce(fn) {
         var timeout;
         return function () {
             var obj = this, args = arguments;
             function delayed () {
                 fn.apply(obj, args);
                 timeout = null;
             }
             if (timeout) clearTimeout(timeout);
             timeout = setTimeout(delayed, _debounceRate); 
         };
     }
     // resizer
     function onResize() {
         var
         currentSize = 
             /^device$/i.test(String(_from)) ? !win.orientation || win.orientation === 180 ? screen.width : screen.height
         : /^browser$/i.test(String(_from)) ? docEl.clientWidth
             : (_from instanceof String) ? (new Function('return ' + _from)())
             : parseInt(_from, 10) || 0,
         docElClassNames = docEl.className.replace(/^\s+|(^|\s)(gt|is|lt)[^\s]+|\s+$/g, '').split(/\s+/),
         classNames = [], i = -1, arr = _sizes, len = arr.length;
         //
         arr.sort(function (a, b) { return(a - b); });
         //
         while (++i < len) if (currentSize < arr[i]) break;
         currentSize = arr[Math.max(Math.min(--i, len - 1), 0)];
         //
         i = -1;
         while (++i < len) {
             classNames.push((currentSize > arr[i] ? 'gt' : currentSize < arr[i] ? 'lt' : 'is') + (_names[arr[i]] || arr[i]));
         }
         //
         docEl.className = (!docElClassNames[0] ? [] : docElClassNames).concat(classNames).join(' ');
         //
         if (_callback) _callback(currentSize);
     }
     // syze controls
     win.syze = {
         sizes: function () { _sizes = [].concat.apply([], arguments); onResize(); return this; },
         names: function (val) { if (val instanceof Object) { _names = val; onResize(); } return this; },
         from: function (val) { _from = val; onResize(); return this; },
         debounceRate: function (val) { _debounceRate = parseInt(val, 10) || 0; onResize(); return this; },
         callback: function (val) { if (val instanceof Function) { _callback = val; onResize(); } return this; }
     };
     // start syze
     addWinEvent('resize', debounce(onResize));
     addWinEvent('orientationchange', onResize);
     onResize();
 }(this, document.documentElement));
/* -*- Mode: Javascript; -*- */

/* ######################### fdjt/scrollever.js ###################### */

/* Copyright (C) 2011-2015 beingmeta, inc.
   This file is a part of the FDJT web toolkit (www.fdjt.org)
   This file implements a simple version of infinite scrolling.

   This program comes with absolutely NO WARRANTY, including implied
   warranties of merchantability or fitness for any particular
   purpose.

    Use, modification, and redistribution of this program is permitted
    under either the GNU General Public License (GPL) Version 2 (or
    any later version) or under the GNU Lesser General Public License
    (version 3 or later).

    These licenses may be found at www.gnu.org, particularly:
      http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
      http://www.gnu.org/licenses/lgpl-3.0-standalone.html

*/
/* jshint browser: true */

// var fdjt=((window)?((window.fdjt)||(window.fdjt={})):({}));
if (!(fdjt.UI)) fdjt.UI={};

fdjt.ScrollEver=fdjt.UI.ScrollEver=(function(){
    "use strict";
    var fdjtDOM=fdjt.DOM, fdjtID=fdjt.ID;
    var fdjtState=fdjt.State, fdjtString=fdjt.String;
    var fdjtLog=fdjt.Log;
    
    function fdjtScrollEver(spec) {
        var busy=false, timer=false;
        if (!(spec)) spec={};
        var url=spec.url||
            fdjtDOM.getLink("~{http://fdjt.org/}scrollfetch")||
            fdjtDOM.getLink("~SCROLLFETCH");
        var off=spec.off||fdjtState.getQuery("OFF")||
            fdjtDOM.getMeta("~{http://fdjt.org/}scrolloffset")||
            fdjtDOM.getMeta("~SCROLLOFFSET")||
            -1;
        var win=spec.win||fdjtState.getQuery("WINDOW")||
            fdjtDOM.getMeta("~{http://fdjt.org/}scrollwindow")||
            fdjtDOM.getMeta("~SCROLLWINDOW")||
            7;
        var limit=spec.limit||fdjtState.getQuery("LIMIT")||
            fdjtDOM.getMeta("~{http://fdjt.org/}scrollmax")||
            fdjtDOM.getMeta("~scrollmax")||
            7;
        var container=spec.container||
            fdjtDOM.getMeta("~{http://fdjt.org/}scrollelement")||
            fdjtDOM.getMeta("~scrollelement")||
            "FDJTSCROLLCONTAINER";
        if (typeof container === 'string') {
            if (fdjtID(container)) container=fdjtID(container);
            else {
                fdjtLog.warn("No container %s",container);
                return;}}
        var wrapper=spec.wrapper||
            fdjtDOM.getMeta("~{http://fdjt.org/}scrollwrapper")||
            fdjtDOM.getMeta("~scrollwrapper")||
            "FDJTSCROLLWRAPPER";
        if (typeof wrapper === 'string') {
            if (fdjtID(wrapper)) wrapper=fdjtID(wrapper);
            else {
                fdjtLog.warn("No wrapper %s",container);
                wrapper=false;}}
        var thresh=spec.thresh||
            fdjtDOM.getMeta("~{http://fdjt.org/}scrollthresh")||
            fdjtDOM.getMeta("~scrollthresh")||
            100;
        var interval=spec.interval||
            fdjtDOM.getMeta("~{http://fdjt.org/}scrollinterval")||
            fdjtDOM.getMeta("~scrollinterval")||
            500;
        if (typeof off !== 'number') off=parseInt(off,10);
        if (typeof win !== 'number') win=parseInt(win,10);
        if (typeof limit !== 'number') limit=parseInt(limit,10);
        if (typeof thresh !== 'number') thresh=parseInt(thresh,10);
        if (typeof interval !== 'number') interval=parseInt(interval,10);
        
        if (fdjtScrollEver.debug) {
            fdjtLog("fdjtScrollEver called: %o/%o+%o, fetch=%s",
                    off,limit,win,url);
            fdjtLog("fdjtScrollEver scrolling on %opx, checking every %ous on %o",
                    thresh,interval,container);}

        function getMoreResults(){
            if (busy) return;
            if ((!(url))||(!(container))||(off>=limit)) {
                if (timer) clearTimeout(timer);
                fdjtDOM.addClass(document.body,"scrolleverdone");
                return;}
            else busy=true;
            var call=url.replace("-off-",fdjtString((off<0)?(0):(off)));
            var req=new XMLHttpRequest();
            req.open("GET",call,true);
            req.withCredentials=true;
            req.onreadystatechange=function () {
                if ((req.readyState === 4) && (req.status === 200)) {
                    if (fdjtScrollEver.debug)
                        fdjtLog("fdjtScrollEver getMoreResults (response)");
                    var tbl=fdjtDOM(container.tagName);
                    var htmltext=req.responseText;
                    try {tbl.innerHTML=htmltext;}
                    catch (ex) {
                        var span=document.createElement("span");
                        span.style.display='none';
                        span.innerHTML="<"+container.tagName+">"+
                            htmltext+"</"+container.tagName+">";
                        tbl=span.childNodes[0];}
                    var add=[];
                    var children=tbl.childNodes;
                    var i=0; var lim=children.length, seenids={};
                    while (i<lim) {
                        var child=children[i++];
                        if ((child.nodeType===1)&&(child.id)) {
                            if ((document.getElementById(child.id))||
                                (seenids[child.id])) {}
                            else add.push(child);}
                        else add.push(child);
                        if (child.id) seenids[child.id]=child.id;}
                    fdjtDOM(container,add);
                    off=off+win;
                    var iscroll=spec.iscroll||window.iscroller||false;
                    if (iscroll)
                        setTimeout(function(){iscroll.refresh();},10);
                    busy=false;}};
            if (fdjtScrollEver.debug)
                fdjtLog("fdjtScrollEver getMoreResults (call)");
            req.send(null);}

        function scrollChecker(){
            if (busy) return;
            if (wrapper) {
                var top=wrapper.scrollTop, sh=wrapper.scrollHeight;
                var oh=wrapper.offsetHeight;
                if ((sh<=oh)||((top+(oh*2))>=sh))
                    getMoreResults();}
            else {
                var iscroll=spec.iscroll||window.iscroller||false;
                var page_height=(iscroll)?(iscroll.scrollerH):
                    (document.documentElement.scrollHeight);
                var scroll_pos=(iscroll)?(-iscroll.y):
                    (window.pageYOffset);
                if ((!(iscroll))&&(typeof scroll_pos !== 'number'))
                    scroll_pos=document.documentElement.scrollTop;
                var client_height=(iscroll)?(iscroll.wrapperH):
                    (document.documentElement.clientHeight);
                if (((page_height-(scroll_pos+client_height))<thresh)||
                    (page_height<client_height))
                    getMoreResults();}}
        timer=setInterval(scrollChecker,interval);
        return timer;}
    return fdjtScrollEver;})();

// fdjtScrollEver.debug=true;

/* Emacs local variables
   ;;;  Local variables: ***
   ;;;  compile-command: "make; if test -f ../makefile; then cd ..; make; fi" ***
   ;;;  indent-tabs-mode: nil ***
   ;;;  End: ***
*/
// FDJT build information
fdjt.revision='1.5-1486-ga7d244b';
fdjt.buildhost='moby.dc.beingmeta.com';
fdjt.buildtime='Thu Oct 22 11:15:33 EDT 2015';
fdjt.builduuid='4623e670-b8c9-4082-9cd4-438bb6bfeb55';

