import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  brandedEmailTemplate,
  ctaButton,
  statusBox,
  paragraph,
  sectionHeading,
  bulletList,
  signature,
  getDomainConfig,
  getFromAddress,
  BRAND_COLORS,
} from "../_shared/email-template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  type: 'welcome' | 'kyc-link' | 'kyc-approved' | 'kyc-rejected' | 'eligibility-approved' | 'eligibility-rejected' | 'waitlist-welcome' | 'test';
  email: string;
  name?: string;
  region?: string;
  kycLink?: string;
}

function generateEmailContent(type: string, name: string, region: string, kycLink: string): { subject: string; body: string } {
  const config = getDomainConfig(region);
  const firstName = name.split(' ')[0] || name;

  const templates: Record<string, { subject: string; body: string; type?: 'success' | 'warning' | 'error' | 'default' }> = {
    'test': {
      subject: '🧪 Test Email - Healing Buds',
      body: `
        ${paragraph(`Hello,`)}
        ${paragraph(`This is a test email to verify that the email delivery system is working correctly.`)}
        ${statusBox('Email System Operational', 'success', '✅')}
        ${paragraph(`Sent at: ${new Date().toISOString()}`, true)}
        ${signature()}
      `,
    },
    'welcome': {
      subject: `Welcome to ${config.brandName}, ${firstName}!`,
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph(`Thank you for registering with ${config.brandName}. Your medical cannabis patient registration has been received.`)}
        ${sectionHeading('What happens next?')}
        ${bulletList([
          '<strong>Identity Verification (KYC)</strong> - You will receive a separate email with a link to verify your identity.',
          '<strong>Medical Review</strong> - Our medical team will review your application.',
          '<strong>Approval</strong> - Once approved, you will have full access to our medical cannabis products.',
        ])}
        ${kycLink ? ctaButton('Complete Identity Verification', kycLink) : statusBox('Your verification link will be sent shortly.', 'info')}
        ${signature()}
      `,
      type: 'default',
    },
    'kyc-link': {
      subject: `Complete Your Identity Verification - ${config.brandName}`,
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph(`Please complete your identity verification to continue with your ${config.brandName} registration.`)}
        ${statusBox('What you will need:', 'info')}
        ${bulletList([
          'A valid government-issued ID (passport, drivers license, or national ID)',
          'Good lighting for clear photos',
          '5 minutes to complete the process',
        ])}
        ${ctaButton('Verify My Identity', kycLink)}
        ${paragraph(`This link is secure and will expire in 7 days. If you did not request this verification, please contact us immediately.`, true)}
        ${signature()}
      `,
    },
    'kyc-approved': {
      subject: `✅ Identity Verified - ${config.brandName}`,
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph(`Great news! Your identity has been successfully verified.`)}
        ${statusBox('KYC Verification Complete', 'success', '✓')}
        ${sectionHeading('Next Step: Medical Review')}
        ${paragraph(`Your application is now being reviewed by our medical team. This typically takes 1-2 business days.`)}
        ${paragraph(`We will notify you by email once your medical eligibility has been confirmed.`)}
        ${signature()}
      `,
      type: 'success',
    },
    'kyc-rejected': {
      subject: `Identity Verification - Additional Information Required`,
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph(`Unfortunately, we were unable to verify your identity with the information provided.`)}
        ${statusBox('The document quality was insufficient or the information could not be verified.', 'error')}
        ${sectionHeading('How to resubmit:')}
        ${bulletList([
          'Ensure your ID is not expired',
          'Take photos in good lighting',
          'Make sure all text on the document is clearly readable',
          'Avoid glare or shadows on the document',
        ])}
        ${kycLink ? ctaButton('Retry Verification', kycLink) : ''}
        ${paragraph(`If you need assistance, please contact our support team at ${config.supportEmail}`, true)}
        ${signature()}
      `,
      type: 'error',
    },
    'eligibility-approved': {
      subject: `🎉 You're Approved for Medical Cannabis - ${config.brandName}`,
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph(`Congratulations! Your application for medical cannabis has been approved by our medical team.`)}
        ${statusBox('Medical Eligibility Confirmed', 'success', '🎉')}
        ${paragraph(`You now have full access to browse and purchase medical cannabis products.`)}
        ${ctaButton('Browse Products', `${config.websiteUrl}/shop`)}
        ${sectionHeading('Important Information:')}
        ${bulletList([
          'Always follow dosage guidelines provided with your products',
          'Keep your prescription documentation accessible',
          'Contact our support team if you have any questions',
        ])}
        ${signature()}
      `,
      type: 'success',
    },
    'eligibility-rejected': {
      subject: `Medical Eligibility Review - ${config.brandName}`,
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph(`After careful review, we regret to inform you that your medical cannabis application could not be approved at this time.`)}
        ${statusBox('Based on the medical information provided, you do not currently meet our eligibility criteria for medical cannabis.', 'error')}
        ${sectionHeading('What you can do:')}
        ${bulletList([
          'Consult with your healthcare provider about alternative options',
          'Request a review by contacting our medical team',
          'Reapply if your medical situation changes',
        ])}
        ${paragraph(`If you believe this decision was made in error or have additional medical documentation, please contact us at ${config.supportEmail}`, true)}
        ${signature()}
      `,
      type: 'error',
    },
    'waitlist-welcome': {
      subject: `You're on the Healing Buds Waitlist! 🌱`,
      body: `
        ${paragraph(`Hello ${firstName},`)}
        ${paragraph(`Thank you for joining the Healing Buds waitlist!`)}
        ${statusBox("You're on the List!", 'success', '🌱')}
        ${paragraph(`We are working hard to bring regulated medical cannabis care to your region. As a waitlist member, you will be among the first to know when we launch.`)}
        ${sectionHeading('What happens next:')}
        ${bulletList([
          'We will keep you updated on our launch progress',
          'You will receive early access when registrations open',
          'No spam - only important updates',
        ])}
        ${signature()}
      `,
    },
  };

  return templates[type] || templates['test'];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("[test-emails] Received request");

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("[test-emails] RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "RESEND_API_KEY not configured",
          configStatus: { resendKey: false }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: TestEmailRequest = await req.json();
    const { type, email, name = 'Test User', region = 'ZA', kycLink = 'https://example.com/kyc' } = body;

    console.log(`[test-emails] Sending ${type} email to ${email}`);

    const resend = new Resend(resendApiKey);
    const config = getDomainConfig(region);
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    
    // Generate email content using template helpers
    const { subject, body: emailBody } = generateEmailContent(type, name, region, kycLink);
    
    // Determine email type for header coloring
    const emailType = type.includes('rejected') ? 'error' 
      : type.includes('approved') || type === 'kyc-approved' ? 'success' 
      : 'default';

    // Wrap body in branded template
    const htmlContent = brandedEmailTemplate(emailBody, {
      type: emailType as 'success' | 'warning' | 'error' | 'default',
      brandName: config.brandName,
      supportEmail: config.supportEmail,
      address: config.address,
      websiteUrl: config.websiteUrl,
      supabaseUrl,
    });

    const emailResponse = await resend.emails.send({
      from: getFromAddress(config.brandName),
      to: [email],
      subject: `[TEST] ${subject}`,
      html: htmlContent,
    });

    console.log("[test-emails] Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: emailResponse,
        message: `${type} email sent to ${email}`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("[test-emails] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
