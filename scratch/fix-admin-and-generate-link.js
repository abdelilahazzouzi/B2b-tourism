const supabaseUrl = 'https://kksihigbfmnudvzeikmi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrc2loaWdiZm1udWR2emVpa21pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU1NzY0NiwiZXhwIjoyMDk2MTMzNjQ2fQ.kYOT-IXW-BRULY6_49hQaaeq7eOlDeNIwUtoFTahQq0';

async function run() {
  console.log("Fixing Admin Profile and Generating Instant Login Link...\n");

  const userId = '1e6c3e8c-2f76-4625-9a62-7cf98ea47459';
  const email = 'abdelilah.me@hotmail.com';

  try {
    // 1. Ensure profile exists and is admin
    console.log(`Upserting profile for ${email} (${userId}) as admin...`);
    const upsertResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: userId,
        full_name: 'Admin User',
        role: 'admin'
      })
    });

    if (!upsertResponse.ok) {
      const errText = await upsertResponse.text();
      console.error("Failed to upsert profile:", errText);
    } else {
      console.log("✓ Profile record upserted successfully in profiles table.");
    }

    // 2. Generate magic link via admin API
    console.log(`Generating magic link via Admin API...`);
    const linkResponse = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: 'http://localhost:3000/auth/confirm'
        }
      })
    });

    if (!linkResponse.ok) {
      const errText = await linkResponse.text();
      console.error("Failed to generate link:", errText);
      return;
    }

    const linkData = await linkResponse.json();
    
    // In GoTrue response, the verification URL is in linkData.action_link
    const actionLink = linkData.action_link;
    
    if (actionLink) {
      console.log("\n==================================================");
      console.log("SUCCESS! Copy and paste this link in your browser to log in instantly:");
      console.log(actionLink);
      console.log("==================================================\n");
    } else {
      console.log("GoTrue response:", linkData);
    }

  } catch (err) {
    console.error("Execution failed:", err);
  }
}

run();
