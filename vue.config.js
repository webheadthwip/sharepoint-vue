module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/prod'
    : '/',
  outputDir: 'prod',
  filenameHashing: false,
};
