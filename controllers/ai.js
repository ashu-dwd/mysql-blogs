require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
console.log("API Key:", process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateSummary = async (req, res) => {
  try {
    const prompt = `${req.body.content}. Please provide a  summary of the blog/article in HTML format, adhering to the following requirements:
Do not include <head> or <body> tags.
Use <div> and <p>  elements or ul-li or whatever you want for structure.
Incorporate Bootstrap classes for styling.
Omit the 'html' text from the start and any template literals.
The summary should consist of approximately one-third of the total word count of the original content.
Highlight important points by wrapping them in a span element with a Bootstrap class that sets the text color to orange (e.g., text-warning).
Ensure that the summary is clear and concise, effectively conveying the main ideas and key points of the article. `;

    // Set headers to indicate streaming response
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Transfer-Encoding", "chunked");

    // Use the generateContentStream method to get a continuous response
    const result = await model.generateContentStream(prompt);

    //console.log("Starting content streaming...");

    // Stream content to the client as it is generated
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      ///console.log("Streaming chunk:", chunkText);
      res.write(chunkText); // Continuously send the content to the client
    }

    res.end(); // Finish the response once all content is streamed
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).write("An error occurred while streaming text.");
    res.end();
  }
};

const generateBlogContent = async (req, res) => {
  console.log(req.body);
  try {
    //console.log(req.body);
    const prompt = `You are a talented blog writer known for your unique and engaging writing style, often using emojis and concise language to make complex ideas simple to understand. Now, write a blog post with the title ${req.body.title} and a description of ${req.body.description}.If no description is provided, write the blog based solely on the title while ensuring it remains relevant and engaging. Your tone should be professional but relatable to a 20 to 50-year-old audience. Use clear, vibrant language, and include real-life examples, anecdotes, or metaphors where appropriate. Use emojis where suitable to enhance readability and add personality to your writing. Make sure your content is in html language and informative, captivating, and delivers value while keeping it concise and well-structured.Remember to remove head body and html tags from the output.Dont add css. YOu can also use strong tags or other tags for better output. YOu can also use tables for data display . even i said more focus on the visualising data. u can use tables lists headings and paragraphs and more for visualisation. You can use span tags for highlighting words in different colors.  `;

    // Set headers to indicate streaming response
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Transfer-Encoding", "chunked");

    // Use the generateContentStream method to get a continuous response
    const result = await model.generateContentStream(prompt);
    // console.log(prompt);
    // console.log("Starting content streaming...");

    // Stream content to the client as it is generated
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      //.log("Streaming chunk:", chunkText);
      res.write(chunkText); // Continuously send the content to the client
    }

    res.end(); // Finish the response once all content is streamed
  } catch (error) {
    console.error("Error generating Blog:", error);
    res.status(500).write("An error occurred while streaming Blog.");
    res.end();
  }
};

module.exports = {
  generateSummary,
  generateBlogContent,
};
