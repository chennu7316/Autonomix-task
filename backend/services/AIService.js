const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ActionItem } = require('../models');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generateActionItems(transcriptContent, transcriptId) {
    if (!process.env.GEMINI_API_KEY) {
      logger.warn('Gemini API key not configured. Skipping AI action item generation.');
      return [];
    }

    try {
      console.log('🤖 Calling Gemini API to generate action items...');
      
      const prompt = `
Analyze the following meeting transcript and extract actionable items. For each action item, provide:
1. A clear, specific title
2. A detailed description
3. The assignee (if mentioned, otherwise "TBD")
4. Priority level (high, medium, low)
5. Due date (if mentioned, otherwise null)

Format the response as a JSON array of objects with these fields:
- title (string)
- description (string) 
- assignee (string)
- priority (string: "high", "medium", or "low")
- due_date (string in YYYY-MM-DD format or null)

Meeting Transcript:
${transcriptContent}

Return only the JSON array, no additional text.
`;

      console.log('📤 Sending request to Gemini...');
      
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(response,"response");
      const text = response.text();

      console.log('📥 Received response from Gemini');
      
      // Clean the response text (remove markdown code blocks)
      let cleanText = text;
      if (cleanText.includes('```json')) {
        cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
      }
      if (cleanText.includes('```')) {
        cleanText = cleanText.replace(/```\s*/, '').replace(/```\s*$/, '');
      }
      
      console.log('Cleaned response:', cleanText);
      
      // Parse the JSON response
      let actionItems;
      try {
        actionItems = JSON.parse(cleanText);
        console.log('✅ Successfully parsed AI response');
      } catch (parseError) {
        logger.error('Error parsing AI response:', parseError);
        logger.error('Raw response:', text);
        logger.error('Cleaned response:', cleanText);
        throw new Error('Failed to parse AI response');
      }

      // Validate and insert action items
      const createdItems = [];
      if (Array.isArray(actionItems)) {
        console.log(`🔄 Creating ${actionItems.length} action items...`);
        
        for (const item of actionItems) {
          if (item.title && item.description) {
            const actionItem = await ActionItem.create({
              transcript_id: transcriptId,
              title: item.title,
              description: item.description,
              assignee: item.assignee || 'TBD',
              priority: item.priority || 'medium',
              due_date: item.due_date ? new Date(item.due_date) : null,
              ai_generated: true
            });
            createdItems.push(actionItem);
            console.log(`✅ Created action item: ${item.title}`);
          }
        }
        
        logger.info(`Generated ${createdItems.length} action items for transcript ${transcriptId}`);
        console.log(`🎉 Successfully created ${createdItems.length} action items!`);
      } else {
        logger.warn('AI response was not an array of action items');
        console.log('⚠️ AI response was not in expected format');
      }

      return createdItems;
    } catch (error) {
      logger.error('Error generating action items:', error);
      console.error('❌ AI processing failed:', error.message);
      throw error;
    }
  }
}

// Export as singleton instance
module.exports = new AIService();