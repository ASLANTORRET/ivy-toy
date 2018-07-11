import React from 'react';
import { browserHistory } from 'react-router';
export const MainSlides = ({ slides }) => {
  return (
    <div className="main-slides">
      {slides.map(slide => {
        return <div className="row" key={slide._id}>
          <div className="col s12">
            <div className="card" onClick={() => {
              slide.link ? browserHistory.push( slide.link ) : null;
            }}>
              { slide.fileUrl
                ? <div className="card-image">
                    <img src={ slide.fileUrl }/>
                    {/* <span className="card-title">{ slide.name }</span> */}
                  </div>
                : null}
              {/* <div className="card-content">
                <p>I am a very simple card. I am good at containing small bits of information.
                I am convenient because I require little markup to use effectively.</p>
              </div> */}
            </div>
          </div>
        </div>
      }) }
    </div>
  )
}
