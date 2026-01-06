import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";
import {
  brandedEmailTemplate,
  paragraph,
  infoBox,
  signature,
  BRAND_COLORS,
} from '../_shared/email-template.ts';

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
        // Build patient confirmation email using branded template
        const patientEmailBody = `
          ${paragraph(`Dear ${data.fullName},`)}
          ${paragraph(`Thank you for reaching out to Healing Buds. We have received your inquiry regarding <strong>${inquiryTypeLabels[data.inquiryType]}</strong>.`)}
          ${infoBox('What happens next?', 'A patient care specialist will contact you within 24 hours to discuss your needs confidentially.')}
          ${paragraph('Your privacy is our priority. All information you provide is protected and handled in accordance with medical confidentiality standards.')}
          ${signature()}
        `;

        const patientEmailHtml = brandedEmailTemplate(patientEmailBody, {
          type: 'success',
          brandName: 'Healing Buds',
          supportEmail: 'support@healingbuds.co.za',
          websiteUrl: 'https://healingbuds.co.za',
        });

        await resend.emails.send({
          from: "Healing Buds <noreply@send.healingbuds.co.za>",
          to: [data.email],
          subject: "We've Received Your Inquiry - Healing Buds",
          html: patientEmailHtml,
        });
        console.log("Confirmation email sent to:", data.email);
      } catch (emailError) {
        // Log but don't fail the request if email fails
        console.error("Failed to send confirmation email:", emailError);
      }

      // Send notification to admin
      try {
        // Build admin notification email using branded template
        const adminEmailBody = `
          <h2 style="color: ${BRAND_COLORS.gray900}; font-size: 20px; margin: 0 0 24px 0;">New Patient Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; font-weight: 600; width: 140px; color: ${BRAND_COLORS.gray700};">Type:</td>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; color: ${BRAND_COLORS.gray900};">${inquiryTypeLabels[data.inquiryType]}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; font-weight: 600; color: ${BRAND_COLORS.gray700};">Name:</td>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; color: ${BRAND_COLORS.gray900};">${data.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; font-weight: 600; color: ${BRAND_COLORS.gray700};">Email:</td>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; color: ${BRAND_COLORS.gray900};">
                <a href="mailto:${data.email}" style="color: ${BRAND_COLORS.medicalTeal};">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; font-weight: 600; color: ${BRAND_COLORS.gray700};">Phone:</td>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; color: ${BRAND_COLORS.gray900};">
                <a href="tel:${data.phone}" style="color: ${BRAND_COLORS.medicalTeal};">${data.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; font-weight: 600; color: ${BRAND_COLORS.gray700};">Source:</td>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; color: ${BRAND_COLORS.gray900};">${data.source}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; font-weight: 600; color: ${BRAND_COLORS.gray700};">Country:</td>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; color: ${BRAND_COLORS.gray900};">${data.countryCode}</td>
            </tr>
            ${data.medicalContext ? `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; font-weight: 600; vertical-align: top; color: ${BRAND_COLORS.gray700};">Medical Context:</td>
              <td style="padding: 12px; border-bottom: 1px solid ${BRAND_COLORS.gray200}; color: ${BRAND_COLORS.gray900};">${data.medicalContext}</td>
            </tr>
            ` : ''}
          </table>
          ${paragraph(`Inquiry ID: <code style="font-family: monospace; background: ${BRAND_COLORS.gray100}; padding: 2px 6px; border-radius: 4px;">${inquiry.id}</code>`, true)}
        `;

        const adminEmailHtml = brandedEmailTemplate(adminEmailBody, {
          type: 'default',
          brandName: 'Healing Buds Admin',
          supportEmail: 'support@healingbuds.co.za',
          websiteUrl: 'https://healingbuds.co.za',
        });

        await resend.emails.send({
          from: "Healing Buds <noreply@send.healingbuds.co.za>",
          to: ["info@healingbuds.co.za"],
          subject: `New Inquiry: ${inquiryTypeLabels[data.inquiryType]} - ${data.fullName}`,
          html: adminEmailHtml,
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
