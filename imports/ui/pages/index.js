import React from 'react';
import Slides from '/imports/ui/containers/slides';
import { browserHistory } from 'react-router';
export const Index = () => {
  document.title="Мимимишки";
  return <div>
    {/* Магазин мимимишек, информация для клиентов, акции и др. */}
    <Slides />
  </div>
};
