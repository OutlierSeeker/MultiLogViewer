const sveltePreprocess = require("svelte-preprocess");

module.exports = {
    preprocess: sveltePreprocess({
        scss: {
            // We can use a path relative to the root because
            // svelte-preprocess automatically adds it to `includePaths`
            // if none is defined.
            prependData: `@import 'src/styles/main.scss';`
        },
    }),
};
