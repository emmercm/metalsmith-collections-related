'use strict';

const os = require('os');

const deepmerge = require('deepmerge');
const minimatch = require('minimatch');
const htmlEscaper = require('html-escaper');
const sanitizeHtml = require('sanitize-html');
const natural = require('natural');

const { TfIdf } = natural;

const sanitize = (contents) => htmlEscaper
  .unescape(sanitizeHtml(contents.toString(), {
    allowedTags: [],
    allowedAttributes: {},
    nonTextTags: ['code', 'pre'],
  }))
  .trim();

module.exports = (options) => {
  options = deepmerge({
    pattern: '**/*',
    maxRelated: 3,
    parallelism: os.cpus().length,
  }, options || {});

  return (files, metalsmith, done) => {
    // Filter files to be considered
    const keywordFiles = Object.keys(files)
      .filter(minimatch.filter(options.pattern))
      .filter((filename) => files[filename].collection);

    // Create a map of collection->files
    const collections = {};
    keywordFiles
      .forEach((filename) => {
        files[filename].collection
          .forEach((collection) => {
            if (!collections[collection]) {
              collections[collection] = [];
            }
            collections[collection].push(filename);
          });
      });

    // For each collection of files
    Object.keys(collections)
      .forEach((collection) => {
        const collectionFiles = collections[collection];

        // For each file in the collection
        collectionFiles
          .forEach((filename) => {
            const tfidf = new TfIdf();

            // Gather filenames in order
            const documentFilenames = [filename, ...collectionFiles
              .filter((relatedFilename) => relatedFilename !== filename)];

            // Add each file to tf-idf
            documentFilenames
              .forEach((documentFilename) => {
                tfidf.addDocument(sanitize(files[documentFilename].contents));
              });

            // Find key terms
            const terms = tfidf.listTerms(0)
              .map((term) => term.term);

            // Find related files
            let relatedFiles = [];
            tfidf.tfidfs(terms, (i, measure) => {
              relatedFiles.push({
                filename: documentFilenames[i],
                measure,
              });
            });
            relatedFiles = relatedFiles
              .slice(1)
              .sort((a, b) => b.measure - a.measure)
              .slice(0, options.maxRelated)
              .map((related) => files[related.filename]);

            // Set related info in the file's metadata
            if (!files[filename].related) {
              files[filename].related = {};
            }
            files[filename].related[collection] = relatedFiles;
          });
      });

    done();
  };
};
