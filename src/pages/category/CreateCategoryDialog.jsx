import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

const CreateCategoryDialog = ({ open, onClose, onCategoryCreated, category = null, isEditMode = false }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Load category data into form if in edit mode
  useEffect(() => {
    if (isEditMode && category) {
      setName(category.name);
      setDescription(category.description);
    } else {
      // Reset form for create mode
      setName('');
      setDescription('');
    }
  }, [category, isEditMode]);

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        // Edit mode: Call update API
        await axios.post('https://devaseva.onrender.com/category/update', {
          _id: category._id, // Pass the category ID for updating
          name,
          description,
        });
      } else {
        // Create mode: Call create API
        await axios.post('https://devaseva.onrender.com/category/add', { name, description });
      }

      onCategoryCreated(); // Callback to refresh categories list
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Error creating/updating category:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditMode ? "Edit Category" : "Create New Category"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {isEditMode ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCategoryDialog;
