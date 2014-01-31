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
	fdjt/ui.js fdjt/dialog.js fdjt/completions.js \
	fdjt/taphold.js fdjt/selecting.js \
	fdjt/adjustfont.js fdjt/scrollever.js \
	fdjt/globals.js
BUILDUUID:=`uuidgen`
BUILDTIME:=`date`
BUILDHOST:=`hostname`
BRANCH=master

FDJT_CSS=fdjt/fdjt.css fdjt/normalize.css
KNODULES_FILES=knodules/knodules.js knodules/tags.js knodules/html.js # knodules/clouds.js 
KNODULES_HINTS=knodules/knodules.hint knodules/tags.hint knodules/html.hint # knodules/clouds.js 
KNODULES_CSS=knodules/knodules.css
PAGEDOWN_FILES=pagedown/Markdown.Converter.js
SSC_FILES=showsomeclass/ssc.js showsomeclass/dialog.js showsomeclass/edit.js
SSC_CSS=showsomeclass/ssc.css showsomeclass/dialog.css showsomeclass/edit.css
SSC_HTML=showsomeclass/bigtextedit.html showsomeclass/savedialog.html \
	showsomeclass/editcontent.html showsomeclass/sscabout.html \
	showsomeclass/editelement.html showsomeclass/sschelp.html \
	showsomeclass/edithelp.html showsomeclass/ssctoolbar.html \
	showsomeclass/editselection.html showsomeclass/textedit.html \
	showsomeclass/reclass.html showsomeclass/toolbar.html
SSC_BUNDLE=${SSC_FILES} ${SSC_CSS} ${SSC_HTML}
CODEX_FILES=codex/core.js codex/startup.js codex/domscan.js \
	codex/hud.js codex/toc.js codex/slices.js codex/clouds.js \
	codex/social.js codex/search.js codex/glosses.js \
	 codex/interaction.js codex/layout.js codex/autoload.js
CODEX_HINTS=codex/core.hint codex/startup.hint codex/domscan.hint \
	codex/hud.hint codex/toc.hint codex/slices.hint codex/clouds.hint \
	codex/social.hint codex/search.hint codex/glosses.hint \
	 codex/interaction.hint codex/layout.hint
CODEX_DERIVED_FILES=codex/text/searchbox.js codex/text/addgloss.js   \
	            codex/text/hud.js codex/text/heart.js  \
	            codex/text/help.js codex/text/hudhelp.js     \
		    codex/text/console.js codex/text/messages.js     \
		    codex/text/cover.js codex/text/settings.js \
		    codex/text/pageleft.js codex/text/pageright.js

CODEX_HTML_FILES=codex/text/searchbox.html codex/text/addgloss.html \
	codex/text/hud.html codex/text/heart.html \
	codex/text/help.html codex/text/hudhelp.html \
	codex/text/console.html codex/text/messages.html \
	codex/text/cover.html codex/text/settings.html \
	codex/text/pageleft.html codex/text/pageright.html 

CODEX_CSS=codex/css/framing.css codex/css/cover.css codex/css/hud.css   \
	codex/css/foot.css codex/css/body.css codex/css/help.css        \
	codex/css/toc.css codex/css/slices.css codex/css/clouds.css     \
	codex/css/card.css codex/css/search.css codex/css/addgloss.css  \
	codex/css/flyleaf.css codex/css/preview.css                     \
	codex/css/app.css codex/css/media.css
# removed sbooks/reset.css
SBOOKS_FILES=sbooks/sbooks.css \
	sbooks/app.css sbooks/app.js \
	sbooks/amalgam.js
LOGIN_CSS=sbooks/login.css

CODEX_JS_BUNDLE=${FDJT_FILES} ${KNODULES_FILES} fdjt/indexed.js fdjt/codexlayout.js \
	${PAGEDOWN_FILES} ${CODEX_FILES} ${CODEX_DERIVED_FILES}
# removed sbooks/reset.css 
CODEX_CSS_BUNDLE=${FDJT_CSS} fdjt/codexlayout.css \
	${LOGIN_CSS} ${KNODULES_CSS} ${CODEX_CSS}

ALLFILES=$(FDJT_FILES) $(KNODULES_FILES) $(CODEX_FILES)

SBOOKSTYLES=sbooks/sbookstyles.css

knodules/%.hint: knodules/%.js
	@JSHINT=`which jshint`; if test "x$${JSHINT}" = "x"; then touch $@; else $${JSHINT} --config knodules/.jshintrc $< | tee $@; fi
codex/%.hint: codex/%.js
	@JSHINT=`which jshint`; if test "x$${JSHINT}" = "x"; then touch $@; else $${JSHINT} --config codex/.jshintrc $< | tee $@; fi

codex/text/%.js: codex/text/%.html makefile
	./text2js Codex.HTML.`basename $@ .js` $< $@

all: allcode alltags allhints index.html
allcode: fdjt knodules codex \
	fdjt/fdjt.js showsomeclass/app.js showsomeclass/app.css \
	sbooks/codex.js sbooks/codex.css \
	sbooks/codex.js.gz sbooks/codex.css.gz \
	sbooks/codex.min.js.gz \
	sbooks/sbookstyles.css

allhints: fdjt/fdjt.hints codex/codex.hints knodules/knodules.hints \
	showsomeclass/hints

cleanhints:
	rm -f fdjt/*.hint fdjt/fdjt.hints codex/*.hint codex/codex.hints
	rm -f knodules/*.hint knodules/knodules.hints
	rm -f sbooks/*.hint sbooks/sbooks.hints
	rm -f showsomeclass/*.hint showsomeclass/sbooks.hints

hints:
	make cleanhints
	make allhints

sbookstyles: ${SBOOKSTYLES}
# Removed sbooks/reset.css
sbooks/sbookstyles.css: sbooks/normalize.css sbooks/bookstyles.css
	cat $^ > $@

fdjt/fdjt.hints: $(FDJT_FILES) fdjt/codexlayout.js
	cd fdjt; make fdjt.hints
codex/codex.hints: $(CODEX_HINTS)
	cat $^ > $@
knodules/knodules.hints: $(KNODULES_HINTS) knodules/.jshintrc
	cat $^ > $@
showsomeclass/hints:
	cd showsomeclass; make hints

showsomeclass/app.js: $(SSC_FILES) $(SSC_HTML) showsomeclass/makefile
	cd showsomeclass; make
showsomeclass/app.css: showsomeclass/ssc.css showsomeclass/dialog.css \
	showsomeclass/edit.css showsomeclass/makefile
	cd showsomeclass; make

# GIT rules
fdjt:
	git clone git@github.com:beingmeta/fdjt.git
knodules:
	git clone git@github.com:beingmeta/knodules_js.git knodules
codex:
	git clone git@github.com:beingmeta/codex.git
showsomeclass:
	git clone git@github.com:beingmeta/showsomeclass.git
g:
	svn checkout svn+ssh://dev.beingmeta.com/svn/src/graphics/targets g
pagedown:
	hg clone https://code.google.com/p/pagedown/
bibliotype:
	git clone https://github.com/cmod/bibliotype.git
ext:
	cd ext; make 

clean:
	cd fdjt; make clean
	cd showsomeclass; make clean
	make cleanhints
	rm -f ${CODEX_DERIVED_FILES}
	rm -f TAGS XTAGS SBOOKTAGS APPTAGS FDTAGS KNOTAGS
	rm -f sbooks/codex.js sbooks/codex.css

fdjt/fdjt.js: $(FDJT_FILES)
	cd fdjt; make all
fdjt/buildstamp.js: $(FDJT_FILES) $(FDJT_CSS)
	cd fdjt; make all

sbooks/buildstamp.js: $(CODEX_JS_BUNDLE) $(CODEX_CSS_BUNDLE)
	@$(ECHO) "// sBooks build information" > sbooks/buildstamp.js
	@$(ECHO) "Codex.buildhost='${BUILDHOST}';" >> sbooks/buildstamp.js
	@$(ECHO) "Codex.buildtime='${BUILDTIME}';" >> sbooks/buildstamp.js
	@$(ECHO) "Codex.buildid='${BUILDUUID}';" >> sbooks/buildstamp.js
	@$(ECHO) >> sbooks/buildstamp.js
	@echo "Created buildstamp.js"
codex/buildstamp.js: $(CODEX_FILES) $(CODEX_CSS_BUNDLE) $(CODEX_HTML)
	cd codex; echo "Codex.version='"`git describe`"';" > buildstamp.js
knodules/buildstamp.js: $(KNODULES_FILES) $(KNODULES_CSS)
	cd knodules; echo "Knodule.version='"`git describe`"';" > buildstamp.js

sbooks/tieoff.js:
	touch sbooks/tieoff.js
sbooks/codex.js: fdjt/fdjt.js sbooks/buildstamp.js $(CODEX_JS_BUNDLE) \
	codex/buildstamp.js knodules/buildstamp.js sbooks/tieoff.js
	cat sbooks/amalgam.js fdjt/buildstamp.js \
		$(CODEX_JS_BUNDLE) sbooks/tieoff.js \
		codex/buildstamp.js knodules/buildstamp.js sbooks/buildstamp.js > $@
sbooks/codex.css: $(CODEX_CSS_BUNDLE)
	cat $(CODEX_CSS_BUNDLE) > $@
sbooks/codex.min.js: sbooks/codex.js jsmin/jsmin
	jsmin/jsmin < sbooks/codex.js > sbooks/codex.min.js
sbooks/codex.min.js.gz: sbooks/codex.min.js
	gzip sbooks/codex.min.js -c > sbooks/codex.min.js.gz
sbooks/codex.js.gz: sbooks/codex.js
	gzip -c sbooks/codex.js > $@
sbooks/codex.css.gz: sbooks/codex.css
	gzip -c sbooks/codex.css > $@

# Generating the HTML

index.html: etc/index_head.html etc/index_foot.html \
	sbooks/codex.js sbooks/codex.css
	cat etc/index_head.html > index.html
	echo "<p>Build host: " `hostname` "</p>" >> index.html
	echo "<p>Build date: " `date` "</p>" >> index.html
	cd fdjt; echo "<p>FDJT version: " `git describe` "</p>" >> ../index.html
	cd codex; echo "<p>Codex version: " `git describe` "</p>" >> ../index.html
	cat etc/index_foot.html >> index.html

# Generating javascript strings from HTML

alltags: fdjt knodules codex TAGS APPTAGS CODEXTAGS fdjt/TAGS HTMLTAGS CSSTAGS SSCTAGS

TAGS: ${FDJT_FILES} fdjt/codexlayout.js ${KNODULES_FILES} ${SSC_FILES} \
	${CODEX_FILES} ${CODEX_CSS_BUNDLE} ${CODEX_HTML_FILES}
	etags -o $@ $^
CODEXTAGS: ${CODEX_FILES} ${CODEX_CSS_BUNDLE} ${CODEX_HTML_FILES}
	etags -o $@ $^
APPTAGS: ${CODEX_FILES} ${CODEX_CSS_BUNDLE} ${KNODULES_FILES} \
	${CODEX_HTML_FILES} ${SBOOKS_FILES}
	etags -o $@ $^
HTMLTAGS: ${CODEX_HTML_FILES}
	etags -o $@ $^
CSSTAGS: ${CODEX_CSS_BUNDLE}
	etags -o $@ $^
SSCTAGS: ${SSC_BUNDLE}
	etags -o $@ $^
fdjt/TAGS: 
	cd fdjt; make TAGS

jsmin/jsmin: jsmin/jsmin.c
	${CC} -o jsmin/jsmin jsmin/jsmin.c

checkout:
	git checkout ${BRANCH}; cd fdjt; git checkout ${BRANCH}; cd ../codex; git checkout ${BRANCH}; cd ../knodules; git checkout ${BRANCH}

diff:
	git diff;
	cd fdjt; git diff
	cd knodules; git diff
	cd codex; git diff
	cd showsomeclass; git diff
	cd g; svn diff
status:
	git status -uno
	cd fdjt; git status -uno
	cd knodules; git status -uno
	cd codex; git status -uno
	cd showsomeclass; git status -uno
	cd g; svn status -q
update: fdjt codex knodules g pagedown showsomeclass bibliotype
	git pull
	cd fdjt; git pull
	cd knodules; git pull
	cd codex; git pull
	cd showsomeclass; git pull
	cd bibliotype; git pull
	cd pagedown; hg update
	cd g; svn update
	make update-graphics
update-code: fdjt codex knodules
	git pull
	cd fdjt; git pull
	cd knodules; git pull
	cd showsomeclass; git pull
	cd codex; git pull
update-graphics:
	cd g/codex; rm -f *.square *.sqr *.bnr *.rect; \
		make GRAPHICS=/src/graphics
	cd g/sbooks; rm -f *.square *.sqr *.bnr *.rect; \
		make GRAPHICS=/src/graphics
	cd g/beingmeta; rm -f *.square *.sqr *.bnr *.rect; \
		make GRAPHICS=/src/graphics
	cd g/showsomeclass; rm -f *.square *.sqr *.bnr *.rect; \
		make GRAPHICS=/src/graphics

push: fdjt codex knodules
	git push
	cd fdjt; git push
	cd knodules; git push
	cd codex; git push
convert:
	cd codex/graphics; ./convertall


publish:
	make update
	make
	bash publish.bash
release: publish

publish-bundle:
	bash ./publish-bundle.bash

fdiff:
	cd fdjt; git diff
kdiff:
	cd knodules; git diff
cdiff:	
	cd codex; git diff
