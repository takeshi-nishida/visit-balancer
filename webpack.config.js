module.exports = {
    mode: "none",
    entry: "./dist/app.js",
    output: {
        path: __dirname + "/public/",
        filename: "app.js"
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
}