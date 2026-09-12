const express = require("express");

const {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
} = require("../controllers/invoiceController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createInvoice).get(protect, getInvoices);

router
  .route("/:id")
  .get(protect, getInvoiceById)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

module.exports = router;
