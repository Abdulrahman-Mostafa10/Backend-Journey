var firstName = " Abd El-Rahman";
var lastName = firstName;
console.log(lastName); // Abd El-Rahman

firstName = "Mohamed";
console.log(lastName); // Abd El-Rahman

var person = {
  name: "Abd El-Rahman",
  hobbies: ["Programming", "Reading"],
  age: 20,
};

var secondPerson = person;
console.log(person);
console.log(secondPerson);

person.name = "Mohamed";
console.log(secondPerson);

// for copying objects we can use the spread operator or the Object.assign() method
var thirdPersonHobbies = [...person.hobbies];
person.hobbies.push("Running");
console.log(person.hobbies);
console.log(thirdPersonHobbies);

var fourthPersonHobbies = Object.assign(thirdPersonHobbies, [
  "Gym",
  "Swimming",
]);
console.log(fourthPersonHobbies);
console.log(thirdPersonHobbies);

var fifthPersonHobbies = person.hobbies.slice();
console.log(fifthPersonHobbies);
