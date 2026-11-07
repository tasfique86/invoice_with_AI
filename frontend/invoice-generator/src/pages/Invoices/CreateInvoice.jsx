import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from "../../context/AuthContext";

import InputField from "../../components/ui/InputField";
import TextAreaField from "../../components/ui/TextAreaField";
import Button from "../../components/ui/Button";

const CreateInvoice = ({ existingInvoice, onSave } = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const invoiceToEdit = existingInvoice ?? location.state?.existingInvoice ?? null;

  const defaultItem = {
    name: "",
    quantity: 1,
    unitPrice: 0,
    taxPercent: 0,
  };

  const [formData, setFormData] = useState(() => ({
    invoiceNumber: invoiceToEdit?.invoiceNumber || "",
    invoiceData: invoiceToEdit?.invoiceData
      ? moment(invoiceToEdit.invoiceData).format("YYYY-MM-DD")
      : new Date().toISOString().split("T")[0],
    dueDate: invoiceToEdit?.dueDate
      ? moment(invoiceToEdit.dueDate).format("YYYY-MM-DD")
      : "",
    billFrom: {
      businessName: user?.businessName || invoiceToEdit?.billFrom?.businessName || "",
      email: user?.email || invoiceToEdit?.billFrom?.email || "",
      address: user?.address || invoiceToEdit?.billFrom?.address || "",
      phone: user?.phone || invoiceToEdit?.billFrom?.phone || "",
    },
    billTo: {
      clientName: invoiceToEdit?.billTo?.clientName || "",
      email: invoiceToEdit?.billTo?.email || "",
      address: invoiceToEdit?.billTo?.address || "",
      phone: invoiceToEdit?.billTo?.phone || "",
    },
    items: invoiceToEdit?.items?.length ? invoiceToEdit.items : [defaultItem],
    notes: invoiceToEdit?.notes || "",
    paymentTerms: invoiceToEdit?.paymentTerms || "Net 15",
  }));

  const [loading, setLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(!invoiceToEdit);

  useEffect(() => {
    const aiData = location.state?.aiData;

    if (aiData) {
      setFormData((prev) => ({
        ...prev,
        billTo: {
          clientName: aiData.clientName || "",
          email: aiData.email || "",
          address: aiData.address || "",
          phone: "",
        },
        items: aiData.items?.length ? aiData.items : [defaultItem],
      }));
    }

    if (invoiceToEdit) {
      setFormData({
        ...invoiceToEdit,
        invoiceData: moment(invoiceToEdit.invoiceData).format("YYYY-MM-DD"),
        dueDate: invoiceToEdit.dueDate
          ? moment(invoiceToEdit.dueDate).format("YYYY-MM-DD")
          : "",
        billFrom: {
          businessName: invoiceToEdit.billFrom?.businessName || user?.businessName || "",
          email: invoiceToEdit.billFrom?.email || user?.email || "",
          address: invoiceToEdit.billFrom?.address || user?.address || "",
          phone: invoiceToEdit.billFrom?.phone || user?.phone || "",
        },
        billTo: {
          clientName: invoiceToEdit.billTo?.clientName || "",
          email: invoiceToEdit.billTo?.email || "",
          address: invoiceToEdit.billTo?.address || "",
          phone: invoiceToEdit.billTo?.phone || "",
        },
        items: invoiceToEdit.items?.length ? invoiceToEdit.items : [defaultItem],
      });
      setIsGeneratingNumber(false);
      return;
    }

    const generateNewInvoiceNumber = async () => {
      setIsGeneratingNumber(true);
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL);
        const invoices = response?.data || [];
        let maxNum = 0;

        invoices.forEach((inv) => {
          const num = Number.parseInt(inv.invoiceNumber?.split("-")[1] || "0", 10);
          if (!Number.isNaN(num) && num > maxNum) maxNum = num;
        });

        const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;
        setFormData((prev) => ({ ...prev, invoiceNumber: newInvoiceNumber }));
      } catch (error) {
        console.error("Failed to generate invoice number", error);
        setFormData((prev) => ({
          ...prev,
          invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
        }));
      } finally {
        setIsGeneratingNumber(false);
      }
    };

    generateNewInvoiceNumber();
  }, [invoiceToEdit, user, location.state]);

  const handleInputChange = (e, section = null, index = null) => {
    const { name, value } = e.target;

    if (section === "billFrom" || section === "billTo") {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
      return;
    }

    if (section === "items" && index !== null) {
      setFormData((prev) => {
        const updatedItems = prev.items.map((item, i) =>
          i === index ? { ...item, [name]: value } : item,
        );
        return { ...prev, items: updatedItems };
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...defaultItem }],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => {
      if (prev.items.length <= 1) return prev;
      return {
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      };
    });
  };

  const subtotal = formData.items.reduce((sum, item) => {
    return sum + Number(item.quantity || 0) * Number(item.unitPrice || 0);
  }, 0);

  const taxTotal = formData.items.reduce((sum, item) => {
    const itemTotal = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    return sum + itemTotal * ((Number(item.taxPercent || 0) / 100) || 0);
  }, 0);

  const total = subtotal + taxTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (onSave) {
        await onSave(formData);
      } else {
        toast.success("Invoice saved successfully");
        navigate("/invoices");
      }
    } catch (error) {
      toast.error("Something went wrong while saving the invoice");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">
          {invoiceToEdit ? "Edit Invoice" : "Create Invoice"}
        </h2>
        <Button type="submit" isLoading={loading || isGeneratingNumber}>
          {invoiceToEdit ? "Save Changes" : "Save Invoice"}
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Invoice Number"
            name="invoiceNumber"
            readOnly
            value={formData.invoiceNumber}
            placeholder={isGeneratingNumber ? "Generating..." : ""}
          />
          <InputField
            label="Invoice Date"
            type="date"
            name="invoiceData"
            value={formData.invoiceData}
            onChange={handleInputChange}
          />
          <InputField
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Bill From</h3>
          <InputField
            label="Business Name"
            name="businessName"
            value={formData.billFrom.businessName}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.billFrom.email}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <TextAreaField
            label="Address"
            name="address"
            value={formData.billFrom.address}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <InputField
            label="Phone"
            name="phone"
            value={formData.billFrom.phone}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Bill To</h3>
          <InputField
            label="Client Name"
            name="clientName"
            value={formData.billTo.clientName}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
          <InputField
            label="Client Email"
            type="email"
            name="email"
            value={formData.billTo.email}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
          <TextAreaField
            label="Client Address"
            name="address"
            value={formData.billTo.address}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
          <InputField
            label="Client Phone"
            name="phone"
            value={formData.billTo.phone}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Items</h3>
          <Button type="button" variant="outline" onClick={handleAddItem}>
            Add Item
          </Button>
        </div>

        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <InputField
              label="Item Name"
              name="name"
              value={item.name}
              onChange={(e) => handleInputChange(e, "items", index)}
            />
            <InputField
              label="Qty"
              type="number"
              min="1"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, "items", index)}
            />
            <InputField
              label="Unit Price"
              type="number"
              min="0"
              step="0.01"
              name="unitPrice"
              value={item.unitPrice}
              onChange={(e) => handleInputChange(e, "items", index)}
            />
            <InputField
              label="Tax %"
              type="number"
              min="0"
              step="0.01"
              name="taxPercent"
              value={item.taxPercent}
              onChange={(e) => handleInputChange(e, "items", index)}
            />
            <Button type="button" variant="ghost" onClick={() => handleRemoveItem(index)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm shadow-gray-100 border border-slate-200">
        <div className="flex justify-between text-slate-700 mb-2">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-700 mb-2">
          <span>Tax</span>
          <span>${taxTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold text-slate-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </form>
  );
};

export default CreateInvoice;
