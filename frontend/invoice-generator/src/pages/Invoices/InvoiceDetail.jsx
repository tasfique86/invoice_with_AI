import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import {
  Loader2,
  Trash2,
  Mail,
  Printer,
  AlertCircle,
  ArrowLeft,
  Edit,
} from "lucide-react";
import CreateInvoice from "./CreateInvoice";
import Button from "../../components/ui/Button";
import ReminderModal from "../../components/invoices/ReminderModal";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_INVOICE_BY_ID(id),
        );
        setInvoice(response.data);
      } catch (error) {
        toast.error("Failed to fetch invoice");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.INVOICE.UPDATE_INVOICE(id),
        formData,
      );
      setInvoice(response.data);
      setIsEditing(false);
      toast.success("Invoice updated successfully");
    } catch (error) {
      toast.error("Failed to update invoice");
      console.error(error);
    }
  };

  const handleStatusChange = async () => {
    if (!invoice) return;
    setStatusLoading(true);
    try {
      const newStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";
      const updatedInvoice = { ...invoice, status: newStatus };
      const response = await axiosInstance.put(
        API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id),
        updatedInvoice,
      );
      setInvoice(response.data);
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
        toast.success("Invoice deleted successfully");
        navigate("/invoices");
      } catch (error) {
        toast.error("Failed to delete invoice");
        console.error(error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Invoice Not Found
        </h3>
        <p className="text-slate-500 mb-6 max-w-md">
          The invoice you are looking for does not exist or could not be loaded.
        </p>

        <Button onClick={() => navigate("/invoices")}>
          Back to All Invoices
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="small"
            icon={ArrowLeft}
            onClick={() => setIsEditing(false)}
          >
            Cancel & Back to Details
          </Button>
        </div>
        <CreateInvoice existingInvoice={invoice} onSave={handleUpdate} />
      </div>
    );
  }

  // return (
  //   <div className="space-y-6 max-w-5xl mx-auto pb-16">
  //     <ReminderModal
  //       isOpen={isReminderModalOpen}
  //       onClose={() => setIsReminderModalOpen(false)}
  //       invoiceId={invoice._id || id}
  //     />

  //     {/* Top Action Bar (hidden when printing) */}
  //     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
  //       <div className="flex items-center gap-3">
  //         <Button
  //           variant="secondary"
  //           size="small"
  //           icon={ArrowLeft}
  //           onClick={() => navigate("/invoices")}
  //         >
  //           Back
  //         </Button>
  //         <span
  //           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
  //             invoice.status === "Paid"
  //               ? "bg-emerald-100 text-emerald-800"
  //               : invoice.status === "Pending"
  //                 ? "bg-amber-100 text-amber-800"
  //                 : "bg-red-100 text-red-800"
  //           }`}
  //         >
  //           {invoice.status}
  //         </span>
  //       </div>

  //       <div className="flex flex-wrap items-center gap-2">
  //         <Button
  //           variant="secondary"
  //           size="small"
  //           onClick={handleStatusChange}
  //           isLoading={statusLoading}
  //         >
  //           {invoice.status === "Paid" ? "Mark Unpaid" : "Mark Paid"}
  //         </Button>

  //         <Button
  //           variant="secondary"
  //           size="small"
  //           icon={Edit}
  //           onClick={() => setIsEditing(true)}
  //         >
  //           Edit
  //         </Button>

  //         {invoice.status !== "Paid" && (
  //           <Button
  //             variant="secondary"
  //             size="small"
  //             icon={Mail}
  //             onClick={() => setIsReminderModalOpen(true)}
  //           >
  //             Reminder
  //           </Button>
  //         )}

  //         <Button
  //           variant="secondary"
  //           size="small"
  //           icon={Printer}
  //           onClick={handlePrint}
  //         >
  //           Print
  //         </Button>

  //         <Button
  //           variant="ghost"
  //           size="small"
  //           className="text-red-600 hover:bg-red-50 hover:text-red-700"
  //           icon={Trash2}
  //           onClick={handleDelete}
  //         >
  //           Delete
  //         </Button>
  //       </div>
  //     </div>

  //     {/* Printable Invoice Sheet */}
  //     <div
  //       ref={invoiceRef}
  //       className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-10 md:p-12 print:border-none print:shadow-none print:p-0"
  //     >
  //       {/* Top Header Row: Sender Details & Invoice Title */}
  //       <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
  //         <div>
  //           <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
  //             From
  //           </span>
  //           <h1 className="text-2xl font-bold text-slate-900 mt-1">
  //             {invoice.billFrom?.businessName || "My Business"}
  //           </h1>
  //           {invoice.billFrom?.email && (
  //             <p className="text-sm text-slate-600 mt-1">
  //               {invoice.billFrom.email}
  //             </p>
  //           )}
  //           {invoice.billFrom?.phone && (
  //             <p className="text-sm text-slate-600">{invoice.billFrom.phone}</p>
  //           )}
  //           {invoice.billFrom?.address && (
  //             <p className="text-sm text-slate-600 whitespace-pre-line mt-1">
  //               {invoice.billFrom.address}
  //             </p>
  //           )}
  //         </div>

  //         <div className="sm:text-right">
  //           <span className="inline-block px-3 py-1 bg-blue-50 text-blue-900 font-bold rounded text-xs tracking-wider mb-2">
  //             INVOICE
  //           </span>
  //           <p className="text-xl font-bold text-slate-900">
  //             #{invoice.invoiceNumber}
  //           </p>
  //           <div className="text-sm text-slate-600 mt-3 space-y-1">
  //             <p>
  //               <span className="font-medium text-slate-700">Date: </span>
  //               {moment(invoice.invoiceDate).format("MMM D, YYYY")}
  //             </p>
  //             <p>
  //               <span className="font-medium text-slate-700">Due Date: </span>
  //               {moment(invoice.dueDate).format("MMM D, YYYY")}
  //             </p>
  //             {invoice.paymentTerms && (
  //               <p>
  //                 <span className="font-medium text-slate-700">Terms: </span>
  //                 {invoice.paymentTerms}
  //               </p>
  //             )}
  //           </div>
  //         </div>
  //       </div>

  //       {/* Bill To Section */}
  //       <div className="py-6 border-b border-slate-200">
  //         <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
  //           Billed To
  //         </span>
  //         <h2 className="text-lg font-bold text-slate-900 mt-1">
  //           {invoice.billTo?.clientName}
  //         </h2>
  //         {invoice.billTo?.email && (
  //           <p className="text-sm text-slate-600 mt-1">
  //             {invoice.billTo.email}
  //           </p>
  //         )}
  //         {invoice.billTo?.phone && (
  //           <p className="text-sm text-slate-600">{invoice.billTo.phone}</p>
  //         )}
  //         {invoice.billTo?.address && (
  //           <p className="text-sm text-slate-600 whitespace-pre-line mt-1">
  //             {invoice.billTo.address}
  //           </p>
  //         )}
  //       </div>

  //       {/* Line Items Table */}
  //       <div className="py-6 overflow-x-auto">
  //         <table className="w-full text-left border-collapse">
  //           <thead>
  //             <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
  //               <th className="py-3 pr-4">Description</th>
  //               <th className="py-3 px-4 text-center">Qty</th>
  //               <th className="py-3 px-4 text-right">Unit Price</th>
  //               <th className="py-3 px-4 text-right">Tax (%)</th>
  //               <th className="py-3 pl-4 text-right">Amount</th>
  //             </tr>
  //           </thead>
  //           <tbody className="divide-y divide-slate-100 text-sm">
  //             {invoice.items?.map((item, index) => {
  //               const itemTotal =
  //                 item.total ??
  //                 item.quantity *
  //                   item.unitPrice *
  //                   (1 + (item.taxPercent || 0) / 100);
  //               return (
  //                 <tr key={index} className="text-slate-700">
  //                   <td className="py-4 pr-4 font-medium text-slate-900">
  //                     {item.name}
  //                   </td>
  //                   <td className="py-4 px-4 text-center">{item.quantity}</td>
  //                   <td className="py-4 px-4 text-right">
  //                     ${Number(item.unitPrice || 0).toFixed(2)}
  //                   </td>
  //                   <td className="py-4 px-4 text-right">
  //                     {item.taxPercent || 0}%
  //                   </td>
  //                   <td className="py-4 pl-4 text-right font-semibold text-slate-900">
  //                     ${Number(itemTotal).toFixed(2)}
  //                   </td>
  //                 </tr>
  //               );
  //             })}
  //           </tbody>
  //         </table>
  //       </div>

  //       {/* Notes & Summary Section */}
  //       <div className="flex flex-col md:flex-row justify-between items-start pt-6 border-t border-slate-200 gap-6">
  //         <div className="w-full md:w-1/2">
  //           {invoice.notes && (
  //             <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
  //               <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
  //                 Notes & Terms
  //               </h3>
  //               <p className="text-sm text-slate-600 whitespace-pre-line">
  //                 {invoice.notes}
  //               </p>
  //             </div>
  //           )}
  //         </div>

  //         <div className="w-full md:w-5/12 space-y-2">
  //           <div className="flex justify-between text-sm text-slate-600">
  //             <span>Subtotal</span>
  //             <span className="font-medium text-slate-900">
  //               ${Number(invoice.subTotal || 0).toFixed(2)}
  //             </span>
  //           </div>
  //           <div className="flex justify-between text-sm text-slate-600">
  //             <span>Tax Total</span>
  //             <span className="font-medium text-slate-900">
  //               ${Number(invoice.taxTotal || 0).toFixed(2)}
  //             </span>
  //           </div>
  //           <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-3 mt-2">
  //             <span>Total Due</span>
  //             <span className="text-blue-900 text-xl font-bold">
  //               ${Number(invoice.total || 0).toFixed(2)}
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <>
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoiceId={id}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4 sm:mb-0">
          Invoice{" "}
          <span className="text-mono text-slate-500">
            {invoice.invoiceNumber}
          </span>
        </h1>
        <div className="flex gap-2 items-center">
          {invoice.status !== "Paid" && (
            <Button
              variant="secondary"
              onClick={() => setIsReminderModalOpen(true)}
              icon={Mail}
            >
              Generate Reminder
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => setIsEditing(true)}
            icon={Edit}
          >
            Edit
          </Button>
          <Button variant="primary" onClick={handlePrint} icon={Printer}>
            Print or Download
          </Button>
        </div>
      </div>

      <div id="invoice-content-wrapper">
        <div
          ref={invoiceRef}
          id="invoice-preview"
          className="bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-md border border-slate-200 pb-[100vh]"
        >
          <div className="flex- flex-col sm:flex-row justify-between items-start pb-8 border-b border-slate-200">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">INVOICE</h2>
              <p className="text-sm text-slate-500 mt-2">
                # {invoice.invoiceNumber}
              </p>
            </div>

            <div className="text-left sm:text-right mt-4 sm:mt-0">
              <p className="text-sm text-slate-500">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  invoice.status === "Paid"
                    ? "bg-emerald-100 text-800"
                    : invoice.status === "Pending"
                      ? "bg-amber-100 text-amber-800"
                      : invoice.status === "Partial"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                } `}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Bill From
              </h3>
              <p className=" font-semibold text-slate-800">
                {invoice.billFrom.businessName}
              </p>
              <p className=" text-slate-600">{invoice.billFrom.address}</p>
              <p className=" text-slate-600">{invoice.billFrom.email}</p>
              <p className=" text-slate-600">{invoice.billFrom.phone}</p>
            </div>

            <div className="sm:text-right">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Bill To
              </h3>
              <p className="font-semibold text-slate-800">
                {invoice.billTo.clientName}
              </p>
              <p className="text-slate-600">{invoice.billTo.address}</p>
              <p className="text-slate-600">{invoice.billTo.email}</p>
              <p className="text-slate-600">{invoice.billTo.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Invoice Date
              </h3>
              <p className="font-medium text-slate-600">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Due Date
              </h3>
              <p className="font-medium text-slate-600">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Payment Terms
              </h3>
              <p className="font-medium text-slate-600">
                {invoice.paymentTerms}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden ">
            <table className="w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-slate-200 divide-y">
                {invoice.items?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="px-4 py-4 sm:px-6 text-sm font-medium text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-4 sm:px-6 text-center  font-medium text-slate-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 sm:px-6 text-right  font-medium text-slate-900">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 sm:px-6 text-right font-medium text-slate-900">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetail;
