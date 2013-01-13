 for r in `cat ./.s3root`; do
    echo "Copying to " $r;
    for x in fdjt/fdjt.js fdjt/fdjt.css; \
	do s3cmd copy s3:static.beingmeta.com:${x} ${r}${x}; done
    for x in g/beingmeta/*.png g/beingmeta/*.ico g/beingmeta/*.svgz; \
	do s3cmd copy s3:static.beingmeta.com:${x} ${r}${x}; done
    for x in g/sbooks/*.png g/beingmeta/*.ico g/sbooks/*.svgz; \
	do s3cmd copy s3:static.beingmeta.com:${x} ${r}${x}; done
    for x in g/codex/*.png g/beingmeta/*.ico g/codex/*.svgz; \
	do s3cmd copy s3:static.beingmeta.com:${x} ${r}${x}; done
    for x in sbooks/*.js g/sbooks/*.css; \
	do s3cmd copy s3:static.beingmeta.com:${x} ${r}${x}; done
    s3cmd copy s3:static.beingmeta.com:codexapp.css ${r}codexapp.css;
    s3cmd copy s3:static.beingmeta.com:codexapp.js ${r}codexapp.js;
done;
