const supabaseUrl = 'https://kksihigbfmnudvzeikmi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrc2loaWdiZm1udWR2emVpa21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTc2NDYsImV4cCI6MjA5NjEzMzY0Nn0.4Va3BHGICor-K_UuGWN2px10wZdphZ1-GGhQhrfcI_8';

async function run() {
  console.log("Testing signInWithOtp via Fetch API...\n");
  
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/otp`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'abdelilah.me@hotmail.com',
        create_user: false,
        gotrue_meta_security: {}
      })
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response data:", data);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

run();
