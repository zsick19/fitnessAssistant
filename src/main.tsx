import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { keycloak, initOptions } from './auth/keyCloak.ts';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Provider } from 'react-redux';
import { store } from './AppRedux/store.ts';


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </BrowserRouter>
    </ReactKeycloakProvider>
  </Provider>
)
