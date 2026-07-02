const axios = require('axios');

async function verify() {
  const baseURL = 'http://localhost:3000';
  let adminToken = '';
  let driverToken = '';
  
  console.log('--- STARTING VERIFICATION ---');
  
  try {
    // 1. Auth Login (Admin & Driver)
    const adminRes = await axios.post(`${baseURL}/auth/login`, { email: 'admin@test.com', password: 'password123' });
    adminToken = adminRes.data.access_token;
    console.log('✅ Admin login successful');

    const driverRes = await axios.post(`${baseURL}/auth/login`, { email: 'driver@test.com', password: 'password123' });
    driverToken = driverRes.data.access_token;
    console.log('✅ Driver login successful');

    // 2. Admin can access all trips
    const adminTrips = await axios.get(`${baseURL}/trips`, { headers: { Authorization: `Bearer ${adminToken}` } });
    if (adminTrips.data.length !== 10) throw new Error('Admin did not get 10 trips');
    console.log('✅ Admin accesses all trips');

    // 3. Driver can only access assigned trips
    const driverTrips = await axios.get(`${baseURL}/trips`, { headers: { Authorization: `Bearer ${driverToken}` } });
    if (driverTrips.data.length !== 10) throw new Error('Driver did not get 10 trips'); // In seed, all 10 are assigned to driver 2
    console.log('✅ Driver accesses assigned trips');

    // 4. Driver cannot create, edit (other fields), or delete trips
    try {
      await axios.post(`${baseURL}/trips`, { vehicleNumber: 'V-1111', origin: 'A', destination: 'B', scheduledStart: new Date(), driverId: 2 }, { headers: { Authorization: `Bearer ${driverToken}` } });
      throw new Error('Driver should not be able to create trip');
    } catch (err) {
      if (err.response.status === 403) console.log('✅ Driver forbidden from creating trips (403)');
      else throw err;
    }

    try {
      await axios.delete(`${baseURL}/trips/1`, { headers: { Authorization: `Bearer ${driverToken}` } });
      throw new Error('Driver should not be able to delete trip');
    } catch (err) {
      if (err.response.status === 403) console.log('✅ Driver forbidden from deleting trips (403)');
      else throw err;
    }
    
    try {
      await axios.patch(`${baseURL}/trips/1`, { vehicleNumber: 'V-CHANGED' }, { headers: { Authorization: `Bearer ${driverToken}` } });
      throw new Error('Driver should not be able to edit non-status fields');
    } catch (err) {
      if (err.response.status === 403) console.log('✅ Driver forbidden from editing non-status fields (403)');
      else throw err;
    }

    // 5. Driver can only update trip status
    const updateRes = await axios.patch(`${baseURL}/trips/1`, { status: 'COMPLETED' }, { headers: { Authorization: `Bearer ${driverToken}` } });
    if (updateRes.data.status !== 'COMPLETED') throw new Error('Status not updated');
    console.log('✅ Driver successfully updated trip status');

    // 6. TripHistory records every status change correctly
    const historyRes = await axios.get(`${baseURL}/history/1`, { headers: { Authorization: `Bearer ${adminToken}` } });
    if (!historyRes.data.some(h => h.newStatus === 'COMPLETED')) throw new Error('History record not found');
    console.log('✅ TripHistory recorded status change');

    // 7. Invalid JWT returns 401
    try {
      await axios.get(`${baseURL}/trips`, { headers: { Authorization: `Bearer invalidtoken` } });
      throw new Error('Should have thrown 401');
    } catch (err) {
      if (err.response.status === 401) console.log('✅ Invalid JWT returns 401');
      else throw err;
    }

    // 8. DTO validation returns 400 for invalid requests
    try {
      await axios.post(`${baseURL}/trips`, { vehicleNumber: 'V-1111' }, { headers: { Authorization: `Bearer ${adminToken}` } });
      throw new Error('Should have thrown 400 due to missing fields');
    } catch (err) {
      if (err.response.status === 400) console.log('✅ DTO validation returns 400 for invalid requests');
      else throw err;
    }

    console.log('--- ALL TESTS PASSED SUCCESSFULLY ---');

  } catch (error) {
    console.error('❌ TEST FAILED:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

verify();
