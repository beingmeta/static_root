# This automatically generates various compound files for beingmeta
# web applications

# We define this because some versions of make (like on OSX) seem to
# have a built-in version of echo which doesn't handle the -n argument
ECHO=/bin/echo
CLEAN=/bin/rm -f
PATH:=/usr/local/bin:${PATH}
FDJT_FILES=fdjt/header.js \
	fdjt/promise.js fdjt/async.js fdjt/fetch.js \
	fdjt/charnames.js fdjt/string.js fdjt/time.js \
	fdjt/template.js fdjt/hash.js \
	fdjt/log.js fdjt/init.js fdjt/state.js \
	fdjt/dom.js fdjt/adjustfont.js \
	fdjt/json.js fdjt/refdb.js fdjt/ajax.js fdjt/wsn.js \
	fdjt/textindex.js \
	fdjt/ui.js fdjt/showpage.js fdjt/dialog.js fdjt/completions.js \
	fdjt/taphold.js fdjt/selecting.js \
	fdjt/globals.js
FDJT_EXTRA=fdjt/syze.js fdjt/scrollever.js
BUILDUUID:=`uuidgen`
BUILDTIME:=`date`
BUILDHOST:=`hostname`
BRANCH=master
UGLIFY:=uglifyjs2
UGLIFY_FLAGS:=-b
UGLIFY_OFLAGS:=-c -b
CLEANCSS:=`which cleancss`
POSTCSS:=`which postcss`
AUTOPREFIXER:=`which autoprefixer`
CLEANGRAPHICS=rm -f *.svgz *.png *.navicon *.sqlogo *.hudbutton *.docicon \
		*.glossbutton *.textbg *.skimbutton *.typeicon *.sqicon \
		*.rct *.ico
SVN=svn --non-interactive --trust-server-cert
POSTCSSOPTS=-u postcss-import -u postcss-url -u postcss-cssnext -u cssnano

FDJT_CSS=fdjt/fdjt.css fdjt/normalize.css
KNODULES_FILES=knodules/knodules.js knodules/tags.js \
	knodules/html.js
KNODULES_HINTS=knodules/knodules.hint knodules/tags.hint \
	knodules/html.hint
KNODULES_CSS=knodules/knodules.css
PAGEDOWN_FILES=metabook/pagedown.js
SSC_FILES=showsomeclass/ssc.js showsomeclass/dialog.js showsomeclass/edit.js
SSC_CSS=showsomeclass/ssc.css showsomeclass/dialog.css showsomeclass/edit.css
SSC_HTML=showsomeclass/bigtextedit.html showsomeclass/savedialog.html \
	showsomeclass/editcontent.html showsomeclass/sscabout.html \
	showsomeclass/editelement.html showsomeclass/sschelp.html \
	showsomeclass/edithelp.html showsomeclass/ssctoolbar.html \
	showsomeclass/editselection.html showsomeclass/textedit.html \
	showsomeclass/reclass.html showsomeclass/toolbar.html
SSC_BUNDLE=${SSC_FILES} ${SSC_CSS} ${SSC_HTML}

METABOOK_FILES=\
	metabook/root.js metabook/config.js metabook/mycopyid.js \
	metabook/core.js metabook/nav.js \
	metabook/domscan.js metabook/glossdata.js \
	metabook/cover.js metabook/body.js metabook/tagindex.js \
	metabook/syncstate.js metabook/mycopyid.js \
	metabook/user.js metabook/getglosses.js \
	metabook/startup.js \
	metabook/slices.js metabook/clouds.js metabook/tocslice.js \
	metabook/hud.js metabook/preview.js metabook/resize.js \
	metabook/social.js metabook/search.js metabook/glosses.js \
	metabook/interaction.js metabook/pagebar.js metabook/zoom.js \
	metabook/layout.js metabook/debug.js
METABOOK_HINTS=\
	metabook/core.hint metabook/config.hint metabook/syncstate.hint \
	metabook/nav.hint metabook/mycopyid.hint \
	metabook/domscan.hint metabook/glossdata.hint \
	metabook/user.hint metabook/getglosses.hint \
	metabook/cover.hint metabook/body.hint metabook/tagindex.hint \
	metabook/startup.hint \
	metabook/preview.hint metabook/hud.hint metabook/tocslice.hint \
	metabook/resize.hint \
	metabook/slices.hint metabook/clouds.hint metabook/tocslice.hint \
	metabook/social.hint metabook/search.hint metabook/glosses.hint \
	metabook/interaction.hint metabook/pagebar.hint metabook/zoom.hint \
	metabook/layout.hint
METABOOK_DERIVED_FILES=\
	metabook/html/searchbox.js metabook/html/addgloss.js \
	metabook/html/hud.js metabook/html/heart.js metabook/html/attach.js  \
	metabook/html/help.js metabook/html/hudhelp.js metabook/html/menu.js \
	metabook/html/console.js metabook/html/messages.js     \
	metabook/html/cover.js metabook/html/settings.js \
	metabook/html/layoutwait.js

METABOOK_HTML_FILES=\
	metabook/html/searchbox.html metabook/html/addgloss.html \
	metabook/html/hud.html metabook/html/heart.html \
	metabook/html/attach.html metabook/html/menu.html \
	metabook/html/help.html metabook/html/hudhelp.html \
	metabook/html/console.html metabook/html/messages.html \
	metabook/html/cover.html metabook/html/settings.html \
	metabook/html/layoutwait.html

# fonts/open_sans.css 
METABOOK_CSS=\
	metabook/css/app.css metabook/css/framing.css metabook/css/menu.css \
	fonts/open_dyslexic.css metabook/css/fonts.css \
	metabook/css/cover.css metabook/css/settings.css metabook/css/hud.css \
	metabook/css/foot.css metabook/css/body.css metabook/css/help.css \
	metabook/css/slices.css metabook/css/tocslice.css metabook/css/clouds.css \
	metabook/css/skimmer.css metabook/css/card.css metabook/css/search.css \
	metabook/css/addgloss.css metabook/css/heart.css \
	metabook/css/preview.css metabook/css/colors.css \
	metabook/css/debug.css

# removed sbooks/reset.css
SBOOKS_FILES=sbooks/sbooks.css \
	sbooks/app.css sbooks/app.js \
	metabook/amalgam.js
LOGIN_CSS=sbooks/login.css

# metabook/fontcheck.js
METABOOK_JS_BUNDLE=fdjt/idbshim.js ${FDJT_FILES} fdjt/codex.js \
	${KNODULES_FILES} \
	${PAGEDOWN_FILES} ${METABOOK_FILES} \
	${METABOOK_DERIVED_FILES}
# removed sbooks/reset.css 
METABOOK_CSS_BUNDLE=${FDJT_CSS} fdjt/codexlayout.css \
	${KNODULES_CSS} ${METABOOK_CSS}

ALLFILES=$(FDJT_FILES) $(KNODULES_FILES) $(METABOOK_FILES)

ROOT_FDJT=fdjt.js fdjt.min.js fdjt.min.js.gz fdjt.css fdjt.css.gz
ROOT_METABOOK=metabook.js metabook.js.gz \
	metabook.raw.js metabook.raw.js.gz \
	metabook.min.js metabook.min.js.gz \
	metabook.css metabook.css.gz \
	metabook.post.css metabook.post.css.gz
DIST_FDJT=dist/fdjt.min.js dist/fdjt.min.js.gz dist/fdjt.min.js.map \
	dist/fdjt.js.gz dist/fdjt.js dist/fdjt.css dist/fdjt.css.gz
DIST_METABOOK=dist/metabook.js dist/metabook.css \
	dist/metabook.js.gz dist/metabook.css.gz \
	dist/metabook.min.js dist/metabook.min.js.gz \
	dist/metabook.min.js dist/metabook.min.js.gz \
	dist/metabook.post.css dist/metabook.post.css.gz

SBOOKSTYLES=sbooks/sbookstyles.css

%.gz: %
	@gzip $< -c > $@

%.gpg: %
	gpg --output $@ -r ops@beingmeta.com --encrypt $<

%.cfg: %.cfg.gpg
	gpg --output $@ --decrypt $<
%.profile: %.profile.gpg
	gpg --output $@ --decrypt $<
%.sh.cfg: %.sh.gpg
	gpg --output $@ --decrypt $<

fdjt/%.hint: fdjt/%.js
	@echo Checking $@
	@JSHINT=`which jshint`; \
	if test "x$${JSHINT}" = "x"; then touch $@; \
	else $${JSHINT} --config fdjt/.jshintrc $< | tee $@; \
	fi
knodules/%.hint: knodules/%.js
	@echo Checking $@
	@JSHINT=`which jshint`; \
	if test "x$${JSHINT}" = "x"; then touch $@; \
	else $${JSHINT} --config knodules/.jshintrc $< | tee $@; \
	fi
metabook/%.hint: metabook/%.js
	@echo Checking $@
	@JSHINT=`which jshint`; \
	if test "x$${JSHINT}" = "x"; then touch $@; \
	else $${JSHINT} --config metabook/.jshintrc $< | tee $@; \
	fi

dist/%: fdjt/%
	cp $< $@

metabook/html/%.js: metabook/html/%.html makefile
	@./text2js metaBook.HTML.`basename $@ .js` $< $@

dist/%.gz: dist/%
	@gzip $< -c > $@
fdjt/%.gz: fdjt/%
	@gzip $< -c > $@

.SUFFIXES: .js .css .gz

default: root ssc alltags allhints index.html

root: ${ROOT_FDJT} ${ROOT_METABOOK}

#${ROOT_METABOOK} ${DIST_METABOOK}: fdjt metabook knodules webfontloader
#${ROOT_FDJT} ${DIST_FDJT}: fdjt
dist: ${DIST_FDJT} ${DIST_METABOOK}

ssc: showsomeclass/app.js showsomeclass/app.css

allhints: fdjt/fdjt.hints metabook/metabook.hints knodules/knodules.hints showsomeclass/hints

cleanhints:
	rm -f fdjt/*.hint fdjt/fdjt.hints
	rm -f metabook/*.hint metabook/metabook.hints 
	rm -f knodules/*.hint knodules/knodules.hints
	rm -f sbooks/*.hint sbooks/sbooks.hints
	rm -f showsomeclass/*.hint showsomeclass/sbooks.hints

hints:
	make cleanhints
	make allhints

.PHONY: ssc dist allhints hints cleanhints

fdjt/fdjt.hints: $(FDJT_HINTS)
	cd fdjt; make fdjt.hints
metabook/metabook.hints: $(METABOOK_HINTS) metabook/.jshintrc
	@cat $^ > $@
knodules/knodules.hints: $(KNODULES_HINTS) knodules/.jshintrc
	@cat $^ > $@
showsomeclass/hints:
	@cd showsomeclass; make hints

metabook/css/debug.css:
	echo "/* No debugging CSS rules */" > metabook/css/debug.css
metabook/debug.js:
	echo "/* No debugging Javascript */" > metabook/debug.js

showsomeclass/app.js: $(SSC_FILES) $(SSC_HTML) showsomeclass/makefile
	cd showsomeclass; make
showsomeclass/app.css: showsomeclass/ssc.css showsomeclass/dialog.css \
	showsomeclass/edit.css showsomeclass/makefile
	cd showsomeclass; make

# Checkout rules
fdjt:
	git clone git@github.com:beingmeta/fdjt.git
knodules:
	git clone git@github.com:beingmeta/knodules_js.git knodules
metabook:
	git clone git@github.com:beingmeta/metabook.git
showsomeclass:
	git clone git@github.com:beingmeta/showsomeclass.git
g:
	${SVN} checkout svn+ssh://dev.beingmeta.com/svn/src/graphics/targets g
pagedown:
	hg clone https://code.google.com/p/pagedown/
bibliotype:
	git clone https://github.com/cmod/bibliotype.git
aloha:
	git clone https://github.com/alohaeditor/Aloha-Editor.git aloha
ext:
	cd ext; make 
webfontloader:
	git clone https://github.com/typekit/webfontloader.git webfontloader

tidy:
	rm -f *~

clean: tidy
	cd fdjt; make clean
	cd showsomeclass; make clean
	make cleanhints
	rm -f ${METABOOK_DERIVED_FILES}
	rm -f TAGS XTAGS SBOOKTAGS APPTAGS FDTAGS KNOTAGS
	rm -f metabook*js metabook*css fdjt*js fdjt*css *.map
	rm -f metabook*js.gz metabook*css.gz fdjt*js.gz fdjt*css.gz
	rm -f metabook/buildstamp.js fdjt/buildstamp.js
	rm -f knodules/buildstamp.js

undist:
	rm dist/*; git checkout dist
cleandist:
	cd dist; rm -f fdjt.css.gz fdjt.js fdjt.js.gz  \
	   fdjt.min.js fdjt.min.js.gz fdjt.min.js.map  \
           metabook.css                                \
	   metabook.post.css metabook.post.css.gz      \
	   metabook.post.css.map \
           metabook.js metabook.js.gz                  \
           metabook.min.js metabook.min.js.gz          \
	   metabook.min.js metabook.min.js.gz    \
	   metabook.min.js.map;
freshdist:
	make cleandist
	make dist

redist:
	for x in  fdjt.css.gz fdjt.js fdjt.js.gz              \
		  fdjt.min.js fdjt.min.js.gz fdjt.min.js.map  \
	          metabook.clean.css metabook.clean.css.gz    \
	          metabook.post.css metabook.post.css.gz      \
	          metabook.css metabook.css.gz                \
		  metabook.js metabook.js.gz                  \
		  metabook.min.js metabook.min.js.gz          \
	          metabook.min.js.map;                        \
	  do git add dist/$x; done

.PHONY: tidy clean undist cleandist freshdist redist

fdjt/fdjt.js: $(FDJT_FILES) $(FDJT_EXTRA) fdjt/fdjt.hints
	cd fdjt; make all
fdjt/buildstamp.js: $(FDJT_FILES) $(FDJT_EXTRA) $(FDJT_CSS)
	cd fdjt; make all
fdjt/codexhash.js: fdjt/codex.js
	@echo \
          "fdjt.Codex.sourcehash='`etc/sha1 fdjt/codexlayout.js`';" \
		> fdjt/codexhash.js 
	@echo >> fdjt/codexhash.js
	@echo >> fdjt/codexhash.js
	cd fdjt; make all

fdjt.js: fdjt/fdjt.js makefile fdjt/makefile fdjt/fdjt.hints
	cp fdjt/fdjt.js fdjt.js

fdjt.min.js: ${FDJT_FILES} $(FDJT_EXTRA) fdjt/buildstamp.js makefile fdjt/fdjt.hints
	@echo Building ./fdjt.min.js
	$(UGLIFY) $(UGLIFY_FLAGS) \
	  --source-map fdjt.min.js.map \
	    ${FDJT_FILES} $(FDJT_EXTRA) fdjt/buildstamp.js \
	  > $@

metabook/buildstamp.js: $(METABOOK_JS_BUNDLE) $(METABOOK_CSS_BUNDLE) \
			$(METABOOK_HTML)
	@$(ECHO) "// sBooks metaBook build information" > $@
	@cd metabook; echo "metaBook.version='"`git describe`"';" >> \
		buildstamp.js
	@$(ECHO) "metaBook.buildid='${BUILDUUID}';" >> $@
	@$(ECHO) "metaBook.buildtime='${BUILDTIME}';" >> $@
	@$(ECHO) "metaBook.buildhost='${BUILDHOST}';" >> $@
	@$(ECHO) >> $@
	@echo "Created $@"
knodules/buildstamp.js: $(KNODULES_FILES) $(KNODULES_CSS)
	@cd knodules; echo "Knodule.version='"`git describe`"';" \
		> buildstamp.js
	@echo "Created knodules/buildstamp.js"


metabook.min.js: $(METABOOK_JS_BUNDLE) metabook/autoload.js makefile \
	fdjt/fdjt.hints metabook/metabook.hints knodules/knodules.hints \
	fdjt/buildstamp.js fdjt/codex.js \
	knodules/buildstamp.js metabook/buildstamp.js \
	metabook/tieoff.js etc/sha1
	@echo Building ./metabook.min.js and ./metabook.min.js.map
	@$(UGLIFY) $(UGLIFY_FLAGS) \
	  --source-map metabook.min.js.map \
	    metabook/amalgam.js $(METABOOK_JS_BUNDLE) \
	    metabook/tieoff.js \
	    fdjt/buildstamp.js fdjt/codexhash.js \
	    knodules/buildstamp.js metabook/buildstamp.js \
	    metabook/autoload.js -o $@
metabook_bundle.css: makefile $(METABOOK_CSS_BUNDLE)
	echo "/* metaBook CSS bundle */" > metabook_bundle.css
	for cssfile in $(METABOOK_CSS_BUNDLE); \
	  do echo "@import '$${cssfile}';" >> metabook_bundle.css; \
	done
metabook.post.css: metabook_bundle.css makefile postcss.config.json
	@echo Building ./metabook.post.css
	$(POSTCSS) ${POSTCSSOPTS} -m \
		    -o metabook.post.css \
	            < metabook_bundle.css

showsomeclass_bundle.css: makefile $(METABOOK_CSS_BUNDLE)
	echo "/* showsomeclass CSS bundle */" > metabook_bundle.css
	for cssfile in ssc.css dialog.css edit.css; \
	  do echo "@import 'showsomeclass/$${cssfile}';" >> showsomeclass_bundle.css; \
	done
showsomeclass.css: showsomeclass_bundle.css makefile postcss.config.json
	@echo Building ./showsomeclass.post.css
	@$(POSTCSS) ${POSTCSSOPTS} \
		    -o showsomeclass.post.css \
	            < showsomeclass_bundle.css
showsomeclass.js:
	@cd showsomeclass; make ../showsomeclass.js

fresh:
	make clean
	make $(ROOT_FDJT) $(ROOT_METABOOK)

metabook.raw.css: $(METABOOK_CSS_BUNDLE) makefile
	@echo Building ./metabook.raw.css
	@cat $(METABOOK_CSS_BUNDLE) > $@
metabook.raw.js: $(METABOOK_JS_BUNDLE) makefile \
	fdjt/fdjt.hints metabook/metabook.hints knodules/knodules.hints \
	fdjt/buildstamp.js fdjt/codexhash.js \
	knodules/buildstamp.js metabook/buildstamp.js \
	metabook/tieoff.js metabook/autoload.js
	@echo Building ./metabook.raw.js
	@cat metabook/amalgam.js \
		$(METABOOK_JS_BUNDLE) \
		fdjt/buildstamp.js fdjt/codexhash.js \
		knodules/buildstamp.js metabook/buildstamp.js \
		metabook/tieoff.js \
	     metabook/autoload.js > $@
	@echo "fdjt.Codex.sourcehash='`etc/sha1 fdjt/codex.js`';" \
		>> $@
metabook.js: metabook.raw.js
	rm -f metabook.js
	ln -sf metabook.raw.js metabook.js
metabook.js.gz: metabook.raw.js.gz
	rm -f metabook.js.gz
	ln -sf metabook.raw.js.gz metabook.js
metabook.css: metabook.raw.css
	rm -f metabook.css
	ln -sf metabook.raw.css metabook.css

metabook/tieoff.js dist/tieoff.js:
	@touch $@

dist/metabook.js: fdjt/fdjt.hints metabook/metabook.hints knodules/knodules.hints \
	$(METABOOK_JS_BUNDLE) metabook/autoload.js \
	fdjt/buildstamp.js fdjt/codexhash.js \
	knodules/buildstamp.js metabook/buildstamp.js \
	dist/tieoff.js etc/sha1
	@echo Building dist/metabook.js
	@cat metabook/amalgam.js $(METABOOK_JS_BUNDLE) \
		fdjt/buildstamp.js fdjt/codexhash.js \
		knodules/buildstamp.js metabook/buildstamp.js \
		dist/tieoff.js metabook/autoload.js > $@
	@echo "fdjt.Codex.sourcehash='`etc/sha1 fdjt/codex.js`';" \
		>> $@
dist/metabook.css: $(METABOOK_CSS_BUNDLE)
	@echo Rebuilding dist/metabook.css
	@cat $(METABOOK_CSS_BUNDLE) > $@
dist/metabook.post.css: ./metabook.post.css makefile
	@echo Building dist/metabook.post.css
	@cp ./metabook.post.css ./metabook.post.css.map dist

dist/metabook.min.js: fdjt/fdjt.hints metabook/metabook.hints knodules/knodules.hints \
		metabook/amalgam.js $(METABOOK_JS_BUNDLE) \
		fdjt/buildstamp.js fdjt/codexhash.js \
	        knodules/buildstamp.js metabook/buildstamp.js \
		metabook/tieoff.js metabook/autoload.js
	@echo Building dist/metabook.min.js
	@$(UGLIFY) $(UGLIFY_OFLAGS) \
	  --source-map dist/metabook.min.js.map \
	  --source-map-root /static \
	    metabook/amalgam.js $(METABOOK_JS_BUNDLE) \
	    fdjt/buildstamp.js fdjt/codexhash.js \
	    knodules/buildstamp.js metabook/buildstamp.js \
	    metabook/tieoff.js metabook/autoload.js > $@
dist/metabook.min.js.map: dist/metabook.min.js

dist/fdjt.min.js.map: dist/fdjt.min.js
dist/fdjt.js: $(FDJT_FILES) $(FDJT_EXTRA) fdjt/buildstamp.js fdjt/fdjt.hints makefile
	@echo Rebuilding dist/fdjt.js
	@cat $(FDJT_FILES) $(FDJT_EXTRA) fdjt/buildstamp.js > $@
dist/fdjt.min.js: $(FDJT_FILES) $(FDJT_EXTRA) fdjt/buildstamp.js fdjt/fdjt.hints makefile
	@echo Rebuilding dist/fdjt.min.js
	@$(UGLIFY) $(UGLIFY_OFLAGS)     \
	  --source-map fdjt.min.js.map  \
	  --source-map-root /static     \
	    $(FDJT_FILES) $(FDJT_EXTRA) fdjt/buildstamp.js -o $@
	@cp fdjt.min.js.map dist

fdjt.css: fdjt/fdjt.css makefile postcss.config.json
	@$(POSTCSS) ${POSTCSSOPTS} \
	            -o fdjt.css < fdjt/fdjt.css
dist/fdjt.css: fdjt.css
	@cp fdjt.css dist/fdjt.css

# Compiled

metabook.compiled.js:  metabook/metabook.hints knodules/knodules.hints makefile \
	$(METABOOK_JS_BUNDLE) knodules/buildstamp.js metabook/buildstamp.js \
	dist/tieoff.js etc/sha1
	java -jar closure/compiler.jar \
		--language_in ECMASCRIPT5 \
		--create_source_map metabook.compiled.map \
	        --compilation_level SIMPLE_OPTIMIZATIONS \
		metabook/amalgam.js     \
		$(METABOOK_JS_BUNDLE)   \
	        fdjt/buildstamp.js      \
	        fdjt/codexhash.js \
	        knodules/buildstamp.js  \
		metabook/buildstamp.js  \
                metabook/tieoff.js      \
                metabook/autoload.js    \
		--js_output_file metabook.compiled.js

compiled: metabook.compiled.js metabook.compiled.js.gz

# Generating the HTML

index.html: etc/index_head.html etc/index_foot.html
	@cat etc/index_head.html > index.html
	@echo "<p>Build host: " `hostname` "</p>" >> index.html
	@echo "<p>Build date: " `date` "</p>" >> index.html
	@cd fdjt; echo "<p>FDJT version: " `git describe` "</p>" \
		>> ../index.html
	@cd metabook; echo "<p>metaBook version: " `git describe` "</p>" \
		>> ../index.html
	@cat etc/index_foot.html >> index.html

# Generating javascript strings from HTML

alltags: fdjt knodules metabook TAGS APPTAGS \
	METABOOKTAGS METABOOKHTMLTAGS METABOOKCSSTAGS METABOOKXCSSTAGS \
	fdjt/TAGS HTMLTAGS CSSTAGS SSCTAGS

TAGS: ${FDJT_FILES} fdjt/codex.js ${KNODULES_FILES} \
	${METABOOK_FILES} ${METABOOK_CSS_BUNDLE} ${METABOOK_HTML_FILES}
	@etags -o $@ $^
METABOOKTAGS: ${METABOOK_FILES} ${METABOOK_CSS_BUNDLE} ${METABOOK_HTML_FILES}
	@etags -o $@ $^
METABOOKXCSSTAGS: ${KNODULES_CSS} ${METABOOK_CSS}
	@etags -o $@ $^
METABOOKCSSTAGS: ${METABOOK_CSS_BUNDLE}
	@etags -o $@ $^
METABOOKHTMLTAGS: ${METABOOK_HTML_FILES}
	@etags -o $@ $^
MBAPPTAGS: ${METABOOK_FILES} ${METABOOK_CSS_BUNDLE} ${KNODULES_FILES} \
	${METABOOK_HTML_FILES} ${SBOOKS_FILES}
	@etags -o $@ $^
APPTAGS: ${METABOOK_FILES} ${METABOOK_CSS_BUNDLE} ${KNODULES_FILES} \
	${METABOOK_HTML_FILES} ${SBOOKS_FILES}
	@etags -o $@ $^
HTMLTAGS: ${METABOOK_HTML_FILES}
	@etags -o $@ $^
CSSTAGS: ${METABOOK_CSS_BUNDLE}
	@etags -o $@ $^
SSCTAGS: ${SSC_BUNDLE}
	@etags -o $@ $^
fdjt/TAGS: 
	@cd fdjt; make TAGS

jsmin/jsmin: jsmin/jsmin.c
	${CC} -o jsmin/jsmin jsmin/jsmin.c

# Fileinfo gets version-related information about a file to pass in
# with -D
etc/sha1: etc/sha1.c
	$(CC) -o etc/sha1 etc/sha1.c

checkout:
	git checkout ${BRANCH}; \
	cd fdjt; git checkout ${BRANCH}; \
	cd ../metabook; git checkout ${BRANCH}; \
	cd ../knodules; git checkout ${BRANCH}

diff:
	git diff;
	cd fdjt; git diff
	cd knodules; git diff
	cd metabook; git diff
	cd showsomeclass; git diff
#	cd g; svn diff
status:
	git status -uno
	cd fdjt; git status -uno
	cd knodules; git status -uno
	cd metabook; git status -uno
	cd showsomeclass; git status -uno
#	cd g; svn status -q
pull: fdjt knodules g showsomeclass
	git pull
	cd fdjt; git pull
	cd knodules; git pull
	cd metabook; git pull
	cd showsomeclass; git pull
	if test -d bibliotype; then cd bibliotype; git pull; fi;
	if test -d pagedown; then cd pagedown; hg update; fi;
	cd webfontloader; git pull
#	cd g; svn update
update: fdjt metabook knodules g \
	showsomeclass webfontloader
	make pull
update-code: fdjt knodules
	git pull
	cd fdjt; git pull
	cd knodules; git pull
	cd showsomeclass; git pull
	cd metabook; git pull
	cd webfontloader; git pull
clean-graphics:
	cd g/beingmeta; ${CLEANGRAPHICS}
	cd g/sbooks; ${CLEANGRAPHICS}
	cd g/showsomeclass; ${CLEANGRAPHICS}
update-graphics:
	cd g/sbooks; rm -f *.square *.sqr *.bnr *.rect; \
		make GRAPHICS=/src/graphics
	cd g/beingmeta; rm -f *.square *.sqr *.bnr *.rect; \
		make GRAPHICS=/src/graphics
	cd g/showsomeclass; rm -f *.square *.sqr *.bnr *.rect; \
		make GRAPHICS=/src/graphics

push: fdjt metabook knodules
	git push
	cd fdjt; git push
	cd knodules; git push
	cd metabook; git push

sync-graphics:
	for r in `cat dist-targets`; do \
	  if test "x$r" != "x"; then    \
	   echo "Pushing to $r";	\
	   ./pushg "$r";		\
	  fi;				\
	done;

publish:
	make update
	make
	make release
release: pushstatic.cfg pushstatic.profile
	fdexec ./s3distribute

publish-bundle:
	bash ./publish-bundle.bash

fdiff:
	cd fdjt; git diff
kdiff:
	cd knodules; git diff
mdiff:	
	cd metabook; git diff

metabuild buildbuild:
	npm install uglify-js -g --save-dev
	npm install uglify-js2 -g --save-dev
	npm install rucksack -g --save-dev
	npm install rucksack-css -g --save-dev
	npm install clean-css -g --save-dev
	npm install jshint -g --save-dev
	npm install autoprefixer -g --save-dev
	npm install postcss-cli -g --save-dev
	npm install postcss-cssnext postcss-import postcss-url -g --save-dev
	npm install postcss-reporter postcss-browser-reporter -g --save-dev
	npm install cssnano -g --save-dev
	npm install stylelint -g --save-dev

.PHONY: fresh compiled alltags checkout diff status pull \
	update update-code clean-graphics update-graphics \
	push convert sync-graphics publish release \
	publish-bundle fdiff kdiff mdiff \
	metabuild build build
