import { Request, Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';

class AIController {
  getAssistantResponse = asyncHandler(async (req: Request, res: Response) => {
    const { case_id, query } = req.body;

    if (!query) {
      throw new AppError('Query is required', 400);
    }

    // TODO: Integrate with OpenAI API
    // const response = await openai.chat.completions.create({
    //   model: config.ai.model,
    //   messages: [
    //     { role: 'system', content: 'You are a debt recovery assistant...' },
    //     { role: 'user', content: query }
    //   ]
    // });

    const mockResponse = {
      summary: 'Customer has shown willingness to pay but needs time until next month.',
      recommendations: [
        'Offer EMI restructuring option',
        'Send payment reminder on 5th of next month',
        'Follow up via WhatsApp for better engagement'
      ],
      next_best_action: 'Call customer to discuss EMI restructuring',
      recovery_probability: 0.75,
    };

    logger.info('AI assistant response generated', { caseId: case_id });

    res.status(200).json({
      success: true,
      message: 'AI response generated successfully',
      data: mockResponse,
    } as ApiResponse);
  });

  calculatePriorityScore = asyncHandler(async (req: Request, res: Response) => {
    const { case_id } = req.body;

    if (!case_id) {
      throw new AppError('Case ID is required', 400);
    }

    // TODO: Implement AI-based priority scoring
    const priorityScore = {
      score: 85,
      confidence: 0.92,
      factors: {
        payment_history: 0.3,
        loan_age: 0.25,
        dpd_days: 0.2,
        customer_responsiveness: 0.15,
        outstanding_amount: 0.1,
      },
      recommendation: 'HIGH PRIORITY - Immediate action required',
    };

    logger.info('Priority score calculated', { caseId: case_id, score: priorityScore.score });

    res.status(200).json({
      success: true,
      message: 'Priority score calculated successfully',
      data: priorityScore,
    } as ApiResponse);
  });

  calculateRiskScore = asyncHandler(async (req: Request, res: Response) => {
    const { customer_id } = req.body;

    if (!customer_id) {
      throw new AppError('Customer ID is required', 400);
    }

    // TODO: Implement AI-based risk scoring
    const riskScore = {
      score: 65,
      confidence: 0.88,
      risk_level: 'MEDIUM',
      factors: {
        credit_score: 0.35,
        payment_history: 0.3,
        debt_to_income: 0.2,
        employment_stability: 0.15,
      },
      prediction: 'Moderate risk of default',
    };

    logger.info('Risk score calculated', { customerId: customer_id, score: riskScore.score });

    res.status(200).json({
      success: true,
      message: 'Risk score calculated successfully',
      data: riskScore,
    } as ApiResponse);
  });

  generateSummary = asyncHandler(async (req: Request, res: Response) => {
    const { case_id } = req.body;

    if (!case_id) {
      throw new AppError('Case ID is required', 400);
    }

    // TODO: Implement AI-based summary generation
    const summary = {
      customer_summary: 'Customer has 3 active loans with total outstanding of ₹2.5L. Previous payment history shows 85% on-time payments.',
      case_summary: 'Case opened 30 days ago. 5 contact attempts made. Customer responded to 3 attempts. Last interaction was a promise to pay ₹10,000 on 15th.',
      key_insights: [
        'Customer is responsive but facing temporary financial difficulty',
        'Previous PTPs have been kept 80% of the time',
        'Customer prefers WhatsApp communication'
      ],
      suggested_actions: [
        'Follow up on PTP on 16th if payment not received',
        'Offer settlement option if payment not made',
        'Escalate to team leader if no response by 20th'
      ],
    };

    logger.info('Summary generated', { caseId: case_id });

    res.status(200).json({
      success: true,
      message: 'Summary generated successfully',
      data: summary,
    } as ApiResponse);
  });
}

export const aiController = new AIController();
