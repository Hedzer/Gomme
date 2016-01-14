### Gomme
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gomme is a lightweight tool for creating JavaScript data structures with eventful properties.  When a property changes, an event is fired.  This allows you to respond to changes in data as they occur.

### Usage
Include the JavaScript file in your HTML.
```html
	<script type="text/javascript" src="gomme.js"></script>
```
Create a class based on a model
```javascript
var person = Gomme.model("person", 
	{
		age:18,
		name:{
			first:"John",
			middle:"Major",
			last:"Doe"
		},
		birthday:{
			month:2,
			day:12,
			year:1987
		}
	}
);
```
The code above creates and returns the `person` class. Now, the following can be done:
```javascript
var someone = new person();
```
The variable `someone` will contain the same structure as above, along with all the default values. Now event listeners can be created to handle change. Here's how to handle change:
```javascript
var someone = new person();
someone.$.on("age", function(e){
	console.log("Old value "+e.old+" was changed to "+e.new);
});
someone.age = 47;
```
The above would generate a `console.log` with the message `Old value 18 was changed to 47`.  Despite inheriting values, instances don't hold copies of default values.

If you wanted to add an event listener to a nested member, simply call the `$.on` function on the desired child. For example:
```javascript
var someone = new person();
someone.name.$.on("first", function(e){
	console.log("Old value "+e.old+" was changed to "+e.new);
});
someone.name.first = "Lemon";
```
The above would generate a `console.log` with the message `Old value John was changed to Lemon`.

When finished with an instance, it can safely be disposed of by calling `instance.$.dispose()`. The prior example would use `someone.$.dispose()`.

### Advanced Usage

##### Monitoring All Properties For Change
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;It is possible to monitor all properties for change using the `$.on` function with a property name of `*`.  The code below shows how to use this feature.
```javascript
var someone = new person();
someone.$.on("*", function(e){
	console.log(e);
});
someone.name.first = "Lemon";
```
The above would generate a `console.log` with an object.  The `e` object in the prior example has the following structure:
```javascript
{
	new:"Lemony",      //the new, current value
	old:"John",        //the previous value
	owner:person_name, //the class or sublclass that triggered the event
	property:"first"   //the name of the property
}
```

##### Manually Triggering Events
Events are triggered when values change, but they can also be triggered manually using the `$.trigger` function.  The following is an example of its usage.
```javascript
var someone = new person();
someone.$.on("age", function(e){
	console.log("Old value "+e.old+" was changed to "+e.new);
});
someone.$.trigger("age", {
	old:10,
	new:20
});
```
The above would generate a `console.log` with the message `Old value 10 was changed to 20`. The `$.trigger` function should be passed an object formatted similarly to that generated when an event is triggered by Gomme. A previous example shows the contents of the `e` variable, which follows the expected format.

###### Removing Events
Sometimes an event needs to be removed.  When the `$.on` function is called, it returns a handle object that contains two methods, `remove` and `removeAll`.  The `remove` method removes the event that was added from the `$.on` function call that resulted in that handle. The `removeAll` method removes all the functions assigned under the event passed to the `$.on` function that resulted in that handle. Check out the example below for a little more clarity.
```javascript
var someone = new person();
var handle = someone.$.on("age", function(e){
	console.log("Old value "+e.old+" was changed to "+e.new);
	handle.remove();
});
```
When `age` is changed on `someone`, the function assigned to the age change event will run and then be removed.  `remove` allows the removal of specific functions. If `removeAll` had been used, it would have removed all functions set to be run by the age changed event.

###### Arrays In Models
Models can contain arrays; these will also trigger events. Consider the following structure,
```javascript
var person = Gomme.model("person", 
	{
		age:18,
		name:{
			first:"John",
			middle:"Major",
			last:"Doe"
		},
		birthday:{
			month:2,
			day:12,
			year:1987
		},
		friends:[]
	}
);
```
Once an instance of the person model has been created, the `friends` property will contain an array with modified functions.  When these functions are called, they trigger events. Here's an example of how to use them.
```javascript
var someone = new person();
someone.friends.$.on("push", function(e){
	console.log(e);
});
someone.friends.push("Fred");
```
The above would generate a `console.log` with an object.  The `e` object has the following structure:
```javascript
{
	arguments:["Fred"], //the argument given to the function
	result:1  //the result of running the function
}
```
###### Async Disposal
Disposal deletes properties and nulls variables to properly trigger garbage collection; this can be rather intensive sometimes.  If it's becoming an issue, the process has an async mode that can be activated.  By running `$.dispose(true)`, dispose can be made to run whenever it gets processor time instead of running immediately. If dispose is called with a callback (`$.dispose(callback)`), it will also run asynchronously and will run the callback when finished.

### Future Features
###### Managing Collections
###### On-The-Fly Additions/Removals
###### Anonymous Adds
