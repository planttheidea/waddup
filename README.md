sup
===

A simple publish / subscribe library without dependencies

### Purpose

To provide straigntforward and multifunctional publish / subscribe capabilities that is not dependent on another library or framework. It is built with the intention of having as minimal a footprint as possible, while still providing versatility in its usage.

### Size

+ Uncompressed: 3.27KB
+ Minified: 1.23KB
+ Minified and gzipped: 645B

**sup.publish()**

Publish a topic, usually upon some other event. This topic can be subscribed to by an unlimited number of objects. To execute the method, a single object is passed in with the following components:
+ topic *(string, required)*
  + Unique name given to topic
+ data *(string / array / object, optional)*
  + Data that can be accessed in the subscription
  + Can be any datatype, but defaults to an object

Example:
```
var div = document.getElementById('div');

div.addEventListener('click',function(){
  Sup.publish({
    topic:'divClick',
    data:{
      id:div.id
    }
  });
},false);
```

**sup.subscribe()**

Subscribe to a topic, so that a specific function you pass in will be executed upon each publishing of that topic. To execute the method, a single object is passed in with the following components:
+ topic *(string / array, required)*
  + Name of topic(s) to which you are subscribing
  + If subscribing to multiple topics, provide them as strings in an array
+ name *(string, required)*
  + Unique name of subscription
+ once *(boolean, optional)*
  + Perform the subscription funcion only once (default is false)
+ fn *(function, required)*
  + Function that will be executed upon each publishing of given topic

Example:
```
sup.subscribe({
  // topic:'divClick',
  topic:['divClick','divDimensionsResize'],
  name:'getDivId',
  fn:function(id,topic){
    if(id === 'foo'){
      // do foo stuff
    }
    
    if(topic === 'divClick'){
      // do divClick specific stuff
    }
  }
});
```

**Sup.unsubscribe()**

Remove subscription(s) to a topic based on subscription name passed in. To execute the method, a single object is passed in with the following components:
+ name *(string / array, required)*
  + Unique name of subscription

Example:
```
sup.unsubscribe({
  //name:'getDivId'
  name:['getDivId','someOtherTopic']
});
```
