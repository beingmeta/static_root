# This automatically generates various compound files for beingmeta
# web applications

# We define this because some versions of make (like on OSX) seem to
# have a built-in version of echo which doesn't handle the -n argument
ECHO=/bin/echo
CLEAN=/bin/rm -f
PATH:=/usr/local/bin:${PATH}
FDJT_FILES=fdjt/header.js fdjt/charnames.js \
	fdjt/string.js fdjt/time.js fdjt/template.js fdjt/hash.js \
	fdjt/syze.js fdjt/iscroll.js \
	fdjt/log.js fdjt/init.js fdjt/state.js fdjt/dom.js \
	fdjt/json.js fdjt/refdb.js fdjt/ajax.js fdjt/wsn.js \
	fdjt/textindex.js \
	fdjt/ui.js fdjt/dialog.js fdjt/completions.js \
	fdjt/taphold.js fdjt/selecting.js fdjt/scrollever.js \
	fdjt/globals.js
BUILDUUID:=`uuidgen`
BUILDTIME:=`date`
BUILDHOST:=`hostname`
BRANCH=master
CLEANGRAPHICS=rm -f *.svgz *.png *.navicon *.sqlogo *.hudbutton *.docicon \
		*.glossbutton *.textbg *.skimbutton *.typeicon *.sqicon *.rct *.ico

FDJT_CSS=fdjt/fdjt.css fdjt/normalize.css
KNODULES_FILES=knodules/knodules.js knodules/tags.js knodules/html.js # knodules/clouds.js 
KNODULES_HINTS=knodules/knodules.hint knodules/tags.hint knodules/html.hint # knodules/clouds.js 
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
	metabook/root.js metabook/core.js metabook/config.js \
	metabook/nav.js metabook/domscan.js \
	metabook/cover.js metabook/body.js metabook/tagindex.js \
	metabook/syncstate.js metabook/user.js metabook/getglosses.js \
	metabook/startup.js \
	metabook/preview.js metabook/hud.js metabook/toc.js metabook/resize.js \
	metabook/slices.js metabook/clouds.js \
	metabook/social.js metabook/search.js metabook/glosses.js \
	metabook/interaction.js metabook/layout.js metabook/debug.js \
	metabook/autoload.js
METABOOK_HINTS=\
	metabook/core.hint metabook/config.hint metabook/syncstate.hint \
	metabook/nav.hint \
	metabook/domscan.hint metabook/user.hint metabook/getglosses.hint \
	metabook/cover.hint metabook/body.hint metabook/tagindex.hint \
	metabook/startup.hint \
	metabook/preview.hint metabook/hud.hint metabook/toc.hint \
	metabook/resize.hint \
	metabook/slices.hint metabook/clouds.hint \
	metabook/social.hint metabook/search.hint metabook/glosses.hint \
	metabook/interaction.hint metabook/layout.hint
METABOOK_DERIVED_FILES=\
	metabook/html/searchbox.js metabook/html/addgloss.js \
	metabook/html/hud.js metabook/html/heart.js  \
	metabook/html/help.js metabook/html/hudhelp.js     \
	metabook/html/console.js metabook/html/messages.js     \
	metabook/html/cover.js metabook/html/settings.js \
	metabook/html/pageleft.js metabook/html/pageright.js

METABOOK_HTML_FILES=\
	metabook/html/searchbox.html metabook/html/addgloss.html \
	metabook/html/hud.html metabook/html/heart.html \
	metabook/html/help.html metabook/html/hudhelp.html \
	metabook/html/console.html metabook/html/messages.html \
	metabook/html/cover.html metabook/html/settings.html \
	metabook/html/pageleft.html metabook/html/pageright.html 

METABOOK_CSS=\
	metabook/css/app.css metabook/css/framing.css \
	fonts/open_sans.css fonts/open_dyslexic.css metabook/css/fonts.css \
	metabook/css/cover.css metabook/css/hud.css \
	metabook/css/foot.css metabook/css/body.css metabook/css/help.css    \
	metabook/css/toc.css metabook/css/slices.css metabook/css/clouds.css \
	metabook/css/card.css metabook/css/search.css \
	metabook/css/addgloss.css metabook/css/heart.css \
	metabook/css/preview.css metabook/css/media.css \
	metabook/css/debug.css

# removed sbooks/reset.css
SBOOKS_FILES=sbooks/sbooks.css \
	sbooks/app.css sbooks/app.js \
	sbooks/amalgam.js
LOGIN_CSS=sbooks/login.css

METABOOK_JS_BUNDLE=${FDJT_FILES} ${KNODULES_FILES} \
	fdjt/indexed.js fdjt/codexlayout.js \
	${PAGEDOWN_FILES} ${METABOOK_FILES} ${METABOOK_DERIVED_FILES}
# removed sbooks/reset.css 
METABOOK_CSS_BUNDLE=${FDJT_CSS} fdjt/codexlayout.css \
	${KNODULES_CSS} ${METABOOK_CSS}

ALLFILES=$(FDJT_FILES) $(KNODULES_FILES) $(METABOOK_FILES)

SBOOKSTYLES=sbooks/sbookstyles.css

knodules/%.hint: knodules/%.js
	@JSHINT=`which jshint`; \
	if test "x$${JSHINT}" = "x"; then touch $@; \
	else $${JSHINT} --config knodules/.jshintrc $< | tee $@; \
	fi
metabook/%.hint: metabook/%.js
	@JSHINT=`which jshint`; \
	if test "x$${JSHINT}" = "x"; then touch $@; \
	else $${JSHINT} --config metabook/.jshintrc $< | tee $@; \
	fi

metabook/html/%.js: metabook/html/%.html makefile
	@./text2js metaBook.HTML.`basename $@ .js` $< $@

.SUFFIXES: .js .css

all: allcode alltags allhints index.html
allcode: fdjt knodules metabook webfontloader \
	metabook.js metabook.css fdjt.js fdjt.css \
	fdjt/fdjt.js showsomeclass/app.js showsomeclass/app.css

dist: dist/metabook.js dist/metabook.css \
	dist/metabook.js.gz dist/metabook.css.gz \
	dist/metabook.js dist/metabook.min.js.gz \
	dist/fdjt.min.js dist/fdjt.min.js.gz dist/fdjt.css.gz \
	dist/fdjt.js.gz dist/fdjt.js dist/fdjt.css

allhints: fdjt/fdjt.hints metabook/metabook.hints \
	knodules/knodules.hints showsomeclass/hints

cleanhints:
	rm -f fdjt/*.hint fdjt/fdjt.hints
	rm -f metabook/root.hints
	rm -f knodules/*.hint knodules/knodules.hints
	rm -f sbooks/*.hint sbooks/sbooks.hints
	rm -f showsomeclass/*.hint showsomeclass/sbooks.hints

hints:
	make cleanhints
	make allhints

fdjt/fdjt.hints: $(FDJT_FILES) fdjt/codexlayout.js
	@cd fdjt; make fdjt.hints
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
	svn checkout svn+ssh://dev.beingmeta.com/svn/src/graphics/targets g
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

clean:
	cd fdjt; make clean
	cd showsomeclass; make clean
	make cleanhints
	rm -f ${METABOOK_DERIVED_FILES}
	rm -f TAGS XTAGS SBOOKTAGS APPTAGS FDTAGS KNOTAGS
	rm -f metabook.js metabook.css fdjt.js fdjt.css

undist:
	git checkout dist/metabook.css dist/metabook.css.gz \
		dist/metabook.js dist/metabook.min.js \
		dist/metabook.js.gz dist/metabook.min.js.gz \
		dist/fdjt.min.js dist/fdjt.min.js.gz dist/fdjt.css.gz

fdjt/fdjt.js: $(FDJT_FILES)
	cd fdjt; make all
fdjt/buildstamp.js: $(FDJT_FILES) $(FDJT_CSS)
	cd fdjt; make all
fdjt/codexlayouthash.js: fdjt/codexlayout.js fdjt/codexlayout.css
	cd fdjt; make all

fdjt.js: fdjt/fdjt.js
	cp fdjt/fdjt.js fdjt.js
fdjt.css: fdjt/fdjt.css
	cp fdjt/fdjt.css fdjt.css

dist/buildstamp.js: $(METABOOK_JS_BUNDLE) $(METABOOK_CSS_BUNDLE)
	@$(ECHO) "// sBooks metaBook build information" > $@
	@$(ECHO) "metaBook.buildhost='${BUILDHOST}';" >> $@
	@$(ECHO) "metaBook.buildtime='${BUILDTIME}';" >> $@
	@$(ECHO) "metaBook.buildid='${BUILDUUID}';" >> $@
	@$(ECHO) >> $@
	@echo "Created $@"
metabook/buildstamp.js: $(METABOOK_FILES) $(METABOOK_CSS_BUNDLE) \
			$(METABOOK_HTML)
	@$(ECHO) "// sBooks metaBook build information" > $@
	@cd metabook; echo "metaBook.version='"`git describe`"';" >> \
		buildstamp.js
	@$(ECHO) "metaBook.buildhost='${BUILDHOST}';" >> $@
	@$(ECHO) "metaBook.buildtime='${BUILDTIME}';" >> $@
	@$(ECHO) "metaBook.buildid='${BUILDUUID}';" >> $@
	@$(ECHO) >> $@
	@echo "Created $@"
knodules/buildstamp.js: $(KNODULES_FILES) $(KNODULES_CSS)
	@cd knodules; echo "Knodule.version='"`git describe`"';" > buildstamp.js
	@echo "Created knodules/buildstamp.js"


metabook.css: $(METABOOK_CSS_BUNDLE) makefile
	@echo Building ./metabook.css
	@cat $(METABOOK_CSS_BUNDLE) > $@
metabook.js: $(METABOOK_JS_BUNDLE) makefile \
	fdjt/buildstamp.js knodules/buildstamp.js \
	metabook/buildstamp.js metabook/tieoff.js etc/sha1
	@echo Building ./metabook.js
	@cat sbooks/amalgam.js fdjt/buildstamp.js \
		$(METABOOK_JS_BUNDLE) metabook/tieoff.js \
		metabook/buildstamp.js knodules/buildstamp.js > $@
	@echo "fdjt.CodexLayout.sourcehash='`etc/sha1 fdjt/codexlayout.js`';" \
		>> $@

metabook/tieoff.js dist/tieoff.js:
	@touch $@

dist/metabook.js: fdjt/fdjt.js dist/buildstamp.js $(METABOOK_JS_BUNDLE) \
	metabook/buildstamp.js knodules/buildstamp.js dist/tieoff.js etc/sha1
	@echo Rebuilding dist/metabook.js
	@cat sbooks/amalgam.js fdjt/buildstamp.js \
		$(METABOOK_JS_BUNDLE) dist/tieoff.js \
		metabook/buildstamp.js knodules/buildstamp.js \
		dist/buildstamp.js > $@
	@echo "fdjt.CodexLayout.sourcehash='`etc/sha1 fdjt/codexlayout.js`';" \
		>> $@
dist/metabook.css: $(METABOOK_CSS_BUNDLE)
	@echo Rebuilding dist/metabook.css
	@cat $(METABOOK_CSS_BUNDLE) > $@
dist/metabook.min.js: dist/metabook.js jsmin/jsmin
	jsmin/jsmin < dist/metabook.js > dist/metabook.min.js
dist/metabook.min.js.gz: dist/metabook.min.js
	gzip dist/metabook.min.js -c > dist/metabook.min.js.gz
dist/metabook.js.gz: dist/metabook.js
	gzip -c dist/metabook.js > $@
dist/metabook.css.gz: dist/metabook.css
	gzip -c dist/metabook.css > $@

fdjt/fdjt.min.js dist/fdjt.min.js: fdjt/fdjt.js jsmin/jsmin
	jsmin/jsmin < fdjt/fdjt.js > $@
fdjt/fdjt.min.js.gz dist/fdjt.min.js.gz: fdjt/fdjt.min.js
	gzip fdjt/fdjt.min.js -c > $@
fdjt/fdjt.css.gz dist/fdjt.css.gz: fdjt/fdjt.css
	gzip -c fdjt/fdjt.css > $@
fdjt/fdjt.js.gz dist/fdjt.js.gz: fdjt/fdjt.js
	gzip -c fdjt/fdjt.js > $@
dist/fdjt.js: fdjt/fdjt.js
	cp $< $@
dist/fdjt.css: fdjt/fdjt.css
	cp $< $@

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

TAGS: ${FDJT_FILES} fdjt/codexlayout.js ${KNODULES_FILES} ${SSC_FILES} \
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
	git checkout ${BRANCH}; cd fdjt; git checkout ${BRANCH}; cd ../metabook; git checkout ${BRANCH}; cd ../knodules; git checkout ${BRANCH}

diff:
	git diff;
	cd fdjt; git diff
	cd knodules; git diff
	cd metabook; git diff
	cd showsomeclass; git diff
	cd g; svn diff
status:
	git status -uno
	cd fdjt; git status -uno
	cd knodules; git status -uno
	cd metabook; git status -uno
	cd showsomeclass; git status -uno
	cd g; svn status -q
pull: fdjt knodules g showsomeclass bibliotype
	git pull
	cd fdjt; git pull
	cd knodules; git pull
	cd metabook; git pull
	cd showsomeclass; git pull
	if test -d bibliotype; then cd bibliotype; git pull; fi;
	if test -d pagedown; then cd pagedown; hg update; fi;
	cd webfontloader; git pull
	cd g; svn update
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
	cd metabook; git push
convert:
	cd codex/graphics; ./convertall
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
	./distribute
release: publish

publish-bundle:
	bash ./publish-bundle.bash

fdiff:
	cd fdjt; git diff
kdiff:
	cd knodules; git diff
mdiff:	
	cd metabook; git diff
