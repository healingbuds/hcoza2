/**
 * Healing Buds Branded Email Template
 * 
 * Consistent styling across all transactional emails using brand colors:
 * - Deep Pine: #0F3935 / #11302C
 * - Medical Teal: #2DD4BF / #0D9488
 * - Emerald: #34D399
 */

// Brand colors
export const BRAND_COLORS = {
  deepPine: '#0F3935',
  deepPineDark: '#11302C',
  medicalTeal: '#0D9488',
  medicalTealLight: '#2DD4BF',
  emerald: '#34D399',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F4F4F5',
  gray200: '#E5E7EB',
  gray500: '#71717A',
  gray600: '#5A6B68',
  gray700: '#374151',
  gray900: '#18181B',
  success: '#22C55E',
  successLight: '#F0FDF4',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEF2F2',
};

// Multi-domain configuration for Healing Buds regions
export const DOMAIN_CONFIG: Record<string, {
  domain: string;
  brandName: string;
  supportEmail: string;
  address: string;
  phone: string;
  websiteUrl: string;
}> = {
  'ZA': {
    domain: 'healingbuds.co.za',
    brandName: 'Healing Buds South Africa',
    supportEmail: 'support@healingbuds.co.za',
    address: '123 Sandton Drive, Sandton 2196, South Africa',
    phone: '+27 11 123 4567',
    websiteUrl: 'https://healingbuds.co.za',
  },
  'PT': {
    domain: 'healingbuds.pt',
    brandName: 'Healing Buds Portugal',
    supportEmail: 'suporte@healingbuds.pt',
    address: 'Avenida D. João II, 98 A, 1990-100 Lisboa, Portugal',
    phone: '+351 210 123 456',
    websiteUrl: 'https://healingbuds.pt',
  },
  'TH': {
    domain: 'healingbuds.co.th',
    brandName: 'Healing Buds Thailand',
    supportEmail: 'support@healingbuds.co.th',
    address: 'Bangkok, Thailand',
    phone: '+66 2 123 4567',
    websiteUrl: 'https://healingbuds.co.th',
  },
  'GB': {
    domain: 'healingbuds.co.uk',
    brandName: 'Healing Buds UK',
    supportEmail: 'support@healingbuds.co.uk',
    address: '123 Harley Street, London W1G 6AX, United Kingdom',
    phone: '+44 20 7123 4567',
    websiteUrl: 'https://healingbuds.co.uk',
  },
  'global': {
    domain: 'healingbuds.global',
    brandName: 'Healing Buds',
    supportEmail: 'support@healingbuds.global',
    address: 'Global Medical Cannabis Network',
    phone: '+27 11 123 4567',
    websiteUrl: 'https://healingbuds.global',
  },
};

export function getDomainConfig(region?: string) {
  const regionKey = region?.toUpperCase() || 'global';
  return DOMAIN_CONFIG[regionKey] || DOMAIN_CONFIG['global'];
}

// Verified sender address
export const SENDER_EMAIL = 'noreply@send.healingbuds.co.za';

export function getFromAddress(brandName: string = 'Healing Buds'): string {
  return `${brandName} <${SENDER_EMAIL}>`;
}

interface EmailTemplateOptions {
  /** Email type for header color theming */
  type?: 'success' | 'warning' | 'error' | 'default';
  /** Brand name to display */
  brandName?: string;
  /** Support email */
  supportEmail?: string;
  /** Address line */
  address?: string;
  /** Website URL */
  websiteUrl?: string;
  /** Region code for localization */
  region?: string;
  /** Supabase URL for logo */
  supabaseUrl?: string;
  /** Use white logo on colored header (default: true) */
  useWhiteLogo?: boolean;
  /** Show tagline under logo */
  showTagline?: boolean;
  /** Custom tagline text */
  tagline?: string;
}

/**
 * Generate a branded email wrapper with consistent header, body, and footer
 */
export function brandedEmailTemplate(
  bodyContent: string,
  options: EmailTemplateOptions = {}
): string {
  const {
    type = 'default',
    brandName = 'Healing Buds',
    supportEmail = 'support@healingbuds.co.za',
    address = 'Global Medical Cannabis Network',
    websiteUrl = 'https://healingbuds.co.za',
    supabaseUrl,
    useWhiteLogo = true,
    showTagline = true,
    tagline = 'Medical Cannabis Care',
  } = options;

  // Determine header color based on email type
  const headerColors: Record<string, string> = {
    success: BRAND_COLORS.medicalTeal,
    warning: BRAND_COLORS.warning,
    error: BRAND_COLORS.error,
    default: BRAND_COLORS.deepPine,
  };
  const headerColor = headerColors[type] || headerColors.default;

  // Logo URL - use white on dark header, teal otherwise
  const logoFile = useWhiteLogo ? 'hb-logo-white.png' : 'hb-logo-teal.png';
  const logoUrl = supabaseUrl 
    ? `${supabaseUrl}/storage/v1/object/public/email-assets/${logoFile}`
    : `https://gofxhsxueyanyafymfbi.supabase.co/storage/v1/object/public/email-assets/${logoFile}`;

  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${brandName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .content-padding { padding: 24px 16px !important; }
      .header-padding { padding: 24px 16px !important; }
      .footer-padding { padding: 20px 16px !important; }
      .mobile-center { text-align: center !important; }
      .cta-button { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND_COLORS.gray100};">
  
  <!-- Preheader (hidden preview text) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${brandName} - Medical Cannabis Care
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  
  <!-- Email Container -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${BRAND_COLORS.gray100};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: ${BRAND_COLORS.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with Logo -->
          <tr>
            <td class="header-padding" style="background: linear-gradient(135deg, ${headerColor} 0%, ${BRAND_COLORS.deepPineDark} 100%); padding: 32px 40px; text-align: center;">
              <a href="${websiteUrl}" style="text-decoration: none;">
                <img src="${logoUrl}" alt="${brandName}" width="180" style="display: inline-block; max-width: 180px; height: auto;" />
              </a>
              ${showTagline ? `
              <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0 0; font-size: 14px; letter-spacing: 0.5px;">
                ${tagline}
              </p>
              ` : ''}
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td class="content-padding" style="padding: 40px;">
              ${bodyContent}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="background-color: ${BRAND_COLORS.gray50}; padding: 24px 40px; border-top: 1px solid ${BRAND_COLORS.gray200};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; color: ${BRAND_COLORS.gray500}; font-size: 13px;">
                      ${brandName}
                    </p>
                    <p style="margin: 0 0 8px 0; color: ${BRAND_COLORS.gray500}; font-size: 11px;">
                      ${address}
                    </p>
                    <p style="margin: 0 0 16px 0; color: ${BRAND_COLORS.gray500}; font-size: 12px;">
                      Need help? <a href="mailto:${supportEmail}" style="color: ${BRAND_COLORS.medicalTeal}; text-decoration: none;">${supportEmail}</a>
                    </p>
                    <p style="margin: 0; color: ${BRAND_COLORS.gray500}; font-size: 11px;">
                      © ${currentYear} ${brandName}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim();
}

/**
 * Generate a primary CTA button
 */
export function ctaButton(text: string, href: string, variant: 'primary' | 'secondary' = 'primary'): string {
  const bgColor = variant === 'primary' 
    ? `linear-gradient(135deg, ${BRAND_COLORS.medicalTeal} 0%, ${BRAND_COLORS.deepPine} 100%)`
    : BRAND_COLORS.white;
  const textColor = variant === 'primary' ? BRAND_COLORS.white : BRAND_COLORS.medicalTeal;
  const border = variant === 'secondary' ? `2px solid ${BRAND_COLORS.medicalTeal}` : 'none';

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" style="padding: 24px 0;">
          <a href="${href}" 
             class="cta-button"
             style="display: inline-block; background: ${bgColor}; color: ${textColor}; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; border: ${border}; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Generate a status badge/alert box
 */
export function statusBox(
  content: string, 
  type: 'success' | 'warning' | 'error' | 'info' = 'info',
  icon?: string
): string {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    success: { bg: BRAND_COLORS.successLight, border: BRAND_COLORS.success, text: '#16A34A' },
    warning: { bg: BRAND_COLORS.warningLight, border: BRAND_COLORS.warning, text: '#92400E' },
    error: { bg: BRAND_COLORS.errorLight, border: BRAND_COLORS.error, text: '#DC2626' },
    info: { bg: '#F0FDFA', border: BRAND_COLORS.medicalTeal, text: BRAND_COLORS.medicalTeal },
  };
  const c = colors[type];

  return `
    <div style="background-color: ${c.bg}; border: 1px solid ${c.border}; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="margin: 0; color: ${c.text}; font-size: 18px; font-weight: 600;">
        ${icon ? `${icon} ` : ''}${content}
      </p>
    </div>
  `;
}

/**
 * Generate a section heading
 */
export function sectionHeading(text: string): string {
  return `<h3 style="color: ${BRAND_COLORS.gray900}; font-size: 18px; font-weight: 600; margin: 24px 0 12px 0;">${text}</h3>`;
}

/**
 * Generate paragraph text
 */
export function paragraph(text: string, muted: boolean = false): string {
  const color = muted ? BRAND_COLORS.gray500 : BRAND_COLORS.gray700;
  const size = muted ? '14px' : '16px';
  return `<p style="color: ${color}; font-size: ${size}; line-height: 1.6; margin: 0 0 16px 0;">${text}</p>`;
}

/**
 * Generate an unordered list
 */
export function bulletList(items: string[]): string {
  const listItems = items.map(item => 
    `<li style="margin-bottom: 8px;">${item}</li>`
  ).join('');
  
  return `
    <ul style="color: ${BRAND_COLORS.gray700}; font-size: 16px; line-height: 1.8; margin: 0 0 16px 0; padding-left: 24px;">
      ${listItems}
    </ul>
  `;
}

/**
 * Generate an ordered list
 */
export function numberedList(items: string[]): string {
  const listItems = items.map(item => 
    `<li style="margin-bottom: 8px;">${item}</li>`
  ).join('');
  
  return `
    <ol style="color: ${BRAND_COLORS.gray700}; font-size: 16px; line-height: 1.8; margin: 0 0 16px 0; padding-left: 24px;">
      ${listItems}
    </ol>
  `;
}

/**
 * Generate an info box with left border
 */
export function infoBox(title: string, content: string): string {
  return `
    <div style="background-color: #F0FDFA; border-left: 4px solid ${BRAND_COLORS.medicalTeal}; padding: 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
      <h4 style="color: ${BRAND_COLORS.medicalTeal}; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${title}</h4>
      <div style="color: ${BRAND_COLORS.gray700}; font-size: 14px; line-height: 1.6; margin: 0;">
        ${content}
      </div>
    </div>
  `;
}

/**
 * Generate a signature block
 */
export function signature(name: string = 'The Healing Buds Team', closing: string = 'Best regards'): string {
  return `
    <p style="color: ${BRAND_COLORS.gray500}; font-size: 14px; margin: 32px 0 0 0;">
      ${closing},<br>
      <strong style="color: ${BRAND_COLORS.gray700};">${name}</strong>
    </p>
  `;
}
