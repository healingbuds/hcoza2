import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  brandedEmailTemplate,
  ctaButton,
  statusBox,
  paragraph,
  infoBox,
  numberedList,
  bulletList,
  signature,
  getDomainConfig,
  getFromAddress,
  BRAND_COLORS,
} from '../_shared/email-template.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ClientEmailRequest {
  type: 'welcome' | 'kyc-link' | 'kyc-approved' | 'kyc-rejected' | 'eligibility-approved' | 'eligibility-rejected' | 'waitlist-welcome';
  email: string;
  name: string;
  region?: string;
  kycLink?: string;
  clientId?: string;
  rejectionReason?: string;
  countryName?: string;
}

// Waitlist email helpers
function getWaitlistSubject(region?: string, countryName?: string): string {
  if (region === 'PT') {
    return 'Está na Lista de Espera da Healing Buds! 🌱';
  }
  if (region === 'GB') {
    return "You're on the Healing Buds UK Waitlist! 🌱";
  }
  return `Welcome to the Healing Buds ${countryName || ''} Waitlist! 🌱`.trim();
}

function getWaitlistBody(firstName: string, region?: string, countryName?: string): string {
  if (region === 'PT') {
    return `
      ${paragraph(`Olá ${firstName},`)}
      ${paragraph('Obrigado por se juntar à lista de espera da Healing Buds Portugal!')}
      ${statusBox('Está na Lista!', 'success', '🌱')}
      ${paragraph('Estamos a trabalhar para trazer cuidados de canábis medicinal regulamentados para Portugal. Como membro da lista de espera, será dos primeiros a saber quando lançarmos.')}
      ${infoBox('O que acontece a seguir:', `
        <ul style="margin: 0; padding-left: 20px;">
          <li>Manteremos-no/a atualizado/a sobre o nosso progresso em Portugal</li>
          <li>Terá acesso antecipado quando as inscrições abrirem</li>
          <li>Sem spam - apenas atualizações importantes</li>
        </ul>
      `)}
      ${signature('A Equipa Healing Buds', 'Até breve')}
    `;
  }
  
  if (region === 'GB') {
    return `
      ${paragraph(`Dear ${firstName},`)}
      ${paragraph('Thank you for joining the Healing Buds UK waitlist!')}
      ${statusBox("You're on the List!", 'success', '🌱')}
      ${paragraph("We're working hard to bring regulated medical cannabis care to the United Kingdom. As a waitlist member, you'll be among the first to know when we launch.")}
      ${infoBox('What happens next:', `
        <ul style="margin: 0; padding-left: 20px;">
          <li>We'll keep you updated on our UK launch progress</li>
          <li>You'll receive early access when registrations open</li>
          <li>No spam - only important updates</li>
        </ul>
      `)}
      ${signature()}
    `;
  }
  
  // Default/other regions
  return `
    ${paragraph(`Dear ${firstName},`)}
    ${paragraph(`Thank you for joining the Healing Buds ${countryName || ''} pre-launch waitlist!`)}
    ${statusBox("You're on the List!", 'success', '🌱')}
    ${paragraph("You're now on our pre-launch list. We'll notify you as soon as we're ready to welcome patients in your region.")}
    ${infoBox('What happens next:', `
      <ul style="margin: 0; padding-left: 20px;">
        <li>We'll keep you updated on our launch progress</li>
        <li>You'll receive early access when registrations open</li>
        <li>No spam - only important updates</li>
      </ul>
    `)}
    ${signature()}
  `;
}

// Email templates
function getEmailTemplate(request: ClientEmailRequest, config: ReturnType<typeof getDomainConfig>) {
  const { type, name, kycLink, rejectionReason } = request;
  const firstName = name.split(' ')[0] || name;

  const templates: Record<string, { subject: string; body: string; type: 'success' | 'warning' | 'error' | 'default' }> = {
    'welcome': {
      subject: `Welcome to ${config.brandName} - Registration Complete`,
      type: 'default',
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph(`Thank you for registering with ${config.brandName}. Your medical cannabis patient registration has been received.`)}
        ${infoBox('What happens next?', `
          ${numberedList([
            '<strong>Identity Verification (KYC)</strong> - You\'ll receive a separate email with a link to verify your identity.',
            '<strong>Medical Review</strong> - Our medical team will review your application.',
            '<strong>Approval</strong> - Once approved, you\'ll have full access to our medical cannabis products.',
          ])}
        `)}
        ${kycLink ? ctaButton('Complete Identity Verification', kycLink) : statusBox('Your verification link is being generated and will be sent to you shortly in a separate email.', 'warning', '📋')}
        ${signature()}
      `,
    },
    'kyc-link': {
      subject: `Complete Your Identity Verification - ${config.brandName}`,
      type: 'default',
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph(`Please complete your identity verification to continue with your ${config.brandName} registration.`)}
        ${infoBox("What you'll need:", `
          ${bulletList([
            'A valid government-issued ID (passport, driver\'s license, or national ID)',
            'Good lighting for clear photos',
            '5 minutes to complete the process',
          ])}
        `)}
        ${ctaButton('Verify My Identity', kycLink || '#')}
        ${paragraph('This link is secure and will expire in 7 days. If you didn\'t request this verification, please contact us immediately.', true)}
      `,
    },
    'kyc-approved': {
      subject: `✅ Identity Verified - ${config.brandName}`,
      type: 'success',
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph('Great news! Your identity has been successfully verified.')}
        ${statusBox('KYC Verification Complete', 'success', '✓')}
        ${infoBox('Next Step: Medical Review', 'Your application is now being reviewed by our medical team. This typically takes 1-2 business days.')}
        ${paragraph("We'll notify you by email once your medical eligibility has been confirmed.")}
        ${signature()}
      `,
    },
    'kyc-rejected': {
      subject: `Identity Verification - Additional Information Required`,
      type: 'error',
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph('Unfortunately, we were unable to verify your identity with the information provided.')}
        ${statusBox(rejectionReason || 'The document quality was insufficient or the information could not be verified.', 'error', '⚠️')}
        ${infoBox('How to resubmit:', `
          ${bulletList([
            'Ensure your ID is not expired',
            'Take photos in good lighting',
            'Make sure all text on the document is clearly readable',
            'Avoid glare or shadows on the document',
          ])}
        `)}
        ${kycLink ? ctaButton('Retry Verification', kycLink) : ''}
        ${paragraph(`If you need assistance, please contact our support team at ${config.supportEmail}`, true)}
      `,
    },
    'eligibility-approved': {
      subject: `🎉 You're Approved for Medical Cannabis - ${config.brandName}`,
      type: 'success',
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph('Congratulations! Your application for medical cannabis has been approved by our medical team.')}
        ${statusBox('Medical Eligibility Confirmed', 'success', '🎉')}
        ${paragraph('You now have full access to browse and purchase medical cannabis products.')}
        ${ctaButton('Browse Products', `${config.websiteUrl}/shop`)}
        ${infoBox('Important Information:', `
          ${bulletList([
            'Always follow dosage guidelines provided with your products',
            'Keep your prescription documentation accessible',
            'Contact our support team if you have any questions',
          ])}
        `)}
        ${signature()}
      `,
    },
    'eligibility-rejected': {
      subject: `Medical Eligibility Review - ${config.brandName}`,
      type: 'error',
      body: `
        ${paragraph(`Dear ${firstName},`)}
        ${paragraph('After careful review, we regret to inform you that your medical cannabis application could not be approved at this time.')}
        ${statusBox(rejectionReason || 'Based on the medical information provided, you do not currently meet our eligibility criteria for medical cannabis.', 'error', '⚠️')}
        ${infoBox('What you can do:', `
          ${bulletList([
            'Consult with your healthcare provider about alternative options',
            'Request a review by contacting our medical team',
            'Reapply if your medical situation changes',
          ])}
        `)}
        ${paragraph(`If you believe this decision was made in error or have additional medical documentation, please contact us at ${config.supportEmail}`, true)}
      `,
    },
    'waitlist-welcome': {
      subject: getWaitlistSubject(request.region, request.countryName),
      type: 'success',
      body: getWaitlistBody(firstName, request.region, request.countryName),
    },
  };

  const template = templates[type] || templates['welcome'];

  return {
    subject: template.subject,
    html: brandedEmailTemplate(template.body, {
      type: template.type,
      brandName: config.brandName,
      supportEmail: config.supportEmail,
      address: config.address,
      websiteUrl: config.websiteUrl,
      region: request.region,
    }),
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: ClientEmailRequest = await req.json();
    console.log('[send-client-email] Request received:', { type: request.type, email: request.email, region: request.region });

    // Validate required fields
    if (!request.email || !request.type || !request.name) {
      console.error('[send-client-email] Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, type, name' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error('[send-client-email] RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get domain config based on region
    const domainConfig = getDomainConfig(request.region);
    console.log('[send-client-email] Using domain config:', { domain: domainConfig.domain, brandName: domainConfig.brandName });

    // Generate email content
    const emailContent = getEmailTemplate(request, domainConfig);

    // Use verified subdomain for sending
    const fromAddress = getFromAddress(domainConfig.brandName);

    console.log('[send-client-email] Sending email:', {
      from: fromAddress,
      to: request.email,
      subject: emailContent.subject,
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [request.email.trim()],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[send-client-email] Resend API error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: data }),
        { status: response.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('[send-client-email] Email sent successfully:', data);

    // Log journey event if clientId is provided
    if (request.clientId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );
        
        // Get user ID from client
        const { data: clientData } = await supabase
          .from('drgreen_clients')
          .select('user_id')
          .eq('drgreen_client_id', request.clientId)
          .single();
        
        if (clientData?.user_id) {
          await supabase.from('kyc_journey_logs').insert({
            user_id: clientData.user_id,
            client_id: request.clientId,
            event_type: `email.${request.type}_sent`,
            event_source: 'send-client-email',
            event_data: {
              emailType: request.type,
              region: request.region,
              success: true,
            },
          });
          console.log(`[KYC Journey] Logged: email.${request.type}_sent`);
        }
      } catch (logError) {
        console.warn('[KYC Journey] Failed to log email event:', logError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, messageId: data.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('[send-client-email] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
