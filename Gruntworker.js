var path = require("path");
var exec = require('child_process').exec;

module.exports = function (grunt) {


  /* ============================================================================== CSS */
  function minifyCSS(source, options) {
    try {
      return require('clean-css').process(source, options);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.fatal('css minification failed.');
    }
  };

  function buildCSSBlock(block, opts) {
    /* compress css */
    if (opts.compress) {
      var maximized = block.files.map(grunt.file.read).join(grunt.util.normalizelf(grunt.util.linefeed));
      var minimized = minifyCSS(maximized, {keepSpecialComments: 0});
      if (block.output === "file") {
        grunt.file.write("./" + path.join(opts.dest,block.assetfolder, block.assetfile), minimized);
        grunt.log.ok("Written "+path.join(opts.dest,block.assetfolder, block.assetfile));
        return '<link rel="stylesheet" href="' + path.join(block.assetfolder,block.assetfile) + '">';
      } else {
        return "<style>" + minimized + "</style>";
      }
    }
    /* plain css files */
    if (block.output === "file") {
      var styles = [];
      block.files.forEach(function (file, index) {
        var to = "./" + path.join(opts.dest, block.assetfolder, path.basename(file));
        var ito = path.join(block.assetfolder, path.basename(file));
        grunt.file.copy(file, to);
        grunt.log.ok("Written "+to);
        styles.push('<link rel="stylesheet" href="' + ito + '">');
      });
      return styles.join("\n");
    }
    /* plain css include */
    return [
      "<style>",
      block.files.map(grunt.file.read).join(grunt.util.normalizelf(grunt.util.linefeed)),
      "</style>"
      ].join(grunt.util.linefeed);
  };

  /* ============================================================================== TEMPLATES */
  var minifyHTML = require('html-minifier').minify;

  function buildTemplateBlock(block, opts) {
    var src = block.files.map(grunt.file.read).join(grunt.util.normalizelf(grunt.util.linefeed));
    var min = "";
    if (opts.compress) {
      min = minifyHTML(src, { removeComments: true, collapseWhitespace: true, collapseBooleanAttributes:false, removeAttributeQuotes:false, removeRedundantAttributes: false, removeEmptyAttributes: false });
    } else {
      min = src;
    }
    return ['<script id="'+block.id+'" type="text/ng-template">', min ,'</script>'].join(grunt.util.linefeed);
  };
  /* ============================================================================== JS */
  var UglifyJS = require("uglify-js");

  function buildJSBlock(block, opts) {
    /* compress js */
    if (opts.compress) {
      var maximized = block.files.map(grunt.file.read).join(";"+grunt.util.normalizelf(grunt.util.linefeed));
      var result = UglifyJS.minify(maximized, { outSourceMap: block.assetfile+".map", fromString: true });
      if (block.output === "file") {
        grunt.file.write("./" + path.join(opts.dest,block.assetfolder, block.assetfile), result.code);
        grunt.log.ok("Written "+path.join(opts.dest,block.assetfolder, block.assetfile));
        grunt.file.write("./" + path.join(opts.dest,block.assetfolder, block.assetfile+".map"), result.map);
        grunt.log.ok("Written "+path.join(opts.dest,block.assetfolder, block.assetfile+".map"));
        return '<script type="text/javascript" src="' + path.join(block.assetfolder,block.assetfile) + '">';
      } else {
        return "<script type=\"text/javascript\">" + result.code + "</script>";
      }
    }
    /* plain js files */
    if (block.output === "file") {
      var scripts = [];
      block.files.forEach(function (file, index) {
        var to = "./" + path.join(opts.dest, block.assetfolder, path.basename(file));
        var ito = path.join(block.assetfolder, path.basename(file));
        grunt.file.copy(file, to);
        grunt.log.ok("Written "+to);
        scripts.push('<script src="' + ito + '"></script>');
      });
      return scripts.join("\n");
    }
    /* plain css include */
    return [
      "<script>",
      block.files.map(grunt.file.read).join(grunt.util.normalizelf(grunt.util.linefeed)),
      "</script>"
      ].join(grunt.util.linefeed);
    return "";
  };

  /* ============================================================================== TASk */
  return function () {

    /* variables */
    var cheerio = require('cheerio');
    var cb_end = this.async();
    var on_end = null;
    var cbcount = 0;

    /* flow control */
    function cb(err) {
      if (err) { cb_end(err); }
      cbcount--;
      if (cbcount <= 0) {
        if (on_end) { return on_end(cb_end); }
        return cb_end();
      }
    }

    /* template */
    var $ = cheerio.load(grunt.file.read(this.data.layout));
    var builders = [];
    var templates = [];

    /* grab templates */
    $('template').each( function (index, template) {
      var id = template.attribs.id;
      var src = template.attribs.src;
      if (typeof id === "undefined" || id === null) { grunt.fail.fatal('template include needs an "id" attribute'); return null; }
      if (typeof src === "undefined" || src === null) { grunt.fail.fatal('template include needs an "src" attribute'); return null; }
      var files = grunt.file.expand({cwd:__dirname},src);
      $(template).attr('id', 't-'+index);
      templates.push({ type: 'templates', id: id, files: files });
    });

    /* grab builders */
    $('build').each(function (index, builder) {

      /* grab block info */
      var type        = builder.attribs.type;
      var output      = builder.attribs.hasOwnProperty('include') ? 'include' : 'file';
      var assetfolder = builder.attribs.destfolder;
      var assetfile   = builder.attribs.destfile;

      /* ensure correct properties */
      if (typeof type === "undefined" || type === null) {
        grunt.fail.fatal('build block attribute "type" not found.');
        return null;
      }
      if (output === "file" && (typeof assetfolder === "undefined" || assetfolder === null)) {
        grunt.fail.fatal('build block without attribute "include" in layout has not "destfolder" attribute. \n Asset builders without include needs a destination folder and destination file.');
        return null;
      }
      if (output === "file" && (typeof assetfile === "undefined" || assetfile === null)) {
        grunt.fail.fatal('build block without attribute "include" in layout has not "destfile" attribute. \n Asset builders without include needs a destination folder and destination file.');
        return null;
      }
      type = type.toLowerCase();
      if (type !== "css" && type !== "js") {
        grunt.fail.fatal('build block of unknown type: "' + type + '"');
        return null;
      }

      /* grab files */
      var files = [];
      if (type === "css") { $('link',$(builder)).each(function (i, stylesheet) { if (stylesheet.attribs.rel !== "stylesheet") { return; } files.push( stylesheet.attribs.href ); }); }
      if (type === "js") { $('script', $(builder)).each(function (i, script) { if (typeof script.attribs.src !== "undefined" || script.attribs.src !== null) { files.push(script.attribs.src); } }); }

      /* mark build block with blocknumber */
      $(builder).attr('id', 'b-'+index);

      /* expand files */
      files = grunt.file.expand({cwd:__dirname},files);

      /* compile sass files */
      files.forEach(function (file, index) {
        if (path.extname(file).toLowerCase() === ".scss") {
          var cwd = __dirname;
          var from = path.join(__dirname, file);
          var to = path.join(__dirname,this.data.css.temp);
          var compiled = path.join(to, path.basename(file).replace(/\.scss$/i,".css"));
          files[index] = compiled;
          cbcount++;
          var child = exec('compass compile ' + cwd + ' ' + from + ' --css-dir '+to+' --output-style '+this.data.css.output+' --no-line-comments',
            function (error, stdout, stderr) {
              process.stdout.write(stdout);
              if (error !== null) { grunt.fail.fatal('exec error: ' + error); return null; }
              cb(error);
            }
          );
        }
      }.bind(this));

      /* store build process */
      builders.push({ type: type, output: output, assetfolder: assetfolder, assetfile: assetfile, files: files });
    }.bind(this));

    /* after grab all, compass */
    on_end = function (cb) {
      builders.forEach(function (builder, index) {
        if (builder.type === 'css') { $('build#b-'+index).replaceWith(buildCSSBlock(builder, this.data)); }
        if (builder.type === 'js') { $('build#b-'+index).replaceWith(buildJSBlock(builder, this.data)); }
      }.bind(this));
      templates.forEach(function (template, index) {
        if (template.type === 'templates') { $('template#t-'+index).replaceWith(buildTemplateBlock(template, this.data)); }
      }.bind(this));

      /* filter only tags */
      $('only').each(function (i, onlyBlock) {
        if (onlyBlock.attribs.when === this.target) {
          var childs = $(onlyBlock).children();
          $(onlyBlock).replaceWith(childs);
        } else {
          $(onlyBlock).replaceWith("");
        }
      }.bind(this));
      /* /only */

      /* save layout */
      var layout = $.html();
      //var min = "";
      //if (this.data.compress) { min = minifyHTML(layout, { removeComments: true, collapseWhitespace: true, collapseBooleanAttributes:false, removeAttributeQuotes:false, removeRedundantAttributes: false, removeEmptyAttributes: false }); }
      //else { min = layout; }
      var min = layout;
      grunt.file.write("./" + path.join(this.data.dest,"index.html"), min);
      grunt.log.ok("Written "+path.join(this.data.dest,"index.html"));

      return cb();
    }.bind(this);

    cbcount++;
    cb();
  };
};