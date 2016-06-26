import React from 'react';
import {
    render
} from 'react-dom';

import waddup from '../src';

const subscribeToFoo = (isPublishedOnce = false) => {
    const options = {
        isPublishedOnce
    };

    return waddup.subscribe('foo', (topic, data) => {
        console.log('hello world');

        if (data) {
            console.log(`I have data for ${topic}!`, data);
        }
    }, options);
};

const fooId = subscribeToFoo();

console.log(waddup.getSubscriptions());

waddup.publish('foo');
waddup.publish('foo', {
    foo: 'bar'
});

waddup.unsubscribe(fooId);

waddup.publish('foo');

console.log(waddup.getSubscriptions());

subscribeToFoo(true);

waddup.publish('foo');
waddup.publish('foo called when it shouldn\'t be');

const finalFoo = subscribeToFoo();

const multipleIds = waddup.subscribe(['foo', 'bar'], (topic, data) => {
    console.log(`${topic} was called with data `, data);
});

waddup.publish('foo', {
    stuff: 'for foo'
});
waddup.publish('bar', {
    stuff: 'for bar'
});

waddup.unsubscribe(finalFoo);

waddup.publish('foo');
waddup.publish('bar');

console.log(waddup.getSubscriptions());

const App = () => {
    return (
        <div>
            App
        </div>
    );
};

const div = document.createElement('div');

div.id = 'app-container';

render((
    <App/>
), div);

document.body.appendChild(div);