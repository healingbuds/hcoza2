import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  brandedEmailTemplate,
  ctaButton,
  infoBox,
  paragraph,
  bulletList,
  signature,
  getFromAddress,
} from "../_shared/email-template.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OnboardingEmailRequest {
  email: string;
  firstName?: string;
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("[send-onboarding-email] Request received");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, fullName }: OnboardingEmailRequest = await req.json();

    if (!email) {
      console.error("[send-onboarding-email] Missing email");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!RESEND_API_KEY) {
      console.error("[send-onboarding-email] RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Extract first name from fullName if firstName not provided
    const displayName = firstName || (fullName ? fullName.split(" ")[0] : null);
    const greeting = displayName ? `${displayName}, Welcome! 🎉` : "Welcome! 🎉";

    console.log(`[send-onboarding-email] Sending to ${email}`);

    const siteUrl = Deno.env.get("SITE_URL") || "https://healingbuds.co.za";
    const registrationUrl = `${siteUrl}/shop/register`;
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    // Build email body content
    const emailBodyContent = `
      <h2 style="color: #0F3935; margin: 0 0 20px 0; font-size: 24px;">
        ${greeting}
      </h2>
      
      ${paragraph(`Thank you for creating your Healing Buds account. You are one step away from accessing our medical cannabis dispensary.`)}
      
      ${paragraph(`<strong>Next Step:</strong> Complete your patient registration to verify your eligibility. This includes a brief medical questionnaire and identity verification (KYC).`)}
      
      ${ctaButton('Complete Your Registration →', registrationUrl)}
      
      ${paragraph(`Or copy this link into your browser:`, true)}
      <p style="margin: 0 0 16px 0;">
        <a href="${registrationUrl}" style="color: #0D9488; word-break: break-all; font-size: 14px;">${registrationUrl}</a>
      </p>
      
      ${infoBox('What to Expect:', `
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
          <li>Brief medical questionnaire (2-3 minutes)</li>
          <li>Identity verification for compliance</li>
          <li>Access to our full range of medical cannabis products</li>
          <li>Personalized strain recommendations</li>
        </ul>
      `)}
      
      ${signature()}
    `;

    // Wrap in branded template
    const emailHtml = brandedEmailTemplate(emailBodyContent, {
      type: 'default',
      brandName: 'Healing Buds',
      supportEmail: 'support@healingbuds.co.za',
      websiteUrl: siteUrl,
      supabaseUrl,
      useWhiteLogo: false, // Use teal logo on white header for onboarding
    });

    // Send via Resend API using fetch
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getFromAddress('Healing Buds'),
        to: [email],
        subject: "Welcome to Healing Buds - Complete Your Registration",
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[send-onboarding-email] Resend API error:", data);
      // Return success: false but 200 status - don't block registration
      return new Response(
        JSON.stringify({ success: false, error: data.message || 'Failed to send email' }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("[send-onboarding-email] Email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    // Log error but don't crash - this should never block user registration
    console.error("[send-onboarding-email] Error:", error.message);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
