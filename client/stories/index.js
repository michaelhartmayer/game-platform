import React from 'react';
import { storiesOf } from '@storybook/react';

import '~/app.styl';
import Card from '~/components/Card';

const storiesOfCard = storiesOf('Card', module);

storiesOfCard.add('default', () => <Card />);

storiesOfCard.add('hidden', () => <Card visible={false} />);

storiesOfCard.add('visible', () => <Card visible />);

// show each card
Array(6).fill(0).forEach((v, i) => {
  i = i + 1;
  storiesOfCard.add('Card #' + i, () => <Card visible type={i} />);
});