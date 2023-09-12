/* eslint-disable node/no-unpublished-import */
import React from 'react';
import {cleanup, render, screen, within} from '@testing-library/react';
// eslint-disable-next-line node/no-extraneous-import
import 'whatwg-fetch';
import Step3 from './step3.component';

describe('Step3 Component App Tests', () => {
  // To render the step3 component before each test
  beforeEach(() => {
    render(<Step3 />);
  });

  // To unmounts React trees that were mounted with render after each test
  afterEach(() => {
    cleanup;
  });

  it('TEST 1 - Check the presence of the "Change the page layout" title in the step3 component', () => {
    const txt = 'Change the page layout';
    const {getByText} = within(screen.getByTestId('changeLayoutPageP'));
    expect(getByText(txt)).toBeTruthy();
  });

  it('TEST 2 - Check the presence of the layout image container', () => {
    expect(screen.getByTestId('layoutImageDiv')).toBeTruthy();
  });

  it('TEST 3 - Check the presence of the app selection drop-down menus container', () => {
    expect(screen.getByTestId('layoutAppsDiv')).toBeTruthy();
  });

  it('TEST 4 - Check the presence of the success, failure or loading div container', () => {
    expect(screen.getByTestId('loadingDiv')).toBeTruthy();
  });

  it('TEST 5 - Check the presence of the "Apply Changes" text in the step3 component button', () => {
    const {getByText} = within(screen.getByTestId('applyChangesLayoutButton'));
    expect(getByText('Apply Changes')).toBeTruthy();
  });
});
