import './Home.css'

import { Transport } from '../../transport/transport'
import { IComment, IIssue, IDesignerKPI } from '../../models/models';

import Header from '../../components/Header/Header'

function Home() {

  const trans = Transport.getInstance();
  const response1: Promise<IComment[]> = trans.getData();
  response1.then(data => {console.log(data)});

  // ищем наиболее успешных дизайнеров по медиане
  const response2: Promise<IIssue[]> = trans.getData('issue/');
  const issues = response2.then(data => {return data.filter((value) => {return value.status === 'Done'})});

  const checkDesignerExist = (designersInformation: IDesignerKPI[], designerName: string): number | undefined => {
    if (designersInformation.map((designerData, index) => {
      if (designerData.designer === designerName) { return index }
    }))
    return undefined
  }

  let designersKPI: IDesignerKPI[] = []
  issues.then(data => data.forEach((issueInfo) => {
    const existAnswer = checkDesignerExist(designersKPI, issueInfo.designer)
    if (existAnswer === undefined) {
      designersKPI.push({
        designer: issueInfo.designer,
        workTime: (new Date(issueInfo.date_finished_by_designer).getTime() - new Date(issueInfo.date_started_by_designer).getTime()) / 1000,
        countWorks: 1
      })
    } else {
      designersKPI[existAnswer].workTime += (new Date(issueInfo.date_finished_by_designer).getTime() - new Date(issueInfo.date_started_by_designer).getTime()) / 1000;
      designersKPI[existAnswer].countWorks += 1;
    }
  }));
  console.log(designersKPI)
  return (
    <>
      <Header />
      <main className='main'>

      </main>
    </>
  )
}

export default Home