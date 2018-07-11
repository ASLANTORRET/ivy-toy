import React from 'react';
import $ from 'jquery';
import { browserHistory} from 'react-router';
const createMarkup = (body) => {
  // console.log(body.replace(/<a ([^>]+?)/gi, "<h1"));
  // return {__html: body.replace(/(<a [^>]+?)>/gi, '$1 onClick="' )};
  return {__html: body};
}

const onClick = (event) => {
  event.preventDefault();
  let $target = $(event.target);
  let href = $target.attr("href");
  if ($target.is("a") && href){
    browserHistory.push(href);
  }
}

export const HtmlContent = ({ html }) => {
  return (
    <div dangerouslySetInnerHTML={createMarkup(html)} onClick={ onClick } />
  )
}
