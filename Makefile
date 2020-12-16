dev.firefox:
	cd thegreenweb
	npx web-ext run --verbose

build.css:
	NODE_ENV=production npx postcss -c postcss.config.js ./thegreenweb/tailwind.css   -o ./thegreenweb/style.css

dev.css:
	npx postcss -c postcss.config.js ./thegreenweb/tailwind.css   -o ./thegreenweb/style.css

watch.css:
	npx postcss -c postcss.config.js ./thegreenweb/tailwind.css  -o ./thegreenweb/style.css --watch
