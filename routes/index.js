const express = require("express");
const router = express.Router();
const db = require("../db");
const { ObjectId } = require('mongodb');
let completed = false;

// Get All Todos
router.get("/todos", async (req, res) => {
    try {
        const result = await db.query('todos', {});
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error (app.get)" });
    }
});

// Add Todo
router.route("/todos").post(async (req, res) => {
    const { description } = req.body;
  
    try {
        const result = await db.insert('todos', { description, completed: false });
        const newTodo = await db.query('todos', { _id: result.insertedId });
        res.json(newTodo[0]); 
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server Error Add Todo" });
    }
});

// Delete Todo
router.route("/todos/:id").delete(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await db.delete('todos', { _id: new ObjectId(id) });
        res.json("Todo Deleted Successfully!");
    } catch (err) {
        console.log("Error deleting todo:", err);
        res.status(500).json({ message: "Server Error Delete Todo" });
    }
});
// delete selected todos
router.route("/todos").delete(async (req, res) => {
    const { ids } = req.body;
    try {
        const objectIds = ids.map(id => new ObjectId(id)); 
        console.log("Deleting IDs:", objectIds); // Konsol çıktısı ekleyerek kontrol edin
        const deleteResult = await db.delete('todos', { _id: { $in: objectIds } });
        if (!deleteResult.acknowledged) {
            throw new Error("Deletion not acknowledged by database");
        }
        res.json("Todos Deleted Successfully!");
    } catch (err) {
        console.log("Error deleting todos:", err);
        res.status(500).json({ message: "Server Error Delete Multiple Todos", error: err.message });
    }
});
// Update Todo
router.route("/todos/:id").put(async (req, res) => {
    const { id } = req.params;
    const { description, completed } = req.body; 
    try {
        const updateResult = await db.update(
            'todos',
            { _id: new ObjectId(id) },
            { $set: { description, completed, updatedAt: new Date() } }
        );
        const updatedTodo = await db.query('todos', { _id: new ObjectId(id) });
        res.json(updatedTodo[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error Update Todo" });
    }
});

module.exports = router;