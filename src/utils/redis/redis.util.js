export const decreaseCreditByOne = async (currentUser) => {
  try {

      const decreaseResponse = await fetch("http://localhost:5500/decrease-credit?userId=" + currentUser.uid);
      
      if (decreaseResponse.ok) {
          const data = await decreaseResponse.json();
          if(data){
            return data;
          }
      } else {
          console.log("Decrease credit failed");
      }
  } catch (error) {
      console.error(error.message);
  }
};