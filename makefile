# This generates various compound files automatically

# We define this because some versions of make (like on OSX) seem to
# have a built in version of echo which doesn't handle the -n argument
ECHO=/bin/echo
CLEAN=/bin/rm -f
FDJT_FILES=fdjt/header.js fdjt/log.js fdjt/string.js fdjt/time.js fdjt/dom.js \
	fdjt/kb.js fdjt/state.js fdjt/ajax.js fdjt/json.js \
	fdjt/hash.js fdjt/wsn.js \
	fdjt/ui.js fdjt/taphold.js fdjt/completions.js fdjt/syze.js

FDJT_CSS=fdjt/fdjt.css
KNODULES_FILES=knodules/knodules.js knodules/query.js \
	knodules/html.js knodules/clouds.js 
KNODULES_CSS=knodules/knodules.css
CODEX_FILES=codex/core.js codex/startup.js codex/domscan.js \
	codex/hud.js codex/interaction.js                     \
	codex/toc.js codex/slices.js codex/social.js          \
	codex/search.js codex/glosses.js                      \
	codex/layout.js codex/iscroll.js                  \
	codex/autoload.js
CODEX_DERIVED_FILES=codex/searchbox.js codex/addgloss.js   \
	            codex/hudtext.js codex/flyleaftext.js  \
	            codex/helptext.js codex/console.js     \
		    codex/settingstext.js codex/messages.js

CODEX_HTML_FILES=codex/hudtext.html codex/flyleaf.html \
	    codex/help.html codex/console.html \
	    codex/searchbox.html codex/addgloss.html codex/settings.html
CODEX_CSS=codex/codextoc.css codex/codexslices.css codex/codexcard.css
	codex/codexhelp.css codex/webreader.css
SBOOKS_FILES=sbooks/bookstyles.css sbooks/app.css sbooks/app.js \
	sbooks/amalgam.js
LOGIN_CSS=sbooks/login.css

SBOOKS_BUNDLE=${FDJT_FILES} ${KNODULES_FILES} fdjt/codex.js \
	${CODEX_FILES} ${CODEX_DERIVED_FILES}
SBOOKS_CSS=${FDJT_CSS} fdjt/codex.css ${LOGIN_CSS} ${KNODULES_CSS} ${CODEX_CSS}

ALLFILES=$(FDJT_FILES) $(KNODULES_FILES) $(CODEX_FILES)

all: allcode alltags index.html
allcode: fdjt knodules codex \
	fdjt/fdjt.js knotes/ok.js \
	sbooks/bundle.js sbooks/bundle.css sbooks/bundle.css.gz \
	sbooks/bundle.js sbooks/bundle.js.gz \
	sbooks/bundle.min.js sbooks/bundle.min.js.gz

# GIT rules
fdjt:
	git clone git@github.com:beingmeta/fdjt.git
knodules:
	git clone git@github.com:beingmeta/knodules_js.git knodules
codex:
	git clone git@github.com:beingmeta/codex.git

buildstamp.js: $(ALLFILES)
	$(ECHO) "var sbooks_buildhost='"`hostname`"';" > buildstamp.js
	$(ECHO) "var sbooks_buildtime='"`date`"';" >> buildstamp.js 

clean:
	cd fdjt; make clean;
	cd codex; \
	rm -f codex/hudtext.js codex/flyleaftext.js codex/helptext.js \
	      codex/loginform.js codex/console.js \
	      codex/addgloss.js codex/searchbox.js
	rm -f TAGS XTAGS SBOOKTAGS APPTAGS FDTAGS KNOTAGS
	rm -f sbooks/bundle.js sbooks/bundle.css

fdjt/fdjt.js: $(FDJT_FILES)
	cd fdjt; make all
fdjt/buildstamp.js: $(FDJT_FILES)
	cd fdjt; make all

sbooks/buildstamp.js: $(SBOOKS_BUNDLE) fdjt/buildstamp.js
	cat fdjt/buildstamp.js > sbooks/buildstamp.js
	$(ECHO) "var sbooks_buildhost='"`hostname`"';" >> sbooks/buildstamp.js
	$(ECHO) "var sbooks_buildtime='"`date`"';" >> sbooks/buildstamp.js 
sbooks/bundle.js: sbooks/buildstamp.js $(SBOOKS_BUNDLE)
	cd codex; echo "Codex.version='"`git describe`"';" > buildstamp.js
	cd knodules; echo "Knodule.version='"`git describe`"';" > buildstamp.js
	cat sbooks/amalgam.js sbooks/buildstamp.js $(SBOOKS_BUNDLE) \
			codex/buildstamp.js knodules/buildstamp.js > $@
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

index.html: index_head.html index_foot.html sbooks/bundle.js sbooks/bundle.css
	cat index_head.html > index.html
	echo "<p>Build host: " `hostname` "</p>" >> index.html
	echo "<p>Build date: " `date` "</p>" >> index.html
	cd fdjt; echo "<p>FDJT version: " `git describe` "</p>" >> ../index.html
	cd codex; echo "<p>Codex version: " `git describe` "</p>" >> ../index.html
	cat index_foot.html >> index.html

# Generating javascript strings from HTML

codex/hudtext.js: codex/hudtext.html makefile
	$(ECHO) -n "var sbook_hudtext=\"" > codex/hudtext.js
	sed s/$$/\ \\\\/ codex/hudtext.html | \
          sed s/\\\"/\\\\\"/g >> codex/hudtext.js
	$(ECHO) "\";" >> codex/hudtext.js
	$(ECHO) "" >> codex/hudtext.js

codex/helptext.js: codex/helptext.html makefile
	$(ECHO) -n "var sbook_helptext=\"" > codex/helptext.js
	sed s/$$/\ \\\\/ codex/helptext.html | \
          sed s/\\\"/\\\\\"/g >> codex/helptext.js
	$(ECHO) "\";" >> codex/helptext.js
	$(ECHO) "" >> codex/helptext.js

codex/flyleaftext.js: codex/flyleaf.html makefile
	$(ECHO) -n "var sbook_flyleaftext=\"" > codex/flyleaftext.js
	sed s/$$/\ \\\\/ codex/flyleaf.html | \
          sed s/\\\"/\\\\\"/g >> codex/flyleaftext.js
	$(ECHO) "\";" >> codex/flyleaftext.js
	$(ECHO) "" >> codex/flyleaftext.js

codex/settingstext.js: codex/settings.html makefile
	$(ECHO) -n "var sbook_settingstext=\"" > codex/settingstext.js
	sed s/$$/\ \\\\/ codex/settings.html | \
          sed s/\\\"/\\\\\"/g >> codex/settingstext.js
	$(ECHO) "\";" >> codex/settingstext.js
	$(ECHO) "" >> codex/settingstext.js

codex/messages.js: codex/messages.html makefile
	$(ECHO) -n "var sbook_messagestext=\"" > codex/messages.js
	sed s/$$/\ \\\\/ codex/messages.html | \
          sed s/\\\"/\\\\\"/g >> codex/messages.js
	$(ECHO) "\";" >> codex/messages.js
	$(ECHO) "" >> codex/messages.js

codex/console.js:  codex/console.html makefile
	$(ECHO) -n "var sbook_console=\"" > codex/console.js
	sed s/$$/\ \\\\/ codex/console.html | \
          sed s/\\\"/\\\\\"/g >> codex/console.js
	$(ECHO) "\";" >> codex/console.js
	$(ECHO) "" >> codex/console.js

codex/addgloss.js:  codex/addgloss.html makefile
	$(ECHO) -n "var sbook_addgloss=\"" > codex/addgloss.js
	sed s/$$/\ \\\\/ codex/addgloss.html | \
          sed s/\\\"/\\\\\"/g >> codex/addgloss.js
	$(ECHO) "\";" >> codex/addgloss.js
	$(ECHO) "" >> codex/addgloss.js

codex/searchbox.js:  codex/searchbox.html makefile
	$(ECHO) -n "var sbook_searchbox=\"" > codex/searchbox.js
	sed s/$$/\ \\\\/ codex/searchbox.html | \
          sed s/\\\"/\\\\\"/g >> codex/searchbox.js
	$(ECHO) "\";" >> codex/searchbox.js
	$(ECHO) "" >> codex/searchbox.js

knotes/knotepad.js: knotes/knotepad.html makefile
	$(ECHO) -n "OK.knotepad=\"" > knotes/knotepad.js
	sed s/$$/\ \\\\/ knotes/knotepad.html | \
          sed s/\\\"/\\\\\"/g >> knotes/knotepad.js
	$(ECHO) "\";" >> knotes/knotepad.js
	$(ECHO) "" >> knotes/knotepad.js

knotes/ok.js: knotes/knote.js knotes/knotepad.js ${FDJT_FILES}
	cat ${FDJT_FILES} knotes/knote.js knotes/knotepad.js > knotes/ok.js

alltags: fdjt knodules codex TAGS APPTAGS fdjt/TAGS

TAGS: ${FDJT_FILES} ${KNODULES_FILES} \
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
update: fdjt codex knodules
	git pull
	cd fdjt; git pull
	cd knodules; git pull
	cd codex; git pull
push: fdjt codex knodules
	git push
	cd fdjt; git push
	cd knodules; git push
	cd codex; git push
publish:
	make update
	s3commit
	make publish-bundle

publish-bundle:
	s3cmd put --encoding=utf-8 -M sbooks/bundle.* s3://static.beingmeta.com/
	s3cmd put --encoding=utf-8 -M sbooks/bundle.* s3://beingmeta/static/

fdiff:
	cd fdjt; git diff
kdiff:
	cd knodules; git diff
cdiff:	
	cd codex; git diff
