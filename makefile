# This generates various compound files automatically

# We define this because some versions of make (like on OSX) seem to
# have a built-in version of echo which doesn't handle the -n argument
ECHO=/bin/echo
CLEAN=/bin/rm -f
FDJT_FILES=fdjt/header.js fdjt/string.js fdjt/time.js \
	fdjt/log.js fdjt/init.js fdjt/state.js fdjt/dom.js \
	fdjt/kb.js fdjt/state.js \
	fdjt/json.js fdjt/hash.js fdjt/wsn.js \
	fdjt/ui.js fdjt/taphold.js fdjt/selecting.js \
	fdjt/scrollever.js fdjt/adjustfont.js \
	fdjt/completions.js fdjt/syze.js fdjt/iscroll.js \
	fdjt/ajax.js fdjt/globals.js
BUILDUUID:=`uuidgen`
BUILDTIME:=`date`
BUILDHOST:=`hostname`

FDJT_CSS=fdjt/fdjt.css
KNODULES_FILES=knodules/knodules.js knodules/query.js \
	knodules/html.js # knodules/clouds.js 
KNODULES_CSS=knodules/knodules.css
CODEX_FILES=codex/core.js codex/startup.js codex/domscan.js \
	codex/hud.js codex/interaction.js                   \
	codex/toc.js codex/slices.js codex/social.js        \
	codex/search.js codex/glosses.js                    \
	codex/layout.js codex/autoload.js
CODEX_DERIVED_FILES=codex/text/searchbox.js codex/text/addgloss.js   \
	            codex/text/hud.js codex/text/hudheart.js  \
	            codex/text/help.js codex/text/hudhelp.js     \
		    codex/text/console.js codex/text/messages.js     \
		    codex/text/settings.js codex/text/splash.js

CODEX_HTML_FILES=codex/text/hud.html codex/text/hudheart.html \
	codex/text/help.html codex/text/hudhelp.html \
	codex/text/console.html codex/text/searchbox.html \
	codex/text/addgloss.html codex/text/settings.html \
	codex/text/splash.html
CODEX_CSS=codex/css/toc.css codex/css/slices.css \
	codex/css/card.css codex/css/search.css  \
	codex/css/addgloss.css codex/css/help.css    \
	codex/css/flyleaf.css codex/css/hud.css  \
	codex/css/foot.css codex/css/preview.css \
	codex/css/app.css codex/css/media.css
SBOOKS_FILES=sbooks/bookstyles.css sbooks/app.css sbooks/app.js \
	sbooks/amalgam.js
LOGIN_CSS=sbooks/login.css

SBOOKS_BUNDLE=${FDJT_FILES} ${KNODULES_FILES} fdjt/codexlayout.js \
	${CODEX_FILES} ${CODEX_DERIVED_FILES}
SBOOKS_CSS=${FDJT_CSS} fdjt/codexlayout.css \
	${LOGIN_CSS} ${KNODULES_CSS} ${CODEX_CSS}

ALLFILES=$(FDJT_FILES) $(KNODULES_FILES) $(CODEX_FILES)

codex/text/%.js: codex/text/%.html makefile
	./text2js Codex.HTML.`basename $@ .js` $< $@

all: allcode alltags index.html
allcode: fdjt knodules codex \
	fdjt/fdjt.js knotes/ok.js \
	sbooks/bundle.js sbooks/bundle.css \
	sbooks/bundle.js.gz sbooks/bundle.css.gz \
	sbooks/bundle.min.js.gz

# GIT rules
fdjt:
	git clone git@github.com:beingmeta/fdjt.git
knodules:
	git clone git@github.com:beingmeta/knodules_js.git knodules
codex:
	git clone git@github.com:beingmeta/codex.git
g:
	svn checkout https://dev.beingmeta.com/src/graphics/targets g

clean:
	cd fdjt; make clean;
	cd codex; \
		rm -f ${CODEX_DERIVED_FILES}
		rm -f TAGS XTAGS SBOOKTAGS APPTAGS FDTAGS KNOTAGS
		rm -f sbooks/bundle.js sbooks/bundle.css

fdjt/fdjt.js: $(FDJT_FILES)
	cd fdjt; make all
fdjt/buildstamp.js: $(FDJT_FILES)
	cd fdjt; make all

sbooks/buildstamp.js: $(SBOOKS_BUNDLE)
	@$(ECHO) "// sBooks build information" > sbooks/buildstamp.js
	@$(ECHO) "Codex.buildhost='${BUILDHOST}';" >> sbooks/buildstamp.js
	@$(ECHO) "Codex.buildtime='${BUILDTIME}';" >> sbooks/buildstamp.js
	@$(ECHO) "Codex.buildid='${BUILDUUID}';" >> sbooks/buildstamp.js
	@$(ECHO) >> sbooks/buildstamp.js
	@echo "Created buildstamp.js"
codex/buildstamp.js:
	cd codex; echo "Codex.version='"`git describe`"';" > buildstamp.js
knodules/buildstamp.js:
	cd knodules; echo "Knodule.version='"`git describe`"';" > buildstamp.js

sbooks/tieoff.js:
	touch sbooks/tieoff.js
sbooks/bundle.js: sbooks/buildstamp.js $(SBOOKS_BUNDLE) \
	codex/buildstamp.js knodules/buildstamp.js sbooks/tieoff.js
	cat sbooks/amalgam.js fdjt/buildstamp.js \
		$(SBOOKS_BUNDLE) sbooks/tieoff.js \
		codex/buildstamp.js knodules/buildstamp.js sbooks/buildstamp.js > $@
sbooks/bundle.css: $(SBOOKS_CSS)
	cat $(SBOOKS_CSS) > $@
sbooks/bundle.min.js: sbooks/bundle.js jsmin/jsmin
	jsmin/jsmin < sbooks/bundle.js > sbooks/bundle.min.js
sbooks/bundle.min.js.gz: sbooks/bundle.min.js
	gzip sbooks/bundle.min.js -c > sbooks/bundle.min.js.gz
sbooks/bundle.js.gz: sbooks/bundle.js
	gzip -c sbooks/bundle.js > $@
sbooks/bundle.css.gz: sbooks/bundle.css
	gzip -c sbooks/bundle.css > $@

# Generating the HTML

index.html: etc/index_head.html etc/index_foot.html \
	sbooks/bundle.js sbooks/bundle.css
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

diff:
	git diff;
	cd fdjt; git diff
	cd knodules; git diff
	cd codex; git diff
	cd g; svn diff
status:
	git status -uno
	cd fdjt; git status -uno
	cd knodules; git status -uno
	cd codex; git status -uno
	cd g; svn status -q
update: fdjt codex knodules g
	git pull
	cd fdjt; git pull
	cd knodules; git pull
	cd codex; git pull
	cd g; svn update
	make update-graphics
update-code: fdjt codex knodules
	git pull
	cd fdjt; git pull
	cd knodules; git pull
	cd codex; git pull
update-graphics:
	cd g/codex; rm -f *.square *.sqr *.bnr *.rect; \
		make GRAPHICS=/src/graphics
	cd g/sbooks; rm -f *.square *.sqr *.bnr *.rect; \
		make GRAPHICS=/src/graphics
	cd g/beingmeta; rm -f *.square *.sqr *.bnr *.rect; \
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
	cd g; s3commit --exclude="*.(png|gif)" --add-header=Content-encoding:gzip
	cd fdjt; s3commit
	cd knodules; s3commit
	cd sbooks; s3commit
#	cd codex/svg; s3commit
#	cd codex/img; s3commit
#	cd codex/logos; s3commit
#	cd codex/screenshots; s3commit
#	make publish-bundle

publish-bundle:
	bash ./publish-bundle.bash

fdiff:
	cd fdjt; git diff
kdiff:
	cd knodules; git diff
cdiff:	
	cd codex; git diff
