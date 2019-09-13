import './Card.styl';
import React from 'react';
import cn from 'classnames'

const Card = props => {
  const { visible, type } = props;
  
  const classes = cn(
    'card', 
    {
      'card-view': visible,
      'card-back': !visible,
      [`card-type-${type}`]: visible && type 
    }
  );

  return (
    <div className={classes}>
      <div className='title type2'>
        Forgotten Plains
      </div>
      <div className='description'>
        <ul className='traits type5'>
          <li>Generates 1 Mana at the beginning of your turn.</li>
        </ul>
        <p className='flavor type5'>
          A cold wind sweeps across a deserted landscape.
          The world has moved on.
        </p>
      </div>
    </div>
  )
};

Card.defaultProps = {
  visible: false,
  type: 1
};

export default Card;
