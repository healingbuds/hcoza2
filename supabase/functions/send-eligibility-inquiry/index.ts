import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";

// Dynamic Resend import for Deno
const loadResend = async () => {
  const module = await import("https://esm.sh/resend@2.0.0");
  return module.Resend;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryRequest {
  inquiryType: 'eligibility' | 'existing_patient' | 'referral' | 'general';
  fullName: string;
  email: string;
  phone: string;
  medicalContext?: string;
  source: string;
  countryCode: string;
  termsConsent: boolean;
  contactConsent: boolean;
}

const inquiryTypeLabels: Record<string, string> = {
  eligibility: 'Check Eligibility',
  existing_patient: 'Existing Patient Support',
  referral: 'Doctor or Clinic Referral',
  general: 'General Questions',
};

function validateRequest(data: InquiryRequest): string | null {
  if (!data.inquiryType || !['eligibility', 'existing_patient', 'referral', 'general'].includes(data.inquiryType)) {
    return 'Invalid inquiry type';
  }
  if (!data.fullName || data.fullName.length < 2 || data.fullName.length > 50) {
    return 'Name must be between 2 and 50 characters';
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Invalid email address';
  }
  if (!data.phone || data.phone.length < 10 || data.phone.length > 20) {
    return 'Phone number must be between 10 and 20 characters';
  }
  if (data.medicalContext && data.medicalContext.length > 500) {
    return 'Medical context must be under 500 characters';
  }
  if (!data.termsConsent || !data.contactConsent) {
    return 'You must agree to the terms and consent to be contacted';
  }
  return null;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received eligibility inquiry request");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InquiryRequest = await req.json();
    console.log("Processing inquiry for:", data.email);

    // Validate request
    const validationError = validateRequest(data);
    if (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store inquiry in database
    const { data: inquiry, error: dbError } = await supabase
      .from('contact_inquiries')
      .insert({
        inquiry_type: data.inquiryType,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        medical_context: data.medicalContext || null,
        source: data.source,
        country_code: data.countryCode,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store inquiry");
    }

    console.log("Inquiry stored with ID:", inquiry.id);

    // Send confirmation email
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const ResendClass = await loadResend();
      const resend = new ResendClass(resendApiKey);

      try {
        await resend.emails.send({
          from: "Healing Buds <noreply@healingbuds.co.za>",
          to: [data.email],
          subject: "We've Received Your Inquiry - Healing Buds",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <img src="https://gofxhsxueyanyafymfbi.supabase.co/storage/v1/object/public/email-assets/hb-logo-teal.png" alt="Healing Buds" style="height: 48px; width: auto;" />
              </div>
              
              <h1 style="color: #0F3935; font-size: 24px; margin-bottom: 16px;">Thank You for Your Inquiry</h1>
              
              <p>Dear ${data.fullName},</p>
              
              <p>Thank you for reaching out to Healing Buds. We have received your inquiry regarding <strong>${inquiryTypeLabels[data.inquiryType]}</strong>.</p>
              
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; color: #065f46;"><strong>What happens next?</strong></p>
                <p style="margin: 8px 0 0; color: #047857;">A patient care specialist will contact you within 24 hours to discuss your needs confidentially.</p>
              </div>
              
              <p>Your privacy is our priority. All information you provide is protected and handled in accordance with medical confidentiality standards.</p>
              
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 14px; color: #6b7280; margin: 0;">If you have any urgent questions, please don't hesitate to contact our support team.</p>
              </div>
              
              <div style="margin-top: 32px; text-align: center; font-size: 12px; color: #9ca3af;">
                <p style="margin: 4px 0;">Healing Buds | Medical Cannabis</p>
                <p style="margin: 4px 0;">EU GMP Certified | Secure & Compliant</p>
              </div>
            </body>
            </html>
          `,
        });
        console.log("Confirmation email sent to:", data.email);
      } catch (emailError) {
        // Log but don't fail the request if email fails
        console.error("Failed to send confirmation email:", emailError);
      }

      // Send notification to admin
      try {
        await resend.emails.send({
          from: "Healing Buds <noreply@healingbuds.co.za>",
          to: ["info@healingbuds.co.za"],
          subject: `New Inquiry: ${inquiryTypeLabels[data.inquiryType]} - ${data.fullName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; padding: 20px;">
              <h2>New Patient Inquiry</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Type:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${inquiryTypeLabels[data.inquiryType]}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.fullName}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.email}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.phone}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Source:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.source}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Country:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.countryCode}</td></tr>
                ${data.medicalContext ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; vertical-align: top;">Medical Context:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.medicalContext}</td></tr>` : ''}
              </table>
              
              <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">Inquiry ID: ${inquiry.id}</p>
            </body>
            </html>
          `,
        });
        console.log("Admin notification sent");
      } catch (adminEmailError) {
        console.error("Failed to send admin notification:", adminEmailError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, id: inquiry.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing inquiry:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
