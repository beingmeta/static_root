# This automatically generates various compound files for beingmeta
# web applications

# We define this because some versions of make (like on OSX) seem to
# have a built-in version of echo which doesn't handle the -n argument
ECHO=/bin/echo
CLEAN=/bin/rm -f
FDJT_FILES=fdjt/header.js fdjt/string.js fdjt/time.js \
	fdjt/syze.js fdjt/iscroll.js fdjt/indexed.js \
	fdjt/log.js fdjt/init.js fdjt/state.js fdjt/dom.js \
	fdjt/json.js fdjt/refdb.js fdjt/ajax.js \
	fdjt/hash.js fdjt/wsn.js \
	fdjt/ui.js fdjt/completions.js fdjt/taphold.js fdjt/selecting.js \
	fdjt/adjustfont.js fdjt/scrollever.js \
	fdjt/globals.js
FDJT_HINTS=fdjt/string.hint fdjt/time.hint \
	fdjt/syze.hint fdjt/iscroll.hint fdjt/indexed.hint \
	fdjt/log.hint fdjt/init.hint fdjt/state.hint fdjt/dom.hint \
	fdjt/refdb.hint fdjt/json.hint fdjt/ajax.hint \
	fdjt/hash.hint fdjt/wsn.hint \
	fdjt/ui.hint fdjt/completions.hint fdjt/taphold.hint fdjt/selecting.hint \
	fdjt/adjustfont.hint fdjt/scrollever.hint
BUILDUUID:=`uuidgen`
BUILDTIME:=`date`
BUILDHOST:=`hostname`
BRANCH=master

FDJT_CSS=fdjt/fdjt.css
KNODULES_FILES=knodules/knodules.js knodules/tags.js knodules/html.js # knodules/clouds.js 
KNODULES_HINTS=knodules/knodules.hint knodules/tags.hint knodules/html.hint # knodules/clouds.js 
KNODULES_CSS=knodules/knodules.css
PAGEDOWN_FILES=pagedown/Markdown.Converter.js
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
		    codex/text/settings.js codex/text/splash.js \
		    codex/text/pageleft.js codex/text/pageright.js

CODEX_HTML_FILES=codex/text/hud.html codex/text/heart.html \
	codex/text/help.html codex/text/hudhelp.html \
	codex/text/console.html codex/text/searchbox.html \
	codex/text/addgloss.html codex/text/settings.html \
	codex/text/splash.html codex/text/pageleft.html \
	codex/text/pageright.html
CODEX_CSS=codex/css/toc.css codex/css/slices.css codex/css/clouds.css \
	codex/css/card.css codex/css/search.css  \
	codex/css/addgloss.css codex/css/help.css    \
	codex/css/flyleaf.css codex/css/hud.css  \
	codex/css/foot.css codex/css/preview.css \
	codex/css/app.css codex/css/media.css
SBOOKS_FILES=sbooks/bookstyles.css sbooks/app.css sbooks/app.js \
	sbooks/amalgam.js
LOGIN_CSS=sbooks/login.css

SBOOKS_BUNDLE=${FDJT_FILES} ${KNODULES_FILES} fdjt/codexlayout.js \
	${PAGEDOWN_FILES} ${CODEX_FILES} ${CODEX_DERIVED_FILES}
SBOOKS_CSS=${FDJT_CSS} fdjt/codexlayout.css \
	${LOGIN_CSS} ${KNODULES_CSS} ${CODEX_CSS}

ALLFILES=$(FDJT_FILES) $(KNODULES_FILES) $(CODEX_FILES)

knodules/%.hint: knodules/%.js
	@JSHINT=`which jshint`; if test "x$${JSHINT}" = "x"; then touch $@; else $${JSHINT} --config knodules/.jshintrc $< | tee $@; fi
codex/%.hint: codex/%.js
	@JSHINT=`which jshint`; if test "x$${JSHINT}" = "x"; then touch $@; else $${JSHINT} --config codex/.jshintrc $< | tee $@; fi
%.hint: %.js
	@JSHINT=`which jshint`; if test "x$${JSHINT}" = "x"; then touch $@; else $${JSHINT} $^ | tee $@; fi

codex/text/%.js: codex/text/%.html makefile
	./text2js Codex.HTML.`basename $@ .js` $< $@

all: allcode alltags allhints index.html
allcode: fdjt knodules codex \
	fdjt/fdjt.js \
	sbooks/codex.js sbooks/codex.css \
	sbooks/codex.js.gz sbooks/codex.css.gz \
	sbooks/codex.min.js.gz

allhints: fdjt/fdjt.hints codex/codex.hints knodules/knodules.hints

cleanhints:
	rm -f fdjt/*.hint fdjt/fdjt.hints codex/*.hint codex/codex.hints
	rm -f knodules/*.hint knodules/knodules.hints sbooks/*.hint sbooks/sbooks.hints

hints:
	make cleanhints
	make allhints


fdjt/fdjt.hints: $(FDJT_HINTS)
	cd fdjt; make fdjt.hints
codex/codex.hints: $(CODEX_HINTS)
	cat $^ > $@
knodules/knodules.hints: $(KNODULES_HINTS) knodules/.jshintrc
	cat $^ > $@

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
	svn checkout https://dev.beingmeta.com/src/graphics/targets g
pagedown:
	hg clone https://code.google.com/p/pagedown/
ext:
	cd ext; make 

clean:
	cd fdjt; make clean
	make cleanhints
	rm -f ${CODEX_DERIVED_FILES}
	rm -f TAGS XTAGS SBOOKTAGS APPTAGS FDTAGS KNOTAGS
	rm -f sbooks/codex.js sbooks/codex.css

fdjt/fdjt.js: $(FDJT_FILES)
	cd fdjt; make all
fdjt/buildstamp.js: $(FDJT_FILES) $(FDJT_CSS)
	cd fdjt; make all

sbooks/buildstamp.js: $(SBOOKS_BUNDLE) $(SBOOKS_CSS)
	@$(ECHO) "// sBooks build information" > sbooks/buildstamp.js
	@$(ECHO) "Codex.buildhost='${BUILDHOST}';" >> sbooks/buildstamp.js
	@$(ECHO) "Codex.buildtime='${BUILDTIME}';" >> sbooks/buildstamp.js
	@$(ECHO) "Codex.buildid='${BUILDUUID}';" >> sbooks/buildstamp.js
	@$(ECHO) >> sbooks/buildstamp.js
	@echo "Created buildstamp.js"
codex/buildstamp.js: $(CODEX_FILES) $(CODEX_CSS) $(CODEX_HTML)
	cd codex; echo "Codex.version='"`git describe`"';" > buildstamp.js
knodules/buildstamp.js: $(KNODULES_FILES) $(KNODULES_CSS)
	cd knodules; echo "Knodule.version='"`git describe`"';" > buildstamp.js

sbooks/tieoff.js:
	touch sbooks/tieoff.js
sbooks/codex.js: fdjt/fdjt.js sbooks/buildstamp.js $(SBOOKS_BUNDLE) \
	codex/buildstamp.js knodules/buildstamp.js sbooks/tieoff.js
	cat sbooks/amalgam.js fdjt/buildstamp.js \
		$(SBOOKS_BUNDLE) sbooks/tieoff.js \
		codex/buildstamp.js knodules/buildstamp.js sbooks/buildstamp.js > $@
sbooks/codex.css: $(SBOOKS_CSS)
	cat $(SBOOKS_CSS) > $@
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

alltags: fdjt knodules codex TAGS APPTAGS fdjt/TAGS

TAGS: ${FDJT_FILES} fdjt/codexlayout.js ${KNODULES_FILES} \
	${CODEX_FILES} ${CODEX_CSS} ${CODEX_HTML_FILES}
	etags -o $@ $^
APPTAGS: ${CODEX_FILES} ${CODEX_CSS} ${KNODULES_FILES} \
	${CODEX_HTML_FILES} ${SBOOKS_FILES}
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
update: fdjt codex knodules g pagedown showsomeclass
	git pull
	cd fdjt; git pull
	cd knodules; git pull
	cd codex; git pull
	cd showsomeclass; git pull
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
	s3commit
	cd g; s3commit --exclude="*.svgz"
	cd g; s3commit --exclude="*.(png|gif|jpg|jpeg)" --add-header=Content-encoding:gzip
	cd fdjt; make publish
	cd knodules; s3commit
	cd sbooks; s3commit
	make publish-bundle
release: publish

publish-bundle:
	bash ./publish-bundle.bash

fdiff:
	cd fdjt; git diff
kdiff:
	cd knodules; git diff
cdiff:	
	cd codex; git diff
