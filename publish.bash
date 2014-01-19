export AWS_DEFAULT_REGION=us-east-1
COPYJSGZ="aws s3 cp --content-type=text/javascript;charset=utf8 --content-encoding=gzip --acl=public-read"
COPYCSSGZ="aws s3 cp --content-type=text/css;charset=utf8 --content-encoding=gzip --acl=public-read"
COPY="aws s3 cp --recursive --acl=public-read"
SYNC="aws s3 sync --acl=public-read"

for r in `cat ./.s3root`; do \
 echo "Copying to" ${r}; \
 aws s3 cp index.html ${r}index.html; \
 $COPYJSGZ sbooks/codex.min.js.gz ${r}sbooks/bundle.js; \
 $COPYCSSGZ sbooks/codex.css.gz ${r}sbooks/bundle.css; \
 $COPYJSGZ sbooks/codex.min.js.gz ${r}codexapp.js; \
 $COPYCSSGZ sbooks/codex.css.gz ${r}codexapp.css; \
 for d in fdjt knodules codex; \
   do $SYNC --exclude="*" --include="*.js" \
            "--content-type=text/javascript; charset=utf-8" \
            ${d} ${r}${d};
      $SYNC --exclude="*" --include="*.css" \
            "--content-type=text/css; charset=utf-8" \
	    ${d} ${r}${d};
   done;
 for g in g/codex g/sbooks g/beingmeta; \
   do $SYNC --exclude="*" \
         --include="*.png" --include="*.gif" --include="*.jpg" \
         ${g} ${r}${g};
      $SYNC --exclude="*" --include="*.svgz" --content-encoding=gzip \
	    ${g} ${r}${g};
  done;
done;
