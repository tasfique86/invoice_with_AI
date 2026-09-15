const { GoogleGenAI } = require("@google/genai");
const Invoice = require("../models/Invoice");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }
  try {
    const prompt = `You are an invoice data extraction Ai, Anlyze the following text and extract the relevant information to create an invoice. 
        The output MUST be a valid JSON object.
        
        The JSON object should have the following structure:
        {
         "clientName": string,
         "email": "string (if available)",
         "address": "string (if available)",
         "items": [
            {
                "name": string,
                "quantity": number,
                "unitPrice": number,
            }
         ]  
        }

        Here is the text to parse:
        ---- TEXT START ----
        ${text}
        ---- TEXT END ----

        Extract the data and provide only the JSON object.
        `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const responseText = response.text;
    console.log("AI raw response:", responseText);

    if (typeof responseText !== "string") {
      if (typeof response.text === "function") {
        responseText = response.text();
      } else {
        throw new Error("Unexpected response format from AI");
      }
    }

    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedData = JSON.parse(cleanedJson);

    res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error("Error parsing invoice:", error);
    res
      .status(500)
      .json({ message: "Error parsing invoice", error: error.message });
  }
};

module.exports = { parseInvoiceFromText };

const generateReminderEmail = async (req, res) => {
  const { invoiceId } = req.body;

  if (!invoiceId) {
    return res.status(400).json({ message: "Invoice ID is required" });
  }
  try {
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const prompt = `You are a professional and polite accounting assistant. Write a friendly reminder email to client about an overdue  or upcoing invoice payment .
    
    Use the following details to personlize the email:

    -Client Name: ${invoice.billTo.clientName}
    -Invoice Number: ${invoice.invoiceNumber}
    -amount Due : $${invoice.total.toFixed(2)}
    -Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

    The tone should be frinedly but clear. Keep it concise. Start the email with "Subject:"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });
    res.status(200).json({
      reminderText: response.text,
    });
  } catch (error) {
    console.error("Error generating reminder:", error);
    res
      .status(500)
      .json({ message: "Error generating reminder", error: error.message });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });
    if (invoices.length === 0) {
      return res.status(200).json({
        insights: ["No invoice data available to generate insights"],
      });
    }
    //process and sumarize data

    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((inv) => inv.status === "Paid");
    const unpaidInvoices = invoices.filter((inv) => inv.status !== "Paid");
    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.total, 0);
    const totalOutstanding = unpaidInvoices.reduce(
      (acc, inv) => acc + inv.total,
      0,
    );

    const dataSummary = `
    - Total Number of Invoices : ${totalInvoices}
    - Total Paid Invoices: ${paidInvoices.length}
    - Total Unpaid/pending Invoices: ${unpaidInvoices.length}
    - Total Revenue from paid invoices: $${totalRevenue.toFixed(2)}
    - Total Outstanding amount from unpaid/pending invoices: $${totalOutstanding.toFixed(2)}
    - Recent invoices (last 5 ) : ${invoices
      .slice(0, 5)
      .map(
        (inv) =>
          `Invoice #${inv.invoiceNumber} for ${inv.total.toFixed(2)} with status ${inv.status}`,
      )
      .join(" ")}
    `;

    const prompt = `
    You are a friendly and insightful finacila analyst for a small business owner.
    Based on the following summary of their invoice data, provide 2-3 concise and actionable insights.
    Each insight should be a short string in a JSON array.
    The insights should be an encouraging and helpful. Don't just repeat the data.
    For example, if there is a high outstanding amount, suggest sending reminders. if revenue is high, be encouraging  .

    
    Summary:
    ${dataSummary}

    Return your response as a valid JSON object with a single key "insights" which is an array of strings.

    Example:
    {
        "insights": [
            "Your revenue is looking strong this month!", "You have 5 overdue invoices. Consider sending reminder to get paid fast"
        ]
    }
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const responseText = response.text;

    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedData = JSON.parse(cleanedJson);

    res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    res
      .status(500)
      .json({ message: "Error generating summary", error: error.message });
  }
};

module.exports = {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
};
