import React, { createContext, useState } from 'react';

export const AuthMenuContext = createContext();

const AuthMenuProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const updateMenu = (authenticated) => {
    setAuthenticated(authenticated);
  };

  return (
    <AuthMenuContext.Provider value={{ isAuthenticated, updateMenu }}>
      {children}
    </AuthMenuContext.Provider>
  );
};

export default AuthMenuProvider;
