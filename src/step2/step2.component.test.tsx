/* eslint-disable node/no-unpublished-import */
import React from 'react';
import {cleanup, render, screen, within} from '@testing-library/react';
// eslint-disable-next-line node/no-extraneous-import
import 'whatwg-fetch';
import Step2 from './step2.component';

describe('Step2 Component Tests', () => {
  // To render the step2 component before each test
  beforeEach(() => {
    render(<Step2 />);
  });

  // To unmounts React trees that were mounted with render after each test
  afterEach(() => {
    cleanup;
  });

  it('TEST 1 - Check the presence of external div', () => {
    expect(screen.getByTestId('selectPageExternalDiv')).toBeTruthy();
  });

  it('TEST 1 - Check the presence of the correct text in the "Select page" title', () => {
    const txt = 'Select a page';
    const {getByText} = within(screen.getByTestId('selectPageP'));
    expect(getByText(txt)).toBeTruthy();
  });

  it('TEST 3 - Check the presence of div to select a page', () => {
    expect(screen.getByTestId('selectPageDiv')).toBeTruthy();
  });
});
