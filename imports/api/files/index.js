import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { FilesCollection } from 'meteor/ostrio:files';
import Grid from 'gridfs-stream';
import { MongoInternals } from 'meteor/mongo';
import fs from 'fs';


// Set up gfs instance
let gfs;
if (Meteor.isServer) {
  gfs = Grid(
    // database,
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );
}
// export const Documents = new Mongo.Collection('documents', { _driver: database });

export const Files = new FilesCollection({
  // debug: true,
  collectionName: 'files',
  allowClientCode: false, // Disallow remove files from Client,
  onBeforeUpload: function (file) {
    return false;
  },
  interceptDownload(http, file, versionName) {
    const _id = (file.versions[versionName].meta || {}).gridFsFileId;
    if (_id) {
      const readStream = gfs.createReadStream({ _id });
      readStream.on('error', err => { throw err; });
      readStream.pipe(http.response);
    }
    return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
  },
});

if (Meteor.isServer) {
  Files.denyClient();
}
