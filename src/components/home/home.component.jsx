import { useContext } from 'react'
import { UserContext, CreditContext } from '../../context/user.context';
import { Navigate } from 'react-router-dom';
import SearchUrl from '../search-url/search-url.component';
import './home.styles.scss'

const Home = () => {
  const { currentUser } = useContext(UserContext)
  const { credit } = useContext(CreditContext)

  return (
    <div className='dashboard-container'>
      {currentUser ? (
        <div className='dashboard-container-inner'>
          <h2 className='dashboard-heading'>Welcome, {currentUser.displayName}</h2>
          <h3 className='dashboard-credit'>Credit: {credit || 0}</h3>
          <SearchUrl />
        </div>
      ) : ( 
        credit <= "0"?(
          <Navigate to={"/upgrade"}></Navigate>
        ):(
          <Navigate to={'/'} />
        )
      )}
    </div>
  )
}

export default Home;