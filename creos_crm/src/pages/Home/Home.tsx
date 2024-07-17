import './Home.css'

import { Transport } from '../../transport/transport'
import { Service } from '../../service/service';
import { IIssue, IDesignerKPI } from '../../models/models';

import Header from '../../components/Header/Header'

function Home() {

  const service = Service.getInstance();

  console.log(service.getLastComments())
  console.log(service.getDesignersByTime())

  // ищем наиболее успешных дизайнеров по медиане



  
  return (
    <>
      <Header />
      <main className='main'>

      </main>
    </>
  )
}

export default Home