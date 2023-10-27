import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

import App from './App';

it('renders without crashing', () => {
    render( <Provider store={store}><App /></Provider>)
})
