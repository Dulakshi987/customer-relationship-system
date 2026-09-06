/**
 * Automated API test script for the Revotec form management system.
 *
 * Requirements: Node.js 18+ (has built-in fetch). No extra packages needed.
 * Usage:
 *   1. Make sure your backend server is running (e.g. npm run dev on port 5000)
 *   2. In VS Code's integrated terminal, run:  node test-api.js
 *
 * The script registers a fresh customer, logs in as customer and admin,
 * submits a form, and exercises the admin CRUD + filter/search endpoints.
 * Each step prints PASS or FAIL with the response status and message.
 */

const BASE_URL = 'http://localhost:5000/api';

// A random email each run avoids "already registered" failures on re-run.
const runId = Date.now();
const customer = { email: `customer_${runId}@test.com`, password: '1234', confirmPassword: '1234' };

// Change these to a real admin account that already exists in your database.
const admin = { email: 'admin@test.com', password: 'Admin1234' };

let customerToken = '';
let adminToken = '';
let createdSubmissionId = null;

let passCount = 0;
let failCount = 0;

function log(label, ok, extra) {
  const icon = ok ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} — ${label}${extra ? '  ' + extra : ''}`);
  ok ? passCount++ : failCount++;
}

async function request(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (_) { /* no body */ }
  return { status: res.status, data };
}

async function run() {
  console.log(`\nRunning API tests against ${BASE_URL}\n`);

  // 1. Register customer
  {
    const { status, data } = await request('POST', '/auth/register', customer);
    log('Register customer', status === 201, `(status ${status}: ${data?.message})`);
  }

  // 2. Reject duplicate registration
  {
    const { status, data } = await request('POST', '/auth/register', customer);
    log('Reject duplicate email on register', status === 409, `(status ${status}: ${data?.message})`);
  }

  // 3. Customer login
  {
    const { status, data } = await request('POST', '/auth/login', {
      email: customer.email,
      password: customer.password,
    });
    log('Customer login', status === 200 && !!data?.accessToken, `(status ${status})`);
    if (data?.accessToken) customerToken = data.accessToken;
  }

  // 4. Reject wrong password
  {
    const { status } = await request('POST', '/auth/login', {
      email: customer.email,
      password: 'wrongpass',
    });
    log('Reject wrong password on login', status === 401, `(status ${status})`);
  }

  // 5. Submit a form as customer
  {
    const { status, data } = await request('POST', '/submissions', {
      firstName: 'Dulakshi',
      lastName: 'Ekshani',
      email: `dulakshi_${runId}@test.com`,
      gender: 'FEMALE',
      mobileNumber: '0771234567',
      address: 'Colombo, Sri Lanka',
      feedback: 'Automated test submission',
    }, customerToken);
    log('Submit form as customer', status === 201 || status === 200, `(status ${status}: ${data?.message || ''})`);
    createdSubmissionId = data?.submission?.id || data?.id || null;
  }

  // 6. Reject submission without token
  {
    const { status } = await request('POST', '/submissions', {
      firstName: 'No', lastName: 'Auth', email: 'noauth@test.com',
      gender: 'MALE', mobileNumber: '0770000000', address: 'x',
    });
    log('Reject form submission without token', status === 401, `(status ${status})`);
  }

  // 7. Admin login
  {
    const { status, data } = await request('POST', '/auth/admin/login', admin);
    log('Admin login', status === 200 && !!data?.accessToken, `(status ${status}: ${data?.message || ''})`);
    if (data?.accessToken) adminToken = data.accessToken;
    if (status !== 200) {
      console.log('   ⚠️  Update the "admin" email/password constants in this script to match a real admin account.');
    }
  }

  if (adminToken) {
    // 8. Get all submissions
    {
      const { status, data } = await request('GET', '/submissions', null, adminToken);
      log('Get all submissions (admin)', status === 200, `(status ${status}, count: ${data?.submissions?.length ?? 'n/a'})`);
      if (!createdSubmissionId && data?.submissions?.length) {
        createdSubmissionId = data.submissions[data.submissions.length - 1].id;
      }
    }

    // 9. Filter by gender
    {
      const { status, data } = await request('GET', '/submissions?gender=FEMALE', null, adminToken);
      log('Filter submissions by gender', status === 200, `(status ${status}, count: ${data?.submissions?.length ?? 'n/a'})`);
    }

    // 10. Search by name
    {
      const { status, data } = await request('GET', '/submissions?search=dulakshi', null, adminToken);
      log('Search submissions by name', status === 200, `(status ${status}, count: ${data?.submissions?.length ?? 'n/a'})`);
    }

    // 11. Reject customer trying to access admin route
    {
      const { status } = await request('GET', '/submissions', null, customerToken);
      log('Reject customer on admin-only route', status === 403 || status === 401, `(status ${status})`);
    }

    if (createdSubmissionId) {
      // 12. Update submission
      {
        const { status, data } = await request('PUT', `/submissions/${createdSubmissionId}`, {
          firstName: 'Dulakshi',
          lastName: 'Ekshani',
          email: `dulakshi_${runId}@test.com`,
          gender: 'FEMALE',
          mobileNumber: '0771234567',
          address: 'Updated address',
          feedback: 'Updated via automated test',
        }, adminToken);
        log('Update submission (admin)', status === 200, `(status ${status}: ${data?.message || ''})`);
      }

      // 13. Delete submission
      {
        const { status, data } = await request('DELETE', `/submissions/${createdSubmissionId}`, null, adminToken);
        log('Delete submission (admin)', status === 200, `(status ${status}: ${data?.message || ''})`);
      }
    } else {
      console.log('   ⚠️  Skipped update/delete tests — could not determine a submission ID.');
    }
  } else {
    console.log('   ⚠️  Skipped all admin-only tests because admin login failed.');
  }

  console.log(`\nDone. ${passCount} passed, ${failCount} failed.\n`);
}

run().catch((err) => {
  console.error('Test run crashed:', err.message);
  console.error('Is your backend server running on', BASE_URL, '?');
});
