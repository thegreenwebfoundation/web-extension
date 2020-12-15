dev.firefox:
	cd thegreenweb
	npx web-ext run --verbose

build.css:
	NODE_ENV=production npx tailwindcss build ./thegreenweb/tailwind.css -o ./thegreenweb/tailwind.dist.css


dev.css:
	npx tailwindcss build ./thegreenweb/tailwind.css -o ./thegreenweb/tailwind.dist.css
	
watch.css:
	npx postcss -c postcss.config.js ./thegreenweb/tailwind.css   -o ./thegreenweb/style.css --watch
