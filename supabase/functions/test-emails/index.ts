import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

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
    
    // Simple test email template
    const templates: Record<string, { subject: string; body: string }> = {
      'test': {
        subject: '🧪 Test Email - Healing Buds',
        body: `<h1>Test Email</h1><p>This is a test email sent at ${new Date().toISOString()}</p>`
      },
      'welcome': {
        subject: `Welcome to Healing Buds, ${name}!`,
        body: `
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for registering with Healing Buds.</p>
          <p>Your account has been created successfully.</p>
          <p>Region: ${region}</p>
        `
      },
      'kyc-link': {
        subject: 'Complete Your Identity Verification - Healing Buds',
        body: `
          <h1>Hello ${name},</h1>
          <p>Please complete your identity verification.</p>
          <p><a href="${kycLink}">Click here to verify your identity</a></p>
        `
      },
      'kyc-approved': {
        subject: '✅ Identity Verified - Healing Buds',
        body: `
          <h1>Congratulations ${name}!</h1>
          <p>Your identity has been successfully verified.</p>
          <p>Your application is now being reviewed by our medical team.</p>
        `
      },
      'kyc-rejected': {
        subject: 'Identity Verification - Additional Information Required',
        body: `
          <h1>Hello ${name},</h1>
          <p>We were unable to verify your identity with the information provided.</p>
          <p>Please try again with clearer documents.</p>
        `
      },
      'eligibility-approved': {
        subject: '🎉 You\'re Approved - Healing Buds',
        body: `
          <h1>Great news, ${name}!</h1>
          <p>Your medical cannabis application has been approved.</p>
          <p>You now have full access to our products.</p>
          <p><a href="https://healingbuds.co.za/shop">Browse Products</a></p>
        `
      },
      'eligibility-rejected': {
        subject: 'Medical Eligibility Review - Healing Buds',
        body: `
          <h1>Hello ${name},</h1>
          <p>After careful review, we regret to inform you that your application could not be approved at this time.</p>
        `
      },
      'waitlist-welcome': {
        subject: `You're on the Healing Buds Waitlist! 🌱`,
        body: `
          <h1>Hello ${name}!</h1>
          <p>Thank you for joining the Healing Buds waitlist.</p>
          <p>We'll notify you when we launch in your region.</p>
          <p>Region: ${region}</p>
        `
      }
    };

    const template = templates[type] || templates['test'];

    const emailResponse = await resend.emails.send({
      from: "Healing Buds <noreply@send.healingbuds.co.za>",
      to: [email],
      subject: `[TEST] ${template.subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f59e0b; color: white; padding: 10px; text-align: center; border-radius: 4px; margin-bottom: 20px;">
            ⚠️ TEST EMAIL - Sent from Flow Auditor
          </div>
          ${template.body}
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 12px;">
            This is a test email sent from the Healing Buds Flow Auditor.
            <br/>Sent at: ${new Date().toISOString()}
            <br/>Type: ${type}
            <br/>Region: ${region}
          </p>
        </div>
      `,
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
