const Invoice = require("../models/Invoice");

//@desc Create new invoice
//@route POST /api/invoices
//@access Private

exports.createInvoice = async (req, res) => {
  try {
    const user = req.user;

    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
    } = req.body;

    let subTotal = 0;
    let taxTotal = 0;
    items.forEach((item) => {
      const itemTotal = item.unitPrice * item.quantity;
      subTotal += itemTotal;
      taxTotal += (itemTotal * (item.taxPercent || 0)) / 100;
    });

    const total = subTotal + taxTotal;

    const invoice = await Invoice.create({
      user,
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      subTotal,
      taxTotal,
      total,
    });

    await invoice.save();

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//@desc Get all invoices of logged in user
//@route GET /api/invoices
//@access Private

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("user", "name email");
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//@desc Get invoice by ID
//@route GET /api/invoices/:id
//@access Private

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//@desc Update invoice
//@route PUT /api/invoices/:id
//@access Private

exports.updateInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      status,
    } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    let subTotal = 0;
    let taxTotal = 0;
    items.forEach((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      subTotal += itemTotal;
      taxTotal += (itemTotal * (item.taxPercent || 0)) / 100;
    });

    const total = subTotal + taxTotal;

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        invoiceNumber,
        invoiceDate,
        dueDate,
        billFrom,
        billTo,
        items,
        notes,
        paymentTerms,
        status,
        subTotal,
        taxTotal,
        total,
      },
      { new: true },
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//@desc Delete invoice
//@route DELETE /api/invoices/:id
//@access Private

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
