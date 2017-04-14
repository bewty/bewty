import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import TextEntry from '../src/app/components/textEntry/TextEntry.jsx';

describe('<TextEntry />', function() {

  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    const resolved = new Promise((res) => res({ data: [{ type: 'admin' }] }));
    sandbox.stub(axios, 'get').returns(resolved);
    sandbox.stub(axios, 'post').returns(resolved);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render a title', () => {
    const wrapper = shallow(<TextEntry/>);
    expect(wrapper.containsMatchingElement(<h1>Text Entry</h1>)).to.equal(true);
  });
});