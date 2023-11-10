import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import App from './App';
import store from './store';

it('renders without crashing', () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>,
    );
});
