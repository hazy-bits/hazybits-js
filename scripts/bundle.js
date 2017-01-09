const fs = require('fs');
const browserify = require('browserify');
const outpath = __dirname + '/../dist/';

browserify(__dirname + '/../index.js', { standalone: 'HazyBits' })
  .transform('babelify', { presets: ['es2015'] })
  //.transform({ global: true }, 'uglifyify')
  .bundle()
  .on('error', function (err) { console.log(`Error: ${err.message}`); })
  .pipe(fs.createWriteStream(outpath + 'hazybits.js'));
