import React from 'react';
import { HtmlContent } from '/imports/modules/html-content';
export const Text = ({ text }) => {
  return (
    <div className="section flow-text">
      <h4>{ text.title }</h4>
      <HtmlContent html={text.body} />
    </div>
  )
}
