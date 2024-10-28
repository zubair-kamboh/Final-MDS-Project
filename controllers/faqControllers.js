const asyncHandler = require("express-async-handler")
const FAQModel = require('../models/FAQModel')

// ADD FAQ
const addFAQ = asyncHandler(async (req, res) => {
    const { question, userId } = req.body;

    if (!question) {
      res.status(400);
      throw new Error('Please provide a question');
    }
  
    try {
      const faq = new FAQModel({ question, userId });
      const savedFaq = await faq.save();
      res.status(201).json(savedFaq);
    } catch (error) {
      res.status(500);
      throw new Error('Failed to save the FAQ');
    }
});

// Get ALL FAQ
const getAllFAQ = asyncHandler(async (req, res) => {
    try {
        const faqs = await FAQModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(faqs);
      } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch FAQs');
      }
});

// Route to upvote/downvote an FAQ answer
const upvoteDownVote = asyncHandler(async (req, res) => {
    const { voteType } = req.body;
    try {
      const faq = await FAQModel.findById(req.params.id);
  
      if (voteType === 'upvote') {
        faq.upvotes += 1;
      } else if (voteType === 'downvote') {
        faq.downvotes += 1;
      }
  
      const updatedFaq = await faq.save();
      res.status(200).json(updatedFaq);
    } catch (error) {
      res.status(500);
      throw new Error('Failed to update vote');
    }
});


  
module.exports = {
 upvoteDownVote,
 getAllFAQ,
 addFAQ
}