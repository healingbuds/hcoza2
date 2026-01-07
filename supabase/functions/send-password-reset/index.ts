import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import {
  brandedEmailTemplate,
  ctaButton,
  paragraph,
  infoBox,
  signature,
  getDomainConfig,
  getFromAddress,
  BRAND_COLORS,
} from "../_shared/email-template.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);

    // Verify webhook signature
    const wh = new Webhook(hookSecret);
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string;
        user_metadata?: {
          full_name?: string;
        };
      };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
        site_url: string;
      };
    };

    console.log(`[send-password-reset] Processing email for: ${user.email}`);
    console.log(`[send-password-reset] Email action type: ${email_action_type}`);

    // Only handle password recovery emails
    if (email_action_type !== "recovery") {
      console.log(`[send-password-reset] Skipping non-recovery email type: ${email_action_type}`);
      return new Response(
        JSON.stringify({ message: "Skipped - not a recovery email" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!RESEND_API_KEY) {
      console.error("[send-password-reset] RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: { http_code: 500, message: "Email service not configured" } }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userEmail = user.email;
    const firstName = user.user_metadata?.full_name?.split(" ")[0] || "there";

    // Get domain config (default to ZA/global)
    const domainConfig = getDomainConfig("ZA");

    // Build the password reset URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const resetUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`;

    // Build email content using branded template components
    const emailBody = `
      <h1 style="color: ${BRAND_COLORS.gray900}; font-size: 24px; font-weight: 700; margin: 0 0 24px 0; text-align: center;">
        Reset Your Password
      </h1>
      
      ${paragraph(`Hi ${firstName},`)}
      
      ${paragraph(`We received a request to reset the password for your Healing Buds account. Click the button below to choose a new password:`)}
      
      ${ctaButton("Reset Password", resetUrl)}
      
      ${infoBox(
        "⏰ Link Expires in 1 Hour",
        "For security reasons, this password reset link will expire in 1 hour. If you need a new link, please request another password reset from the login page."
      )}
      
      ${paragraph(`If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.`, true)}
      
      <div style="background-color: ${BRAND_COLORS.gray50}; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="color: ${BRAND_COLORS.gray600}; font-size: 13px; margin: 0 0 8px 0; font-weight: 600;">
          🔒 Security Tip
        </p>
        <p style="color: ${BRAND_COLORS.gray500}; font-size: 13px; margin: 0; line-height: 1.5;">
          Never share your password or this reset link with anyone. Healing Buds staff will never ask for your password.
        </p>
      </div>
      
      ${signature()}
    `;

    const html = brandedEmailTemplate(emailBody, {
      type: "default",
      brandName: domainConfig.brandName,
      supportEmail: domainConfig.supportEmail,
      address: domainConfig.address,
      websiteUrl: domainConfig.websiteUrl,
      supabaseUrl,
      showTagline: true,
      tagline: "Account Security",
    });

    // Send email via Resend API using fetch
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getFromAddress(domainConfig.brandName),
        to: [userEmail],
        subject: "Reset Your Password - Healing Buds",
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[send-password-reset] Resend API error:", data);
      return new Response(
        JSON.stringify({ error: { http_code: response.status, message: data.message || "Failed to send email" } }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[send-password-reset] Email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[send-password-reset] Error:", error);
    return new Response(
      JSON.stringify({
        error: {
          http_code: error?.code || 500,
          message: error?.message || "Internal server error",
        },
      }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
