// Operator alerts: a direct GHL SMS to Andrew's "Internal Alerts" contact.
// Used where a failure happens before or outside any n8n workflow running
// (so n8n's own error workflow can't see it) -- e.g. lead-intake can't reach
// n8n at all, or the render route fails.
//
// ALERT_CONTACT_ID must match the contact n8n Workflow 5 texts. The render
// route used to hard-code a different, long-deleted contact id here, which
// meant every "render failed" / "render email failed" alert silently 400'd.

export const ALERT_CONTACT_ID = 'vKJiakihiqLs3DXR6kfe';

// Returns whether GHL accepted the message; never throws.
export async function alertAndrew(message: string): Promise<boolean> {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) {
    console.warn('[alerts] GHL_API_KEY not set — could not send alert:', message);
    return false;
  }
  try {
    const res = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contactId: ALERT_CONTACT_ID, type: 'SMS', message }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error('[alerts] alertAndrew got non-OK response:', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[alerts] alertAndrew failed:', err);
    return false;
  }
}
