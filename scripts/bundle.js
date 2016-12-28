const fs = require('fs');
const browserify = require('browserify');

browserify('./index.js', { standalone: 'HazyBits' })
  .transform('babelify', { presets: ['es2015'] })
  .transform({ global: true }, 'uglifyify')
  .bundle()
  .on('error', function (err) { console.log(`Error: ${err.message}`); })
  .pipe(fs.createWriteStream('./dist/hazybits.js'));
