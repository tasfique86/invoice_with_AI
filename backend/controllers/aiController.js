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
  const { invoiceId } = req.params;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const prompt = `Generate a professional reminder email for an unpaid invoice.

Invoice Number: ${invoice.invoiceNumber}
Client: ${invoice.billTo.clientName}
Invoice Date: ${invoice.invoiceDate}
Due Date: ${invoice.dueDate}
Total Amount: $${invoice.total}
Status: ${invoice.status}

Please write a polite but firm reminder email.`;

    const result = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
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
