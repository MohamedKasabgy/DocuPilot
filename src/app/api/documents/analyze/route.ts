import { NextResponse } from 'next/server';
import {
  DocumentType,
  DocumentStatus,
  AnalysisOutputType,
  RiskSeverity,
} from '@/lib/data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, documentType, title, text } = body;

    if (!projectId || !documentType || !title || !text) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: projectId, documentType, title, text' },
        { status: 400 }
      );
    }

    const docId = `doc-${Date.now()}`;
    const analysisId = `ao-${Date.now()}`;

    let status: DocumentStatus = 'analyzed';
    let outputType: AnalysisOutputType = 'srs'; // fallback
    let analysisData: any = {};
    const actions: any[] = [];
    const risks: any[] = [];
    const approvals: any[] = [];

    switch (documentType as DocumentType) {
      case 'contract':
        outputType = 'contract_analysis';
        analysisData = {
          obligations: ['Deliver project within 12 weeks', 'Provide weekly status updates'],
          paymentMilestones: ['30% at signing', '40% at UAT', '30% at launch'],
        };
        actions.push({
          id: `act-${Date.now()}`,
          projectId,
          title: 'Schedule weekly status updates',
          description: 'Recurring task to fulfill contract obligation.',
          status: 'open',
          source: 'Contract Analysis',
          createdAt: new Date().toISOString(),
        });
        risks.push({
          id: `risk-${Date.now()}`,
          projectId,
          title: 'Tight 12-week deadline',
          description: 'High risk of missing the launch date if requirements change.',
          severity: 'medium' as RiskSeverity,
          status: 'open',
          source: 'Contract Analysis',
          createdAt: new Date().toISOString(),
        });
        break;

      case 'invoice':
        outputType = 'invoice_analysis';
        status = 'needs_approval';
        analysisData = {
          vendor: 'Extracted Vendor Name',
          amount: '$5,000.00',
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
          duplicateCheck: 'Clear - no duplicates found',
        };
        approvals.push({
          id: `app-${Date.now()}`,
          projectId,
          linkedDocumentId: docId,
          title: `Invoice Approval for ${title}`,
          description: `Requires approval for $5,000.00 to Extracted Vendor Name.`,
          status: 'pending',
          approvers: ['Finance', 'Project Manager'],
          createdAt: new Date().toISOString(),
        });
        actions.push({
          id: `act-${Date.now()}`,
          projectId,
          title: 'Review and approve invoice',
          description: 'Invoice must be approved before due date.',
          status: 'open',
          source: 'Invoice Analysis',
          createdAt: new Date().toISOString(),
        });
        break;

      case 'scope_change':
        outputType = 'scope_analysis';
        status = 'out_of_scope';
        analysisData = {
          scopeStatus: 'out_of_scope',
          reason: 'The requested feature is not mentioned in the approved SRS.',
          timelineImpact: 'medium',
          costImpact: 'medium',
        };
        actions.push({
          id: `act-${Date.now()}`,
          projectId,
          title: 'Prepare Change Request Document',
          description: 'Client requested out-of-scope feature. CR needed.',
          status: 'open',
          source: 'Scope Guard',
          createdAt: new Date().toISOString(),
        });
        risks.push({
          id: `risk-${Date.now()}`,
          projectId,
          title: 'Scope Creep Alert',
          description: 'Client requesting features outside of original agreement.',
          severity: 'high' as RiskSeverity,
          status: 'open',
          source: 'Scope Guard',
          createdAt: new Date().toISOString(),
        });
        break;

      case 'meeting_notes':
        outputType = 'meeting_summary';
        status = 'action_items_extracted';
        analysisData = {
          keyDecisions: ['Approved new UI wireframes', 'Delayed backend integration by 1 week'],
          attendees: ['Client', 'PM', 'Tech Lead'],
        };
        actions.push({
          id: `act-${Date.now()}`,
          projectId,
          title: 'Follow up on backend delay',
          description: 'Assess impact of 1-week backend delay on overall timeline.',
          status: 'open',
          source: 'Meeting Notes',
          // Deliberately no owner
          createdAt: new Date().toISOString(),
        });
        break;

      case 'project_evaluator':
      case 'srs':
        outputType = 'business_case';
        analysisData = {
          potentialRevenue: 'USD 50k-100k ARR',
          estimatedCost: '$60,000',
          roi: 'high',
          marketMaturity: 'High demand',
          recommendation: 'build',
          suggestedMVP: ['Core feature 1', 'Core feature 2'],
          requirements: ['User auth', 'Payment gateway', 'Dashboard'],
        };
        break;

      default:
        analysisData = { summary: 'Document analyzed.' };
    }

    const document = {
      id: docId,
      projectId,
      type: documentType as DocumentType,
      title,
      status,
      createdAt: new Date().toISOString(),
    };

    const analysisOutput = {
      id: analysisId,
      projectId,
      linkedDocumentId: docId,
      type: outputType,
      data: analysisData,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: {
        document,
        analysisOutput,
        actions,
        risks,
        approvals,
      },
      usedFallback: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error processing analysis.' },
      { status: 500 }
    );
  }
}
