// N.B:
// A: Dealing with arrow functions make you able to access the global object and to bind the next object to the current (this) keyword
// B: Dealing with ordinary functions make you able to access the object that contains the method
// C: The (this) keyword refers to the object that is calling the method
const person = {
  name: "Abd El-Rahman",
  hobbies: ["Programming", "Reading"],
  age: 20,
  greet() {
    // Here we are using (this) keyword to access the object that contains the method
    console.log("Hello, I am " + this.name);
  },
};
// const person = {
//   name: "Abd El-Rahman",
//   hobbies: ["Programming", "Reading"],
//   age: 20,
//   greet: ()=> {
// -This keyword refers to the global object-
//      // Here we are using this keyword to access the object that contains the method
//     console.log("Hello, I am " + this.name);
//   },
// };

person.greet();
