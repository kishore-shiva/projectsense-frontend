import { createContext, useState, useEffect, useContext } from 'react'
import { onAuthStateChangeListener, checkSubscription } from '../utils/firebase/firebase.utils'

export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null
})

export const CreditContext = createContext({
  credit: 0,
  setCredit: () => null
})

export const SubscriptionContext = createContext({
  isSubscribed: null,
  setSubscription: () => null
})

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChangeListener((user) => {
      if (user !== currentUser) {
        setCurrentUser(user);
      }
    });
    return unsubscribe;
  }, [currentUser]);

  const value = { currentUser, setCurrentUser }
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const CreditProvider = ({ children }) => {
  const [credit, setCredit] = useState(null);
  const { currentUser } = useContext(UserContext);

  const fetchData = async () => {
    if (currentUser && currentUser.uid) {
      try {
        const response = await fetch('http://localhost:5500/check-credit?userId=' + currentUser?.uid, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
        });
        const data = await response.json();
        setCredit(data.user_credit);
      } catch (error) {
        console.error('Error fetching credit:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const creditContextValue = { credit, setCredit };

  return <CreditContext.Provider value={creditContextValue}>{children}</CreditContext.Provider>;
};



export const SubscriptionProvider = ({ children }) => {

  const {currentUser}= useContext(UserContext)
  const [isSubscribed, setSubscription] = useState(false)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (currentUser) {
        const res = await checkSubscription(currentUser.uid);
        setSubscription(res);
      }
    };

    fetchSubscription();
  }, [currentUser]);
  

  const value = { isSubscribed, setSubscription }
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>

}
