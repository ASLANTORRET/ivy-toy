import React from 'react';
import { Tabs, Tab, Panel, Row, Col, ListGroup } from 'react-bootstrap';
// import { browserHistory, Link } from 'react-router';
import _ from 'lodash';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Dropzone from 'react-dropzone';
import File from './file';

class Files extends React.Component {
  render() {
    const { files, onDrop, onRemove, onMove } = this.props;
    return (
      <div>
        <Dropzone onDrop={ onDrop }>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
        <div className="row">
          {files.length ? files.map(
            file => <File key={file._id} onRemove={() => onRemove(file._id)} onMove={onMove} file={file}/>
          ):null}
        </div>
      </div>
    )
  }
}
Files.propTypes = {
  files: React.PropTypes.array,
  onDrop: React.PropTypes.func,
  onRemove: React.PropTypes.func,
  onMove: React.PropTypes.func,
};

export default DragDropContext(HTML5Backend)(Files);
