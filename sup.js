/*
 *
 * Copyright 2014 Tony Quetano under the terms of the MIT
 * license found at https://github.com/planttheidea/sup/MIT_License.txt
 *
 * sup.js - A simple publish / subscribe library without dependencies
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
(function(window,document){
	var topics = {},
		IDs = {},
		subUid = -1,
		throwError = function(e){
			throw new Error(e);
		},
		type = function(obj){
			return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
		};
	
	// function to retrieve internal ID assigned to subscription
	function prv_getID(idObj){
		return IDs[idObj.name];
	}
	
	// publishes event, with data and topic as arguments
	function prv_publish(publishObj){
		var data = (publishObj.data || {}),
			subscribers,
			len;
		
		if(!topics[publishObj.topic]){
			return false;
		}
		
		subscribers = topics[publishObj.topic];
		len = (subscribers ? subscribers.length : 0);
			
		while(len--){
			subscribers[len].func(data,publishObj.topic);
		}
		
		return this;
	}
	
	/* 
	 * performs unsubscription (abstracted for different types of names
	 * passed into API function
	 */
	function prv_unsubscribeName(name){
		if(IDs[name] > 0){
			for(var m in topics){
				if(topics[m]){
					for (var i = topics[m].length; i--;) {			
						if(topics[m][i].token === IDs[name]){
							delete IDs[name];
							
							topics[m].splice(i,1);
						}
					}
				}
			}
		}
	}
	
	// API access, calls prv_unsubscribeName differently depending on type
	function prv_unsubscribe(unsubscribeObj){
		switch(type(unsubscribeObj.name)){
			case 'string':
				prv_unsubscribeName(unsubscribeObj.name);
				
				break;
			case 'array':
				for(var i = unsubscribeObj.name.length; i--;){
					prv_unsubscribeName(unsubscribeObj.name[i]);
				}
				
				break;
			default:
				throwError('Name passed is not of valid type.');
				break;
		}
		
		return this;
	}
	
	// performs subscription (abstrated for the same reason as above unsubscription)
	function prv_subscribeTopic(topic,newToken,fn,once,name){
		if(type(topics[topic]) !== 'array'){
			topics[topic] = [];
		}
		
		if(once){
			fn = function(){
				fn.call();
				prv_unsubscribeName(name);
			};
		}
	
		topics[topic].push({
			token:newToken,
			func:fn
		});
	}
	
	/*
	 * unsubscribes name if subscription already exists, then subscribes
	 * to the topics provided
	 */
	function prv_subscribe(subscribeObj){
		// throws an error if the name passed is not a string
		if(type(subscribeObj.name) !== 'string'){
			throwError('Name passed is not a string.');
			return false;
		}
		
		// unsubscribes from topic if subscription already exists
		if(IDs[subscribeObj.name]){
			prv_unsubscribeName(subscribeObj.name);
		}
		
		// subscriptions called differently depending on typ
		switch(type(subscribeObj.topic)){
			case 'string':
				prv_subscribeTopic(subscribeObj.topic,subscribeObj.token,subscribeObj.fn,subscribeObj.once,subscribeObj.name);

				break;
			case 'array':					
				for(var i = subscribeObj.topic.length; i--;){
					prv_subscribeTopic(subscribeObj.topic[i],subscribeObj.token,subscribeObj.fn,subscribeObj.once,subscribeObj.name);
				};
				
				break;
			case 'undefined':
				throwError('Must provide a topic to subscribe to.');
				
				break;
			default:
				throwError('Invalid topic type, must be either string or array.');		
								
				break;
		}
		
		// assigns new ID
		IDs[subscribeObj.name] = (++subUid);
		
		return this;
	}
	
	if(!window.Sup){
		window.Sup = {
			publish:prv_publish,
			subscribe:prv_subscribe,
			unsubscribe:prv_unsubscribe
		};
	} else {
		throwError('Window object of Sup already exists.');
	}
})(window,document);
