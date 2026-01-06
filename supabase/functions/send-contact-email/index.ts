import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  brandedEmailTemplate,
  paragraph,
  signature,
  getFromAddress,
  BRAND_COLORS,
} from "../_shared/email-template.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting storage (in-memory for edge function)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3; // Max 3 submissions
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds

interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Simple validation function (mirrors frontend Zod schema)
function validateContactForm(data: ContactFormRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required');
  } else if (data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (data.name.trim().length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!emailRegex.test(data.email.trim())) {
    errors.push('Invalid email address');
  } else if (data.email.trim().length > 255) {
    errors.push('Email must be less than 255 characters');
  }
  
  // Subject validation
  if (!data.subject || typeof data.subject !== 'string') {
    errors.push('Subject is required');
  } else if (data.subject.trim().length < 3) {
    errors.push('Subject must be at least 3 characters');
  } else if (data.subject.trim().length > 200) {
    errors.push('Subject must be less than 200 characters');
  }
  
  // Message validation
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required');
  } else if (data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  } else if (data.message.trim().length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }
  
  return { valid: errors.length === 0, errors };
}

// Rate limiting check
function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    // First request or window expired - reset
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Increment count
  record.count++;
  rateLimitMap.set(identifier, record);
  return { allowed: true };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting (fallback to email)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    console.log(`[Contact Form] Request from IP: ${clientIP}`);
    
    const body = await req.json();
    const { name, email, subject, message }: ContactFormRequest = body;
    
    // Server-side validation
    const validation = validateContactForm({ name, email, subject, message });
    if (!validation.valid) {
      console.log(`[Contact Form] Validation failed:`, validation.errors);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Validation failed', 
          details: validation.errors 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Rate limiting check (by IP and email)
    const ipRateLimit = checkRateLimit(`ip:${clientIP}`);
    const emailRateLimit = checkRateLimit(`email:${email.trim().toLowerCase()}`);
    
    if (!ipRateLimit.allowed || !emailRateLimit.allowed) {
      const retryAfter = Math.max(ipRateLimit.retryAfter || 0, emailRateLimit.retryAfter || 0);
      console.log(`[Contact Form] Rate limited - IP: ${clientIP}, Email: ${email}, retry after: ${retryAfter}s`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Too many requests. Please try again later.',
          retryAfter 
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json", 
            "Retry-After": String(retryAfter),
            ...corsHeaders 
          },
        }
      );
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    // Build email body content
    const emailBodyContent = `
      ${paragraph(`Thank you for contacting us, ${name.trim()}!`)}
      ${paragraph(`We have received your message and will get back to you as soon as possible.`)}
      
      <div style="background-color: ${BRAND_COLORS.gray100}; padding: 20px; border-radius: 12px; margin: 24px 0;">
        <p style="color: ${BRAND_COLORS.gray600}; margin: 0 0 8px; font-size: 14px;"><strong>Subject:</strong> ${subject.trim()}</p>
        <p style="color: ${BRAND_COLORS.gray600}; margin: 0 0 8px; font-size: 14px;"><strong>Your message:</strong></p>
        <p style="color: ${BRAND_COLORS.gray600}; margin: 0; font-size: 14px; white-space: pre-wrap;">${message.trim()}</p>
      </div>
      
      ${signature()}
    `;

    // Wrap in branded template
    const emailHtml = brandedEmailTemplate(emailBodyContent, {
      type: 'default',
      brandName: 'Healing Buds',
      supportEmail: 'support@healingbuds.co.za',
      supabaseUrl,
    });

    // Send email using Resend API via fetch
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getFromAddress('Healing Buds'),
        to: [email.trim()],
        subject: "Thank you for contacting Healing Buds",
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();
    
    if (!resendResponse.ok) {
      console.error(`[Contact Form] Resend API error:`, resendData);
      throw new Error(resendData.message || 'Failed to send email');
    }

    console.log(`[Contact Form] Email sent successfully to ${email}:`, resendData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Your message has been sent successfully. We will get back to you soon.' 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("[Contact Form] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "An unexpected error occurred. Please try again later." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
