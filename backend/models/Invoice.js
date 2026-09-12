const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  taxPercent: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    billFrom: {
      busniessName: String,
      email: String,
      address: String,
      phone: String,
    },
    billTo: {
      clientName: String,
      email: String,
      address: String,
      phone: String,
    },
    items: [itemSchema],
    notes: {
      type: String,
    },
    paymentTerms: {
      type: String,
      default: "Net 15",
    },
    subTotal: Number,
    taxTotal: Number,
    total: Number,
    status: {
      type: String,
      enum: ["Draft", "Sent", "Paid", "Unpaid", "Overdue", "Cancelled"],
      default: "Unpaid",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invoice", invoiceSchema);
