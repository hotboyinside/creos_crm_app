import './Home.css'

import { Service } from '../../service/service';

import Header from '../../components/Header/Header'
import HomeContent from '../../components/HomeContent/HomeContent';

function Home() {

  const service = Service.getInstance();

  const comments = service.getLastComments();
  const topDesigners = service.getDesigners(false);
  console.log(topDesigners.then(data => console.log(data)))


  
  return (
    <>
      <Header />
      <HomeContent />
    </>
  )
}

export default Home