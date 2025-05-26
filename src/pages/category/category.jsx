import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import React Icons
import CreateCategoryDialog from './CreateCategoryDialog';
import axios from 'axios';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://devaseva.onrender.com/api/category/list');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(`https://devaseva.onrender.com/api/category/delete/${categoryToDelete._id}`);
      fetchCategories(); // Refresh the list of categories
      setDeleteConfirmOpen(false); // Close the confirmation dialog
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category); // Set the category to be edited
    setEditDialogOpen(true); // Open the edit dialog
  };

  const handleCategoryCreated = () => {
    fetchCategories(); // Refresh the list of categories
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openDeleteConfirmation = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true); // Open delete confirmation dialog
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div style={{ padding: '2vw' }}>
      <Typography variant="h4">Categories</Typography>
      <Button variant="contained" color="primary" className='!mt-2' onClick={() => setDialogOpen(true)}>
        Create Category
      </Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.categories?.length > 0 && categories?.categories?.map((category) => (
              <TableRow key={category?._id}>
                <TableCell>{category?.name}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleEdit(category)}>
                    <FaEdit />
                  </Button>
                  <Button onClick={() => openDeleteConfirmation(category)} style={{ marginLeft: 8 }}>
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Category Dialog */}
      <CreateCategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />

      {/* Edit Category Dialog */}
      <CreateCategoryDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onCategoryCreated={handleCategoryCreated}
        category={selectedCategory} // Pass the selected category for editing
        isEditMode={true} // Optional: flag to indicate edit mode
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirmation}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{categoryToDelete?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
