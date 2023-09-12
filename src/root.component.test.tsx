/* eslint-disable node/no-unpublished-import */
import React from 'react';
import {cleanup, render, screen, within} from '@testing-library/react';
// eslint-disable-next-line node/no-extraneous-import
import 'whatwg-fetch';
import Root from './root.component';

describe('Layout-Manager App Tests', () => {
  // To render the layout manager app before each test
  beforeEach(() => {
    render(<Root />);
  });

  // To unmounts React trees that were mounted with render after each test
  afterEach(() => {
    cleanup;
  });

  it('TEST 1 - Check the presence of the "Layout Manager" title in the alarm modal', () => {
    const {getByText} = within(screen.getByTestId('layoutManagerTitle'));
    expect(getByText('Layout Manager')).toBeTruthy();
  });

  it('TEST 2 - Check the presence of the stepper div', () => {
    expect(screen.getByTestId('stepsDivLayoutManager')).toBeTruthy();
  });
});
