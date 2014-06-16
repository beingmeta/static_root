export AWS_DEFAULT_REGION=us-east-1
COPYJSGZ="s3cmd put -m text/javascript;charset=utf8 --acl-public --add-header=Content-encoding:gzip"
COPYCSSGZ="s3cmd put -m text/css;charset=utf8 --acl-public --add-header=Content-encoding:gzip"
COPY="s3cmd put --recursive --acl-public"
SYNC="s3cmd sync --verbose --acl-public"

for r in `cat ./.s3root`; do \
 echo "Copying to" ${r}; \
 s3cmd put index.html ${r}index.html; \
 $COPYJSGZ sbooks/codex.min.js.gz ${r}sbooks/bundle.js; \
 $COPYCSSGZ sbooks/codex.css.gz ${r}sbooks/bundle.css; \
 $COPYJSGZ sbooks/codex.min.js.gz ${r}codexapp.js; \
 $COPYCSSGZ sbooks/codex.css.gz ${r}codexapp.css; \
 for d in fdjt knodules codex; \
   do $SYNC --exclude="*" --include="*.js" \
            -m "text/javascript;charset=utf-8" \
            ${d} ${r}${d}/;
      $SYNC --exclude="*" --include="*.css" \
            -m "text/css;charset=utf-8" \
	    ${d} ${r}${d}/;
   done;
 for g in g/codex g/sbooks g/beingmeta; \
   do $COPY ${g}/*.png ${g}/*.jpg ${r}${g}/;
      $COPY --add-header=Content-encoding:gzip \
	    ${g}/*.svgz ${r}${g}/;
  done;
done;
