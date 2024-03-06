import { Routes, Route } from 'react-router-dom'
import './App.css'
import SignIn from './components/sign-in/sign-in.component'
import StripePayment from './components/stripe-payment/stripe-payment.component';
import Home from './components/home/home.component';
import { CreditProvider, SubscriptionProvider } from './context/user.context';
import Upgrade from './components/upgrade/upgrade.component';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} ></Route>
      <Route path='/subscribe' element={<SubscriptionProvider><StripePayment /></SubscriptionProvider>}></Route>
      <Route path='/home' element={
        <CreditProvider><Home /></CreditProvider>
      }></Route>
      <Route path='/upgrade' element={<SubscriptionProvider><Upgrade/></SubscriptionProvider>}></Route>
    </Routes>
  );
};

export default App;
