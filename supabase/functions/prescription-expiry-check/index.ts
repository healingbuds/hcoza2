import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  brandedEmailTemplate,
  statusBox,
  paragraph,
  ctaButton,
  infoBox,
  signature,
} from '../_shared/email-template.ts';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting prescription expiry check...");

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: expiringDocs, error: fetchError } = await supabase
      .from("prescription_documents")
      .select("id, file_name, document_type, expiry_date, user_id, expiry_notification_sent")
      .not("expiry_date", "is", null)
      .gte("expiry_date", today.toISOString())
      .lte("expiry_date", sevenDaysFromNow.toISOString())
      .eq("expiry_notification_sent", false);

    if (fetchError) {
      console.error("Error fetching expiring documents:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${expiringDocs?.length || 0} expiring documents to notify`);

    const notificationResults = [];

    for (const doc of expiringDocs || []) {
      try {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(doc.user_id);
        
        if (userError || !userData.user?.email) {
          console.error(`Could not get user email for ${doc.user_id}:`, userError);
          continue;
        }

        const userEmail = userData.user.email;
        const expiryDate = new Date(doc.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        const docTypeLabels: Record<string, string> = {
          prescription: "Prescription",
          medical_certificate: "Medical Certificate",
          referral: "Doctor Referral",
          id_document: "ID Document",
          other: "Document",
        };
        const docTypeLabel = docTypeLabels[doc.document_type] || "Document";

        console.log(`Sending expiry notification to ${userEmail} for ${doc.file_name}`);

        // Build email body using branded components
        const bodyContent = `
          ${statusBox(`Your ${docTypeLabel} expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`, 'warning', '⚠️')}
          ${paragraph('To continue using our medical cannabis services without interruption, please upload a renewed document before the expiry date.')}
          ${infoBox('Document Details', `
            <p style="margin: 0 0 8px 0;"><strong>Document Type:</strong> ${docTypeLabel}</p>
            <p style="margin: 0 0 8px 0;"><strong>File Name:</strong> ${doc.file_name}</p>
            <p style="margin: 0;"><strong>Expiry Date:</strong> ${expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          `)}
          ${ctaButton('Upload New Document', 'https://healingbuds.co.za/dashboard')}
          ${signature()}
        `;

        const emailHtml = brandedEmailTemplate(bodyContent, {
          type: 'warning',
          brandName: 'Healing Buds',
          supportEmail: 'support@healingbuds.co.za',
          websiteUrl: 'https://healingbuds.co.za',
        });

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Healing Buds <noreply@send.healingbuds.co.za>",
            to: [userEmail],
            subject: `Your ${docTypeLabel} Expires in ${daysUntilExpiry} Days`,
            html: emailHtml,
          }),
        });

        const emailResult = await emailResponse.json();
        console.log("Email sent:", emailResult);

        const { error: updateError } = await supabase
          .from("prescription_documents")
          .update({
            expiry_notification_sent: true,
            expiry_notification_sent_at: new Date().toISOString(),
          })
          .eq("id", doc.id);

        if (updateError) {
          console.error(`Error updating notification status for ${doc.id}:`, updateError);
        }

        notificationResults.push({ docId: doc.id, email: userEmail, success: true });
      } catch (docError) {
        console.error(`Error processing document ${doc.id}:`, docError);
        notificationResults.push({
          docId: doc.id,
          success: false,
          error: docError instanceof Error ? docError.message : "Unknown error",
        });
      }
    }

    console.log("Expiry check completed:", notificationResults);

    return new Response(
      JSON.stringify({ success: true, processed: notificationResults.length, results: notificationResults }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in prescription expiry check:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
