import './HomeContent.css'

import { Service } from '../../service/service';
import Comment from '../Comment/Comment';

function HomeContent() {

  const service = Service.getInstance();

  const comments = service.getLastComments();
  const topDesigners = service.getDesigners(false);


  return (
    <>
      <main className='main'>
        <section className='home'>
            <div className="container home__container">
                <h1 className='home__title'>Кто не работает, тот не ест!</h1>
                <div className="home__content">
                    <div className="home__comments comments">
                        <h2 className="comments__title sub-title">Последние комментарии</h2>
                        {/* <ul className="comments__items list-reset">
                            
                        </ul> */}
                    </div>
                    <div className="home__designers designers">
                        <h2 className="designers__title sub-title">Наши успешняшки!</h2>
                    </div>
                </div>
            </div>
        </section>
      </main>
    </>
  )
}

export default HomeContent