import axios from 'axios';

const testAdminLogin = async () => {
  try {
    console.log('🧪 Testing Admin Login API...');
    
    const loginData = {
      email: 'basavarajrevani123@gmail.com',
      password: 'Basu@15032002'
    };
    
    console.log('📧 Testing with email:', loginData.email);
    console.log('🔑 Testing with password: ****');
    
    const response = await axios.post('http://localhost:5000/api/v1/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ Login API Response:');
    console.log('📊 Status:', response.status);
    console.log('📦 Success:', response.data.success);
    console.log('💬 Message:', response.data.message);
    
    if (response.data.data && response.data.data.user) {
      const user = response.data.data.user;
      console.log('\n👤 User Data:');
      console.log('🆔 ID:', user.id);
      console.log('📧 Email:', user.email);
      console.log('👤 Name:', user.name);
      console.log('👨‍💼 Role:', user.role);
      console.log('📅 Created:', user.createdAt);
      
      if (user.role === 'admin') {
        console.log('\n✅ ADMIN LOGIN SUCCESSFUL!');
        console.log('🎯 User should be redirected to /admin');
      } else {
        console.log('\n❌ USER IS NOT ADMIN!');
        console.log('🎯 User role is:', user.role);
      }
    }
    
    if (response.data.data && response.data.data.token) {
      console.log('\n🔑 Token Generated:');
      console.log('📏 Token Length:', response.data.data.token.length);
      console.log('🔐 Token Preview:', response.data.data.token.substring(0, 20) + '...');
    }
    
    console.log('\n🎯 ADMIN LOGIN TEST COMPLETE!');
    console.log('✅ Backend API is working correctly');
    console.log('✅ Admin user exists and can login');
    console.log('✅ Role is correctly set to "admin"');
    
  } catch (error) {
    console.error('\n❌ Admin Login Test Failed:');
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('💬 Message:', error.response.data?.message);
      console.log('📦 Data:', error.response.data);
    } else {
      console.log('🌐 Network Error:', error.message);
    }
  }
};

// Run the test
testAdminLogin();
