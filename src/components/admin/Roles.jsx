import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Chip } from "@mui/material";
import axios from "axios";
import { useDevice } from "../../context/DeviceContext";

const Roles = () => {
  const initialData = { name: "", description: "", status: 1 };
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);


  const { isMobile } = useDevice();
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/roles/getRoles`);
      setData(response.data.roles || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const openModal = (item = null) => {
    setFormData(item ? { ...item } : initialData);
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "status" ? Number(value) : value });
  };
  

  const handleSave = async () => {
    try {
      let response;
      if (editItem) {
        response = await axios.put(`${import.meta.env.VITE_API_URL}/api/roles/${editItem.id}`, formData);
        const updatedItem = response.data;
        setData((prev) =>
          prev.map((item) => (item.id === editItem.id ? { ...item, ...updatedItem } : item))
        );
        alertify.success("Updated successfully!");
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/api/roles/createRoles`, formData);
        const newItem = response.data?.role;
        if (!newItem || !newItem.id) {
          alertify.error("Something went wrong. Role not added.");
          return;
        }
        setData((prev) => [...prev, newItem]);
        alertify.success("Added successfully!");
      }
  
      setIsModalOpen(false);
      setFormData(initialData);
      setEditItem(null);
    } catch (error) {
      console.error("Error saving:", error);
      alertify.error("Error saving data.");
    }
  };
  
  

  const MobileTable = ({ data, openModal }) => (
    <div className="md:hidden mt-4 space-y-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-lg shadow-sm bg-white"
        >
          <div className="flex justify-between py-1 text-sm">
            <span className="font-semibold text-gray-500">Name:</span>
            <span>{item.name}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="font-semibold text-gray-500">Description:</span>
            <span>{item.description}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="font-semibold text-gray-500">Status:</span>
            <Chip
              label={
                item.status === 0
                  ? "Pending"
                  : item.status === 1
                  ? "Activated"
                  : "Deactivated"
              }
              sx={{
                backgroundColor:
                  item.status === 1
                    ? "#4CAF50"
                    : item.status === 2
                    ? "#F44336"
                    : "#FFC107",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </div>
          <div className="mt-3 text-right">
            <button
              onClick={() => openModal(item)}
              className="group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-3 font-medium text-blue-600 transition-all duration-100 [box-shadow:5px_5px_rgb(59_130_246)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(59_130_246)]"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  
  const DesktopTable = ({ data, openModal }) => (
    <div className="hidden md:block">
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.description}</td>
              <td className="p-2">
                <Chip
                  label={
                    item.status === 0
                      ? "Pending"
                      : item.status === 1
                      ? "Activated"
                      : "Deactivated"
                  }
                  sx={{
                    backgroundColor:
                      item.status === 1
                        ? "#4CAF50"
                        : item.status === 2
                        ? "#F44336"
                        : "#FFC107",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </td>
              <td className="p-2 flex space-x-2">
                <button
                  onClick={() => openModal(item)}
                  className="group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-3 font-medium text-blue-600 transition-all duration-100 [box-shadow:5px_5px_rgb(59_130_246)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(59_130_246)]"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-[100%] mx-auto overflow-x-auto">
      <button
        onClick={() => openModal()}
        className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]" 
      >
        Add Roles
      </button>
      

      {isMobile ? (
        <MobileTable data={data} openModal={openModal} />
      ) : (
        <DesktopTable data={data} openModal={openModal} />
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>{editItem ? `Update (ID: ${editItem.id})` : "Add New"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} margin="normal" multiline rows={3} />
          <TextField select fullWidth label="Status" name="status" value={formData.status} onChange={handleChange} margin="normal">
            <MenuItem value={0}>Pending</MenuItem>
            <MenuItem value={1}>Activated</MenuItem>
            <MenuItem value={2}>Deactivated</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
        <button
          onClick={() => setIsModalOpen(false)}
          className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-4 font-medium text-gray-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-4 font-medium text-green-600 transition-all duration-100 [box-shadow:5px_5px_rgb(34_197_94)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(34_197_94)]"
        >
          {editItem ? "Update" : "Save"}
        </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Roles;
