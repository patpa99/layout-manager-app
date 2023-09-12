/* eslint-disable node/no-unpublished-import */
import React from 'react';
import {cleanup, render, screen, within} from '@testing-library/react';
// eslint-disable-next-line node/no-extraneous-import
import 'whatwg-fetch';
import Step1 from './step1.component';

describe('Step1 Component Tests', () => {
  // To render the step1 component before each test
  beforeEach(() => {
    render(<Step1 />);
  });

  // To unmounts React trees that were mounted with render after each test
  afterEach(() => {
    cleanup;
  });

  it('TEST 1 - Check the presence of the "Add new pages" title in the step1 component', () => {
    const txt = 'Add new pages';
    const {getByText} = within(screen.getByTestId('addNewPagesP'));
    expect(getByText(txt)).toBeTruthy();
  });

  it('TEST 2 - Check the presence of the "Add new apps" title in the step1 component', () => {
    const txt = 'Add new apps';
    const {getByText} = within(screen.getByTestId('addNewAppsP'));
    expect(getByText(txt)).toBeTruthy();
  });

  it('TEST 3 - Check the presence of correct field for creating a new page or a new app', () => {
    expect(screen.getByTestId('inputNewPage')).toBeTruthy();
    expect(screen.getByTestId('sidebarSecNewPage')).toBeTruthy();
    expect(screen.getByTestId('sidebarNewPage')).toBeTruthy();
    expect(screen.getByTestId('buttonNewPage')).toBeTruthy();
    expect(screen.getByTestId('inputNewAppName')).toBeTruthy();
    expect(screen.getByTestId('inputNewAppPath')).toBeTruthy();
    expect(screen.getByTestId('buttonNewApp')).toBeTruthy();
  });

  it('TEST 4 - Check the presence of the success, failure or loading div container', () => {
    expect(screen.getByTestId('loadingDiv')).toBeTruthy();
  });
});
