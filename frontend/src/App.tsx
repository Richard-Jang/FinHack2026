import { useEffect, useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootRoute } from './Route';
import { AuthProvider } from './AuthContext';

const App = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  // fetch link_token from Python backend when app loads
  const generateToken = async () => {
    const response = await fetch('http://localhost:8000/api/create_link_token', {
      method: 'POST',
    });
    const data = await response.json();
    setLinkToken(data.link_token);
  };

  useEffect(() => {
    generateToken();
  }, []);

  // define successful user login parameters.
  const onSuccess = useCallback((public_token: string, metadata: any) => {
    console.log('Success! Public Token:', public_token);
    // later, we'll send this public_token to backend to get access_token
  }, []);

  const config: any = {
    token: linkToken,
    onSuccess,
  };

  // const { open, ready } = usePlaidLink(config);

  const router = createBrowserRouter([RootRoute], {});
    

  return (
    // <div style={{ textAlign: 'center', marginTop: '50px' }}>
    //   <h1>WalletWatch</h1>
    //   <button 
    //     onClick={() => open()} 
    //     disabled={!ready}
    //     style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
    //   >
    //     Connect a Bank Account
    //   </button>
    // </div>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;