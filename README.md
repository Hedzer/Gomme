### Gomme
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gomme is a lightweight tool for creating JavaScript data structures with eventful properties.  When a property changes, an event is fired.  This allows you to respond to changes in data as they occur.

### Usage
Include the JavaScript file in your HTML.
```html
<script src="gomme.js"></script>
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
##### Coming Soon (features finished, but to be documented)

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

###### Async Disposal

### Future Features
###### Managing Collections
###### On-The-Fly Additions/Removals
###### Anonymous Adds
