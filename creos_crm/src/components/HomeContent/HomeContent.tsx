import './HomeContent.css'

import { useEffect, useState } from 'react';


import { IComment, IDesignerKPI } from '../../models/models';
import { Service } from '../../service/service';
import Comment from '../Comment/Comment';
import DesignersKPIRow from '../DesignerKPIRow/DesignerKPIRow';

function HomeContent() {

  const service = Service.getInstance();
  const [comments, setComments] = useState<IComment[]>([]);
  const [designersKPI, setdesignersKPI] = useState<IDesignerKPI[]>([]);

  useEffect(() => {
    async function fetchComments() {
      const commentsData = await service.getLastComments();
      setComments(commentsData);
    }

    fetchComments();
  }, []);

  useEffect(() => {
    async function fetchDesignersKPI() {
      const designersKPIData = await service.getDesignersKPI();
      setdesignersKPI(designersKPIData);
    }

    fetchDesignersKPI();
  }, []);

  return (
    <>
      <main className='main'>
        <section className='home'>
            <div className="container home__container">
                <h1 className='home__title'>Кто не работает, тот не ест!</h1>
                <div className="home__content">
                    <div className="home__comments comments">
                        <h2 className="comments__title sub-title">Последние комментарии</h2>
                        <ul className='comments__items list-reset'>
                          {comments.map(comment => 
                            <Comment key={comment.id} {...comment} />
                          )}
                        </ul>
                    </div>
                    <div className="home__designers designers">
                        <h2 className="designers__title sub-title">Наши успешняшки!</h2>
                        <table>
                          <thead>
                            <tr>
                              <th scope="col">Аватар</th>
                              <th scope="col">Имя</th>
                              <th scope="col">Медианное время работы</th>
                              <th scope="col">Количество выпоненных задач</th>
                            </tr>
                          </thead>
                          <tbody>
                            {designersKPI.map(designerKPI => 
                              <DesignersKPIRow key={designerKPI.designer} {...designerKPI} />
                            )}
                          </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
      </main>
    </>
  )
}

export default HomeContent