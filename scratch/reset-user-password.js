const supabaseUrl = 'https://kksihigbfmnudvzeikmi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrc2loaWdiZm1udWR2emVpa21pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU1NzY0NiwiZXhwIjoyMDk2MTMzNjQ2fQ.kYOT-IXW-BRULY6_49hQaaeq7eOlDeNIwUtoFTahQq0';

async function run() {
  console.log("Setting Admin Password to temporary password...\n");

  const userId = '1e6c3e8c-2f76-4625-9a62-7cf98ea47459';
  const tempPassword = 'Kasbarah2026!';

  try {
    // Update user password using admin API
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: tempPassword,
        email_confirm: true // Force confirm email in case it was somehow unconfirmed
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to update password:", errText);
      return;
    }

    const data = await response.json();
    console.log("✓ Successfully updated password and confirmed email for:", data.email);
    console.log(`\nTemporary Password set to: ${tempPassword}`);
    console.log("You can now sign in at http://localhost:3000/login using this password!");

  } catch (err) {
    console.error("Failed to execute password reset:", err);
  }
}

run();
