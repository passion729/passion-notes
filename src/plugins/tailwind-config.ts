module.exports = function tailwindPlugin(context, options) {
    return {
        name: "tailwind-plugin",
        configurePostCss(postcssOptions: { plugins: any[]; }) {
            postcssOptions.plugins = [require("@tailwindcss/postcss")];
            return postcssOptions;
        },
    };
};