 for r in `cat ./.s3root`; do
    echo "Copying to " $r;
    s3cmd put --encoding=utf-8 --mime-type=text/javascript \
	      --add-header "Content-Encoding: gzip"            \
	      sbooks/codex.min.js.gz ${r}sbooks/bundle.js;
    s3cmd put --encoding=utf-8 --mime-type=text/css        \
	      --add-header "Content-Encoding: gzip"            \
	      sbooks/codex.css.gz ${r}sbooks/bundle.css;
    s3cmd put --encoding=utf-8 --mime-type=text/javascript \
	      --add-header "Content-Encoding: gzip"            \
	      sbooks/codex.min.js.gz ${r}codexapp.js;
    s3cmd put --encoding=utf-8 --mime-type=text/css        \
	      --add-header "Content-Encoding: gzip"            \
	      sbooks/codex.css.gz ${r}codexapp.css;
done;
