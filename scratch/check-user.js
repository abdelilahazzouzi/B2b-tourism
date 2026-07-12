const supabaseUrl = 'https://kksihigbfmnudvzeikmi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrc2loaWdiZm1udWR2emVpa21pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDU1NzY0NiwiZXhwIjoyMDk2MTMzNjQ2fQ.kYOT-IXW-BRULY6_49hQaaeq7eOlDeNIwUtoFTahQq0';

async function run() {
  console.log("Checking Supabase Users via Fetch API...\n");
  
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Auth API error (${response.status}):`, errText);
      return;
    }

    const data = await response.json();
    const users = data.users || [];
    console.log(`Found ${users.length} users in Auth:`);
    users.forEach(u => {
      console.log(`- Email: ${u.email}, ID: ${u.id}, Confirmed: ${!!u.email_confirmed_at}`);
    });

    console.log("\nChecking Profiles Table via Postgrest...\n");
    
    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!dbResponse.ok) {
      const errText = await dbResponse.text();
      console.error(`Database API error (${dbResponse.status}):`, errText);
      return;
    }

    const profiles = await dbResponse.json();
    console.log(`Found ${profiles.length} records in Profiles table:`);
    profiles.forEach(p => {
      console.log(`- ID: ${p.id}, Name: ${p.full_name}, Role: ${p.role}`);
    });

  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

run();
