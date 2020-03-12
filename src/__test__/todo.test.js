/* eslint-disable no-unused-vars */
import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import Todo from '../components/todo/todo.js';

Enzyme.configure({adapter: new Adapter() });

describe('<Form />', ()=>{
  it('can render Form',()=>{
    let app = mount(<Todo/>);
    let form = app.find('form');
    expect(form.exists()).toBeTruthy();
  });

  it('can render to the DOM',()=>{
    const rendered = renderer.create(<Todo />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});