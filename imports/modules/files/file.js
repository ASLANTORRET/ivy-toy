import React, { Component, PropTypes } from 'react';
import { Row, Col, ListGroupItem, Glyphicon, Button } from 'react-bootstrap';
import { ItemTypes } from './constants';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

// let onMove;

const source = {
  beginDrag(props) {
    // console.log(props);
    return props.file;
  },
  endDrag: function (props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }
    const dragFile = monitor.getItem();
    const hoverFile = monitor.getDropResult();
    if (! hoverFile) {
      return;
    }
    const dragIndex = dragFile.index;
    const hoverIndex = hoverFile.index;

    if (dragFile._id === hoverFile._id) {
      return;
    }

    props.onMove(dragFile._id, hoverIndex);
  }
}

const target = {
  hover (props, monitor, component) {
    const dragFile = monitor.getItem();
    const hoverFile = props.file;

    const dragIndex = dragFile.index;
    const hoverIndex = hoverFile.index;

    if (dragFile._id === hoverFile._id) {
      return;
    }

    if (dragIndex < hoverIndex) {
      hoverFile.isAfter = true;
      hoverFile.isBefore = false;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex) {
      hoverFile.isAfter = false;
      hoverFile.isBefore = true;
    }
    return;
  },
  drop (props, monitor, component) {
    const dragFile = monitor.getItem();
    const hoverFile = props.file;
    const dragIndex = dragFile.index;
    const hoverIndex = hoverFile.index;
    return hoverFile;
    // console.log("drop props",props);
    // console.log("hoverIndex",hoverIndex);
    //
    // if (dragFile._id === hoverFile._id) {
    //   return;
    // }
    //
    // props.onMove(dragFile._id, hoverIndex);
  }
}

const collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}
const collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}

class File extends Component {
  render() {
    const { connectDragSource, isDragging, isOver, file, onRemove, connectDropTarget, onMove} = this.props;
    return connectDragSource(connectDropTarget(
      <div>
        {isOver && file.isBefore ? <ListGroupItem /> : null}
        <ListGroupItem>
        <Row>
          <div className="col-xs-3">
            <img src={ file.link } className="thumbnail"/>
          </div>
          <div className="col-xs-9">
            { onRemove ? <Button onClick={ () => onRemove(file._id)} className="pull-right btn-xs"><i className='fa fa-times' /></Button> : null}
          </div>
        </Row>
        </ListGroupItem>
        {isOver && file.isAfter ? <ListGroupItem /> : null}
      </div>
    ));
  }
}

export default DropTarget(ItemTypes.FILE, target, collectDrop)(
  DragSource(ItemTypes.FILE, source, collectDrag)(
    File
  )
)
