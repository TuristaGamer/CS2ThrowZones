const { withAnalytics } = require('@vercel/analytics');

module.exports = withAnalytics({
  entryPoint: './app.js',
});
