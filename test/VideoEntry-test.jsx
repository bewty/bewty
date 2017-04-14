import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import VideoEntry from '../src/app/components/videoEntry/VideoEntry.jsx';

describe('<VideoEntry />', function() {

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
    const wrapper = shallow(<VideoEntry/>);
    expect(wrapper.containsMatchingElement(<h1>Video Entry</h1>)).to.equal(true);
  });
});