import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import AudioEntry from '../src/app/components/audioEntry/AudioEntry.jsx';

describe('<AudioEntry />', function() {

  let sandbox;
  let startRecord;
  let stopRecord;
  let uploadAudio;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    const resolved = new Promise((res) => res({ data: [{ type: 'admin' }] }));
    sandbox.stub(axios, 'post').returns(resolved);
    startRecord = sinon.spy(AudioEntry.prototype, 'startRecord');
    stopRecord = sinon.spy(AudioEntry.prototype, 'stopRecord');
    uploadAudio = sinon.spy(AudioEntry.prototype, 'uploadAudio');
  });

  afterEach(() => {
    sandbox.restore();
    startRecord.restore();
    stopRecord.restore();
    uploadAudio.restore();
  });

  it('should render a title', () => {
    const wrapper = shallow(<AudioEntry/>);
    expect(wrapper.contains(<h1>Audio Entry</h1>)).to.equal(true);
  });

  it('should have start and stop states as false on mount', () => {
    const wrapper = shallow(<AudioEntry/>);
    expect(wrapper.state().start).to.equal(false);
    expect(wrapper.state().stop).to.equal(false);
  });

  it('should call startRecord function and set start state to true when record button is clicked', () => {

    const wrapper = mount(<AudioEntry/>);
    const RecordButton = wrapper.find('button').at(0);
    expect(RecordButton.text()).to.equal('Record');
    expect(wrapper.state().start).to.equal(false);
    expect(wrapper.state().stop).to.equal(false);
    expect(startRecord.called).to.equal(false);
    RecordButton.simulate('click');
    expect(wrapper.state().start).to.equal(true);
    expect(startRecord.called).to.equal(true);
  });


  it('should handle upload when upload button is clicked', () => {
    const wrapper = mount(<AudioEntry/>);
    const UploadButton = wrapper.find('button').at(2);
    expect(UploadButton.text()).to.equal('Upload');
    expect(uploadAudio.called).to.equal(false);
    UploadButton.simulate('click');
    expect(uploadAudio.called).to.equal(true);
  });

  it('should call getUserMedia on mount', () => {
    const getUserMedia = sinon.spy(AudioEntry.prototype, 'getUserMedia');
    expect(getUserMedia.called).to.equal(false);
    const wrapper = mount(<AudioEntry/>);
    expect(getUserMedia.called).to.equal(true);
  });
});