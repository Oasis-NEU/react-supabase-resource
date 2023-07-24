import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function App() {
  const [name, setName] = useState(""); // Initialized as an empty string.
  const [price, setPrice] = useState(0.0); // Initialized as 0.0.
  const [groceries, setGroceries] = useState([]); // Initialized as an empty array.

  useEffect(() => {
    getGroceries();
  }, []); // "[]" signifies that this hook will only be run on the first page load

  async function getGroceries() {
    try {
      const { data, error } = await supabase // Destructure the Supabase call
        .from("Groceries") // From the "Groceries" table
        .select("*"); // Select (fetch) everything
      if (error) throw error; // If there is an error, throw it
      if (data != null) {
        // If there is data fetched
        setGroceries(data); // Set our groceries state variable to the data
      }
    } catch (error) {
      alert(error); // If an error is caught, alert it on the client
    }
  }

  async function deleteGrocery(id) {
    try {
      const { data, error } = await supabase // Destructure the Supabase call
        .from("Groceries") // From our "Groceries" table
        .delete() // Delete
        .match({ id: id }); // The item that has the same id as the inputted id
      if (error) throw error; // If there's an error, throw it
      window.location.reload(); // Reload the window when finished
    } catch (error) {
      alert(error); // If there is an error, alert it on the window.
    }
  }

  async function addGrocery(name, price) {
    try {
      const { data, error } = await supabase // Destructuring our Supabase call
        .from("Groceries") // Get our "Groceries" table
        .insert({ name: name, price: price }) // Insert passed in name and price as a row
        .single(); // Only insert it once
      if (error) throw error; // If there is an error, throw it
      window.location.reload(); // Load the window once complete
    } catch (error) {
      alert(error); // If an error is caught, alert it on screen
    }
  }

  return (
    <>
      <h1>Grocery List</h1>
      {/* 
			Input field to enter the grocery name. On event change, we change the name state
			variable to what is typed into the text field using the setName() state function.
			*/}
      <label>Name</label>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      {/* 
			Input field to enter the grocery price. On event change, we change the price state
			variable to what is typed into the text field using the setPrice() state function.
			*/}
      <label>Price</label>
      <input type="number" onChange={(e) => setPrice(e.target.value)} />
      {/*
			Button, when clicked executes the postGrocery() function with the name and price
			state variables.
			*/}
      <button onClick={() => addGrocery(name, price)}>Add Grocery</button>

      <ul>
        {/* Nesting the map within a <ul> so our data is in the form of a list */}
        {groceries &&
          groceries.map((grocery) => (
            <li key={grocery.id}>
              {/* For each grocery, create an <li> element */}
              {grocery.name} - ${grocery.price} {/* Display the grocery info */}
              {/* A delete button next to each grocery item */}
              <button
                onClick={() => {
                  deleteGrocery(grocery.id); // On the button click, execute the deleteGrocery() function
                }}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </>
  );
}

export default App;
