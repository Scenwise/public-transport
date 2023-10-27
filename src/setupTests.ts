// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock mapbox, otherwise the component wont render as WebGL is not available during testing
jest.mock('mapbox-gl')

// eslint-disable-next-line @typescript-eslint/no-empty-function
window.URL.createObjectURL = function () {}