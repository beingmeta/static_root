for r in `cat ./.s3root`; do
    echo "Copying to " $r;
    s3cmd put --encoding=utf-8 --mime-type=text/javascript \
		sbooks/bundle.js ${r}sbooks/debug.js;
	   s3cmd put --encoding=utf-8 --mime-type=text/css \
		sbooks/bundle.css ${r}sbooks/debug.css;
	   s3cmd put --encoding=utf-8 --mime-type=text/javascript \
		sbooks/bundle.min.js ${r}sbooks/bundle.min.js;
	   s3cmd put --encoding=utf-8 --mime-type=text/javascript \
		     --add-header "Content-Encoding: gzip" \
		sbooks/bundle.min.js.gz ${r}sbooks/bundle.min.js.gz;
	   s3cmd put --encoding=utf-8 --mime-type=text/css \
		     --add-header "Content-Encoding: gzip" \
		sbooks/bundle.css.gz ${r}sbooks/bundle.css.gz;
	   s3cmd put --encoding=utf-8 --mime-type=text/javascript \
		     --add-header "Content-Encoding: gzip" \
		sbooks/bundle.min.js.gz ${r}sbooks/bundle.js;
	   s3cmd put --encoding=utf-8 --mime-type=text/css \
		     --add-header "Content-Encoding: gzip" \
		sbooks/bundle.css.gz ${r}sbooks/bundle.css;
done;
