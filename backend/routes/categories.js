const express = require('express');
const router = express.Router();

const Category = require('../models/Category');


// Get all Category
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get Category by id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// create new category
router.post('/', async (req, res) => {
    const category = new Category({
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,
    });
    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

// update Category
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "category not found" });
        }
        category.name = req.body.name || category.name;
        category.slug = req.body.slug || category.slug;
        category.description = req.body.description || category.description;
        category.updatedAt = Date.now();
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

// delete Category
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "category not found" });
        }
        await Category.findByIdAndDelete(category.id);
        res.json({ message: 'category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;