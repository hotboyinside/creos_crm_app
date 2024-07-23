import './HomeContent.css'

import { useEffect, useState } from 'react';


import { IComment } from '../../models/models';
import { Service } from '../../service/service';
import Comment from '../Comment/Comment';

function HomeContent() {

  const service = Service.getInstance();
  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    async function fetchComments() {
      const commentsData = await service.getLastComments();
      setComments(commentsData);
    }

    fetchComments();
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
                          {comments.map(comment => (
                            <Comment key={comment.id} {...comment} />
                          ))}
                        </ul>
                    </div>
                    <div className="home__designers designers">
                        <h2 className="designers__title sub-title">Наши успешняшки!</h2>
                        <table>
                          <thead>
                            <tr>
                              <th scope="col">Person</th>
                              <th scope="col">Most interest in</th>
                              <th scope="col">Age</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th scope="row">Chris</th>
                              <td>HTML tables</td>
                              <td>22</td>
                            </tr>
                            <tr>
                              <th scope="row">Dennis</th>
                              <td>Web accessibility</td>
                              <td>45</td>
                            </tr>
                            <tr>
                              <th scope="row">Sarah</th>
                              <td>JavaScript frameworks</td>
                              <td>29</td>
                            </tr>
                            <tr>
                              <th scope="row">Karen</th>
                              <td>Web performance</td>
                              <td>36</td>
                            </tr>
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