import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CCloseButton, CSidebar, CSidebarBrand, CSidebarFooter, CSidebarHeader, CSidebarToggler } from '@coreui/react';
import { AppSidebarNav } from './AppSidebarNav';
import userNavigation from '../_userNav'; // Navigation for regular users
import adminNavigation from '../_adminNav'; // Navigation for admins

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  
  const [navigation, setNavigation] = useState(adminNavigation); // Default to admin

  // Check localStorage and update navigation based on user type
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // Change 'user' to whatever key you are using
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'User') {
        setNavigation(userNavigation); // Set navigation for regular users
      } else {
        setNavigation(adminNavigation); // Set navigation for admin
      }
    }
  }, []);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" style={{ margin: 'auto', textDecoration: 'none' }}>
          <h4>ZeroThreat</h4>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
