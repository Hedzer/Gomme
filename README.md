### Gomme
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gomme is a lightweight framework for creating JavaScript data structures with evented properties.  When a property changes, an event is fired.  This allows you to respond to changes in data as they occur.

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

If you wanted to add an event listener to a nested member, simply call the `$.on` method on the desired child. For example:
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
###### Monitoring All Properties For Change
###### Manually Triggering Events
###### Removing Events
###### Arrays In Models
###### Async Disposal

### Future Features
###### Managing Collections
###### On-The-Fly Additions/Removals
