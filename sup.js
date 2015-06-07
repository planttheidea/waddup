/*
 *
 * Copyright 2015 Tony Quetano under the terms of the MIT
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
;(function(window,document,undefined){
	var topics = {},
		IDs = {},
		persistentIDs = {},
		subUid = -1,
		getType = function(obj){
			return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
		};
	
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
						if((topics[m][i].token === IDs[name]) && !topics[m][i].persistent){
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
		var type = getType(unsubscribeObj.name);
		
		if(type === 'string'){
			prv_unsubscribeName(unsubscribeObj.name);
		} else if(type === 'array'){
			for(var i = unsubscribeObj.name.length; i--;){
				prv_unsubscribeName(unsubscribeObj.name[i]);
			}
		}
		
		return this;
	}
	
	// performs subscription (abstrated for the same reason as above unsubscription)
	function prv_subscribeTopic(topic,newToken,fn,once,name){
		if(getType(topics[topic]) !== 'array'){
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
                // only subscribes if name is provided
		if(getType(subscribeObj.name) == 'string'){
			var type = getType(unsubscribeObj.topic);
			// unsubscribes from topic if subscription already exists
			if(IDs[subscribeObj.name]){
				prv_unsubscribeName(subscribeObj.name);
			}
		
			if(type === 'string'){
				prv_subscribeTopic(subscribeObj.topic,subscribeObj.token,subscribeObj.fn,subscribeObj.once,subscribeObj.name);
			} else if(type === 'array'){
				for(var i = subscribeObj.topic.length; i--;){
					prv_subscribeTopic(subscribeObj.topic[i],subscribeObj.token,subscribeObj.fn,subscribeObj.once,subscribeObj.name);
				};
			}
			
			// assigns new ID
			IDs[subscribeObj.name] = (++subUid);
		}
		
		return this;
	}
	
	window.sup = {
		publish:prv_publish,
		subscribe:prv_subscribe,
		unsubscribe:prv_unsubscribe
	};
})(window,document);
