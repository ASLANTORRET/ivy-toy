import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading';
import { Slides } from '/imports/api/slides';
import { MainSlides } from '/imports/ui/components/slides';
import { Files } from '/imports/api/files';

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  subscriptions.Slides = Meteor.subscribe('slides');
  if (subscriptions.Slides.ready()) {
    const slides = Slides.find({}, { sort: { position: 1 } }).fetch();

    const fileIds = [];
    slides.forEach(slides => {
      if (slides.fileId) {
        fileIds.push(slides.fileId);
      }
    });
    if (fileIds.length) {
      subscriptions.Files = Meteor.subscribe('file', fileIds)
      if (subscriptions.Files.ready()) {
        slides.forEach(slide => {
          if (slide.fileId) {
            const fileCursor = Files.findOne({_id: slide.fileId});
            if ( fileCursor && fileCursor.fetch()[0] ){
              // const file = fileCursor.fetch()[0];
              // file.link = Files.link(file);
              // slide.file = file;
              // this.file = file
              slide.fileUrl = fileCursor.link();
            }
          }
        });
      }
    }
    onData(null, { slides });
  }
}

export default compose(getTrackerLoader(reactiveMapper))(MainSlides);
